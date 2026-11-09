import { describe, expect, it } from "vitest";
import { addDays, dayKey, daySpan, isValidTimeZone, startOfDayMs } from "../lib/dates";
import { hostAllowed, hostFromOrigin, normalizeDomain } from "../lib/domains";
import { resolveCountry } from "../lib/geo";
import { cleanEventName, cleanProps, parseEvents, parseMeta } from "../lib/ingest";
import { cleanLead, normalizeEmail, normalizePhone } from "../lib/leads";
import { checkArgs, negotiateVersion, parseMessage, TOOLS, ToolInputError } from "../lib/mcp";
import { cleanPath, isExcluded, readCampaign } from "../lib/paths";
import { classifyVisit } from "../lib/referrer";
import { canManageRole, hasRole } from "../lib/roles";
import { computeDay, isBounce, mergeBreakdowns, OTHER, topRows, type SessionLike } from "../lib/rollup";
import { isBot, parseUserAgent } from "../lib/ua";
import { signPayload, validateWebhookUrl, verifySignature } from "../lib/webhooks";
import { UA_CHROME, UA_IPHONE } from "./fixtures.helper";

describe("paths", () => {
  it("drops query strings, fragments and trailing slashes", () => {
    expect(cleanPath("/sync-estate/?utm_source=fb#tour")).toBe("/sync-estate");
    expect(cleanPath("https://layersyncai.com/contact")).toBe("/contact");
    expect(cleanPath("")).toBe("/");
  });
  it("masks emails, phone numbers and tokens", () => {
    expect(cleanPath("/unsubscribe/tendai@example.com")).toBe("/unsubscribe/[email]");
    expect(cleanPath("/orders/0775187682/view")).toBe("/orders/[number]/view");
    expect(cleanPath("/reset/a8Fk29dLqP03mZxV7bN1cT5yR")).toBe("/reset/[id]");
    expect(cleanPath("/blog/how-we-built-syncestate-for-agencies")).toBe("/blog/how-we-built-syncestate-for-agencies");
  });
  it("reads utm tags and click ids only", () => {
    const c = readCampaign("?utm_source=facebook&utm_medium=paid_social&utm_campaign=Nov&email=x@y.com&gclid=1");
    expect(c.utm).toEqual({ source: "facebook", medium: "paid_social", campaign: "Nov" });
    expect(c.clickIds.gclid).toBe(true);
  });
  it("excludes path prefixes", () => {
    expect(isExcluded("/admin/users", ["/admin"])).toBe(true);
    expect(isExcluded("/administrator", ["/admin"])).toBe(false);
    expect(isExcluded("/preview-123", ["/preview*"])).toBe(true);
  });
});

describe("referrer classification", () => {
  const own = ["layersyncai.com"];
  it("classifies search, social, AI and direct", () => {
    expect(classifyVisit("https://www.google.co.zw/", {}, own)).toMatchObject({ channel: "search", source: "Google" });
    expect(classifyVisit("https://l.instagram.com/", {}, own)).toMatchObject({ channel: "social", source: "Instagram" });
    expect(classifyVisit("https://chatgpt.com/", {}, own)).toMatchObject({ channel: "ai", source: "ChatGPT" });
    expect(classifyVisit(undefined, {}, own)).toMatchObject({ channel: "direct", source: "Direct" });
    expect(classifyVisit("android-app://com.whatsapp", {}, own)).toMatchObject({ channel: "social", source: "WhatsApp" });
  });
  it("treats the site's own pages as direct", () => {
    expect(classifyVisit("https://www.layersyncai.com/about", {}, own).channel).toBe("direct");
  });
  it("prefers utm tags and spots paid traffic", () => {
    expect(classifyVisit(undefined, { source: "manychat", medium: "dm" }, own)).toMatchObject({ source: "ManyChat", channel: "social" });
    expect(classifyVisit("https://facebook.com", { source: "fb", medium: "cpc" }, own).channel).toBe("paid");
    expect(classifyVisit(undefined, {}, own, { gclid: true })).toMatchObject({ channel: "paid", source: "Google Ads" });
    expect(classifyVisit(undefined, { source: "newsletter", medium: "email" }, own).channel).toBe("email");
  });
});

