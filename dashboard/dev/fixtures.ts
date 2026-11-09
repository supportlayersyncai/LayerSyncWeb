/**
 * Sample data for the demo build (`npm run demo`). Sessions are generated and
 * then rolled up with the real convex/lib/rollup.ts, so the Overview numbers
 * hang together exactly as they would in production. Names and numbers are
 * made up.
 */
import { addDays, dayKey, daySpan, daysInRange } from "../convex/lib/dates";
import { accumulate, emptyAccumulator, finishDay, mergeBreakdowns, sumTotals, type DayStats, type SessionLike } from "../convex/lib/rollup";

const TZ = "Africa/Harare";
let seed = 42;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const pick = <T>(items: Array<[T, number]>): T => {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [v, w] of items) if ((r -= w) <= 0) return v;
  return items[0][0];
};

const NOW = Date.now();
const TODAY = dayKey(NOW, TZ);

const PAGES: Array<[string, number]> = [
  ["/", 40], ["/sync-estate", 22], ["/what-we-build", 10], ["/work", 8], ["/about", 7], ["/contact", 6], ["/layer-map", 9],
  ["/solutions/web-dev", 6], ["/solutions/real-estate", 4], ["/privacy", 1],
];
const SOURCES: Array<[{ channel: string; source: string; campaign?: string }, number]> = [
  [{ channel: "direct", source: "Direct" }, 30],
  [{ channel: "search", source: "Google" }, 24],
  [{ channel: "social", source: "Instagram" }, 12],
  [{ channel: "social", source: "ManyChat", campaign: "layer-map" }, 9],
  [{ channel: "social", source: "LinkedIn" }, 7],
  [{ channel: "social", source: "WhatsApp" }, 6],
  [{ channel: "social", source: "Facebook" }, 5],
  [{ channel: "ai", source: "ChatGPT" }, 3],
  [{ channel: "referral", source: "syncrm.vercel.app" }, 2],
  [{ channel: "email", source: "Newsletter", campaign: "november" }, 2],
];
const COUNTRIES: Array<[string, number]> = [["ZW", 62], ["ZA", 14], ["GB", 6], ["US", 5], ["ZM", 4], ["BW", 3], ["AE", 2], ["AU", 2], ["KE", 1], ["MZ", 1]];

function sessionsFor(day: string, scale: number): SessionLike[] {
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay();
  const base = (weekday === 0 || weekday === 6 ? 34 : 58) * scale;
  const n = Math.round(base * (0.75 + rand() * 0.5));
  const out: SessionLike[] = [];
  const dayStart = Date.parse(`${day}T00:00:00+02:00`);
  for (let i = 0; i < n; i++) {
    const hour = pick<number>(Array.from({ length: 24 }, (_, h) => [h, h < 6 ? 1 : h < 9 ? 4 : h < 18 ? 9 : h < 22 ? 6 : 2]));
    const startedAt = dayStart + hour * 3_600_000 + Math.floor(rand() * 3_600_000);
    if (startedAt > NOW) continue;
    const src = pick(SOURCES);
    const device = pick<string>([["mobile", 64], ["desktop", 32], ["tablet", 4]]);
    const views = pick<number>([[1, 48], [2, 22], [3, 14], [4, 8], [5, 5], [7, 3]]);
    const pages = [];
    let at = startedAt;
    for (let v = 0; v < views; v++) {
      const path = v === 0 && src.source === "ManyChat" ? "/layer-map" : pick(PAGES);
      const ms = Math.round(4_000 + rand() * (v === views - 1 ? 40_000 : 90_000));
      pages.push({ path, at, ms, sc: Math.round(25 + rand() * 75) });
      at += ms + 2_000;
    }
    const engagedMs = pages.reduce((s, p) => s + p.ms, 0);
    const converted = views >= 2 && rand() < 0.09;
    const eventNames = [] as Array<{ k: string; n: number }>;
    if (rand() < 0.12) eventNames.push({ k: "whatsapp", n: 1 });
    if (rand() < 0.04) eventNames.push({ k: "phone", n: 1 });
    if (pages.some((p) => p.path === "/layer-map") && rand() < 0.45) eventNames.push({ k: "download", n: 1 });
    if (rand() < 0.05) eventNames.push({ k: "outbound", n: 1 });
    if (converted) eventNames.push({ k: "form_submit", n: 1 }, { k: "lead", n: 1 });
    out.push({
      visitorHash: `v${day}${Math.floor(rand() * n * 0.85)}`,
      startedAt,
      pageviews: views,
      engagedMs: views === 1 && rand() < 0.6 ? Math.round(rand() * 9_000) : engagedMs,
      maxScroll: Math.max(...pages.map((p) => p.sc)),
      events: eventNames.reduce((s, e) => s + e.n, 0),
      converted,
      channel: src.channel,
      source: src.source,
      utmCampaign: src.campaign,
      country: pick(COUNTRIES),
      device,
      browser: device === "desktop" ? pick<string>([["Chrome", 70], ["Safari", 15], ["Edge", 15]]) : pick<string>([["Chrome", 55], ["Safari", 25], ["Instagram app", 12], ["Facebook app", 8]]),
      os: device === "desktop" ? "Windows" : pick<string>([["Android", 70], ["iOS", 30]]),
      entryPath: pages[0].path,
      exitPath: pages[pages.length - 1].path,
      pages,
      eventNames,
    });
  }
  return out;
}

