import { useMutation } from "convex/react";
import { useState, type FormEvent } from "react";
import { api } from "../../../convex/_generated/api";
import { Button, Card, CardHeader, errorMessage, Field, Input, useToast } from "../../components/ui";
import { useWorkspace } from "../../lib/workspace";

export function General() {
  const { workspace } = useWorkspace();
  const update = useMutation(api.workspaces.update);
  const toast = useToast();
  const [form, setForm] = useState({ name: workspace.name, defaultCountryCode: workspace.defaultCountryCode, currency: workspace.currency });
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await update({ workspaceId: workspace._id, ...form });
      toast({ title: "Saved", tone: "success" });
    } catch (err) {
      toast({ title: "Couldn't save", body: errorMessage(err), tone: "error" });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card>
      <CardHeader title="Workspace" />
      <form onSubmit={submit} className="grid gap-5 px-6 pt-5 pb-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Business name" htmlFor="ws-name">
            <Input id="ws-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
        </div>
        <Field label="Country calling code" htmlFor="ws-cc" hint="Local phone numbers in forms get this, e.g. 263 for Zimbabwe.">
          <Input id="ws-cc" inputMode="numeric" value={form.defaultCountryCode} onChange={(e) => setForm({ ...form, defaultCountryCode: e.target.value.replace(/\D/g, "") })} />
        </Field>
        <Field label="Currency" htmlFor="ws-cur" hint="For deal values on leads.">
          <Input id="ws-cur" maxLength={3} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} />
        </Field>
        <div className="flex items-center justify-between gap-3 md:col-span-2">
          <p className="text-sm text-ink-3">
            Address: <code className="text-ink-2">/{workspace.slug}</code>
          </p>
          <Button type="submit" variant="primary" loading={busy}>
            Save
          </Button>
        </div>
      </form>
    </Card>
  );
}
