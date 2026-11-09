/**
 * Leads and the CRM.
 *
 * A website form send arrives through POST /ingest/lead (convex/http.ts) and
 * `ingestLead` below: it is cleaned (convex/lib/leads.ts), checked for spam,
 * matched to an existing contact by email or phone, tied to the visit it came
 * from (so you can see the person found you on Google and read the pricing
 * page first), and then the team is notified.
 *
 * The CRM operations are plain functions taking an `Actor`, so the dashboard
 * and the MCP server (convex/mcp.ts) share exactly the same rules.
 */
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v, type Infer } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { internalMutation, mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { actorLabel, audit, requireContact, requireWorkspace } from "./access";
import { activeSession, checkSite, ipKey, metaValidator, visitorHash } from "./ingest";
import { cleanLead, contactSearchText, displayName, normalizeEmail, normalizePhone, type CleanLead } from "./lib/leads";
import { cleanPath } from "./lib/paths";
import { rateLimiter } from "./rateLimits";
import { attributionValidator, contactStatusValidator } from "./schema";

export type ContactStatus = Infer<typeof contactStatusValidator>;
export type Attribution = Infer<typeof attributionValidator>;
export const STATUSES: ContactStatus[] = ["new", "contacted", "qualified", "won", "lost", "spam"];

/** Who is making a change: a person in the dashboard, the website, or an API key. */
export type Actor = { userId?: Id<"users">; label: string };

// ── Counters ─────────────────────────────────────────────────────────────

async function counts(ctx: MutationCtx, workspaceId: Id<"workspaces">) {
  const row = await ctx.db.query("contactCounts").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).unique();
  if (row) return row;
  const id = await ctx.db.insert("contactCounts", { workspaceId, new: 0, contacted: 0, qualified: 0, won: 0, lost: 0, spam: 0 });
  return (await ctx.db.get("contactCounts", id))!;
}

/** Move one contact between status counters (either side may be absent). */
async function moveCount(ctx: MutationCtx, workspaceId: Id<"workspaces">, from: ContactStatus | null, to: ContactStatus | null) {
  if (from === to) return;
  const row = await counts(ctx, workspaceId);
  const patch: Partial<Record<ContactStatus, number>> = {};
  if (from) patch[from] = Math.max(0, row[from] - 1);
  if (to) patch[to] = row[to] + 1;
  await ctx.db.patch("contactCounts", row._id, patch);
}

async function addActivity(
  ctx: MutationCtx,
  contact: Pick<Doc<"contacts">, "_id" | "workspaceId">,
  actor: Actor,
  entry: Omit<Doc<"activities">, "_id" | "_creationTime" | "workspaceId" | "contactId" | "actorId" | "actorLabel" | "at">,
  at = Date.now(),
) {
  await ctx.db.insert("activities", {
    workspaceId: contact.workspaceId,
    contactId: contact._id,
    actorId: actor.userId,
    actorLabel: actor.label,
    at,
    ...entry,
  });
}

/** The shape webhooks and the MCP server use for a contact. */
export function publicContact(c: Doc<"contacts">) {
  return {
    id: c._id,
    name: displayName(c),
    email: c.email ?? null,
    phone: c.phone ?? null,
    company: c.company ?? null,
    status: c.status,
    tags: c.tags,
    value: c.value ?? null,
    follow_up_at: c.followUpAt ? new Date(c.followUpAt).toISOString() : null,
    origin: c.origin,
    submissions: c.submissions,
    first_touch: c.firstTouch ?? null,
    created_at: new Date(c.createdAt).toISOString(),
    last_activity_at: new Date(c.lastActivityAt).toISOString(),
  };
}

// ── Website forms ────────────────────────────────────────────────────────

export const leadInputValidator = v.object({
  form: v.optional(v.string()),
  fields: v.array(v.object({ key: v.string(), value: v.string() })),
  page: v.optional(v.string()),
  hp: v.optional(v.string()),
  elapsedMs: v.optional(v.number()),
});

/** Find the contact this lead belongs to: same email, else same phone. */
async function findContact(ctx: QueryCtx | MutationCtx, workspaceId: Id<"workspaces">, email?: string, phoneDigits?: string) {
  if (email) {
    const byEmail = await ctx.db
      .query("contacts")
      .withIndex("by_workspace_and_email", (q) => q.eq("workspaceId", workspaceId).eq("email", email))
      .first();
    if (byEmail) return byEmail;
  }
  if (phoneDigits) {
    return await ctx.db
      .query("contacts")
      .withIndex("by_workspace_and_phone", (q) => q.eq("workspaceId", workspaceId).eq("phoneDigits", phoneDigits))
      .first();
  }
  return null;
}

