import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../_generated/api";
import { makeUser, makeWorkspace, setup, UA_CHROME } from "./fixtures.helper";

const SECRET = "test-ingest-secret-0123456789abcdef0123456789";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-09T08:00:00Z"));
  vi.stubEnv("SYNCSITE_INGEST_SECRET", SECRET);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

const metaFor = (siteKey: string) => ({ siteKey, origin: "https://layersyncai.com", ip: "41.60.1.2", ua: UA_CHROME, country: "ZW" });

describe("ingest routes", () => {
  it("only accept requests carrying the shared secret", async () => {
    const t = setup();
    const { siteKey } = await makeWorkspace(t);
    const body = JSON.stringify({ meta: metaFor(siteKey), events: [{ t: "pv", id: "pv_h00001", p: "/" }] });
    expect((await t.fetch("/ingest/events", { method: "POST", body })).status).toBe(401);
    expect((await t.fetch("/ingest/events", { method: "POST", body, headers: { "X-SyncSite-Ingest": "nope" } })).status).toBe(401);
    const ok = await t.fetch("/ingest/events", { method: "POST", body, headers: { "X-SyncSite-Ingest": SECRET } });
    expect(ok.status).toBe(202);
    expect(await ok.json()).toMatchObject({ ok: true, accepted: 1 });
    expect((await t.fetch("/ingest/events", { method: "POST", body: "{not json", headers: { "X-SyncSite-Ingest": SECRET } })).status).toBe(400);
  });

  it("refuse everything when no secret is configured", async () => {
    vi.stubEnv("SYNCSITE_INGEST_SECRET", "");
    const t = setup();
    const { siteKey } = await makeWorkspace(t);
    const body = JSON.stringify({ meta: metaFor(siteKey), events: [{ t: "pv", id: "pv_h00002", p: "/" }] });
    expect((await t.fetch("/ingest/events", { method: "POST", body, headers: { "X-SyncSite-Ingest": "" } })).status).toBe(401);
  });

  it("take a lead and report validation errors to the form", async () => {
    const t = setup();
    const { siteKey } = await makeWorkspace(t);
    const send = (fields: Record<string, string>) =>
      t.fetch("/ingest/lead", {
        method: "POST",
        headers: { "X-SyncSite-Ingest": SECRET },
        body: JSON.stringify({ meta: metaFor(siteKey), lead: { form: "contact", fields, elapsedMs: 5000 } }),
      });
    const bad = await send({ name: "No Way To Reply" });
    expect(bad.status).toBe(400);
    expect((await bad.json()).error).toMatch(/email address or a phone/);
    const good = await send({ name: "Tendai", email: "tendai@example.com" });
    expect(good.status).toBe(200);
  });
});

