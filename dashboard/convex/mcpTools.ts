/**
 * The MCP tools' database work. Internal only: convex/mcp.ts has already
 * checked the API key and passes the key's workspaceId, which every function
 * here uses to scope its reads and writes. Ids that point into another
 * workspace behave exactly like ids that don't exist.
 */
import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { internalMutation, internalQuery, type QueryCtx } from "./_generated/server";
import { overviewFor } from "./analytics";
import { audit } from "./access";
import { addNoteTo, applyContactPatch, createManualContact, publicContact, type Actor, type ContactStatus } from "./contacts";
import { addDays, dayKey } from "./lib/dates";
import { displayName } from "./lib/leads";
import { CHANNEL_LABEL, type Channel } from "./lib/referrer";
import { contactStatusValidator } from "./schema";

const NOT_FOUND = "Not found in this workspace.";

async function siteFor(ctx: QueryCtx, workspaceId: Id<"workspaces">, siteId?: string): Promise<Doc<"sites">> {
  if (siteId) {
    const id = ctx.db.normalizeId("sites", siteId);
    const site = id ? await ctx.db.get("sites", id) : null;
    if (!site || site.workspaceId !== workspaceId) throw new ConvexError(`Site ${NOT_FOUND}`);
    return site;
  }
  const first = await ctx.db.query("sites").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).first();
  if (!first) throw new ConvexError("This workspace has no sites yet.");
  return first;
}

async function contactFor(ctx: QueryCtx, workspaceId: Id<"workspaces">, leadId: string): Promise<Doc<"contacts">> {
  const id = ctx.db.normalizeId("contacts", leadId);
  const contact = id ? await ctx.db.get("contacts", id) : null;
  if (!contact || contact.workspaceId !== workspaceId) throw new ConvexError(`Lead ${NOT_FOUND}`);
  return contact;
}

const pct = (n: number, d: number) => (d ? Math.round((n / d) * 1000) / 10 : 0);
const change = (cur: number, prev: number) => (prev ? Math.round(((cur - prev) / prev) * 1000) / 10 : null);

export const listSites = internalQuery({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const sites = await ctx.db.query("sites").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).take(50);
    return {
      sites: sites.map((s) => ({ id: s._id, name: s.name, domains: s.domains, timezone: s.timezone, tracking: s.trackingEnabled })),
    };
  },
});

export const trafficOverview = internalQuery({
  args: {
    workspaceId: v.id("workspaces"),
    siteId: v.optional(v.string()),
    period: v.optional(v.string()),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    const site = await siteFor(ctx, args.workspaceId, args.siteId);
    const today = dayKey(args.now, site.timezone);
    let from: string;
    let to: string;
    if (args.from || args.to) {
      from = args.from ?? args.to!;
      to = args.to ?? today;
    } else {
      const back: Record<string, [number, number]> = { today: [0, 0], yesterday: [1, 1], "7d": [6, 0], "30d": [29, 0], "90d": [89, 0], "12m": [364, 0] };
      const [a, b] = back[args.period ?? "30d"] ?? back["30d"];
      from = addDays(today, -a);
      to = addDays(today, -b);
    }
    const o = await overviewFor(ctx, site, from, to);
    const t = o.totals;
    const p = o.previous;
    const top = <T extends { k: string; s: number; pv: number; c: number }>(rows: T[], n = 10) =>
      rows.slice(0, n).map((r) => ({ name: r.k, visits: r.s, pageviews: r.pv, conversions: r.c }));
    return {
      site: { id: site._id, name: site.name, timezone: site.timezone },
      period: { from, to, days: o.range.days, compared_with: { from: o.range.prevFrom, to: o.range.prevTo } },
      totals: {
        visitors: t.visitors,
        visits: t.sessions,
        pageviews: t.pageviews,
        avg_engaged_seconds_per_visit: t.sessions ? Math.round(t.engagedMs / t.sessions / 1000) : 0,
        bounce_rate_pct: pct(t.bounces, t.sessions),
        form_conversions: t.conversions,
        conversion_rate_pct: pct(t.conversions, t.sessions),
      },
      change_pct_vs_previous: {
        visitors: change(t.visitors, p.visitors),
        visits: change(t.sessions, p.sessions),
        pageviews: change(t.pageviews, p.pageviews),
        form_conversions: change(t.conversions, p.conversions),
      },
      top_pages: o.breakdowns.pages.slice(0, 10).map((r) => ({
        path: r.k,
        pageviews: r.pv,
        visits: r.s,
        entries: r.en,
        avg_engaged_seconds: r.pv ? Math.round(r.e / r.pv / 1000) : 0,
        avg_scroll_pct: r.scn ? Math.round(r.sc / r.scn) : null,
      })),
      channels: o.breakdowns.channels.map((r) => ({ name: CHANNEL_LABEL[r.k as Channel] ?? r.k, visits: r.s, conversions: r.c })),
      sources: top(o.breakdowns.sources),
      countries: top(o.breakdowns.countries),
      devices: top(o.breakdowns.devices, 5),
      campaigns: top(o.breakdowns.campaigns),
      events: o.breakdowns.eventNames.slice(0, 15).map((r) => ({ name: r.k, count: r.n })),
      leads: { total: o.leads.total, by_source: o.leads.bySource, by_form: o.leads.byForm, by_landing_page: o.leads.byLanding },
      note: "Visitors are counted per day (no cross-day tracking), so a period's visitors is the sum of daily visitors.",
    };
  },
});