/**
 * Store a form send. Returns { status, error? } for the HTTP route; spam is
 * accepted with a 200 like anything else, so bots learn nothing.
 */
export const ingestLead = internalMutation({
  args: { meta: metaValidator, lead: leadInputValidator },
  returns: v.object({ status: v.number(), ok: v.boolean(), error: v.optional(v.string()) }),
  handler: async (ctx, { meta, lead }) => {
    const check = await checkSite(ctx, meta.siteKey, meta.origin);
    if (!check.ok) return { status: check.status, ok: false, error: "This form isn't connected to SyncSite for this website." };
    const site = check.site;
    const workspace = await ctx.db.get("workspaces", site.workspaceId);
    if (!workspace) return { status: 404, ok: false, error: "Unknown site." };

    const now = Date.now();
    // Per IP first, so one sender can't use up the whole site's allowance.
    const perIp = await ipKey(ctx, site, meta.ip, now);
    if (perIp && !(await rateLimiter.limit(ctx, "leadIp", { key: perIp })).ok) {
      return { status: 429, ok: false, error: "You've sent this a few times already. We'll be in touch soon." };
    }
    const siteLimit = await rateLimiter.limit(ctx, "leadSite", { key: site._id });
    if (!siteLimit.ok) return { status: 429, ok: false, error: "We're getting a lot of messages right now. Please try again in a minute." };
    const hash = await visitorHash(ctx, site, meta.ip, meta.ua, now);
    const visitorLimit = await rateLimiter.limit(ctx, "leadVisitor", { key: `${site._id}:${hash}` });
    if (!visitorLimit.ok) return { status: 429, ok: false, error: "You've sent this a few times already. We'll be in touch soon." };

    const cleaned = cleanLead(
      { form: lead.form, fields: lead.fields, hp: lead.hp, elapsedMs: lead.elapsedMs },
      { defaultCountryCode: workspace.defaultCountryCode },
    );
    if (!cleaned.ok) return { status: 400, ok: false, error: cleaned.error };

    const session = await activeSession(ctx, site._id, hash, now);
    const attribution: Attribution | undefined = session
      ? {
          channel: session.channel,
          source: session.source,
          referrerHost: session.referrerHost,
          landingPath: session.entryPath,
          utmSource: session.utmSource,
          utmMedium: session.utmMedium,
          utmCampaign: session.utmCampaign,
          country: session.country,
          city: session.city,
          device: session.device,
          journey: session.pages.slice(0, 20).map((p) => p.path),
          timeToConvertMs: now - session.startedAt,
        }
      : meta.country
        ? { channel: "(unknown)", source: "(unknown)", country: meta.country.toUpperCase().slice(0, 2) }
        : undefined;

    const page = lead.page ? cleanPath(lead.page) : session?.exitPath;
    await recordSubmission(ctx, { workspace, site, cleaned: cleaned.value, attribution, sessionId: session?._id, page, now });

    if (session && !cleaned.value.spam) {
      const eventNames = [...session.eventNames];
      const found = eventNames.find((r) => r.k === "lead");
      if (found) found.n += 1;
      else if (eventNames.length < 20) eventNames.push({ k: "lead", n: 1 });
      await ctx.db.patch("sessions", session._id, { converted: true, events: session.events + 1, eventNames, lastSeenAt: now });
      await ctx.db.insert("events", {
        siteId: site._id,
        sessionId: session._id,
        kind: "event",
        name: "lead",
        path: page ?? session.exitPath,
        props: { form: cleaned.value.form },
        at: now,
      });
    }
    return { status: 200, ok: true };
  },
});

