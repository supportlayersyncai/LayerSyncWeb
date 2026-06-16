/**
 * Diagnostic request submission — SINGLE INTEGRATION POINT.
 * ---------------------------------------------------------------------------
 * This is the one place to wire the "Book a diagnostic" form to a backend.
 *
 * STATUS: not yet connected to a backend. A new Supabase project under the
 * LayerSync organisation (NOT KurimaSense) will host submissions; once that
 * project exists, set the two env vars below and flip USE_SUPABASE to true.
 * No other file needs to change.
 *
 *   VITE_SUPABASE_URL=...       (LayerSync project URL)
 *   VITE_SUPABASE_ANON_KEY=...  (publishable/anon key)
 *
 * Suggested target table:
 *   create table diagnostic_requests (
 *     id uuid primary key default gen_random_uuid(),
 *     created_at timestamptz default now(),
 *     name text, business text, role text, email text,
 *     whatsapp text, blind_spot text, source text default 'website'
 *   );
 */

export interface DiagnosticRequest {
  name: string;
  business: string;
  role?: string;
  email: string;
  whatsapp?: string;
  /** "What can't you see / what keeps breaking?" — the core qualifying field. */
  blindSpot: string;
}

export interface SubmitResult {
  ok: boolean;
  message: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export async function submitDiagnostic(req: DiagnosticRequest): Promise<SubmitResult> {
  // --- Backend connected: POST to Supabase REST endpoint -------------------
  if (USE_SUPABASE) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/diagnostic_requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY as string,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          name: req.name,
          business: req.business,
          role: req.role ?? null,
          email: req.email,
          whatsapp: req.whatsapp ?? null,
          blind_spot: req.blindSpot,
          source: 'website',
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      return { ok: true, message: "Thanks — we'll be in touch within one business day." };
    } catch (err) {
      return {
        ok: false,
        message: 'Something went wrong sending that. Please email hello@layersync.ai instead.',
      };
    }
  }

  // --- Backend NOT connected yet: graceful fallback ------------------------
  // Logs locally so the form is fully functional in the UI, and tells the
  // user how to reach us until the Supabase project is live.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[diagnostic] submission (no backend wired yet):', req);
  }
  return {
    ok: true,
    message:
      "Thanks. Our intake backend is being finalised — to reach us right now, email hello@layersync.ai and we'll set up your diagnostic.",
  };
}
