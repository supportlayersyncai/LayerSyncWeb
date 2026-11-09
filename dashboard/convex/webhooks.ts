/**
 * Outgoing webhooks: POST a signed JSON body to your own systems (a CRM,
 * Zapier, Make, n8n) when a lead arrives or a contact changes. Signing and
 * URL rules are in convex/lib/webhooks.ts. Failed deliveries retry with
 * backoff; a webhook that keeps failing is switched off and admins are told.
 */
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { internalAction, internalMutation, internalQuery, mutation, query, type MutationCtx } from "./_generated/server";
import { actorLabel, audit, creatorStillTrusted, requireWorkspace } from "./access";
import { randomToken } from "./lib/crypto";
import { MAX_CONSECUTIVE_FAILURES, RETRY_DELAYS_MS, signPayload, validateWebhookUrl, WEBHOOK_EVENTS } from "./lib/webhooks";
import { rateLimiter } from "./rateLimits";

const eventsValidator = v.array(v.union(...WEBHOOK_EVENTS.map((e) => v.literal(e))));

export const list = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    await requireWorkspace(ctx, workspaceId, "admin");
    const hooks = await ctx.db.query("webhooks").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).take(20);
    const out = [];
    for (const h of hooks) {
      const recent = await ctx.db
        .query("webhookDeliveries")
        .withIndex("by_webhook_and_createdAt", (q) => q.eq("webhookId", h._id))
        .order("desc")
        .take(10);
      out.push({
        _id: h._id,
        url: h.url,
        description: h.description ?? null,
        events: h.events,
        active: h.active,
        disabledReason: h.disabledReason ?? null,
        consecutiveFailures: h.consecutiveFailures,
        createdAt: h.createdAt,
        // The secret is shown once, at creation. Only its last characters here.
        secretHint: `…${h.secret.slice(-4)}`,
        recent: recent.map((d) => ({
          _id: d._id,
          event: d.event,
          status: d.status,
          attempts: d.attempts,
          responseStatus: d.responseStatus ?? null,
          error: d.error ?? null,
          createdAt: d.createdAt,
        })),
      });
    }
    return out;
  },
});

export const create = mutation({
  args: { workspaceId: v.id("workspaces"), url: v.string(), events: eventsValidator, description: v.optional(v.string()) },
  returns: v.object({ webhookId: v.id("webhooks"), secret: v.string() }),
  handler: async (ctx, args) => {
    const access = await requireWorkspace(ctx, args.workspaceId, "admin");
    const checked = validateWebhookUrl(args.url);
    if (!checked.ok) throw new ConvexError(checked.error);
    if (args.events.length === 0) throw new ConvexError("Pick at least one event.");
    const existing = await ctx.db.query("webhooks").withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId)).take(20);
    if (existing.length >= 10) throw new ConvexError("A workspace can have up to 10 webhooks.");
    const secret = `whsec_${randomToken(24)}`;
    const webhookId = await ctx.db.insert("webhooks", {
      workspaceId: args.workspaceId,
      url: checked.url,
      description: args.description?.trim().slice(0, 100) || undefined,
      secret,
      events: [...new Set(args.events)],
      active: true,
      consecutiveFailures: 0,
      createdBy: access.user._id,
      createdAt: Date.now(),
    });
    await audit(ctx, {
      workspaceId: args.workspaceId,
      actorId: access.user._id,
      actorLabel: actorLabel(access.user, access.viaStaff),
      action: "webhook.created",
      detail: new URL(checked.url).host,
    });
    return { webhookId, secret };
  },
});

export const update = mutation({
  args: { webhookId: v.id("webhooks"), active: v.optional(v.boolean()), events: v.optional(eventsValidator) },
  returns: v.null(),
  handler: async (ctx, { webhookId, active, events }) => {
    const hook = await ctx.db.get("webhooks", webhookId);
    if (!hook) throw new ConvexError("Webhook not found.");
    const access = await requireWorkspace(ctx, hook.workspaceId, "admin");
    const patch: { active?: boolean; events?: string[]; consecutiveFailures?: number; disabledReason?: undefined } = {};
    if (active !== undefined) {
      patch.active = active;
      if (active) {
        patch.consecutiveFailures = 0;
        patch.disabledReason = undefined;
      }
    }
    if (events !== undefined) {
      if (events.length === 0) throw new ConvexError("Pick at least one event.");
      patch.events = [...new Set(events)];
    }
    await ctx.db.patch("webhooks", webhookId, patch);
    await audit(ctx, {
      workspaceId: hook.workspaceId,
      actorId: access.user._id,
      actorLabel: actorLabel(access.user, access.viaStaff),
      action: "webhook.updated",
      detail: new URL(hook.url).host,
    });
    return null;
  },
});