async function recordSubmission(
  ctx: MutationCtx,
  p: {
    workspace: Doc<"workspaces">;
    site: Doc<"sites">;
    cleaned: CleanLead;
    attribution?: Attribution;
    sessionId?: Id<"sessions">;
    page?: string;
    now: number;
  },
) {
  const { workspace, site, cleaned, attribution, now } = p;
  const website: Actor = { label: site.name };
  let contact = await findContact(ctx, workspace._id, cleaned.email, cleaned.phoneDigits);
  let returning = false;

  if (!contact) {
    const status: ContactStatus = cleaned.spam ? "spam" : "new";
    const id = await ctx.db.insert("contacts", {
      workspaceId: workspace._id,
      siteId: site._id,
      name: cleaned.name,
      email: cleaned.email,
      phone: cleaned.phone,
      phoneDigits: cleaned.phoneDigits,
      company: cleaned.company,
      status,
      tags: [],
      origin: "website",
      firstTouch: attribution,
      submissions: 1,
      lastSubmissionAt: now,
      lastActivityAt: now,
      createdAt: now,
      searchText: contactSearchText(cleaned),
    });
    await moveCount(ctx, workspace._id, null, status);
    contact = (await ctx.db.get("contacts", id))!;
  } else {
    returning = true;
    const patch: Partial<Doc<"contacts">> = {
      submissions: contact.submissions + 1,
      lastSubmissionAt: now,
      lastActivityAt: now,
      name: contact.name ?? cleaned.name,
      email: contact.email ?? cleaned.email,
      phone: contact.phone ?? cleaned.phone,
      phoneDigits: contact.phoneDigits ?? cleaned.phoneDigits,
      company: contact.company ?? cleaned.company,
      firstTouch: contact.firstTouch ?? attribution,
    };
    // Someone you'd written off came back, or a real person who was once caught as spam.
    if (!cleaned.spam && (contact.status === "lost" || contact.status === "spam")) {
      patch.status = "new";
      await moveCount(ctx, workspace._id, contact.status, "new");
      await addActivity(ctx, contact, website, { type: "status", from: contact.status, to: "new", body: "Sent a form again" }, now);
    }
    patch.searchText = contactSearchText({ ...contact, ...patch } as Doc<"contacts">);
    await ctx.db.patch("contacts", contact._id, patch);
    contact = { ...contact, ...patch };
  }

  const submissionId = await ctx.db.insert("submissions", {
    workspaceId: workspace._id,
    siteId: site._id,
    contactId: contact._id,
    sessionId: p.sessionId,
    form: cleaned.form,
    page: p.page,
    fields: cleaned.fields,
    attribution,
    spam: cleaned.spam,
    spamReason: cleaned.spamReason,
    createdAt: now,
  });
  await addActivity(ctx, contact, website, { type: "submission", submissionId, body: cleaned.message?.slice(0, 280) }, now);

  if (!cleaned.spam) {
    await ctx.scheduler.runAfter(0, internal.notifications.onNewLead, { submissionId, returning });
    await ctx.scheduler.runAfter(0, internal.webhooks.dispatch, {
      workspaceId: workspace._id,
      event: "lead.created",
      payload: JSON.stringify({
        contact: publicContact(contact),
        submission: {
          id: submissionId,
          form: cleaned.form,
          site: { id: site._id, name: site.name },
          page: p.page ?? null,
          fields: cleaned.fields,
          attribution: attribution ?? null,
          returning,
          created_at: new Date(now).toISOString(),
        },
      }),
    });
  }
  return { contactId: contact._id, submissionId, returning };
}

// ── Shared CRM operations (dashboard + MCP) ──────────────────────────────

export type ContactPatch = {
  status?: ContactStatus;
  assigneeId?: Id<"users"> | null;
  followUpAt?: number | null;
  value?: number | null;
  tags?: string[];
  name?: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
};

