/**
 * SyncSite tracker. Built to public/s.js (scripts/build-tracker.mjs), about
 * 2 KB gzipped. Add it to any site:
 *
 *   <script defer src="https://dashboard.layersyncai.com/s.js" data-site="ss_..."></script>
 *
 * What it does
 *   - pageviews, including single-page-app route changes
 *   - time on page (only while the tab is visible) and how far down people scroll
 *   - clicks on phone, email, WhatsApp, download and outbound links
 *   - custom events: data-syncsite-event="name" on any element, or syncsite.track()
 *   - form leads: data-syncsite-form on a <form>, or syncsite.lead()
 *
 * What it doesn't do
 *   - no cookies, no localStorage, no fingerprinting: nothing is stored on the
 *     visitor's device (see convex/ingest.ts for how visits are counted)
 *   - no tracking when the browser sends Do Not Track or Global Privacy Control,
 *     or for automated browsers. Form leads still work: they're the visitor's
 *     own choice to get in touch.
 *   - only utm_* tags are read from the URL; everything else in the query
 *     string stays in the browser.
 *   - nothing at all is sent from paths listed in data-exclude, e.g.
 *     data-exclude="/app,/portal" for a signed-in area on the same domain.
 *
 * Owners can exclude their own visits by opening any page once with
 * ?syncsite_ignore=1 (and undo with ?syncsite_ignore=0). That's the one
 * thing kept in localStorage, and only on the owner's own browser.
 */

type Json = string | number | boolean | null | undefined | Json[] | { [k: string]: Json };
type Ev = Record<string, Json>;
type LeadData = { form?: string; fields: Record<string, unknown> | Array<{ key: string; value: unknown }>; page?: string };
type LeadResult = { ok: boolean; error?: string };

interface SyncSiteApi {
  v: number;
  track(name: string, props?: Record<string, string | number | boolean>): void;
  lead(data: LeadData): Promise<LeadResult>;
  pageview(): void;
  q?: unknown[][];
}

