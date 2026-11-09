/**
 * Analytics ingest. The collector edge function (api/collect.ts) forwards
 * each tracker request to POST /ingest/events (convex/http.ts), which calls
 * `track` below.
 *
 * Privacy: we never store an IP address or a cookie. A visitor is
 * hash(today's salt, site, IP, user agent); the salt changes every day and the
 * old one is deleted, so a visitor can't be followed from one day to the next
 * and the hash can't be turned back into an IP.
 */
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { internalMutation, type MutationCtx } from "./_generated/server";
import { randomToken, sha256Hex } from "./lib/crypto";
import { dayKey } from "./lib/dates";
import { hostAllowed, hostFromOrigin, ownHosts } from "./lib/domains";
import { cleanCity, resolveCountry } from "./lib/geo";
import { MAX_ENGAGED_MS, MAX_PAGES_PER_SESSION, SESSION_GAP_MS } from "./lib/ingest";
import { cleanPath, isExcluded, readCampaign } from "./lib/paths";
import { classifyVisit } from "./lib/referrer";
import { isBot, parseUserAgent } from "./lib/ua";
import { rateLimiter } from "./rateLimits";

export const metaValidator = v.object({
  siteKey: v.string(),
  origin: v.optional(v.string()),
  ip: v.optional(v.string()),
  ua: v.string(),
  country: v.optional(v.string()),
  region: v.optional(v.string()),
  city: v.optional(v.string()),
});

export const eventValidator = v.union(
  v.object({
    t: v.literal("pv"),
    id: v.string(),
    p: v.string(),
    q: v.optional(v.string()),
    r: v.optional(v.string()),
    tz: v.optional(v.string()),
    l: v.optional(v.string()),
    w: v.optional(v.number()),
  }),
  v.object({ t: v.literal("eng"), id: v.string(), ms: v.number(), sc: v.number() }),
  v.object({ t: v.literal("ev"), n: v.string(), p: v.optional(v.string()), props: v.optional(v.record(v.string(), v.string())) }),
);

/** Today's salt (UTC day), created on first use. */
export async function todaysSalt(ctx: MutationCtx, now: number): Promise<string> {
  const day = new Date(now).toISOString().slice(0, 10);
  const existing = await ctx.db.query("dailySalts").withIndex("by_day", (q) => q.eq("day", day)).first();
  if (existing) return existing.salt;
  const salt = randomToken(32);
  await ctx.db.insert("dailySalts", { day, salt });
  return salt;
}

export async function visitorHash(ctx: MutationCtx, site: Doc<"sites">, ip: string | undefined, ua: string, now: number) {
  const salt = await todaysSalt(ctx, now);
  return (await sha256Hex(`${salt}|${site._id}|${ip ?? "-"}|${ua}`)).slice(0, 32);
}

/**
 * Rate-limit key for one IP on one site: the same daily salt, but without the
 * user agent, so rotating user agents doesn't get around it. The IP itself
 * is never stored, only this hash (which changes daily).
 */
export async function ipKey(ctx: MutationCtx, site: Doc<"sites">, ip: string | undefined, now: number): Promise<string | null> {
  if (!ip) return null;
  const salt = await todaysSalt(ctx, now);
  return `${site._id}:${(await sha256Hex(`${salt}|ip|${ip}`)).slice(0, 32)}`;
}

/** The visitor's session if they were active in the last 30 minutes. */
export async function activeSession(ctx: MutationCtx, siteId: Id<"sites">, hash: string, now: number) {
  return await ctx.db
    .query("sessions")
    .withIndex("by_site_and_visitor_and_lastSeen", (q) =>
      q.eq("siteId", siteId).eq("visitorHash", hash).gt("lastSeenAt", now - SESSION_GAP_MS),
    )
    .order("desc")
    .first();
}

export type SiteCheck = { ok: true; site: Doc<"sites"> } | { ok: false; status: number; reason: string };

/** Find the site for a key and check the request is allowed to report for it. */
export async function checkSite(ctx: MutationCtx, siteKey: string, origin: string | undefined): Promise<SiteCheck> {
  const site = await ctx.db.query("sites").withIndex("by_public_key", (q) => q.eq("publicKey", siteKey)).unique();
  if (!site) return { ok: false, status: 404, reason: "unknown site" };
  // Browsers always send Origin on these requests. A missing one means a
  // script; a wrong one means someone else's site using this key.
  if (!hostAllowed(hostFromOrigin(origin), site.domains, site.allowLocalhost)) {
    return { ok: false, status: 403, reason: "origin not allowed" };
  }
  return { ok: true, site };
}

