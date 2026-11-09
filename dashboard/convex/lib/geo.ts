/**
 * Country of a visit. The collector (api/collect.ts) passes the country the
 * hosting edge saw; when there isn't one (local dev, other hosts) we fall back
 * to the browser's time zone, which is right for most of southern Africa.
 */

const TZ_COUNTRY: Record<string, string> = {
  "Africa/Harare": "ZW", "Africa/Johannesburg": "ZA", "Africa/Lusaka": "ZM", "Africa/Maputo": "MZ",
  "Africa/Gaborone": "BW", "Africa/Windhoek": "NA", "Africa/Blantyre": "MW", "Africa/Lubumbashi": "CD",
  "Africa/Kinshasa": "CD", "Africa/Nairobi": "KE", "Africa/Dar_es_Salaam": "TZ", "Africa/Kampala": "UG",
  "Africa/Kigali": "RW", "Africa/Addis_Ababa": "ET", "Africa/Lagos": "NG", "Africa/Accra": "GH",
  "Africa/Cairo": "EG", "Africa/Casablanca": "MA", "Africa/Luanda": "AO", "Africa/Maseru": "LS",
  "Africa/Mbabane": "SZ", "Indian/Mauritius": "MU", "Africa/Abidjan": "CI", "Africa/Dakar": "SN",
  "Africa/Tunis": "TN", "Africa/Algiers": "DZ", "Africa/Khartoum": "SD", "Africa/Mogadishu": "SO",
  "Europe/London": "GB", "Europe/Dublin": "IE", "Europe/Paris": "FR", "Europe/Berlin": "DE",
  "Europe/Amsterdam": "NL", "Europe/Brussels": "BE", "Europe/Madrid": "ES", "Europe/Lisbon": "PT",
  "Europe/Rome": "IT", "Europe/Zurich": "CH", "Europe/Vienna": "AT", "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO", "Europe/Copenhagen": "DK", "Europe/Helsinki": "FI", "Europe/Warsaw": "PL",
  "Europe/Prague": "CZ", "Europe/Athens": "GR", "Europe/Istanbul": "TR", "Europe/Moscow": "RU",
  "Europe/Kyiv": "UA", "Europe/Kiev": "UA", "Europe/Bucharest": "RO", "Europe/Budapest": "HU",
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US", "America/Phoenix": "US",
  "America/Los_Angeles": "US", "America/Anchorage": "US", "America/Detroit": "US", "Pacific/Honolulu": "US",
  "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA", "America/Winnipeg": "CA",
  "America/Halifax": "CA", "America/Mexico_City": "MX", "America/Sao_Paulo": "BR", "America/Bogota": "CO",
  "America/Lima": "PE", "America/Santiago": "CL", "America/Argentina/Buenos_Aires": "AR",
  "Asia/Dubai": "AE", "Asia/Riyadh": "SA", "Asia/Qatar": "QA", "Asia/Kolkata": "IN", "Asia/Calcutta": "IN",
  "Asia/Karachi": "PK", "Asia/Dhaka": "BD", "Asia/Singapore": "SG", "Asia/Kuala_Lumpur": "MY",
  "Asia/Jakarta": "ID", "Asia/Manila": "PH", "Asia/Bangkok": "TH", "Asia/Ho_Chi_Minh": "VN",
  "Asia/Shanghai": "CN", "Asia/Hong_Kong": "HK", "Asia/Taipei": "TW", "Asia/Seoul": "KR",
  "Asia/Tokyo": "JP", "Asia/Jerusalem": "IL", "Asia/Tel_Aviv": "IL",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU", "Australia/Perth": "AU",
  "Australia/Adelaide": "AU", "Pacific/Auckland": "NZ",
};

/** Two-letter country from the edge header, else from the time zone, else undefined. */
export function resolveCountry(edgeCountry: string | undefined, timeZone: string | undefined): string | undefined {
  const c = edgeCountry?.trim().toUpperCase();
  if (c && /^[A-Z]{2}$/.test(c) && c !== "XX" && c !== "T1") return c;
  if (timeZone && TZ_COUNTRY[timeZone]) return TZ_COUNTRY[timeZone];
  return undefined;
}

/** City from the edge header (URL-encoded there), trimmed. */
export function cleanCity(city: string | undefined): string | undefined {
  if (!city) return undefined;
  let s = city;
  try {
    s = decodeURIComponent(city);
  } catch {
    // keep as sent
  }
  s = s.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 60);
  return s || undefined;
}
