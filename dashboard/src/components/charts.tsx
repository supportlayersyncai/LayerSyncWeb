/**
 * Charts, drawn in SVG to the dataviz skill's specs: 2px lines, a 10% area
 * wash, hairline solid gridlines, a crosshair that snaps to the nearest
 * point with one tooltip for every series, 4px-rounded bars, a 2px surface
 * gap between segments, text always in ink colours (never the series hue),
 * and every value also reachable without hovering (tables and labels).
 */
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { compact, fmt } from "../lib/format";
import { cx } from "./ui";

// ── Delta ────────────────────────────────────────────────────────────────

/** Change vs the previous period. `upIsGood` false for things like bounce rate. */
export function Delta({ current, previous, upIsGood = true, className }: { current: number; previous: number; upIsGood?: boolean; className?: string }) {
  if (!previous && !current) return <span className={cx("text-xs text-ink-3", className)}>No change</span>;
  if (!previous) return <span className={cx("text-xs font-semibold text-ink-3", className)}>New</span>;
  const d = (current - previous) / previous;
  const flat = Math.abs(d) < 0.005;
  const good = flat ? null : d > 0 === upIsGood;
  const Icon = flat ? Minus : d > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cx("inline-flex items-center gap-0.5 text-xs font-semibold tnum", good === null ? "text-ink-3" : good ? "text-good" : "text-bad", className)}
      title="Compared with the previous period of the same length"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {flat ? "0%" : `${d > 0 ? "+" : "−"}${Math.abs(d * 100) >= 100 ? Math.round(Math.abs(d * 100)) : Math.abs(d * 100).toFixed(1)}%`}
      <span className="sr-only">{good === null ? "no change" : good ? "better than" : "worse than"} the previous period</span>
    </span>
  );
}

// ── Stat tile ────────────────────────────────────────────────────────────

