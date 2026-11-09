import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { api } from "../convex/_generated/api";
import { AppShell } from "./components/AppShell";
import { EmptyState, PageLoading } from "./components/ui";
import { WorkspaceContext } from "./lib/workspace";
import { Invite } from "./pages/Invite";
import { Login } from "./pages/Login";

const Overview = lazy(() => import("./pages/Overview").then((m) => ({ default: m.Overview })));
const Leads = lazy(() => import("./pages/Leads").then((m) => ({ default: m.Leads })));
const LeadDetail = lazy(() => import("./pages/LeadDetail").then((m) => ({ default: m.LeadDetail })));
const Settings = lazy(() => import("./pages/Settings").then((m) => ({ default: m.Settings })));
const Staff = lazy(() => import("./pages/Staff").then((m) => ({ default: m.Staff })));

export function App() {
  return (
    <>
      <AuthLoading>
        <FullScreenLoading />
      </AuthLoading>
      <Unauthenticated>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<Login mode="reset" />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="*" element={<ToLogin />} />
        </Routes>
      </Unauthenticated>
      <Authenticated>
        <Routes>
          <Route path="/invite" element={<Invite />} />
          <Route path="/login" element={<Home />} />
          <Route path="/reset" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/staff" element={<StaffArea />} />
          <Route path="/:slug/*" element={<WorkspaceArea />} />
        </Routes>
      </Authenticated>
    </>
  );
}

function FullScreenLoading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <PageLoading />
    </div>
  );
}

function ToLogin() {
  const { pathname, search } = useLocation();
  const next = pathname !== "/" ? `?next=${encodeURIComponent(pathname + search)}` : "";
  return <Navigate to={`/login${next}`} replace />;
}

/** Signed in: go where they were heading, else their workspace, else staff home. */
function Home() {
  const me = useQuery(api.workspaces.me, {});
  const next = new URLSearchParams(useLocation().search).get("next");
  if (me === undefined) return <FullScreenLoading />;
  if (me === null) return <NoAccess />;
  // Only same-site paths, so a crafted ?next= can't send anyone elsewhere.
  if (next && /^\/[a-z0-9]/.test(next) && !next.startsWith("//")) return <Navigate to={next} replace />;
  if (me.workspaces.length === 1 && !me.isStaff) return <Navigate to={`/${me.workspaces[0].slug}`} replace />;
  if (me.isStaff) return <Navigate to="/staff" replace />;
  if (me.workspaces.length) return <Navigate to={`/${me.workspaces[0].slug}`} replace />;
  return <NoAccess />;
}

function NoAccess() {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <EmptyState title="You're signed in, but not on any workspace yet">
        Ask whoever invited you to send the invitation again, or contact LayerSync on WhatsApp at +263 77 518 7682.
      </EmptyState>
    </div>
  );
}

function StaffArea() {
  const me = useQuery(api.workspaces.me, {});
  if (me === undefined) return <FullScreenLoading />;
  if (!me?.isStaff) return <Navigate to="/" replace />;
  return (
    <AppShell me={me}>
      <Suspense fallback={<PageLoading />}>
        <Staff />
      </Suspense>
    </AppShell>
  );
}

function WorkspaceArea() {
  const { slug = "" } = useParams();
  const me = useQuery(api.workspaces.me, {});
  const data = useQuery(api.workspaces.bySlug, { slug });
  const counts = useQuery(api.contacts.statusCounts, data ? { workspaceId: data.workspace._id } : "skip");
  if (me === undefined || data === undefined) return <FullScreenLoading />;
  if (!me) return <NoAccess />;
  if (!data) {
    return (
      <AppShell me={me}>
        <EmptyState title="Workspace not found">It doesn't exist, or you don't have access to it.</EmptyState>
      </AppShell>
    );
  }
  return (
    <WorkspaceContext.Provider value={{ ...data, me }}>
      <AppShell me={me} workspace={data.workspace} newLeads={counts?.new}>
        {data.viaStaff && (
          <div className="mb-6 rounded-2xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-ink-2">
            You're viewing <strong className="text-ink">{data.workspace.name}</strong> as LayerSync staff. Changes you make are recorded in their audit log.
          </div>
        )}
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route index element={<Overview />} />
            <Route path="leads" element={<Leads />} />
            <Route path="leads/:contactId" element={<LeadDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/:tab" element={<Settings />} />
            <Route path="*" element={<Navigate to={`/${slug}`} replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </WorkspaceContext.Provider>
  );
}
