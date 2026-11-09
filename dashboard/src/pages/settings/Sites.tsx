import { useMutation } from "convex/react";
import { Globe2, Plus, RefreshCw } from "lucide-react";
import { useState, type FormEvent } from "react";
import { api } from "../../../convex/_generated/api";
import { Button, Card, CardHeader, CodeBlock, errorMessage, Field, Input, Modal, Select, Switch, Textarea, useToast } from "../../components/ui";
import { can, useWorkspace, type WorkspaceData } from "../../lib/workspace";

const ZONES = [
  "Africa/Harare", "Africa/Johannesburg", "Africa/Lusaka", "Africa/Gaborone", "Africa/Maputo", "Africa/Nairobi", "Africa/Lagos",
  "Europe/London", "Europe/Paris", "America/New_York", "America/Los_Angeles", "Asia/Dubai", "Australia/Sydney", "UTC",
];

type Site = WorkspaceData["sites"][number];

export function Sites() {
  const { sites, role } = useWorkspace();
  const [adding, setAdding] = useState(false);
  return (
    <>
      {sites.map((s) => (
        <SiteCard key={s._id} site={s} editable={can(role, "admin")} />
      ))}
      {can(role, "admin") && (
        <Button variant="primary" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setAdding(true)}>
          Add a site
        </Button>
      )}
      <AddSite open={adding} onClose={() => setAdding(false)} />
    </>
  );
}

