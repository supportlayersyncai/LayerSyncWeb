/**
 * SyncSite data model.
 *
 *   workspaces ─┬─ memberships ── users        (who can see what)
 *               ├─ sites ── sessions ── events  (analytics, raw)
 *               │        └─ dailyStats, dailyBreakdowns (analytics, rolled up)
 *               ├─ contacts ─┬─ submissions     (CRM: one row per person)
 *               │            └─ activities      (timeline: notes, status changes)
 *               ├─ apiKeys, webhooks            (MCP + integrations)
 *               └─ auditLog
 *
 * Every row that belongs to a customer carries workspaceId, and every public
 * function checks membership of that workspace (convex/access.ts) before
 * reading or writing it.
 */
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const roleValidator = v.union(v.literal("viewer"), v.literal("member"), v.literal("admin"), v.literal("owner"));

export const contactStatusValidator = v.union(
  v.literal("new"),
  v.literal("contacted"),
  v.literal("qualified"),
  v.literal("won"),
  v.literal("lost"),
  v.literal("spam"),
);

export const deviceValidator = v.union(v.literal("desktop"), v.literal("mobile"), v.literal("tablet"));

const row = v.object({ k: v.string(), s: v.number(), pv: v.number(), b: v.number(), c: v.number(), e: v.number() });
const pageRow = v.object({
  k: v.string(),
  s: v.number(),
  pv: v.number(),
  b: v.number(),
  c: v.number(),
  e: v.number(),
  en: v.number(),
  ex: v.number(),
  sc: v.number(),
  scn: v.number(),
});
const countRow = v.object({ k: v.string(), n: v.number() });
const scrollRow = v.object({ k: v.string(), n: v.number(), sum: v.number() });

/** Where a lead came from, copied from their visit when they sent the form. */
export const attributionValidator = v.object({
  channel: v.string(),
  source: v.string(),
  referrerHost: v.optional(v.string()),
  landingPath: v.optional(v.string()),
  utmSource: v.optional(v.string()),
  utmMedium: v.optional(v.string()),
  utmCampaign: v.optional(v.string()),
  country: v.optional(v.string()),
  city: v.optional(v.string()),
  device: v.optional(v.string()),
  /** Pages seen before sending the form, in order (at most 20). */
  journey: v.optional(v.array(v.string())),
  /** Milliseconds from landing to sending the form. */
  timeToConvertMs: v.optional(v.number()),
});

