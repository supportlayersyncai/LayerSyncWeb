import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, internal } from "../_generated/api";
import { createUserFromInvite } from "../auth";
import { sha256Hex } from "../lib/crypto";
import { makeUser, makeWorkspace, meta, setup } from "./fixtures.helper";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-09T08:00:00Z"));
});
afterEach(() => vi.useRealTimers());

const contactForm = (over: Record<string, string> = {}) => ({
  form: "contact",
  fields: Object.entries({ name: "Tendai Moyo", phone: "077 518 7682", interest: "SyncEstate", ...over }).map(([key, value]) => ({ key, value })),
  page: "/sync-estate",
  elapsedMs: 9000,
});

describe("website leads", () => {
  it("stores the lead with where they came from and tells the team", async () => {
    const t = setup();
    const { workspaceId, siteKey } = await makeWorkspace(t);
    const { userId, as: owner } = await makeUser(t, { email: "kev@layersyncai.com", workspaceId, role: "owner" });
    const { as: viewer } = await makeUser(t, { email: "viewer@client.com", workspaceId, role: "viewer" });

    await t.mutation(internal.ingest.track, {
      meta: meta(siteKey),
      events: [{ t: "pv", id: "pv_e00001", p: "/", r: "https://www.google.com/" }, { t: "pv", id: "pv_e00002", p: "/sync-estate" }],
    });
    vi.advanceTimersByTime(90_000);
    const res = await t.mutation(internal.contacts.ingestLead, { meta: meta(siteKey), lead: contactForm() });
    expect(res).toEqual({ status: 200, ok: true });
    await t.finishAllScheduledFunctions(vi.runAllTimers);

    const contacts = await t.run((ctx) => ctx.db.query("contacts").collect());
    expect(contacts).toHaveLength(1);
    expect(contacts[0]).toMatchObject({
      name: "Tendai Moyo",
      phone: "+263775187682",
      status: "new",
      origin: "website",
      firstTouch: { channel: "search", source: "Google", landingPath: "/", journey: ["/", "/sync-estate"], country: "ZW" },
    });
    expect(contacts[0].firstTouch?.timeToConvertMs).toBeGreaterThanOrEqual(89_000);
    const session = (await t.run((ctx) => ctx.db.query("sessions").collect()))[0];
    expect(session.converted).toBe(true);

    // Everyone on the workspace gets an in-app notification.
    const notes = await t.run((ctx) => ctx.db.query("notifications").collect());
    expect(notes).toHaveLength(2);
    expect(notes.find((n) => n.userId === userId)).toMatchObject({ kind: "lead", title: "New lead: Tendai Moyo", url: `/layersync/leads/${contacts[0]._id}` });
    expect(await owner.query(api.notifications.unreadCount, {})).toBe(1);

    const counts = await owner.query(api.contacts.statusCounts, { workspaceId });
    expect(counts).toMatchObject({ new: 1, all: 1 });
    const list = await viewer.query(api.contacts.list, { workspaceId, filter: "all", paginationOpts: { numItems: 10, cursor: null } });
    expect(list.page[0]).toMatchObject({ name: "Tendai Moyo", source: "Google" });
  });

  it("merges repeat sends by phone or email and reopens lost leads", async () => {
    const t = setup();
    const { workspaceId, siteKey } = await makeWorkspace(t);
    const { as: owner } = await makeUser(t, { email: "kev@layersyncai.com", workspaceId });
    await t.mutation(internal.contacts.ingestLead, { meta: meta(siteKey), lead: contactForm() });
    const [c] = await t.run((ctx) => ctx.db.query("contacts").collect());
    await owner.mutation(api.contacts.update, { contactId: c._id, status: "lost" });
    vi.advanceTimersByTime(20 * 60_000);
    await t.mutation(internal.contacts.ingestLead, {
      meta: meta(siteKey, { ip: "9.9.9.9" }),
      lead: contactForm({ phone: "+263 77 518 7682", email: "tendai@moyo.co.zw" }),
    });
    const all = await t.run((ctx) => ctx.db.query("contacts").collect());
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ submissions: 2, status: "new", email: "tendai@moyo.co.zw" });
    expect(await owner.query(api.contacts.statusCounts, { workspaceId })).toMatchObject({ new: 1, lost: 0 });
  });

  it("keeps spam out of the inbox and out of notifications", async () => {
    const t = setup();
    const { workspaceId, siteKey } = await makeWorkspace(t);
    await makeUser(t, { email: "kev@layersyncai.com", workspaceId });
    const res = await t.mutation(internal.contacts.ingestLead, { meta: meta(siteKey), lead: { ...contactForm(), hp: "I am a bot" } });
    expect(res.ok).toBe(true); // bots learn nothing
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    const [c] = await t.run((ctx) => ctx.db.query("contacts").collect());
    expect(c.status).toBe("spam");
    expect(await t.run((ctx) => ctx.db.query("notifications").collect())).toHaveLength(0);
  });

  it("rejects forms without a way to reply, from other origins, and floods", async () => {
    const t = setup();
    const { siteKey } = await makeWorkspace(t);
    expect(await t.mutation(internal.contacts.ingestLead, { meta: meta(siteKey), lead: { fields: [{ key: "name", value: "Anon" }] } })).toMatchObject({ status: 400 });
    expect(await t.mutation(internal.contacts.ingestLead, { meta: meta(siteKey, { origin: "https://phish.example" }), lead: contactForm() })).toMatchObject({
      status: 403,
    });
    // The rejected send above counted against this visitor too: five per ten minutes.
    const results = [];
    for (let i = 0; i < 5; i++) results.push(await t.mutation(internal.contacts.ingestLead, { meta: meta(siteKey), lead: contactForm({ phone: `07751876${10 + i}` }) }));
    expect(results.slice(0, 4).every((r) => r.ok)).toBe(true);
    expect(results[4]).toMatchObject({ status: 429 });
    // Someone else on the same site is unaffected.
    expect(await t.mutation(internal.contacts.ingestLead, { meta: meta(siteKey, { ip: "5.5.5.5" }), lead: contactForm() })).toMatchObject({ ok: true });
  });
});