const DAYS = new Map<string, DayStats>();
for (const day of daysInRange(addDays(TODAY, -800), TODAY)) {
  const age = daySpan(day, TODAY);
  const growth = age > 400 ? 0.45 : age > 60 ? 0.75 + (400 - age) / 1200 : 1;
  DAYS.set(day, finishDay(accumulate(emptyAccumulator(), sessionsFor(day, growth), TZ)));
}

export function overview(from: string, to: string) {
  const span = daySpan(from, to);
  const prevFrom = addDays(from, -span);
  const prevTo = addDays(from, -1);
  const get = (d: string) => DAYS.get(d);
  const cur = daysInRange(from, to).map(get).filter(Boolean) as DayStats[];
  const prev = daysInRange(prevFrom, prevTo).map(get).filter(Boolean) as DayStats[];
  const pt = (d: string) => {
    const x = get(d);
    return { visitors: x?.visitors ?? 0, sessions: x?.sessions ?? 0, pageviews: x?.pageviews ?? 0, conversions: x?.conversions ?? 0 };
  };
  const hour = (h: number) => `${String(h).padStart(2, "0")}:00`;
  const series =
    span === 1
      ? Array.from({ length: 24 }, (_, h) => ({ label: hour(h), visitors: 0, sessions: get(from)?.hourlySessions[h] ?? 0, pageviews: get(from)?.hourlyPageviews[h] ?? 0, conversions: 0 }))
      : daysInRange(from, to).map((d) => ({ label: d, ...pt(d) }));
  const previousSeries =
    span === 1
      ? Array.from({ length: 24 }, (_, h) => ({ label: hour(h), visitors: 0, sessions: get(prevFrom)?.hourlySessions[h] ?? 0, pageviews: get(prevFrom)?.hourlyPageviews[h] ?? 0, conversions: 0 }))
      : daysInRange(prevFrom, prevTo).map((d) => ({ label: d, ...pt(d) }));
  const totals = sumTotals(cur);
  return {
    site: { _id: SITE._id, name: SITE.name, timezone: TZ, domains: SITE.domains },
    range: { from, to, prevFrom, prevTo, days: span },
    totals,
    previous: sumTotals(prev),
    series,
    previousSeries,
    breakdowns: mergeBreakdowns(cur),
    leads: {
      total: totals.conversions,
      spam: 2,
      bySource: [
        { k: "Google", n: Math.round(totals.conversions * 0.32) },
        { k: "Direct", n: Math.round(totals.conversions * 0.24) },
        { k: "ManyChat", n: Math.round(totals.conversions * 0.18) },
        { k: "Instagram", n: Math.round(totals.conversions * 0.12) },
        { k: "LinkedIn", n: Math.round(totals.conversions * 0.08) },
      ],
      byChannel: [],
      byForm: [],
      byLanding: [],
    },
    hasAnyData: true,
    updatedAt: NOW - 90_000,
  };
}

export const ME = {
  _id: "user_kev",
  name: "Kevin Moyo",
  email: "kev@layersyncai.com",
  isStaff: true,
  workspaces: [
    { _id: "ws_layersync", name: "LayerSync", slug: "layersync", role: "owner" },
    { _id: "ws_moyo", name: "Moyo Realty", slug: "moyo-realty", role: "owner" },
  ],
};

export const SITE = {
  _id: "site_ls",
  name: "layersyncai.com",
  domains: ["layersyncai.com"],
  publicKey: "ss_8fQ2kLm4pX7vR1tZ9wB3",
  timezone: TZ,
  trackingEnabled: true,
  allowLocalhost: false,
  excludePaths: ["/admin"],
  createdAt: NOW - 40 * 86_400_000,
};

export const WORKSPACE = {
  workspace: { _id: "ws_layersync", _creationTime: NOW, name: "LayerSync", slug: "layersync", defaultCountryCode: "263", currency: "USD", createdAt: NOW - 40 * 86_400_000 },
  role: "owner",
  viaStaff: false,
  membershipId: "mem_1",
  sites: [SITE],
};

