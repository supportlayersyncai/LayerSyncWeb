/**
 * Daily analytics rollups. Pure functions: sessions in, one day's numbers out,
 * and several days merged into a period. The cron in convex/rollups.ts runs
 * accumulate/finishDay over a day's sessions; dashboard queries run sumTotals and mergeBreakdowns.
 */
import { localDayHour } from "./dates";

/** One breakdown line: sessions, pageviews, bounces, conversions, engaged ms. */
export type Row = { k: string; s: number; pv: number; b: number; c: number; e: number };
/** A page line adds entries, exits and scroll depth (sum and count). */
export type PageRow = Row & { en: number; ex: number; sc: number; scn: number };
export type CountRow = { k: string; n: number };
export type ScrollRow = { k: string; n: number; sum: number };

export type DayTotals = {
  visitors: number;
  sessions: number;
  pageviews: number;
  bounces: number;
  engagedMs: number;
  conversions: number;
  events: number;
};

export type DayStats = DayTotals & {
  hourlySessions: number[];
  hourlyPageviews: number[];
  pages: PageRow[];
  channels: Row[];
  sources: Row[];
  countries: Row[];
  devices: Row[];
  browsers: Row[];
  os: Row[];
  campaigns: Row[];
  eventNames: CountRow[];
  scroll: ScrollRow[];
};

export type SessionPage = { id?: string; path: string; at: number; ms: number; sc: number };

export type SessionLike = {
  visitorHash: string;
  startedAt: number;
  pageviews: number;
  engagedMs: number;
  maxScroll: number;
  events: number;
  converted: boolean;
  channel: string;
  source: string;
  country?: string;
  device: string;
  browser: string;
  os: string;
  utmCampaign?: string;
  entryPath: string;
  exitPath: string;
  pages: SessionPage[];
  eventNames?: CountRow[];
};

export const TOP = {
  pages: 100,
  channels: 10,
  sources: 40,
  countries: 60,
  devices: 5,
  browsers: 20,
  os: 10,
  campaigns: 30,
  eventNames: 40,
} as const;

export const OTHER = "(other)";
export const UNKNOWN = "(unknown)";

/**
 * GA4's definition, roughly: a session is engaged if it saw two pages, stayed
 * ten seconds, clicked something we track, or sent a form. Anything else bounced.
 */
export function isBounce(s: Pick<SessionLike, "pageviews" | "engagedMs" | "converted" | "events">): boolean {
  return s.pageviews <= 1 && s.engagedMs < 10_000 && !s.converted && s.events === 0;
}

const emptyRow = (k: string): Row => ({ k, s: 0, pv: 0, b: 0, c: 0, e: 0 });
const emptyPage = (k: string): PageRow => ({ ...emptyRow(k), en: 0, ex: 0, sc: 0, scn: 0 });

function bump(map: Map<string, Row>, key: string | undefined, s: SessionLike, bounced: boolean) {
  const k = key || UNKNOWN;
  let r = map.get(k);
  if (!r) map.set(k, (r = emptyRow(k)));
  r.s += 1;
  r.pv += s.pageviews;
  r.b += bounced ? 1 : 0;
  r.c += s.converted ? 1 : 0;
  r.e += s.engagedMs;
}

/** Sort, keep the top `n`, and fold the rest into one "(other)" line. */
export function topRows<T extends Row>(rows: Iterable<T>, n: number, by: "s" | "pv" = "s"): T[] {
  const all = [...rows].sort((a, b) => b[by] - a[by] || b.pv - a.pv || a.k.localeCompare(b.k));
  if (all.length <= n) return all;
  const keep = all.slice(0, n - 1);
  const rest = all.slice(n - 1);
  const other = { ...rest[0], k: OTHER } as T;
  for (const key of Object.keys(other) as (keyof T)[]) {
    if (key !== "k") (other[key] as number) = rest.reduce((sum, r) => sum + (r[key] as number), 0);
  }
  return [...keep, other];
}

function topCounts(map: Map<string, number>, n: number): CountRow[] {
  const all = [...map.entries()].map(([k, v]) => ({ k, n: v })).sort((a, b) => b.n - a.n || a.k.localeCompare(b.k));
  if (all.length <= n) return all;
  const rest = all.slice(n - 1).reduce((sum, r) => sum + r.n, 0);
  return [...all.slice(0, n - 1), { k: OTHER, n: rest }];
}

/**
 * Running totals for one day while its sessions are read in chunks. Plain
 * JSON (arrays, not Maps) so a partial result can be handed to the next
 * scheduled chunk.
 */
