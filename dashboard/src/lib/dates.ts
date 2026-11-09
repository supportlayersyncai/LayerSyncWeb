/** Date-range presets, worked out in the site's own time zone. */

export type Preset = "today" | "yesterday" | "7d" | "30d" | "90d" | "12m";
export const PRESETS: Array<{ key: Preset; label: string; short: string }> = [
  { key: "today", label: "Today", short: "Today" },
  { key: "yesterday", label: "Yesterday", short: "Yest." },
  { key: "7d", label: "Last 7 days", short: "7D" },
  { key: "30d", label: "Last 30 days", short: "30D" },
  { key: "90d", label: "Last 90 days", short: "90D" },
  { key: "12m", label: "Last 12 months", short: "12M" },
];

export function todayIn(timeZone: string, now = Date.now()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  } catch {
    return new Date(now).toISOString().slice(0, 10);
  }
}

export function addDays(day: string, n: number): string {
  const t = Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10)));
  return new Date(t + n * 86_400_000).toISOString().slice(0, 10);
}

export function rangeFor(preset: Preset, timeZone: string, now = Date.now()): { from: string; to: string } {
  const today = todayIn(timeZone, now);
  const back: Record<Preset, [number, number]> = { today: [0, 0], yesterday: [1, 1], "7d": [6, 0], "30d": [29, 0], "90d": [89, 0], "12m": [364, 0] };
  const [a, b] = back[preset];
  return { from: addDays(today, -a), to: addDays(today, -b) };
}
