/**
 * Telling the team about new leads: in the dashboard (live), by email, and
 * by push to their browsers and phones. Each person chooses per workspace
 * (memberships.notifyEmail / notifyPush).
 */
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireUser } from "./access";
import { dashboardUrl } from "./email";
import { addDays, dayKey } from "./lib/dates";
import { digestEmail, leadEmail } from "./lib/emails";
import { displayName } from "./lib/leads";
import { delta, mergeBreakdowns, sumTotals } from "./lib/rollup";
import { rateLimiter } from "./rateLimits";

export const onNewLead = internalMutation({
  args: { submissionId: v.id("submissions"), returning: v.boolean() },
  returns: v.null(),
  handler: async (ctx, { submissionId, returning }) => {
    const sub = await ctx.db.get("submissions", submissionId);
    if (!sub) return null;
    const contact = await ctx.db.get("contacts", sub.contactId);
    const workspace = await ctx.db.get("workspaces", sub.workspaceId);
    const site = await ctx.db.get("sites", sub.siteId);
    if (!contact || !workspace || !site) return null;

    const name = displayName(contact);
    const path = `/${workspace.slug}/leads/${contact._id}`;
    const message = sub.fields.find((f) => /message|enquiry|inquiry|comment|blind|detail|question/i.test(f.key))?.value;
    const title = returning ? `${name} got in touch again` : `New lead: ${name}`;
    const body = [sub.attribution?.source && sub.attribution.source !== "(unknown)" ? `via ${sub.attribution.source}` : null, `${sub.form} form on ${site.name}`]
      .filter(Boolean)
      .join(" · ");

    const members = await ctx.db.query("memberships").withIndex("by_workspace", (q) => q.eq("workspaceId", workspace._id)).take(200);
    const now = Date.now();
    // A burst of leads (or someone flooding a form) still lands in the inbox,
    // but stops emailing and pushing everyone after the first few.
    const alerts = await rateLimiter.limit(ctx, "leadAlerts", { key: workspace._id });
    for (const m of members) {
      const user = await ctx.db.get("users", m.userId);
      if (!user || user.disabledAt) continue;
      await ctx.db.insert("notifications", {
        userId: user._id,
        workspaceId: workspace._id,
        kind: "lead",
        title,
        body,
        url: path,
        contactId: contact._id,
        createdAt: now,
      });
      if (alerts.ok && m.notifyEmail && user.email) {
        const mail = leadEmail({
          workspaceName: workspace.name,
          siteName: site.name,
          name,
          email: contact.email,
          phone: contact.phone,
          company: contact.company,
          message,
          form: sub.form,
          source: sub.attribution?.source !== "(unknown)" ? sub.attribution?.source : undefined,
          landingPath: sub.attribution?.landingPath,
          page: sub.page,
          url: dashboardUrl(path),
          returning,
          // Viewers get the alert but not the person's details.
          includeDetails: m.role !== "viewer",
        });
        await ctx.scheduler.runAfter(0, internal.email.send, { to: user.email, ...mail });
      }
      if (alerts.ok && m.notifyPush) {
        await ctx.scheduler.runAfter(0, internal.pushSender.sendToUser, {
          userId: user._id,
          title,
          body,
          url: path,
          tag: `lead-${contact._id}`,
        });
      }
    }
    return null;
  },
});

/** My latest notifications. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return await ctx.db
      .query("notifications")
      .withIndex("by_user_and_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(30);
  },
});

/** Unread count for the bell, capped at 100 ("99+"). */
export const unreadCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const rows = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_readAt", (q) => q.eq("userId", user._id).eq("readAt", undefined))
      .take(100);
    return rows.length;
  },
});

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  returns: v.null(),
  handler: async (ctx, { notificationId }) => {
    const user = await requireUser(ctx);
    const n = await ctx.db.get("notifications", notificationId);
    if (!n || n.userId !== user._id) throw new ConvexError("Notification not found.");
    if (!n.readAt) await ctx.db.patch("notifications", notificationId, { readAt: Date.now() });
    return null;
  },
});

export const markAllRead = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const rows = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_readAt", (q) => q.eq("userId", user._id).eq("readAt", undefined))
      .take(500);
    const now = Date.now();
    for (const n of rows) await ctx.db.patch("notifications", n._id, { readAt: now });
    return null;
  },
});

/** Monday morning: schedule one summary per workspace. */
export const weeklyDigests = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const workspaces = await ctx.db.query("workspaces").take(1000);
    for (const w of workspaces) await ctx.scheduler.runAfter(0, internal.notifications.weeklyDigestFor, { workspaceId: w._id });
    return null;
  },
});

export const weeklyDigestFor = internalMutation({
  args: { workspaceId: v.id("workspaces") },
  returns: v.null(),
  handler: async (ctx, { workspaceId }) => {
    const workspace = await ctx.db.get("workspaces", workspaceId);
    if (!workspace) return null;
    const members = (await ctx.db.query("memberships").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).take(200)).filter(
      (m) => m.weeklyDigest,
    );
    if (members.length === 0) return null;
    const sites = await ctx.db.query("sites").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).take(25);
    const now = Date.now();
    const blocks = [];
    for (const site of sites) {
      const today = dayKey(now, site.timezone);
      const to = addDays(today, -1);
      const from = addDays(today, -7);
      const prevFrom = addDays(today, -14);
      const days = await ctx.db
        .query("dailyStats")
        .withIndex("by_site_and_day", (q) => q.eq("siteId", site._id).gte("day", prevFrom).lte("day", to))
        .take(14);
      const cur = sumTotals(days.filter((d) => d.day >= from));
      const prev = sumTotals(days.filter((d) => d.day < from));
      const bds = await ctx.db
        .query("dailyBreakdowns")
        .withIndex("by_site_and_day", (q) => q.eq("siteId", site._id).gte("day", from).lte("day", to))
        .take(7);
      const merged = mergeBreakdowns(bds, { pages: 1, list: 1 });
      blocks.push({
        name: site.name,
        visitors: cur.visitors,
        sessions: cur.sessions,
        conversions: cur.conversions,
        visitorsDelta: delta(cur.visitors, prev.visitors),
        topSource: merged.sources[0]?.k,
        topPage: merged.pages[0]?.k,
      });
    }
    const weekAgo = now - 7 * 24 * 3_600_000;
    const leads = await ctx.db
      .query("contacts")
      .withIndex("by_workspace_and_createdAt", (q) => q.eq("workspaceId", workspaceId).gte("createdAt", weekAgo))
      .take(1000);
    const newLeads = leads.filter((c) => c.status !== "spam").length;
    // Nothing happened: don't send an empty email.
    if (newLeads === 0 && blocks.every((b) => b.sessions === 0)) return null;
    const mail = digestEmail({ workspaceName: workspace.name, periodLabel: "last week", url: dashboardUrl(`/${workspace.slug}`), sites: blocks, newLeads });
    for (const m of members) {
      const user = await ctx.db.get("users", m.userId);
      if (user?.email && !user.disabledAt) await ctx.scheduler.runAfter(0, internal.email.send, { to: user.email, ...mail });
    }
    return null;
  },
});
