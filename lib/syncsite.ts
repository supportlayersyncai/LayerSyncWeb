/**
 * SyncSite: LayerSync's own website analytics and lead inbox (the dashboard
 * in /dashboard, the same product we give clients).
 *
 * When VITE_SYNCSITE_URL and VITE_SYNCSITE_KEY are set, the tracker
 * (<url>/s.js) is loaded once: it counts visits without cookies, follows
 * React Router page changes on its own, and counts taps on WhatsApp, phone
 * and download links. Forms send leads through sendLead() below, which lands
 * them in the dashboard and notifies the team.
 *
 * With either variable unset, nothing loads and sendLead() does nothing, so
 * the site works the same as before.
 */

const env = import.meta.env;
export const SYNCSITE_URL = (env.VITE_SYNCSITE_URL || '').replace(/\/+$/, '');
export const SYNCSITE_KEY = env.VITE_SYNCSITE_KEY || '';
export const syncSiteEnabled = Boolean(SYNCSITE_URL && SYNCSITE_KEY);

type LeadResult = { ok: boolean; error?: string };
type SyncSiteApi = {
  v: number;
  lead(data: { form: string; fields: Record<string, string | undefined> }): Promise<LeadResult>;
  track(name: string, props?: Record<string, string>): void;
};

declare global {
  interface Window {
    syncsite?: SyncSiteApi | { q?: unknown[][] };
  }
}

const loadedAt = Date.now();

/** Add the tracker to the page. Safe to call more than once. */
export function loadSyncSite(): void {
  if (!syncSiteEnabled || typeof document === 'undefined') return;
  if (document.querySelector('script[data-syncsite]')) return;
  const s = document.createElement('script');
  s.src = `${SYNCSITE_URL}/s.js`;
  s.defer = true;
  s.setAttribute('data-site', SYNCSITE_KEY);
  s.setAttribute('data-syncsite', '');
  document.head.appendChild(s);
}

/**
 * Send a form to SyncSite. Uses the tracker when it's loaded (so the lead is
 * tied to the visit: source, pages read). If an ad blocker or a slow network
 * kept the tracker away, posts directly instead. Never throws.
 */
export async function sendLead(form: string, fields: Record<string, string | undefined>): Promise<LeadResult> {
  if (!syncSiteEnabled) return { ok: false, error: 'SyncSite is not configured' };
  const clean = Object.fromEntries(Object.entries(fields).filter(([, v]) => v && v.trim())) as Record<string, string>;
  const api = window.syncsite as SyncSiteApi | undefined;
  try {
    if (api?.v) return await api.lead({ form, fields: clean });
    const res = await fetch(`${SYNCSITE_URL}/api/lead`, {
      method: 'POST',
      keepalive: true,
      credentials: 'omit',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({
        k: SYNCSITE_KEY,
        lead: { form, fields: clean, page: location.pathname, hp: '', elapsedMs: Date.now() - loadedAt },
      }),
    });
    const json = (await res.json().catch(() => ({}))) as LeadResult;
    return res.ok ? { ok: true } : { ok: false, error: json.error };
  } catch {
    return { ok: false };
  }
}
