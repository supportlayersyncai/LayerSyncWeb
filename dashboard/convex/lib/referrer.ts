/**
 * Where a visit came from. Classifies the referrer and UTM tags into a
 * channel (the buckets owners think in) and a source (the specific site).
 */

export const CHANNELS = ["direct", "search", "social", "ai", "email", "paid", "referral"] as const;
export type Channel = (typeof CHANNELS)[number];

export const CHANNEL_LABEL: Record<Channel, string> = {
  direct: "Direct",
  search: "Search",
  social: "Social",
  ai: "AI assistants",
  email: "Email",
  paid: "Paid",
  referral: "Referral",
};

type Known = { re: RegExp; source: string; channel: Channel };

// Order matters: more specific hosts first.
const KNOWN: Known[] = [
  { re: /(^|\.)(chatgpt\.com|chat\.openai\.com)$/, source: "ChatGPT", channel: "ai" },
  { re: /(^|\.)perplexity\.ai$/, source: "Perplexity", channel: "ai" },
  { re: /(^|\.)claude\.ai$/, source: "Claude", channel: "ai" },
  { re: /(^|\.)gemini\.google\.com$/, source: "Gemini", channel: "ai" },
  { re: /(^|\.)copilot\.microsoft\.com$/, source: "Copilot", channel: "ai" },
  { re: /(^|\.)(mail\.google\.com|outlook\.(live|office|office365)\.com|mail\.yahoo\.com)$/, source: "Email", channel: "email" },
  { re: /(^|\.)google\.[a-z.]+$/, source: "Google", channel: "search" },
  { re: /(^|\.)bing\.com$/, source: "Bing", channel: "search" },
  { re: /(^|\.)duckduckgo\.com$/, source: "DuckDuckGo", channel: "search" },
  { re: /(^|\.)search\.yahoo\.com$|(^|\.)yahoo\.com$/, source: "Yahoo", channel: "search" },
  { re: /(^|\.)ecosia\.org$/, source: "Ecosia", channel: "search" },
  { re: /(^|\.)search\.brave\.com$/, source: "Brave Search", channel: "search" },
  { re: /(^|\.)yandex\.[a-z.]+$/, source: "Yandex", channel: "search" },
  { re: /(^|\.)baidu\.com$/, source: "Baidu", channel: "search" },
  { re: /(^|\.)(facebook\.com|fb\.com|fb\.me|messenger\.com)$/, source: "Facebook", channel: "social" },
  { re: /(^|\.)instagram\.com$/, source: "Instagram", channel: "social" },
  { re: /(^|\.)(wa\.me|whatsapp\.com)$/, source: "WhatsApp", channel: "social" },
  { re: /(^|\.)(linkedin\.com|lnkd\.in)$/, source: "LinkedIn", channel: "social" },
  { re: /(^|\.)(t\.co|twitter\.com|x\.com)$/, source: "X", channel: "social" },
  { re: /(^|\.)(youtube\.com|youtu\.be)$/, source: "YouTube", channel: "social" },
  { re: /(^|\.)tiktok\.com$/, source: "TikTok", channel: "social" },
  { re: /(^|\.)pinterest\.[a-z.]+$/, source: "Pinterest", channel: "social" },
  { re: /(^|\.)reddit\.com$/, source: "Reddit", channel: "social" },
  { re: /(^|\.)(t\.me|telegram\.org)$/, source: "Telegram", channel: "social" },
  { re: /(^|\.)threads\.net$/, source: "Threads", channel: "social" },
  { re: /(^|\.)snapchat\.com$/, source: "Snapchat", channel: "social" },
  { re: /(^|\.)github\.com$/, source: "GitHub", channel: "referral" },
];

const SOCIAL_UTM = /^(facebook|fb|instagram|ig|whatsapp|wa|linkedin|twitter|x|tiktok|youtube|pinterest|telegram|manychat|threads|snapchat)$/i;
const PAID_MEDIUM = /^(cpc|ppc|paid|paidsearch|paid_search|paidsocial|paid_social|cpm|display|banner|ads?|retargeting)$/i;

export type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

