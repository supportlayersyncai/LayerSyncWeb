import { useMutation, useQuery } from "convex/react";
import { BellRing, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button, Card, CardHeader, errorMessage, Field, Input, Switch, useToast } from "../../components/ui";
import { currentSubscription, pushSupported, subscribePush } from "../../lib/push";
import { useWorkspace } from "../../lib/workspace";

export function Notifications() {
  const { workspace, sites, me } = useWorkspace();
  const prefs = useQuery(api.members.myPrefs, { workspaceId: workspace._id });
  const update = useMutation(api.members.updateMyPrefs);
  const toast = useToast();
  const set = async (patch: { notifyEmail?: boolean; notifyPush?: boolean; weeklyDigest?: boolean }) => {
    try {
      await update({ workspaceId: workspace._id, ...patch });
    } catch (err) {
      toast({ title: "Couldn't save", body: errorMessage(err), tone: "error" });
    }
  };
  return (
    <>
      <Card>
        <CardHeader title="When a new lead comes in" eyebrow={`On ${workspace.name}`} />
        <div className="divide-y divide-line px-6 pt-2 pb-4">
          {prefs === null ? (
            <p className="py-4 text-sm text-ink-3">You're here as LayerSync staff, so you don't get this workspace's notifications.</p>
          ) : (
            <>
              <Switch label="Email me" description={`To ${me.email}, with the lead's details and where they came from.`} checked={prefs?.notifyEmail ?? false} onChange={(v) => void set({ notifyEmail: v })} disabled={!prefs} />
              <Switch label="Push to my devices" description="A notification on every browser and phone you've turned it on for below." checked={prefs?.notifyPush ?? false} onChange={(v) => void set({ notifyPush: v })} disabled={!prefs} />
              <Switch label="Weekly summary" description="Monday morning: last week's visitors, top sources and new leads." checked={prefs?.weeklyDigest ?? false} onChange={(v) => void set({ weeklyDigest: v })} disabled={!prefs} />
            </>
          )}
        </div>
      </Card>
      <ThisDevice />
      <Card>
        <CardHeader title="Leave your own visits out" icon={<EyeOff className="h-4 w-4" />} />
        <div className="px-6 pt-3 pb-6 text-sm leading-relaxed text-ink-2">
          <p>Open this link once on each browser you use to look at your own site. That browser is then never counted. Open it with =0 at the end to undo.</p>
          <ul className="mt-3 space-y-1.5">
            {sites.map((s) => (
              <li key={s._id}>
                <a className="font-medium text-ink underline underline-offset-4" href={`https://${s.domains[0].replace(/^\*\./, "")}/?syncsite_ignore=1`} target="_blank" rel="noopener noreferrer">
                  {s.domains[0]}/?syncsite_ignore=1
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      <Profile />
    </>
  );
}

function ThisDevice() {
  const vapid = useQuery(api.push.config, {});
  const subscribe = useMutation(api.push.subscribe);
  const unsubscribe = useMutation(api.push.unsubscribe);
  const [endpoint, setEndpoint] = useState<string | null | undefined>(undefined);
  const registered = useQuery(api.push.isSubscribed, endpoint ? { endpoint } : "skip");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  useEffect(() => {
    void currentSubscription().then((s) => setEndpoint(s?.endpoint ?? null));
  }, []);
  const on = !!endpoint && registered === true;
  return (
    <Card>
      <CardHeader title="This device" icon={<BellRing className="h-4 w-4" />} />
      <div className="px-6 pt-3 pb-6">
        {!pushSupported() ? (
          <p className="text-sm text-ink-3">This browser can't receive push notifications. On iPhone, add SyncSite to your Home Screen first (Share, Add to Home Screen), then open it from there.</p>
        ) : vapid === null ? (
          <p className="text-sm text-ink-3">Push isn't set up on the server yet. Email notifications still work.</p>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-ink-2">{on ? "This browser gets a notification for every new lead." : "Get a notification on this browser the moment a lead comes in."}</p>
            <Button
              variant={on ? "secondary" : "accent"}
              loading={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  if (on && endpoint) {
                    const sub = await currentSubscription();
                    await sub?.unsubscribe();
                    await unsubscribe({ endpoint });
                    setEndpoint(null);
                  } else if (vapid) {
                    const sub = await subscribePush(vapid);
                    await subscribe({ ...sub, userAgent: navigator.userAgent });
                    setEndpoint(sub.endpoint);
                    toast({ title: "Notifications on", body: "You'll hear about new leads on this device.", tone: "success" });
                  }
                } catch (err) {
                  toast({ title: "Couldn't turn notifications on", body: err instanceof Error ? err.message : errorMessage(err), tone: "error" });
                } finally {
                  setBusy(false);
                }
              }}
            >
              {on ? "Turn off here" : "Turn on here"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

function Profile() {
  const { me } = useWorkspace();
  const update = useMutation(api.members.updateMyName);
  const [name, setName] = useState(me.name ?? "");
  const toast = useToast();
  return (
    <Card>
      <CardHeader title="Your profile" />
      <form
        className="flex flex-col gap-3 px-6 pt-4 pb-6 sm:flex-row sm:items-end"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await update({ name });
            toast({ title: "Saved", tone: "success" });
          } catch (err) {
            toast({ title: "Couldn't save", body: errorMessage(err), tone: "error" });
          }
        }}
      >
        <div className="flex-1">
          <Field label="Your name" htmlFor="my-name">
            <Input id="my-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        </div>
        <Button type="submit" variant="primary" className="!h-12" disabled={name.trim() === (me.name ?? "")}>
          Save
        </Button>
      </form>
    </Card>
  );
}
