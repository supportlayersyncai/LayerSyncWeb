/**
 * Invitations: the only way into SyncSite.
 *
 * The token in the link is 32 random bytes and lives in the URL fragment
 * (/invite#token), so it never reaches a server log or a Referer header. We
 * store only its SHA-256. Workspace admins never see the token: it goes to
 * the invitee's inbox, so nobody can sign up "as" someone else and sit on
 * their account. LayerSync staff can copy the link to send it on WhatsApp.
 */
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { internalMutation, mutation, query, type MutationCtx } from "./_generated/server";
import { actorLabel, audit, currentUser, requireUser, requireWorkspace } from "./access";
import { dashboardUrl } from "./email";
import { randomToken, sha256Hex } from "./lib/crypto";
import { inviteEmail } from "./lib/emails";
import { normalizeEmail } from "./lib/leads";
import { canManageRole, ROLE_LABEL, type Role } from "./lib/roles";
import { rateLimiter } from "./rateLimits";
import { roleValidator } from "./schema";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function issueInvite(
  ctx: MutationCtx,
  opts: {
    email: string;
    role: Role;
    staff: boolean;
    workspaceId?: Id<"workspaces">;
    invitedBy?: Id<"users">;
    inviterName?: string;
  },
): Promise<{ inviteId: Id<"invites">; link: string }> {
  const now = Date.now();
  // One live invite per person per workspace: a new one replaces the old.
  const existing = await ctx.db
    .query("invites")
    .withIndex("by_email", (q) => q.eq("email", opts.email))
    .take(50);
  for (const inv of existing) {
    if (inv.workspaceId === opts.workspaceId && inv.staff === opts.staff && !inv.acceptedAt && !inv.revokedAt) {
      await ctx.db.patch("invites", inv._id, { revokedAt: now });
    }
  }
  const token = randomToken(32);
  const inviteId = await ctx.db.insert("invites", {
    workspaceId: opts.workspaceId,
    email: opts.email,
    role: opts.role,
    staff: opts.staff,
    tokenHash: await sha256Hex(token),
    invitedBy: opts.invitedBy,
    createdAt: now,
    expiresAt: now + INVITE_TTL_MS,
  });
  const link = dashboardUrl(`/invite#${token}`);
  const workspace = opts.workspaceId ? await ctx.db.get("workspaces", opts.workspaceId) : null;
  const mail = inviteEmail({
    workspaceName: workspace?.name,
    inviterName: opts.inviterName,
    role: opts.staff ? "LayerSync staff" : ROLE_LABEL[opts.role].toLowerCase(),
    url: link,
    staff: opts.staff,
  });
  await ctx.scheduler.runAfter(0, internal.email.send, { to: opts.email, ...mail });
  return { inviteId, link };
}

/** Invite someone to a workspace. Admins invite up to member; owners anyone. */
export const create = mutation({
  args: { workspaceId: v.id("workspaces"), email: v.string(), role: roleValidator },
  returns: v.object({ inviteId: v.id("invites"), link: v.union(v.string(), v.null()) }),
  handler: async (ctx, args) => {
    const access = await requireWorkspace(ctx, args.workspaceId, "admin");
    if (!canManageRole(access.role, args.role)) throw new ConvexError("Only owners can invite owners or admins.");
    const email = normalizeEmail(args.email);
    if (!email) throw new ConvexError("Enter a valid email address.");

    const existingUser = await ctx.db.query("users").withIndex("email", (q) => q.eq("email", email)).first();
    if (existingUser) {
      const already = await ctx.db
        .query("memberships")
        .withIndex("by_workspace_and_user", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", existingUser._id))
        .unique();
      if (already) throw new ConvexError(`${email} is already on this workspace.`);
    }

    // Don't let a re-invite quietly cancel an invitation this person couldn't have cancelled.
    const live = await ctx.db.query("invites").withIndex("by_email", (q) => q.eq("email", email)).take(50);
    const blocking = live.find(
      (i) => i.workspaceId === args.workspaceId && !i.acceptedAt && !i.revokedAt && i.expiresAt > Date.now() && !canManageRole(access.role, i.role),
    );
    if (blocking) throw new ConvexError(`${email} already has a pending invitation as ${blocking.role}. Ask an owner to change it.`);

    const limit = await rateLimiter.limit(ctx, "invites", { key: access.user._id });
    if (!limit.ok) throw new ConvexError("You've sent a lot of invitations. Try again in a little while.");

    const { inviteId, link } = await issueInvite(ctx, {
      email,
      role: args.role,
      staff: false,
      workspaceId: args.workspaceId,
      invitedBy: access.user._id,
      inviterName: access.user.name ?? undefined,
    });
    await audit(ctx, {
      workspaceId: args.workspaceId,
      actorId: access.user._id,
      actorLabel: actorLabel(access.user, access.viaStaff),
      action: "member.invited",
      detail: `Invited ${email} as ${args.role}`,
    });
    // Only staff get the link back (see the module comment).
    return { inviteId, link: access.user.isStaff ? link : null };
  },
});

/** Pending invitations on a workspace. */
export const listPending = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    await requireWorkspace(ctx, workspaceId, "admin");
    const rows = await ctx.db
      .query("invites")
      .withIndex("by_workspace_and_createdAt", (q) => q.eq("workspaceId", workspaceId))
      .order("desc")
      .take(100);
    return rows
      .filter((r) => !r.acceptedAt && !r.revokedAt)
      .map((r) => ({ _id: r._id, email: r.email, role: r.role, createdAt: r.createdAt, expiresAt: r.expiresAt }));
  },
});

