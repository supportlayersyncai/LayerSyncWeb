/**
 * Workspaces: one per client business (LayerSync itself is one). Staff
 * create them; owners and admins look after their own.
 */
import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { actorLabel, audit, currentUser, requireStaff, requireWorkspace } from "./access";
import { randomToken } from "./lib/crypto";
import { DEFAULT_TIMEZONE, isValidTimeZone } from "./lib/dates";
import { normalizeDomain } from "./lib/domains";
import { normalizeEmail } from "./lib/leads";
import { issueInvite } from "./invites";

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;
const RESERVED = new Set(["login", "invite", "reset", "admin", "api", "settings", "new", "staff", "app", "s", "auth", "logout", "account"]);

export function checkSlug(slug: string): string {
  const s = slug.trim().toLowerCase();
  if (!SLUG_RE.test(s)) throw new ConvexError("Use lowercase letters, numbers and dashes (up to 40).");
  if (RESERVED.has(s)) throw new ConvexError("That address is reserved. Pick another.");
  return s;
}

/** The signed-in person and the workspaces they can open. */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx);
    if (!user) return null;
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .take(100);
    const workspaces = [];
    for (const m of memberships) {
      const w = await ctx.db.get("workspaces", m.workspaceId);
      if (w) workspaces.push({ _id: w._id, name: w.name, slug: w.slug, role: m.role });
    }
    workspaces.sort((a, b) => a.name.localeCompare(b.name));
    return {
      _id: user._id,
      name: user.name ?? null,
      email: user.email ?? null,
      isStaff: user.isStaff === true,
      workspaces,
    };
  },
});

/** A workspace by its URL slug, with the caller's role and its sites. */
export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const user = await currentUser(ctx);
    if (!user) return null;
    const workspace = await ctx.db.query("workspaces").withIndex("by_slug", (q) => q.eq("slug", slug)).unique();
    if (!workspace) return null;
    let access;
    try {
      access = await requireWorkspace(ctx, workspace._id);
    } catch {
      return null;
    }
    const sites = await ctx.db
      .query("sites")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspace._id))
      .take(50);
    return {
      workspace,
      role: access.role,
      viaStaff: access.viaStaff,
      membershipId: access.membership?._id ?? null,
      sites: sites.map((s) => ({
        _id: s._id,
        name: s.name,
        domains: s.domains,
        publicKey: s.publicKey,
        timezone: s.timezone,
        trackingEnabled: s.trackingEnabled,
        allowLocalhost: s.allowLocalhost,
        excludePaths: s.excludePaths,
        createdAt: s.createdAt,
      })),
    };
  },
});

export const update = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.optional(v.string()),
    defaultCountryCode: v.optional(v.string()),
    currency: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const access = await requireWorkspace(ctx, args.workspaceId, "admin");
    const patch: { name?: string; defaultCountryCode?: string; currency?: string } = {};
    if (args.name !== undefined) {
      const name = args.name.replace(/\s+/g, " ").trim();
      if (name.length < 2 || name.length > 80) throw new ConvexError("Use a name between 2 and 80 characters.");
      patch.name = name;
    }
    if (args.defaultCountryCode !== undefined) {
      const cc = args.defaultCountryCode.replace(/\D/g, "");
      if (!/^[1-9]\d{0,3}$/.test(cc)) throw new ConvexError("Use a country calling code like 263.");
      patch.defaultCountryCode = cc;
    }
    if (args.currency !== undefined) {
      const cur = args.currency.trim().toUpperCase();
      if (!/^[A-Z]{3}$/.test(cur)) throw new ConvexError("Use a three-letter currency code like USD.");
      patch.currency = cur;
    }
    await ctx.db.patch("workspaces", args.workspaceId, patch);
    await audit(ctx, {
      workspaceId: args.workspaceId,
      actorId: access.user._id,
      actorLabel: actorLabel(access.user, access.viaStaff),
      action: "workspace.updated",
      detail: Object.keys(patch).join(", "),
    });
    return null;
  },
});

