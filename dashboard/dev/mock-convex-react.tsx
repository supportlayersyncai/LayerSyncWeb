/**
 * Demo build only: stands in for "convex/react" so the real UI can run on
 * sample data with no backend (see vite.config.ts, mode "demo").
 */
import { getFunctionName } from "convex/server";
import { useMemo, type ReactNode } from "react";
import * as F from "./fixtures";

export class ConvexReactClient {
  constructor(_url: string) {}
}

const signedIn = () => !/^\/(login|reset|invite)/.test(location.pathname);

function answer(name: string, args: Record<string, unknown>): unknown {
  switch (name) {
    case "workspaces:me":
      return F.ME;
    case "workspaces:bySlug":
      return { ...F.WORKSPACE, workspace: { ...F.WORKSPACE.workspace, slug: args.slug, name: args.slug === "layersync" ? "LayerSync" : "Moyo Realty" } };
    case "workspaces:listAll":
      return F.ALL_WORKSPACES;
    case "analytics:overview":
      return F.overview(args.from as string, args.to as string);
    case "analytics:live":
      return F.live();
    case "contacts:statusCounts":
      return { new: 3, contacted: 2, qualified: 1, won: 1, lost: 1, spam: 2, all: 8 };
    case "contacts:recent":
      return F.CONTACT_ROWS.slice(0, 5).map((c) => ({ submissionId: `s_${c._id}`, contactId: c._id, name: c.name, email: c.email, phone: c.phone, status: c.status, form: "contact", source: c.source, createdAt: c.lastSubmissionAt }));
    case "contacts:dueFollowUps":
      return [{ _id: "c_1", name: "Rudo Chikwanha", followUpAt: Date.now() - 3_600_000, status: "contacted" }];
    case "contacts:get":
      return F.contactDetail(args.contactId as string);
    case "contacts:exportPage":
      return { rows: [], cursor: null };
    case "staff:list":
      return {
        staff: [
          { _id: "user_kev", name: "Kevin Moyo", email: "kev@layersyncai.com", disabled: false },
          { _id: "user_tadiwa", name: "Tadiwa Chari", email: "tadiwa@layersyncai.com", disabled: false },
        ],
        invites: [{ _id: "si1", email: "ruva@layersyncai.com", expiresAt: Date.now() + 5 * 86_400_000, createdAt: Date.now() }],
      };
    case "members:list":
      return F.MEMBERS;
    case "members:myPrefs":
      return { notifyEmail: true, notifyPush: true, weeklyDigest: true };
    case "invites:listPending":
      return [{ _id: "i1", email: "owner@harvestfoods.co.zw", role: "owner", createdAt: Date.now(), expiresAt: Date.now() + 6 * 86_400_000 }];
    case "invites:peek":
      return { valid: true, expiresAt: Date.now() + 86_400_000, email: "owner@moyorealty.co.zw", role: "owner", staff: false, workspaceName: "Moyo Realty", accountExists: false };
    case "notifications:list":
      return F.NOTIFICATIONS;
    case "notifications:unreadCount":
      return 1;
    case "push:config":
      return "BPdemoVapidKey";
    case "push:isSubscribed":
      return false;
    case "apiKeys:list":
      return F.API_KEYS;
    case "webhooks:list":
      return F.WEBHOOKS;
    case "audit:list":
      return F.AUDIT;
    default:
      console.warn("demo: no fixture for", name);
      return null;
  }
}

export function useQuery(ref: unknown, args?: Record<string, unknown> | "skip") {
  const name = getFunctionName(ref as never);
  const key = JSON.stringify(args);
  return useMemo(() => (args === "skip" ? undefined : answer(name, args ?? {})), [name, key]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function usePaginatedQuery(_ref: unknown, args: Record<string, unknown> | "skip") {
  const filter = args === "skip" ? "all" : (args.filter as string);
  const search = args === "skip" ? "" : ((args.search as string) ?? "").toLowerCase();
  const results = F.CONTACT_ROWS.filter((c) => (filter === "all" || c.status === filter) && (!search || `${c.name} ${c.email} ${c.company}`.toLowerCase().includes(search)));
  return { results, status: "Exhausted", isLoading: false, loadMore: () => undefined };
}

export function useConvex() {
  return { query: async (ref: unknown, args: Record<string, unknown>) => answer(getFunctionName(ref as never), args) };
}

export function useMutation() {
  return async () => ({ key: "ssk_demoDemoDemoDemoDemoDemoDemo", link: null, slug: "layersync", secret: "whsec_demo" });
}

export function useConvexAuth() {
  return { isLoading: false, isAuthenticated: signedIn() };
}

export function Authenticated({ children }: { children: ReactNode }) {
  return signedIn() ? <>{children}</> : null;
}
export function Unauthenticated({ children }: { children: ReactNode }) {
  return signedIn() ? null : <>{children}</>;
}
export function AuthLoading() {
  return null;
}