function SiteCard({ site, editable }: { site: Site; editable: boolean }) {
  const update = useMutation(api.sites.update);
  const rotate = useMutation(api.sites.rotateKey);
  const toast = useToast();
  const [domains, setDomains] = useState(site.domains.join("\n"));
  const [exclude, setExclude] = useState(site.excludePaths.join("\n"));
  const [name, setName] = useState(site.name);
  const [confirmRotate, setConfirmRotate] = useState(false);
  const origin = location.origin;
  const snippet = `<script defer src="${origin}/s.js" data-site="${site.publicKey}"></script>`;
  const formExample = `<!-- Any form: add data-syncsite-form with a name for it -->
<form data-syncsite-form="contact">
  <input name="name" required>
  <input name="email" type="email">
  <input name="phone" type="tel">
  <textarea name="message"></textarea>
  <button>Send</button>
</form>

<script>
  // Or from your own code (React, Vue, ...):
  const result = await window.syncsite.lead({
    form: "contact",
    fields: { name, email, phone, message },
  });
  if (!result.ok) showError(result.error);
</script>`;

  const save = async (patch: Partial<{ name: string; domains: string[]; timezone: string; trackingEnabled: boolean; allowLocalhost: boolean; excludePaths: string[] }>) => {
    try {
      await update({ siteId: site._id, ...patch });
      toast({ title: "Saved", tone: "success" });
    } catch (err) {
      toast({ title: "Couldn't save", body: errorMessage(err), tone: "error" });
    }
  };
  const lines = (s: string) => s.split(/[\n,]+/).map((x) => x.trim()).filter(Boolean);

  return (
    <Card>
      <CardHeader title={site.name} icon={<Globe2 className="h-4 w-4" />} eyebrow={site.trackingEnabled ? "Tracking on" : "Tracking paused"} />
      <div className="space-y-6 px-6 pt-5 pb-6">
        <CodeBlock label="1 · Paste in the <head> of every page" code={snippet} />
        <CodeBlock label="2 · Connect your forms" code={formExample} />
        <p className="text-sm leading-relaxed text-ink-3">
          Clicks on phone numbers, email addresses, WhatsApp links, downloads and links to other sites are counted automatically. To count anything else, add{" "}
          <code className="rounded bg-surface-3 px-1.5 py-0.5 text-ink-2">data-syncsite-event="name"</code> to it. No cookies are used, so no cookie banner is needed for SyncSite.
        </p>

        {editable && (
          <div className="grid gap-5 border-t border-line pt-6 md:grid-cols-2">
            <Field label="Site name" htmlFor={`name-${site._id}`}>
              <Input id={`name-${site._id}`} value={name} onChange={(e) => setName(e.target.value)} onBlur={() => name.trim() !== site.name && void save({ name })} />
            </Field>
            <Field label="Time zone" htmlFor={`tz-${site._id}`} hint="Days start at midnight here.">
              <Select id={`tz-${site._id}`} value={site.timezone} onChange={(e) => void save({ timezone: e.target.value })}>
                {[...new Set([site.timezone, ...ZONES])].map((z) => (
                  <option key={z} value={z}>
                    {z.replace(/_/g, " ")}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Domains" htmlFor={`dom-${site._id}`} hint='One per line. "example.com" covers www too; "*.example.com" covers every subdomain. Other sites using this key are ignored.'>
              <Textarea id={`dom-${site._id}`} value={domains} onChange={(e) => setDomains(e.target.value)} onBlur={() => lines(domains).join() !== site.domains.join() && void save({ domains: lines(domains) })} />
            </Field>
            <Field label="Never track" htmlFor={`ex-${site._id}`} hint='Path prefixes, one per line, e.g. /admin or /preview*'>
              <Textarea id={`ex-${site._id}`} value={exclude} onChange={(e) => setExclude(e.target.value)} onBlur={() => lines(exclude).join() !== site.excludePaths.join() && void save({ excludePaths: lines(exclude) })} />
            </Field>
            <div className="divide-y divide-line md:col-span-2">
              <Switch label="Tracking" description="Pause to stop counting visits. Forms keep working." checked={site.trackingEnabled} onChange={(v) => void save({ trackingEnabled: v })} />
              <Switch label="Accept visits from localhost" description="Only while you're building the site. Add data-dev to the script tag too." checked={site.allowLocalhost} onChange={(v) => void save({ allowLocalhost: v })} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3 md:col-span-2">
              <p className="text-sm text-ink-3">
                Site key <code className="text-ink-2">{site.publicKey}</code>. It's public (it's in your page source); domains stop others from using it.
              </p>
              <Button size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={() => setConfirmRotate(true)}>
                New key
              </Button>
            </div>
          </div>
        )}
      </div>
      <Modal
        open={confirmRotate}
        onClose={() => setConfirmRotate(false)}
        title="Replace the site key?"
        footer={
          <>
            <Button onClick={() => setConfirmRotate(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={async () => {
                try {
                  await rotate({ siteId: site._id });
                  toast({ title: "New key made", body: "Update the snippet on your site now.", tone: "success" });
                } catch (err) {
                  toast({ title: "Couldn't replace the key", body: errorMessage(err), tone: "error" });
                }
                setConfirmRotate(false);
              }}
            >
              Replace key
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-ink-2">The snippet on your site stops working straight away, until you paste in the new one. Only do this if someone else is using your key.</p>
      </Modal>
    </Card>
  );
}

function AddSite({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { workspace } = useWorkspace();
  const create = useMutation(api.sites.create);
  const [form, setForm] = useState({ name: "", domain: "", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Harare" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await create({ workspaceId: workspace._id, ...form });
      setForm({ ...form, name: "", domain: "" });
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title="Add a site">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name" htmlFor="site-name">
          <Input id="site-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Main website" />
        </Field>
        <Field label="Domain" htmlFor="site-domain">
          <Input id="site-domain" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="example.co.zw" />
        </Field>
        <Field label="Time zone" htmlFor="site-tz">
          <Select id="site-tz" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })}>
            {[...new Set([form.timezone, ...ZONES])].map((z) => (
              <option key={z} value={z}>
                {z.replace(/_/g, " ")}
              </option>
            ))}
          </Select>
        </Field>
        {error && <p className="text-sm text-bad">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={busy} disabled={!form.name || !form.domain}>
            Add site
          </Button>
        </div>
      </form>
    </Modal>
  );
}
