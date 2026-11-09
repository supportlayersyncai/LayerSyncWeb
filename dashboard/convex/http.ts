/**
 * HTTP routes on https://<deployment>.convex.site
 *
 *   POST /ingest/events   analytics from the collector edge function
 *   POST /ingest/lead     form sends from the collector edge function
 *   POST /mcp             the MCP server (convex/mcp.ts)
 *   /api/auth/*           Convex Auth
 *
 * The two ingest routes only accept requests carrying the shared
 * SYNCSITE_INGEST_SECRET, i.e. from our own edge function (api/collect.ts),
 * which adds the visitor's IP and country. Browsers never call them directly.
 */
import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { timingSafeEqual } from "./lib/crypto";
import { parseEvents, parseMeta } from "./lib/ingest";
import { handle as mcp, notAllowed as mcpNotAllowed } from "./mcp";

const http = httpRouter();
auth.addHttpRoutes(http);

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

function secretOk(request: Request): boolean {
  const expected = process.env.SYNCSITE_INGEST_SECRET;
  const got = request.headers.get("X-SyncSite-Ingest") ?? "";
  // Unset secret: refuse everything rather than accept anything.
  return !!expected && expected.length >= 32 && timingSafeEqual(got, expected);
}

async function readJson(request: Request, maxBytes: number): Promise<{ ok: true; body: Record<string, unknown> } | { ok: false; res: Response }> {
  const text = await request.text();
  if (text.length > maxBytes) return { ok: false, res: json(413, { ok: false, error: "Too large" }) };
  try {
    const body: unknown = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("not an object");
    return { ok: true, body: body as Record<string, unknown> };
  } catch {
    return { ok: false, res: json(400, { ok: false, error: "Send JSON" }) };
  }
}

http.route({
  path: "/ingest/events",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!secretOk(request)) return json(401, { ok: false });
    const read = await readJson(request, 40_000);
    if (!read.ok) return read.res;
    const meta = parseMeta(read.body.meta);
    if (!meta) return json(400, { ok: false, error: "Bad meta" });
    const events = parseEvents(read.body.events);
    if (events.length === 0) return json(204, { ok: true, accepted: 0 });
    const res = await ctx.runMutation(internal.ingest.track, { meta, events });
    return json(res.status, { ok: res.status < 300, accepted: res.accepted, reason: res.reason });
  }),
});

http.route({
  path: "/ingest/lead",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!secretOk(request)) return json(401, { ok: false });
    const read = await readJson(request, 60_000);
    if (!read.ok) return read.res;
    const meta = parseMeta(read.body.meta);
    if (!meta) return json(400, { ok: false, error: "Bad meta" });
    const lead = read.body.lead as Record<string, unknown> | undefined;
    if (!lead || typeof lead !== "object") return json(400, { ok: false, error: "Missing lead" });

    const rawFields = lead.fields;
    const fields: { key: string; value: string }[] = [];
    const pushField = (k: unknown, val: unknown) => {
      if (typeof k !== "string" || fields.length >= 40) return;
      if (typeof val === "string") fields.push({ key: k.slice(0, 80), value: val.slice(0, 6000) });
      else if (typeof val === "number" || typeof val === "boolean") fields.push({ key: k.slice(0, 80), value: String(val) });
    };
    if (Array.isArray(rawFields)) {
      for (const f of rawFields) {
        if (f && typeof f === "object") pushField((f as { key?: unknown }).key, (f as { value?: unknown }).value);
      }
    } else if (rawFields && typeof rawFields === "object") {
      for (const [k, val] of Object.entries(rawFields)) pushField(k, val);
    }

    const str = (val: unknown, max: number) => (typeof val === "string" ? val.slice(0, max) : undefined);
    const res = await ctx.runMutation(internal.contacts.ingestLead, {
      meta,
      lead: {
        fields,
        form: str(lead.form, 60),
        page: str(lead.page, 300),
        hp: str(lead.hp, 200),
        elapsedMs: typeof lead.elapsedMs === "number" && Number.isFinite(lead.elapsedMs) ? lead.elapsedMs : undefined,
      },
    });
    return json(res.status, { ok: res.ok, ...(res.error ? { error: res.error } : {}) });
  }),
});

http.route({ path: "/mcp", method: "POST", handler: mcp });
http.route({ path: "/mcp", method: "GET", handler: mcpNotAllowed });
http.route({ path: "/mcp", method: "DELETE", handler: mcpNotAllowed });

export default http;
