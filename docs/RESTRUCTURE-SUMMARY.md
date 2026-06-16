# LayerSync — Restructure Summary (Phase C)

Branch: `claude/website-rebrand-redesign-0zrc95`. This summarizes the rebrand/restructure executed against the Phase A inventory and Phase B audit, and lists what remains (flagged, not silently dropped).

## What changed

### New information architecture
| Route | Status |
|---|---|
| `/` | Reworked — builder positioning, Diagnose/Build/Own, SynCRM flagship teaser |
| `/syncrm` | **New** — flagship product page ("Stop running blind") |
| `/what-we-build` | **New** — cash-engine capability page (absorbs SMB + Enterprise) |
| `/work` | **New** — proof (flagged placeholders) |
| `/about` | **New** — four partners, the rare combination |
| `/contact` | **New** — working "Book a diagnostic" form |
| `/solutions/real-estate` | Reworked — standalone services page linking to SynCRM |
| `/solutions/web-dev` | Kept (revenue) — primary CTAs routed to `/contact` |
| `/solutions/academy` | Kept route, **removed from primary nav**; hero CTA → `/contact` |
| `/solutions/smb` | **Redirects** → `/what-we-build` |
| `/solutions/enterprise` | **Redirects** → `/what-we-build` |

### Chrome & metadata
- **Navbar** rebuilt: Home · SynCRM · What We Build · Work · About · **Book a diagnostic**. Solutions-dropdown sprawl removed.
- **Footer** rebuilt around the real IA; dead `#` links removed; real contact (`hello@layersync.ai`, Harare).
- **Metadata** (`index.html`, `metadata.json`) scrubbed of "AI automation agency" and "Synchronize/Synchronized Intelligence"; new title/description.

### New supporting code
- `components/site/Primitives.tsx` — shared `CTAButton`, `GhostLink`, `Eyebrow`, `SectionHeader`, `ProofPlaceholder`.
- `lib/submitDiagnostic.ts` — **single backend integration point** for the diagnostic form.
- `vite-env.d.ts` — typed env vars.
- `docs/DESIGN-TOKENS.md` — the visual contract.

### Voice & proof
- All new pages + reworked Home/Real Estate written to the brand voice guardrails (no "ecosystem", "guaranteed ROI", "next-generation", fabricated metrics).
- All unverified testimonials/metrics/logos on the new + reworked pages replaced with **flagged `ProofPlaceholder`s** (`[CASE STUDY — Kev to supply]`, etc.). Nothing fabricated ships on those pages.

## Acceptance checklist (spec §7)
- [x] New IA routes resolve; SMB/Enterprise redirect.
- [x] Nav + footer reflect the new IA; single diagnostic CTA.
- [x] Metadata strings scrubbed (HTML + metadata.json).
- [x] Contact form functional (graceful fallback until Supabase wired).
- [x] No fabricated proof on new/reworked pages — placeholders instead.
- [x] Production build green (`npm run build`).
- [x] **Deep proof scrub of live components** — see §"Deep dive".
- [ ] **og-image.png regenerated** — generation script ready (`npm run generate:assets`); needs the OpenAI key (see §"Asset generation").

## Deep dive — proof scrub of live components
Fabricated proof was removed from every component that ships on a live route, and replaced with honest copy or flagged placeholders (we have **no real proof** to show yet):
- `real-estate/BeforeAfter` — dropped fabricated "98% cost reduction / 40% faster" stats → honest qualitative benefits.
- `web-dev/LaptopCarousel` — removed fake client projects ("Glow Energy / Solar Estimator / Savanna Energy"); relabelled as **design concepts** with real work pointed to `/work`; removed dead external-link button.
- `academy/WhoIsItFor` — removed the "House of Stone Properties" case study and "Trusted by…" badge → `ProofPlaceholder`; CTA now routes to `/contact`.
- WebDev & Academy primary CTAs routed to `/contact` (no more dead `#` anchors on live routes; `#process` verified valid).

**Deleted (25 files)** — orphaned by this refactor and holding the cut/fabricated content: `pages/SMB.tsx`, `pages/Enterprise.tsx`, `components/smb/*`, `components/enterprise/*`, `components/home/{Pricing,FAQ,ROITable}.tsx`, `components/real-estate/{Hero,AgentPipeline,ChatbotViz,RETestimonials}.tsx`. Nothing on a live route imported them; build stays green.

## Asset generation (OpenAI)
- Script: `scripts/generate-assets.mjs` → `npm run generate:assets`. Currently generates `public/og-image.png` (gpt-image-1).
- **Where the key goes:** put `OPENAI_API_KEY=sk-...` in a **gitignored `.env`** (see `.env.example`) or export it in the environment. **No `VITE_` prefix** — it's read server-side only and must never reach the client bundle.
- Scope is deliberately limited to brand/background art (og-image). It does **not** generate "proof" (fake screenshots/logos/headshots) — those must be real.
- Quality: gpt-image-1 is good enough for an og-image / abstract brand art; it is not reliable for the existing animal mascots or product UI.

## Flagged / remaining (need Kev)
1. **Supabase** — create the new project under the **LayerSync** org (not KurimaSense), then set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` and create the `diagnostic_requests` table (schema in `lib/submitDiagnostic.ts`). No code change needed beyond env + table.
2. **OpenAI key** — provide it (per §"Asset generation") so og-image.png can be regenerated, replacing the old "SYNCHRONIZE INTELLIGENCE" art.
3. **Real proof** — there is none yet; case studies, product UI, testimonials, client logos, and the four partners' names/bios will replace placeholders on `/work`, `/about`, `/syncrm`, `/solutions/real-estate`, `/solutions/academy`, `/solutions/web-dev`.
4. **Legacy Next `app/**` scaffold** — still dead (not deployed) and left untouched, along with the legacy `*-section.tsx`, `header.tsx`, `chat-widget.tsx`, `LayerSyncLogo.tsx` files it references (these still contain old fabricated marketing but do not ship). Say the word and I'll remove the whole dead scaffold.

## Notes
- Email is **support@layersyncai.com** (footer + form fallback).
- The live app is a Vite SPA using the Tailwind **CDN** with a brand palette remap (orange `#D36135` / green `#7FB069`). New work uses the explicit `brand-orange`/`brand-green` tokens.
