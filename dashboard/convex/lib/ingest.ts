/**
 * Parsing what the tracker sends. The collector edge function and the
 * Convex HTTP route both run untrusted JSON through this before anything
 * touches the database; whatever doesn't fit is dropped.
 */

export const MAX_EVENTS_PER_BATCH = 20;
export const SESSION_GAP_MS = 30 * 60 * 1000;
/** One pageview can't count more than 30 minutes of attention. */
export const MAX_ENGAGED_MS = 30 * 60 * 1000;
export const MAX_PAGES_PER_SESSION = 50;

export type PageviewIn = { t: "pv"; id: string; p: string; q?: string; r?: string; tz?: string; l?: string; w?: number };
export type EngagementIn = { t: "eng"; id: string; ms: number; sc: number };
export type CustomEventIn = { t: "ev"; n: string; p?: string; props?: Record<string, string> };
export type EventIn = PageviewIn | EngagementIn | CustomEventIn;

const str = (v: unknown, max: number): string | undefined => {
  if (typeof v !== "string") return undefined;
  const s = v.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return s ? s.slice(0, max) : undefined;
};
const num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

const ID_RE = /^[A-Za-z0-9_-]{6,40}$/;
const EVENT_NAME_RE = /^[a-z0-9][a-z0-9_.:-]{0,39}$/;
const PROP_KEY_RE = /^[a-z0-9_]{1,30}$/;
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/g;

/** Event names are lowercase, 1-40 characters of a-z 0-9 _ . : - */
export function cleanEventName(v: unknown): string | undefined {
  const s = str(v, 60)?.toLowerCase().replace(/\s+/g, "_");
  return s && EVENT_NAME_RE.test(s) ? s : undefined;
}

/** Up to 8 string props; keys a-z0-9_, values 120 characters, emails masked. */
export function cleanProps(v: unknown): Record<string, string> | undefined {
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  const out: Record<string, string> = {};
  let n = 0;
  for (const [k, raw] of Object.entries(v as Record<string, unknown>)) {
    if (n >= 8) break;
    const key = k.toLowerCase();
    if (!PROP_KEY_RE.test(key)) continue;
    const val = typeof raw === "number" || typeof raw === "boolean" ? String(raw) : str(raw, 120);
    if (!val) continue;
    out[key] = val.replace(EMAIL_RE, "[email]").replace(/\+?\d[\d\s-]{6,}\d/g, "[number]");
    n++;
  }
  return n ? out : undefined;
}

/** The events of one tracker request, or [] when nothing in it is usable. */
export function parseEvents(raw: unknown): EventIn[] {
  if (!Array.isArray(raw)) return [];
  const out: EventIn[] = [];
  for (const e of raw.slice(0, MAX_EVENTS_PER_BATCH)) {
    if (!e || typeof e !== "object") continue;
    const o = e as Record<string, unknown>;
    if (o.t === "pv") {
      const id = str(o.id, 40);
      const p = str(o.p, 1000);
      if (!id || !ID_RE.test(id) || !p) continue;
      const w = num(o.w);
      out.push({
        t: "pv",
        id,
        p,
        q: str(o.q, 1000),
        r: str(o.r, 1000),
        tz: str(o.tz, 60),
        l: str(o.l, 20),
        w: w !== undefined ? Math.max(0, Math.min(10000, Math.round(w))) : undefined,
      });
    } else if (o.t === "eng") {
      const id = str(o.id, 40);
      const ms = num(o.ms);
      const sc = num(o.sc);
      if (!id || !ID_RE.test(id) || ms === undefined) continue;
      out.push({
        t: "eng",
        id,
        ms: Math.max(0, Math.min(MAX_ENGAGED_MS, Math.round(ms))),
        sc: Math.max(0, Math.min(100, Math.round(sc ?? 0))),
      });
    } else if (o.t === "ev") {
      const n = cleanEventName(o.n);
      if (!n) continue;
      out.push({ t: "ev", n, p: str(o.p, 1000), props: cleanProps(o.props) });
    }
  }
  // Strip undefined so the values pass Convex validators.
  return out.map((e) => Object.fromEntries(Object.entries(e).filter(([, v]) => v !== undefined)) as EventIn);
}

/** What the collector adds about the request: who's asking, from where. */
export type RequestMeta = {
  siteKey: string;
  origin?: string;
  ip?: string;
  ua: string;
  country?: string;
  region?: string;
  city?: string;
};

export function parseMeta(raw: unknown): RequestMeta | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const siteKey = str(o.siteKey, 60);
  const ua = str(o.ua, 500);
  if (!siteKey || !/^ss_[A-Za-z0-9_-]{10,40}$/.test(siteKey) || !ua) return null;
  const meta: RequestMeta = { siteKey, ua };
  const origin = str(o.origin, 300);
  const ip = str(o.ip, 60);
  const country = str(o.country, 4);
  const region = str(o.region, 10);
  const city = str(o.city, 120);
  if (origin) meta.origin = origin;
  if (ip) meta.ip = ip;
  if (country) meta.country = country;
  if (region) meta.region = region;
  if (city) meta.city = city;
  return meta;
}