describe("CRM permissions", () => {
  it("lets members work leads, viewers only read, and keeps workspaces apart", async () => {
    const t = setup();
    const a = await makeWorkspace(t, { slug: "alpha", domains: ["alpha.co.zw"] });
    const b = await makeWorkspace(t, { slug: "beta", domains: ["beta.co.zw"] });
    const { userId: memberId, as: member } = await makeUser(t, { email: "m@alpha.co.zw", workspaceId: a.workspaceId, role: "member" });
    const { as: viewer } = await makeUser(t, { email: "v@alpha.co.zw", workspaceId: a.workspaceId, role: "viewer" });
    const { as: otherOwner } = await makeUser(t, { email: "o@beta.co.zw", workspaceId: b.workspaceId, role: "owner" });

    const contactId = await member.mutation(api.contacts.create, { workspaceId: a.workspaceId, name: "Rudo Chikwanha", email: "rudo@example.com" });
    await member.mutation(api.contacts.update, { contactId, status: "qualified", assigneeId: memberId, followUpAt: Date.now() + 86_400_000, value: 1200, tags: ["Agency", "agency", "Harare"] });
    await member.mutation(api.contacts.addNote, { contactId, body: "Called, wants a demo on Friday." });

    const detail = await viewer.query(api.contacts.get, { contactId });
    expect(detail?.contact).toMatchObject({ status: "qualified", value: 1200, tags: ["agency", "harare"] });
    expect(detail?.canEdit).toBe(false);
    expect(detail?.activities.map((x) => x.type)).toEqual(["note", "followUp", "assigned", "status", "created"]);

    await expect(viewer.mutation(api.contacts.update, { contactId, status: "won" })).rejects.toThrow(/member access/);
    await expect(member.mutation(api.contacts.update, { contactId, assigneeId: (await makeUser(t, { email: "x@y.z" })).userId })).rejects.toThrow(/member of this workspace/);
    expect(await otherOwner.query(api.contacts.get, { contactId })).toBeNull();
    await expect(otherOwner.mutation(api.contacts.addNote, { contactId, body: "hi" })).rejects.toThrow(/Not found/);
    await expect(member.mutation(api.contacts.create, { workspaceId: a.workspaceId, name: "Dup", email: "RUDO@example.com" })).rejects.toThrow(/already in your leads/);
    await expect(member.mutation(api.contacts.erase, { contactId })).rejects.toThrow(/admin access/);
  });

  it("erases a contact completely for data-protection requests", async () => {
    const t = setup();
    const { workspaceId, siteKey } = await makeWorkspace(t);
    const { as: owner } = await makeUser(t, { email: "kev@layersyncai.com", workspaceId });
    await t.mutation(internal.contacts.ingestLead, { meta: meta(siteKey), lead: contactForm() });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    const [c] = await t.run((ctx) => ctx.db.query("contacts").collect());
    await owner.mutation(api.contacts.erase, { contactId: c._id });
    const left = await t.run(async (ctx) => ({
      contacts: (await ctx.db.query("contacts").collect()).length,
      submissions: (await ctx.db.query("submissions").collect()).length,
      activities: (await ctx.db.query("activities").collect()).length,
      notifications: (await ctx.db.query("notifications").collect()).length,
    }));
    expect(left).toEqual({ contacts: 0, submissions: 0, activities: 0, notifications: 0 });
    expect(await owner.query(api.contacts.statusCounts, { workspaceId })).toMatchObject({ all: 0 });
  });
});

