/**
 * Rolling sessions up into daily numbers (convex/lib/rollup.ts does the
 * arithmetic).
 *
 * Every two minutes `tick` looks for sessions that changed since its last run
 * and recomputes the days they belong to. Recomputing a whole day from its
 * sessions (rather than adding increments as events arrive) keeps ingest
 * write-only and conflict-free, and means a day's numbers are always exactly
 * what its sessions say, however late an engagement ping arrives.
 */
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { internalMutation, type MutationCtx } from "./_generated/server";
import { addDays, dayKey } from "./lib/dates";
import { accumulate, emptyAccumulator, finishDay, type DayAccumulator } from "./lib/rollup";

const CHUNK = 500;
/** A run that hasn't finished in ten minutes is assumed dead and may be replaced. */
const RUN_LOCK_MS = 10 * 60_000;
/** Re-read a minute of overlap each tick, so a write that committed late isn't missed. */
const OVERLAP_MS = 60_000;

export const tick = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const now = Date.now();
    let scheduled = 0;
    const sites = await ctx.db.query("sites").take(1000);
    for (const site of sites) {
      const state = await ctx.db.query("rollupState").withIndex("by_site", (q) => q.eq("siteId", site._id)).unique();
      const since = state ? state.lastRunAt - OVERLAP_MS : 0;
      const changed = await ctx.db
        .query("sessions")
        .withIndex("by_site_and_lastSeen", (q) => q.eq("siteId", site._id).gt("lastSeenAt", since))
        .take(300);
      if (changed.length === 0) continue;
      const days = new Set(changed.map((s) => s.day));
      days.add(dayKey(now, site.timezone));
      let skipped = false;
      for (const day of days) {
        // A chain already running for this day: leave it, and look again next tick.
        const run = await ctx.db.query("rollupRuns").withIndex("by_site_and_day", (q) => q.eq("siteId", site._id).eq("day", day)).unique();
        if (run && run.startedAt > now - RUN_LOCK_MS) {
          skipped = true;
          continue;
        }
        if (run) await ctx.db.patch("rollupRuns", run._id, { startedAt: now });
        else await ctx.db.insert("rollupRuns", { siteId: site._id, day, startedAt: now });
        await ctx.scheduler.runAfter(0, internal.rollups.recomputeDay, { siteId: site._id, day });
        scheduled++;
      }
      // Only move the marker on when every changed day got a fresh run.
      if (!skipped) {
        if (state) await ctx.db.patch("rollupState", state._id, { lastRunAt: now });
        else await ctx.db.insert("rollupState", { siteId: site._id, lastRunAt: now });
      }
    }
    return scheduled;
  },
});

/**
 * Recompute one site-day from its sessions, CHUNK sessions per run. A busy
 * day continues in a scheduled follow-up carrying the partial totals.
 */
export const recomputeDay = internalMutation({
  args: {
    siteId: v.id("sites"),
    day: v.string(),
    cursor: v.optional(v.union(v.string(), v.null())),
    // A DayAccumulator from the previous chunk (convex/lib/rollup.ts).
    partial: v.optional(v.any()),
  },
  returns: v.null(),
  handler: async (ctx, { siteId, day, cursor, partial }) => {
    const site = await ctx.db.get("sites", siteId);
    if (!site) return null;
    const page = await ctx.db
      .query("sessions")
      .withIndex("by_site_and_day", (q) => q.eq("siteId", siteId).eq("day", day))
      .paginate({ numItems: CHUNK, cursor: cursor ?? null });
    const acc = accumulate((partial as DayAccumulator | undefined) ?? emptyAccumulator(), page.page, site.timezone);
    if (!page.isDone) {
      await ctx.scheduler.runAfter(0, internal.rollups.recomputeDay, { siteId, day, cursor: page.continueCursor, partial: acc });
      return null;
    }
    await writeDay(ctx, siteId, day, acc);
    const run = await ctx.db.query("rollupRuns").withIndex("by_site_and_day", (q) => q.eq("siteId", siteId).eq("day", day)).unique();
    if (run) await ctx.db.delete("rollupRuns", run._id);
    return null;
  },
});

async function writeDay(
  ctx: MutationCtx,
  siteId: Id<"sites">,
  day: string,
  acc: DayAccumulator,
) {
  const stats = finishDay(acc);
  const { pages, channels, sources, countries, devices, browsers, os, campaigns, eventNames, scroll, ...totals } = stats;
  const existing = await ctx.db.query("dailyStats").withIndex("by_site_and_day", (q) => q.eq("siteId", siteId).eq("day", day)).unique();
  const statsDoc = { siteId, day, ...totals, updatedAt: Date.now() };
  if (existing) await ctx.db.replace("dailyStats", existing._id, statsDoc);
  else await ctx.db.insert("dailyStats", statsDoc);

  const bd = { siteId, day, pages, channels, sources, countries, devices, browsers, os, campaigns, eventNames, scroll };
  const existingBd = await ctx.db.query("dailyBreakdowns").withIndex("by_site_and_day", (q) => q.eq("siteId", siteId).eq("day", day)).unique();
  if (existingBd) await ctx.db.replace("dailyBreakdowns", existingBd._id, bd);
  else await ctx.db.insert("dailyBreakdowns", bd);
}

/** Nightly: recompute yesterday for every site, so late pings are always counted. */
export const finalizeYesterday = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const now = Date.now();
    const sites = await ctx.db.query("sites").take(1000);
    for (const site of sites) {
      const yesterday = addDays(dayKey(now, site.timezone), -1);
      await ctx.scheduler.runAfter(0, internal.rollups.recomputeDay, { siteId: site._id, day: yesterday });
    }
    return null;
  },
});
