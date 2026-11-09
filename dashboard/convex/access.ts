/**
 * Who may do what. Every public query and mutation goes through one of these
 * before touching workspace data; nothing trusts an id sent by the client
 * without checking the caller belongs to the workspace it points into.
 */
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { hasRole, type Role } from "./lib/roles";

type Ctx = QueryCtx | MutationCtx;

export const NOT_FOUND = "Not found, or you don't have access to it.";

/** The signed-in user, or null. Disabled accounts count as signed out. */
export async function currentUser(ctx: Ctx): Promise<Doc<"users"> | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  const user = await ctx.db.get("users", userId);
  if (!user || user.disabledAt) return null;
  return user;
}

export async function requireUser(ctx: Ctx): Promise<Doc<"users">> {
  const user = await currentUser(ctx);
  if (!user) throw new ConvexError("Please sign in.");
  return user;
}

export async function requireStaff(ctx: Ctx): Promise<Doc<"users">> {
  const user = await requireUser(ctx);
  if (!user.isStaff) throw new ConvexError("Only LayerSync staff can do that.");
  return user;
}

export type Access = {
  user: Doc<"users">;
  workspace: Doc<"workspaces">;
  /** The caller's effective role. Staff are owners everywhere. */
  role: Role;
  /** True when the caller is here as LayerSync staff, not as a member. */
  viaStaff: boolean;
  membership: Doc<"memberships"> | null;
};

/**
 * The caller's access to a workspace, requiring at least `minRole`.
 * Unknown workspaces and missing access give the same error, so ids can't be
 * probed.
 */
export async function requireWorkspace(ctx: Ctx, workspaceId: Id<"workspaces">, minRole: Role = "viewer"): Promise<Access> {
  const user = await requireUser(ctx);
  const workspace = await ctx.db.get("workspaces", workspaceId);
  if (!workspace) throw new ConvexError(NOT_FOUND);
  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_workspace_and_user", (q) => q.eq("workspaceId", workspaceId).eq("userId", user._id))
    .unique();
  if (membership) {
    if (!hasRole(membership.role, minRole)) throw new ConvexError(`You need ${minRole} access to do that.`);
    return { user, workspace, role: membership.role, viaStaff: false, membership };
  }
  if (user.isStaff) return { user, workspace, role: "owner", viaStaff: true, membership: null };
  throw new ConvexError(NOT_FOUND);
}

export async function requireSite(ctx: Ctx, siteId: Id<"sites">, minRole: Role = "viewer") {
  const site = await ctx.db.get("sites", siteId);
  if (!site) throw new ConvexError(NOT_FOUND);
  const access = await requireWorkspace(ctx, site.workspaceId, minRole);
  return { ...access, site };
}

export async function requireContact(ctx: Ctx, contactId: Id<"contacts">, minRole: Role = "viewer") {
  const contact = await ctx.db.get("contacts", contactId);
  if (!contact) throw new ConvexError(NOT_FOUND);
  const access = await requireWorkspace(ctx, contact.workspaceId, minRole);
  return { ...access, contact };
}

/** Display label for audit entries and timelines. */
export function actorLabel(user: Pick<Doc<"users">, "name" | "email" | "isStaff">, viaStaff = false): string {
  const who = user.name || user.email || "Someone";
  return viaStaff ? `${who} (LayerSync)` : who;
}

/** Append to the audit log. */
export async function audit(
  ctx: MutationCtx,
  entry: { workspaceId?: Id<"workspaces">; actorId?: Id<"users">; actorLabel: string; action: string; detail?: string },
): Promise<void> {
  await ctx.db.insert("auditLog", { ...entry, detail: entry.detail?.slice(0, 500), at: Date.now() });
}

/**
 * Whether an API key or webhook made by `userId` should still work: its
 * maker must still be an admin or owner of the workspace (or active staff).
 * Checked every time either is used, on top of revoking them when someone is
 * removed or demoted (members.ts), so nothing outlives the person's access.
 */
export async function creatorStillTrusted(ctx: Ctx, workspaceId: Id<"workspaces">, userId: Id<"users">): Promise<boolean> {
  const user = await ctx.db.get("users", userId);
  if (!user || user.disabledAt) return false;
  if (user.isStaff) return true;
  const m = await ctx.db
    .query("memberships")
    .withIndex("by_workspace_and_user", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
    .unique();
  return !!m && hasRole(m.role, "admin");
}

/** Revoke the API keys and switch off the webhooks someone made on a workspace. */
export async function revokeCredentialsOf(ctx: MutationCtx, workspaceId: Id<"workspaces">, userId: Id<"users">, reason: string): Promise<number> {
  let n = 0;
  const now = Date.now();
  const keys = await ctx.db.query("apiKeys").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).take(200);
  for (const k of keys) {
    if (k.createdBy === userId && !k.revokedAt) {
      await ctx.db.patch("apiKeys", k._id, { revokedAt: now });
      n++;
    }
  }
  const hooks = await ctx.db.query("webhooks").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).take(50);
  for (const h of hooks) {
    if (h.createdBy === userId && h.active) {
      await ctx.db.patch("webhooks", h._id, { active: false, disabledReason: reason });
      n++;
    }
  }
  return n;
}
