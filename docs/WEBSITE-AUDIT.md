# LayerSync — Website Audit & Diff (Phase B)

> Diffs the current site (`docs/WEBSITE-INVENTORY.md`) against the target spec (Brand Realign / Option C). Every current page+section is classified **KEEP / REWORK / CUT / FOLD-INTO**; new work is listed as **NEW**. Anything that may book revenue or carries heritage is **🚩 FLAGGED for your decision — not proposed for silent deletion.**
>
> **Decisions locked in from review:** (1) all existing proof → flagged placeholders; (2) SynCRM gets its own **`/syncrm`** route; the Real Estate page **stands alone and links to** SynCRM.

## 1. Target IA → routes

| Target page | Route | Disposition | Built from |
|---|---|---|---|
| Home | `/` | **REWORK** | current Home, re-positioned |
| **SynCRM** (flagship) | **`/syncrm`** | **NEW** | narrative arc + folded real-estate "how it works" |
| Real Estate (standalone) | `/solutions/real-estate` | **REWORK** | current RE page, slimmed, links to `/syncrm` |
| What We Build (cash engine) | `/what-we-build` | **NEW** | capability statement absorbing SMB/WebDev/Enterprise |
| Work (proof) | `/work` | **NEW** | placeholder case-study cards |
| About | `/about` | **NEW** | four partners, operator story |
| Contact / Book a Diagnostic | `/contact` | **NEW** | net-new form (none exists today) |

**Primary nav (REWORK):** Home · SynCRM · What We Build · Work · About · **Book a diagnostic** (button). Real Estate, Academy, SMB, Web Dev, Enterprise **leave the primary nav** (linked contextually instead) — this removes the five-vertical sprawl.

## 2. Home (`/`) — REWORK

| Section | Disposition | Rationale |
|---|---|---|
| Hero — 6 "Synchronized Intelligence" scroll beats | **REWORK** | New hero "We build the systems businesses run on" + subhead naming SynCRM. Kill the tagline; collapse the 6-vertical beat reel. |
| Solutions hub — "Five Verticals. One Partner." (5 cards) | **CUT** | This *is* the agency sprawl being removed. Replaced by: How-we-work (Diagnose→Build→Own) + SynCRM flagship teaser + What-We-Build teaser. |
| Why LayerSync (4 value props) | **REWORK** | Strong; keep the bones, rewrite to voice (drop "AI ecosystems / compound your competitive advantage"). |
| Pricing — "Our Systems" (3 Engines) | **🚩 CUT-pending** | Packages directly contradict "we don't sell packages / diagnostic-first." Recommend removing from site. Flagged in §6. |
| ROI table (5 cost rows) | **CUT** | Fabricated metrics + agency price-comparison register; off-positioning. |
| FAQ (ZiG / trial / impl time) | **FOLD-INTO** | Move useful Q&A to relevant pages (e.g. SynCRM / Contact); drop "free trial / à la carte" framing. |
| Final CTA — "Ready to Sync? / Free AI Audit" | **REWORK** | → "Book a diagnostic." |

## 3. Real Estate (`/solutions/real-estate`) — REWORK (stands alone, links to SynCRM)

| Section | Disposition | Rationale |
|---|---|---|
| Hero "From First Lead to Closed Deal" | **FOLD-INTO `/syncrm`** | This is the SynCRM hero/story; the standalone RE page gets a lighter hero that points to SynCRM. |
| "How SynCRM Works" (6-step pipeline) | **FOLD-INTO `/syncrm`** | Core product-mechanism content belongs on the flagship page. |
| AI Virtual Staging / Gallery / Listing Copy | **REWORK / KEEP** | Real-estate-specific capability; can stay on RE page as supporting demos (rewrite metrics → placeholders). |
| Lead-Qual Chatbot viz | **FOLD-INTO `/syncrm`** | Supports the "leads land in SynCRM" mechanism. |
| Integrations ("Plugs Into Everything") | **KEEP** | Useful; trim to real integrations. |
| Testimonials (Oasis, Pam Golding, Venture) | **CUT → placeholder** | Unverified proof → `[CASE STUDY — Kev to supply]`. |
| Final CTA "Founding Partner Access" | **REWORK** | → "Book a brokerage diagnostic." |

## 4. SMB (`/solutions/smb`) — FOLD-INTO `/what-we-build`

> **Decision:** Fold into What We Build. Route kept as a redirect to `/what-we-build`.

| Section | Disposition | Rationale |
|---|---|---|
| Whole page | **FOLD-INTO What We Build** | SMB automation = the cash-engine capability, not a separate brand. Route → redirect. |
| Pain Points / AI Workforce (7 agents) | **FOLD-INTO** | Condense into one capability statement; do not recreate as a service menu. |
| ROI Calculator / Testimonials / Stats | **CUT → placeholder** | Fabricated figures; off-positioning. |

## 5. Web Dev (`/solutions/web-dev`) — ✅ KEEP (books real revenue)

> **Decision:** Kev confirmed Web Dev books real revenue → it **keeps its own page/route** (not folded). Reworked to the new voice, kept in nav under "What We Build" or linked directly.

