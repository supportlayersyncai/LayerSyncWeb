/**
 * SyncSite's MCP server, at POST https://<deployment>.convex.site/mcp.
 *
 * Connect from Claude Code:
 *   claude mcp add --transport http syncsite https://<deployment>.convex.site/mcp \
 *     --header "Authorization: Bearer ssk_..."
 *
 * Auth is a workspace API key (Settings → Integrations). Read keys can call
 * the read tools; write keys can also update leads, add notes and add leads.
 * Requests from web pages (an Origin header) are refused unless that origin
 * is listed in MCP_ALLOWED_ORIGINS, which protects against DNS rebinding.
 */
import { ConvexError } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { httpAction, type ActionCtx } from "./_generated/server";
import { sha256Hex } from "./lib/crypto";
import {
  checkArgs,
  ERR,
  INSTRUCTIONS,
  negotiateVersion,
  parseDateTime,
  parseMessage,
  rpcError,
  rpcResult,
  SERVER_INFO,
  ToolInputError,
  toolError,
  toolList,
  toolResult,
  TOOLS,
  type JsonRpcRequest,
} from "./lib/mcp";
import { rateLimiter } from "./rateLimits";

type Key = { keyId: Id<"apiKeys">; name: string; scopes: ("read" | "write")[]; workspaceId: Id<"workspaces">; workspaceName: string; lastUsedAt: number };

const JSON_HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store" };

function respond(status: number, body: unknown, extra: Record<string, string> = {}) {
  return new Response(body === null ? null : JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...extra } });
}

function originAllowed(origin: string | null): boolean {
  if (!origin) return true;
  const allowed = (process.env.MCP_ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return allowed.includes(origin);
}

export const handle = httpAction(async (ctx, request) => {
  if (!originAllowed(request.headers.get("Origin"))) return respond(403, { error: "Origin not allowed" });

  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.match(/^Bearer\s+(ssk_[A-Za-z0-9_-]{20,80})$/)?.[1];
  const unauthorized = () =>
    respond(401, { error: "Send a SyncSite API key: Authorization: Bearer ssk_..." }, { "WWW-Authenticate": 'Bearer realm="syncsite"' });
  if (!token) return unauthorized();
  const key = (await ctx.runQuery(internal.apiKeys.byHash, { hash: await sha256Hex(token), now: Date.now() })) as Key | null;
  if (!key) return unauthorized();

  const text = await request.text();
  if (text.length > 64_000) return respond(413, rpcError(null, ERR.invalidRequest, "Request too large"));
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return respond(400, rpcError(null, ERR.parse, "Parse error"));
  }

  // One token per message, so a batch can't multiply the allowance.
  const count = Array.isArray(parsed) ? Math.max(1, Math.min(20, parsed.length)) : 1;
  const limit = await rateLimiter.limit(ctx, "mcpKey", { key: key.keyId, count });
  if (!limit.ok) {
    return respond(429, { error: "Too many requests" }, { "Retry-After": String(Math.ceil((limit.retryAfter ?? 1000) / 1000)) });
  }

  if (Date.now() - key.lastUsedAt > 5 * 60_000) await ctx.runMutation(internal.apiKeys.touch, { keyId: key.keyId });

  // Batches were dropped from the protocol in 2025-06-18; still answer them for older clients.
  const messages = Array.isArray(parsed) ? parsed.slice(0, 20) : [parsed];
  const replies = [];
  for (const raw of messages) {
    const m = parseMessage(raw);
    if (!m.ok) {
      replies.push(rpcError(m.id, ERR.invalidRequest, m.error));
      continue;
    }
    // Notifications (no id) get no reply.
    if (m.msg.id === undefined) continue;
    replies.push(await dispatch(ctx, key, m.msg));
  }
  if (replies.length === 0) return new Response(null, { status: 202 });
  return respond(200, Array.isArray(parsed) ? replies : replies[0]);
});

/** GET (server-sent events) and DELETE (sessions) aren't offered: the server is stateless. */
export const notAllowed = httpAction(async () => respond(405, { error: "Use POST" }, { Allow: "POST" }));

