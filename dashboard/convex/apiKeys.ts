/**
 * API keys for the MCP server (convex/mcp.ts). A key belongs to one
 * workspace and can only ever see that workspace. Keys are 32 random bytes;
 * we store the SHA-256 and show the key once.
 */
import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { actorLabel, audit, creatorStillTrusted, requireWorkspace } from "./access";
import { randomToken, sha256Hex } from "./lib/crypto";

const scopeValidator = v.union(v.literal("read"), v.literal("write"));

export const list = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    await requireWorkspace(ctx, workspaceId, "admin");
    const keys = await ctx.db.query("apiKeys").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).take(100);
    const out = [];
    for (const k of keys) {
      const by = await ctx.db.get("users", k.createdBy);
      out.push({
        _id: k._id,
        name: k.name,
        prefix: k.prefix,
        scopes: k.scopes,
        createdAt: k.createdAt,
        createdBy: by?.name || by?.email || "Unknown",
        lastUsedAt: k.lastUsedAt ?? null,
        expiresAt: k.expiresAt ?? null,
        revokedAt: k.revokedAt ?? null,
      });
    }
    return out.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    scopes: v.array(scopeValidator),
    expiresInDays: v.optional(v.number()),
  },
  returns: v.object({ keyId: v.id("apiKeys"), key: v.string() }),
  handler: async (ctx, args) => {
    const access = await requireWorkspace(ctx, args.workspaceId, "admin");
    const name = args.name.replace(/\s+/g, " ").trim().slice(0, 60);
    if (name.length < 2) throw new ConvexError("Give the key a name, like \"Claude on Kev's laptop\".");
    const scopes = [...new Set(args.scopes)];
    if (!scopes.includes("read")) scopes.unshift("read");
    const live = (await ctx.db.query("apiKeys").withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId)).take(100)).filter((k) => !k.revokedAt);
    if (live.length >= 25) throw new ConvexError("Revoke an old key first (25 at most).");
    let expiresAt: number | undefined;
    if (args.expiresInDays !== undefined) {
      if (!Number.isInteger(args.expiresInDays) || args.expiresInDays < 1 || args.expiresInDays > 730) {
        throw new ConvexError("Expiry must be between 1 and 730 days.");
      }
      expiresAt = Date.now() + args.expiresInDays * 24 * 3_600_000;
    }
    const key = `ssk_${randomToken(32)}`;
    const keyId = await ctx.db.insert("apiKeys", {
      workspaceId: args.workspaceId,
      name,
      prefix: key.slice(0, 12),
      hash: await sha256Hex(key),
      scopes,
      createdBy: access.user._id,
      createdAt: Date.now(),
      expiresAt,
    });
    await audit(ctx, {
      workspaceId: args.workspaceId,
      actorId: access.user._id,
      actorLabel: actorLabel(access.user, access.viaStaff),
      action: "api_key.created",
      detail: `${name} (${scopes.join(", ")})`,
    });
    return { keyId, key };
  },
});

export const revoke = mutation({
  args: { keyId: v.id("apiKeys") },
  returns: v.null(),
  handler: async (ctx, { keyId }) => {
    const k = await ctx.db.get("apiKeys", keyId);
    if (!k) throw new ConvexError("Key not found.");
    const access = await requireWorkspace(ctx, k.workspaceId, "admin");
    if (!k.revokedAt) await ctx.db.patch("apiKeys", keyId, { revokedAt: Date.now() });
    await audit(ctx, {
      workspaceId: k.workspaceId,
      actorId: access.user._id,
      actorLabel: actorLabel(access.user, access.viaStaff),
      action: "api_key.revoked",
      detail: k.name,
    });
    return null;
  },
});

/** The live key with this hash (MCP auth), or null. */
export const byHash = internalQuery({
  args: { hash: v.string(), now: v.number() },
  handler: async (ctx, { hash, now }) => {
    const k = await ctx.db.query("apiKeys").withIndex("by_hash", (q) => q.eq("hash", hash)).unique();
    if (!k || k.revokedAt || (k.expiresAt && k.expiresAt < now)) return null;
    const workspace = await ctx.db.get("workspaces", k.workspaceId);
    if (!workspace) return null;
    // The key only works while the person who made it is still an admin there.
    if (!(await creatorStillTrusted(ctx, k.workspaceId, k.createdBy))) return null;
    return { keyId: k._id, name: k.name, scopes: k.scopes, workspaceId: k.workspaceId, workspaceName: workspace.name, lastUsedAt: k.lastUsedAt ?? 0 };
  },
});

/** Record use, at most every five minutes, so the key list shows "last used". */
export const touch = internalMutation({
  args: { keyId: v.id("apiKeys") },
  returns: v.null(),
  handler: async (ctx, { keyId }) => {
    const k = await ctx.db.get("apiKeys", keyId);
    if (k && (!k.lastUsedAt || Date.now() - k.lastUsedAt > 5 * 60_000)) await ctx.db.patch("apiKeys", keyId, { lastUsedAt: Date.now() });
    return null;
  },
});
