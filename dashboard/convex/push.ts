/**
 * Web Push subscriptions (browsers and installed PWAs). Sending happens in
 * convex/pushSender.ts (Node runtime, for the web-push library).
 *
 * Convex env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT
 * (generate with `npx web-push generate-vapid-keys`).
 */
import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { requireUser } from "./access";

/** The public VAPID key the browser subscribes with, or null when push isn't set up. */
/**
 * Only the browsers' own push services. The sender POSTs to this URL, so an
 * arbitrary one would let a signed-in user aim our server at anything.
 */
const PUSH_HOSTS = /^(fcm\.googleapis\.com|android\.googleapis\.com|updates\.push\.services\.mozilla\.com|updates-autopush\.stage\.mozaws\.net|web\.push\.apple\.com|[a-z0-9-]+\.notify\.windows\.com|[a-z0-9-]+\.push\.apple\.com)$/;
export function isPushServiceUrl(endpoint: string): boolean {
  if (endpoint.length > 1000) return false;
  try {
    const u = new URL(endpoint);
    return u.protocol === "https:" && !u.port && !u.username && PUSH_HOSTS.test(u.hostname);
  } catch {
    return false;
  }
}

export const config = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async () => process.env.VAPID_PUBLIC_KEY || null,
});

export const subscribe = mutation({
  args: { endpoint: v.string(), p256dh: v.string(), auth: v.string(), userAgent: v.optional(v.string()) },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    if (!isPushServiceUrl(args.endpoint) || args.p256dh.length > 200 || args.auth.length > 100) {
      throw new ConvexError("That push subscription doesn't look right.");
    }
    const existing = await ctx.db.query("pushSubscriptions").withIndex("by_endpoint", (q) => q.eq("endpoint", args.endpoint)).unique();
    if (existing) {
      await ctx.db.patch("pushSubscriptions", existing._id, { userId: user._id, p256dh: args.p256dh, auth: args.auth });
      return null;
    }
    const mine = await ctx.db.query("pushSubscriptions").withIndex("by_user", (q) => q.eq("userId", user._id)).take(20);
    // Keep the newest ten devices per person.
    if (mine.length >= 10) {
      const oldest = [...mine].sort((a, b) => a.createdAt - b.createdAt)[0];
      await ctx.db.delete("pushSubscriptions", oldest._id);
    }
    await ctx.db.insert("pushSubscriptions", {
      userId: user._id,
      endpoint: args.endpoint,
      p256dh: args.p256dh,
      auth: args.auth,
      userAgent: args.userAgent?.slice(0, 300),
      createdAt: Date.now(),
    });
    return null;
  },
});

export const unsubscribe = mutation({
  args: { endpoint: v.string() },
  returns: v.null(),
  handler: async (ctx, { endpoint }) => {
    const user = await requireUser(ctx);
    const existing = await ctx.db.query("pushSubscriptions").withIndex("by_endpoint", (q) => q.eq("endpoint", endpoint)).unique();
    if (existing && existing.userId === user._id) await ctx.db.delete("pushSubscriptions", existing._id);
    return null;
  },
});

/** Whether this browser (by endpoint) is subscribed for me. */
export const isSubscribed = query({
  args: { endpoint: v.string() },
  returns: v.boolean(),
  handler: async (ctx, { endpoint }) => {
    const user = await requireUser(ctx);
    const existing = await ctx.db.query("pushSubscriptions").withIndex("by_endpoint", (q) => q.eq("endpoint", endpoint)).unique();
    return !!existing && existing.userId === user._id;
  },
});

export const forUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.query("pushSubscriptions").withIndex("by_user", (q) => q.eq("userId", userId)).take(20);
  },
});

export const removeEndpoint = internalMutation({
  args: { endpoint: v.string() },
  returns: v.null(),
  handler: async (ctx, { endpoint }) => {
    const existing = await ctx.db.query("pushSubscriptions").withIndex("by_endpoint", (q) => q.eq("endpoint", endpoint)).unique();
    if (existing) await ctx.db.delete("pushSubscriptions", existing._id);
    return null;
  },
});