| Section | Disposition | Rationale |
|---|---|---|
| Whole page | **KEEP / REWORK** | Active revenue line — stays as a standalone offer page, voice-scrubbed. |
| Problem / Transformation / Why Us / Services / Process | **REWORK / condense** | Keep the credible structure; cut fabricated metrics, align to voice. |
| Portfolio (Glow/Solar/Savanna) | **REWORK → confirm/placeholder** | Keep on page and/or surface on `/work`; confirm real or mark placeholder. |
| Tech Stack / FAQ | **REWORK / trim** | Keep but trim to essentials. |

## 6. Enterprise (`/solutions/enterprise`) — FOLD-INTO `/what-we-build`

> **Decision:** Fold into What We Build. Route kept as a redirect to `/what-we-build`.

| Section | Disposition | Rationale |
|---|---|---|
| Whole page | **FOLD-INTO What We Build** | Enterprise custom systems = cash engine at the top end. Route → redirect. |
| Dept transformation / Architecture / Capabilities | **CUT / condense** | Fold the credible "custom systems, security, integration" points into What We Build. |
| Security & Compliance | **KEEP (condensed)** | Genuine trust content; reusable on What We Build / About. |
| ROI calculator / Roadmap | **CUT** | Calculator metrics fabricated; roadmap is service-menu detail. |

## 7. Academy (`/solutions/academy`) — 🚩 FLAG (heritage/revenue)

| Section | Disposition | Rationale |
|---|---|---|
| Whole page | **🚩 FLAG — keep, de-emphasize** | Per spec §4: do **not** delete. Recommend removing from primary nav and not featuring on Home, while keeping the route live. Awaiting your call on whether it stays linked at all. |

## 8. New pages — NEW

| Page | Key sections to build | Notes |
|---|---|---|
| **`/syncrm`** | Hero "Stop running blind" → 5-beat narrative (world → quiet problem → cost → shift → proof) → How it works (leads-drive-adoption) → For owners / For agents → Proof `[placeholder]` → CTA "Book a brokerage diagnostic" | Show real product UI → `[PRODUCT UI — Kev to supply]`. Narrative scroll. |
| **`/what-we-build`** | Hero "Custom systems for businesses that have outgrown spreadsheets and WhatsApp" → one capability statement (no service menu) → diagnostic-first → CTA | Absorbs SMB + Web Dev + Enterprise. |
| **`/work`** | Selected-build proof cards | All `[CASE STUDY — Kev to supply]`; no invented logos/metrics. |
| **`/about`** | Four partners, the rare combination, operator-led story | Trust, not biography filler. |
| **`/contact`** | "Tell us about your operation…" + short form (name, business, what they can't see/do) | **Net-new** — no form exists today (see inventory §F). Needs a submission target (email/Supabase/Formspree) — decision needed. |

## 9. Global — chrome, metadata, design

| Item | Disposition | Rationale |
|---|---|---|
| Navbar | **REWORK** | New IA; lean nav; single "Book a diagnostic" CTA. |
| Footer | **REWORK** | Remove vertical sprawl + dead `#` links (About/Team/Careers/Blog…); rebuild around real IA. |
| `<title>` / meta / OG / Twitter | **REWORK** | Kill every "AI automation agency" + "Synchronize/Synchronized Intelligence" string. |
| `og-image.png` | **REWORK** | Regenerate — current PNG bakes in "SYNCHRONIZE INTELLIGENCE". |
| `metadata.json`, legacy `app/**` meta | **REWORK / ignore** | Update for coherence; `app/**` is dead. |
| Design tokens | **NEW (`docs/DESIGN-TOKENS.md`)** | No real token file exists (CDN-injected palette only). Propose small token set before styling, per spec §5. |
| Voice scrub | **REWORK (all copy)** | Run every retained line against the never-say list (§4). |

## 10. 🚩 Open decisions needed before Phase C

1. **Web Dev = revenue → KEEPS its own page.** SMB + Enterprise **FOLD** into *What We Build* (routes become redirects).
2. **Academy:** keep route live, **drop from primary nav** (footer link optional).
3. **Pricing "Engines": REMOVE** from the site (contradicts "we don't sell packages").
4. **Video editing / "AI Video Marketing": REMOVE** from copy (pricing tier + ROI "Video Production").
5. **Contact form backend:** new project in the **LayerSync** Supabase org (not KurimaSense). Approval path being sorted separately — `/contact` is built now with a single clearly-marked submit integration point to wire in later.
6. **Real Estate ↔ SynCRM split: CONFIRMED** — `/syncrm` owns the product narrative + how-it-works; `/solutions/real-estate` is a lighter standalone page linking to SynCRM.

## 11. Final route map (Phase C)

| Route | Action |
|---|---|
| `/` | REWORK (Home) |
| `/syncrm` | NEW (flagship) |
| `/what-we-build` | NEW (absorbs SMB + Enterprise) |
| `/work` | NEW |
| `/about` | NEW |
| `/contact` | NEW (form, Supabase wired later) |
| `/solutions/real-estate` | REWORK (standalone, links to SynCRM) |
| `/solutions/web-dev` | KEEP / REWORK (revenue) |
| `/solutions/academy` | KEEP route, drop from primary nav |
| `/solutions/smb` | REDIRECT → `/what-we-build` |
| `/solutions/enterprise` | REDIRECT → `/what-we-build` |

**Primary nav:** Home · SynCRM · What We Build · Work · About · **Book a diagnostic**

---

*End of Phase B. Decisions resolved; proceeding to Phase C on branch `claude/website-rebrand-redesign-0zrc95` (per standing branch instructions). Design tokens proposed first, then page-by-page.*