describe("MCP server", () => {
  async function withKey(scopes: ("read" | "write")[] = ["read"]) {
    const t = setup();
    const ws = await makeWorkspace(t);
    const other = await makeWorkspace(t, { slug: "other", domains: ["other.co.zw"] });
    const { as: owner } = await makeUser(t, { email: "kev@layersyncai.com", workspaceId: ws.workspaceId });
    const { key } = await owner.mutation(api.apiKeys.create, { workspaceId: ws.workspaceId, name: "Claude", scopes });
    const leadId = await owner.mutation(api.contacts.create, { workspaceId: ws.workspaceId, name: "Rudo Chikwanha", email: "rudo@example.com" });
    const { as: otherOwner } = await makeUser(t, { email: "o@other.co.zw", workspaceId: other.workspaceId });
    const otherLeadId = await otherOwner.mutation(api.contacts.create, { workspaceId: other.workspaceId, name: "Secret Person", phone: "0771234567" });
    let id = 0;
    const rpc = async (method: string, params?: unknown, headers: Record<string, string> = {}) => {
      const res = await t.fetch("/mcp", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...headers },
        body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }),
      });
      return { status: res.status, body: res.status === 202 ? null : await res.json() };
    };
    const call = async (name: string, args: unknown = {}) => (await rpc("tools/call", { name, arguments: args })).body.result;
    return { t, ws, key, rpc, call, leadId, otherLeadId, owner };
  }

  it("speaks the protocol", async () => {
    const { rpc } = await withKey();
    const init = await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } });
    expect(init.body.result).toMatchObject({ protocolVersion: "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "syncsite" } });
    expect(init.body.result.instructions).toContain("read-only");
    const tools = await rpc("tools/list");
    expect(tools.body.result.tools.map((x: { name: string }) => x.name)).toContain("get_traffic_overview");
    expect((await rpc("nope")).body.error.code).toBe(-32601);
    expect((await rpc("ping")).body.result).toEqual({});
  });

  it("rejects missing or revoked keys and browser origins", async () => {
    const { t, rpc, owner, ws } = await withKey();
    expect((await t.fetch("/mcp", { method: "POST", body: "{}" })).status).toBe(401);
    expect((await t.fetch("/mcp", { method: "POST", body: "{}", headers: { Authorization: "Bearer ssk_wrongwrongwrongwrongwrong" } })).status).toBe(401);
    expect((await rpc("ping", undefined, { Origin: "https://evil.example" })).status).toBe(403);
    expect((await t.fetch("/mcp", { method: "GET" })).status).toBe(405);
    const [k] = await owner.query(api.apiKeys.list, { workspaceId: ws.workspaceId });
    await owner.mutation(api.apiKeys.revoke, { keyId: k._id });
    expect((await rpc("ping")).status).toBe(401);
  });

  it("reads leads in its own workspace only", async () => {
    const { call, leadId, otherLeadId } = await withKey();
    const list = await call("list_leads");
    expect(list.structuredContent.leads.map((l: { name: string }) => l.name)).toEqual(["Rudo Chikwanha"]);
    const one = await call("get_lead", { lead_id: leadId });
    expect(one.structuredContent.lead).toMatchObject({ name: "Rudo Chikwanha", email: "rudo@example.com" });
    const theirs = await call("get_lead", { lead_id: otherLeadId });
    expect(theirs).toMatchObject({ isError: true });
    expect(JSON.stringify(theirs)).not.toContain("Secret Person");
    const traffic = await call("get_traffic_overview", { period: "7d" });
    expect(traffic.structuredContent.totals).toMatchObject({ visits: 0 });
    expect(await call("get_lead", { lead_id: leadId, extra: 1 })).toMatchObject({ isError: true });
  });

  it("needs a write key to change anything", async () => {
    const ro = await withKey(["read"]);
    expect(await ro.call("add_lead_note", { lead_id: ro.leadId, note: "x" })).toMatchObject({ isError: true });
    const rw = await withKey(["read", "write"]);
    const upd = await rw.call("update_lead", { lead_id: rw.leadId, status: "contacted", follow_up_at: "2026-11-12T09:00:00Z" });
    expect(upd.structuredContent.lead).toMatchObject({ status: "contacted", follow_up_at: "2026-11-12T09:00:00.000Z" });
    await rw.call("add_lead_note", { lead_id: rw.leadId, note: "Synced from my CRM" });
    const made = await rw.call("create_lead", { name: "Farai Ncube", phone: "0712 345 678", note: "Met at the expo" });
    expect(made.structuredContent.lead).toMatchObject({ name: "Farai Ncube", phone: "+263712345678", origin: "api" });
    const activity = await rw.call("get_recent_activity", {});
    const types = activity.structuredContent.activity.map((a: { type: string }) => a.type);
    expect(types).toEqual(expect.arrayContaining(["status", "note", "created"]));
    expect(activity.structuredContent.activity[0].by).toBe('API key "Claude"');
    expect(await rw.call("update_lead", { lead_id: rw.otherLeadId, status: "won" })).toMatchObject({ isError: true });
  });
});
