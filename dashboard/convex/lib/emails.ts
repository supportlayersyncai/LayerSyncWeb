/**
 * Email templates. Plain inline-styled HTML (what email clients render) in
 * the LayerSync look: near-black band, light type, one pill button.
 * Every value that came from a person is escaped.
 */

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Layout = { preheader: string; eyebrow: string; title: string; bodyHtml: string; button?: { label: string; url: string }; footer?: string };

export function layout({ preheader, eyebrow, title, bodyHtml, button, footer }: Layout): string {
  const btn = button
    ? `<tr><td style="padding:28px 0 4px"><a href="${escapeHtml(button.url)}" style="display:inline-block;background:#0b0b0b;color:#ffffff;text-decoration:none;font-weight:700;font-size:11px;letter-spacing:.2em;text-transform:uppercase;padding:16px 28px;border-radius:999px">${escapeHtml(button.label)}</a></td></tr>`
    : "";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="background:#050505;border-radius:24px 24px 0 0;padding:22px 32px">
<span style="font-size:13px;font-weight:600;letter-spacing:.28em;color:#ffffff">LAYERSYNC</span>
<span style="font-size:10px;font-weight:700;letter-spacing:.3em;color:#7FB069;padding-left:10px">SYNCSITE</span>
</td></tr>
<tr><td style="background:#ffffff;border-radius:0 0 24px 24px;padding:32px;border:1px solid rgba(0,0,0,.06);border-top:0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="font-size:10px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#D36135">${escapeHtml(eyebrow)}</td></tr>
<tr><td style="padding-top:12px;font-size:26px;line-height:1.2;font-weight:300;letter-spacing:-.02em;color:#0b0b0b">${escapeHtml(title)}</td></tr>
<tr><td style="padding-top:16px;font-size:15px;line-height:1.6;color:#3f3f46">${bodyHtml}</td></tr>
${btn}
</table></td></tr>
<tr><td style="padding:20px 32px;font-size:12px;line-height:1.6;color:#8a8a93;text-align:center">${footer ? escapeHtml(footer) : "SyncSite by LayerSync, Harare."}</td></tr>
</table></td></tr></table></body></html>`;
}

export function inviteEmail(p: { workspaceName?: string; inviterName?: string; role: string; url: string; staff: boolean }) {
  const where = p.staff ? "LayerSync staff on SyncSite" : `${p.workspaceName} on SyncSite`;
  const by = p.inviterName ? `${escapeHtml(p.inviterName)} has invited you` : "You've been invited";
  return {
    subject: p.staff ? "Your SyncSite staff account" : `You're invited to ${p.workspaceName} on SyncSite`,
    html: layout({
      preheader: `Set your password to start using ${where}.`,
      eyebrow: "Invitation",
      title: p.staff ? "Your SyncSite staff account" : `Join ${p.workspaceName}`,
      bodyHtml: `<p style="margin:0 0 12px">${by} to join <strong>${escapeHtml(where)}</strong> as ${escapeHtml(p.role)}.</p>
<p style="margin:0">SyncSite shows your website's visitors and every enquiry your site receives, in one place. The link works once and expires in 7 days.</p>`,
      button: { label: "Accept invitation", url: p.url },
      footer: "If you weren't expecting this, you can ignore it. Nothing happens until the link is used.",
    }),
    text: `${p.inviterName ?? "Someone"} has invited you to join ${where} as ${p.role}.\n\nAccept: ${p.url}\n\nThe link works once and expires in 7 days.`,
  };
}

export function resetCodeEmail(code: string) {
  return {
    subject: `${code} is your SyncSite reset code`,
    html: layout({
      preheader: "Use this code to choose a new password.",
      eyebrow: "Password reset",
      title: "Your reset code",
      bodyHtml: `<p style="margin:0 0 16px">Enter this code in SyncSite to choose a new password. It expires in 15 minutes.</p>
<p style="margin:0;font-size:32px;font-weight:300;letter-spacing:.3em;color:#0b0b0b">${escapeHtml(code)}</p>`,
      footer: "If you didn't ask for this, ignore it: your password stays the same.",
    }),
    text: `Your SyncSite reset code is ${code}. It expires in 15 minutes.`,
  };
}

