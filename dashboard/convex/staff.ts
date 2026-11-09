/**
 * LayerSync staff administration: who has staff access, pending staff
 * invitations, and switching accounts off. Staff only.
 */
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { actorLabel, audit, requireStaff } from "./access";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const users = await ctx.db.query("users").take(2000);
    const staff = users
      .filter((u) => u.isStaff)
      .map((u) => ({ _id: u._id, name: u.name ?? null, email: u.email ?? null, disabled: !!u.disabledAt }));
    const invites = (await ctx.db.query("invites").order("desc").take(300))
      .filter((i) => i.staff && !i.acceptedAt && !i.revokedAt)
      .map((i) => ({ _id: i._id, email: i.email, expiresAt: i.expiresAt, createdAt: i.createdAt }));
    return { staff, invites };
  },
});

/** Find any account by email (to switch it off), staff only. */
export const findUser = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    await requireStaff(ctx);
    const u = await ctx.db.query("users").withIndex("email", (q) => q.eq("email", email.trim().toLowerCase())).first();
    if (!u) return null;
    const memberships = await ctx.db.query("memberships").withIndex("by_user", (q) => q.eq("userId", u._id)).take(50);
    const workspaces = [];
    for (const m of memberships) {
      const w = await ctx.db.get("workspaces", m.workspaceId);
      if (w) workspaces.push({ name: w.name, role: m.role });
    }
    return { _id: u._id, name: u.name ?? null, email: u.email ?? null, isStaff: !!u.isStaff, disabled: !!u.disabledAt, workspaces };
  },
});

/**
 * Switch an account off (or back on). Off: every request is refused at once,
 * and their sign-in sessions are deleted so they can't be refreshed.
 */
export const setDisabled = mutation({
  args: { userId: v.id("users"), disabled: v.boolean() },
  returns: v.null(),
  handler: async (ctx, { userId, disabled }) => {
    const me = await requireStaff(ctx);
    if (userId === me._id) throw new ConvexError("You can't switch off your own account.");
    const u = await ctx.db.get("users", userId);
    if (!u) throw new ConvexError("Account not found.");
    await ctx.db.patch("users", userId, { disabledAt: disabled ? Date.now() : undefined });
    if (disabled) {
      const sessions = await ctx.db.query("authSessions").withIndex("userId", (q) => q.eq("userId", userId)).take(200);
      for (const s of sessions) {
        const tokens = await ctx.db.query("authRefreshTokens").withIndex("sessionId", (q) => q.eq("sessionId", s._id)).take(200);
        for (const t of tokens) await ctx.db.delete("authRefreshTokens", t._id);
        await ctx.db.delete("authSessions", s._id);
      }
    }
    await audit(ctx, { actorId: me._id, actorLabel: actorLabel(me), action: disabled ? "user.disabled" : "user.enabled", detail: u.email });
    return null;
  },
});

/** Take away staff access (they keep any workspace memberships). */
export const removeStaff = mutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    const me = await requireStaff(ctx);
    if (userId === me._id) throw new ConvexError("Ask another staff member to remove you.");
    const u = await ctx.db.get("users", userId);
    if (!u?.isStaff) throw new ConvexError("That account isn't staff.");
    await ctx.db.patch("users", userId, { isStaff: undefined });
    await audit(ctx, { actorId: me._id, actorLabel: actorLabel(me), action: "staff.removed", detail: u.email });
    return null;
  },
});
