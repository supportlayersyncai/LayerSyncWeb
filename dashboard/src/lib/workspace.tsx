import { createContext, useContext } from "react";
import type { FunctionReturnType } from "convex/server";
import type { api } from "../../convex/_generated/api";

export type WorkspaceData = NonNullable<FunctionReturnType<typeof api.workspaces.bySlug>>;
export type Me = NonNullable<FunctionReturnType<typeof api.workspaces.me>>;

export const WorkspaceContext = createContext<(WorkspaceData & { me: Me }) | null>(null);

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace outside a workspace");
  return ctx;
}

const RANK = { viewer: 0, member: 1, admin: 2, owner: 3 } as const;
export const can = (role: keyof typeof RANK, atLeast: keyof typeof RANK) => RANK[role] >= RANK[atLeast];