export async function applyContactPatch(ctx: MutationCtx, contact: Doc<"contacts">, patchIn: ContactPatch, actor: Actor) {
  const now = Date.now();
  const workspace = await ctx.db.get("workspaces", contact.workspaceId);
  const patch: Partial<Doc<"contacts">> = { lastActivityAt: now };
  const changed: string[] = [];

  if (patchIn.status !== undefined && patchIn.status !== contact.status) {
    patch.status = patchIn.status;
    await moveCount(ctx, contact.workspaceId, contact.status, patchIn.status);
    await addActivity(ctx, contact, actor, { type: "status", from: contact.status, to: patchIn.status }, now);
    changed.push("status");
  }
  if (patchIn.assigneeId !== undefined && (patchIn.assigneeId ?? undefined) !== contact.assigneeId) {
    let label = "nobody";
    if (patchIn.assigneeId) {
      const m = await ctx.db
        .query("memberships")
        .withIndex("by_workspace_and_user", (q) => q.eq("workspaceId", contact.workspaceId).eq("userId", patchIn.assigneeId!))
        .unique();
      if (!m || m.role === "viewer") throw new ConvexError("Assign leads to a member of this workspace.");
      const u = await ctx.db.get("users", patchIn.assigneeId);
      label = u?.name || u?.email || "a team member";
    }
    patch.assigneeId = patchIn.assigneeId ?? undefined;
    await addActivity(ctx, contact, actor, { type: "assigned", to: label }, now);
    changed.push("assignee");
  }
  if (patchIn.followUpAt !== undefined && (patchIn.followUpAt ?? undefined) !== contact.followUpAt) {
    patch.followUpAt = patchIn.followUpAt ?? undefined;
    await addActivity(ctx, contact, actor, {
      type: "followUp",
      to: patchIn.followUpAt ? new Date(patchIn.followUpAt).toISOString() : undefined,
      body: patchIn.followUpAt ? undefined : "Follow-up cleared",
    }, now);
    changed.push("follow_up_at");
  }
  if (patchIn.value !== undefined) {
    if (patchIn.value !== null && (!Number.isFinite(patchIn.value) || patchIn.value < 0 || patchIn.value > 1e12)) {
      throw new ConvexError("Enter a deal value of zero or more.");
    }
    patch.value = patchIn.value ?? undefined;
    changed.push("value");
  }
  if (patchIn.tags !== undefined) {
    const tags = [...new Set(patchIn.tags.map((t) => t.replace(/\s+/g, " ").trim().toLowerCase().slice(0, 30)).filter(Boolean))];
    if (tags.length > 12) throw new ConvexError("Up to 12 tags.");
    patch.tags = tags;
    changed.push("tags");
  }
  const details: Array<[keyof ContactPatch, string]> = [];
  if (patchIn.name !== undefined) {
    const name = patchIn.name.replace(/\s+/g, " ").trim().slice(0, 120);
    if (name) {
      patch.name = name;
      details.push(["name", name]);
    }
  }
  if (patchIn.email !== undefined) {
    const email = patchIn.email === null || patchIn.email === "" ? undefined : normalizeEmail(patchIn.email);
    if (patchIn.email && !email) throw new ConvexError("That email address doesn't look right.");
    patch.email = email;
    details.push(["email", email ?? "removed"]);
  }
  if (patchIn.phone !== undefined) {
    const phone = patchIn.phone === null || patchIn.phone === "" ? undefined : normalizePhone(patchIn.phone, workspace?.defaultCountryCode);
    if (patchIn.phone && !phone) throw new ConvexError("That phone number doesn't look right.");
    patch.phone = phone;
    patch.phoneDigits = phone?.slice(1);
    details.push(["phone", phone ?? "removed"]);
  }
  if (patchIn.company !== undefined) {
    patch.company = patchIn.company?.replace(/\s+/g, " ").trim().slice(0, 120) || undefined;
    details.push(["company", patch.company ?? "removed"]);
  }
  if (details.length) {
    await addActivity(ctx, contact, actor, { type: "updated", body: `Updated ${details.map(([k]) => k).join(", ")}` }, now);
    changed.push(...details.map(([k]) => k));
  }
  const merged = { ...contact, ...patch };
  if (!merged.email && !merged.phone && contact.origin !== "manual") {
    throw new ConvexError("Keep an email or a phone number so you can reach them.");
  }
  patch.searchText = contactSearchText(merged);
  await ctx.db.patch("contacts", contact._id, patch);
  if (changed.length) {
    await ctx.scheduler.runAfter(0, internal.webhooks.dispatch, {
      workspaceId: contact.workspaceId,
      event: "contact.updated",
      payload: JSON.stringify({ contact: publicContact(merged), changed }),
    });
  }
  return merged;
}

export async function addNoteTo(ctx: MutationCtx, contact: Doc<"contacts">, body: string, actor: Actor) {
  const text = body.replace(/\r\n/g, "\n").trim().slice(0, 5000);
  if (!text) throw new ConvexError("Write something first.");
  const now = Date.now();
  await addActivity(ctx, contact, actor, { type: "note", body: text }, now);
  await ctx.db.patch("contacts", contact._id, { lastActivityAt: now });
  await ctx.scheduler.runAfter(0, internal.webhooks.dispatch, {
    workspaceId: contact.workspaceId,
    event: "note.created",
    payload: JSON.stringify({ contact: publicContact(contact), note: { body: text, author: actor.label, created_at: new Date(now).toISOString() } }),
  });
}

