"use node";
/**
 * Sends Web Push notifications. Node runtime because web-push uses Node's
 * crypto for VAPID signing and payload encryption. Without VAPID keys this
 * is a no-op, so leads still arrive by email and in the dashboard.
 */
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { isPushServiceUrl } from "./push";

export const sendToUser = internalAction({
  args: { userId: v.id("users"), title: v.string(), body: v.string(), url: v.string(), tag: v.optional(v.string()) },
  returns: v.object({ sent: v.number(), pruned: v.number() }),
  handler: async (ctx, args) => {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || "mailto:support@layersyncai.com";
    if (!publicKey || !privateKey) return { sent: 0, pruned: 0 };
    // Loaded only when push is configured.
    const webpush = (await import("web-push")).default;
    webpush.setVapidDetails(subject, publicKey, privateKey);

    const subs = await ctx.runQuery(internal.push.forUser, { userId: args.userId });
    const payload = JSON.stringify({ title: args.title, body: args.body, url: args.url, tag: args.tag });
    let sent = 0;
    let pruned = 0;
    for (const s of subs) {
      // Belt and braces: only ever POST to a browser push service.
      if (!isPushServiceUrl(s.endpoint)) {
        await ctx.runMutation(internal.push.removeEndpoint, { endpoint: s.endpoint });
        pruned++;
        continue;
      }
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 3600, urgency: "high" });
        sent++;
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        // Gone or not found: the browser unsubscribed. Anything else, try next time.
        if (status === 404 || status === 410) {
          await ctx.runMutation(internal.push.removeEndpoint, { endpoint: s.endpoint });
          pruned++;
        } else {
          console.warn(`push failed (${status ?? "network"})`);
        }
      }
    }
    return { sent, pruned };
  },
});
