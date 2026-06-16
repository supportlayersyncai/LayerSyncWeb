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
- [ ] **og-image.png regenerated** — still bakes in "SYNCHRONIZE INTELLIGENCE" (binary asset; see below).
- [ ] **Deep voice scrub of kept legacy internals** (WebDev/Academy section components, and the now-unused SMB/Enterprise/Pricing/Hero/RETestimonials components) — primary CTAs fixed; inner copy + any fabricated metrics/portfolio/testimonials inside those sections not yet rewritten.

## Flagged / remaining (need Kev)
1. **Supabase** — create the new project under the **LayerSync** org (not KurimaSense), then set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` and create the `diagnostic_requests` table (schema in `lib/submitDiagnostic.ts`). No code change needed beyond env + table.
2. **og-image.png** — regenerate to drop the old wordmark/tagline.
3. **Real proof** — supply case studies, product UI screenshots, testimonials, client logos, and the four partners' names/bios to replace placeholders on `/work`, `/about`, `/syncrm`, `/solutions/real-estate`.
4. **Legacy verticals' internal copy** — WebDev still contains agency-style sections (Why Us, Services, Tech Stack, portfolio Glow/Solar/Savanna) and Academy contains the House of Stone case study + stats; confirm/keep/rewrite. The unused SMB/Enterprise/Pricing/RETestimonials/Hero component files can be deleted once you're sure nothing references them.
5. **hello@layersync.ai** — confirm this is the right inbound address (used in footer + form fallback).

## Notes
- The live app is a Vite SPA using the Tailwind **CDN** with a brand palette remap (orange `#D36135` / green `#7FB069`). New work uses the explicit `brand-orange`/`brand-green` tokens.
- The legacy Next.js `app/**` tree remains dead (not deployed) and was left untouched.
