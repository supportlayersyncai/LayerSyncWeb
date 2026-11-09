import { useMutation, useQuery } from "convex/react";
import { Building2, Plus, ShieldCheck, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Badge, Button, Card, CardHeader, CopyButton, EmptyState, errorMessage, Field, Input, Modal, PageHeader, Spinner, useToast } from "../components/ui";
import { relativeTime } from "../lib/format";

/** LayerSync staff: every client workspace, and setting up new ones. */
export function Staff() {
  const all = useQuery(api.workspaces.listAll, {});
  const [creating, setCreating] = useState(false);
  const [invitingStaff, setInvitingStaff] = useState(false);
  return (
    <>
      <PageHeader
        eyebrow="LayerSync"
        title="All clients"
        description="Every website we look after. Set up a new client when their site goes live: they get an email to set their password."
        actions={
          <>
            <Button icon={<UserPlus className="h-3.5 w-3.5" />} onClick={() => setInvitingStaff(true)}>
              Invite staff
            </Button>
            <Button variant="primary" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setCreating(true)}>
              New client
            </Button>
          </>
        }
      />
      <Card>
        {all === undefined ? (
          <div className="grid place-items-center py-16">
            <Spinner />
          </div>
        ) : all.length === 0 ? (
          <EmptyState icon={<Building2 className="h-5 w-5" />} title="No clients yet" action={<Button variant="primary" onClick={() => setCreating(true)}>Set up the first one</Button>}>
            Start with LayerSync's own website.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {all.map((w) => (
              <li key={w._id}>
                <Link to={`/${w.slug}`} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-surface-2">
                  <span className="min-w-0">
                    <span className="block font-medium text-ink">{w.name}</span>
                    <span className="block truncate text-sm text-ink-3">{w.sites.map((s) => s.domains[0]).join(", ") || "No site yet"}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm text-ink-3">
                    {w.openLeads > 0 && <Badge tone="orange">{w.openLeads} open leads</Badge>}
                    <Badge>{w.members} {w.members === 1 ? "person" : "people"}</Badge>
                    <span className="hidden sm:inline">added {relativeTime(w.createdAt)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <StaffCard />
      <NewClient open={creating} onClose={() => setCreating(false)} />
      <InviteStaff open={invitingStaff} onClose={() => setInvitingStaff(false)} />
    </>
  );
}

function NewClient({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useMutation(api.workspaces.create);
  const [form, setForm] = useState({ name: "", slug: "", siteName: "", domain: "", ownerEmail: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ slug: string; link: string | null } | null>(null);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    const v = e.target.value;
    setForm((f) => ({
      ...f,
      [k]: v,
      // Suggest an address from the name until someone edits it.
      ...(k === "name" && (!f.slug || f.slug === slugify(f.name)) ? { slug: slugify(v) } : {}),
      ...(k === "name" && (!f.siteName || f.siteName === f.name) ? { siteName: v } : {}),
    }));
  };
  const close = () => {
    setDone(null);
    setForm({ name: "", slug: "", siteName: "", domain: "", ownerEmail: "" });
    onClose();
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await create({
        name: form.name,
        slug: form.slug,
        site: form.domain ? { name: form.siteName || form.name, domain: form.domain, timezone: "Africa/Harare" } : undefined,
        ownerEmail: form.ownerEmail || undefined,
      });
      setDone({ slug: res.slug, link: res.ownerInviteLink });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={open} onClose={close} title={done ? "Client set up" : "New client"}>
      {done ? (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-2">
            {done.link ? "The owner has an email with their invitation. You can also send them the link yourself:" : "Invite people from the workspace's Team settings."}
          </p>
          {done.link && (
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
              <code className="min-w-0 flex-1 truncate text-xs text-ink-2">{done.link}</code>
              <CopyButton text={done.link} />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button onClick={close}>Close</Button>
            <Link to={`/${done.slug}/settings/sites`} onClick={close}>
              <Button variant="primary">Get the snippet</Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Business name" htmlFor="c-name">
            <Input id="c-name" value={form.name} onChange={set("name")} placeholder="Moyo Realty" />
          </Field>
          <Field label="Dashboard address" htmlFor="c-slug" hint={`${location.origin}/${form.slug || "moyo-realty"}`}>
            <Input id="c-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
          </Field>
          <Field label="Website domain" htmlFor="c-domain" hint="You can add more domains and sites later.">
            <Input id="c-domain" value={form.domain} onChange={set("domain")} placeholder="moyorealty.co.zw" />
          </Field>
          <Field label="Owner's email" htmlFor="c-owner" hint="Optional. They'll get an invitation to set their password.">
            <Input id="c-owner" type="email" value={form.ownerEmail} onChange={set("ownerEmail")} />
          </Field>
          {error && <p className="text-sm text-bad">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" variant="primary" loading={busy} disabled={!form.name || !form.slug}>
              Create
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function InviteStaff({ open, onClose }: { open: boolean; onClose: () => void }) {
  const invite = useMutation(api.invites.inviteStaff);
  const [email, setEmail] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const close = () => {
    setLink(null);
    setEmail("");
    onClose();
  };
  return (
    <Modal open={open} onClose={close} title="Invite LayerSync staff">
      {link ? (
        <div className="space-y-4">
          <p className="text-sm text-ink-2">They have an email. Or send the link yourself:</p>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <code className="min-w-0 flex-1 truncate text-xs text-ink-2">{link}</code>
            <CopyButton text={link} />
          </div>
          <div className="flex justify-end">
            <Button variant="primary" onClick={close}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              const res = await invite({ email });
              setLink(res.link);
            } catch (err) {
              toast({ title: "Couldn't invite", body: errorMessage(err), tone: "error" });
            } finally {
              setBusy(false);
            }
          }}
        >
          <p className="text-sm leading-relaxed text-ink-2">Staff can open every client's workspace and set up new clients. Everything they do inside a client's workspace shows in that client's audit log.</p>
          <Field label="Email" htmlFor="staff-email">
            <Input id="staff-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@layersyncai.com" />
          </Field>
          <div className="flex justify-end gap-2">
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" variant="primary" loading={busy} disabled={!email}>
              Send invite
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

/** Who has LayerSync staff access, pending staff invitations, and switching accounts off. */
function StaffCard() {
  const data = useQuery(api.staff.list, {});
  const me = useQuery(api.workspaces.me, {});
  const setDisabled = useMutation(api.staff.setDisabled);
  const removeStaff = useMutation(api.staff.removeStaff);
  const revoke = useMutation(api.invites.revoke);
  const toast = useToast();
  const run = async (fn: () => Promise<unknown>, ok: string) => {
    try {
      await fn();
      toast({ title: ok, tone: "success" });
    } catch (err) {
      toast({ title: "That didn't work", body: errorMessage(err), tone: "error" });
    }
  };
  if (!data) return null;
  return (
    <Card className="mt-5">
      <CardHeader title="LayerSync staff" icon={<ShieldCheck className="h-4 w-4" />} eyebrow="Access to every client" />
      <ul className="divide-y divide-line px-6 pt-3 pb-3">
        {data.staff.map((u) => (
          <li key={u._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <span className="min-w-0">
              <span className="block font-medium text-ink">
                {u.name ?? u.email} {u._id === me?._id && <span className="text-ink-3">(you)</span>}
              </span>
              <span className="block text-sm text-ink-3">{u.email}</span>
            </span>
            {u._id !== me?._id && (
              <span className="flex items-center gap-2">
                {u.disabled && <Badge tone="warn">Switched off</Badge>}
                <Button size="sm" onClick={() => void run(() => setDisabled({ userId: u._id, disabled: !u.disabled }), u.disabled ? "Account switched on" : "Account switched off")}>
                  {u.disabled ? "Switch on" : "Switch off"}
                </Button>
                <Button size="sm" variant="danger" onClick={() => void run(() => removeStaff({ userId: u._id }), "Staff access removed")}>
                  Remove staff access
                </Button>
              </span>
            )}
          </li>
        ))}
        {data.invites.map((i) => (
          <li key={i._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <span>
              <span className="block text-ink">{i.email}</span>
              <span className="block text-sm text-ink-3">Invited, {i.expiresAt < Date.now() ? "expired" : `link works until ${new Date(i.expiresAt).toLocaleDateString("en-GB")}`}</span>
            </span>
            <Button size="sm" variant="ghost" onClick={() => void run(() => revoke({ inviteId: i._id }), "Invitation cancelled")}>
              Cancel invitation
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
