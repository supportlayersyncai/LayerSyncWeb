#!/usr/bin/env node
/**
 * End-to-end check of public/s.js in a real browser (Playwright/Chromium).
 * Serves a test page plus a stub collector, then asserts what the tracker
 * sends. Run: npm run test:tracker (after npm run build:tracker). Needs Playwright.
 */
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

// Playwright isn't a dependency: use any install (npm i -D playwright && npx playwright install chromium).
const { chromium } = createRequire(import.meta.url)("playwright");

const root = fileURLToPath(new URL("..", import.meta.url));
const tracker = readFileSync(`${root}public/s.js`, "utf8");
const received = [];

const page = (extra = "") => `<!doctype html><html><head><meta charset="utf-8"><title>t</title>
<script defer src="/s.js" data-site="ss_testkey123456" data-dev></script></head>
<body style="height:3000px">
<a id="wa" href="https://wa.me/263775187682?text=hi" onclick="event.preventDefault()">WhatsApp</a>
<a id="tel" href="tel:+263775187682" onclick="event.preventDefault()">Call</a>
<a id="pdf" href="/files/the-layer-map.pdf" onclick="event.preventDefault()">PDF</a>
<a id="out" href="https://example.org/x" onclick="event.preventDefault()">Out</a>
<button id="cta" data-syncsite-event="book_demo" data-syncsite-prop-plan="pro">Book</button>
<form id="f" data-syncsite-form="contact" onsubmit="event.preventDefault()">
  <input name="name" value="Tendai Moyo"><input name="email" value="t@example.com">
  <input name="password" type="password" value="secret"><input name="card_number" value="4111111111111111">
  <button>Send</button>
</form>
${extra}
</body></html>`;

const server = createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/s.js") {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    return res.end(tracker);
  }
  if (url.pathname.startsWith("/api/")) {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      received.push({ path: url.pathname, origin: req.headers.origin, type: req.headers["content-type"], body: JSON.parse(body) });
      res.writeHead(url.pathname === "/api/lead" ? 200 : 202, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      res.end(url.pathname === "/api/lead" ? '{"ok":true}' : "");
    });
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(page());
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const events = () => received.filter((r) => r.path === "/api/collect").flatMap((r) => r.body.e);

try {
  // Automated browsers set navigator.webdriver, which the tracker ignores on purpose.
  const human = () => Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false });

  // First: an automated browser is not counted.
  const bot = await browser.newContext();
  const b = await bot.newPage();
  await b.goto(`${base}/`, { waitUntil: "load" });
  await wait(300);
  assert.equal(received.length, 0, "webdriver: not counted");
  await bot.close();

  const ctx = await browser.newContext();
  await ctx.addInitScript(human);
  const p = await ctx.newPage();
  await p.goto(`${base}/pricing?utm_source=manychat&utm_campaign=layer-map&email=leak@x.com&fbclid=abc`, { waitUntil: "load" });
  await wait(400);

  const first = events().find((e) => e.t === "pv");
  assert.ok(first, "pageview sent on load");
  assert.equal(first.p, "/pricing");
  assert.equal(first.q, "?utm_source=manychat&utm_campaign=layer-map&fbclid=1", "only campaign tags leave the browser");
  assert.ok(!JSON.stringify(received).includes("leak@x.com"), "other query params never sent");
  assert.equal(received[0].body.k, "ss_testkey123456");
  assert.equal(received[0].origin, base, "Origin header present");
  assert.match(received[0].type, /text\/plain/, "simple request, no preflight");

  // No cookies, no storage.
  assert.equal((await ctx.cookies()).length, 0, "no cookies");
  assert.equal(await p.evaluate(() => localStorage.length + sessionStorage.length), 0, "nothing in web storage");

  // Single-page navigation.
  await p.evaluate(() => history.pushState({}, "", "/about"));
  await wait(2000);
  const pvs = events().filter((e) => e.t === "pv");
  assert.deepEqual(pvs.map((e) => e.p), ["/pricing", "/about"]);
  assert.equal(pvs[1].r, undefined, "referrer only on the landing page");
  assert.ok(events().some((e) => e.t === "eng" && e.id === pvs[0].id), "engagement for the previous page");

  // Clicks.
  await p.click("#tel");
  await p.click("#pdf");
  await p.click("#out");
  await p.click("#cta");
  await p.click("#wa");
  await wait(400);
  const names = events().filter((e) => e.t === "ev").map((e) => e.n);
  for (const n of ["phone", "download", "outbound", "book_demo", "whatsapp"]) assert.ok(names.includes(n), `click event ${n}`);
  assert.deepEqual(events().find((e) => e.n === "book_demo").props, { plan: "pro" });
  assert.deepEqual(events().find((e) => e.n === "download").props, { file: "the-layer-map.pdf" });

  // Form capture with honeypot, sensitive fields dropped.
  assert.equal(await p.locator('input[name="_ss_hp"]').count(), 1, "honeypot added");
  await p.click("#f button");
  await wait(400);
  const lead = received.find((r) => r.path === "/api/lead");
  assert.ok(lead, "lead sent");
  assert.equal(lead.body.lead.form, "contact");
  assert.deepEqual(lead.body.lead.fields.map((f) => f.key), ["name", "email"], "password and card fields never sent");
  assert.equal(lead.body.lead.hp, "", "honeypot empty for a person");

  // Engagement on tab hide.
  const before = events().filter((e) => e.t === "eng").length;
  await p.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await wait(400);
  assert.ok(events().filter((e) => e.t === "eng").length > before, "engagement sent when the tab is hidden");

  // Programmatic API.
  const r = await p.evaluate(() => window.syncsite.lead({ form: "diagnostic", fields: { name: "Rudo", phone: "0771234567" } }));
  assert.deepEqual(r, { ok: true });

  // data-exclude: nothing from excluded paths, even after a client-side navigation into them.
  received.length = 0;
  const ex = await browser.newContext();
  await ex.addInitScript(human);
  const e = await ex.newPage();
  await e.route("**/landing", (route) => route.fulfill({ contentType: "text/html", body: page().replace("data-dev>", 'data-dev data-exclude="/app,/portal">') }));
  await e.goto(`${base}/landing`, { waitUntil: "load" });
  await wait(300);
  await e.evaluate(() => history.pushState({}, "", "/app/leads/123"));
  await wait(300);
  await e.click("#tel");
  await wait(1800);
  const exPaths = received.filter((r) => r.path === "/api/collect").flatMap((r) => r.body.e).map((x) => x.p ?? "(eng)");
  assert.ok(exPaths.includes("/landing"), "landing counted");
  assert.ok(!exPaths.some((x) => x.startsWith("/app")), "nothing sent from /app");
  await ex.close();

  // Do Not Track / GPC: no analytics, but leads still work.
  received.length = 0;
  const dnt = await browser.newContext();
  await dnt.addInitScript(human);
  await dnt.addInitScript(() => Object.defineProperty(navigator, "globalPrivacyControl", { value: true }));
  const q = await dnt.newPage();
  await q.goto(`${base}/`, { waitUntil: "load" });
  await wait(300);
  assert.equal(received.filter((x) => x.path === "/api/collect").length, 0, "GPC: no analytics");
  await q.evaluate(() => window.syncsite.lead({ fields: { email: "a@b.co" } }));
  await wait(200);
  assert.equal(received.filter((x) => x.path === "/api/lead").length, 1, "GPC: lead still sent");

  console.log("tracker e2e: all checks passed");
} finally {
  await browser.close();
  server.close();
}
