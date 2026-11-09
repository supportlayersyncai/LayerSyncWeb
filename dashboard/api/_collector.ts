/**
 * The collector: a Vercel Edge Function between the tracker and Convex.
 *
 * Browsers post here (api/collect, api/lead). We add what only the edge
 * knows (the visitor's IP and country, from headers Vercel sets and that a
 * client can't forge) and forward to Convex with the shared ingest secret.
 * Convex turns the IP into a daily-salted hash and forgets it.
 *
 * Env (Vercel project): CONVEX_SITE_URL (https://<deployment>.convex.site)
 * and SYNCSITE_INGEST_SECRET (same value as in Convex).
 *
 * Files starting with "_" in api/ aren't deployed as functions.
 */

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const LIMITS = { events: 32_000, lead: 48_000 } as const;

function reply(status: number, body?: unknown): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

/** The visitor's IP as Vercel saw it. Vercel overwrites these headers, so clients can't spoof them. */
export function clientIp(headers: Headers): string | undefined {
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  const fwd = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || undefined;
}

type Env = { convexSiteUrl?: string; secret?: string; fetchImpl?: typeof fetch };

export async function collect(request: Request, kind: "events" | "lead", env: Env = {}): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (request.method !== "POST") return reply(405, { ok: false, error: "Use POST" });

  const convex = (env.convexSiteUrl ?? process.env.CONVEX_SITE_URL ?? "").replace(/\/+$/, "");
  const secret = env.secret ?? process.env.SYNCSITE_INGEST_SECRET ?? "";
  if (!convex || secret.length < 32) return reply(503, { ok: false, error: "Not configured" });

  const text = await request.text();
  if (text.length > LIMITS[kind]) return reply(413, { ok: false, error: "Too large" });
  let body: { k?: unknown; e?: unknown; lead?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    return reply(400, { ok: false, error: "Send JSON" });
  }
  if (!body || typeof body !== "object" || typeof body.k !== "string") return reply(400, { ok: false, error: "Missing site key" });

  const h = request.headers;
  const meta = {
    siteKey: body.k,
    origin: h.get("origin") ?? undefined,
    ip: clientIp(h),
    ua: h.get("user-agent") ?? "",
    country: h.get("x-vercel-ip-country") ?? undefined,
    region: h.get("x-vercel-ip-country-region") ?? undefined,
    city: h.get("x-vercel-ip-city") ?? undefined,
  };
  const payload = kind === "events" ? { meta, events: body.e } : { meta, lead: body.lead };

  let upstream: Response;
  try {
    upstream = await (env.fetchImpl ?? fetch)(`${convex}/ingest/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-SyncSite-Ingest": secret },
      body: JSON.stringify(payload),
    });
  } catch {
    return reply(502, { ok: false, error: "Couldn't reach the server. Please try again." });
  }
  // Analytics: the tracker doesn't read the answer, so don't tell anyone why something was dropped.
  if (kind === "events") return reply(upstream.status === 429 ? 429 : 202);
  const out = (await upstream.json().catch(() => ({ ok: upstream.ok }))) as { ok?: boolean; error?: string };
  return reply(upstream.status, { ok: !!out.ok, ...(out.error ? { error: out.error } : {}) });
}
