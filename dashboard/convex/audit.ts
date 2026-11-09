/** The workspace audit log (Settings → Security). Admins only. */
import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireWorkspace } from "./access";

export const list = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    await requireWorkspace(ctx, workspaceId, "admin");
    return await ctx.db
      .query("auditLog")
      .withIndex("by_workspace_and_at", (q) => q.eq("workspaceId", workspaceId))
      .order("desc")
      .take(200);
  },
});
