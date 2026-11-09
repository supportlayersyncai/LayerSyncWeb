/**
 * Outgoing webhooks: URL rules and the signature scheme. Pure.
 *
 * Every delivery carries
 *   SyncSite-Signature: t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<body>")>
 * so the receiver can check it came from us and wasn't replayed (reject when
 * t is more than five minutes old). Same idea as Stripe's.
 */
import { hmacSha256Hex, timingSafeEqual } from "./crypto";

export const WEBHOOK_EVENTS = ["lead.created", "contact.updated", "note.created"] as const;
export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number];

/** Retry delays after a failed delivery: 1 min, 5 min, 30 min, 2 h, 6 h. */
export const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 3_600_000, 6 * 3_600_000];
/** A webhook is switched off after this many failures in a row. */
export const MAX_CONSECUTIVE_FAILURES = 25;

function isPrivateIPv4(host: string): boolean {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  return (
    a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

/**
 * Whether we'll POST to this URL. HTTPS only, no credentials in the URL, and
 * nothing that points at a private network (a webhook must never be a way to
 * reach internal services). A public name that resolves to a private address
 * can't be caught here (Convex functions can't resolve DNS); what's left of
 * that risk is bounded by Convex's own network isolation, and receivers only
 * ever see a status code and our error text, never a response body.
 */
export function validateWebhookUrl(input: string): { ok: true; url: string } | { ok: false; error: string } {
  const s = input.trim();
  if (s.length > 500) return { ok: false, error: "That URL is too long." };
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return { ok: false, error: "Enter a full URL, starting with https://" };
  }
  if (u.protocol !== "https:") return { ok: false, error: "Webhook URLs must use https://" };
  if (u.username || u.password) return { ok: false, error: "Don't put a username or password in the URL. Check the signature instead." };
  if (u.port && u.port !== "443" && u.port !== "8443") return { ok: false, error: "Use the standard HTTPS port." };
  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".lan") ||
    !host.includes(".") && !host.includes(":")
  ) {
    return { ok: false, error: "That address isn't reachable from the internet." };
  }
  if (isPrivateIPv4(host)) return { ok: false, error: "That address is on a private network." };
  // Raw IP addresses: IPv6 literals have too many ways to spell a private
  // address (mapped, compatible, NAT64), and real webhook receivers have names.
  if (host.includes(":") || /^\d+$/.test(host) || /^0x/i.test(host)) {
    return { ok: false, error: "Use the receiver's domain name, not an IP address." };
  }
  // Wildcard DNS services that turn any IP into a name (127.0.0.1.nip.io).
  if (/(^|\.)(nip\.io|sslip\.io|xip\.io|localtest\.me|lvh\.me|traefik\.me|vcap\.me|local\.gd|localhost\.run)$/.test(host)) {
    return { ok: false, error: "That address isn't reachable from the internet." };
  }
  u.hash = "";
  return { ok: true, url: u.toString() };
}

export async function signPayload(secret: string, body: string, timestampSec: number): Promise<string> {
  const sig = await hmacSha256Hex(secret, `${timestampSec}.${body}`);
  return `t=${timestampSec},v1=${sig}`;
}

/** Receiver side, used in tests and shown in the docs. */
export async function verifySignature(
  secret: string,
  body: string,
  header: string,
  nowSec: number,
  toleranceSec = 300,
): Promise<boolean> {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=", 2) as [string, string]));
  const t = Number(parts.t);
  if (!Number.isFinite(t) || Math.abs(nowSec - t) > toleranceSec || !parts.v1) return false;
  const expected = await hmacSha256Hex(secret, `${t}.${body}`);
  return timingSafeEqual(expected, parts.v1);
}