export const remove = mutation({
  args: { webhookId: v.id("webhooks") },
  returns: v.null(),
  handler: async (ctx, { webhookId }) => {
    const hook = await ctx.db.get("webhooks", webhookId);
    if (!hook) throw new ConvexError("Webhook not found.");
    const access = await requireWorkspace(ctx, hook.workspaceId, "admin");
    const deliveries = await ctx.db.query("webhookDeliveries").withIndex("by_webhook_and_createdAt", (q) => q.eq("webhookId", webhookId)).take(1000);
    for (const d of deliveries) await ctx.db.delete("webhookDeliveries", d._id);
    await ctx.db.delete("webhooks", webhookId);
    await audit(ctx, {
      workspaceId: hook.workspaceId,
      actorId: access.user._id,
      actorLabel: actorLabel(access.user, access.viaStaff),
      action: "webhook.deleted",
      detail: new URL(hook.url).host,
    });
    return null;
  },
});

/** Send a test event to one webhook. */
export const sendTest = mutation({
  args: { webhookId: v.id("webhooks") },
  returns: v.null(),
  handler: async (ctx, { webhookId }) => {
    const hook = await ctx.db.get("webhooks", webhookId);
    if (!hook) throw new ConvexError("Webhook not found.");
    const access = await requireWorkspace(ctx, hook.workspaceId, "admin");
    const limit = await rateLimiter.limit(ctx, "webhookTest", { key: access.user._id });
    if (!limit.ok) throw new ConvexError("Slow down a little, then try again.");
    const deliveryId = await ctx.db.insert("webhookDeliveries", {
      webhookId,
      workspaceId: hook.workspaceId,
      event: "test",
      payload: JSON.stringify({ message: "Test delivery from SyncSite. If you can read this, your endpoint works." }),
      status: "pending",
      attempts: 0,
      createdAt: Date.now(),
    });
    await ctx.scheduler.runAfter(0, internal.webhooks.deliver, { deliveryId });
    return null;
  },
});

/** Queue one delivery per active webhook that wants `event`. */
export const dispatch = internalMutation({
  args: { workspaceId: v.id("workspaces"), event: v.string(), payload: v.string() },
  returns: v.null(),
  handler: async (ctx, { workspaceId, event, payload }) => {
    const hooks = await ctx.db.query("webhooks").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).take(20);
    const now = Date.now();
    for (const h of hooks) {
      if (!h.active || !h.events.includes(event)) continue;
      // Only while the person who added it is still an admin there.
      if (!(await creatorStillTrusted(ctx, workspaceId, h.createdBy))) {
        await ctx.db.patch("webhooks", h._id, { active: false, disabledReason: "Its creator is no longer an admin of this workspace" });
        continue;
      }
      const deliveryId = await ctx.db.insert("webhookDeliveries", {
        webhookId: h._id,
        workspaceId,
        event,
        payload,
        status: "pending",
        attempts: 0,
        createdAt: now,
      });
      await ctx.scheduler.runAfter(0, internal.webhooks.deliver, { deliveryId });
    }
    return null;
  },
});

export const loadDelivery = internalQuery({
  args: { deliveryId: v.id("webhookDeliveries") },
  handler: async (ctx, { deliveryId }) => {
    const d = await ctx.db.get("webhookDeliveries", deliveryId);
    if (!d) return null;
    const hook = await ctx.db.get("webhooks", d.webhookId);
    if (!hook) return null;
    return { delivery: d, hook };
  },
});