export type DayAccumulator = {
  visitors: string[];
  totals: Omit<DayTotals, "visitors">;
  hourlySessions: number[];
  hourlyPageviews: number[];
  pages: PageRow[];
  channels: Row[];
  sources: Row[];
  countries: Row[];
  devices: Row[];
  browsers: Row[];
  os: Row[];
  campaigns: Row[];
  eventNames: CountRow[];
  scroll: ScrollRow[];
};

export function emptyAccumulator(): DayAccumulator {
  return {
    visitors: [],
    totals: { sessions: 0, pageviews: 0, bounces: 0, engagedMs: 0, conversions: 0, events: 0 },
    hourlySessions: new Array<number>(24).fill(0),
    hourlyPageviews: new Array<number>(24).fill(0),
    pages: [],
    channels: [],
    sources: [],
    countries: [],
    devices: [],
    browsers: [],
    os: [],
    campaigns: [],
    eventNames: [],
    scroll: [],
  };
}

/** Upper bound on distinct keys carried between chunks, so a partial stays small. */
const CARRY_LIMIT = 3000;

const toMap = <T extends { k: string }>(rows: T[]) => new Map(rows.map((r) => [r.k, { ...r }]));
const capped = <T extends Row>(m: Map<string, T>, by: "s" | "pv" = "s") =>
  m.size > CARRY_LIMIT ? topRows(m.values(), CARRY_LIMIT, by) : [...m.values()];

/** Add a chunk of sessions to a day's running totals. */
export function accumulate(acc: DayAccumulator, sessions: Iterable<SessionLike>, timeZone: string): DayAccumulator {
  const visitors = new Set(acc.visitors);
  const totals = { ...acc.totals };
  const hourlySessions = [...acc.hourlySessions];
  const hourlyPageviews = [...acc.hourlyPageviews];
  const pages = toMap(acc.pages);
  const dims = {
    channels: toMap(acc.channels),
    sources: toMap(acc.sources),
    countries: toMap(acc.countries),
    devices: toMap(acc.devices),
    browsers: toMap(acc.browsers),
    os: toMap(acc.os),
    campaigns: toMap(acc.campaigns),
  };
  const eventNames = new Map(acc.eventNames.map((r) => [r.k, r.n]));
  const scroll = toMap(acc.scroll);
  const page = (path: string) => {
    let r = pages.get(path);
    if (!r) pages.set(path, (r = emptyPage(path)));
    return r;
  };

  for (const s of sessions) {
    const bounced = isBounce(s);
    visitors.add(s.visitorHash);
    totals.sessions += 1;
    totals.pageviews += s.pageviews;
    totals.bounces += bounced ? 1 : 0;
    totals.engagedMs += s.engagedMs;
    totals.conversions += s.converted ? 1 : 0;
    totals.events += s.events;

    hourlySessions[localDayHour(s.startedAt, timeZone).hour] += 1;
    for (const p of s.pages) hourlyPageviews[localDayHour(p.at, timeZone).hour] += 1;
    // Pageviews past the 50 we keep per session still count, on the last page's hour.
    const missing = s.pageviews - s.pages.length;
    if (missing > 0 && s.pages.length) hourlyPageviews[localDayHour(s.pages[s.pages.length - 1].at, timeZone).hour] += missing;

    bump(dims.channels, s.channel, s, bounced);
    bump(dims.sources, s.source, s, bounced);
    bump(dims.countries, s.country, s, bounced);
    bump(dims.devices, s.device, s, bounced);
    bump(dims.browsers, s.browser, s, bounced);
    bump(dims.os, s.os, s, bounced);
    if (s.utmCampaign) bump(dims.campaigns, s.utmCampaign, s, bounced);

    // Pages: views, unique sessions, entries, exits, engaged time, scroll.
    const viewedHere = new Set<string>();
    for (const p of s.pages) {
      const r = page(p.path);
      r.pv += 1;
      r.e += p.ms;
      if (p.sc > 0) {
        r.sc += p.sc;
        r.scn += 1;
      }
      if (!viewedHere.has(p.path)) {
        viewedHere.add(p.path);
        r.s += 1;
        r.c += s.converted ? 1 : 0;
      }
    }
    const entry = page(s.entryPath);
    entry.en += 1;
    if (bounced) entry.b += 1;
    page(s.exitPath).ex += 1;

    for (const ev of s.eventNames ?? []) eventNames.set(ev.k, (eventNames.get(ev.k) ?? 0) + ev.n);

    if (s.maxScroll > 0) {
      let r = scroll.get(s.device);
      if (!r) scroll.set(s.device, (r = { k: s.device, n: 0, sum: 0 }));
      r.n += 1;
      r.sum += s.maxScroll;
    }
  }

  return {
    visitors: [...visitors],
    totals,
    hourlySessions,
    hourlyPageviews,
    pages: capped(pages, "pv"),
    channels: capped(dims.channels),
    sources: capped(dims.sources),
    countries: capped(dims.countries),
    devices: capped(dims.devices),
    browsers: capped(dims.browsers),
    os: capped(dims.os),
    campaigns: capped(dims.campaigns),
    eventNames: [...eventNames.entries()].map(([k, n]) => ({ k, n })),
    scroll: [...scroll.values()],
  };
}

