import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { Bell, Building2, ChevronsUpDown, LayoutDashboard, LogOut, Moon, Settings, Sun, Users } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { relativeTime } from "../lib/format";
import { useTheme } from "../lib/theme";
import type { Me } from "../lib/workspace";
import { Logo } from "./Logo";
import { cx, IconButton, useToast } from "./ui";

/** Close a popover on outside click or Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => ref.current && !ref.current.contains(e.target as Node) && close();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

export function NotificationBell() {
  const list = useQuery(api.notifications.list, {});
  const unread = useQuery(api.notifications.unreadCount, {}) ?? 0;
  const markRead = useMutation(api.notifications.markRead);
  const markAll = useMutation(api.notifications.markAllRead);
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const navigate = useNavigate();
  const toast = useToast();

  // A toast when a lead arrives while the dashboard is open.
  const seen = useRef<string | null>(null);
  useEffect(() => {
    if (!list) return;
    const newest = list[0];
    if (seen.current && newest && newest._id !== seen.current && !newest.readAt) {
      toast({ title: newest.title, body: newest.body, tone: "info", action: { label: "Open", onClick: () => navigate(newest.url) } });
    }
    seen.current = newest?._id ?? "";
  }, [list, toast, navigate]);

  useEffect(() => {
    document.title = unread ? `(${unread > 99 ? "99+" : unread}) SyncSite` : "SyncSite · LayerSync";
  }, [unread]);

  return (
    <div className="relative" ref={ref}>
      <IconButton label={unread ? `Notifications, ${unread} unread` : "Notifications"} onClick={() => setOpen(!open)} className="relative border border-line bg-surface">
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </IconButton>
      {open && (
        <div className="fade-up absolute right-0 z-40 mt-2 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-[22px] border border-line bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <span className="eyebrow">Notifications</span>
            {unread > 0 && (
              <button type="button" onClick={() => void markAll({})} className="text-xs font-semibold text-ink-3 hover:text-ink">
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-[420px] overflow-y-auto">
            {list === undefined ? null : list.length === 0 ? (
              <li className="px-5 py-10 text-center text-sm text-ink-3">Nothing yet. New leads will show up here.</li>
            ) : (
              list.map((n) => (
                <li key={n._id}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      if (!n.readAt) void markRead({ notificationId: n._id });
                      navigate(n.url);
                    }}
                    className="flex w-full gap-3 border-b border-line px-5 py-3.5 text-left last:border-0 hover:bg-surface-2"
                  >
                    <span className={cx("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.readAt ? "bg-transparent" : "bg-brand-orange")} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">{n.title}</span>
                      <span className="block truncate text-xs text-ink-3">{n.body}</span>
                      <span className="mt-1 block text-[11px] text-ink-3">{relativeTime(n.createdAt)}</span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function WorkspaceSwitcher({ me, current }: { me: Me; current?: { name: string; slug: string } }) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const many = me.workspaces.length > 1 || me.isStaff;
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={!many}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-2xl border border-line bg-surface-2 px-3.5 py-2.5 text-left transition-colors enabled:hover:border-line-strong"
      >
        <span className="min-w-0">
          <span className="eyebrow block">Workspace</span>
          <span className="mt-1 block truncate text-sm font-medium text-ink">{current?.name ?? "All clients"}</span>
        </span>
        {many && <ChevronsUpDown className="h-4 w-4 shrink-0 text-ink-3" />}
      </button>
      {open && (
        <div className="fade-up absolute inset-x-0 z-40 mt-2 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          <ul className="max-h-72 overflow-y-auto py-1">
            {me.workspaces.map((w) => (
              <li key={w._id}>
                <Link to={`/${w.slug}`} onClick={() => setOpen(false)} className={cx("block px-4 py-2.5 text-sm hover:bg-surface-2", w.slug === current?.slug ? "font-semibold text-ink" : "text-ink-2")}>
                  {w.name}
                </Link>
              </li>
            ))}
          </ul>
          {me.isStaff && (
            <Link to="/staff" onClick={() => setOpen(false)} className="flex items-center gap-2 border-t border-line px-4 py-3 text-sm text-ink-2 hover:bg-surface-2">
              <Building2 className="h-4 w-4" /> All clients (LayerSync)
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function NavItem({ to, icon, label, badge, end }: { to: string; icon: ReactNode; label: string; badge?: number; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cx(
          "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors",
          isActive ? "bg-surface-3 text-ink" : "text-ink-3 hover:bg-surface-2 hover:text-ink",
        )
      }
    >
      {icon}
      <span className="flex-1">{label}</span>
      {!!badge && <span className="rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-bold text-white tnum">{badge > 99 ? "99+" : badge}</span>}
    </NavLink>
  );
}

export function AppShell({ me, workspace, newLeads, children }: { me: Me; workspace?: { name: string; slug: string }; newLeads?: number; children: ReactNode }) {
  const { signOut } = useAuthActions();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const base = workspace ? `/${workspace.slug}` : "";

  const nav = workspace ? (
    <>
      <NavItem to={base} end icon={<LayoutDashboard className="h-4 w-4" />} label="Overview" />
      <NavItem to={`${base}/leads`} icon={<Users className="h-4 w-4" />} label="Leads" badge={newLeads} />
      <NavItem to={`${base}/settings`} icon={<Settings className="h-4 w-4" />} label="Settings" />
    </>
  ) : (
    <NavItem to="/staff" icon={<Building2 className="h-4 w-4" />} label="All clients" />
  );

  return (
    <div className="ambient relative min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-line bg-bg/80 px-4 py-6 backdrop-blur-xl lg:flex">
        <Link to={base || "/"} className="mb-8 px-2">
          <Logo />
        </Link>
        <WorkspaceSwitcher me={me} current={workspace} />
        <nav className="mt-6 flex flex-col gap-1" aria-label="Main">
          {nav}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-line px-3.5 py-3">
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink">{me.name ?? me.email}</span>
              <span className="block truncate text-xs text-ink-3">{me.isStaff ? "LayerSync staff" : me.email}</span>
            </span>
            <IconButton label={dark ? "Light theme" : "Dark theme"} onClick={toggle}>
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </IconButton>
          </div>
          <button
            type="button"
            onClick={() => void signOut().then(() => navigate("/login"))}
            className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm text-ink-3 hover:bg-surface-2 hover:text-ink"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-bg/85 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link to={base || "/"}>
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          <IconButton label={dark ? "Light theme" : "Dark theme"} onClick={toggle}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </IconButton>
          <NotificationBell />
          <IconButton label="Sign out" onClick={() => void signOut().then(() => navigate("/login"))}>
            <LogOut className="h-4 w-4" />
          </IconButton>
        </div>
      </header>

      <div className="relative z-10 lg:pl-[264px]">
        <div className="hidden items-center justify-end gap-3 px-10 pt-6 lg:flex">
          <NotificationBell />
        </div>
        <main className="mx-auto max-w-[1280px] px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-2 lg:pb-16">{children}</main>
      </div>

      {/* Mobile tab bar */}
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md justify-around">
          {workspace ? (
            <>
              <MobileTab to={base} end icon={<LayoutDashboard className="h-5 w-5" />} label="Overview" />
              <MobileTab to={`${base}/leads`} icon={<Users className="h-5 w-5" />} label="Leads" badge={newLeads} />
              <MobileTab to={`${base}/settings`} icon={<Settings className="h-5 w-5" />} label="Settings" />
              {me.isStaff && <MobileTab to="/staff" icon={<Building2 className="h-5 w-5" />} label="Clients" />}
            </>
          ) : (
            <MobileTab to="/staff" icon={<Building2 className="h-5 w-5" />} label="Clients" />
          )}
        </div>
      </nav>
    </div>
  );
}

function MobileTab({ to, icon, label, badge, end }: { to: string; icon: ReactNode; label: string; badge?: number; end?: boolean }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => cx("relative flex flex-col items-center gap-1 rounded-2xl px-4 py-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase", isActive ? "text-ink" : "text-ink-3")}>
      {icon}
      {label}
      {!!badge && <span className="absolute top-0 right-2 h-2 w-2 rounded-full bg-brand-orange" />}
    </NavLink>
  );
}
