/// <reference types="vite/client" />
/**
 * Test fixtures: a convex-test instance with the rate limiter mounted, and
 * helpers to make workspaces, sites and signed-in members.
 */
import rateLimiter from "@convex-dev/rate-limiter/test";
import { convexTest } from "convex-test";
import type { Id } from "../_generated/dataModel";
import schema from "../schema";
import type { Role } from "../lib/roles";

export const modules = import.meta.glob("../**/*.ts");

export function setup() {
  const t = convexTest(schema, modules);
  rateLimiter.register(t);
  return t;
}

export type T = ReturnType<typeof setup>;

export async function makeWorkspace(t: T, opts: { slug?: string; domains?: string[] } = {}) {
  return await t.run(async (ctx) => {
    const now = Date.now();
    const workspaceId = await ctx.db.insert("workspaces", {
      name: opts.slug ? `Client ${opts.slug}` : "LayerSync",
      slug: opts.slug ?? "layersync",
      defaultCountryCode: "263",
      currency: "USD",
      createdAt: now,
    });
    await ctx.db.insert("contactCounts", { workspaceId, new: 0, contacted: 0, qualified: 0, won: 0, lost: 0, spam: 0 });
    const siteId = await ctx.db.insert("sites", {
      workspaceId,
      name: "layersyncai.com",
      domains: opts.domains ?? ["layersyncai.com"],
      publicKey: `ss_test${(opts.slug ?? "layersync").replace(/[^a-z0-9]/g, "")}key1234`,
      timezone: "Africa/Harare",
      trackingEnabled: true,
      allowLocalhost: false,
      excludePaths: ["/admin"],
      createdAt: now,
    });
    const site = (await ctx.db.get("sites", siteId))!;
    return { workspaceId, siteId, siteKey: site.publicKey };
  });
}

export async function makeUser(
  t: T,
  opts: { email: string; workspaceId?: Id<"workspaces">; role?: Role; staff?: boolean; notifyEmail?: boolean; notifyPush?: boolean },
) {
  const userId = await t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", { email: opts.email, name: opts.email.split("@")[0], isStaff: opts.staff || undefined, createdAt: Date.now() });
    if (opts.workspaceId) {
      await ctx.db.insert("memberships", {
        workspaceId: opts.workspaceId,
        userId,
        role: opts.role ?? "owner",
        notifyEmail: opts.notifyEmail ?? true,
        notifyPush: opts.notifyPush ?? false,
        weeklyDigest: true,
        createdAt: Date.now(),
      });
    }
    return userId;
  });
  // Convex Auth's subject is "<userId>|<sessionId>".
  return { userId, as: t.withIdentity({ subject: `${userId}|session1`, tokenIdentifier: `test|${userId}` }) };
}

export const UA_CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
export const UA_IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

export function meta(siteKey: string, over: Partial<{ origin: string; ip: string; ua: string; country: string }> = {}) {
  return { siteKey, origin: "https://www.layersyncai.com", ip: "41.60.1.2", ua: UA_CHROME, country: "ZW", ...over };
}