async function dispatch(ctx: ActionCtx, key: Key, msg: JsonRpcRequest) {
  const id = msg.id ?? null;
  switch (msg.method) {
    case "initialize":
      return rpcResult(id, {
        protocolVersion: negotiateVersion(msg.params?.protocolVersion),
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions: `${INSTRUCTIONS}\nThis key belongs to the "${key.workspaceName}" workspace and has ${key.scopes.includes("write") ? "read and write" : "read-only"} access.`,
      });
    case "ping":
      return rpcResult(id, {});
    case "tools/list":
      return rpcResult(id, { tools: toolList() });
    case "tools/call":
      return rpcResult(id, await callTool(ctx, key, msg.params?.name, msg.params?.arguments));
    default:
      return rpcError(id, ERR.methodNotFound, `Method not found: ${msg.method}`);
  }
}

async function callTool(ctx: ActionCtx, key: Key, name: unknown, rawArgs: unknown) {
  const tool = TOOLS.find((t) => t.name === name);
  if (!tool) return toolError(`Unknown tool: ${String(name)}`);
  if (tool.scope === "write" && !key.scopes.includes("write")) {
    return toolError("This API key is read-only. Create a key with write access in SyncSite (Settings → Integrations).");
  }
  const workspaceId = key.workspaceId;
  try {
    const a = checkArgs(tool, rawArgs);
    const s = (k: string) => a[k] as string | undefined;
    const now = Date.now();
    switch (tool.name) {
      case "list_sites":
        return toolResult(await ctx.runQuery(internal.mcpTools.listSites, { workspaceId }));
      case "get_traffic_overview":
        return toolResult(
          await ctx.runQuery(internal.mcpTools.trafficOverview, { workspaceId, siteId: s("site_id"), period: s("period"), from: s("from"), to: s("to"), now }),
        );
      case "get_live_visitors":
        return toolResult(await ctx.runQuery(internal.mcpTools.liveVisitors, { workspaceId, siteId: s("site_id"), now }));
      case "list_leads":
        return toolResult(
          await ctx.runQuery(internal.mcpTools.listLeads, {
            workspaceId,
            status: s("status"),
            query: s("query"),
            limit: a.limit as number | undefined,
            cursor: s("cursor"),
          }),
        );
      case "get_lead":
        return toolResult(await ctx.runQuery(internal.mcpTools.getLead, { workspaceId, leadId: s("lead_id")! }));
      case "get_recent_activity": {
        const since = a.since !== undefined ? parseDateTime(a.since, "since") : now - 24 * 3_600_000;
        return toolResult(await ctx.runQuery(internal.mcpTools.recentActivity, { workspaceId, since, limit: (a.limit as number | undefined) ?? 50 }));
      }
      case "update_lead": {
        const followUpAt = a.follow_up_at === undefined ? undefined : a.follow_up_at === null ? null : parseDateTime(a.follow_up_at, "follow_up_at");
        return toolResult(
          await ctx.runMutation(internal.mcpTools.updateLead, {
            workspaceId,
            keyName: key.name,
            leadId: s("lead_id")!,
            status: s("status") as never,
            followUpAt,
            value: a.value as number | null | undefined,
            tags: a.tags as string[] | undefined,
          }),
        );
      }
      case "add_lead_note":
        return toolResult(await ctx.runMutation(internal.mcpTools.addLeadNote, { workspaceId, keyName: key.name, leadId: s("lead_id")!, note: s("note")! }));
      case "create_lead":
        return toolResult(
          await ctx.runMutation(internal.mcpTools.createLead, {
            workspaceId,
            keyName: key.name,
            name: s("name")!,
            email: s("email"),
            phone: s("phone"),
            company: s("company"),
            note: s("note"),
            status: s("status") as never,
          }),
        );
    }
    return toolError(`Unknown tool: ${tool.name}`);
  } catch (err) {
    if (err instanceof ToolInputError) return toolError(err.message);
    if (err instanceof ConvexError) return toolError(String(err.data));
    console.error("MCP tool failed", tool.name, err);
    return toolError("Something went wrong running that tool.");
  }
}