export async function createManualContact(
  ctx: MutationCtx,
  workspaceId: Id<"workspaces">,
  input: { name: string; email?: string; phone?: string; company?: string; note?: string; status?: ContactStatus },
  actor: Actor,
  origin: "manual" | "api",
) {
  const workspace = await ctx.db.get("workspaces", workspaceId);
  if (!workspace) throw new ConvexError("Workspace not found.");
  const name = input.name.replace(/\s+/g, " ").trim().slice(0, 120);
  if (name.length < 2) throw new ConvexError("Enter their name.");
  const email = input.email ? normalizeEmail(input.email) : undefined;
  if (input.email && !email) throw new ConvexError("That email address doesn't look right.");
  const phone = input.phone ? normalizePhone(input.phone, workspace.defaultCountryCode) : undefined;
  if (input.phone && !phone) throw new ConvexError("That phone number doesn't look right.");
  const existing = await findContact(ctx, workspaceId, email, phone?.slice(1));
  if (existing) throw new ConvexError(`${displayName(existing)} is already in your leads with that ${existing.email === email ? "email" : "phone number"}.`);
  const now = Date.now();
  const status = input.status && input.status !== "spam" ? input.status : "new";
  const company = input.company?.replace(/\s+/g, " ").trim().slice(0, 120) || undefined;
  const id = await ctx.db.insert("contacts", {
    workspaceId,
    name,
    email,
    phone,
    phoneDigits: phone?.slice(1),
    company,
    status,
    tags: [],
    origin,
    submissions: 0,
    lastActivityAt: now,
    createdAt: now,
    searchText: contactSearchText({ name, email, phone, company }),
  });
  await moveCount(ctx, workspaceId, null, status);
  const contact = (await ctx.db.get("contacts", id))!;
  await addActivity(ctx, contact, actor, { type: "created", body: origin === "api" ? "Added through the API" : "Added by hand" }, now);
  if (input.note?.trim()) await addNoteTo(ctx, contact, input.note, actor);
  return contact;
}

/** Erase a person: the contact, every form they sent and their timeline. */
export async function eraseContact(ctx: MutationCtx, contact: Doc<"contacts">) {
  const subs = await ctx.db.query("submissions").withIndex("by_contact_and_createdAt", (q) => q.eq("contactId", contact._id)).take(1000);
  for (const s of subs) await ctx.db.delete("submissions", s._id);
  const acts = await ctx.db.query("activities").withIndex("by_contact_and_at", (q) => q.eq("contactId", contact._id)).take(2000);
  for (const a of acts) await ctx.db.delete("activities", a._id);
  const notes = await ctx.db.query("notifications").withIndex("by_contact", (q) => q.eq("contactId", contact._id)).take(1000);
  for (const n of notes) await ctx.db.delete("notifications", n._id);
  await moveCount(ctx, contact.workspaceId, contact.status, null);
  await ctx.db.delete("contacts", contact._id);
}

// ── Dashboard API ────────────────────────────────────────────────────────

const listFilter = v.union(contactStatusValidator, v.literal("all"));