describe("invitations and roles", () => {
  async function invite(t: ReturnType<typeof setup>, over: Partial<{ email: string; expiresAt: number; workspaceId: string; staff: boolean }> = {}) {
    const token = `tok_${Math.random().toString(36).slice(2)}_padding_padding`;
    const { workspaceId } = await makeWorkspace(t);
    await t.run(async (ctx) =>
      ctx.db.insert("invites", {
        workspaceId,
        email: over.email ?? "new@client.com",
        role: "admin",
        staff: over.staff ?? false,
        tokenHash: await sha256Hex(token),
        createdAt: Date.now(),
        expiresAt: over.expiresAt ?? Date.now() + 86_400_000,
      }),
    );
    return { token, workspaceId };
  }

  it("creates an account only from a valid invite for that email", async () => {
    const t = setup();
    const { token, workspaceId } = await invite(t);
    await expect(t.run((ctx) => createUserFromInvite(ctx, { email: "new@client.com" }))).rejects.toThrow(/by invitation/);
    await expect(t.run((ctx) => createUserFromInvite(ctx, { email: "new@client.com", token: "wrong-token-wrong-token" }))).rejects.toThrow(/no longer valid/);
    await expect(t.run((ctx) => createUserFromInvite(ctx, { email: "attacker@evil.com", token }))).rejects.toThrow(/is for new@client.com/);
    const userId = await t.run((ctx) => createUserFromInvite(ctx, { email: "new@client.com", name: "New Person", token }));
    const m = await t.run((ctx) => ctx.db.query("memberships").collect());
    expect(m).toMatchObject([{ userId, workspaceId, role: "admin" }]);
    // The link works once.
    await expect(t.run((ctx) => createUserFromInvite(ctx, { email: "new@client.com", token }))).rejects.toThrow(/no longer valid/);
  });

  it("refuses expired invites", async () => {
    const t = setup();
    const { token } = await invite(t, { expiresAt: Date.now() - 1 });
    await expect(t.run((ctx) => createUserFromInvite(ctx, { email: "new@client.com", token }))).rejects.toThrow(/no longer valid/);
  });

  it("limits who can invite whom, and never hands admins the link", async () => {
    const t = setup();
    const { workspaceId } = await makeWorkspace(t);
    const { as: admin } = await makeUser(t, { email: "admin@client.com", workspaceId, role: "admin" });
    const { as: staff } = await makeUser(t, { email: "kev@layersyncai.com", staff: true });
    await expect(admin.mutation(api.invites.create, { workspaceId, email: "boss@client.com", role: "owner" })).rejects.toThrow(/Only owners/);
    const r = await admin.mutation(api.invites.create, { workspaceId, email: "Staff@Client.com", role: "member" });
    expect(r.link).toBeNull();
    const s = await staff.mutation(api.invites.create, { workspaceId, email: "boss@client.com", role: "owner" });
    expect(s.link).toMatch(/\/invite#/);
    const peek = await t.query(api.invites.peek, { token: s.link!.split("#")[1] });
    expect(peek).toMatchObject({ valid: true, email: "boss@client.com", role: "owner", accountExists: false });
    // Staff access is written to the workspace's audit log, labelled as LayerSync.
    const log = await t.run((ctx) => ctx.db.query("auditLog").collect());
    expect(log.some((e) => e.actorLabel.includes("(LayerSync)") && e.action === "member.invited")).toBe(true);
  });

  it("keeps at least one owner", async () => {
    const t = setup();
    const { workspaceId } = await makeWorkspace(t);
    const { as: owner } = await makeUser(t, { email: "owner@client.com", workspaceId, role: "owner" });
    const [m] = await t.run((ctx) => ctx.db.query("memberships").collect());
    await expect(owner.mutation(api.members.updateRole, { membershipId: m._id, role: "admin" })).rejects.toThrow(/at least one owner/);
    await expect(owner.mutation(api.members.remove, { membershipId: m._id })).rejects.toThrow(/at least one owner/);
  });

  it("treats disabled accounts as signed out", async () => {
    const t = setup();
    const { workspaceId } = await makeWorkspace(t);
    const { userId, as: user } = await makeUser(t, { email: "gone@client.com", workspaceId });
    await t.run((ctx) => ctx.db.patch("users", userId, { disabledAt: Date.now() }));
    expect(await user.query(api.workspaces.me, {})).toBeNull();
    await expect(user.query(api.contacts.statusCounts, { workspaceId })).rejects.toThrow(/sign in/);
  });
});