const PEOPLE = [
  ["Tendai Moyo", "tendai@moyorealty.co.zw", "+263775187682", "Moyo Realty", "new", "Google", "search", "ZW", "/sync-estate", 2],
  ["Rudo Chikwanha", "rudo@chikwanhaestates.com", "+263712345678", "Chikwanha Estates", "contacted", "ManyChat", "social", "ZW", "/layer-map", 1],
  ["Farai Ncube", "farai.ncube@gmail.com", "+263783001122", "", "qualified", "Instagram", "social", "ZW", "/", 3],
  ["Nyasha Dube", "nyasha@harvestfoods.co.zw", "+263774556677", "Harvest Foods", "new", "Direct", "direct", "ZW", "/what-we-build", 1],
  ["Sipho Ndlovu", "sipho@ndlovulegal.co.za", "+27821234567", "Ndlovu Legal", "won", "LinkedIn", "social", "ZA", "/work", 2],
  ["Chipo Mutasa", "", "+263719998877", "", "new", "WhatsApp", "social", "ZW", "/solutions/web-dev", 1],
  ["Tatenda Sibanda", "tatenda@sibandaagri.com", "", "Sibanda Agri", "lost", "Google", "search", "ZW", "/solutions/real-estate", 1],
  ["Amara Okafor", "amara@okaforcap.com", "+447700900123", "Okafor Capital", "contacted", "ChatGPT", "ai", "GB", "/about", 1],
] as const;

export const CONTACT_ROWS = PEOPLE.map(([name, email, phone, company, status, source, channel, country], i) => ({
  _id: `c_${i}`,
  name,
  email: email || null,
  phone: phone || null,
  company: company || null,
  status,
  tags: i === 0 ? ["agency"] : [],
  value: i === 4 ? 2400 : null,
  followUpAt: i === 1 ? NOW - 3_600_000 : i === 2 ? NOW + 2 * 86_400_000 : null,
  source,
  channel,
  country,
  submissions: PEOPLE[i][9],
  lastSubmissionAt: NOW - i * 7_200_000 - 600_000,
  lastActivityAt: NOW - i * 7_200_000 - 600_000,
  createdAt: NOW - i * 86_400_000,
  assignee: i % 3 === 1 ? "Kevin Moyo" : null,
}));

export function contactDetail(id: string) {
  const i = Number(id.replace("c_", "")) || 0;
  const r = CONTACT_ROWS[i];
  const p = PEOPLE[i];
  const contact = {
    _id: r._id,
    _creationTime: r.createdAt,
    workspaceId: "ws_layersync",
    name: r.name,
    displayName: r.name,
    email: r.email ?? undefined,
    phone: r.phone ?? undefined,
    company: r.company ?? undefined,
    status: r.status,
    tags: r.tags,
    value: r.value ?? undefined,
    followUpAt: r.followUpAt ?? undefined,
    origin: "website",
    submissions: r.submissions,
    lastActivityAt: r.lastActivityAt,
    createdAt: r.createdAt,
    searchText: "",
    firstTouch: {
      channel: p[6],
      source: p[5],
      landingPath: p[8],
      country: p[7],
      city: p[7] === "ZW" ? "Harare" : undefined,
      device: "mobile",
      journey: [p[8], "/sync-estate", "/work", "/contact"],
      timeToConvertMs: 6 * 60_000 + 42_000,
      utmCampaign: p[5] === "ManyChat" ? "layer-map" : undefined,
    },
  };
  return {
    contact,
    canEdit: true,
    canDelete: true,
    assignee: r.assignee ? { _id: "user_kev", name: r.assignee } : null,
    submissions: [
      {
        _id: "s1",
        form: i === 2 ? "diagnostic" : "contact",
        siteName: "layersyncai.com",
        page: "/contact",
        createdAt: r.lastSubmissionAt,
        spam: false,
        fields: [
          { key: "name", value: r.name },
          ...(r.email ? [{ key: "email", value: r.email }] : []),
          ...(r.phone ? [{ key: "phone", value: r.phone }] : []),
          ...(r.company ? [{ key: "business", value: r.company }] : []),
          { key: "interest", value: "SyncEstate" },
          { key: "message", value: "We run 14 agents across two branches and leads come in on WhatsApp, Property.co.zw and walk-ins. Nobody can see which deals are stalling. Can we see a demo this week?" },
        ],
      },
    ],
    activities: [
      { _id: "a3", type: "note", actorLabel: "Kevin Moyo", body: "Called. Wants a demo on Friday at 10. Send the SyncEstate deck first.", at: NOW - 40 * 60_000 },
      { _id: "a2", type: "status", actorLabel: "Kevin Moyo", from: "new", to: r.status === "new" ? "contacted" : r.status, at: NOW - 3 * 3_600_000 },
      { _id: "a1", type: "submission", actorLabel: "layersyncai.com", body: "We run 14 agents across two branches and leads come in on WhatsApp…", at: r.lastSubmissionAt },
    ],
  };
}

