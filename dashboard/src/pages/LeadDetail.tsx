import { useMutation, useQuery } from "convex/react";
import type { FunctionArgs, FunctionReturnType } from "convex/server";
import { ArrowLeft, Building2, Clock, Compass, FileText, Mail, MapPin, MessageCircle, MonitorSmartphone, Phone, Route, Tag, Trash2, X } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import { Badge, Button, Card, CardHeader, cx, EmptyState, errorMessage, Field, Input, Modal, PageLoading, Select, STATUS_LABEL, StatusPill, Textarea, useToast, type ContactStatus } from "../components/ui";
import { CHANNEL_LABEL, countryName, dateTime, DEVICE_LABEL, duration, flag, money, relativeTime } from "../lib/format";
import { useWorkspace } from "../lib/workspace";

const PIPELINE: ContactStatus[] = ["new", "contacted", "qualified", "won", "lost"];

export function LeadDetail() {
  const { contactId } = useParams();
  const { workspace } = useWorkspace();
  const data = useQuery(api.contacts.get, { contactId: contactId as Id<"contacts"> });
  if (data === undefined) return <PageLoading />;
  if (data === null) {
    return (
      <Card>
        <EmptyState
          title="Lead not found"
          action={
            <Link to={`/${workspace.slug}/leads`}>
              <Button>Back to leads</Button>
            </Link>
          }
        >
          It may have been deleted.
        </EmptyState>
      </Card>
    );
  }
  return <LeadView data={data} />;
}

type Data = NonNullable<FunctionReturnType<typeof api.contacts.get>>;
type Patch = Omit<FunctionArgs<typeof api.contacts.update>, "contactId">;

function waLink(phone: string, name: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${name.split(" ")[0]}, `)}`;
}