export const revoke = mutation({
  args: { inviteId: v.id("invites") },
  returns: v.null(),
  handler: async (ctx, { inviteId }) => {
    const inv = await ctx.db.get("invites", inviteId);
    if (!inv) throw new ConvexError("Invitation not found.");
    if (!inv.workspaceId) {
      // A staff invitation: only staff can cancel it.
      const staff = await currentUser(ctx);
      if (!staff?.isStaff) throw new ConvexError("Invitation not found.");
      if (!inv.acceptedAt && !inv.revokedAt) await ctx.db.patch("invites", inviteId, { revokedAt: Date.now() });
      await audit(ctx, { actorId: staff._id, actorLabel: actorLabel(staff), action: "staff.invite_revoked", detail: inv.email });
      return null;
    }
    const access = await requireWorkspace(ctx, inv.workspaceId, "admin");
    if (!canManageRole(access.role, inv.role)) throw new ConvexError("Only owners can cancel that invitation.");
    if (!inv.acceptedAt && !inv.revokedAt) await ctx.db.patch("invites", inviteId, { revokedAt: Date.now() });
    await audit(ctx, {
      workspaceId: inv.workspaceId,
      actorId: access.user._id,
      actorLabel: actorLabel(access.user, access.viaStaff),
      action: "member.invite_revoked",
      detail: `Cancelled the invitation for ${inv.email}`,
    });
    return null;
  },
});

/**
 * What an invite link is for, shown on the invite page before anyone signs
 * in. Only someone holding the token can ask, and the answer is about that
 * one invitation.
 */
export const peek = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    if (token.length < 20 || token.length > 200) return { valid: false as const };
    const tokenHash = await sha256Hex(token);
    const inv = await ctx.db.query("invites").withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash)).unique();
    if (!inv || inv.revokedAt || inv.acceptedAt) return { valid: false as const };
    const workspace = inv.workspaceId ? await ctx.db.get("workspaces", inv.workspaceId) : null;
    const accountExists = (await ctx.db.query("users").withIndex("email", (q) => q.eq("email", inv.email)).first()) !== null;
    return {
      valid: true as const,
      // Expiry is checked again when it's used; the page shows it.
      expiresAt: inv.expiresAt,
      email: inv.email,
      role: inv.role,
      staff: inv.staff,
      workspaceName: workspace?.name ?? null,
      accountExists,
    };
  },
});

/** A signed-in person accepting an invitation (they already had an account). */
export const accept = mutation({
  args: { token: v.string() },
  returns: v.object({ slug: v.union(v.string(), v.null()) }),
  handler: async (ctx, { token }) => {
    const user = await requireUser(ctx);
    const tokenHash = await sha256Hex(token);
    const inv = await ctx.db.query("invites").withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash)).unique();
    const now = Date.now();
    if (!inv || inv.revokedAt || inv.acceptedAt || inv.expiresAt < now) {
      throw new ConvexError("This invitation link is no longer valid. Ask for a new one.");
    }
    if (inv.email !== user.email) {
      throw new ConvexError(`This invitation is for ${inv.email}. Sign out and sign in with that address.`);
    }
    let slug: string | null = null;
    if (inv.workspaceId) {
      const workspace = await ctx.db.get("workspaces", inv.workspaceId);
      if (!workspace) throw new ConvexError("That workspace no longer exists.");
      slug = workspace.slug;
      const existing = await ctx.db
        .query("memberships")
        .withIndex("by_workspace_and_user", (q) => q.eq("workspaceId", workspace._id).eq("userId", user._id))
        .unique();
      if (!existing) {
        await ctx.db.insert("memberships", {
          workspaceId: workspace._id,
          userId: user._id,
          role: inv.role,
          notifyEmail: true,
          notifyPush: true,
          weeklyDigest: inv.role === "owner" || inv.role === "admin",
          createdAt: now,
        });
      }
    }
    if (inv.staff) await ctx.db.patch("users", user._id, { isStaff: true });
    await ctx.db.patch("invites", inv._id, { acceptedAt: now });
    await audit(ctx, {
      workspaceId: inv.workspaceId,
      actorId: user._id,
      actorLabel: actorLabel(user),
      action: inv.staff ? "staff.joined" : "member.joined",
      detail: `${inv.email} accepted an invitation as ${inv.staff ? "staff" : inv.role}`,
    });
    return { slug };
  },
});

