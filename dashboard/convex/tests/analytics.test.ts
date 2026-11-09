import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, internal } from "../_generated/api";
import { dayKey } from "../lib/dates";
import { makeUser, makeWorkspace, meta, setup, UA_IPHONE } from "./fixtures.helper";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-09T08:00:00Z"));
});
afterEach(() => vi.useRealTimers());

describe("ingest", () => {
  it("groups pageviews into one session and records attribution", async () => {
    const t = setup();
    const { siteId, siteKey } = await makeWorkspace(t);
    const first = await t.mutation(internal.ingest.track, {
      meta: meta(siteKey),
      events: [{ t: "pv", id: "pv_000001", p: "/", q: "?utm_source=manychat&utm_campaign=layer-map", r: "https://l.instagram.com/", tz: "Africa/Harare" }],
    });
    expect(first).toEqual({ accepted: 1, status: 202 });
    vi.advanceTimersByTime(60_000);
    await t.mutation(internal.ingest.track, {
      meta: meta(siteKey),
      events: [
        { t: "eng", id: "pv_000001", ms: 15_000, sc: 70 },
        { t: "pv", id: "pv_000002", p: "/sync-estate" },
        { t: "ev", n: "whatsapp", props: { cta: "nav" } },
      ],
    });
    const sessions = await t.run((ctx) => ctx.db.query("sessions").collect());
    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({
      pageviews: 2,
      entryPath: "/",
      exitPath: "/sync-estate",
      engagedMs: 15_000,
      maxScroll: 70,
      events: 1,
      channel: "social",
      source: "ManyChat",
      utmCampaign: "layer-map",
      country: "ZW",
      device: "desktop",
      day: "2026-11-09",
    });
    // No IP or user agent is stored anywhere.
    expect(JSON.stringify(sessions[0])).not.toContain("41.60.1.2");
    const events = await t.run((ctx) => ctx.db.query("events").collect());
    expect(events.map((e) => e.name)).toEqual(["pageview", "pageview", "whatsapp"]);
  });

  it("starts a new session after 30 minutes or for a new campaign", async () => {
    const t = setup();
    const { siteKey } = await makeWorkspace(t);
    await t.mutation(internal.ingest.track, { meta: meta(siteKey), events: [{ t: "pv", id: "pv_a00001", p: "/" }] });
    vi.advanceTimersByTime(31 * 60_000);
    await t.mutation(internal.ingest.track, { meta: meta(siteKey), events: [{ t: "pv", id: "pv_a00002", p: "/" }] });
    await t.mutation(internal.ingest.track, { meta: meta(siteKey), events: [{ t: "pv", id: "pv_a00003", p: "/", q: "?utm_source=newsletter" }] });
    expect(await t.run((ctx) => ctx.db.query("sessions").collect())).toHaveLength(3);
  });

  it("refuses other origins, bots, excluded paths and switched-off sites", async () => {
    const t = setup();
    const { siteId, siteKey } = await makeWorkspace(t);
    const pv = [{ t: "pv" as const, id: "pv_b00001", p: "/" }];
    expect(await t.mutation(internal.ingest.track, { meta: meta(siteKey, { origin: "https://copycat.example" }), events: pv })).toMatchObject({ status: 403 });
    expect(await t.mutation(internal.ingest.track, { meta: meta(siteKey, { origin: undefined }), events: pv })).toMatchObject({ status: 403 });
    expect(await t.mutation(internal.ingest.track, { meta: meta("ss_doesnotexist00"), events: pv })).toMatchObject({ status: 404 });
    expect(await t.mutation(internal.ingest.track, { meta: meta(siteKey, { ua: "facebookexternalhit/1.1" }), events: pv })).toMatchObject({ reason: "bot" });
    expect(await t.mutation(internal.ingest.track, { meta: meta(siteKey), events: [{ t: "pv", id: "pv_b00002", p: "/admin/x" }] })).toMatchObject({ accepted: 0 });
    await t.run((ctx) => ctx.db.patch("sites", siteId, { trackingEnabled: false }));
    expect(await t.mutation(internal.ingest.track, { meta: meta(siteKey), events: pv })).toMatchObject({ reason: "tracking off" });
    expect(await t.run((ctx) => ctx.db.query("sessions").collect())).toHaveLength(0);
  });

  it("counts different visitors separately and the same visitor once", async () => {
    const t = setup();
    const { siteKey } = await makeWorkspace(t);
    await t.mutation(internal.ingest.track, { meta: meta(siteKey, { ip: "1.1.1.1" }), events: [{ t: "pv", id: "pv_c00001", p: "/" }] });
    await t.mutation(internal.ingest.track, { meta: meta(siteKey, { ip: "2.2.2.2", ua: UA_IPHONE }), events: [{ t: "pv", id: "pv_c00002", p: "/" }] });
    // Same pageview id again (a retried beacon) doesn't double count.
    await t.mutation(internal.ingest.track, { meta: meta(siteKey, { ip: "1.1.1.1" }), events: [{ t: "pv", id: "pv_c00001", p: "/" }] });
    const sessions = await t.run((ctx) => ctx.db.query("sessions").collect());
    expect(sessions).toHaveLength(2);
    expect(sessions.map((s) => s.pageviews)).toEqual([1, 1]);
    expect(new Set(sessions.map((s) => s.visitorHash)).size).toBe(2);
  });
});

