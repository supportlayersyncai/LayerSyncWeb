import { useMutation, useQuery } from "convex/react";
import { Bot, KeyRound, Plus, Send, Webhook } from "lucide-react";
import { useState, type FormEvent } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Badge, Button, Card, CardHeader, CodeBlock, CopyButton, cx, errorMessage, Field, Input, Modal, Select, Switch, useToast } from "../../components/ui";
import { dateShort, relativeTime } from "../../lib/format";
import { useWorkspace } from "../../lib/workspace";

const convexSite =
  (import.meta.env.VITE_CONVEX_SITE_URL as string | undefined) ?? (import.meta.env.VITE_CONVEX_URL as string).replace(/\.convex\.cloud\/?$/, ".convex.site");
export const MCP_URL = `${convexSite.replace(/\/+$/, "")}/mcp`;

export function Integrations() {
  return (
    <>
      <McpKeys />
      <Webhooks />
    </>
  );
}

function McpKeys() {
  const { workspace } = useWorkspace();
  const keys = useQuery(api.apiKeys.list, { workspaceId: workspace._id });
  const revoke = useMutation(api.apiKeys.revoke);
  const [creating, setCreating] = useState(false);
  const toast = useToast();
  return (
    <Card>
      <CardHeader title="AI assistants (MCP)" icon={<Bot className="h-4 w-4" />} eyebrow="Connect Claude and other assistants" action={<Button size="sm" variant="primary" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setCreating(true)}>New key</Button>} />
      <div className="space-y-5 px-6 pt-4 pb-6">
        <p className="max-w-2xl text-sm leading-relaxed text-ink-2">
          SyncSite is an MCP server. Connect an assistant with a key and ask it things like "who got in touch this week and from where?", "add a note to Rudo's lead", or
          "sync new leads into my CRM". A key only ever sees {workspace.name}. Read-only keys can't change anything.
        </p>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
          <span className="eyebrow">Server URL</span>
          <code className="min-w-0 flex-1 truncate text-sm text-ink-2">{MCP_URL}</code>
          <CopyButton text={MCP_URL} />
        </div>
        {keys && keys.length > 0 && (
          <ul className="divide-y divide-line rounded-2xl border border-line">
            {keys.map((k) => (
              <li key={k._id} className={cx("flex flex-wrap items-center justify-between gap-3 px-4 py-3", !!k.revokedAt && "opacity-50")}>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2 font-medium text-ink">
                    {k.name}
                    <Badge tone={k.scopes.includes("write") ? "orange" : "neutral"}>{k.scopes.includes("write") ? "Read and write" : "Read only"}</Badge>
                    {k.revokedAt && <Badge>Revoked</Badge>}
                  </span>
                  <span className="block text-xs text-ink-3">
                    <code>{k.prefix}…</code> · made by {k.createdBy} {relativeTime(k.createdAt)} · {k.lastUsedAt ? `last used ${relativeTime(k.lastUsedAt)}` : "never used"}
                    {k.expiresAt ? ` · expires ${dateShort(k.expiresAt)}` : ""}
                  </span>
                </span>
                {!k.revokedAt && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={async () => {
                      try {
                        await revoke({ keyId: k._id });
                        toast({ title: "Key revoked", body: "Anything using it stops working now.", tone: "success" });
                      } catch (err) {
                        toast({ title: "Couldn't revoke", body: errorMessage(err), tone: "error" });
                      }
                    }}
                  >
                    Revoke
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <NewKey open={creating} onClose={() => setCreating(false)} />
    </Card>
  );
}

function NewKey({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { workspace } = useWorkspace();
  const create = useMutation(api.apiKeys.create);
  const [name, setName] = useState("");
  const [write, setWrite] = useState(false);
  const [expiry, setExpiry] = useState("365");
  const [key, setKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const close = () => {
    setKey(null);
    setName("");
    setWrite(false);
    onClose();
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await create({ workspaceId: workspace._id, name, scopes: write ? ["read", "write"] : ["read"], expiresInDays: expiry ? Number(expiry) : undefined });
      setKey(res.key);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={open} onClose={close} title={key ? "Your new key" : "New MCP key"} wide>
      {key ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-ink-2">Copy it now. We only keep a fingerprint, so it can't be shown again.</div>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <KeyRound className="h-4 w-4 shrink-0 text-ink-3" />
            <code className="min-w-0 flex-1 truncate text-sm text-ink">{key}</code>
            <CopyButton text={key} />
          </div>
          <CodeBlock label="Claude Code" code={`claude mcp add --transport http syncsite ${MCP_URL} \\\n  --header "Authorization: Bearer ${key}"`} />
          <CodeBlock
            label="Claude Desktop (claude_desktop_config.json)"
            code={JSON.stringify(
              {
                mcpServers: {
                  syncsite: {
                    command: "npx",
                    args: ["-y", "mcp-remote", MCP_URL, "--header", "Authorization:${SYNCSITE_AUTH}"],
                    env: { SYNCSITE_AUTH: `Bearer ${key}` },
                  },
                },
              },
              null,
              2,
            )}
          />
          <CodeBlock label="Cursor, VS Code and other clients" code={JSON.stringify({ syncsite: { url: MCP_URL, headers: { Authorization: `Bearer ${key}` } } }, null, 2)} />
          <div className="flex justify-end">
            <Button variant="primary" onClick={close}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Name" htmlFor="key-name" hint="So you know what it's for later.">
            <Input id="key-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Claude on Kev's laptop" />
          </Field>
          <Switch label="Allow changes" description="Let the assistant update lead status, add notes and add leads. Leave off for reporting only." checked={write} onChange={setWrite} />
          <Field label="Expires" htmlFor="key-exp">
            <Select id="key-exp" value={expiry} onChange={(e) => setExpiry(e.target.value)}>
              <option value="30">In 30 days</option>
              <option value="90">In 90 days</option>
              <option value="365">In a year</option>
              <option value="">Never</option>
            </Select>
          </Field>
          {error && <p className="text-sm text-bad">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" variant="primary" loading={busy} disabled={name.trim().length < 2}>
              Create key
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

const EVENTS = [
  { key: "lead.created", label: "A lead sends a form" },
  { key: "contact.updated", label: "A lead's status or details change" },
  { key: "note.created", label: "A note is added" },
] as const;
type EventKey = (typeof EVENTS)[number]["key"];

function Webhooks() {
  const { workspace } = useWorkspace();
  const hooks = useQuery(api.webhooks.list, { workspaceId: workspace._id });
  const update = useMutation(api.webhooks.update);
  const remove = useMutation(api.webhooks.remove);
  const test = useMutation(api.webhooks.sendTest);
  const [creating, setCreating] = useState(false);
  const toast = useToast();
  const run = async (fn: () => Promise<unknown>, ok?: string) => {
    try {
      await fn();
      if (ok) toast({ title: ok, tone: "success" });
    } catch (err) {
      toast({ title: "That didn't work", body: errorMessage(err), tone: "error" });
    }
  };
  return (
    <Card>
      <CardHeader title="Webhooks" icon={<Webhook className="h-4 w-4" />} eyebrow="Send leads to your other tools" action={<Button size="sm" variant="primary" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setCreating(true)}>Add webhook</Button>} />
      <div className="space-y-4 px-6 pt-4 pb-6">
        <p className="max-w-2xl text-sm leading-relaxed text-ink-2">
          We POST signed JSON to your URL (your CRM, Zapier, Make, n8n) as things happen. Check the <code className="text-ink">SyncSite-Signature</code> header with your signing secret. Failed deliveries are retried for about 9 hours.
        </p>
        {(hooks ?? []).map((h) => (
          <div key={h._id} className="rounded-2xl border border-line p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{h.url}</p>
                <p className="mt-1 text-xs text-ink-3">
                  {h.events.join(", ")} · secret {h.secretHint}
                  {h.disabledReason && <span className="text-bad"> · {h.disabledReason}</span>}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" icon={<Send className="h-3.5 w-3.5" />} onClick={() => void run(() => test({ webhookId: h._id }), "Test sent")}>
                  Test
                </Button>
                <Button size="sm" onClick={() => void run(() => update({ webhookId: h._id, active: !h.active }))}>
                  {h.active ? "Pause" : "Resume"}
                </Button>
                <Button size="sm" variant="danger" onClick={() => void run(() => remove({ webhookId: h._id }), "Webhook deleted")}>
                  Delete
                </Button>
              </div>
            </div>
            {h.recent.length > 0 && (
              <ul className="mt-3 space-y-1 border-t border-line pt-3 text-xs">
                {h.recent.slice(0, 5).map((d) => (
                  <li key={d._id} className="flex flex-wrap items-center gap-2 text-ink-3">
                    <span className={cx("h-1.5 w-1.5 rounded-full", d.status === "succeeded" ? "bg-brand-green" : d.status === "failed" ? "bg-bad" : "bg-warn")} />
                    <span className="text-ink-2">{d.event}</span>
                    <span>{d.status === "succeeded" ? `delivered (${d.responseStatus})` : d.status === "failed" ? `failed: ${d.error ?? d.responseStatus}` : `retrying (${d.attempts} tries)`}</span>
                    <span>· {relativeTime(d.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <NewWebhook open={creating} onClose={() => setCreating(false)} />
    </Card>
  );
}

function NewWebhook({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { workspace } = useWorkspace();
  const create = useMutation(api.webhooks.create);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<EventKey[]>(["lead.created"]);
  const [secret, setSecret] = useState<{ id: Id<"webhooks">; secret: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const close = () => {
    setSecret(null);
    setUrl("");
    onClose();
  };
  return (
    <Modal open={open} onClose={close} title={secret ? "Webhook added" : "Add a webhook"} wide={!!secret}>
      {secret ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-ink-2">Copy the signing secret now; it won't be shown again.</div>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <code className="min-w-0 flex-1 truncate text-sm text-ink">{secret.secret}</code>
            <CopyButton text={secret.secret} />
          </div>
          <CodeBlock
            label="Checking the signature (Node)"
            code={`import crypto from "node:crypto";

// header: SyncSite-Signature: t=<seconds>,v1=<hex>
const { t, v1 } = Object.fromEntries(header.split(",").map((p) => p.split("=")));
const expected = crypto.createHmac("sha256", SECRET).update(\`\${t}.\${rawBody}\`).digest("hex");
const ok = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))
  && Math.abs(Date.now() / 1000 - Number(t)) < 300;`}
          />
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
            setError(null);
            try {
              const res = await create({ workspaceId: workspace._id, url, events });
              setSecret({ id: res.webhookId, secret: res.secret });
            } catch (err) {
              setError(errorMessage(err));
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field label="URL" htmlFor="wh-url" hint="Must be https:// and reachable from the internet.">
            <Input id="wh-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://hooks.zapier.com/..." />
          </Field>
          <fieldset>
            <legend className="eyebrow mb-2">Send when</legend>
            <div className="space-y-2">
              {EVENTS.map((ev) => (
                <label key={ev.key} className="flex items-center gap-3 text-sm text-ink-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[#7fb069]"
                    checked={events.includes(ev.key)}
                    onChange={(e) => setEvents(e.target.checked ? [...events, ev.key] : events.filter((x) => x !== ev.key))}
                  />
                  {ev.label} <code className="text-xs text-ink-3">{ev.key}</code>
                </label>
              ))}
            </div>
          </fieldset>
          {error && <p className="text-sm text-bad">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" variant="primary" loading={busy} disabled={!url || events.length === 0}>
              Add webhook
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
