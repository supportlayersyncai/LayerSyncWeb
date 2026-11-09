/**
 * Dashboard analytics queries. Everything here reads the daily rollups
 * (convex/rollups.ts), never raw events, except the live view which reads
 * the last few minutes of sessions.
 */
import { ConvexError, v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { query, type QueryCtx } from "./_generated/server";
import { requireSite } from "./access";
import { addDays, DAY_RE, daySpan, daysInRange, startOfDayMs } from "./lib/dates";
import { mergeBreakdowns, sumTotals } from "./lib/rollup";

const MAX_RANGE_DAYS = 366;

function checkRange(from: string, to: string) {
  if (!DAY_RE.test(from) || !DAY_RE.test(to) || from > to) throw new ConvexError("Pick a valid date range.");
  const span = daySpan(from, to);
  if (span > MAX_RANGE_DAYS) throw new ConvexError("Pick a range of a year or less.");
  return span;
}

/** Everything on the Overview page for one site and date range, with the previous period to compare. */
export const overview = query({
  args: { siteId: v.id("sites"), from: v.string(), to: v.string() },
  handler: async (ctx, { siteId, from, to }) => {
    const { site } = await requireSite(ctx, siteId);
    return await overviewFor(ctx, site, from, to);
  },
});

/** The Overview numbers for one site and range. Shared with the MCP server. */
export async function overviewFor(ctx: QueryCtx, site: Doc<"sites">, from: string, to: string) {
  const siteId = site._id;
  const span = checkRange(from, to);
  const prevTo = addDays(from, -1);
  const prevFrom = addDays(from, -span);

  const days = await ctx.db
    .query("dailyStats")
    .withIndex("by_site_and_day", (q) => q.eq("siteId", siteId).gte("day", prevFrom).lte("day", to))
    .take(2 * MAX_RANGE_DAYS);
  const current = days.filter((d) => d.day >= from);
  const previous = days.filter((d) => d.day < from);
  const breakdownDocs = await ctx.db
    .query("dailyBreakdowns")
    .withIndex("by_site_and_day", (q) => q.eq("siteId", siteId).gte("day", from).lte("day", to))
    .take(MAX_RANGE_DAYS);

  const byDay = new Map(days.map((d) => [d.day, d]));
  const point = (day: string) => {
    const d = byDay.get(day);
    return { visitors: d?.visitors ?? 0, sessions: d?.sessions ?? 0, pageviews: d?.pageviews ?? 0, conversions: d?.conversions ?? 0 };
  };
  type Point = { label: string; visitors: number; sessions: number; pageviews: number; conversions: number };
  let series: Point[];
  let previousSeries: Point[];
  if (span === 1) {
    const d = byDay.get(from);
    const p = byDay.get(prevFrom);
    const hour = (h: number) => `${String(h).padStart(2, "0")}:00`;
    series = Array.from({ length: 24 }, (_, h) => ({ label: hour(h), visitors: 0, sessions: d?.hourlySessions[h] ?? 0, pageviews: d?.hourlyPageviews[h] ?? 0, conversions: 0 }));
    previousSeries = Array.from({ length: 24 }, (_, h) => ({ label: hour(h), visitors: 0, sessions: p?.hourlySessions[h] ?? 0, pageviews: p?.hourlyPageviews[h] ?? 0, conversions: 0 }));
  } else {
    series = daysInRange(from, to).map((day) => ({ label: day, ...point(day) }));
    previousSeries = daysInRange(prevFrom, prevTo).map((day) => ({ label: day, ...point(day) }));
  }

  // Leads in the period, by where they came from.
  const start = startOfDayMs(from, site.timezone);
  const end = startOfDayMs(addDays(to, 1), site.timezone);
  const subs = await ctx.db
    .query("submissions")
    .withIndex("by_site_and_createdAt", (q) => q.eq("siteId", siteId).gte("createdAt", start).lt("createdAt", end))
    .order("desc")
    .take(2000);
  const real = subs.filter((s) => !s.spam);
  const count = (pick: (s: (typeof real)[number]) => string | undefined) => {
    const m = new Map<string, number>();
    for (const s of real) {
      const k = pick(s) || "(unknown)";
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m.entries()].map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n).slice(0, 10);
  };

  return {
    site: { _id: site._id, name: site.name, timezone: site.timezone, domains: site.domains },
    range: { from, to, prevFrom, prevTo, days: span },
    totals: sumTotals(current),
    previous: sumTotals(previous),
    series,
    previousSeries,
    breakdowns: mergeBreakdowns(breakdownDocs),
    leads: {
      total: real.length,
      spam: subs.length - real.length,
      bySource: count((s) => s.attribution?.source),
      byChannel: count((s) => s.attribution?.channel),
      byForm: count((s) => s.form),
      byLanding: count((s) => s.attribution?.landingPath),
    },
    hasAnyData: days.length > 0,
    updatedAt: current.reduce((max, d) => Math.max(max, d.updatedAt), 0) || null,
  };
}

/**
 * Who's on the site right now: sessions active since `since` (the client
 * passes now minus five minutes, rounded to the minute) and the latest hits.
 */
export const live = query({
  args: { siteId: v.id("sites"), since: v.number() },
  handler: async (ctx, { siteId, since }) => {
    await requireSite(ctx, siteId);
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_site_and_lastSeen", (q) => q.eq("siteId", siteId).gt("lastSeenAt", since))
      .take(500);
    const tally = (pick: (s: (typeof sessions)[number]) => string | undefined) => {
      const m = new Map<string, number>();
      for (const s of sessions) {
        const k = pick(s) || "(unknown)";
        m.set(k, (m.get(k) ?? 0) + 1);
      }
      return [...m.entries()].map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n).slice(0, 8);
    };
    const recent = await ctx.db
      .query("events")
      .withIndex("by_site_and_at", (q) => q.eq("siteId", siteId))
      .order("desc")
      .take(25);
    const sessionCache = new Map<string, (typeof sessions)[number] | null>();
    const feed = [];
    for (const e of recent) {
      let s = sessionCache.get(e.sessionId);
      if (s === undefined) {
        s = await ctx.db.get("sessions", e.sessionId);
        sessionCache.set(e.sessionId, s);
      }
      feed.push({
        _id: e._id,
        kind: e.kind,
        name: e.name,
        path: e.path,
        at: e.at,
        props: e.props ?? null,
        country: s?.country ?? null,
        device: s?.device ?? null,
        source: s?.source ?? null,
      });
    }
    return {
      visitors: new Set(sessions.map((s) => s.visitorHash)).size,
      capped: sessions.length >= 500,
      pages: tally((s) => s.exitPath),
      countries: tally((s) => s.country),
      sources: tally((s) => s.source),
      devices: tally((s) => s.device),
      feed,
    };
  },
});
