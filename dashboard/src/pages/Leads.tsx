import { useConvex, useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { CalendarClock, Download, Inbox, Plus, Search } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button, Card, cx, EmptyState, errorMessage, Field, Input, Modal, PageHeader, Spinner, STATUS_LABEL, StatusPill, Textarea, useToast, type ContactStatus } from "../components/ui";
import { toCsv, download } from "../lib/csv";
import { countryName, dateShort, flag, relativeTime } from "../lib/format";
import { can, useWorkspace } from "../lib/workspace";

type Filter = ContactStatus | "all";
const TABS: Filter[] = ["all", "new", "contacted", "qualified", "won", "lost", "spam"];

function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function Leads() {
  const { workspace, role } = useWorkspace();
  const [params, setParams] = useSearchParams();
  const filter = (TABS.includes(params.get("status") as Filter) ? params.get("status") : "all") as Filter;
  const [search, setSearch] = useState(params.get("q") ?? "");
  const q = useDebounced(search.trim(), 250);
  const counts = useQuery(api.contacts.statusCounts, { workspaceId: workspace._id });
  const due = useQuery(api.contacts.dueFollowUps, { workspaceId: workspace._id, before: endOfToday() });
  const { results, status, loadMore } = usePaginatedQuery(
    api.contacts.list,
    { workspaceId: workspace._id, filter, search: q || undefined },
    { initialNumItems: 30 },
  );
  const [adding, setAdding] = useState(false);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();
  const convex = useConvex();
  const toast = useToast();

  /** Fetch every page, then download. Pages keep each request well inside Convex's limits. */
  const exportCsv = async () => {
    setExporting(true);
    try {
      const rows: Array<Record<string, string | number>> = [];
      let cursor: string | null = null;
      for (let i = 0; i < 200; i++) {
        const page: { rows: Array<Record<string, string | number>>; cursor: string | null } = await convex.query(api.contacts.exportPage, { workspaceId: workspace._id, filter, cursor });
        rows.push(...page.rows);
        cursor = page.cursor;
        if (!cursor) break;
      }
      if (rows.length === 0) toast({ title: "Nothing to export", tone: "info" });
      else download(`${workspace.slug}-leads-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
    } catch (err) {
      toast({ title: "Export failed", body: errorMessage(err), tone: "error" });
    } finally {
      setExporting(false);
    }
  };

  const setFilter = (f: Filter) => {
    const next = new URLSearchParams(params);
    if (f === "all") next.delete("status");
    else next.set("status", f);
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHeader
        eyebrow={workspace.name}
        title="Leads"
        description="Everyone who got in touch through your website, plus anyone you add. Open a lead to see where they came from and keep notes."
        actions={
          <>
            {can(role, "admin") && (
              <Button icon={<Download className="h-3.5 w-3.5" />} loading={exporting} onClick={() => void exportCsv()}>
                Export CSV
              </Button>
            )}
            {can(role, "member") && (
              <Button variant="primary" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setAdding(true)}>
                Add lead
              </Button>
            )}
          </>
        }
      />

      {due && due.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[22px] border border-brand-orange/25 bg-brand-orange/[0.06] px-5 py-3.5 text-sm">
          <CalendarClock className="h-4 w-4 text-brand-orange" />
          <span className="font-semibold text-ink">Follow up today:</span>
          {due.slice(0, 6).map((c) => (
            <Link key={c._id} to={`/${workspace.slug}/leads/${c._id}`} className="rounded-full border border-line bg-surface px-3 py-0.5 text-ink-2 hover:text-ink">
              {c.name}
            </Link>
          ))}
          {due.length > 6 && <span className="text-ink-3">and {due.length - 6} more</span>}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Lead status" className="flex gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1">
          {TABS.map((tab) => {
            const n = counts ? (tab === "all" ? counts.all : counts[tab]) : undefined;
            return (
              <button
                key={tab}
                role="tab"
                type="button"
                aria-selected={filter === tab}
                onClick={() => setFilter(tab)}
                className={cx(
                  "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                  filter === tab ? "bg-ink text-bg" : "text-ink-3 hover:text-ink",
                )}
              >
                {tab === "all" ? "All" : STATUS_LABEL[tab]}
                {n !== undefined && <span className={cx("tnum text-xs", filter === tab ? "opacity-70" : "text-ink-3")}>{n}</span>}
              </button>
            );
          })}
        </div>
        <label className="relative block lg:w-80">
          <span className="sr-only">Search leads</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone, company" className="!h-11 rounded-full pl-11" />
        </label>
      </div>

      <Card className="overflow-hidden">
        {status === "LoadingFirstPage" ? (
          <div className="grid place-items-center py-16">
            <Spinner />
          </div>
        ) : results.length === 0 ? (
          <EmptyState icon={<Inbox className="h-5 w-5" />} title={q ? "No leads match that search" : filter === "all" ? "No leads yet" : `No ${STATUS_LABEL[filter as ContactStatus].toLowerCase()} leads`}>
            {filter === "all" && !q ? "When someone fills in a form on your website they'll appear here, and you'll get an email." : null}
          </EmptyState>
        ) : (
          <>
            {/* Table on wide screens */}
            <table className="hidden w-full text-sm md:table">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="eyebrow px-6 py-3.5 font-bold">Name</th>
                  <th className="eyebrow px-3 py-3.5 font-bold">Status</th>
                  <th className="eyebrow px-3 py-3.5 font-bold">Came from</th>
                  <th className="eyebrow px-3 py-3.5 font-bold">Follow up</th>
                  <th className="eyebrow px-3 py-3.5 font-bold">Owner</th>
                  <th className="eyebrow px-6 py-3.5 text-right font-bold">Last activity</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr
                    key={r._id}
                    onClick={() => navigate(`/${workspace.slug}/leads/${r._id}`)}
                    className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-surface-2"
                  >
                    <td className="px-6 py-3.5">
                      <Link to={`/${workspace.slug}/leads/${r._id}`} onClick={(e) => e.stopPropagation()} className="block font-medium text-ink hover:underline">
                        {r.name}
                      </Link>
                      <span className="block truncate text-xs text-ink-3">{[r.company, r.email ?? r.phone].filter(Boolean).join(" · ")}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-3 py-3.5 text-ink-2">
                      {r.country && (
                        <span className="mr-1.5" title={countryName(r.country)} aria-hidden>
                          {flag(r.country)}
                        </span>
                      )}
                      {r.source && r.source !== "(unknown)" ? r.source : <span className="text-ink-3">–</span>}
                    </td>
                    <td className={cx("px-3 py-3.5 tnum", r.followUpAt && r.followUpAt < Date.now() ? "font-semibold text-brand-orange" : "text-ink-2")}>
                      {r.followUpAt ? dateShort(r.followUpAt) : <span className="text-ink-3">–</span>}
                    </td>
                    <td className="px-3 py-3.5 text-ink-2">{r.assignee ?? <span className="text-ink-3">–</span>}</td>
                    <td className="px-6 py-3.5 text-right text-ink-3 tnum">{relativeTime(r.lastActivityAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Cards on phones */}
            <ul className="divide-y divide-line md:hidden">
              {results.map((r) => (
                <li key={r._id}>
                  <Link to={`/${workspace.slug}/leads/${r._id}`} className="flex items-start justify-between gap-3 px-5 py-4 active:bg-surface-2">
                    <span className="min-w-0">
                      <span className="block font-medium text-ink">{r.name}</span>
                      <span className="block truncate text-xs text-ink-3">{r.email ?? r.phone}</span>
                      <span className="mt-1 block text-xs text-ink-3">
                        {r.source && r.source !== "(unknown)" ? `${r.source} · ` : ""}
                        {relativeTime(r.lastActivityAt)}
                      </span>
                    </span>
                    <StatusPill status={r.status} />
                  </Link>
                </li>
              ))}
            </ul>
            {status === "CanLoadMore" && (
              <div className="border-t border-line p-4 text-center">
                <Button onClick={() => loadMore(30)}>Load more</Button>
              </div>
            )}
            {status === "LoadingMore" && (
              <div className="grid place-items-center border-t border-line p-4">
                <Spinner />
              </div>
            )}
          </>
        )}
      </Card>

      <AddLead open={adding} onClose={() => setAdding(false)} />
    </>
  );
}

function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  // Stable for the whole minute so the query isn't re-created every render.
  return Math.floor(d.getTime() / 60_000) * 60_000;
}

function AddLead({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { workspace } = useWorkspace();
  const create = useMutation(api.contacts.create);
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", note: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() && !form.phone.trim()) return setError("Add an email address or a phone number.");
    setBusy(true);
    setError(null);
    try {
      const id = await create({
        workspaceId: workspace._id,
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        company: form.company || undefined,
        note: form.note || undefined,
      });
      toast({ title: "Lead added", tone: "success" });
      setForm({ name: "", email: "", phone: "", company: "", note: "" });
      onClose();
      navigate(`/${workspace.slug}/leads/${id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add a lead">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name" htmlFor="lead-name">
          <Input id="lead-name" required value={form.name} onChange={set("name")} placeholder="Rudo Chikwanha" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" htmlFor="lead-email">
            <Input id="lead-email" type="email" value={form.email} onChange={set("email")} />
          </Field>
          <Field label="Phone" htmlFor="lead-phone" hint={`Local numbers get +${workspace.defaultCountryCode}.`}>
            <Input id="lead-phone" type="tel" value={form.phone} onChange={set("phone")} />
          </Field>
        </div>
        <Field label="Company" htmlFor="lead-company">
          <Input id="lead-company" value={form.company} onChange={set("company")} />
        </Field>
        <Field label="Note" htmlFor="lead-note">
          <Textarea id="lead-note" value={form.note} onChange={set("note")} placeholder="How you met, what they need" />
        </Field>
        {error && <p className="text-sm text-bad">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={busy} disabled={form.name.trim().length < 2}>
            Add lead
          </Button>
        </div>
      </form>
    </Modal>
  );
}