/** Staff: invite another LayerSync staff member. */
export const inviteStaff = mutation({
  args: { email: v.string() },
  returns: v.object({ link: v.string() }),
  handler: async (ctx, args) => {
    const user = await currentUser(ctx);
    if (!user?.isStaff) throw new ConvexError("Only LayerSync staff can do that.");
    const email = normalizeEmail(args.email);
    if (!email) throw new ConvexError("Enter a valid email address.");
    const { link } = await issueInvite(ctx, { email, role: "owner", staff: true, invitedBy: user._id, inviterName: user.name });
    await audit(ctx, { actorId: user._id, actorLabel: actorLabel(user), action: "staff.invited", detail: `Invited ${email} as staff` });
    return { link };
  },
});

/**
 * First-time setup, from your terminal (nobody can sign up otherwise):
 *
 *   npx convex run invites:bootstrapStaff '{"email":"you@layersyncai.com"}'
 *
 * Prints the invite link (and emails it if Resend is set up). Refuses once
 * any staff account exists; after that, staff invite staff in the app.
 */
export const bootstrapStaff = internalMutation({
  args: { email: v.string() },
  returns: v.object({ link: v.string() }),
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    if (!email) throw new ConvexError("Enter a valid email address.");
    const staff = await ctx.db.query("users").take(500);
    if (staff.some((u) => u.isStaff && !u.disabledAt)) {
      throw new ConvexError("A staff account already exists. Invite more staff from the dashboard.");
    }
    const { link } = await issueInvite(ctx, { email, role: "owner", staff: true });
    await audit(ctx, { actorLabel: "CLI", action: "staff.bootstrap", detail: `Bootstrap staff invite for ${email}` });
    return { link };
  },
});

/**
 * Checked before every sign-up, password reset and reset code (see the
 * wrapper in convex/auth.ts), so those flows are throttled per address and a
 * sign-up can't be used to test passwords on an existing account.
 * Answers the same way whether or not the address has an account.
 */
export const guardAuthFlow = internalMutation({
  args: { flow: v.string(), email: v.string(), tokenHash: v.optional(v.string()) },
  returns: v.object({ ok: v.boolean(), error: v.optional(v.string()) }),
  handler: async (ctx, { flow, email, tokenHash }): Promise<{ ok: boolean; error?: string }> => {
    const key = email.toLowerCase().slice(0, 254);
    const busy = { ok: false, error: "Too many attempts. Wait a while and try again." };
    if (flow === "reset") {
      return (await rateLimiter.limit(ctx, "resetEmail", { key })).ok ? { ok: true } : busy;
    }
    if (flow === "reset-verification") {
      return (await rateLimiter.limit(ctx, "resetCode", { key })).ok ? { ok: true } : busy;
    }
    if (flow !== "signUp") return { ok: true };
    if (!(await rateLimiter.limit(ctx, "signUp", { key })).ok) return busy;
    const dead = { ok: false, error: "This invitation link is no longer valid. Ask for a new one." };
    if (!tokenHash) return { ok: false, error: "SyncSite accounts are by invitation. Ask your LayerSync contact for an invite." };
    const inv = await ctx.db.query("invites").withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash)).unique();
    if (!inv || inv.revokedAt || inv.acceptedAt || inv.expiresAt < Date.now() || inv.email !== key) return dead;
    // Only the holder of a valid invite for this address gets this far.
    const existing = await ctx.db.query("users").withIndex("email", (q) => q.eq("email", key)).first();
    if (existing) return { ok: false, error: "You already have an account. Sign in to accept the invitation." };
    return { ok: true };
  },
});
