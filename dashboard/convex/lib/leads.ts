/**
 * Cleaning what a visitor typed into a website form. Pure, so the rules are
 * unit-tested (convex/tests/leads.test.ts).
 *
 * Any form on any site can send any fields. We keep every field (trimmed and
 * capped) for the record, and pick out name / email / phone / company /
 * message by their usual names so the CRM has something to work with.
 */

export const LEAD_LIMITS = {
  fields: 30,
  key: 60,
  value: 2000,
  message: 5000,
  totalChars: 20000,
  name: 120,
  form: 60,
} as const;

export type LeadField = { key: string; value: string };

export type CleanLead = {
  form: string;
  name?: string;
  email?: string;
  phone?: string;
  phoneDigits?: string;
  company?: string;
  message?: string;
  fields: LeadField[];
  spam: boolean;
  spamReason?: string;
};

const ALIASES: Record<"name" | "firstName" | "lastName" | "email" | "phone" | "company" | "message", string[]> = {
  name: ["name", "fullname", "yourname", "contactname", "clientname"],
  firstName: ["firstname", "fname", "givenname"],
  lastName: ["lastname", "lname", "surname", "familyname"],
  email: ["email", "emailaddress", "mail", "youremail", "workemail"],
  phone: ["phone", "phonenumber", "tel", "telephone", "mobile", "mobilenumber", "cell", "cellphone", "whatsapp", "whatsappnumber", "contactnumber", "number"],
  company: ["company", "companyname", "business", "businessname", "organisation", "organization", "org", "brokerage", "agency"],
  message: ["message", "comments", "comment", "enquiry", "inquiry", "details", "notes", "question", "description", "blindspot", "howcanwehelp", "project", "requirements"],
};

/** Fields we never store, whatever a form sends. */
const SENSITIVE_RE = /pass(word)?|pwd|^pin$|otp|cvv|cvc|card|iban|ssn|nationalid|secret|token|captcha|recaptcha|turnstile|hcaptcha|csrf/;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,63}$/i;
const URL_RE = /\bhttps?:\/\/|\bwww\.[a-z0-9-]+\.[a-z]/gi;
const HAS_URL_RE = /\bhttps?:\/\/|\bwww\.[a-z0-9-]+\.[a-z]/i;

const keyOf = (k: string) => k.toLowerCase().replace(/[^a-z0-9]/g, "");

function tidy(value: unknown, max: number): string | undefined {
  if (value === null || value === undefined) return undefined;
  const raw = typeof value === "string" ? value : typeof value === "number" || typeof value === "boolean" ? String(value) : "";
  const s = raw
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
  return s || undefined;
}

export function normalizeEmail(input: string | undefined): string | undefined {
  const s = input?.trim().toLowerCase();
  if (!s || s.length > 254 || !EMAIL_RE.test(s)) return undefined;
  return s;
}

/**
 * International form of a phone number. Local numbers ("077 123 4567") get
 * the site's country code (Zimbabwe, 263, by default). Undefined when it
 * can't be a phone number.
 */
export function normalizePhone(input: string | undefined, defaultCountryCode = "263"): string | undefined {
  if (!input) return undefined;
  const digits = input.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
  let out: string | undefined;
  if (digits.startsWith("+")) out = digits;
  else if (digits.startsWith("00")) out = `+${digits.slice(2)}`;
  else if (digits.startsWith("0") && digits.length >= 9) out = `+${defaultCountryCode}${digits.slice(1)}`;
  else if (digits.startsWith(defaultCountryCode) && digits.length > defaultCountryCode.length + 7) out = `+${digits}`;
  else if (digits.length >= 9) out = `+${defaultCountryCode}${digits}`;
  if (!out) return undefined;
  return /^\+[1-9]\d{8,14}$/.test(out) ? out : undefined;
}

export type LeadInput = {
  form?: unknown;
  fields?: unknown;
  /** The honeypot field. Real people never see it, so anything here is a bot. */
  hp?: unknown;
  /** Milliseconds between the page loading and the form being sent. */
  elapsedMs?: unknown;
};

/**
 * Validate and normalise a submission. Returns an error string only for
 * things a real person should fix (no way to reach them); spam is accepted
 * and flagged, so bots get no signal.
 */