/** The finished day: totals plus each breakdown cut to its top lines. */
export function finishDay(acc: DayAccumulator): DayStats {
  return {
    visitors: acc.visitors.length,
    ...acc.totals,
    hourlySessions: acc.hourlySessions,
    hourlyPageviews: acc.hourlyPageviews,
    pages: topRows(acc.pages, TOP.pages, "pv"),
    channels: topRows(acc.channels, TOP.channels),
    sources: topRows(acc.sources, TOP.sources),
    countries: topRows(acc.countries, TOP.countries),
    devices: topRows(acc.devices, TOP.devices),
    browsers: topRows(acc.browsers, TOP.browsers),
    os: topRows(acc.os, TOP.os),
    campaigns: topRows(acc.campaigns, TOP.campaigns),
    eventNames: topCounts(new Map(acc.eventNames.map((r) => [r.k, r.n])), TOP.eventNames),
    scroll: acc.scroll,
  };
}

/** One day's numbers from the sessions that started that day. */
export function computeDay(sessions: Iterable<SessionLike>, timeZone: string): DayStats {
  return finishDay(accumulate(emptyAccumulator(), sessions, timeZone));
}

function mergeRows<T extends Row>(lists: T[][]): Map<string, T> {
  const out = new Map<string, T>();
  for (const list of lists) {
    for (const r of list) {
      const cur = out.get(r.k);
      if (!cur) {
        out.set(r.k, { ...r });
        continue;
      }
      for (const key of Object.keys(r) as (keyof T)[]) {
        if (key !== "k") (cur[key] as number) = ((cur[key] as number) ?? 0) + ((r[key] as number) ?? 0);
      }
    }
  }
  return out;
}

export const BREAKDOWN_KEYS = ["pages", "channels", "sources", "countries", "devices", "browsers", "os", "campaigns", "eventNames", "scroll"] as const;
export type Breakdowns = Pick<DayStats, (typeof BREAKDOWN_KEYS)[number]>;
export type PeriodStats = DayTotals & Breakdowns;

/** Add up several days' totals. Visitors are unique per day, so they add up too. */
export function sumTotals(days: DayTotals[]): DayTotals {
  const t: DayTotals = { visitors: 0, sessions: 0, pageviews: 0, bounces: 0, engagedMs: 0, conversions: 0, events: 0 };
  for (const d of days) {
    t.visitors += d.visitors;
    t.sessions += d.sessions;
    t.pageviews += d.pageviews;
    t.bounces += d.bounces;
    t.engagedMs += d.engagedMs;
    t.conversions += d.conversions;
    t.events += d.events;
  }
  return t;
}

/** Several days' breakdowns as one period. */
export function mergeBreakdowns(days: Breakdowns[], limit = { pages: 50, list: 20 }): Breakdowns {
  const merged = <T extends Row>(pick: (d: Breakdowns) => T[], n: number, by: "s" | "pv" = "s") =>
    topRows(mergeRows(days.map(pick)).values(), n, by);
  const ev = new Map<string, number>();
  for (const d of days) for (const r of d.eventNames) ev.set(r.k, (ev.get(r.k) ?? 0) + r.n);
  const scroll = new Map<string, ScrollRow>();
  for (const d of days) {
    for (const r of d.scroll) {
      const cur = scroll.get(r.k) ?? { k: r.k, n: 0, sum: 0 };
      cur.n += r.n;
      cur.sum += r.sum;
      scroll.set(r.k, cur);
    }
  }
  return {
    pages: merged((d) => d.pages, limit.pages, "pv"),
    channels: merged((d) => d.channels, limit.list),
    sources: merged((d) => d.sources, limit.list),
    countries: merged((d) => d.countries, limit.list),
    devices: merged((d) => d.devices, limit.list),
    browsers: merged((d) => d.browsers, limit.list),
    os: merged((d) => d.os, limit.list),
    campaigns: merged((d) => d.campaigns, limit.list),
    eventNames: topCounts(ev, limit.list),
    scroll: [...scroll.values()],
  };
}

/** Relative change, or null when there's nothing to compare with. */
export function delta(current: number, previous: number): number | null {
  if (!previous) return current ? null : 0;
  return (current - previous) / previous;
}