export default defineSchema({
  ...authTables,

  // Convex Auth's users table, plus our own fields.
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    /** LayerSync staff: can open every workspace, create workspaces. */
    isStaff: v.optional(v.boolean()),
    /** Set when staff switch an account off. Every request checks it. */
    disabledAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),

  workspaces: defineTable({
    name: v.string(),
    /** URL segment, e.g. /layersync/overview. Lowercase letters, digits, dashes. */
    slug: v.string(),
    /** Country calling code used for local phone numbers in forms, e.g. "263". */
    defaultCountryCode: v.string(),
    /** ISO 4217, for deal values in the CRM. */
    currency: v.string(),
    createdAt: v.number(),
    createdBy: v.optional(v.id("users")),
  }).index("by_slug", ["slug"]),

  memberships: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: roleValidator,
    /** Email me when a new lead comes in. */
    notifyEmail: v.boolean(),
    /** Push to my browsers/phones when a new lead comes in. */
    notifyPush: v.boolean(),
    /** Monday summary email of last week's traffic and leads. */
    weeklyDigest: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_and_user", ["workspaceId", "userId"]),

  invites: defineTable({
    /** Absent for a LayerSync staff invite. */
    workspaceId: v.optional(v.id("workspaces")),
    email: v.string(),
    role: roleValidator,
    staff: v.boolean(),
    /** SHA-256 of the token in the link. The token itself is never stored. */
    tokenHash: v.string(),
    invitedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
    revokedAt: v.optional(v.number()),
  })
    .index("by_token_hash", ["tokenHash"])
    .index("by_workspace_and_createdAt", ["workspaceId", "createdAt"])
    .index("by_email", ["email"]),

  sites: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    /** Hostnames the tracker may run on (see convex/lib/domains.ts). */
    domains: v.array(v.string()),
    /** Public site key embedded in the tracking snippet. Not a secret. */
    publicKey: v.string(),
    timezone: v.string(),
    trackingEnabled: v.boolean(),
    /** Accept events from localhost too (for developing the site). */
    allowLocalhost: v.boolean(),
    /** Path prefixes never tracked, e.g. "/admin". */
    excludePaths: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_public_key", ["publicKey"]),

  // ── Analytics ────────────────────────────────────────────────────────────

  /**
   * Salts for the daily visitor hash. A visitor is hash(salt, site, IP, user
   * agent); yesterday's salt is deleted, so nobody (us included) can link a
   * visitor across days or work back to an IP.
   */
  dailySalts: defineTable({ day: v.string(), salt: v.string() }).index("by_day", ["day"]),

  /** One visit: pageviews within 30 minutes of each other from one visitor. */
  sessions: defineTable({
    siteId: v.id("sites"),
    visitorHash: v.string(),
    /** Site-local day the visit started, "YYYY-MM-DD". */
    day: v.string(),
    startedAt: v.number(),
    lastSeenAt: v.number(),
    entryPath: v.string(),
    exitPath: v.string(),
    pageviews: v.number(),
    engagedMs: v.number(),
    maxScroll: v.number(),
    events: v.number(),
    eventNames: v.array(countRow),
    /** The first 50 pages of the visit. */
    pages: v.array(
      v.object({ id: v.optional(v.string()), path: v.string(), at: v.number(), ms: v.number(), sc: v.number() }),
    ),
    channel: v.string(),
    source: v.string(),
    referrerHost: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    utmTerm: v.optional(v.string()),
    utmContent: v.optional(v.string()),
    country: v.optional(v.string()),
    region: v.optional(v.string()),
    city: v.optional(v.string()),
    device: deviceValidator,
    browser: v.string(),
    os: v.string(),
    language: v.optional(v.string()),
    converted: v.boolean(),
  })
    .index("by_site_and_visitor_and_lastSeen", ["siteId", "visitorHash", "lastSeenAt"])
    .index("by_site_and_day", ["siteId", "day"])
    .index("by_site_and_lastSeen", ["siteId", "lastSeenAt"]),

  /** Raw pageviews and events, kept 90 days for the live feed and drill-downs. */
  events: defineTable({
    siteId: v.id("sites"),
    sessionId: v.id("sessions"),
    kind: v.union(v.literal("pageview"), v.literal("event")),
    /** "pageview", or the event name: "outbound", "whatsapp", "lead", ... */
    name: v.string(),
    path: v.string(),
    props: v.optional(v.record(v.string(), v.string())),
    at: v.number(),
  })
    .index("by_site_and_at", ["siteId", "at"])
    .index("by_session", ["sessionId"])
    .index("by_at", ["at"]),

  /** One site's totals for one site-local day (convex/lib/rollup.ts). Small, so long ranges are cheap. */
  dailyStats: defineTable({
    siteId: v.id("sites"),
    day: v.string(),
    visitors: v.number(),
    sessions: v.number(),
    pageviews: v.number(),
    bounces: v.number(),
    engagedMs: v.number(),
    conversions: v.number(),
    events: v.number(),
    hourlySessions: v.array(v.number()),
    hourlyPageviews: v.array(v.number()),
    updatedAt: v.number(),
  }).index("by_site_and_day", ["siteId", "day"]),

  /** The same day's breakdowns: top pages, sources, countries and so on. */
  dailyBreakdowns: defineTable({
    siteId: v.id("sites"),
    day: v.string(),
    pages: v.array(pageRow),
    channels: v.array(row),
    sources: v.array(row),
    countries: v.array(row),
    devices: v.array(row),
    browsers: v.array(row),
    os: v.array(row),
    campaigns: v.array(row),
    eventNames: v.array(countRow),
    scroll: v.array(scrollRow),
  }).index("by_site_and_day", ["siteId", "day"]),

  /** When each site was last rolled up. Kept apart from `sites` so the cron never conflicts with ingest. */
  rollupState: defineTable({ siteId: v.id("sites"), lastRunAt: v.number() }).index("by_site", ["siteId"]),

  /** A day being recomputed right now, so a busy site never has two chains on the same day. */
  rollupRuns: defineTable({ siteId: v.id("sites"), day: v.string(), startedAt: v.number() }).index("by_site_and_day", ["siteId", "day"]),

  // ── CRM ──────────────────────────────────────────────────────────────────

  /** One person. Website forms with the same email or phone land on the same contact. */
  contacts: defineTable({
    workspaceId: v.id("workspaces"),
    siteId: v.optional(v.id("sites")),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneDigits: v.optional(v.string()),
    company: v.optional(v.string()),
    status: contactStatusValidator,
    assigneeId: v.optional(v.id("users")),
    tags: v.array(v.string()),
    /** Deal value in the workspace currency. */
    value: v.optional(v.number()),
    followUpAt: v.optional(v.number()),
    /** "website" for forms, "manual" when added in the dashboard, "api" via MCP. */
    origin: v.union(v.literal("website"), v.literal("manual"), v.literal("api")),
    firstTouch: v.optional(attributionValidator),
    submissions: v.number(),
    lastSubmissionAt: v.optional(v.number()),
    lastActivityAt: v.number(),
    createdAt: v.number(),
    searchText: v.string(),
  })
    .index("by_workspace_and_lastActivity", ["workspaceId", "lastActivityAt"])
    .index("by_workspace_and_status_and_lastActivity", ["workspaceId", "status", "lastActivityAt"])
    .index("by_workspace_and_email", ["workspaceId", "email"])
    .index("by_workspace_and_phone", ["workspaceId", "phoneDigits"])
    .index("by_workspace_and_followUp", ["workspaceId", "followUpAt"])
    .index("by_workspace_and_createdAt", ["workspaceId", "createdAt"])
    .searchIndex("search_text", { searchField: "searchText", filterFields: ["workspaceId", "status"] }),

  /** Running totals per status, so tabs can show counts without scanning. */
  contactCounts: defineTable({
    workspaceId: v.id("workspaces"),
    new: v.number(),
    contacted: v.number(),
    qualified: v.number(),
    won: v.number(),
    lost: v.number(),
    spam: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  /** Exactly what someone sent through a form, with where they came from. */
  submissions: defineTable({
    workspaceId: v.id("workspaces"),
    siteId: v.id("sites"),
    contactId: v.id("contacts"),
    sessionId: v.optional(v.id("sessions")),
    form: v.string(),
    page: v.optional(v.string()),
    fields: v.array(v.object({ key: v.string(), value: v.string() })),
    attribution: v.optional(attributionValidator),
    spam: v.boolean(),
    spamReason: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_contact_and_createdAt", ["contactId", "createdAt"])
    .index("by_workspace_and_createdAt", ["workspaceId", "createdAt"])
    .index("by_site_and_createdAt", ["siteId", "createdAt"]),

  /** A contact's timeline. */
  activities: defineTable({
    workspaceId: v.id("workspaces"),
    contactId: v.id("contacts"),
    type: v.union(
      v.literal("submission"),
      v.literal("note"),
      v.literal("status"),
      v.literal("assigned"),
      v.literal("followUp"),
      v.literal("created"),
      v.literal("updated"),
    ),
    body: v.optional(v.string()),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    submissionId: v.optional(v.id("submissions")),
    actorId: v.optional(v.id("users")),
    /** Who did it, for display: a name, "Website" or "API key 'Zapier'". */
    actorLabel: v.string(),
    at: v.number(),
  })
    .index("by_contact_and_at", ["contactId", "at"])
    .index("by_workspace_and_at", ["workspaceId", "at"]),

  // ── Notifications ────────────────────────────────────────────────────────

  notifications: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    kind: v.union(v.literal("lead"), v.literal("system")),
    title: v.string(),
    body: v.string(),
    /** Dashboard path to open, e.g. /layersync/leads/abc. */
    url: v.string(),
    contactId: v.optional(v.id("contacts")),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user_and_createdAt", ["userId", "createdAt"])
    .index("by_user_and_readAt", ["userId", "readAt"])
    .index("by_contact", ["contactId"]),

  pushSubscriptions: defineTable({
    userId: v.id("users"),
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_endpoint", ["endpoint"]),

  // ── Integrations ─────────────────────────────────────────────────────────

  /** Keys for the MCP server. Only the SHA-256 is stored; the key is shown once. */
  apiKeys: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    /** First characters of the key, to recognise it in the list. */
    prefix: v.string(),
    hash: v.string(),
    scopes: v.array(v.union(v.literal("read"), v.literal("write"))),
    createdBy: v.id("users"),
    createdAt: v.number(),
    lastUsedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    revokedAt: v.optional(v.number()),
  })
    .index("by_hash", ["hash"])
    .index("by_workspace", ["workspaceId"]),

  webhooks: defineTable({
    workspaceId: v.id("workspaces"),
    url: v.string(),
    description: v.optional(v.string()),
    /** Signing secret. Shown once when created; used to sign every delivery. */
    secret: v.string(),
    events: v.array(v.string()),
    active: v.boolean(),
    consecutiveFailures: v.number(),
    disabledReason: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  webhookDeliveries: defineTable({
    webhookId: v.id("webhooks"),
    workspaceId: v.id("workspaces"),
    event: v.string(),
    payload: v.string(),
    status: v.union(v.literal("pending"), v.literal("succeeded"), v.literal("failed")),
    attempts: v.number(),
    responseStatus: v.optional(v.number()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    lastAttemptAt: v.optional(v.number()),
  })
    .index("by_webhook_and_createdAt", ["webhookId", "createdAt"])
    .index("by_createdAt", ["createdAt"]),

  /** Who changed what. Staff access to a workspace is always recorded here. */
  auditLog: defineTable({
    workspaceId: v.optional(v.id("workspaces")),
    actorId: v.optional(v.id("users")),
    actorLabel: v.string(),
    action: v.string(),
    detail: v.optional(v.string()),
    at: v.number(),
  })
    .index("by_workspace_and_at", ["workspaceId", "at"])
    .index("by_at", ["at"]),
});
