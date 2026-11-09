/**
 * Workspace roles. Pure so the rules can be unit-tested.
 *
 *  viewer  - sees analytics and leads
 *  member  - also works leads: status, notes, follow-ups, assignment
 *  admin   - also manages sites, the team (below owner), API keys, webhooks
 *  owner   - also manages owners and admins
 *
 * LayerSync staff (users.isStaff) act as owner on every workspace, and every
 * change they make is written to the workspace's audit log.
 */
export const ROLES = ["viewer", "member", "admin", "owner"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  viewer: "Viewer",
  member: "Member",
  admin: "Admin",
  owner: "Owner",
};

export function roleRank(role: Role): number {
  return ROLES.indexOf(role);
}

export function hasRole(role: Role, atLeast: Role): boolean {
  return roleRank(role) >= roleRank(atLeast);
}

/**
 * Whether someone with `actor` role may give `target` role to someone (or
 * change/remove someone who currently holds `target`). Admins manage up to
 * member; only owners create or touch owners and admins.
 */
export function canManageRole(actor: Role, target: Role): boolean {
  if (actor === "owner") return true;
  if (actor === "admin") return roleRank(target) <= roleRank("member");
  return false;
}