/** Hostname of a referrer URL, lowercased and without "www.", or undefined. */
export function referrerHost(referrer: string | undefined): string | undefined {
  if (!referrer) return undefined;
  try {
    const u = new URL(referrer);
    if (u.protocol !== "http:" && u.protocol !== "https:" && u.protocol !== "android-app:") return undefined;
    // Android apps send android-app://com.google.android.gm etc.
    if (u.protocol === "android-app:") return u.host.toLowerCase() || undefined;
    return u.hostname.toLowerCase().replace(/^www\./, "") || undefined;
  } catch {
    return undefined;
  }
}

const ANDROID_APPS: Record<string, { source: string; channel: Channel }> = {
  "com.google.android.gm": { source: "Gmail", channel: "email" },
  "com.google.android.googlequicksearchbox": { source: "Google", channel: "search" },
  "com.facebook.katana": { source: "Facebook", channel: "social" },
  "com.instagram.android": { source: "Instagram", channel: "social" },
  "com.whatsapp": { source: "WhatsApp", channel: "social" },
  "com.linkedin.android": { source: "LinkedIn", channel: "social" },
  "org.telegram.messenger": { source: "Telegram", channel: "social" },
};

function prettyUtmSource(s: string): string {
  const lower = s.toLowerCase();
  const map: Record<string, string> = {
    fb: "Facebook", facebook: "Facebook", ig: "Instagram", instagram: "Instagram",
    wa: "WhatsApp", whatsapp: "WhatsApp", google: "Google", linkedin: "LinkedIn",
    twitter: "X", x: "X", tiktok: "TikTok", youtube: "YouTube", manychat: "ManyChat",
    newsletter: "Newsletter", telegram: "Telegram", bing: "Bing",
  };
  return map[lower] ?? s.slice(0, 60);
}

/**
 * Channel and source for a visit.
 *
 * @param referrer  document.referrer of the landing page view
 * @param utm       utm_* tags on the landing URL, if any
 * @param ownHosts  the site's own domains; a referrer from one of them is direct
 * @param clickIds  ad click ids present on the landing URL (gclid etc.)
 */
export function classifyVisit(
  referrer: string | undefined,
  utm: Utm,
  ownHosts: string[] = [],
  clickIds: { gclid?: boolean; msclkid?: boolean; fbclid?: boolean } = {},
): { channel: Channel; source: string; referrerHost?: string } {
  const host = referrerHost(referrer);
  const own = host !== undefined && ownHosts.some((h) => host === h || host.endsWith(`.${h}`));
  const refHost = own ? undefined : host;

  const medium = utm.medium?.trim() ?? "";
  if (utm.source?.trim()) {
    const source = prettyUtmSource(utm.source.trim());
    let channel: Channel = "referral";
    if (PAID_MEDIUM.test(medium) || clickIds.gclid || clickIds.msclkid) channel = "paid";
    else if (/^e-?mail|newsletter$/i.test(medium) || /newsletter|mailchimp|email/i.test(utm.source)) channel = "email";
    else if (/^(social|social-network|social-media|sm|organic_social)$/i.test(medium) || SOCIAL_UTM.test(utm.source.trim())) channel = "social";
    else if (/^organic$/i.test(medium)) channel = "search";
    else if (refHost) channel = classifyHost(refHost).channel;
    return { channel, source, referrerHost: refHost };
  }

  if (clickIds.gclid) return { channel: "paid", source: "Google Ads", referrerHost: refHost };
  if (clickIds.msclkid) return { channel: "paid", source: "Microsoft Ads", referrerHost: refHost };

  if (!refHost) {
    // fbclid with no referrer: an in-app browser that strips the referrer.
    if (clickIds.fbclid) return { channel: "social", source: "Facebook" };
    return { channel: "direct", source: "Direct" };
  }
  return { ...classifyHost(refHost), referrerHost: refHost };
}

function classifyHost(host: string): { channel: Channel; source: string } {
  const app = ANDROID_APPS[host];
  if (app) return app;
  for (const k of KNOWN) if (k.re.test(host)) return { channel: k.channel, source: k.source };
  return { channel: "referral", source: host.slice(0, 80) };
}
