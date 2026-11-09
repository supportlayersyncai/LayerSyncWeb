/**
 * Calendar days in a site's own time zone. Analytics are bucketed by the
 * site owner's day ("today" in Harare, not in UTC), keyed "YYYY-MM-DD".
 */

export const DEFAULT_TIMEZONE = "Africa/Harare";
const DAY_MS = 24 * 60 * 60 * 1000;

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    });
    formatters.set(timeZone, f);
  }
  return f;
}

/** Whether the runtime knows this IANA zone. */
export function isValidTimeZone(timeZone: string): boolean {
  try {
    formatter(timeZone).format(0);
    return true;
  } catch {
    return false;
  }
}

/** The site-local day and hour (0-23) of a timestamp. */
export function localDayHour(ts: number, timeZone: string): { day: string; hour: number } {
  try {
    const parts = formatter(timeZone).formatToParts(ts);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return { day: `${get("year")}-${get("month")}-${get("day")}`, hour: Number(get("hour")) % 24 };
  } catch {
    const d = new Date(ts);
    return { day: d.toISOString().slice(0, 10), hour: d.getUTCHours() };
  }
}

export function dayKey(ts: number, timeZone: string): string {
  return localDayHour(ts, timeZone).day;
}

export const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** `day` shifted by `n` days (calendar arithmetic, no time zone involved). */
export function addDays(day: string, n: number): string {
  const t = Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10)));
  return new Date(t + n * DAY_MS).toISOString().slice(0, 10);
}

/** Inclusive number of days from `from` to `to`. */
export function daySpan(from: string, to: string): number {
  const a = Date.UTC(Number(from.slice(0, 4)), Number(from.slice(5, 7)) - 1, Number(from.slice(8, 10)));
  const b = Date.UTC(Number(to.slice(0, 4)), Number(to.slice(5, 7)) - 1, Number(to.slice(8, 10)));
  return Math.round((b - a) / DAY_MS) + 1;
}

/** Every day from `from` to `to`, inclusive. */
export function daysInRange(from: string, to: string): string[] {
  const out: string[] = [];
  for (let d = from; d <= to && out.length < 1000; d = addDays(d, 1)) out.push(d);
  return out;
}

/** Milliseconds `timeZone` is ahead of UTC at instant `ts`. */
export function zoneOffsetMs(ts: number, timeZone: string): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(ts);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"), get("second"));
    return asUtc - Math.floor(ts / 1000) * 1000;
  } catch {
    return 0;
  }
}

/** The UTC instant a site-local day begins. */
export function startOfDayMs(day: string, timeZone: string): number {
  const naive = Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10)));
  // Two passes handle a DST change near midnight.
  let guess = naive - zoneOffsetMs(naive, timeZone);
  guess = naive - zoneOffsetMs(guess, timeZone);
  return guess;
}
