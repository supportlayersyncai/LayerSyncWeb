import { describe, expect, it } from "vitest";
import { clientIp, collect } from "./_collector";

const SECRET = "x".repeat(40);

function fakeUpstream(status = 202, body: unknown = { ok: true }) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fetchImpl = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(JSON.stringify(body), { status });
  }) as unknown as typeof fetch;
  return { calls, fetchImpl };
}

const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://dashboard.layersyncai.com/api/collect", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: {
      "content-type": "text/plain",
      origin: "https://layersyncai.com",
      "user-agent": "Mozilla/5.0 Chrome/131",
      "x-real-ip": "41.60.1.2",
      "x-vercel-ip-country": "ZW",
      "x-vercel-ip-city": "Harare",
      ...headers,
    },
  });

describe("collector", () => {
  it("adds IP, country and origin, and forwards with the secret", async () => {
    const up = fakeUpstream();
    const res = await collect(req({ k: "ss_abc", e: [{ t: "pv" }] }), "events", { convexSiteUrl: "https://x.convex.site/", secret: SECRET, fetchImpl: up.fetchImpl });
    expect(res.status).toBe(202);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    expect(up.calls[0].url).toBe("https://x.convex.site/ingest/events");
    expect((up.calls[0].init.headers as Record<string, string>)["X-SyncSite-Ingest"]).toBe(SECRET);
    const sent = JSON.parse(String(up.calls[0].init.body));
    expect(sent.meta).toEqual({
      siteKey: "ss_abc",
      origin: "https://layersyncai.com",
      ip: "41.60.1.2",
      ua: "Mozilla/5.0 Chrome/131",
      country: "ZW",
      city: "Harare",
    });
    expect(sent.events).toEqual([{ t: "pv" }]);
  });

  it("passes lead validation errors back to the form", async () => {
    const up = fakeUpstream(400, { ok: false, error: "Please enter a valid email address." });
    const res = await collect(req({ k: "ss_abc", lead: { fields: {} } }), "lead", { convexSiteUrl: "https://x.convex.site", secret: SECRET, fetchImpl: up.fetchImpl });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "Please enter a valid email address." });
  });

  it("refuses bad input and missing configuration", async () => {
    const up = fakeUpstream();
    const env = { convexSiteUrl: "https://x.convex.site", secret: SECRET, fetchImpl: up.fetchImpl };
    expect((await collect(req("{bad"), "events", env)).status).toBe(400);
    expect((await collect(req({ e: [] }), "events", env)).status).toBe(400);
    expect((await collect(req({ k: "ss_a", e: "x".repeat(40_000) }), "events", env)).status).toBe(413);
    expect((await collect(req({ k: "ss_a" }), "events", { ...env, secret: "short" })).status).toBe(503);
    expect((await collect(new Request("https://d/api/collect", { method: "GET" }), "events", env)).status).toBe(405);
    expect((await collect(new Request("https://d/api/collect", { method: "OPTIONS" }), "events", env)).status).toBe(204);
    expect(up.calls).toHaveLength(0);
  });

  it("reads the IP Vercel sets", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }))).toBe("1.2.3.4");
    expect(clientIp(new Headers({ "x-real-ip": "5.6.7.8", "x-forwarded-for": "1.2.3.4" }))).toBe("5.6.7.8");
    expect(clientIp(new Headers())).toBeUndefined();
  });
});
