/**
 * Sign-in for SyncSite (Convex Auth, email + password).
 *
 * There is no public sign-up. An account can only be created with a valid,
 * unexpired invitation for that exact email address: the check runs inside
 * the same transaction that creates the user, so a bad invite creates nothing.
 * Following the invite link also proves the person owns the address.
 *
 * Forgotten passwords use an 8-digit code sent by email (15 minutes).
 * Convex Auth throttles failed sign-ins per account.
 */
import Resend from "@auth/core/providers/resend";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import type { GenericActionCtx } from "convex/server";
import { internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { sendEmail } from "./email";
import { sha256Hex } from "./lib/crypto";
import { resetCodeEmail } from "./lib/emails";
import { normalizeEmail } from "./lib/leads";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Passwords: 10 to 128 characters and not one of the obvious ones. */
export function checkPassword(password: unknown): void {
  if (typeof password !== "string" || password.length < 10) {
    throw new ConvexError("Use at least 10 characters for your password.");
  }
  if (password.length > 128) throw new ConvexError("That password is too long (128 characters at most).");
  const lower = password.toLowerCase();
  if (/^(.)\1+$/.test(password) || /^(?:password|qwerty|letmein|welcome|admin|layersync|syncsite|123456|abc123|iloveyou)/.test(lower) || /^\d+$/.test(password)) {
    throw new ConvexError("That password is too easy to guess. Try a short sentence.");
  }
}

const ResetCode = Resend({
  id: "password-reset",
  maxAge: 15 * 60,
  async generateVerificationToken() {
    const n = new Uint32Array(1);
    crypto.getRandomValues(n);
    return String(n[0] % 100_000_000).padStart(8, "0");
  },
  async sendVerificationRequest({ identifier, token }) {
    const mail = resetCodeEmail(token);
    await sendEmail({ to: identifier, ...mail });
  },
});

const passwordProvider = Password({
      profile(params) {
        const email = normalizeEmail(typeof params.email === "string" ? params.email : undefined);
        if (!email) throw new ConvexError("Enter a valid email address.");
        const name = typeof params.name === "string" ? params.name.replace(/\s+/g, " ").trim().slice(0, 80) : "";
        const invite = typeof params.invite === "string" ? params.invite.slice(0, 200) : "";
        // `invite` is read (and dropped) by createOrUpdateUser below.
        return { email, ...(name ? { name } : {}), ...(invite ? { invite } : {}) } as unknown as { email: string };
      },
      validatePasswordRequirements: checkPassword,
      reset: ResetCode,
    });

/*
 * Guard in front of the password provider. Convex Auth's sign-up flow, given
 * an email that already has an account, checks the password and signs in,
 * without the failed-attempt throttle sign-in has. So before Convex Auth runs:
 * a sign-up needs a valid invitation for that exact address (and a fresh
 * address), and sign-up, reset emails and reset codes are rate-limited per
 * address (convex/invites.ts guardAuthFlow).
 */
type AuthorizeFn = (params: Record<string, unknown>, ctx: GenericActionCtx<DataModel>) => Promise<unknown>;
const passwordOptions = (passwordProvider as unknown as { options: { authorize: AuthorizeFn } }).options;
const passwordAuthorize = passwordOptions.authorize;
passwordOptions.authorize = async (params, ctx) => {
  const flow = typeof params.flow === "string" ? params.flow : "";
  if (flow === "signUp" || flow === "reset" || flow === "reset-verification") {
    const email = normalizeEmail(typeof params.email === "string" ? params.email : undefined) ?? "";
    const token = typeof params.invite === "string" ? params.invite.slice(0, 200) : "";
    const verdict = await ctx.runMutation(internal.invites.guardAuthFlow, {
      flow,
      email,
      tokenHash: token ? await sha256Hex(token) : undefined,
    });
    if (!verdict.ok) throw new ConvexError(verdict.error ?? "That didn't work.");
  }
  return await passwordAuthorize(params, ctx);
};

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [passwordProvider],
  session: {
    // Signed out after two weeks without use, and after 30 days regardless.
    inactiveDurationMs: 14 * DAY_MS,
    totalDurationMs: 30 * DAY_MS,
  },
  signIn: { maxFailedAttempsPerHour: 8 },
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) return args.existingUserId;
      const profile = args.profile as { email?: string; name?: string; invite?: string };
      return await createUserFromInvite(ctx as unknown as MutationCtx, {
        email: profile.email ?? "",
        name: profile.name,
        token: profile.invite,
      });
    },
  },
});

/**
 * Create the account for a new person, from their invitation. Throws (and so
 * rolls back the sign-up) unless the invite is valid for this email.
 */
export async function createUserFromInvite(
  ctx: MutationCtx,
  { email, name, token }: { email: string; name?: string; token?: string },
) {
  if (!token) throw new ConvexError("SyncSite accounts are by invitation. Ask your LayerSync contact for an invite.");
  const tokenHash = await sha256Hex(token);
  const inv = await ctx.db.query("invites").withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash)).unique();
  const now = Date.now();
  if (!inv || inv.revokedAt || inv.acceptedAt || inv.expiresAt < now) {
    throw new ConvexError("This invitation link is no longer valid. Ask for a new one.");
  }
  if (inv.email !== email) throw new ConvexError(`This invitation is for ${inv.email}. Sign up with that address.`);

  const userId = await ctx.db.insert("users", {
    email,
    name: name || email.split("@")[0],
    emailVerificationTime: now,
    isStaff: inv.staff || undefined,
    createdAt: now,
  });
  if (inv.workspaceId) {
    await ctx.db.insert("memberships", {
      workspaceId: inv.workspaceId,
      userId,
      role: inv.role,
      notifyEmail: true,
      notifyPush: true,
      weeklyDigest: inv.role === "owner" || inv.role === "admin",
      createdAt: now,
    });
  }
  await ctx.db.patch("invites", inv._id, { acceptedAt: now });
  await ctx.db.insert("auditLog", {
    workspaceId: inv.workspaceId,
    actorId: userId,
    actorLabel: name || email,
    action: inv.staff ? "staff.joined" : "member.joined",
    detail: `${email} accepted an invitation as ${inv.staff ? "staff" : inv.role}`,
    at: now,
  });
  return userId;
}