export async function createSiteRecord(
  ctx: MutationCtx,
  args: { workspaceId: Id<"workspaces">; name: string; domains: string[]; timezone: string },
): Promise<Id<"sites">> {
  const name = args.name.replace(/\s+/g, " ").trim();
  if (name.length < 2 || name.length > 80) throw new ConvexError("Use a site name between 2 and 80 characters.");
  const domains = [...new Set(args.domains.map(normalizeDomain))];
  if (domains.some((d) => d === null) || domains.length === 0) throw new ConvexError("Enter the site's domain, like example.co.zw.");
  if (domains.length > 10) throw new ConvexError("A site can have up to 10 domains.");
  if (!isValidTimeZone(args.timezone)) throw new ConvexError("Pick a valid time zone.");
  return await ctx.db.insert("sites", {
    workspaceId: args.workspaceId,
    name,
    domains: domains as string[],
    publicKey: `ss_${randomToken(15)}`,
    timezone: args.timezone,
    trackingEnabled: true,
    allowLocalhost: false,
    excludePaths: [],
    createdAt: Date.now(),
  });
}

/**
 * Staff: set up a new client. Creates the workspace, optionally its first
 * site, and optionally invites the owner (they get an email).
 */
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    site: v.optional(v.object({ name: v.string(), domain: v.string(), timezone: v.optional(v.string()) })),
    ownerEmail: v.optional(v.string()),
  },
  returns: v.object({ workspaceId: v.id("workspaces"), slug: v.string(), ownerInviteLink: v.union(v.string(), v.null()) }),
  handler: async (ctx, args): Promise<{ workspaceId: Id<"workspaces">; slug: string; ownerInviteLink: string | null }> => {
    const staff = await requireStaff(ctx);
    const name = args.name.replace(/\s+/g, " ").trim();
    if (name.length < 2 || name.length > 80) throw new ConvexError("Use a name between 2 and 80 characters.");
    const slug = checkSlug(args.slug);
    const taken = await ctx.db.query("workspaces").withIndex("by_slug", (q) => q.eq("slug", slug)).unique();
    if (taken) throw new ConvexError("That address is taken.");
    const ownerEmail = args.ownerEmail ? normalizeEmail(args.ownerEmail) : undefined;
    if (args.ownerEmail && !ownerEmail) throw new ConvexError("Enter a valid owner email.");

    const now = Date.now();
    const workspaceId = await ctx.db.insert("workspaces", {
      name,
      slug,
      defaultCountryCode: "263",
      currency: "USD",
      createdAt: now,
      createdBy: staff._id,
    });
    await ctx.db.insert("contactCounts", { workspaceId, new: 0, contacted: 0, qualified: 0, won: 0, lost: 0, spam: 0 });
    if (args.site) {
      await createSiteRecord(ctx, {
        workspaceId,
        name: args.site.name,
        domains: [args.site.domain],
        timezone: args.site.timezone ?? DEFAULT_TIMEZONE,
      });
    }
    await audit(ctx, { workspaceId, actorId: staff._id, actorLabel: actorLabel(staff, true), action: "workspace.created", detail: name });

    let ownerInviteLink: string | null = null;
    if (ownerEmail) {
      const res = await issueInvite(ctx, {
        email: ownerEmail,
        role: "owner",
        staff: false,
        workspaceId,
        invitedBy: staff._id,
        inviterName: staff.name,
      });
      ownerInviteLink = res.link;
    }
    return { workspaceId, slug, ownerInviteLink };
  },
});

/** Staff: every workspace, newest first. */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const rows = await ctx.db.query("workspaces").order("desc").take(300);
    const out = [];
    for (const w of rows) {
      const sites = await ctx.db.query("sites").withIndex("by_workspace", (q) => q.eq("workspaceId", w._id)).take(20);
      const counts = await ctx.db.query("contactCounts").withIndex("by_workspace", (q) => q.eq("workspaceId", w._id)).unique();
      const members = await ctx.db.query("memberships").withIndex("by_workspace", (q) => q.eq("workspaceId", w._id)).take(200);
      out.push({
        _id: w._id,
        name: w.name,
        slug: w.slug,
        createdAt: w.createdAt,
        sites: sites.map((s) => ({ name: s.name, domains: s.domains })),
        members: members.length,
        openLeads: counts ? counts.new + counts.contacted + counts.qualified : 0,
      });
    }
    return out;
  },
});