export function StatTile({
  label,
  value,
  delta,
  selected,
  onSelect,
  hint,
}: {
  label: string;
  value: string;
  delta?: ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  hint?: string;
}) {
  const Tag = onSelect ? "button" : "div";
  return (
    <Tag
      type={onSelect ? "button" : undefined}
      onClick={onSelect}
      aria-pressed={onSelect ? selected : undefined}
      title={hint}
      className={cx(
        "group relative flex min-w-0 flex-col items-start rounded-[22px] border p-4 text-left transition-all sm:p-5",
        selected ? "border-ink/25 bg-surface-3" : "border-line bg-surface",
        onSelect && !selected && "hover:border-line-strong",
      )}
    >
      {selected && <span className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-brand-orange" aria-hidden />}
      <span className="eyebrow">{label}</span>
      <span className="mt-3 text-[26px] leading-none font-light tracking-[-0.02em] text-ink sm:text-[30px]">{value}</span>
      <span className="mt-2 h-4">{delta}</span>
    </Tag>
  );
}

// ── Trend chart ──────────────────────────────────────────────────────────

export type TrendPoint = { label: string; value: number; previous?: number };

/** A top for the y-axis whose four steps are round numbers (0, 10, 20, 30, 40). */
function niceMax(v: number): number {
  const raw = Math.max(1, v) / 4;
  const exp = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / exp;
  const nice = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((x) => x >= n - 1e-9) ?? 10;
  return Math.max(1, Math.ceil(nice * exp)) * 4;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(240, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

/**
 * This period as an orange line with a faint wash; the previous period as a
 * muted dashed line behind it. One y-axis, starting at zero.
 */
export function TrendChart({
  points,
  seriesLabel,
  previousLabel = "Previous period",
  formatX,
  formatTooltipX,
  height = 260,
}: {
  points: TrendPoint[];
  seriesLabel: string;
  previousLabel?: string;
  formatX: (label: string, i: number) => string;
  formatTooltipX?: (label: string, i: number) => string;
  height?: number;
}) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { top: 16, right: 12, bottom: 28, left: 40 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const hasPrev = points.some((p) => p.previous !== undefined);

  const max = useMemo(() => niceMax(Math.max(1, ...points.map((p) => Math.max(p.value, p.previous ?? 0)))), [points]);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const x = (i: number) => (points.length <= 1 ? w / 2 : (i / (points.length - 1)) * w);
  const y = (v: number) => h - (v / max) * h;

  const line = (get: (p: TrendPoint) => number | undefined) =>
    points
      .map((p, i) => {
        const v = get(p);
        return v === undefined ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      })
      .filter(Boolean)
      .join(" L ");
  const current = `M ${line((p) => p.value)}`;
  const area = `${current} L ${x(points.length - 1).toFixed(1)},${h} L ${x(0).toFixed(1)},${h} Z`;
  const previous = hasPrev ? `M ${line((p) => p.previous)}` : "";

  // About six x labels, whatever the width.
  const every = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor(w / 90))));

  const onMove = (clientX: number, rect: DOMRect) => {
    const px = clientX - rect.left - pad.left;
    const i = Math.round((px / Math.max(1, w)) * (points.length - 1));
    setHover(Math.max(0, Math.min(points.length - 1, i)));
  };

  const hp = hover !== null ? points[hover] : null;
  const tipLeft = hover !== null ? Math.min(Math.max(pad.left + x(hover) - 80, 0), width - 170) : 0;

  return (
    <div ref={ref} className="relative w-full select-none">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`${seriesLabel} over time${hasPrev ? `, with the ${previousLabel.toLowerCase()} for comparison` : ""}`}
        className="block overflow-visible"
        onPointerMove={(e) => onMove(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerLeave={() => setHover(null)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setHover((h0) => Math.min(points.length - 1, (h0 ?? -1) + 1));
          if (e.key === "ArrowLeft") setHover((h0) => Math.max(0, (h0 ?? points.length) - 1));
        }}
        onBlur={() => setHover(null)}
      >
        <defs>
          <linearGradient id="trend-wash" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--series-1)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--series-1)" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <g transform={`translate(${pad.left},${pad.top})`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={0} x2={w} y1={y(t)} y2={y(t)} stroke="var(--grid)" strokeWidth={1} />
              <text x={-10} y={y(t)} dy="0.32em" textAnchor="end" className="fill-ink-3 tnum text-[11px]">
                {compact(t)}
              </text>
            </g>
          ))}
          {points.map((p, i) =>
            i % every === 0 || i === points.length - 1 ? (
              <text key={p.label} x={x(i)} y={h + 18} textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"} className="fill-ink-3 text-[11px]">
                {formatX(p.label, i)}
              </text>
            ) : null,
          )}
          {hasPrev && <path d={previous} fill="none" stroke="var(--series-muted)" strokeWidth={1.5} strokeDasharray="4 4" strokeLinejoin="round" strokeLinecap="round" />}
          <path d={area} fill="url(#trend-wash)" />
          <path d={current} fill="none" stroke="var(--series-1)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {hover !== null && hp && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={0} y2={h} stroke="var(--line-strong)" strokeWidth={1} />
              {hp.previous !== undefined && <circle cx={x(hover)} cy={y(hp.previous)} r={4} fill="var(--series-muted)" stroke="var(--surface)" strokeWidth={2} />}
              <circle cx={x(hover)} cy={y(hp.value)} r={5} fill="var(--series-1)" stroke="var(--surface)" strokeWidth={2} />
            </g>
          )}
        </g>
      </svg>
      {hover !== null && hp && (
        <div className="pointer-events-none absolute top-0 z-10 w-[170px] rounded-xl border border-line bg-surface px-3 py-2.5 shadow-xl" style={{ left: tipLeft }}>
          <p className="mb-1.5 text-xs text-ink-3">{(formatTooltipX ?? formatX)(hp.label, hover)}</p>
          <p className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink-3">
              <span className="h-0.5 w-3 rounded bg-[var(--series-1)]" />
              {seriesLabel}
            </span>
            <span className="font-semibold text-ink tnum">{fmt(hp.value)}</span>
          </p>
          {hp.previous !== undefined && (
            <p className="mt-1 flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-ink-3">
                <span className="h-0.5 w-3 rounded bg-[var(--series-muted)]" />
                Before
              </span>
              <span className="font-semibold text-ink-2 tnum">{fmt(hp.previous)}</span>
            </p>
          )}
        </div>
      )}
      {hasPrev && (
        <div className="mt-3 flex items-center gap-5 text-xs text-ink-3" aria-hidden>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-4 rounded bg-[var(--series-1)]" />
            {seriesLabel}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0 w-4 border-t-[1.5px] border-dashed border-[var(--series-muted)]" />
            {previousLabel}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Bar list ─────────────────────────────────────────────────────────────

export type BarRow = { key: string; label: ReactNode; value: number; secondary?: ReactNode; title?: string; href?: string };

/**
 * A ranked list with a quiet bar behind each label (one series, so one
 * neutral hue). The value sits at the end in ink; the bar's length is the
 * only encoding.
 */
export function BarList({ rows, valueLabel, empty, max: maxIn, limit = 8, format = fmt }: { rows: BarRow[]; valueLabel: string; empty?: ReactNode; max?: number; limit?: number; format?: (n: number) => string }) {
  const [all, setAll] = useState(false);
  if (rows.length === 0) return <div className="px-6 py-8 text-center text-sm text-ink-3">{empty ?? "Nothing here yet."}</div>;
  const shown = all ? rows : rows.slice(0, limit);
  const max = maxIn ?? Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="px-3 pb-3">
      <div className="flex justify-between px-3 pb-2">
        <span className="eyebrow">Name</span>
        <span className="eyebrow">{valueLabel}</span>
      </div>
      <ul className="space-y-1">
        {shown.map((r) => (
          <li key={r.key} title={r.title} className="group relative flex h-9 items-center justify-between gap-3 overflow-hidden rounded-xl px-3">
            <span
              className="absolute inset-y-1 left-0 rounded-r-[4px] rounded-l-[2px] bg-ink/[0.07] transition-colors group-hover:bg-ink/[0.11]"
              style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }}
              aria-hidden
            />
            <span className="relative min-w-0 truncate text-[13.5px] text-ink">{r.label}</span>
            <span className="relative flex shrink-0 items-center gap-3 text-[13px] tnum">
              {r.secondary && <span className="text-ink-3">{r.secondary}</span>}
              <span className="font-semibold text-ink">{format(r.value)}</span>
            </span>
          </li>
        ))}
      </ul>
      {rows.length > limit && (
        <button type="button" onClick={() => setAll(!all)} className="mt-2 ml-3 text-xs font-bold tracking-[0.15em] text-ink-3 uppercase hover:text-ink">
          {all ? "Show less" : `Show all ${rows.length}`}
        </button>
      )}
    </div>
  );
}