export const liveVisitors = internalQuery({
  args: { workspaceId: v.id("workspaces"), siteId: v.optional(v.string()), now: v.number() },
  handler: async (ctx, args) => {
    const site = await siteFor(ctx, args.workspaceId, args.siteId);
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_site_and_lastSeen", (q) => q.eq("siteId", site._id).gt("lastSeenAt", args.now - 5 * 60_000))
      .take(500);
    const recent = await ctx.db.query("events").withIndex("by_site_and_at", (q) => q.eq("siteId", site._id)).order("desc").take(20);
    return {
      site: { id: site._id, name: site.name },
      visitors_last_5_minutes: new Set(sessions.map((s) => s.visitorHash)).size,
      current_pages: Object.entries(
        sessions.reduce<Record<string, number>>((m, s) => ({ ...m, [s.exitPath]: (m[s.exitPath] ?? 0) + 1 }), {}),
      )
        .map(([path, visitors]) => ({ path, visitors }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 10),
      latest: recent.map((e) => ({ type: e.kind === "pageview" ? "pageview" : e.name, path: e.path, at: new Date(e.at).toISOString(), ...(e.props ? { props: e.props } : {}) })),
    };
  },
});

export const listLeads = internalQuery({
  args: {
    workspaceId: v.id("workspaces"),
    status: v.optional(v.string()),
    query: v.optional(v.string()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const numItems = Math.min(100, Math.max(1, args.limit ?? 25));
    const status = (args.status ?? "all") as ContactStatus | "all";
    const term = args.query?.trim().toLowerCase().slice(0, 100);
    const opts = { numItems, cursor: args.cursor ?? null };
    let page;
    if (term) {
      page = await ctx.db
        .query("contacts")
        .withSearchIndex("search_text", (q) => {
          const base = q.search("searchText", term).eq("workspaceId", args.workspaceId);
          return status === "all" ? base : base.eq("status", status);
        })
        .paginate(opts);
    } else if (status === "all") {
      page = await ctx.db
        .query("contacts")
        .withIndex("by_workspace_and_lastActivity", (q) => q.eq("workspaceId", args.workspaceId))
        .order("desc")
        .filter((q) => q.neq(q.field("status"), "spam"))
        .paginate(opts);
    } else {
      page = await ctx.db
        .query("contacts")
        .withIndex("by_workspace_and_status_and_lastActivity", (q) => q.eq("workspaceId", args.workspaceId).eq("status", status))
        .order("desc")
        .paginate(opts);
    }
    return { leads: page.page.map(publicContact), next_cursor: page.isDone ? null : page.continueCursor };
  },
});

export const getLead = internalQuery({
  args: { workspaceId: v.id("workspaces"), leadId: v.string() },
  handler: async (ctx, { workspaceId, leadId }) => {
    const contact = await contactFor(ctx, workspaceId, leadId);
    const subs = await ctx.db.query("submissions").withIndex("by_contact_and_createdAt", (q) => q.eq("contactId", contact._id)).order("desc").take(20);
    const acts = await ctx.db.query("activities").withIndex("by_contact_and_at", (q) => q.eq("contactId", contact._id)).order("desc").take(50);
    const assignee = contact.assigneeId ? await ctx.db.get("users", contact.assigneeId) : null;
    return {
      lead: { ...publicContact(contact), assigned_to: assignee ? assignee.name || assignee.email : null },
      form_submissions: subs.map((s) => ({
        id: s._id,
        form: s.form,
        page: s.page ?? null,
        sent_at: new Date(s.createdAt).toISOString(),
        spam: s.spam,
        fields: s.fields,
        came_from: s.attribution ?? null,
      })),
      history: acts.map((a) => ({
        type: a.type,
        at: new Date(a.at).toISOString(),
        by: a.actorLabel,
        ...(a.body ? { text: a.body } : {}),
        ...(a.from ? { from: a.from } : {}),
        ...(a.to ? { to: a.to } : {}),
      })),
    };
  },
});

export const recentActivity = internalQuery({
  args: { workspaceId: v.id("workspaces"), since: v.number(), limit: v.number() },
  handler: async (ctx, { workspaceId, since, limit }) => {
    const acts = await ctx.db
      .query("activities")
      .withIndex("by_workspace_and_at", (q) => q.eq("workspaceId", workspaceId).gt("at", since))
      .order("desc")
      .take(Math.min(200, Math.max(1, limit)));
    const names = new Map<string, string>();
    const out = [];
    for (const a of acts) {
      if (!names.has(a.contactId)) {
        const c = await ctx.db.get("contacts", a.contactId);
        names.set(a.contactId, c ? displayName(c) : "(deleted)");
      }
      out.push({
        lead_id: a.contactId,
        lead_name: names.get(a.contactId),
        type: a.type,
        at: new Date(a.at).toISOString(),
        by: a.actorLabel,
        ...(a.body ? { text: a.body } : {}),
        ...(a.from ? { from: a.from } : {}),
        ...(a.to ? { to: a.to } : {}),
      });
    }
    return { since: new Date(since).toISOString(), activity: out };
  },
});

const keyActor = (keyName: string): Actor => ({ label: `API key "${keyName}"` });

export const updateLead = internalMutation({
  args: {
    workspaceId: v.id("workspaces"),
    keyName: v.string(),
    leadId: v.string(),
    status: v.optional(contactStatusValidator),
    followUpAt: v.optional(v.union(v.number(), v.null())),
    value: v.optional(v.union(v.number(), v.null())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { workspaceId, keyName, leadId, ...patch }) => {
    const contact = await contactFor(ctx, workspaceId, leadId);
    const updated = await applyContactPatch(ctx, contact, patch, keyActor(keyName));
    await audit(ctx, { workspaceId, actorLabel: keyActor(keyName).label, action: "mcp.update_lead", detail: Object.keys(patch).join(", ") });
    return { lead: publicContact(updated) };
  },
});

export const addLeadNote = internalMutation({
  args: { workspaceId: v.id("workspaces"), keyName: v.string(), leadId: v.string(), note: v.string() },
  handler: async (ctx, { workspaceId, keyName, leadId, note }) => {
    const contact = await contactFor(ctx, workspaceId, leadId);
    await addNoteTo(ctx, contact, note, keyActor(keyName));
    await audit(ctx, { workspaceId, actorLabel: keyActor(keyName).label, action: "mcp.add_lead_note" });
    return { ok: true, lead_id: contact._id };
  },
});

export const createLead = internalMutation({
  args: {
    workspaceId: v.id("workspaces"),
    keyName: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    note: v.optional(v.string()),
    status: v.optional(contactStatusValidator),
  },
  handler: async (ctx, { workspaceId, keyName, ...input }) => {
    const contact = await createManualContact(ctx, workspaceId, input, keyActor(keyName), "api");
    await audit(ctx, { workspaceId, actorLabel: keyActor(keyName).label, action: "mcp.create_lead" });
    return { lead: publicContact(contact) };
  },
});