declare global {
  interface Window {
    syncsite?: SyncSiteApi | { q?: unknown[][] };
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

(() => {
  const w = window;
  const d = document;
  const nav = navigator;
  const loc = location;
  const script = d.currentScript as HTMLScriptElement | null;
  const existing = w.syncsite as SyncSiteApi | undefined;
  if (!script || existing?.v) return;

  const key = script.getAttribute("data-site");
  if (!key) return;
  const base = (script.getAttribute("data-api") || new URL(script.src, loc.href).origin).replace(/\/+$/, "");
  const collectUrl = `${base}/api/collect`;
  const leadUrl = `${base}/api/lead`;

  // ── Opt-outs ──────────────────────────────────────────────────────────
  let ignored = false;
  try {
    const flag = new URLSearchParams(loc.search).get("syncsite_ignore");
    if (flag === "1") localStorage.setItem("syncsite_ignore", "1");
    if (flag === "0") localStorage.removeItem("syncsite_ignore");
    ignored = localStorage.getItem("syncsite_ignore") === "1";
  } catch {
    // storage blocked: nothing to remember
  }
  const isLocal = /^(localhost|127\.\d+\.\d+\.\d+|\[::1\])$/.test(loc.hostname) || loc.protocol === "file:";
  const optedOut = nav.doNotTrack === "1" || nav.globalPrivacyControl === true;
  const tracking = !optedOut && !ignored && !nav.webdriver && (!isLocal || script.hasAttribute("data-dev"));
  const loadedAt = Date.now();

  // data-exclude="/app,/portal": nothing is sent from these paths (or below them).
  const exclude = (script.getAttribute("data-exclude") || "")
    .split(",")
    .map((p) => p.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  const excluded = () => exclude.some((p) => loc.pathname === p || loc.pathname.startsWith(`${p}/`));

  // ── Sending ───────────────────────────────────────────────────────────
  const rid = () => {
    const a = new Uint8Array(9);
    crypto.getRandomValues(a);
    return Array.from(a, (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join("");
  };

  const post = (url: string, body: string, beacon: boolean) => {
    if (beacon && nav.sendBeacon && nav.sendBeacon(url, new Blob([body], { type: "text/plain" }))) return;
    // text/plain keeps this a "simple" request: no CORS preflight.
    fetch(url, { method: "POST", body, keepalive: true, credentials: "omit", headers: { "Content-Type": "text/plain" } }).catch(() => undefined);
  };

  let queue: Ev[] = [];
  let timer = 0;
  const flush = (final = false) => {
    w.clearTimeout(timer);
    timer = 0;
    while (queue.length) post(collectUrl, JSON.stringify({ k: key, e: queue.splice(0, 20) }), final);
  };
  const push = (e: Ev, now = false) => {
    if (!tracking || excluded()) return;
    queue.push(e);
    if (now || queue.length >= 10) flush();
    else if (!timer) timer = w.setTimeout(flush, 1500);
  };

  // ── Pageviews and engagement ──────────────────────────────────────────
  type View = { id: string; visibleMs: number; since: number | null; scroll: number };
  let view: View | null = null;
  let lastPath = "";
  let first = true;

  const scrollPct = () => {
    const h = d.documentElement;
    const height = Math.max(h.scrollHeight, d.body ? d.body.scrollHeight : 0);
    return height ? Math.min(100, Math.round(((w.scrollY + w.innerHeight) / height) * 100)) : 0;
  };
  const visibleMs = (v: View) => v.visibleMs + (v.since === null ? 0 : Date.now() - v.since);
  const engagement = (final: boolean) => {
    if (!view) return;
    view.scroll = Math.max(view.scroll, scrollPct());
    push({ t: "eng", id: view.id, ms: visibleMs(view), sc: view.scroll });
    flush(final);
  };

  /** Only campaign tags leave the browser. */
  const campaign = () => {
    const src = new URLSearchParams(loc.search);
    const out = new URLSearchParams();
    src.forEach((v, k) => {
      if (/^utm_(source|medium|campaign|term|content)$/.test(k) || k === "ref") out.set(k, v.slice(0, 100));
      else if (/^(gclid|gbraid|wbraid|msclkid|fbclid)$/.test(k)) out.set(k, "1");
    });
    const s = out.toString();
    return s ? `?${s}` : undefined;
  };
  /** Just where they came from: scheme and host, never the page or its query. */
  const referrer = () => {
    if (!d.referrer) return undefined;
    try {
      const u = new URL(d.referrer);
      return u.protocol.startsWith("http") ? u.origin : `${u.protocol}//${u.host}`;
    } catch {
      return undefined;
    }
  };

  const pageview = () => {
    const path = loc.pathname;
    if (path === lastPath) return;
    if (view) engagement(false);
    lastPath = path;
    view = { id: rid(), visibleMs: 0, since: d.visibilityState === "visible" ? Date.now() : null, scroll: 0 };
    let tz: string | undefined;
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      tz = undefined;
    }
    push({ t: "pv", id: view.id, p: path, q: campaign(), r: first ? referrer() : undefined, tz, l: nav.language, w: w.innerWidth }, true);
    first = false;
  };

  w.addEventListener("scroll", () => view && (view.scroll = Math.max(view.scroll, scrollPct())), { passive: true });
  d.addEventListener("visibilitychange", () => {
    if (!view) return;
    if (d.visibilityState === "hidden") {
      if (view.since !== null) view.visibleMs += Date.now() - view.since;
      view.since = null;
      engagement(true);
    } else {
      view.since = Date.now();
    }
  });
  w.addEventListener("pagehide", () => engagement(true));

  // Single-page apps: watch the History API.
  const wrap = (fn: "pushState" | "replaceState") => {
    const orig = history[fn];
    history[fn] = function (this: History, ...args: Parameters<History["pushState"]>) {
      const r = orig.apply(this, args);
      w.setTimeout(pageview, 0);
      return r;
    };
  };
  wrap("pushState");
  wrap("replaceState");
  w.addEventListener("popstate", () => w.setTimeout(pageview, 0));

  // ── Events ────────────────────────────────────────────────────────────
  const track = (name: string, props?: Record<string, string | number | boolean>) => {
    push({ t: "ev", n: String(name).slice(0, 40), p: loc.pathname, props: props as Json }, true);
  };

  const DOWNLOAD = /\.(pdf|zip|rar|7z|docx?|xlsx?|pptx?|csv|txt|mp3|mp4|mov|apk|dmg|exe)$/i;
  d.addEventListener(
    "click",
    (e) => {
      const target = e.target as Element | null;
      const tagged = target?.closest?.("[data-syncsite-event]");
      if (tagged) {
        const props: Record<string, string> = {};
        for (const a of Array.from(tagged.attributes)) {
          const m = a.name.match(/^data-syncsite-prop-([a-z0-9_-]{1,30})$/);
          if (m) props[m[1].replace(/-/g, "_")] = a.value.slice(0, 120);
        }
        track(tagged.getAttribute("data-syncsite-event") || "click", props);
      }
      const a = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (/^tel:/i.test(href)) return track("phone");
      if (/^mailto:/i.test(href)) return track("email");
      let u: URL;
      try {
        u = new URL(a.href, loc.href);
      } catch {
        return;
      }
      if (/^(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|chat\.whatsapp\.com)$/.test(u.hostname) || u.protocol === "whatsapp:") return track("whatsapp");
      if (a.hasAttribute("download") || DOWNLOAD.test(u.pathname)) return track("download", { file: u.pathname.split("/").pop() || u.pathname });
      if (u.protocol.startsWith("http") && u.hostname !== loc.hostname) track("outbound", { host: u.hostname });
    },
    true,
  );

  // ── Leads ─────────────────────────────────────────────────────────────
  const HONEYPOT = "_ss_hp";
  const SKIP_TYPES = /^(password|file|hidden|submit|button|reset|image)$/;
  const SENSITIVE = /pass|card|cvv|cvc|iban|ssn|otp|pin$|secret|token|captcha/i;

  const lead = async (data: LeadData, hp = ""): Promise<LeadResult> => {
    if (tracking) flush();
    const body = JSON.stringify({
      k: key,
      lead: { form: data.form, fields: data.fields, page: data.page || loc.pathname, hp, elapsedMs: Date.now() - loadedAt },
    });
    try {
      const res = await fetch(leadUrl, { method: "POST", body, keepalive: true, credentials: "omit", headers: { "Content-Type": "text/plain" } });
      const json = (await res.json().catch(() => ({}))) as LeadResult;
      if (res.ok) push({ t: "ev", n: "form_submit", p: loc.pathname, props: { form: data.form || "contact" } });
      return res.ok ? { ok: true } : { ok: false, error: json.error || "Couldn't send that. Please try again." };
    } catch {
      return { ok: false, error: "Couldn't reach the server. Check your connection and try again." };
    }
  };

  const armForm = (form: HTMLFormElement) => {
    if (form.querySelector(`input[name="${HONEYPOT}"]`)) return;
    // A field people never see. Bots fill in everything.
    const hp = d.createElement("input");
    hp.type = "text";
    hp.name = HONEYPOT;
    hp.tabIndex = -1;
    hp.autocomplete = "off";
    hp.setAttribute("aria-hidden", "true");
    hp.style.cssText = "position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0";
    form.appendChild(hp);
  };
  const armAll = () => d.querySelectorAll<HTMLFormElement>("form[data-syncsite-form]").forEach(armForm);

  d.addEventListener(
    "submit",
    (e) => {
      const form = e.target as HTMLFormElement;
      if (!form?.matches?.("form[data-syncsite-form]")) return;
      const fields: Array<{ key: string; value: string }> = [];
      let hp = "";
      for (const el of Array.from(form.elements) as HTMLInputElement[]) {
        if (!el.name) continue;
        if (el.name === HONEYPOT) {
          hp = el.value;
          continue;
        }
        if (SKIP_TYPES.test(el.type) || SENSITIVE.test(el.name) || /^cc-/.test(el.autocomplete || "")) continue;
        if ((el.type === "checkbox" || el.type === "radio") && !el.checked) continue;
        if (el.value) fields.push({ key: el.name, value: el.value });
      }
      void lead({ form: form.getAttribute("data-syncsite-form") || form.getAttribute("name") || form.id || "contact", fields }, hp).then((r) => {
        form.dispatchEvent(new CustomEvent("syncsite:lead", { detail: r }));
      });
    },
    true,
  );

  // ── Public API ────────────────────────────────────────────────────────
  const api: SyncSiteApi = {
    v: 1,
    track,
    lead: (data) => lead(data),
    pageview: () => {
      lastPath = "";
      pageview();
    },
  };
  const pending = (w.syncsite as { q?: unknown[][] } | undefined)?.q ?? [];
  w.syncsite = api;
  for (const call of pending) {
    const fn = api[call[0] as "track" | "pageview"] as ((...a: unknown[]) => void) | undefined;
    if (typeof fn === "function") fn(...call.slice(1));
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", armAll);
  else armAll();
  let armTimer = 0;
  new MutationObserver(() => {
    w.clearTimeout(armTimer);
    armTimer = w.setTimeout(armAll, 250);
  }).observe(d.documentElement, { childList: true, subtree: true });
  pageview();
})();

export {};
