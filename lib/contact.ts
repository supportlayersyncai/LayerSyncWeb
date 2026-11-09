/**
 * How people reach LayerSync from this site.
 *
 * Every "Get in touch" button opens the contact dialog (components/contact):
 * the visitor leaves a name and phone number, we save them, and WhatsApp
 * opens with a message that introduces them.
 *
 * Enquiries go to SyncSite (lib/syncsite.ts) when it's configured: the lead
 * inbox in the LayerSync dashboard, with where the visitor came from, and an
 * email/push to the team. They also still go to the SyncEstate backend
 * (Convex /website-enquiry, seen on the SyncEstate Platform page) until that
 * is switched off with VITE_ENQUIRY_ENDPOINT=off, so nothing is lost while
 * moving over. (The longer diagnostic form on /contact goes through
 * lib/submitDiagnostic.ts.)
 */

import { sendLead } from './syncsite';

const env = import.meta.env;

/** LayerSync's WhatsApp number, digits only in international format. */
export const WHATSAPP_NUMBER = (env.VITE_WHATSAPP_NUMBER || '263775187682').replace(/\D/g, '');

/** The number as dialled internationally, e.g. +263775187682. */
export const PHONE_E164 = `+${WHATSAPP_NUMBER}`;

/** The number written for people, e.g. +263 77 518 7682. */
export const PHONE_DISPLAY =
    WHATSAPP_NUMBER.startsWith('263') && WHATSAPP_NUMBER.length === 12
        ? `+263 ${WHATSAPP_NUMBER.slice(3, 5)} ${WHATSAPP_NUMBER.slice(5, 8)} ${WHATSAPP_NUMBER.slice(8)}`
        : PHONE_E164;

/** The SyncEstate Convex deployment's enquiry route. "off" stops sending there. */
export const ENQUIRY_ENDPOINT =
    env.VITE_ENQUIRY_ENDPOINT === 'off' ? '' : env.VITE_ENQUIRY_ENDPOINT || 'https://amiable-fox-488.convex.site/website-enquiry';

/** The SyncEstate product site. */
export const SYNC_ESTATE_URL = env.VITE_SYNC_ESTATE_URL || 'https://syncrm.vercel.app';

export const DEFAULT_MESSAGE = "Hi LayerSync! I'd like to talk about how you can help my business. Can we chat?";

/** A wa.me link that opens a chat with LayerSync with the message typed in. */
export function whatsAppLink(message: string = DEFAULT_MESSAGE): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Normalise a phone number. Local Zimbabwe numbers ("077 123 4567") get +263,
 * the same rule the SyncEstate backend uses. Null when it can't be a number.
 */
export function toE164(phone: string, defaultCountry = '263'): string | null {
    const digits = phone.replace(/[^\d+]/g, '');
    let out: string | null;
    if (digits.startsWith('+')) out = digits;
    else if (digits.startsWith('00')) out = `+${digits.slice(2)}`;
    else if (digits.startsWith('0') && digits.length >= 9) out = `+${defaultCountry}${digits.slice(1)}`;
    else if (digits.startsWith(defaultCountry)) out = `+${digits}`;
    else out = digits.length >= 9 ? `+${defaultCountry}${digits}` : null;
    if (!out) return null;
    const rest = out.slice(1);
    return /^\d{9,15}$/.test(rest) ? out : null;
}

/** The prefilled WhatsApp message once a visitor has told us who they are. */
export function enquiryMessage({ name, phone, interest }: { name: string; phone: string; interest?: string }): string {
    const intro = `Hi LayerSync! I'm ${name.trim()} (${phone.trim()}).`;
    const ask = interest ? `I'd like to talk about ${interest}.` : "I'd like to talk about how you can help my business.";
    return `${intro} ${ask} Can we chat?`;
}

export type Enquiry = {
    name: string;
    phone: string;
    interest?: string;
    cta?: string;
    page?: string;
};

/**
 * Save an enquiry. Sent as text/plain with keepalive so the browser skips the
 * CORS preflight and the request survives the switch to WhatsApp. Never
 * throws: WhatsApp opens whether or not this succeeds.
 */
export async function saveEnquiry(e: Enquiry): Promise<boolean> {
    const toSyncSite = sendLead('get-in-touch', {
        name: e.name,
        phone: e.phone,
        interest: e.interest,
        button: e.cta,
    }).then((r) => r.ok);
    const toLegacy = ENQUIRY_ENDPOINT
        ? fetch(ENQUIRY_ENDPOINT, {
              method: 'POST',
              mode: 'cors',
              keepalive: true,
              headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
              body: JSON.stringify({ ...e, site: 'layersync' }),
          })
              .then((res) => res.ok)
              .catch(() => false)
        : Promise.resolve(false);
    const [a, b] = await Promise.all([toSyncSite, toLegacy]);
    return a || b;
}