describe("user agents", () => {
  it("parses devices and browsers", () => {
    expect(parseUserAgent(UA_CHROME)).toEqual({ device: "desktop", browser: "Chrome", os: "Windows" });
    expect(parseUserAgent(UA_IPHONE)).toEqual({ device: "mobile", browser: "Safari", os: "iOS" });
    expect(parseUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Instagram 300.0").browser).toBe("Instagram app");
  });
  it("spots bots and previewers", () => {
    expect(isBot("WhatsApp/2.23.20.0 A")).toBe(true);
    expect(isBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBe(true);
    expect(isBot("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0 Safari/537.36")).toBe(true);
    expect(isBot(UA_CHROME)).toBe(false);
  });
});

describe("domains", () => {
  it("normalises what people type", () => {
    expect(normalizeDomain("https://www.LayerSyncAI.com/path")).toBe("layersyncai.com");
    expect(normalizeDomain("*.example.co.zw")).toBe("*.example.co.zw");
    expect(normalizeDomain("not a domain")).toBeNull();
  });
  it("matches origins", () => {
    expect(hostAllowed(hostFromOrigin("https://www.layersyncai.com"), ["layersyncai.com"])).toBe(true);
    expect(hostAllowed(hostFromOrigin("https://evil-layersyncai.com"), ["layersyncai.com"])).toBe(false);
    expect(hostAllowed(hostFromOrigin("https://shop.example.com"), ["*.example.com"])).toBe(true);
    expect(hostAllowed(hostFromOrigin("http://localhost:3000"), ["example.com"])).toBe(false);
    expect(hostAllowed(hostFromOrigin("http://localhost:3000"), ["example.com"], true)).toBe(true);
    expect(hostAllowed(undefined, ["example.com"])).toBe(false);
  });
});

describe("dates", () => {
  it("buckets by the site's day", () => {
    // 23:30 UTC on 8 Nov is 01:30 on 9 Nov in Harare.
    expect(dayKey(Date.UTC(2026, 10, 8, 23, 30), "Africa/Harare")).toBe("2026-11-09");
    expect(dayKey(Date.UTC(2026, 10, 8, 23, 30), "UTC")).toBe("2026-11-08");
    expect(startOfDayMs("2026-11-09", "Africa/Harare")).toBe(Date.UTC(2026, 10, 8, 22, 0));
  });
  it("does calendar arithmetic", () => {
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(daySpan("2026-11-01", "2026-11-30")).toBe(30);
    expect(isValidTimeZone("Africa/Harare")).toBe(true);
    expect(isValidTimeZone("Mars/Base")).toBe(false);
  });
  it("falls back to the time zone for country", () => {
    expect(resolveCountry(undefined, "Africa/Harare")).toBe("ZW");
    expect(resolveCountry("za", "Africa/Harare")).toBe("ZA");
    expect(resolveCountry("XX", undefined)).toBeUndefined();
  });
});

describe("tracker payload parsing", () => {
  it("keeps valid events and drops junk", () => {
    const events = parseEvents([
      { t: "pv", id: "abcdef123", p: "/", r: "https://google.com", w: 99999 },
      { t: "pv", id: "x", p: "/" },
      { t: "eng", id: "abcdef123", ms: 99_999_999, sc: 140 },
      { t: "ev", n: "WhatsApp Click", props: { href: "wa.me", email: "a@b.co", "bad key": 1 } },
      { t: "ev", n: "<script>" },
      "nonsense",
    ]);
    expect(events).toHaveLength(3);
    expect(events[0]).toMatchObject({ t: "pv", w: 10000 });
    expect(events[1]).toMatchObject({ t: "eng", ms: 30 * 60 * 1000, sc: 100 });
    expect(events[2]).toMatchObject({ t: "ev", n: "whatsapp_click", props: { href: "wa.me", email: "[email]" } });
  });
  it("validates names, props and meta", () => {
    expect(cleanEventName("download")).toBe("download");
    expect(cleanEventName("")).toBeUndefined();
    expect(cleanProps({ a: "1", b: 2, c: true })).toEqual({ a: "1", b: "2", c: "true" });
    expect(parseMeta({ siteKey: "bad", ua: UA_CHROME })).toBeNull();
    expect(parseMeta({ siteKey: "ss_abcdefghijkl", ua: UA_CHROME, ip: "1.2.3.4" })).toMatchObject({ ip: "1.2.3.4" });
  });
});

describe("lead cleaning", () => {
  it("picks out the usual fields", () => {
    const r = cleanLead({
      form: "Diagnostic",
      fields: { name: " Tendai  Moyo ", email: "TENDAI@Example.com", whatsapp: "077 518 7682", business: "Moyo Realty", blindSpot: "Leads get lost" },
      elapsedMs: 20_000,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value).toMatchObject({
      form: "diagnostic",
      name: "Tendai Moyo",
      email: "tendai@example.com",
      phone: "+263775187682",
      company: "Moyo Realty",
      message: "Leads get lost",
      spam: false,
    });
  });
  it("joins first and last names and drops sensitive fields", () => {
    const r = cleanLead({ fields: [{ key: "first_name", value: "Rudo" }, { key: "last_name", value: "Chikwanha" }, { key: "phone", value: "+27 82 123 4567" }, { key: "password", value: "hunter2" }, { key: "_csrf", value: "x" }] });
    expect(r.ok && r.value.name).toBe("Rudo Chikwanha");
    expect(r.ok && r.value.fields.map((f) => f.key)).toEqual(["first_name", "last_name", "phone"]);
  });
  it("needs a way to reply", () => {
    expect(cleanLead({ fields: { name: "No Contact" } })).toEqual({ ok: false, error: expect.stringContaining("email address or a phone") });
    expect(cleanLead({ fields: { email: "nope" } })).toEqual({ ok: false, error: "Please enter a valid email address." });
  });
  it("flags spam without telling the bot", () => {
    const hp = cleanLead({ fields: { email: "bot@spam.io" }, hp: "http://x" });
    expect(hp.ok && hp.value.spam).toBe(true);
    const fast = cleanLead({ fields: { email: "bot@spam.io" }, elapsedMs: 300 });
    expect(fast.ok && fast.value.spamReason).toBe("Sent too fast to be typed");
    const links = cleanLead({ fields: { email: "a@b.co", message: "http://a http://b http://c http://d" } });
    expect(links.ok && links.value.spam).toBe(true);
  });
  it("normalises phones and emails", () => {
    expect(normalizePhone("0775187682")).toBe("+263775187682");
    expect(normalizePhone("263775187682")).toBe("+263775187682");
    expect(normalizePhone("00 44 7700 900123")).toBe("+447700900123");
    expect(normalizePhone("12345")).toBeUndefined();
    expect(normalizeEmail("a@b")).toBeUndefined();
  });
});

describe("rollups", () => {
  const base: SessionLike = {
    visitorHash: "v1",
    startedAt: Date.UTC(2026, 10, 9, 8, 0),
    pageviews: 1,
    engagedMs: 2000,
    maxScroll: 40,
    events: 0,
    converted: false,
    channel: "search",
    source: "Google",
    country: "ZW",
    device: "mobile",
    browser: "Chrome",
    os: "Android",
    entryPath: "/",
    exitPath: "/",
    pages: [{ path: "/", at: Date.UTC(2026, 10, 9, 8, 0), ms: 2000, sc: 40 }],
  };
  it("defines a bounce like GA4", () => {
    expect(isBounce(base)).toBe(true);
    expect(isBounce({ ...base, engagedMs: 12_000 })).toBe(false);
    expect(isBounce({ ...base, events: 1 })).toBe(false);
    expect(isBounce({ ...base, pageviews: 2 })).toBe(false);
  });
  it("computes a day", () => {
    const day = computeDay(
      [
        base,
        { ...base, visitorHash: "v1", startedAt: base.startedAt + 3_600_000 },
        {
          ...base,
          visitorHash: "v2",
          pageviews: 2,
          converted: true,
          engagedMs: 40_000,
          channel: "direct",
          source: "Direct",
          device: "desktop",
          exitPath: "/contact",
          pages: [
            { path: "/", at: base.startedAt, ms: 10_000, sc: 80 },
            { path: "/contact", at: base.startedAt + 60_000, ms: 30_000, sc: 100 },
          ],
          maxScroll: 100,
        },
      ],
      "Africa/Harare",
    );
    expect(day).toMatchObject({ visitors: 2, sessions: 3, pageviews: 4, bounces: 2, conversions: 1, engagedMs: 44_000 });
    expect(day.hourlySessions[10]).toBe(2); // 08:00 UTC is 10:00 in Harare
    const home = day.pages.find((p) => p.k === "/")!;
    expect(home).toMatchObject({ pv: 3, s: 3, en: 3, ex: 2, b: 2 });
    expect(day.channels.find((c) => c.k === "direct")).toMatchObject({ s: 1, c: 1 });
    expect(day.scroll.find((s) => s.k === "mobile")).toMatchObject({ n: 2, sum: 80 });
  });
  it("keeps the top rows and folds the rest", () => {
    const rows = Array.from({ length: 5 }, (_, i) => ({ k: `p${i}`, s: 5 - i, pv: 5 - i, b: 0, c: 0, e: 0 }));
    const top = topRows(rows, 3);
    expect(top.map((r) => r.k)).toEqual(["p0", "p1", OTHER]);
    expect(top[2].s).toBe(3 + 2 + 1);
  });
  it("merges days", () => {
    const d = computeDay([base], "UTC");
    const merged = mergeBreakdowns([d, d]);
    expect(merged.pages[0]).toMatchObject({ k: "/", pv: 2 });
  });
});

describe("roles", () => {
  it("ranks roles and limits who manages whom", () => {
    expect(hasRole("admin", "member")).toBe(true);
    expect(hasRole("viewer", "member")).toBe(false);
    expect(canManageRole("admin", "member")).toBe(true);
    expect(canManageRole("admin", "admin")).toBe(false);
    expect(canManageRole("owner", "owner")).toBe(true);
    expect(canManageRole("member", "viewer")).toBe(false);
  });
});

describe("webhooks", () => {
  it("only allows public https URLs", () => {
    expect(validateWebhookUrl("https://hooks.zapier.com/hooks/catch/1/abc").ok).toBe(true);
    expect(validateWebhookUrl("http://example.com").ok).toBe(false);
    expect(validateWebhookUrl("https://localhost/x").ok).toBe(false);
    expect(validateWebhookUrl("https://10.0.0.5/x").ok).toBe(false);
    expect(validateWebhookUrl("https://169.254.169.254/latest").ok).toBe(false);
    expect(validateWebhookUrl("https://[::1]/x").ok).toBe(false);
    expect(validateWebhookUrl("https://user:pw@example.com").ok).toBe(false);
    expect(validateWebhookUrl("https://example.com:22").ok).toBe(false);
  });
  it("signs and verifies", async () => {
    const header = await signPayload("whsec_test", '{"a":1}', 1_700_000_000);
    expect(await verifySignature("whsec_test", '{"a":1}', header, 1_700_000_100)).toBe(true);
    expect(await verifySignature("whsec_test", '{"a":2}', header, 1_700_000_100)).toBe(false);
    expect(await verifySignature("whsec_other", '{"a":1}', header, 1_700_000_100)).toBe(false);
    expect(await verifySignature("whsec_test", '{"a":1}', header, 1_700_001_000)).toBe(false); // too old
  });
});

describe("mcp protocol", () => {
  it("parses JSON-RPC", () => {
    expect(parseMessage({ jsonrpc: "2.0", id: 1, method: "ping" }).ok).toBe(true);
    expect(parseMessage({ jsonrpc: "1.0", id: 1, method: "ping" }).ok).toBe(false);
    expect(parseMessage([]).ok).toBe(false);
  });
  it("negotiates versions", () => {
    expect(negotiateVersion("2025-03-26")).toBe("2025-03-26");
    expect(negotiateVersion("1999-01-01")).toBe("2025-06-18");
  });
  it("checks tool arguments", () => {
    const update = TOOLS.find((t) => t.name === "update_lead")!;
    expect(checkArgs(update, { lead_id: "abc", status: "won", follow_up_at: null })).toEqual({ lead_id: "abc", status: "won", follow_up_at: null });
    expect(() => checkArgs(update, { status: "won" })).toThrow(ToolInputError);
    expect(() => checkArgs(update, { lead_id: "a", status: "maybe" })).toThrow(/one of/);
    expect(() => checkArgs(update, { lead_id: "a", sneaky: 1 })).toThrow(/Unknown argument/);
    const list = TOOLS.find((t) => t.name === "list_leads")!;
    expect(() => checkArgs(list, { limit: 500 })).toThrow(/out of range/);
  });
});
