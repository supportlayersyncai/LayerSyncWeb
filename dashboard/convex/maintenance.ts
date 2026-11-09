/**
 * Housekeeping: daily salt rotation and data retention.
 *
 *   raw events            90 days   (daily rollups are kept)
 *   sessions             400 days
 *   webhook deliveries    30 days   (they carry lead details)
 *   notifications         90 days
 *   used/expired invites  30 days
 */
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const DAY = 24 * 3_600_000;
const BATCH = 500;

/** Delete every salt older than today (UTC), so yesterday's visitor hashes can never be recomputed. */
export const rotateSalts = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const today = new Date().toISOString().slice(0, 10);
    const old = await ctx.db.query("dailySalts").withIndex("by_day", (q) => q.lt("day", today)).take(100);
    for (const s of old) await ctx.db.delete("dailySalts", s._id);
    return old.length;
  },
});

export const retention = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const now = Date.now();
    let more = false;

    const events = await ctx.db.query("events").withIndex("by_at", (q) => q.lt("at", now - 90 * DAY)).take(BATCH);
    for (const e of events) await ctx.db.delete("events", e._id);
    more ||= events.length === BATCH;

    const deliveries = await ctx.db.query("webhookDeliveries").withIndex("by_createdAt", (q) => q.lt("createdAt", now - 30 * DAY)).take(BATCH);
    for (const d of deliveries) await ctx.db.delete("webhookDeliveries", d._id);
    more ||= deliveries.length === BATCH;

    // Sessions: no global time index (they're read per site), so walk the sites.
    const sites = await ctx.db.query("sites").take(1000);
    for (const site of sites) {
      const old = await ctx.db
        .query("sessions")
        .withIndex("by_site_and_lastSeen", (q) => q.eq("siteId", site._id).lt("lastSeenAt", now - 400 * DAY))
        .take(100);
      for (const s of old) await ctx.db.delete("sessions", s._id);
      more ||= old.length === 100;
    }

    const invites = await ctx.db.query("invites").order("asc").take(BATCH);
    for (const i of invites) {
      if ((i.acceptedAt || i.revokedAt || i.expiresAt < now) && i.createdAt < now - 30 * DAY) await ctx.db.delete("invites", i._id);
    }

    if (more) await ctx.scheduler.runAfter(1000, internal.maintenance.retention, {});
    return null;
  },
});

/** Notifications older than 90 days, per batch. */
export const pruneNotifications = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const cutoff = Date.now() - 90 * DAY;
    const old = await ctx.db
      .query("notifications")
      .order("asc")
      .take(BATCH);
    let deleted = 0;
    for (const n of old) {
      if (n.createdAt < cutoff) {
        await ctx.db.delete("notifications", n._id);
        deleted++;
      }
    }
    if (deleted === BATCH) await ctx.scheduler.runAfter(1000, internal.maintenance.pruneNotifications, {});
    return null;
  },
});
