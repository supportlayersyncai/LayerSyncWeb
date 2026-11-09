import { useMutation, useQuery } from "convex/react";
import { Send, UserMinus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Badge, Button, Card, CardHeader, CopyButton, errorMessage, Field, Input, Modal, Select, useToast } from "../../components/ui";
import { dateShort } from "../../lib/format";
import { can, useWorkspace } from "../../lib/workspace";

type Role = "viewer" | "member" | "admin" | "owner";
const ROLE_HELP: Record<Role, string> = {
  viewer: "Sees visitors and leads",
  member: "Also works leads: status, notes, follow-ups",
  admin: "Also manages sites, the team, integrations",
  owner: "Everything, including owners and admins",
};

export function Team() {
  const { workspace, role, me } = useWorkspace();
  const members = useQuery(api.members.list, { workspaceId: workspace._id });
  const pending = useQuery(api.invites.listPending, can(role, "admin") ? { workspaceId: workspace._id } : "skip");
  const updateRole = useMutation(api.members.updateRole);
  const remove = useMutation(api.members.remove);
  const revoke = useMutation(api.invites.revoke);
  const toast = useToast();
  const navigate = useNavigate();
  const [removing, setRemoving] = useState<{ id: Id<"memberships">; name: string; self: boolean } | null>(null);
  const manageable = (target: Role) => role === "owner" || (role === "admin" && (target === "member" || target === "viewer"));

  return (
    <>
      {can(role, "admin") && <InviteForm />}
      <Card>
        <CardHeader title="People" eyebrow={members ? `${members.length} on ${workspace.name}` : undefined} />
        <ul className="divide-y divide-line px-6 pt-3 pb-3">
          {(members ?? []).map((m) => {
            const self = m.userId === me._id;
            return (
              <li key={m._id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <span className="min-w-0">
                  <span className="block font-medium text-ink">
                    {m.name ?? m.email} {self && <span className="text-ink-3">(you)</span>}
                  </span>
                  <span className="block text-sm text-ink-3">{m.email}</span>
                </span>
                <span className="flex items-center gap-2">
                  {manageable(m.role) && !self ? (
                    <Select
                      aria-label={`Role for ${m.name ?? m.email}`}
                      value={m.role}
                      className="!h-9 !w-36 rounded-full text-sm"
                      onChange={async (e) => {
                        try {
                          await updateRole({ membershipId: m._id, role: e.target.value as Role });
                        } catch (err) {
                          toast({ title: "Couldn't change the role", body: errorMessage(err), tone: "error" });
                        }
                      }}
                    >
                      {(["viewer", "member", "admin", "owner"] as Role[]).filter((r) => manageable(r)).map((r) => (
                        <option key={r} value={r}>
                          {r[0].toUpperCase() + r.slice(1)}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Badge>{m.role[0].toUpperCase() + m.role.slice(1)}</Badge>
                  )}
                  {(self || (manageable(m.role) && can(role, "admin"))) && (
                    <Button size="sm" variant="ghost" aria-label={self ? "Leave workspace" : `Remove ${m.name ?? m.email}`} onClick={() => setRemoving({ id: m._id, name: m.name ?? m.email ?? "", self })}>
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
      {pending && pending.length > 0 && (
        <Card>
          <CardHeader title="Invitations waiting" />
          <ul className="divide-y divide-line px-6 pt-3 pb-3">
            {pending.map((p) => (
              <li key={p._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span>
                  <span className="block text-ink">{p.email}</span>
                  <span className="block text-sm text-ink-3">
                    {p.role} · {p.expiresAt < Date.now() ? "expired" : `expires ${dateShort(p.expiresAt)}`}
                  </span>
                </span>
                <Button size="sm" variant="ghost" onClick={() => void revoke({ inviteId: p._id })}>
                  Cancel
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Modal
        open={!!removing}
        onClose={() => setRemoving(null)}
        title={removing?.self ? "Leave this workspace?" : `Remove ${removing?.name}?`}
        footer={
          <>
            <Button onClick={() => setRemoving(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!removing) return;
                try {
                  await remove({ membershipId: removing.id });
                  if (removing.self) navigate("/", { replace: true });
                } catch (err) {
                  toast({ title: "Couldn't remove", body: errorMessage(err), tone: "error" });
                }
                setRemoving(null);
              }}
            >
              {removing?.self ? "Leave" : "Remove"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-2">{removing?.self ? "You'll lose access straight away." : "They lose access straight away. Their notes stay on the leads."}</p>
      </Modal>
    </>
  );
}

function InviteForm() {
  const { workspace, role } = useWorkspace();
  const invite = useMutation(api.invites.create);
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("member");
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const roles: Role[] = role === "owner" ? ["viewer", "member", "admin", "owner"] : ["viewer", "member"];
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await invite({ workspaceId: workspace._id, email, role: newRole });
      toast({ title: "Invitation sent", body: `${email} will get an email with a link.`, tone: "success" });
      setLink(res.link);
      setEmail("");
    } catch (err) {
      toast({ title: "Couldn't invite", body: errorMessage(err), tone: "error" });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card>
      <CardHeader title="Invite someone" />
      <form onSubmit={submit} className="grid gap-4 px-6 pt-4 pb-6 md:grid-cols-[1fr_200px_auto] md:items-end">
        <Field label="Email" htmlFor="inv-email">
          <Input id="inv-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@business.com" />
        </Field>
        <Field label="Role" htmlFor="inv-role" hint={ROLE_HELP[newRole]}>
          <Select id="inv-role" value={newRole} onChange={(e) => setNewRole(e.target.value as Role)}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r[0].toUpperCase() + r.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
        <Button type="submit" variant="primary" className="!h-12 md:mb-6" loading={busy} disabled={!email} icon={<Send className="h-3.5 w-3.5" />}>
          Send invite
        </Button>
      </form>
      {link && (
        <div className="mx-6 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
          <p className="text-sm text-ink-3">As staff you can also send the link yourself (on WhatsApp, say). It works once, for that email only.</p>
          <CopyButton text={link} label="Copy link" />
        </div>
      )}
    </Card>
  );
}
