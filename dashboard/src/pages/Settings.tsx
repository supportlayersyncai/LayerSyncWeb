import { Bell, Building2, Globe2, Plug, ShieldCheck, Users } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useParams } from "react-router-dom";
import { cx, PageHeader } from "../components/ui";
import { can, useWorkspace } from "../lib/workspace";
import { General } from "./settings/General";
import { Integrations } from "./settings/Integrations";
import { Notifications } from "./settings/Notifications";
import { Security } from "./settings/Security";
import { Sites } from "./settings/Sites";
import { Team } from "./settings/Team";

type Tab = { key: string; label: string; icon: ReactNode; element: ReactNode; admin?: boolean };

export function Settings() {
  const { tab = "notifications" } = useParams();
  const { workspace, role } = useWorkspace();
  const tabs: Tab[] = [
    { key: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" />, element: <Notifications /> },
    { key: "sites", label: "Sites", icon: <Globe2 className="h-4 w-4" />, element: <Sites /> },
    { key: "team", label: "Team", icon: <Users className="h-4 w-4" />, element: <Team /> },
    { key: "integrations", label: "Integrations", icon: <Plug className="h-4 w-4" />, element: <Integrations />, admin: true },
    { key: "workspace", label: "Workspace", icon: <Building2 className="h-4 w-4" />, element: <General />, admin: true },
    { key: "security", label: "Audit log", icon: <ShieldCheck className="h-4 w-4" />, element: <Security />, admin: true },
  ].filter((t) => !t.admin || can(role, "admin"));
  const current = tabs.find((t) => t.key === tab) ?? tabs[0];
  return (
    <>
      <PageHeader eyebrow={workspace.name} title="Settings" />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Settings" className="flex gap-1 overflow-x-auto lg:flex-col">
          {tabs.map((t) => (
            <NavLink
              key={t.key}
              to={`/${workspace.slug}/settings/${t.key}`}
              className={() =>
                cx(
                  "flex shrink-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  current.key === t.key ? "bg-surface-3 text-ink" : "text-ink-3 hover:bg-surface-2 hover:text-ink",
                )
              }
            >
              {t.icon}
              {t.label}
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0 space-y-5">{current.element}</div>
      </div>
    </>
  );
}
