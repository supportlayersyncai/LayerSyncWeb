/**
 * Page paths as we store them: no query string (except the tags we read),
 * no fragment, and nothing that looks like personal data.
 */
import type { Utm } from "./referrer";

const MAX_PATH = 200;

const EMAIL_RE = /[^/\s@]+@[^/\s@]+\.[^/\s@]+/g;
const LONG_NUMBER_RE = /(^|\/)\+?\d[\d\s-]{6,}\d(?=\/|$)/g;
const TOKEN_RE = /(^|\/)(?=[A-Za-z0-9_-]{24,}(?:\/|$))(?=[^/]*\d)(?=[^/]*[A-Za-z])[A-Za-z0-9_-]+(?=\/|$)/g;

/**
 * Clean a pathname: decode-safe, at most 200 characters, emails replaced with
 * "[email]", phone-like digit runs with "[number]", and long random-looking
 * ids with "[id]", so a URL can't leak who someone is and similar pages group.
 */
export function cleanPath(input: string | undefined): string {
  let p = (input ?? "/").trim();
  if (!p.startsWith("/")) {
    try {
      p = new URL(p).pathname;
    } catch {
      p = `/${p}`;
    }
  }
  p = p.split("#")[0].split("?")[0];
  try {
    p = decodeURI(p);
  } catch {
    // keep as sent
  }
  p = p
    .replace(EMAIL_RE, "[email]")
    .replace(LONG_NUMBER_RE, "$1[number]")
    .replace(TOKEN_RE, "$1[id]")
    .replace(/\/{2,}/g, "/")
    .replace(/[\u0000-\u001f\u007f]/g, "");
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return (p || "/").slice(0, MAX_PATH);
}

/** The utm_* tags and ad click ids from a query string. Everything else is dropped. */
export function readCampaign(search: string | undefined): {
  utm: Utm;
  clickIds: { gclid?: boolean; msclkid?: boolean; fbclid?: boolean };
} {
  const utm: Utm = {};
  const clickIds: { gclid?: boolean; msclkid?: boolean; fbclid?: boolean } = {};
  if (!search) return { utm, clickIds };
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  } catch {
    return { utm, clickIds };
  }
  const tidy = (v: string | null) => {
    const s = (v ?? "").replace(/\s+/g, " ").trim().slice(0, 100);
    return s ? s.replace(EMAIL_RE, "[email]") : undefined;
  };
  utm.source = tidy(params.get("utm_source") ?? params.get("ref") ?? params.get("source"));
  utm.medium = tidy(params.get("utm_medium"));
  utm.campaign = tidy(params.get("utm_campaign"));
  utm.term = tidy(params.get("utm_term"));
  utm.content = tidy(params.get("utm_content"));
  if (params.has("gclid") || params.has("gbraid") || params.has("wbraid")) clickIds.gclid = true;
  if (params.has("msclkid")) clickIds.msclkid = true;
  if (params.has("fbclid")) clickIds.fbclid = true;
  for (const k of Object.keys(utm) as (keyof Utm)[]) if (utm[k] === undefined) delete utm[k];
  return { utm, clickIds };
}

/** Whether `path` falls under one of the site's excluded prefixes ("/admin" excludes "/admin/x"). */
export function isExcluded(path: string, prefixes: string[] | undefined): boolean {
  if (!prefixes?.length) return false;
  return prefixes.some((pre) => {
    const p = pre.endsWith("/") && pre.length > 1 ? pre.slice(0, -1) : pre;
    return path === p || path.startsWith(`${p}/`) || (p.endsWith("*") && path.startsWith(p.slice(0, -1)));
  });
}