export type LeadEmailInput = {
  workspaceName: string;
  siteName: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  form: string;
  source?: string;
  landingPath?: string;
  page?: string;
  url: string;
  returning: boolean;
  includeDetails: boolean;
};

export function leadEmail(p: LeadEmailInput) {
  const rows: Array<[string, string | undefined]> = p.includeDetails
    ? [
        ["Name", p.name],
        ["Email", p.email],
        ["Phone", p.phone],
        ["Company", p.company],
        ["Message", p.message && (p.message.length > 600 ? `${p.message.slice(0, 600)}…` : p.message)],
      ]
    : [];
  rows.push(["Form", p.form], ["Came from", p.source], ["Landed on", p.landingPath], ["Sent from", p.page]);
  const table = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#8a8a93;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:8px 0;font-size:15px;color:#111;white-space:pre-wrap">${escapeHtml(v as string)}</td></tr>`,
    )
    .join("");
  const who = p.includeDetails ? p.name : "Someone";
  return {
    subject: `${p.returning ? "Returning lead" : "New lead"}: ${who} via ${p.siteName}`,
    html: layout({
      preheader: `${who} sent the ${p.form} form on ${p.siteName}.`,
      eyebrow: p.returning ? "Returning lead" : "New lead",
      title: `${who} got in touch`,
      bodyHtml: `<p style="margin:0 0 12px">${escapeHtml(who)} sent the <strong>${escapeHtml(p.form)}</strong> form on ${escapeHtml(p.siteName)}.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee;width:100%">${table}</table>`,
      button: { label: "Open in SyncSite", url: p.url },
      footer: `You get these because you're on ${p.workspaceName} in SyncSite. Change it under Settings, Notifications.`,
    }),
    text: `${who} sent the ${p.form} form on ${p.siteName}.\n\n${rows
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n")}\n\nOpen: ${p.url}`,
  };
}

export type DigestInput = {
  workspaceName: string;
  periodLabel: string;
  url: string;
  sites: Array<{ name: string; visitors: number; sessions: number; conversions: number; visitorsDelta: number | null; topSource?: string; topPage?: string }>;
  newLeads: number;
};

export function digestEmail(p: DigestInput) {
  const pct = (d: number | null) => (d === null ? "" : ` (${d >= 0 ? "+" : ""}${Math.round(d * 100)}%)`);
  const blocks = p.sites
    .map(
      (s) => `<tr><td style="padding:14px 0;border-top:1px solid #eee">
<div style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#8a8a93">${escapeHtml(s.name)}</div>
<div style="padding-top:6px;font-size:15px;color:#111"><strong>${s.visitors.toLocaleString("en")}</strong> visitors${pct(s.visitorsDelta)} · ${s.sessions.toLocaleString("en")} visits · ${s.conversions} form sends</div>
${s.topSource ? `<div style="padding-top:4px;font-size:13px;color:#555">Top source: ${escapeHtml(s.topSource)}${s.topPage ? ` · Top page: ${escapeHtml(s.topPage)}` : ""}</div>` : ""}
</td></tr>`,
    )
    .join("");
  return {
    subject: `${p.workspaceName}: your week on SyncSite`,
    html: layout({
      preheader: `${p.newLeads} new leads ${p.periodLabel}.`,
      eyebrow: "Weekly summary",
      title: `${p.newLeads} new ${p.newLeads === 1 ? "lead" : "leads"} ${p.periodLabel}`,
      bodyHtml: `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%">${blocks}</table>`,
      button: { label: "Open SyncSite", url: p.url },
      footer: "Turn the weekly summary off under Settings, Notifications.",
    }),
    text: `${p.newLeads} new leads ${p.periodLabel}.\n\n${p.sites.map((s) => `${s.name}: ${s.visitors} visitors, ${s.sessions} visits, ${s.conversions} form sends`).join("\n")}\n\n${p.url}`,
  };
}