function LeadView({ data }: { data: Data }) {
  const { workspace } = useWorkspace();
  const { contact, canEdit, canDelete } = data;
  const update = useMutation(api.contacts.update);
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [erasing, setErasing] = useState(false);

  const save = async (patch: Patch) => {
    try {
      await update({ contactId: contact._id, ...patch });
    } catch (err) {
      toast({ title: "Couldn't save that", body: errorMessage(err), tone: "error" });
    }
  };

  const first = contact.firstTouch;
  return (
    <>
      <Link to={`/${workspace.slug}/leads`} className="mb-6 inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-ink-3 uppercase hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> All leads
      </Link>

      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusPill status={contact.status} />
            {contact.submissions > 1 && <Badge>{contact.submissions} form sends</Badge>}
            {contact.origin !== "website" && <Badge>{contact.origin === "api" ? "Added through the API" : "Added by hand"}</Badge>}
          </div>
          <h1 className="display truncate text-[36px] md:text-[48px]">{contact.displayName}</h1>
          <p className="mt-2 text-[15px] font-light text-ink-2">
            {[contact.company, `first seen ${relativeTime(contact.createdAt)}`].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {contact.phone && (
            <a href={waLink(contact.phone, contact.displayName)} target="_blank" rel="noopener noreferrer">
              <Button variant="accent" icon={<MessageCircle className="h-4 w-4" />}>
                WhatsApp
              </Button>
            </a>
          )}
          {contact.phone && (
            <a href={`tel:${contact.phone}`}>
              <Button icon={<Phone className="h-3.5 w-3.5" />}>Call</Button>
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`}>
              <Button icon={<Mail className="h-3.5 w-3.5" />}>Email</Button>
            </a>
          )}
        </div>
      </header>

      {canEdit && (
        <div className="mb-6">
          <p className="eyebrow mb-3">Pipeline</p>
          <div role="radiogroup" aria-label="Status" className="flex flex-wrap gap-2">
            {[...PIPELINE, ...(contact.status === "spam" ? (["spam"] as const) : [])].map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={contact.status === s}
                onClick={() => contact.status !== s && void save({ status: s })}
                className={cx(
                  "rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors",
                  contact.status === s ? "border-ink bg-ink text-bg" : "border-line text-ink-3 hover:border-line-strong hover:text-ink",
                )}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
            {contact.status !== "spam" && (
              <button type="button" onClick={() => void save({ status: "spam" })} className="rounded-full px-4 py-2 text-[13px] font-semibold text-ink-3 hover:text-bad">
                Mark as spam
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Details" action={canEdit && <Button size="sm" onClick={() => setEditing(true)}>Edit</Button>} />
            <dl className="grid gap-x-6 gap-y-4 px-6 pt-5 pb-6 sm:grid-cols-2">
              <Detail icon={<Mail className="h-4 w-4" />} label="Email" value={contact.email && <a className="hover:underline" href={`mailto:${contact.email}`}>{contact.email}</a>} />
              <Detail icon={<Phone className="h-4 w-4" />} label="Phone" value={contact.phone && <a className="hover:underline" href={`tel:${contact.phone}`}>{contact.phone}</a>} />
              <Detail icon={<Building2 className="h-4 w-4" />} label="Company" value={contact.company} />
              <Detail icon={<Tag className="h-4 w-4" />} label="Tags" value={contact.tags.length ? <span className="flex flex-wrap gap-1.5">{contact.tags.map((t) => <Badge key={t}>{t}</Badge>)}</span> : null} />
            </dl>
          </Card>

          <Card>
            <CardHeader title="What they sent" icon={<FileText className="h-4 w-4" />} eyebrow={`${data.submissions.length} form ${data.submissions.length === 1 ? "send" : "sends"}`} />
            <div className="space-y-4 px-6 pt-5 pb-6">
              {data.submissions.length === 0 ? (
                <p className="text-sm text-ink-3">This lead was added by hand, so there's no form send.</p>
              ) : (
                data.submissions.map((s) => <Submission key={s._id} s={s} />)
              )}
            </div>
          </Card>

          <Timeline contactId={contact._id} activities={data.activities} canEdit={canEdit} />
        </div>

        <div className="space-y-5">
          {canEdit && <Workflow contact={contact} assignee={data.assignee} save={save} />}
          <Card>
            <CardHeader title="How they found you" icon={<Compass className="h-4 w-4" />} eyebrow="First visit" />
            {first ? (
              <div className="space-y-4 px-6 pt-5 pb-6 text-sm">
                <Fact label="Came from">
                  {first.source === "(unknown)" ? "Not tracked" : first.source}
                  {first.channel && first.channel !== "(unknown)" && <span className="text-ink-3"> · {CHANNEL_LABEL[first.channel] ?? first.channel}</span>}
                </Fact>
                {first.utmCampaign && <Fact label="Campaign">{first.utmCampaign}</Fact>}
                {first.landingPath && <Fact label="Landed on">{first.landingPath}</Fact>}
                {first.timeToConvertMs !== undefined && <Fact label="Got in touch after">{duration(first.timeToConvertMs)} on the site</Fact>}
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-ink-2">
                  {first.country && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-ink-3" />
                      {flag(first.country)} {first.city ? `${first.city}, ` : ""}
                      {countryName(first.country)}
                    </span>
                  )}
                  {first.device && (
                    <span className="flex items-center gap-1.5">
                      <MonitorSmartphone className="h-3.5 w-3.5 text-ink-3" />
                      {DEVICE_LABEL[first.device] ?? first.device}
                    </span>
                  )}
                </div>
                {first.journey && first.journey.length > 0 && (
                  <div>
                    <p className="eyebrow mb-2.5 flex items-center gap-2">
                      <Route className="h-3.5 w-3.5" /> Pages they read first
                    </p>
                    <ol className="space-y-1.5 border-l border-line pl-4">
                      {first.journey.map((path, i) => (
                        <li key={`${path}-${i}`} className="relative truncate text-ink-2" title={path}>
                          <span className="absolute top-2 -left-[19.5px] h-1.5 w-1.5 rounded-full bg-ink-3" />
                          {path}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ) : (
              <p className="px-6 pt-5 pb-6 text-sm text-ink-3">
                {contact.origin === "website" ? "Their visit wasn't tracked (they may have Do Not Track on)." : "Added outside the website."}
              </p>
            )}
          </Card>
          {canDelete && (
            <button type="button" onClick={() => setErasing(true)} className="flex items-center gap-2 px-2 text-sm text-ink-3 hover:text-bad">
              <Trash2 className="h-4 w-4" /> Delete this lead and everything they sent
            </button>
          )}
        </div>
      </div>

      <EditDetails open={editing} onClose={() => setEditing(false)} contact={contact} />
      <Erase open={erasing} onClose={() => setErasing(false)} contactId={contact._id} name={contact.displayName} />
    </>
  );
}

function Detail({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-ink-3">{icon}</span>
      <div className="min-w-0">
        <dt className="eyebrow">{label}</dt>
        <dd className="mt-1 truncate text-[15px] text-ink">{value || <span className="text-ink-3">–</span>}</dd>
      </div>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-[15px] text-ink">{children}</p>
    </div>
  );
}

function Submission({ s }: { s: Data["submissions"][number] }) {
  return (
    <article className="rounded-2xl border border-line bg-surface-2 p-4">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-ink capitalize">{s.form} form</span>
        <span className="text-xs text-ink-3">
          {s.siteName}
          {s.page ? ` · ${s.page}` : ""} · {dateTime(s.createdAt)}
        </span>
      </header>
      {s.spam && <Badge tone="warn" className="mb-3">Flagged as spam: {s.spamReason}</Badge>}
      <dl className="grid gap-x-6 gap-y-2.5 sm:grid-cols-[minmax(110px,auto)_1fr]">
        {s.fields.map((f) => (
          <div key={f.key} className="contents">
            <dt className="text-xs font-semibold tracking-[0.1em] text-ink-3 uppercase sm:pt-0.5">{f.key.replace(/[_-]+/g, " ")}</dt>
            {/* Typed by a website visitor: shown as text, never as HTML. */}
            <dd className="text-[14.5px] break-words whitespace-pre-wrap text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function Workflow({ contact, assignee, save }: { contact: Doc<"contacts">; assignee: Data["assignee"]; save: (p: Patch) => Promise<void> }) {
  const { workspace } = useWorkspace();
  const members = useQuery(api.members.list, { workspaceId: workspace._id });
  const [value, setValue] = useState(contact.value?.toString() ?? "");
  const [tag, setTag] = useState("");
  const followDate = contact.followUpAt ? new Date(contact.followUpAt - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 16) : "";
  return (
    <Card>
      <CardHeader title="Next steps" icon={<Clock className="h-4 w-4" />} />
      <div className="space-y-4 px-6 pt-5 pb-6">
        <Field label="Owner" htmlFor="owner">
          <Select id="owner" value={assignee?._id ?? ""} onChange={(e) => void save({ assigneeId: (e.target.value || null) as Id<"users"> | null })}>
            <option value="">Nobody yet</option>
            {(members ?? [])
              .filter((m) => m.role !== "viewer" && !m.disabled)
              .map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.name ?? m.email}
                </option>
              ))}
          </Select>
        </Field>
        <Field label="Follow up" htmlFor="follow">
          <div className="flex gap-2">
            <Input id="follow" type="datetime-local" value={followDate} onChange={(e) => void save({ followUpAt: e.target.value ? new Date(e.target.value).getTime() : null })} />
            {contact.followUpAt && (
              <Button size="sm" variant="ghost" className="!h-12" onClick={() => void save({ followUpAt: null })} aria-label="Clear follow-up">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Field>
        <Field label={`Deal value (${workspace.currency})`} htmlFor="value" hint={contact.value ? money(contact.value, workspace.currency) : undefined}>
          <Input
            id="value"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^\d.]/g, ""))}
            onBlur={() => {
              const n = value ? Number(value) : null;
              if (n !== (contact.value ?? null) && (n === null || Number.isFinite(n))) void save({ value: n });
            }}
            placeholder="0"
          />
        </Field>
        <Field label="Tags" htmlFor="tag">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {contact.tags.map((t) => (
              <button key={t} type="button" onClick={() => void save({ tags: contact.tags.filter((x) => x !== t) })} className="group inline-flex items-center gap-1 rounded-full bg-surface-3 px-2.5 py-0.5 text-xs font-semibold text-ink-2 ring-1 ring-line-strong ring-inset">
                {t} <X className="h-3 w-3 text-ink-3 group-hover:text-bad" />
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (tag.trim()) void save({ tags: [...contact.tags, tag.trim()] });
              setTag("");
            }}
          >
            <Input id="tag" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Add a tag and press Enter" />
          </form>
        </Field>
      </div>
    </Card>
  );
}

const ACTIVITY_TEXT: Record<string, (a: Doc<"activities">) => string> = {
  submission: () => "sent a form",
  note: () => "added a note",
  status: (a) => `moved from ${STATUS_LABEL[a.from as ContactStatus] ?? a.from} to ${STATUS_LABEL[a.to as ContactStatus] ?? a.to}`,
  assigned: (a) => `assigned to ${a.to}`,
  followUp: (a) => (a.to ? `set a follow-up for ${dateTime(Date.parse(a.to))}` : "cleared the follow-up"),
  created: (a) => (a.body ?? "added this lead").toLowerCase(),
  updated: (a) => (a.body ?? "updated details").replace(/^Updated/, "updated"),
};

function Timeline({ contactId, activities, canEdit }: { contactId: Id<"contacts">; activities: Doc<"activities">[]; canEdit: boolean }) {
  const addNote = useMutation(api.contacts.addNote);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addNote({ contactId, body: note });
      setNote("");
    } catch (err) {
      toast({ title: "Couldn't add the note", body: errorMessage(err), tone: "error" });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card>
      <CardHeader title="Notes and history" />
      <div className="px-6 pt-5 pb-6">
        {canEdit && (
          <form onSubmit={submit} className="mb-6">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What happened? (a call, a quote sent, what they need)" maxLength={5000} />
            <div className="mt-2 flex justify-end">
              <Button type="submit" size="sm" variant="primary" loading={busy} disabled={!note.trim()}>
                Add note
              </Button>
            </div>
          </form>
        )}
        <ol className="space-y-5 border-l border-line pl-5">
          {activities.map((a) => (
            <li key={a._id} className="relative">
              <span className={cx("absolute top-1.5 -left-[24.5px] h-2 w-2 rounded-full ring-4 ring-surface", a.type === "note" ? "bg-brand-orange" : a.type === "submission" ? "bg-brand-green" : "bg-ink-3")} />
              <p className="text-sm text-ink-2">
                <span className="font-semibold text-ink">{a.actorLabel}</span> {ACTIVITY_TEXT[a.type]?.(a) ?? a.type}
                <span className="text-ink-3"> · {relativeTime(a.at)}</span>
              </p>
              {a.body && (a.type === "note" || a.type === "submission") && (
                <p className={cx("mt-2 rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed break-words whitespace-pre-wrap text-ink", a.type === "note" ? "bg-surface-3" : "border border-line")}>{a.body}</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}

function EditDetails({ open, onClose, contact }: { open: boolean; onClose: () => void; contact: Doc<"contacts"> }) {
  const update = useMutation(api.contacts.update);
  const [form, setForm] = useState({ name: contact.name ?? "", email: contact.email ?? "", phone: contact.phone ?? "", company: contact.company ?? "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await update({ contactId: contact._id, name: form.name, email: form.email || null, phone: form.phone || null, company: form.company || null });
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title="Edit details">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name" htmlFor="e-name">
          <Input id="e-name" value={form.name} onChange={set("name")} />
        </Field>
        <Field label="Email" htmlFor="e-email">
          <Input id="e-email" type="email" value={form.email} onChange={set("email")} />
        </Field>
        <Field label="Phone" htmlFor="e-phone">
          <Input id="e-phone" type="tel" value={form.phone} onChange={set("phone")} />
        </Field>
        <Field label="Company" htmlFor="e-company">
          <Input id="e-company" value={form.company} onChange={set("company")} />
        </Field>
        {error && <p className="text-sm text-bad">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={busy}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Erase({ open, onClose, contactId, name }: { open: boolean; onClose: () => void; contactId: Id<"contacts">; name: string }) {
  const erase = useMutation(api.contacts.erase);
  const { workspace } = useWorkspace();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete this lead?"
      footer={
        <>
          <Button onClick={onClose}>Keep</Button>
          <Button
            variant="danger"
            loading={busy}
            disabled={confirm.trim().toLowerCase() !== "delete"}
            onClick={async () => {
              setBusy(true);
              try {
                await erase({ contactId });
                toast({ title: `${name} deleted`, tone: "success" });
                navigate(`/${workspace.slug}/leads`, { replace: true });
              } catch (err) {
                toast({ title: "Couldn't delete", body: errorMessage(err), tone: "error" });
                setBusy(false);
              }
            }}
          >
            Delete for good
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-ink-2">
        This removes {name}, every form they sent and all notes. Use it when someone asks you to delete their data. It can't be undone.
      </p>
      <div className="mt-4">
        <Field label='Type "delete" to confirm' htmlFor="confirm-erase">
          <Input id="confirm-erase" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
        </Field>
      </div>
    </Modal>
  );
}

