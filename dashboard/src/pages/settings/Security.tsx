import { useQuery } from "convex/react";
import { ShieldCheck } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { Card, CardHeader, cx, Spinner } from "../../components/ui";
import { dateTime } from "../../lib/format";
import { useWorkspace } from "../../lib/workspace";

export function Security() {
  const { workspace } = useWorkspace();
  const log = useQuery(api.audit.list, { workspaceId: workspace._id });
  return (
    <Card>
      <CardHeader title="Audit log" icon={<ShieldCheck className="h-4 w-4" />} eyebrow="Who changed what" />
      <div className="px-6 pt-4 pb-6">
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-ink-3">
          Team changes, site settings, API keys, webhooks, deletions and everything done through the MCP server. Anything LayerSync staff do here is marked "(LayerSync)".
        </p>
        {log === undefined ? (
          <Spinner />
        ) : log.length === 0 ? (
          <p className="text-sm text-ink-3">Nothing yet.</p>
        ) : (
          <ol className="divide-y divide-line">
            {log.map((e) => (
              <li key={e._id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="min-w-0 text-sm">
                  <span className={cx("font-medium", e.actorLabel.includes("(LayerSync)") ? "text-brand-orange" : "text-ink")}>{e.actorLabel}</span>{" "}
                  <span className="text-ink-2">{e.action.replace(/[._]/g, " ")}</span>
                  {e.detail && <span className="block truncate text-ink-3">{e.detail}</span>}
                </span>
                <span className="shrink-0 text-xs text-ink-3 tnum">{dateTime(e.at)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Card>
  );
}
