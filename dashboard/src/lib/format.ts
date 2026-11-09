/** Number, time and place formatting for the dashboard. */

const nf = new Intl.NumberFormat("en");
const compactNf = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export const fmt = (n: number) => nf.format(Math.round(n));
export const compact = (n: number) => (Math.abs(n) < 10_000 ? nf.format(Math.round(n)) : compactNf.format(n));
export const pct = (n: number, d: number, digits = 1) => (d ? `${((n / d) * 100).toFixed(digits).replace(/\.0$/, "")}%` : "0%");

export function duration(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m < 60) return r ? `${m}m ${String(r).padStart(2, "0")}s` : `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

export function money(n: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${fmt(n)}`;
  }
}

export function relativeTime(ts: number, now = Date.now()): string {
  const diff = Math.round((now - ts) / 1000);
  if (diff < 45) return "just now";
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), "minute");
  if (diff < 86_400) return rtf.format(-Math.round(diff / 3600), "hour");
  if (diff < 7 * 86_400) return rtf.format(-Math.round(diff / 86_400), "day");
  return dateShort(ts);
}

export const dateShort = (ts: number) => new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: new Date(ts).getFullYear() === new Date().getFullYear() ? undefined : "numeric" });
export const dateTime = (ts: number) =>
  new Date(ts).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** "2026-11-09" → "9 Nov". */
export function dayLabel(day: string, withWeekday = false): string {
  const d = new Date(`${day}T12:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", weekday: withWeekday ? "short" : undefined, timeZone: "UTC" });
}

let regionNames: Intl.DisplayNames | null = null;
export function countryName(code: string | null | undefined): string {
  if (!code || code === "(unknown)") return "Unknown";
  if (code === "(other)") return "Other";
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

/** Regional-indicator flag emoji for a two-letter code. */
export function flag(code: string | null | undefined): string {
  if (!code || !/^[A-Z]{2}$/.test(code)) return "🌐";
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export const CHANNEL_LABEL: Record<string, string> = {
  direct: "Direct",
  search: "Search",
  social: "Social",
  ai: "AI assistants",
  email: "Email",
  paid: "Paid",
  referral: "Referral",
  "(unknown)": "Unknown",
  "(other)": "Other",
};

/** Fixed colour per channel: colour follows the entity, never its rank. */
export const CHANNEL_SLOT: Record<string, number> = { direct: 1, search: 2, social: 3, ai: 4, email: 5, paid: 6, referral: 7 };

export const DEVICE_LABEL: Record<string, string> = { desktop: "Desktop", mobile: "Phone", tablet: "Tablet" };
export const DEVICE_SLOT: Record<string, number> = { desktop: 1, mobile: 2, tablet: 3 };

export const EVENT_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp taps",
  phone: "Phone taps",
  email: "Email taps",
  download: "Downloads",
  outbound: "Outbound clicks",
  form_submit: "Form sends",
  lead: "Leads",
};
