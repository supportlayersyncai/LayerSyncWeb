/** The people on a workspace: roles, removal, and each person's notification settings. */
import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { actorLabel, audit, requireUser, requireWorkspace, revokeCredentialsOf } from "./access";
import { canManageRole, hasRole } from "./lib/roles";
import { roleValidator } from "./schema";

export const list = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    await requireWorkspace(ctx, workspaceId);
    const rows = await ctx.db
      .query("memberships")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .take(200);
    const out = [];
    for (const m of rows) {
      const u = await ctx.db.get("users", m.userId);
      if (!u) continue;
      out.push({
        _id: m._id,
        userId: u._id,
        name: u.name ?? null,
        email: u.email ?? null,
        role: m.role,
        disabled: !!u.disabledAt,
        createdAt: m.createdAt,
      });
    }
    const rank = { owner: 0, admin: 1, member: 2, viewer: 3 } as const;
    return out.sort((a, b) => rank[a.role] - rank[b.role] || (a.name ?? "").localeCompare(b.name ?? ""));
  },
});

async function ownerCount(ctx: MutationCtx, workspaceId: Id<"workspaces">): Promise<number> {
  const rows = await ctx.db.query("memberships").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).take(200);
  return rows.filter((r) => r.role === "owner").length;
}

export const updateRole = mutation({
  args: { membershipId: v.id("memberships"), role: roleValidator },
  returns: v.null(),
  handler: async (ctx, { membershipId, role }) => {
    const m = await ctx.db.get("memberships", membershipId);
    if (!m) throw new ConvexError("Member not found.");
    const access = await requireWorkspace(ctx, m.workspaceId, "admin");
    if (!canManageRole(access.role, m.role) || !canManageRole(access.role, role)) {
      throw new ConvexError("Only owners can change owners and admins.");
    }
    if (m.role === "owner" && role !== "owner" && (await ownerCount(ctx, m.workspaceId)) <= 1) {
      throw new ConvexError("A workspace needs at least one owner. Make someone else owner first.");
    }
    await ctx.db.patch("memberships", membershipId, { role });
    const u = await ctx.db.get("users", m.userId);
    // Below admin, their API keys and webhooks stop working.
    if (!hasRole(role, "admin")) await revokeCredentialsOf(ctx, m.workspaceId, m.userId, `Made by ${u?.email ?? "a member"}, no longer an admin`);
    await audit(ctx, {
      workspaceId: m.workspaceId,
      actorId: access.user._id,
      actorLabel: actorLabel(access.user, access.viaStaff),
      action: "member.role_changed",
      detail: `${u?.email ?? "member"}: ${m.role} → ${role}`,
    });
    return null;
  },
});

/** Remove someone (or leave, when it's your own membership). */
export const remove = mutation({
  args: { membershipId: v.id("memberships") },
  returns: v.null(),
  handler: async (ctx, { membershipId }) => {
    const m = await ctx.db.get("memberships", membershipId);
    if (!m) throw new ConvexError("Member not found.");
    const user = await requireUser(ctx);
    const self = m.userId === user._id;
    const access = await requireWorkspace(ctx, m.workspaceId, self ? "viewer" : "admin");
    if (!self && !canManageRole(access.role, m.role)) throw new ConvexError("Only owners can remove owners and admins.");
    if (m.role === "owner" && (await ownerCount(ctx, m.workspaceId)) <= 1) {
      throw new ConvexError("A workspace needs at least one owner. Make someone else owner first.");
    }
    await ctx.db.delete("memberships", membershipId);
    const gone = await ctx.db.get("users", m.userId);
    await revokeCredentialsOf(ctx, m.workspaceId, m.userId, `Made by ${gone?.email ?? "a member"}, who left the workspace`);
    // Their notifications for this workspace go with them.
    const notes = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_createdAt", (q) => q.eq("userId", m.userId))
      .order("desc")
      .take(500);
    for (const n of notes) if (n.workspaceId === m.workspaceId) await ctx.db.delete("notifications", n._id);
    const u = await ctx.db.get("users", m.userId);
    await audit(ctx, {
      workspaceId: m.workspaceId,
      actorId: user._id,
      actorLabel: actorLabel(user, access.viaStaff),
      action: self ? "member.left" : "member.removed",
      detail: u?.email ?? undefined,
    });
    return null;
  },
});

/** My notification settings on a workspace. */
export const myPrefs = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const access = await requireWorkspace(ctx, workspaceId);
    const m = access.membership;
    if (!m) return null;
    return { notifyEmail: m.notifyEmail, notifyPush: m.notifyPush, weeklyDigest: m.weeklyDigest };
  },
});

export const updateMyPrefs = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    notifyEmail: v.optional(v.boolean()),
    notifyPush: v.optional(v.boolean()),
    weeklyDigest: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, { workspaceId, ...prefs }) => {
    const access = await requireWorkspace(ctx, workspaceId);
    if (!access.membership) throw new ConvexError("Join the workspace to get its notifications.");
    const patch: Record<string, boolean> = {};
    for (const [k, val] of Object.entries(prefs)) if (typeof val === "boolean") patch[k] = val;
    await ctx.db.patch("memberships", access.membership._id, patch);
    return null;
  },
});

/** Change my display name. */
export const updateMyName = mutation({
  args: { name: v.string() },
  returns: v.null(),
  handler: async (ctx, { name }) => {
    const user = await requireUser(ctx);
    const clean = name.replace(/\s+/g, " ").trim();
    if (clean.length < 2 || clean.length > 80) throw new ConvexError("Use a name between 2 and 80 characters.");
    await ctx.db.patch("users", user._id, { name: clean });
    return null;
  },
});