export const recordAttempt = internalMutation({
  args: {
    deliveryId: v.id("webhookDeliveries"),
    ok: v.boolean(),
    responseStatus: v.optional(v.number()),
    error: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { deliveryId, ok, responseStatus, error }) => {
    const d = await ctx.db.get("webhookDeliveries", deliveryId);
    if (!d) return null;
    const hook = await ctx.db.get("webhooks", d.webhookId);
    const attempts = d.attempts + 1;
    const now = Date.now();
    const retryable = !ok && attempts <= RETRY_DELAYS_MS.length && d.event !== "test" && hook?.active;
    await ctx.db.patch("webhookDeliveries", deliveryId, {
      attempts,
      lastAttemptAt: now,
      responseStatus,
      error: error?.slice(0, 300),
      status: ok ? "succeeded" : retryable ? "pending" : "failed",
    });
    if (!hook || d.event === "test") return null;
    if (ok) {
      if (hook.consecutiveFailures) await ctx.db.patch("webhooks", hook._id, { consecutiveFailures: 0 });
      return null;
    }
    const failures = hook.consecutiveFailures + 1;
    if (failures >= MAX_CONSECUTIVE_FAILURES && hook.active) {
      await ctx.db.patch("webhooks", hook._id, {
        consecutiveFailures: failures,
        active: false,
        disabledReason: `Switched off after ${failures} failed deliveries in a row`,
      });
      await notifyAdmins(ctx, hook.workspaceId, `A webhook was switched off`, `${new URL(hook.url).host} failed ${failures} times in a row.`);
    } else {
      await ctx.db.patch("webhooks", hook._id, { consecutiveFailures: failures });
    }
    if (retryable) {
      await ctx.scheduler.runAfter(RETRY_DELAYS_MS[attempts - 1], internal.webhooks.deliver, { deliveryId });
    }
    return null;
  },
});

async function notifyAdmins(
  ctx: MutationCtx,
  workspaceId: Id<"workspaces">,
  title: string,
  body: string,
) {
  const workspace = await ctx.db.get("workspaces", workspaceId);
  if (!workspace) return;
  const members = await ctx.db.query("memberships").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).take(200);
  for (const m of members) {
    if (m.role !== "admin" && m.role !== "owner") continue;
    await ctx.db.insert("notifications", {
      userId: m.userId,
      workspaceId,
      kind: "system",
      title,
      body,
      url: `/${workspace.slug}/settings/integrations`,
      createdAt: Date.now(),
    });
  }
}

/** POST one delivery. Never follows redirects (they could point anywhere). */
export const deliver = internalAction({
  args: { deliveryId: v.id("webhookDeliveries") },
  returns: v.null(),
  handler: async (ctx, { deliveryId }) => {
    const loaded = await ctx.runQuery(internal.webhooks.loadDelivery, { deliveryId });
    if (!loaded || loaded.delivery.status !== "pending") return null;
    const { delivery, hook } = loaded;
    if (!hook.active && delivery.event !== "test") {
      await ctx.runMutation(internal.webhooks.recordAttempt, { deliveryId, ok: false, error: "Webhook is switched off" });
      return null;
    }
    const checked = validateWebhookUrl(hook.url);
    if (!checked.ok) {
      await ctx.runMutation(internal.webhooks.recordAttempt, { deliveryId, ok: false, error: checked.error });
      return null;
    }
    const body = JSON.stringify({ id: delivery._id, event: delivery.event, created_at: new Date(delivery.createdAt).toISOString(), data: JSON.parse(delivery.payload) });
    const ts = Math.floor(Date.now() / 1000);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(checked.url, {
        method: "POST",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "SyncSite-Webhooks/1.0",
          "SyncSite-Event": delivery.event,
          "SyncSite-Delivery": delivery._id,
          "SyncSite-Signature": await signPayload(hook.secret, body, ts),
        },
        body,
      });
      const ok = res.status >= 200 && res.status < 300;
      await ctx.runMutation(internal.webhooks.recordAttempt, {
        deliveryId,
        ok,
        responseStatus: res.status,
        error: ok ? undefined : res.status >= 300 && res.status < 400 ? "Redirects aren't followed" : `HTTP ${res.status}`,
      });
    } catch (err) {
      const message = controller.signal.aborted ? "Timed out after 10 seconds" : err instanceof Error ? err.message : "Network error";
      await ctx.runMutation(internal.webhooks.recordAttempt, { deliveryId, ok: false, error: message });
    } finally {
      clearTimeout(timer);
    }
    return null;
  },
});
