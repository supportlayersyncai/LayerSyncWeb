/// <reference types="vite/client" />
/**
 * Sign-in flows through Convex Auth itself (the real signIn action), with
 * throwaway JWT keys. Covers the guard in convex/auth.ts.
 */
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { api, internal } from "../_generated/api";
import { sha256Hex } from "../lib/crypto";
import { makeWorkspace, setup } from "./fixtures.helper";

let keys: { JWT_PRIVATE_KEY: string; JWKS: string };
beforeAll(async () => {
  const { privateKey, publicKey } = await generateKeyPair("RS256", { extractable: true });
  keys = {
    JWT_PRIVATE_KEY: (await exportPKCS8(privateKey)).trimEnd().replace(/\n/g, " "),
    JWKS: JSON.stringify({ keys: [{ use: "sig", ...(await exportJWK(publicKey)) }] }),
  };
});
beforeEach(() => {
  vi.stubEnv("JWT_PRIVATE_KEY", keys.JWT_PRIVATE_KEY);
  vi.stubEnv("JWKS", keys.JWKS);
  vi.stubEnv("CONVEX_SITE_URL", "https://example.convex.site");
  vi.stubEnv("SITE_URL", "http://localhost:5174");
});
afterEach(() => vi.unstubAllEnvs());

const PW = "correct horse battery staple";

async function attempt(t: ReturnType<typeof setup>, params: Record<string, string>) {
  try {
    const r = (await t.action(api.auth.signIn, { provider: "password", params })) as { tokens?: unknown };
    return { ok: !!r.tokens, error: "" };
  } catch (e) {
    return { ok: false, error: String((e as { data?: unknown }).data ?? (e as Error).message) };
  }
}

async function invite(t: ReturnType<typeof setup>, email: string) {
  const token = `tok_${Math.random().toString(36).slice(2)}_${"x".repeat(30)}`;
  const { workspaceId } = await makeWorkspace(t);
  await t.run(async (ctx) =>
    ctx.db.insert("invites", { workspaceId, email, role: "owner", staff: false, tokenHash: await sha256Hex(token), createdAt: Date.now(), expiresAt: Date.now() + 86_400_000 }),
  );
  return token;
}

describe("sign-up guard", () => {
  it("creates an account from a valid invite and then signs in normally", { timeout: 60_000 }, async () => {
    const t = setup();
    const token = await invite(t, "owner@client.com");
    expect(await attempt(t, { flow: "signUp", email: "owner@client.com", password: PW, name: "Owner", invite: token })).toMatchObject({ ok: true });
    expect(await attempt(t, { flow: "signIn", email: "owner@client.com", password: PW })).toMatchObject({ ok: true });
    expect(await attempt(t, { flow: "signIn", email: "owner@client.com", password: "wrong password here" })).toMatchObject({ ok: false });
  });

  it("can't be used to guess an existing account's password", { timeout: 60_000 }, async () => {
    const t = setup();
    const token = await invite(t, "victim@client.com");
    await attempt(t, { flow: "signUp", email: "victim@client.com", password: PW, invite: token });
    // Without an invite, with the right password: refused before Convex Auth looks at it.
    const noInvite = await attempt(t, { flow: "signUp", email: "victim@client.com", password: PW });
    expect(noInvite).toMatchObject({ ok: false, error: expect.stringMatching(/by invitation/) });
    // Same answer for an address with no account, so nothing is revealed.
    const nobody = await attempt(t, { flow: "signUp", email: "nobody@client.com", password: PW });
    expect(nobody.error).toBe(noInvite.error);
    // And it's throttled per address.
    for (let i = 0; i < 4; i++) await attempt(t, { flow: "signUp", email: "victim@client.com", password: `guess number ${i}` });
    expect(await attempt(t, { flow: "signUp", email: "victim@client.com", password: PW })).toMatchObject({ ok: false, error: expect.stringMatching(/Too many/) });
  });

  it("refuses an invite used for a different address, or twice", { timeout: 60_000 }, async () => {
    const t = setup();
    const token = await invite(t, "real@client.com");
    expect(await attempt(t, { flow: "signUp", email: "attacker@evil.com", password: PW, invite: token })).toMatchObject({ ok: false, error: expect.stringMatching(/no longer valid/) });
    expect(await attempt(t, { flow: "signUp", email: "real@client.com", password: PW, invite: token })).toMatchObject({ ok: true });
    expect(await attempt(t, { flow: "signUp", email: "real@client.com", password: PW, invite: token })).toMatchObject({ ok: false });
  });

  it("limits reset emails and reset codes per address", async () => {
    const t = setup();
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await t.mutation(internal.invites.guardAuthFlow, { flow: "reset", email: "a@b.co" }));
    expect(results.map((r) => r.ok)).toEqual([true, true, true, false]);
    for (let i = 0; i < 10; i++) await t.mutation(internal.invites.guardAuthFlow, { flow: "reset-verification", email: "a@b.co" });
    expect((await t.mutation(internal.invites.guardAuthFlow, { flow: "reset-verification", email: "a@b.co" })).ok).toBe(false);
    expect((await t.mutation(internal.invites.guardAuthFlow, { flow: "signIn", email: "a@b.co" })).ok).toBe(true);
  });
});
