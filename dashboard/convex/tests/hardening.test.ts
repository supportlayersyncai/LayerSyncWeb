/**
 * Regression tests for the security review's findings (see SECURITY.md).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, internal } from "../_generated/api";
import { cleanProps } from "../lib/ingest";
import { validateWebhookUrl } from "../lib/webhooks";
import { isPushServiceUrl } from "../push";
import { makeUser, makeWorkspace, meta, setup } from "./fixtures.helper";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-09T08:00:00Z"));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

const lead = (phone: string) => ({ form: "contact", fields: [{ key: "name", value: "Flood" }, { key: "phone", value: phone }], elapsedMs: 5000 });

describe("forged-Origin floods", () => {
  it("limits leads per IP even when the user agent changes", async () => {
    const t = setup();
    const { siteKey } = await makeWorkspace(t);
    const out = [];
    for (let i = 0; i < 11; i++) {
      out.push(await t.mutation(internal.contacts.ingestLead, { meta: meta(siteKey, { ua: `Mozilla/5.0 (Windows NT 10.0) Chrome/${100 + i}.0 Safari/537.36` }), lead: lead(`07712345${10 + i}`) }));
    }
    expect(out.slice(0, 10).every((r) => r.ok)).toBe(true);
    expect(out[10]).toMatchObject({ status: 429 });
  });

  it("limits events per IP", async () => {
    const t = setup();
    const { siteKey } = await makeWorkspace(t);
    const batch = Array.from({ length: 20 }, (_, i) => ({ t: "ev" as const, n: "x", p: `/p${i}` }));
    let last;
    for (let i = 0; i < 25; i++) last = await t.mutation(internal.ingest.track, { meta: meta(siteKey, { ua: `Mozilla/5.0 Chrome/${i} Safari/537.36 x` }), events: batch });
    expect(last).toMatchObject({ status: 429 });
  });

  it("stops emailing everyone after a burst, but keeps every lead", async () => {
    const t = setup();
    const { workspaceId, siteKey } = await makeWorkspace(t);
    await makeUser(t, { email: "kev@layersyncai.com", workspaceId, notifyEmail: true });
    for (let i = 0; i < 18; i++) {
      await t.mutation(internal.contacts.ingestLead, { meta: meta(siteKey, { ip: `10.0.${i}.1` }), lead: lead(`07712345${10 + i}`) });
    }
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    const counts = await t.run(async (ctx) => ({
      contacts: (await ctx.db.query("contacts").collect()).length,
      inApp: (await ctx.db.query("notifications").collect()).length,
      emails: (await ctx.db.system.query("_scheduled_functions").collect()).filter((f) => f.name.includes("email")).length,
    }));
    expect(counts.contacts).toBe(18);
    expect(counts.inApp).toBe(18);
    expect(counts.emails).toBe(15);
  });

  it("never runs two recomputes of the same day at once", async () => {
    const t = setup();
    const { siteKey } = await makeWorkspace(t);
    await t.mutation(internal.ingest.track, { meta: meta(siteKey), events: [{ t: "pv", id: "pv_lock0001", p: "/" }] });
    expect(await t.mutation(internal.rollups.tick, {})).toBe(1);
    // A second tick while the first run hasn't finished schedules nothing.
    await t.mutation(internal.ingest.track, { meta: meta(siteKey), events: [{ t: "pv", id: "pv_lock0002", p: "/a" }] });
    expect(await t.mutation(internal.rollups.tick, {})).toBe(0);
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    expect(await t.run((ctx) => ctx.db.query("rollupRuns").collect())).toHaveLength(0);
    expect(await t.mutation(internal.rollups.tick, {})).toBe(1);
  });
});

describe("credentials outliving their creator", () => {
  it("revokes keys and switches off webhooks when an admin is removed or demoted", async () => {
    const t = setup();
    const { workspaceId } = await makeWorkspace(t);
    const { as: owner } = await makeUser(t, { email: "owner@client.com", workspaceId, role: "owner" });
    const { userId: adminId, as: admin } = await makeUser(t, { email: "admin@client.com", workspaceId, role: "admin" });
    const { key } = await admin.mutation(api.apiKeys.create, { workspaceId, name: "Admin's key", scopes: ["read", "write"] });
    await admin.mutation(api.webhooks.create, { workspaceId, url: "https://hooks.example.com/a", events: ["lead.created"] });
    const res = () => t.fetch("/mcp", { method: "POST", headers: { Authorization: `Bearer ${key}` }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }) });
    expect((await res()).status).toBe(200);

    const membership = (await owner.query(api.members.list, { workspaceId })).find((m) => m.userId === adminId)!;
    await owner.mutation(api.members.updateRole, { membershipId: membership._id, role: "member" });
    expect((await res()).status).toBe(401);
    const [hook] = await owner.query(api.webhooks.list, { workspaceId });
    expect(hook).toMatchObject({ active: false });
    expect(hook.disabledReason).toMatch(/no longer an admin/);
  });

  it("refuses a key whose creator lost access even if nothing revoked it", async () => {
    const t = setup();
    const { workspaceId } = await makeWorkspace(t);
    const { userId, as: admin } = await makeUser(t, { email: "admin@client.com", workspaceId, role: "admin" });
    const { key } = await admin.mutation(api.apiKeys.create, { workspaceId, name: "Test key", scopes: ["read"] });
    await t.run(async (ctx) => {
      const m = await ctx.db.query("memberships").withIndex("by_workspace_and_user", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId)).unique();
      await ctx.db.delete("memberships", m!._id);
    });
    const r = await t.fetch("/mcp", { method: "POST", headers: { Authorization: `Bearer ${key}` }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }) });
    expect(r.status).toBe(401);
  });
});

describe("staff controls", () => {
  it("switches an account off, ends its sessions, and takes away staff access", async () => {
    const t = setup();
    const { workspaceId } = await makeWorkspace(t);
    const { as: staff } = await makeUser(t, { email: "kev@layersyncai.com", staff: true });
    const { userId: otherStaff } = await makeUser(t, { email: "tadiwa@layersyncai.com", staff: true });
    const { userId: clientId, as: client } = await makeUser(t, { email: "owner@client.com", workspaceId });
    await t.run(async (ctx) => {
      const sessionId = await ctx.db.insert("authSessions", { userId: clientId, expirationTime: Date.now() + 86_400_000 });
      await ctx.db.insert("authRefreshTokens", { sessionId, expirationTime: Date.now() + 86_400_000 });
    });
    await staff.mutation(api.staff.setDisabled, { userId: clientId, disabled: true });
    expect(await client.query(api.workspaces.me, {})).toBeNull();
    expect(await t.run((ctx) => ctx.db.query("authSessions").collect())).toHaveLength(0);
    expect(await t.run((ctx) => ctx.db.query("authRefreshTokens").collect())).toHaveLength(0);

    await staff.mutation(api.staff.removeStaff, { userId: otherStaff });
    expect((await staff.query(api.staff.list, {})).staff.map((u) => u.email)).toEqual(["kev@layersyncai.com"]);
    await expect(client.mutation(api.staff.setDisabled, { userId: clientId, disabled: false })).rejects.toThrow();
  });

  it("lets staff cancel a staff invitation", async () => {
    const t = setup();
    const { as: staff } = await makeUser(t, { email: "kev@layersyncai.com", staff: true });
    await staff.mutation(api.invites.inviteStaff, { email: "new@layersyncai.com" });
    const { invites } = await staff.query(api.staff.list, {});
    await staff.mutation(api.invites.revoke, { inviteId: invites[0]._id });
    expect((await staff.query(api.staff.list, {})).invites).toHaveLength(0);
  });

  it("stops an admin cancelling an owner's invitation by re-inviting", async () => {
    const t = setup();
    const { workspaceId } = await makeWorkspace(t);
    const { as: owner } = await makeUser(t, { email: "owner@client.com", workspaceId, role: "owner" });
    const { as: admin } = await makeUser(t, { email: "admin@client.com", workspaceId, role: "admin" });
    await owner.mutation(api.invites.create, { workspaceId, email: "cofounder@client.com", role: "admin" });
    await expect(admin.mutation(api.invites.create, { workspaceId, email: "cofounder@client.com", role: "member" })).rejects.toThrow(/Ask an owner/);
  });
});

describe("MCP batches", () => {
  it("count every message against the limit", async () => {
    const t = setup();
    const { workspaceId } = await makeWorkspace(t);
    const { as: owner } = await makeUser(t, { email: "owner@client.com", workspaceId });
    const { key } = await owner.mutation(api.apiKeys.create, { workspaceId, name: "Test key", scopes: ["read"] });
    const batch = JSON.stringify(Array.from({ length: 20 }, (_, i) => ({ jsonrpc: "2.0", id: i, method: "ping" })));
    const statuses = [];
    for (let i = 0; i < 4; i++) statuses.push((await t.fetch("/mcp", { method: "POST", headers: { Authorization: `Bearer ${key}` }, body: batch })).status);
    expect(statuses).toEqual([200, 200, 200, 429]);
  });
});

describe("addresses we'll send to", () => {
  it("refuses IP literals and wildcard-DNS names for webhooks", () => {
    for (const u of ["https://[::7f00:1]/x", "https://[64:ff9b::a00:1]/x", "https://127.0.0.1.nip.io/x", "https://10.0.0.1.sslip.io/x", "https://2130706433/x", "https://0x7f000001/x"]) {
      expect(validateWebhookUrl(u).ok, u).toBe(false);
    }
    expect(validateWebhookUrl("https://hooks.zapier.com/x").ok).toBe(true);
  });
  it("only accepts real browser push services", () => {
    expect(isPushServiceUrl("https://fcm.googleapis.com/fcm/send/abc")).toBe(true);
    expect(isPushServiceUrl("https://web.push.apple.com/abc")).toBe(true);
    expect(isPushServiceUrl("https://updates.push.services.mozilla.com/wpush/v2/abc")).toBe(true);
    expect(isPushServiceUrl("https://attacker.example/abc")).toBe(false);
    expect(isPushServiceUrl("https://fcm.googleapis.com:8443/x")).toBe(false);
    expect(isPushServiceUrl("http://fcm.googleapis.com/x")).toBe(false);
  });
});

describe("masking", () => {
  it("masks numbers in event props and cleans lead page paths", async () => {
    expect(cleanProps({ file: "invoice-0775187682.pdf", cta: "nav" })).toEqual({ file: "invoice-[number].pdf", cta: "nav" });
    const t = setup();
    const { siteKey } = await makeWorkspace(t);
    await t.mutation(internal.contacts.ingestLead, {
      meta: meta(siteKey),
      lead: { ...lead("0771234567"), page: "/thanks/tendai@example.com?x=1" },
    });
    const [s] = await t.run((ctx) => ctx.db.query("submissions").collect());
    expect(s.page).toBe("/thanks/[email]");
  });
});
