/**
 * A small user-agent parser: enough to say desktop/mobile/tablet, which
 * browser and which OS. Deliberately coarse; no versions are kept.
 */

export type Device = "desktop" | "mobile" | "tablet";
export const DEVICES: readonly Device[] = ["desktop", "mobile", "tablet"];

const BOT_RE =
  /bot\b|bot\/|crawl|spider|slurp|mediapartners|facebookexternalhit|facebot|embedly|quora link preview|pinterest\/|bitlybot|whatsapp\/|telegrambot|discordbot|slackbot|skypeuripreview|vkshare|redditbot|applebot|yandex|baiduspider|duckduckbot|bingpreview|headlesschrome|phantomjs|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix|pingdom|uptimerobot|statuscake|monitor|curl\/|wget\/|python-requests|python-urllib|aiohttp|httpclient|okhttp|go-http-client|java\/|axios\/|node-fetch|undici|postmanruntime|insomnia|scrapy|ahrefs|semrush|mj12bot|dotbot|petalbot|bytespider|gptbot|chatgpt-user|oai-searchbot|claudebot|claude-web|anthropic-ai|perplexitybot|ccbot|amazonbot|google-extended|googleother|preview/i;

/** True for crawlers, link previewers, uptime checks and headless browsers. */
export function isBot(ua: string): boolean {
  if (!ua || ua.length < 20) return true;
  return BOT_RE.test(ua);
}

export function parseDevice(ua: string): Device {
  if (/ipad|tablet|playbook|silk|kindle|(android(?!.*mobile))/i.test(ua)) return "tablet";
  // iPadOS 13+ reports as Macintosh; the tracker can't tell either, so it stays desktop.
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile|windows phone/i.test(ua)) return "mobile";
  return "desktop";
}

export function parseBrowser(ua: string): string {
  // In-app browsers first: they carry a Chrome/Safari token too.
  if (/FBAN|FBAV|FB_IAB|FBIOS/.test(ua)) return "Facebook app";
  if (/Instagram/.test(ua)) return "Instagram app";
  if (/LinkedInApp/.test(ua)) return "LinkedIn app";
  if (/musical_ly|TikTok|BytedanceWebview/.test(ua)) return "TikTok app";
  if (/Snapchat/.test(ua)) return "Snapchat app";
  if (/Twitter|TwitterAndroid/.test(ua)) return "X app";
  if (/WhatsApp/i.test(ua)) return "WhatsApp";
  if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
  if (/OPR\/|Opera|OPiOS/.test(ua)) return "Opera";
  if (/Edg(e|A|iOS)?\//.test(ua)) return "Edge";
  if (/Brave/.test(ua)) return "Brave";
  if (/YaBrowser/.test(ua)) return "Yandex";
  if (/UCBrowser|UCWEB/.test(ua)) return "UC Browser";
  if (/Firefox|FxiOS/.test(ua)) return "Firefox";
  if (/CriOS|Chrome|Chromium/.test(ua)) return "Chrome";
  if (/Safari/.test(ua)) return "Safari";
  return "Other";
}

export function parseOs(ua: string): string {
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Windows/.test(ua)) return "Windows";
  if (/Mac OS X|Macintosh/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Other";
}

export function parseUserAgent(ua: string): { device: Device; browser: string; os: string } {
  return { device: parseDevice(ua), browser: parseBrowser(ua), os: parseOs(ua) };
}
