import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Analytics: roll changed sessions up into daily numbers.
crons.interval("analytics rollup", { minutes: 2 }, internal.rollups.tick, {});
crons.cron("analytics finalize yesterday", "17 1 * * *", internal.rollups.finalizeYesterday, {});

// Privacy: drop yesterday's visitor-hash salt as soon as the UTC day turns.
crons.cron("rotate visitor salts", "1 0 * * *", internal.maintenance.rotateSalts, {});

// Retention.
crons.cron("data retention", "43 2 * * *", internal.maintenance.retention, {});
crons.cron("prune notifications", "53 2 * * *", internal.maintenance.pruneNotifications, {});

// Monday 06:07 UTC (08:07 in Harare): weekly summary emails.
crons.cron("weekly digest", "7 6 * * 1", internal.notifications.weeklyDigests, {});

export default crons;
