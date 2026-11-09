/** Sites: the websites a workspace tracks. */
import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { actorLabel, audit, requireSite, requireWorkspace } from "./access";
import { randomToken } from "./lib/crypto";
import { isValidTimeZone } from "./lib/dates";
import { normalizeDomain } from "./lib/domains";
import { cleanPath } from "./lib/paths";
import { createSiteRecord } from "./workspaces";

export const create = mutation({
  args: { workspaceId: v.id("workspaces"), name: v.string(), domain: v.string(), timezone: v.string() },
  returns: v.id("sites"),
  handler: async (ctx, args) => {
    const access = await requireWorkspace(ctx, args.workspaceId, "admin");
    const existing = await ctx.db.query("sites").withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId)).take(50);
    if (existing.length >= 25) throw new ConvexError("A workspace can have up to 25 sites.");
    const siteId = await createSiteRecord(ctx, { workspaceId: args.workspaceId, name: args.name, domains: [args.domain], timezone: args.timezone });
    await audit(ctx, {
      workspaceId: args.workspaceId,
      actorId: access.user._id,
      actorLabel: actorLabel(access.user, access.viaStaff),
      action: "site.created",
      detail: `${args.name} (${args.domain})`,
    });
    return siteId;
  },
});

export const update = mutation({
  args: {
    siteId: v.id("sites"),
    name: v.optional(v.string()),
    domains: v.optional(v.array(v.string())),
    timezone: v.optional(v.string()),
    trackingEnabled: v.optional(v.boolean()),
    allowLocalhost: v.optional(v.boolean()),
    excludePaths: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { site, user, viaStaff } = await requireSite(ctx, args.siteId, "admin");
    const patch: Partial<{
      name: string;
      domains: string[];
      timezone: string;
      trackingEnabled: boolean;
      allowLocalhost: boolean;
      excludePaths: string[];
    }> = {};
    if (args.name !== undefined) {
      const name = args.name.replace(/\s+/g, " ").trim();
      if (name.length < 2 || name.length > 80) throw new ConvexError("Use a site name between 2 and 80 characters.");
      patch.name = name;
    }
    if (args.domains !== undefined) {
      const domains = [...new Set(args.domains.filter((d) => d.trim()).map(normalizeDomain))];
      if (domains.some((d) => d === null)) throw new ConvexError("One of those domains doesn't look right.");
      if (domains.length === 0) throw new ConvexError("A site needs at least one domain.");
      if (domains.length > 10) throw new ConvexError("A site can have up to 10 domains.");
      patch.domains = domains as string[];
    }
    if (args.timezone !== undefined) {
      if (!isValidTimeZone(args.timezone)) throw new ConvexError("Pick a valid time zone.");
      patch.timezone = args.timezone;
    }
    if (args.trackingEnabled !== undefined) patch.trackingEnabled = args.trackingEnabled;
    if (args.allowLocalhost !== undefined) patch.allowLocalhost = args.allowLocalhost;
    if (args.excludePaths !== undefined) {
      const paths = [...new Set(args.excludePaths.map((p) => p.trim()).filter(Boolean).map((p) => (p.endsWith("*") ? `${cleanPath(p.slice(0, -1))}*` : cleanPath(p))))];
      if (paths.length > 20) throw new ConvexError("Up to 20 excluded paths.");
      patch.excludePaths = paths;
    }
    await ctx.db.patch("sites", site._id, patch);
    await audit(ctx, {
      workspaceId: site.workspaceId,
      actorId: user._id,
      actorLabel: actorLabel(user, viaStaff),
      action: "site.updated",
      detail: `${site.name}: ${Object.keys(patch).join(", ")}`,
    });
    return null;
  },
});

/**
 * New site key. The old snippet stops working at once, so only for when a
 * key is being abused (someone else's site sending events with it).
 */
export const rotateKey = mutation({
  args: { siteId: v.id("sites") },
  returns: v.string(),
  handler: async (ctx, { siteId }) => {
    const { site, user, viaStaff } = await requireSite(ctx, siteId, "admin");
    const publicKey = `ss_${randomToken(15)}`;
    await ctx.db.patch("sites", site._id, { publicKey });
    await audit(ctx, {
      workspaceId: site.workspaceId,
      actorId: user._id,
      actorLabel: actorLabel(user, viaStaff),
      action: "site.key_rotated",
      detail: site.name,
    });
    return publicKey;
  },
});