// ── Segmented bar ────────────────────────────────────────────────────────

export type Segment = { key: string; label: string; value: number; slot: number };

/** One whole split into parts, with a legend underneath (name, share, count). */
export function SegmentedBar({ segments, valueLabel }: { segments: Segment[]; valueLabel: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const [hover, setHover] = useState<string | null>(null);
  const visible = segments.filter((s) => s.value > 0);
  if (total === 0) return <div className="py-6 text-center text-sm text-ink-3">No visits in this period.</div>;
  return (
    <div>
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full" role="img" aria-label={visible.map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(", ")}>
        {visible.map((s) => (
          <span
            key={s.key}
            onPointerEnter={() => setHover(s.key)}
            onPointerLeave={() => setHover(null)}
            className={cx("h-full rounded-[4px] transition-opacity first:rounded-l-full last:rounded-r-full", hover && hover !== s.key && "opacity-40")}
            style={{ width: `${(s.value / total) * 100}%`, background: `var(--series-${s.slot})` }}
            title={`${s.label}: ${fmt(s.value)} (${Math.round((s.value / total) * 100)}%)`}
          />
        ))}
      </div>
      <table className="mt-4 w-full text-sm">
        <thead className="sr-only">
          <tr>
            <th>Name</th>
            <th>Share</th>
            <th>{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((s) => (
            <tr
              key={s.key}
              onPointerEnter={() => setHover(s.key)}
              onPointerLeave={() => setHover(null)}
              className={cx("transition-opacity", hover && hover !== s.key && "opacity-50")}
            >
              <td className="py-1.5">
                <span className="flex items-center gap-2.5 text-ink-2">
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: `var(--series-${s.slot})` }} aria-hidden />
                  {s.label}
                </span>
              </td>
              <td className="py-1.5 text-right text-ink-3 tnum">{total ? `${Math.round((s.value / total) * 100)}%` : "–"}</td>
              <td className="w-16 py-1.5 text-right font-semibold text-ink tnum">{fmt(s.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A slim meter for scroll depth: track and fill from the same hue. */
export function Meter({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-ink-2">{label}</span>
        <span className="text-[22px] font-light text-ink tnum">{Math.round(value)}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-green/15" role="meter" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} average scroll depth`}>
        <div className="h-full rounded-full bg-brand-green" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}
