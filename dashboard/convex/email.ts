/**
 * Sending email through Resend's HTTP API (default runtime, no Node).
 *
 * Convex env: RESEND_API_KEY, EMAIL_FROM ("SyncSite <notify@layersyncai.com>",
 * on a domain verified in Resend). Without a key, sending is skipped with a
 * warning so development works; invite links can still be copied in the app.
 */
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export type OutgoingEmail = { to: string; subject: string; html: string; text: string };

export async function sendEmail(mail: OutgoingEmail): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "SyncSite <onboarding@resend.dev>";
  if (!apiKey) {
    console.warn(`RESEND_API_KEY is not set; skipped email "${mail.subject}"`);
    return { sent: false, error: "Email is not configured" };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [mail.to], subject: mail.subject, html: mail.html, text: mail.text }),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    console.error(`Resend ${res.status}: ${detail}`);
    return { sent: false, error: `Email provider returned ${res.status}` };
  }
  return { sent: true };
}

export const send = internalAction({
  args: { to: v.string(), subject: v.string(), html: v.string(), text: v.string() },
  returns: v.null(),
  handler: async (_ctx, args) => {
    await sendEmail(args);
    return null;
  },
});

/** Absolute dashboard URL for links in emails and pushes. */
export function dashboardUrl(path = "/"): string {
  const base = (process.env.DASHBOARD_URL || "http://localhost:5174").replace(/\/+$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