describe("rollups and the overview", () => {
  it("rolls sessions into the day and serves them to members only", async () => {
    const t = setup();
    const { workspaceId, siteId, siteKey } = await makeWorkspace(t);
    const { as: owner } = await makeUser(t, { email: "kev@layersyncai.com", workspaceId, role: "owner" });
    const { as: outsider } = await makeUser(t, { email: "someone@else.com" });

    await t.mutation(internal.ingest.track, { meta: meta(siteKey, { ip: "1.1.1.1" }), events: [{ t: "pv", id: "pv_d00001", p: "/", r: "https://www.google.com/" }] });
    await t.mutation(internal.ingest.track, { meta: meta(siteKey, { ip: "2.2.2.2", ua: UA_IPHONE }), events: [{ t: "pv", id: "pv_d00002", p: "/contact" }, { t: "pv", id: "pv_d00003", p: "/sync-estate" }] });

    await t.mutation(internal.rollups.tick, {});
    await t.finishAllScheduledFunctions(vi.runAllTimers);

    const day = dayKey(Date.now(), "Africa/Harare");
    const o = await owner.query(api.analytics.overview, { siteId, from: day, to: day });
    expect(o.totals).toMatchObject({ visitors: 2, sessions: 2, pageviews: 3, bounces: 1 });
    expect(o.series).toHaveLength(24);
    expect(o.series[10].sessions).toBe(2);
    expect(o.breakdowns.sources.map((s) => s.k).sort()).toEqual(["Direct", "Google"]);
    expect(o.breakdowns.devices.map((s) => s.k).sort()).toEqual(["desktop", "mobile"]);

    await expect(outsider.query(api.analytics.overview, { siteId, from: day, to: day })).rejects.toThrow(/Not found/);
    await expect(t.query(api.analytics.overview, { siteId, from: day, to: day })).rejects.toThrow(/sign in/);
    await expect(owner.query(api.analytics.overview, { siteId, from: "2020-01-01", to: day })).rejects.toThrow(/year or less/);

    const live = await owner.query(api.analytics.live, { siteId, since: Date.now() - 5 * 60_000 });
    expect(live.visitors).toBe(2);
    expect(live.feed[0]).toMatchObject({ kind: "pageview", path: "/sync-estate", device: "mobile" });
  });

  it("recomputes a busy day in chunks with the same result", async () => {
    const t = setup();
    const { workspaceId, siteId, siteKey } = await makeWorkspace(t);
    const { as: owner } = await makeUser(t, { email: "kev@layersyncai.com", workspaceId });
    for (let i = 0; i < 1200; i++) {
      await t.run(async (ctx) => {
        await ctx.db.insert("sessions", {
          siteId,
          visitorHash: `v${i % 900}`,
          day: "2026-11-09",
          startedAt: Date.now(),
          lastSeenAt: Date.now(),
          entryPath: i % 2 ? "/" : "/contact",
          exitPath: "/",
          pageviews: 1,
          engagedMs: 0,
          maxScroll: 0,
          events: 0,
          eventNames: [],
          pages: [{ path: i % 2 ? "/" : "/contact", at: Date.now(), ms: 0, sc: 0 }],
          channel: "direct",
          source: "Direct",
          device: "mobile",
          browser: "Chrome",
          os: "Android",
          converted: i < 10,
        });
      });
    }
    void siteKey;
    await t.mutation(internal.rollups.recomputeDay, { siteId, day: "2026-11-09" });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    const o = await owner.query(api.analytics.overview, { siteId, from: "2026-11-09", to: "2026-11-09" });
    expect(o.totals).toMatchObject({ sessions: 1200, visitors: 900, pageviews: 1200, conversions: 10 });
    expect(o.breakdowns.pages.find((p) => p.k === "/contact")?.pv).toBe(600);
  });
});
