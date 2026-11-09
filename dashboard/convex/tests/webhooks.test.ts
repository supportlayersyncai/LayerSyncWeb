import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, internal } from "../_generated/api";
import { verifySignature } from "../lib/webhooks";
import { makeUser, makeWorkspace, meta, setup } from "./fixtures.helper";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-09T08:00:00Z"));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("webhooks", () => {
  it("delivers signed lead events", async () => {
    const calls: Array<{ url: string; headers: Record<string, string>; body: string }> = [];
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      calls.push({ url, headers: init.headers as Record<string, string>, body: String(init.body) });
      return new Response("ok", { status: 200 });
    });
    const t = setup();
    const { workspaceId, siteKey } = await makeWorkspace(t);
    const { as: owner } = await makeUser(t, { email: "kev@layersyncai.com", workspaceId, notifyEmail: false });
    const { secret } = await owner.mutation(api.webhooks.create, { workspaceId, url: "https://hooks.example.com/syncsite", events: ["lead.created"] });
    await t.mutation(internal.contacts.ingestLead, {
      meta: meta(siteKey),
      lead: { form: "contact", fields: [{ key: "name", value: "Tendai" }, { key: "email", value: "t@example.com" }], elapsedMs: 4000 },
    });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    expect(calls).toHaveLength(1);
    const body = JSON.parse(calls[0].body);
    expect(body).toMatchObject({ event: "lead.created", data: { contact: { name: "Tendai", email: "t@example.com" }, submission: { form: "contact" } } });
    expect(await verifySignature(secret, calls[0].body, calls[0].headers["SyncSite-Signature"], Math.floor(Date.now() / 1000))).toBe(true);
    const [hook] = await owner.query(api.webhooks.list, { workspaceId });
    expect(hook.recent[0]).toMatchObject({ status: "succeeded", responseStatus: 200 });
    expect(hook.secretHint).toBe(`…${secret.slice(-4)}`);
  });

  it("retries, then switches off a webhook that keeps failing", async () => {
    let n = 0;
    vi.stubGlobal("fetch", async () => {
      n++;
      return new Response("nope", { status: 500 });
    });
    const t = setup();
    const { workspaceId } = await makeWorkspace(t);
    const { as: owner } = await makeUser(t, { email: "kev@layersyncai.com", workspaceId });
    await owner.mutation(api.webhooks.create, { workspaceId, url: "https://hooks.example.com/x", events: ["note.created"] });
    const contactId = await owner.mutation(api.contacts.create, { workspaceId, name: "Rudo", email: "r@example.com" });
    await owner.mutation(api.contacts.addNote, { contactId, body: "first" });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    expect(n).toBe(6); // first try + 5 retries
    const [hook] = await owner.query(api.webhooks.list, { workspaceId });
    expect(hook.recent[0]).toMatchObject({ status: "failed", attempts: 6 });
    expect(hook.consecutiveFailures).toBe(6);
    expect(hook.active).toBe(true);
    // After 25 failures in a row it's switched off and admins are told.
    await t.run((ctx) => ctx.db.patch("webhooks", hook._id, { consecutiveFailures: 24 }));
    await owner.mutation(api.contacts.addNote, { contactId, body: "second" });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    const [after] = await owner.query(api.webhooks.list, { workspaceId });
    expect(after.active).toBe(false);
    const notes = await owner.query(api.notifications.list, {});
    expect(notes.some((x) => x.title.includes("switched off"))).toBe(true);
  });

  it("refuses private addresses", async () => {
    const t = setup();
    const { workspaceId } = await makeWorkspace(t);
    const { as: owner } = await makeUser(t, { email: "kev@layersyncai.com", workspaceId });
    await expect(owner.mutation(api.webhooks.create, { workspaceId, url: "https://192.168.1.10/hook", events: ["lead.created"] })).rejects.toThrow(/private network/);
  });
});