export function cleanLead(
  input: LeadInput,
  opts: { defaultCountryCode?: string } = {},
): { ok: true; value: CleanLead } | { ok: false; error: string } {
  const form = tidy(input.form, LEAD_LIMITS.form)?.toLowerCase().replace(/[^a-z0-9 _-]/g, "") || "contact";

  // Accept { key: value } or [{ key, value }].
  const pairs: Array<[string, unknown]> = [];
  if (Array.isArray(input.fields)) {
    for (const f of input.fields) {
      if (f && typeof f === "object" && "key" in f) pairs.push([String((f as { key: unknown }).key), (f as { value?: unknown }).value]);
    }
  } else if (input.fields && typeof input.fields === "object") {
    pairs.push(...Object.entries(input.fields as Record<string, unknown>));
  }

  const fields: LeadField[] = [];
  const seen = new Set<string>();
  let total = 0;
  for (const [rawKey, rawValue] of pairs) {
    if (fields.length >= LEAD_LIMITS.fields) break;
    const key = tidy(rawKey, LEAD_LIMITS.key);
    if (!key || key.startsWith("_") || key.startsWith("$")) continue;
    const k = keyOf(key);
    if (!k || SENSITIVE_RE.test(k) || seen.has(k)) continue;
    const isMessage = ALIASES.message.includes(k);
    const value = tidy(rawValue, isMessage ? LEAD_LIMITS.message : LEAD_LIMITS.value);
    if (!value) continue;
    total += key.length + value.length;
    if (total > LEAD_LIMITS.totalChars) break;
    seen.add(k);
    fields.push({ key, value });
  }

  const pick = (names: string[]) => fields.find((f) => names.includes(keyOf(f.key)))?.value;

  let name = pick(ALIASES.name);
  if (!name) {
    const first = pick(ALIASES.firstName);
    const last = pick(ALIASES.lastName);
    name = [first, last].filter(Boolean).join(" ") || undefined;
  }
  name = tidy(name, LEAD_LIMITS.name);

  const rawEmail = pick(ALIASES.email);
  const email = normalizeEmail(rawEmail);
  const rawPhone = pick(ALIASES.phone);
  const phone = normalizePhone(rawPhone, opts.defaultCountryCode ?? "263");
  const company = tidy(pick(ALIASES.company), 120);
  const message = pick(ALIASES.message);

  if (!email && !phone) {
    if (rawEmail && !rawPhone) return { ok: false, error: "Please enter a valid email address." };
    if (rawPhone && !rawEmail) return { ok: false, error: "Please enter a phone number we can reach you on." };
    return { ok: false, error: "Please include an email address or a phone number so we can reply." };
  }

  // Spam signals. Flagged rows are kept (visible under "Spam") but never notify.
  let spamReason: string | undefined;
  const hp = typeof input.hp === "string" ? input.hp.trim() : "";
  const elapsed = typeof input.elapsedMs === "number" && Number.isFinite(input.elapsedMs) ? input.elapsedMs : undefined;
  if (hp) spamReason = "Hidden field was filled in";
  else if (elapsed !== undefined && elapsed >= 0 && elapsed < 1200) spamReason = "Sent too fast to be typed";
  else if ((message?.match(URL_RE)?.length ?? 0) > 3) spamReason = "Too many links";
  else if (name && HAS_URL_RE.test(name)) spamReason = "Link in the name";

  return {
    ok: true,
    value: {
      form,
      name,
      email,
      phone,
      phoneDigits: phone?.slice(1),
      company,
      message,
      fields,
      spam: spamReason !== undefined,
      spamReason,
    },
  };
}

/** What the CRM search index looks at. */
export function contactSearchText(c: { name?: string; email?: string; phone?: string; company?: string }): string {
  return [c.name, c.email, c.phone, c.phone?.replace(/^\+/, ""), c.company].filter(Boolean).join(" ").toLowerCase();
}

/** A display name for a contact with no name. */
export function displayName(c: { name?: string; email?: string; phone?: string }): string {
  return c.name || c.email?.split("@")[0] || c.phone || "Unknown";
}