export const list = query({
  args: {
    workspaceId: v.id("workspaces"),
    filter: listFilter,
    search: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { workspaceId, filter, search, paginationOpts }) => {
    await requireWorkspace(ctx, workspaceId);
    const term = search?.trim().toLowerCase().slice(0, 100);
    let page;
    if (term) {
      page = await ctx.db
        .query("contacts")
        .withSearchIndex("search_text", (q) => {
          const base = q.search("searchText", term).eq("workspaceId", workspaceId);
          return filter === "all" ? base : base.eq("status", filter);
        })
        .paginate(paginationOpts);
    } else if (filter === "all") {
      page = await ctx.db
        .query("contacts")
        .withIndex("by_workspace_and_lastActivity", (q) => q.eq("workspaceId", workspaceId))
        .order("desc")
        .filter((q) => q.neq(q.field("status"), "spam"))
        .paginate(paginationOpts);
    } else {
      page = await ctx.db
        .query("contacts")
        .withIndex("by_workspace_and_status_and_lastActivity", (q) => q.eq("workspaceId", workspaceId).eq("status", filter))
        .order("desc")
        .paginate(paginationOpts);
    }
    const assignees = new Map<string, string>();
    const rows = [];
    for (const c of page.page) {
      let assignee: string | null = null;
      if (c.assigneeId) {
        if (!assignees.has(c.assigneeId)) {
          const u = await ctx.db.get("users", c.assigneeId);
          assignees.set(c.assigneeId, u?.name || u?.email || "");
        }
        assignee = assignees.get(c.assigneeId) || null;
      }
      rows.push({
        _id: c._id,
        name: displayName(c),
        email: c.email ?? null,
        phone: c.phone ?? null,
        company: c.company ?? null,
        status: c.status,
        tags: c.tags,
        value: c.value ?? null,
        followUpAt: c.followUpAt ?? null,
        source: c.firstTouch?.source ?? (c.origin === "website" ? null : c.origin === "api" ? "API" : "Added by hand"),
        channel: c.firstTouch?.channel ?? null,
        country: c.firstTouch?.country ?? null,
        submissions: c.submissions,
        lastSubmissionAt: c.lastSubmissionAt ?? null,
        lastActivityAt: c.lastActivityAt,
        createdAt: c.createdAt,
        assignee,
      });
    }
    return { ...page, page: rows };
  },
});

export const statusCounts = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    await requireWorkspace(ctx, workspaceId);
    const row = await ctx.db.query("contactCounts").withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId)).unique();
    const c = { new: row?.new ?? 0, contacted: row?.contacted ?? 0, qualified: row?.qualified ?? 0, won: row?.won ?? 0, lost: row?.lost ?? 0, spam: row?.spam ?? 0 };
    return { ...c, all: c.new + c.contacted + c.qualified + c.won + c.lost };
  },
});

export const get = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, { contactId }) => {
    let res;
    try {
      res = await requireContact(ctx, contactId);
    } catch {
      return null;
    }
    const { contact, role } = res;
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_contact_and_createdAt", (q) => q.eq("contactId", contactId))
      .order("desc")
      .take(50);
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_contact_and_at", (q) => q.eq("contactId", contactId))
      .order("desc")
      .take(150);
    const siteNames = new Map<string, string>();
    for (const s of submissions) {
      if (!siteNames.has(s.siteId)) siteNames.set(s.siteId, (await ctx.db.get("sites", s.siteId))?.name ?? "Website");
    }
    const assignee = contact.assigneeId ? await ctx.db.get("users", contact.assigneeId) : null;
    return {
      contact: { ...contact, displayName: displayName(contact) },
      canEdit: role !== "viewer",
      canDelete: role === "admin" || role === "owner",
      assignee: assignee ? { _id: assignee._id, name: assignee.name || assignee.email || "" } : null,
      submissions: submissions.map((s) => ({ ...s, siteName: siteNames.get(s.siteId) ?? "Website" })),
      activities,
    };
  },
});

export const update = mutation({
  args: {
    contactId: v.id("contacts"),
    status: v.optional(contactStatusValidator),
    assigneeId: v.optional(v.union(v.id("users"), v.null())),
    followUpAt: v.optional(v.union(v.number(), v.null())),
    value: v.optional(v.union(v.number(), v.null())),
    tags: v.optional(v.array(v.string())),
    name: v.optional(v.string()),
    email: v.optional(v.union(v.string(), v.null())),
    phone: v.optional(v.union(v.string(), v.null())),
    company: v.optional(v.union(v.string(), v.null())),
  },
  returns: v.null(),
  handler: async (ctx, { contactId, ...patch }) => {
    const { contact, user, viaStaff } = await requireContact(ctx, contactId, "member");
    await applyContactPatch(ctx, contact, patch, { userId: user._id, label: actorLabel(user, viaStaff) });
    return null;
  },
});

export const addNote = mutation({
  args: { contactId: v.id("contacts"), body: v.string() },
  returns: v.null(),
  handler: async (ctx, { contactId, body }) => {
    const { contact, user, viaStaff } = await requireContact(ctx, contactId, "member");
    await addNoteTo(ctx, contact, body, { userId: user._id, label: actorLabel(user, viaStaff) });
    return null;
  },
});

export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  returns: v.id("contacts"),
  handler: async (ctx, { workspaceId, ...input }) => {
    const { user, viaStaff } = await requireWorkspace(ctx, workspaceId, "member");
    const c = await createManualContact(ctx, workspaceId, input, { userId: user._id, label: actorLabel(user, viaStaff) }, "manual");
    return c._id;
  },
});