/** Record a batch of tracker events. Returns how many were kept. */
export const track = internalMutation({
  args: { meta: metaValidator, events: v.array(eventValidator) },
  returns: v.object({ accepted: v.number(), status: v.number(), reason: v.optional(v.string()) }),
  handler: async (ctx, { meta, events }) => {
    if (events.length === 0) return { accepted: 0, status: 204 };
    if (isBot(meta.ua)) return { accepted: 0, status: 202, reason: "bot" };

    const check = await checkSite(ctx, meta.siteKey, meta.origin);
    if (!check.ok) return { accepted: 0, status: check.status, reason: check.reason };
    const site = check.site;
    if (!site.trackingEnabled) return { accepted: 0, status: 202, reason: "tracking off" };

    const now = Date.now();
    const perIp = await ipKey(ctx, site, meta.ip, now);
    if (perIp && !(await rateLimiter.limit(ctx, "ingestIp", { key: perIp, count: events.length })).ok) {
      return { accepted: 0, status: 429, reason: "rate limited" };
    }
    const limit = await rateLimiter.limit(ctx, "ingestSite", { key: site._id, count: events.length });
    if (!limit.ok) return { accepted: 0, status: 429, reason: "rate limited" };

    const hash = await visitorHash(ctx, site, meta.ip, meta.ua, now);
    let session = await activeSession(ctx, site._id, hash, now);
    let accepted = 0;

    for (const e of events) {
      if (e.t === "pv") {
        const path = cleanPath(e.p);
        if (isExcluded(path, site.excludePaths)) continue;
        const { utm, clickIds } = readCampaign(e.q);
        // A new campaign starts a new session, like GA does.
        const newCampaign = session && utm.source && utm.source !== session.utmSource;
        if (!session || newCampaign) {
          const visit = classifyVisit(e.r, utm, ownHosts(site.domains), clickIds);
          const ua = parseUserAgent(meta.ua);
          const id = await ctx.db.insert("sessions", {
            siteId: site._id,
            visitorHash: hash,
            day: dayKey(now, site.timezone),
            startedAt: now,
            lastSeenAt: now,
            entryPath: path,
            exitPath: path,
            pageviews: 1,
            engagedMs: 0,
            maxScroll: 0,
            events: 0,
            eventNames: [],
            pages: [{ id: e.id, path, at: now, ms: 0, sc: 0 }],
            channel: visit.channel,
            source: visit.source,
            referrerHost: visit.referrerHost,
            utmSource: utm.source,
            utmMedium: utm.medium,
            utmCampaign: utm.campaign,
            utmTerm: utm.term,
            utmContent: utm.content,
            country: resolveCountry(meta.country, e.tz),
            region: meta.region,
            city: cleanCity(meta.city),
            device: ua.device,
            browser: ua.browser,
            os: ua.os,
            language: e.l?.slice(0, 10),
            converted: false,
          });
          session = await ctx.db.get("sessions", id);
        } else {
          // The same pageview id twice (a retried beacon) is one view.
          if (session.pages.some((p) => p.id === e.id)) continue;
          const pages =
            session.pages.length < MAX_PAGES_PER_SESSION
              ? [...session.pages, { id: e.id, path, at: now, ms: 0, sc: 0 }]
              : session.pages;
          await ctx.db.patch("sessions", session._id, {
            pages,
            pageviews: session.pageviews + 1,
            exitPath: path,
            lastSeenAt: now,
          });
          session = { ...session, pages, pageviews: session.pageviews + 1, exitPath: path, lastSeenAt: now };
        }
        if (!session) continue;
        await ctx.db.insert("events", { siteId: site._id, sessionId: session._id, kind: "pageview", name: "pageview", path, at: now });
        accepted++;
      } else if (e.t === "eng") {
        if (!session) continue;
        const idx = session.pages.findIndex((p) => p.id === e.id);
        if (idx < 0) continue;
        const pages = session.pages.map((p, i) =>
          i === idx ? { ...p, ms: Math.min(MAX_ENGAGED_MS, Math.max(p.ms, e.ms)), sc: Math.max(p.sc, e.sc) } : p,
        );
        const engagedMs = pages.reduce((sum, p) => sum + p.ms, 0);
        const maxScroll = Math.max(session.maxScroll, e.sc);
        await ctx.db.patch("sessions", session._id, { pages, engagedMs, maxScroll, lastSeenAt: now });
        session = { ...session, pages, engagedMs, maxScroll, lastSeenAt: now };
        accepted++;
      } else {
        // A custom event only counts inside a visit we saw start.
        if (!session) continue;
        const path = e.p ? cleanPath(e.p) : session.exitPath;
        if (isExcluded(path, site.excludePaths)) continue;
        const eventNames = [...session.eventNames];
        const found = eventNames.find((r) => r.k === e.n);
        if (found) found.n += 1;
        else if (eventNames.length < 20) eventNames.push({ k: e.n, n: 1 });
        await ctx.db.patch("sessions", session._id, { events: session.events + 1, eventNames, lastSeenAt: now });
        session = { ...session, events: session.events + 1, eventNames, lastSeenAt: now };
        await ctx.db.insert("events", { siteId: site._id, sessionId: session._id, kind: "event", name: e.n, path, props: e.props, at: now });
        accepted++;
      }
    }
    return { accepted, status: 202 };
  },
});