export const MEMBERS = [
  { _id: "mem_1", userId: "user_kev", name: "Kevin Moyo", email: "kev@layersyncai.com", role: "owner", disabled: false, createdAt: NOW },
  { _id: "mem_2", userId: "user_tadiwa", name: "Tadiwa Chari", email: "tadiwa@layersyncai.com", role: "admin", disabled: false, createdAt: NOW },
  { _id: "mem_3", userId: "user_ruva", name: "Ruva Banda", email: "ruva@layersyncai.com", role: "member", disabled: false, createdAt: NOW },
];

export function live() {
  const feed = Array.from({ length: 12 }, (_, i) => ({
    _id: `e${i}`,
    kind: i % 4 === 2 ? "event" : "pageview",
    name: i % 4 === 2 ? "whatsapp" : "pageview",
    path: PAGES[i % PAGES.length][0],
    at: NOW - i * 47_000,
    props: null,
    country: COUNTRIES[i % 4][0],
    device: i % 3 ? "mobile" : "desktop",
    source: SOURCES[i % 5][0].source,
  }));
  return { visitors: 7, capped: false, pages: [], countries: [], sources: [], devices: [], feed };
}

export const NOTIFICATIONS = [
  { _id: "n1", title: "New lead: Tendai Moyo", body: "via Google · contact form on layersyncai.com", url: "/layersync/leads/c_0", createdAt: NOW - 600_000 },
  { _id: "n2", title: "New lead: Nyasha Dube", body: "contact form on layersyncai.com", url: "/layersync/leads/c_3", createdAt: NOW - 4 * 3_600_000, readAt: NOW },
];

export const API_KEYS = [
  { _id: "k1", name: "Claude on Kev's laptop", prefix: "ssk_Hf8kP2qL", scopes: ["read", "write"], createdAt: NOW - 5 * 86_400_000, createdBy: "Kevin Moyo", lastUsedAt: NOW - 3_600_000, expiresAt: NOW + 360 * 86_400_000, revokedAt: null },
  { _id: "k2", name: "Weekly report bot", prefix: "ssk_9dQwT0aZ", scopes: ["read"], createdAt: NOW - 20 * 86_400_000, createdBy: "Tadiwa Chari", lastUsedAt: null, expiresAt: null, revokedAt: null },
];

export const WEBHOOKS = [
  {
    _id: "w1",
    url: "https://hooks.zapier.com/hooks/catch/1234567/abcde",
    description: null,
    events: ["lead.created"],
    active: true,
    disabledReason: null,
    consecutiveFailures: 0,
    createdAt: NOW - 9 * 86_400_000,
    secretHint: "…k3Lq",
    recent: [
      { _id: "d1", event: "lead.created", status: "succeeded", attempts: 1, responseStatus: 200, error: null, createdAt: NOW - 600_000 },
      { _id: "d2", event: "lead.created", status: "succeeded", attempts: 2, responseStatus: 200, error: null, createdAt: NOW - 4 * 3_600_000 },
    ],
  },
];

export const AUDIT = [
  { _id: "l1", actorLabel: "Kevin Moyo", action: "api_key.created", detail: "Claude on Kev's laptop (read, write)", at: NOW - 5 * 86_400_000 },
  { _id: "l2", actorLabel: "Tadiwa Chari (LayerSync)", action: "site.updated", detail: "layersyncai.com: excludePaths", at: NOW - 6 * 86_400_000 },
  { _id: "l3", actorLabel: "Kevin Moyo", action: "member.invited", detail: "Invited ruva@layersyncai.com as member", at: NOW - 8 * 86_400_000 },
];

export const ALL_WORKSPACES = [
  { _id: "ws_layersync", name: "LayerSync", slug: "layersync", createdAt: NOW - 40 * 86_400_000, sites: [{ name: "layersyncai.com", domains: ["layersyncai.com"] }], members: 3, openLeads: 5 },
  { _id: "ws_moyo", name: "Moyo Realty", slug: "moyo-realty", createdAt: NOW - 12 * 86_400_000, sites: [{ name: "Moyo Realty", domains: ["moyorealty.co.zw"] }], members: 2, openLeads: 3 },
  { _id: "ws_harvest", name: "Harvest Foods", slug: "harvest-foods", createdAt: NOW - 3 * 86_400_000, sites: [{ name: "Harvest Foods", domains: ["harvestfoods.co.zw"] }], members: 1, openLeads: 0 },
];