/** Delete a contact and everything they sent (for data-protection requests). */
export const erase = mutation({
  args: { contactId: v.id("contacts") },
  returns: v.null(),
  handler: async (ctx, { contactId }) => {
    const { contact, user, viaStaff } = await requireContact(ctx, contactId, "admin");
    await eraseContact(ctx, contact);
    await audit(ctx, {
      workspaceId: contact.workspaceId,
      actorId: user._id,
      actorLabel: actorLabel(user, viaStaff),
      action: "contact.erased",
      detail: "Deleted a contact and their form submissions",
    });
    return null;
  },
});

/** Follow-ups due before `before` (the client passes the end of today). */
export const dueFollowUps = query({
  args: { workspaceId: v.id("workspaces"), before: v.number() },
  handler: async (ctx, { workspaceId, before }) => {
    await requireWorkspace(ctx, workspaceId);
    const rows = await ctx.db
      .query("contacts")
      .withIndex("by_workspace_and_followUp", (q) => q.eq("workspaceId", workspaceId).gt("followUpAt", 0).lte("followUpAt", before))
      .take(50);
    return rows
      .filter((c) => c.status !== "won" && c.status !== "lost" && c.status !== "spam")
      .map((c) => ({ _id: c._id, name: displayName(c), followUpAt: c.followUpAt!, status: c.status }));
  },
});

/** Latest leads, for the Overview page. */
export const recent = query({
  args: { workspaceId: v.id("workspaces"), siteId: v.optional(v.id("sites")) },
  handler: async (ctx, { workspaceId, siteId }) => {
    await requireWorkspace(ctx, workspaceId);
    const subs = siteId
      ? await ctx.db.query("submissions").withIndex("by_site_and_createdAt", (q) => q.eq("siteId", siteId)).order("desc").take(20)
      : await ctx.db.query("submissions").withIndex("by_workspace_and_createdAt", (q) => q.eq("workspaceId", workspaceId)).order("desc").take(20);
    const out = [];
    for (const s of subs) {
      if (s.spam || s.workspaceId !== workspaceId) continue;
      const c = await ctx.db.get("contacts", s.contactId);
      if (!c) continue;
      out.push({
        submissionId: s._id,
        contactId: c._id,
        name: displayName(c),
        email: c.email ?? null,
        phone: c.phone ?? null,
        status: c.status,
        form: s.form,
        source: s.attribution?.source ?? null,
        createdAt: s.createdAt,
      });
      if (out.length >= 6) break;
    }
    return out;
  },
});

/** One page of contacts as CSV rows (admins). The browser fetches pages until done. */
export const exportPage = query({
  args: { workspaceId: v.id("workspaces"), filter: listFilter, cursor: v.union(v.string(), v.null()) },
  handler: async (ctx, { workspaceId, filter, cursor }) => {
    await requireWorkspace(ctx, workspaceId, "admin");
    const opts = { numItems: 500, cursor };
    const page =
      filter === "all"
        ? await ctx.db.query("contacts").withIndex("by_workspace_and_lastActivity", (q) => q.eq("workspaceId", workspaceId)).order("desc").paginate(opts)
        : await ctx.db
            .query("contacts")
            .withIndex("by_workspace_and_status_and_lastActivity", (q) => q.eq("workspaceId", workspaceId).eq("status", filter))
            .order("desc")
            .paginate(opts);
    const rows = page.page
      .filter((c) => filter !== "all" || c.status !== "spam")
      .map((c) => ({
        name: displayName(c),
        email: c.email ?? "",
        phone: c.phone ?? "",
        company: c.company ?? "",
        status: c.status,
        tags: c.tags.join("; "),
        value: c.value ?? "",
        source: c.firstTouch?.source ?? "",
        channel: c.firstTouch?.channel ?? "",
        landing_page: c.firstTouch?.landingPath ?? "",
        campaign: c.firstTouch?.utmCampaign ?? "",
        country: c.firstTouch?.country ?? "",
        submissions: c.submissions,
        created: new Date(c.createdAt).toISOString(),
        last_activity: new Date(c.lastActivityAt).toISOString(),
      }));
    return { rows, cursor: page.isDone ? null : page.continueCursor };
  },
});
