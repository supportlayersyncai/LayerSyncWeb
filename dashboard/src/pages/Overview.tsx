import { useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { ArrowRight, Globe2, Lightbulb, MousePointerClick, Radio, Smartphone, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { BarList, Delta, Meter, SegmentedBar, StatTile, TrendChart } from "../components/charts";
import { Button, Card, CardHeader, CodeBlock, cx, EmptyState, PageHeader, Segmented, Select, StatusPill } from "../components/ui";
import { PRESETS, rangeFor, type Preset } from "../lib/dates";
import {
  CHANNEL_LABEL,
  CHANNEL_SLOT,
  countryName,
  dayLabel,
  DEVICE_LABEL,
  DEVICE_SLOT,
  duration,
  EVENT_LABEL,
  flag,
  fmt,
  pct,
  relativeTime,
} from "../lib/format";
import { useWorkspace } from "../lib/workspace";

type Metric = "visitors" | "sessions" | "pageviews" | "conversions";
const METRIC_LABEL: Record<Metric, string> = { visitors: "Visitors", sessions: "Visits", pageviews: "Pageviews", conversions: "Leads" };

/** Re-render every `ms`, for "live" windows and relative times. */
function useNow(ms: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

export function Overview() {
  const { workspace, sites } = useWorkspace();
  const [params, setParams] = useSearchParams();
  const siteId = (params.get("site") as Id<"sites"> | null) ?? sites[0]?._id;
  const site = sites.find((s) => s._id === siteId) ?? sites[0];
  const preset = (PRESETS.some((p) => p.key === params.get("range")) ? params.get("range") : "30d") as Preset;
  const [metric, setMetric] = useState<Metric>("visitors");
  const now = useNow(30_000);
  // The day boundary only matters to the minute.
  const range = useMemo(() => (site ? rangeFor(preset, site.timezone, now) : null), [site, preset, Math.floor(now / 60_000)]); // eslint-disable-line react-hooks/exhaustive-deps

  const data = useQuery(api.analytics.overview, site && range ? { siteId: site._id, ...range } : "skip");
  const since = Math.floor((now - 5 * 60_000) / 60_000) * 60_000;
  const live = useQuery(api.analytics.live, site ? { siteId: site._id, since } : "skip");
  const recent = useQuery(api.contacts.recent, site ? { workspaceId: workspace._id, siteId: site._id } : "skip");

  // Keep the last result on screen while a new range loads (no flash).
  const [shown, setShown] = useState(data);
  useEffect(() => {
    if (data) setShown(data);
  }, [data]);
  const loading = data === undefined;

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    next.set(k, v);
    setParams(next, { replace: true });
  };

  if (!site) {
    return (
      <>
        <PageHeader eyebrow={workspace.name} title="Overview" />
        <Card>
          <EmptyState
            icon={<Globe2 className="h-5 w-5" />}
            title="Add your website to start"
            action={
              <Link to={`/${workspace.slug}/settings/sites`}>
                <Button variant="primary">Add a site</Button>
              </Link>
            }
          >
            Once the site is added you'll get a one-line snippet to paste into it.
          </EmptyState>
        </Card>
      </>
    );
  }

  const d = shown;
  const t = d?.totals;
  const p = d?.previous;
  const span = d?.range.days ?? 30;

  return (
    <>
      <PageHeader
        eyebrow={workspace.name}
        title="Overview"
        description={
          <>
            {site.domains[0]}
            {d?.updatedAt ? <span className="text-ink-3"> · updated {relativeTime(d.updatedAt, now)}</span> : null}
          </>
        }
        actions={
          <>
            {sites.length > 1 && (
              <Select aria-label="Website" value={site._id} onChange={(e) => set("site", e.target.value)} className="!h-10 !w-auto rounded-full text-sm">
                {sites.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            )}
            <LivePill count={live?.visitors} />
          </>
        }
      />

      {/* One row of filters above everything they scope. */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Segmented
          label="Date range"
          value={preset}
          onChange={(v) => set("range", v)}
          options={PRESETS.map((pr) => ({ value: pr.key, label: pr.short, title: pr.label }))}
        />
        <span className="text-sm text-ink-3">
          {range && (range.from === range.to ? dayLabel(range.from, true) : `${dayLabel(range.from)} – ${dayLabel(range.to)}`)}
          <span className="hidden sm:inline"> · compared with the {span === 1 ? "day" : `${span} days`} before</span>
        </span>
      </div>

      {d && !d.hasAnyData && <InstallHint siteKey={site.publicKey} slug={workspace.slug} />}

      <div className={cx("space-y-5 transition-opacity", loading && shown && "opacity-60")}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <StatTile label="Visitors" value={t ? fmt(t.visitors) : "–"} delta={t && p && <Delta current={t.visitors} previous={p.visitors} />} selected={metric === "visitors"} onSelect={() => setMetric("visitors")} hint="People counted once per day" />
          <StatTile label="Visits" value={t ? fmt(t.sessions) : "–"} delta={t && p && <Delta current={t.sessions} previous={p.sessions} />} selected={metric === "sessions"} onSelect={() => setMetric("sessions")} />
          <StatTile label="Pageviews" value={t ? fmt(t.pageviews) : "–"} delta={t && p && <Delta current={t.pageviews} previous={p.pageviews} />} selected={metric === "pageviews"} onSelect={() => setMetric("pageviews")} />
          <StatTile
            label="Time per visit"
            value={t ? duration(t.sessions ? t.engagedMs / t.sessions : 0) : "–"}
            delta={t && p && <Delta current={t.sessions ? t.engagedMs / t.sessions : 0} previous={p.sessions ? p.engagedMs / p.sessions : 0} />}
            hint="Time with the page open and in view"
          />
          <StatTile
            label="Bounce rate"
            value={t ? pct(t.bounces, t.sessions, 0) : "–"}
            delta={t && p && <Delta current={t.sessions ? t.bounces / t.sessions : 0} previous={p.sessions ? p.bounces / p.sessions : 0} upIsGood={false} />}
            hint="Visits that saw one page for under 10 seconds and did nothing"
          />
          <StatTile label="Leads" value={t ? fmt(t.conversions) : "–"} delta={t && p && <Delta current={t.conversions} previous={p.conversions} />} selected={metric === "conversions"} onSelect={() => setMetric("conversions")} hint="Visits that sent a form" />
        </div>

        <Insights data={d} />

        <div className="grid gap-5 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader
              title={METRIC_LABEL[metric]}
              eyebrow={span === 1 ? "By hour" : "By day"}
              action={
                t && (
                  <span className="text-right">
                    <span className="block text-[22px] font-light text-ink">{fmt(metric === "sessions" ? t.sessions : metric === "pageviews" ? t.pageviews : metric === "conversions" ? t.conversions : t.visitors)}</span>
                    <span className="text-xs text-ink-3">this period</span>
                  </span>
                )
              }
            />
            <div className="px-4 pt-4 pb-5 sm:px-6">
              {d && span === 1 && (metric === "visitors" || metric === "conversions") ? (
                <p className="py-16 text-center text-sm text-ink-3">For a single day the chart shows visits and pageviews by hour. Pick Visits or Pageviews above.</p>
              ) : d ? (
                <TrendChart
                  seriesLabel={METRIC_LABEL[metric]}
                  points={d.series.map((pt, i) => ({ label: pt.label, value: pt[metric], previous: d.previousSeries[i]?.[metric] }))}
                  formatX={(l) => (span === 1 ? l : dayLabel(l))}
                  formatTooltipX={(l, i) => (span === 1 ? l : `${dayLabel(l, true)} vs ${dayLabel(d.previousSeries[i]?.label ?? l)}`)}
                />
              ) : (
                <div className="h-[260px]" />
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Channels" eyebrow="Where visits come from" />
            <div className="px-6 pt-5 pb-6">
              <SegmentedBar
                valueLabel="Visits"
                segments={(d?.breakdowns.channels ?? []).map((c) => ({ key: c.k, label: CHANNEL_LABEL[c.k] ?? c.k, value: c.s, slot: CHANNEL_SLOT[c.k] ?? 7 }))}
              />
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader title="Top pages" eyebrow="What people read" />
            <PagesTable rows={d?.breakdowns.pages ?? []} />
          </Card>
          <Card>
            <CardHeader title="Sources" eyebrow="Sites and apps that sent visits" />
            <div className="pt-4">
              <BarList valueLabel="Visits" rows={(d?.breakdowns.sources ?? []).map((s) => ({ key: s.k, label: s.k, value: s.s, secondary: s.c ? `${s.c} lead${s.c === 1 ? "" : "s"}` : undefined }))} />
            </div>
          </Card>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHeader title="Countries" icon={<Globe2 className="h-4 w-4" />} />
            <div className="pt-4">
              <BarList
                valueLabel="Visits"
                rows={(d?.breakdowns.countries ?? []).map((c) => ({
                  key: c.k,
                  label: (
                    <span>
                      <span aria-hidden className="mr-2">
                        {flag(c.k)}
                      </span>
                      {countryName(c.k)}
                    </span>
                  ),
                  value: c.s,
                }))}
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="Devices" icon={<Smartphone className="h-4 w-4" />} />
            <div className="space-y-6 px-6 pt-5 pb-6">
              <SegmentedBar
                valueLabel="Visits"
                segments={["desktop", "mobile", "tablet"].map((k) => ({ key: k, label: DEVICE_LABEL[k], value: d?.breakdowns.devices.find((x) => x.k === k)?.s ?? 0, slot: DEVICE_SLOT[k] }))}
              />
              <div>
                <p className="eyebrow mb-3">How far down they scroll</p>
                <div className="space-y-4">
                  {(d?.breakdowns.scroll ?? []).filter((s) => s.n > 0).length === 0 ? (
                    <p className="text-sm text-ink-3">No scroll data yet.</p>
                  ) : (
                    ["desktop", "mobile", "tablet"].map((k) => {
                      const s = d?.breakdowns.scroll.find((x) => x.k === k);
                      return s && s.n ? <Meter key={k} label={DEVICE_LABEL[k]} value={s.sum / s.n} /> : null;
                    })
                  )}
                </div>
              </div>
            </div>
          </Card>
          <Card className="md:col-span-2 xl:col-span-1">
            <CardHeader title="What people tapped" icon={<MousePointerClick className="h-4 w-4" />} eyebrow="Actions on the site" />
            <div className="pt-4">
              <BarList
                valueLabel="Times"
                empty="No taps on WhatsApp, phone, email or download links yet."
                rows={(d?.breakdowns.eventNames ?? []).filter((e) => e.k !== "(other)" && e.k !== "lead").map((e) => ({ key: e.k, label: EVENT_LABEL[e.k] ?? e.k.replace(/_/g, " "), value: e.n }))}
              />
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <Card>
            <CardHeader title="Where leads come from" icon={<Users className="h-4 w-4" />} eyebrow={d ? `${fmt(d.leads.total)} in this period` : undefined} />
            <div className="pt-4">
              <BarList valueLabel="Leads" empty="No form sends in this period." rows={(d?.leads.bySource ?? []).map((s) => ({ key: s.k, label: s.k === "(unknown)" ? "Not tracked" : s.k, value: s.n }))} />
            </div>
          </Card>
          <Card>
            <CardHeader
              title="Latest leads"
              action={
                <Link to={`/${workspace.slug}/leads`} className="inline-flex items-center gap-1 text-xs font-bold tracking-[0.15em] text-ink-3 uppercase hover:text-ink">
                  All leads <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
            <ul className="px-3 pt-3 pb-3">
              {recent === undefined ? null : recent.length === 0 ? (
                <li className="px-3 py-8 text-center text-sm text-ink-3">When someone fills in a form on your site, they'll appear here.</li>
              ) : (
                recent.map((r) => (
                  <li key={r.submissionId}>
                    <Link to={`/${workspace.slug}/leads/${r.contactId}`} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 hover:bg-surface-2">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-ink">{r.name}</span>
                        <span className="block truncate text-xs text-ink-3">
                          {r.form} form{r.source && r.source !== "(unknown)" ? ` · via ${r.source}` : ""} · {relativeTime(r.createdAt, now)}
                        </span>
                      </span>
                      <StatusPill status={r.status} />
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </Card>
          <LiveFeed live={live} now={now} />
        </div>
      </div>
    </>
  );
}

function LivePill({ count }: { count?: number }) {
  return (
    <span className="inline-flex h-10 items-center gap-2.5 rounded-full border border-line bg-surface px-4 text-sm text-ink-2" title="Visitors active in the last five minutes">
      <span className={cx("h-2 w-2 rounded-full", count ? "live-dot bg-brand-green" : "bg-ink-3/50")} />
      <span className="font-semibold text-ink tnum">{count ?? "–"}</span> on the site now
    </span>
  );
}

type PageRow = { k: string; s: number; pv: number; b: number; c: number; e: number; en: number; ex: number; sc: number; scn: number };

function PagesTable({ rows }: { rows: PageRow[] }) {
  const [all, setAll] = useState(false);
  if (rows.length === 0) return <p className="px-6 py-10 text-center text-sm text-ink-3">No pageviews in this period.</p>;
  const shown = all ? rows : rows.slice(0, 10);
  const max = Math.max(...rows.map((r) => r.pv));
  return (
    <div className="px-3 pt-3 pb-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left">
              <th className="eyebrow px-3 pb-2 font-bold">Page</th>
              <th className="eyebrow px-3 pb-2 text-right font-bold">Views</th>
              <th className="eyebrow px-3 pb-2 text-right font-bold" title="Visits that started on this page">Entries</th>
              <th className="eyebrow px-3 pb-2 text-right font-bold" title="Average time in view per pageview">Time</th>
              <th className="eyebrow px-3 pb-2 text-right font-bold" title="Average scroll depth">Scroll</th>
              <th className="eyebrow px-3 pb-2 text-right font-bold" title="Visits that saw this page and then sent a form">Leads</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.k} className="group">
                <td className="relative max-w-[280px] px-3 py-2">
                  <span className="absolute inset-y-1 left-0 rounded-r-[4px] bg-ink/[0.06] group-hover:bg-ink/[0.1]" style={{ width: `${Math.max(2, (r.pv / max) * 100)}%` }} aria-hidden />
                  <span className="relative block truncate text-ink" title={r.k}>
                    {r.k}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-semibold text-ink tnum">{fmt(r.pv)}</td>
                <td className="px-3 py-2 text-right text-ink-2 tnum">{fmt(r.en)}</td>
                <td className="px-3 py-2 text-right text-ink-2 tnum">{duration(r.pv ? r.e / r.pv : 0)}</td>
                <td className="px-3 py-2 text-right text-ink-2 tnum">{r.scn ? `${Math.round(r.sc / r.scn)}%` : "–"}</td>
                <td className="px-3 py-2 text-right text-ink-2 tnum">{r.c || "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 10 && (
        <button type="button" onClick={() => setAll(!all)} className="mt-2 ml-3 text-xs font-bold tracking-[0.15em] text-ink-3 uppercase hover:text-ink">
          {all ? "Show less" : `Show all ${rows.length}`}
        </button>
      )}
    </div>
  );
}

type Live = { visitors: number; feed: Array<{ _id: string; kind: string; name: string; path: string; at: number; country: string | null; device: string | null; source: string | null }> } | undefined;

function LiveFeed({ live, now }: { live: Live; now: number }) {
  return (
    <Card>
      <CardHeader title="Live" icon={<Radio className="h-4 w-4" />} eyebrow="Latest activity" />
      <ul className="max-h-[340px] overflow-y-auto px-3 pt-3 pb-3">
        {!live || live.feed.length === 0 ? (
          <li className="px-3 py-8 text-center text-sm text-ink-3">Waiting for the first visit.</li>
        ) : (
          live.feed.map((e) => (
            <li key={e._id} className="flex items-center gap-3 rounded-2xl px-3 py-2">
              <span aria-hidden className="text-base">
                {flag(e.country)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] text-ink">{e.kind === "pageview" ? e.path : EVENT_LABEL[e.name] ? `${EVENT_LABEL[e.name].replace(/s$/, "")} on ${e.path}` : `${e.name.replace(/_/g, " ")} on ${e.path}`}</span>
                <span className="block truncate text-xs text-ink-3">
                  {[e.device && DEVICE_LABEL[e.device], e.source].filter(Boolean).join(" · ")}
                </span>
              </span>
              <span className="shrink-0 text-xs text-ink-3 tnum">{relativeTime(e.at, now)}</span>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}

type OverviewData = FunctionReturnType<typeof api.analytics.overview>;

/** A few plain-language observations, computed from the numbers on screen. */
function Insights({ data }: { data: OverviewData | undefined }) {
  if (!data || data.totals.sessions < 20) return null;
  const notes: string[] = [];
  const t = data.totals;
  const ch = data.breakdowns.channels[0];
  if (ch && ch.k !== "(other)") notes.push(`${CHANNEL_LABEL[ch.k] ?? ch.k} brought ${pct(ch.s, t.sessions, 0)} of visits.`);
  // Only pages with enough traffic to mean something.
  const landing = data.breakdowns.pages.filter((p) => p.s >= Math.max(30, t.sessions * 0.05) && p.k !== "(other)").sort((a, b) => b.c / Math.max(1, b.s) - a.c / Math.max(1, a.s))[0];
  if (landing && landing.c > 0) notes.push(`Visits that saw ${landing.k} sent a form ${pct(landing.c, landing.s, 1)} of the time.`);
  const mobile = data.breakdowns.devices.find((d) => d.k === "mobile");
  if (mobile) notes.push(`${pct(mobile.s, t.sessions, 0)} of visits were on a phone.`);
  const wa = data.breakdowns.eventNames.find((e) => e.k === "whatsapp");
  if (wa && wa.n >= 3) notes.push(`People tapped WhatsApp ${fmt(wa.n)} times.`);
  if (notes.length === 0) return null;
  return (
    <div className="flex flex-col gap-3 rounded-[22px] border border-line bg-gradient-to-r from-brand-orange/[0.06] via-transparent to-brand-green/[0.06] px-5 py-4 sm:flex-row sm:items-center">
      <span className="flex shrink-0 items-center gap-2 text-xs font-bold tracking-[0.2em] text-ink-2 uppercase">
        <Lightbulb className="h-4 w-4 text-brand-orange" /> What stands out
      </span>
      <p className="text-sm leading-relaxed text-ink-2">{notes.join(" ")}</p>
    </div>
  );
}

function InstallHint({ siteKey, slug }: { siteKey: string; slug: string }) {
  const snippet = `<script defer src="${location.origin}/s.js" data-site="${siteKey}"></script>`;
  return (
    <Card className="mb-5 overflow-hidden">
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div>
          <p className="eyebrow mb-2">No visits yet</p>
          <h2 className="display text-[26px]">Paste this into your site</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-3">
            Put it in the &lt;head&gt; of every page. Visits show up within a couple of minutes. Forms, domains and more are under{" "}
            <Link to={`/${slug}/settings/sites`} className="text-ink underline underline-offset-4">
              Settings, Sites
            </Link>
            .
          </p>
        </div>
        <CodeBlock label="Tracking snippet" code={snippet} />
      </div>
    </Card>
  );
}
