# LayerSync — Website Inventory (Phase A)

> Snapshot of the **current** live site, produced before any restructure work. No site files were changed to create this. Source of truth for the Phase B audit/diff against the `feat/brand-realign` target spec.

## A. How the site is actually built (important context)

- **Live app:** a **Vite + React Router SPA**. Entry: `index.html → index.tsx → App.tsx → MainLayout → pages/*`. Vercel builds with Vite (`outputDirectory: dist`).
- **Tailwind:** loaded at runtime from the **CDN** (`<script src="https://cdn.tailwindcss.com">` in `index.html`), with a brand palette config injected inline. `tailwind.config.ts` / `styles/globals.css` are **not** loaded by the live app (kept in sync for coherence only).
- **Dead/legacy code (NOT deployed):** the Next.js `app/` directory (`app/layout.tsx`, `app/page.tsx`, `app/components/*`), `components/header.tsx`, and the standalone section components `about-section.tsx`, `services-section.tsx`, `contact-section.tsx`, `pricing-section.tsx`, `hero-section.tsx`, `lead-magnet-section.tsx`, `consultation-banner.tsx`, `chat-widget.tsx`. These are reachable only via the unused Next entry. **Flagged so we don't waste effort restyling them or mistake them for live pages.**

## B. Routes / pages (live)

| Route | Page file | Job today | Primary CTA today |
|---|---|---|---|
| `/` | `pages/Home.tsx` | Scrollytelling hub for 5 "verticals" | "Request Your Free AI Audit" (`/#apply`) |
| `/solutions/real-estate` | `pages/RealEstate.tsx` | SynCRM real-estate product | "Apply for Founding Partner Access" |
| `/solutions/smb` | `pages/SMB.tsx` | SMB automation agents | "Request Free Workflow Audit" |
| `/solutions/web-dev` | `pages/WebDev.tsx` | Web design/build service | "Request a Website Audit" / "Book a Free Consultation" |
| `/solutions/academy` | `pages/Academy.tsx` | Sync Academy AI training | "Book a Training Audit" |
| `/solutions/enterprise` | `pages/Enterprise.tsx` | Enterprise private AI | "Request / Schedule Enterprise Assessment" |

There is **no** dedicated `/about`, `/work`, `/contact`, or standalone `/syncrm` route. CTAs point to the `#apply` / `#pricing` anchors or are non-functional buttons (see §F).

## C. Global chrome

**Navbar (`components/Navbar.tsx`)** — Logo mark + "LayerSync" wordmark; **Solutions** dropdown: `Real Estate AI`, `SMB Automation`, `Sync Academy`, `Web Development`, `Enterprise AI`; section links `Why Us` (`#why-layersync`), `Systems` (`#pricing`), `FAQ` (`#faq`); dark-mode toggle; CTA **"Book a Call"** → `/#apply`.

**Footer (`components/Footer.tsx`)** — Columns: **Solutions** (SynCRM, SMB Automation, Sync Academy, Web Development, Enterprise AI), **Company** (About, Team, Careers, Press — all `href="#"`), **Resources** (Blog, Case Studies, AI Audits — all `#`), **Contact** (WhatsApp, Email, Book a Call, "Office: Harare" — all `#` except Book a Call). Copyright: "© 2026 LAYER SYNC TECHNOLOGIES (PRIVATE) LIMITED".

## D. Metadata / SEO (current — all needs realignment per spec §4)

| Source | Field | Current value |
|---|---|---|
| `index.html` | `<title>` | **LayerSync AI \| Synchronize Intelligence** |
| `index.html` | meta description | "LayerSync AI — **next-generation AI automation agency. Synchronize Intelligence.**" |
| `index.html` | OG/Twitter title+desc | same agency / "Synchronize Intelligence" framing |
| `index.html` | OG/Twitter image | `/og-image.png` — **the rendered PNG bakes in the wordmark "SYNCHRONIZE INTELLIGENCE"** (must be regenerated) |
| `metadata.json` | name / description | "LayerSync AI - Synchronized Intelligence" / "premium scrollytelling landing page for a **next-generation AI automation agency**…" |
| `app/layout.tsx` (legacy) | title / description | "LayerSync AI \| Synchronize Intelligence" / "next-generation AI automation agency" |

**Every "AI automation agency" / "Synchronize / Synchronized Intelligence" string above is on the §4 cut list.**

## E. Reusable component inventory (live)

- **Layout/shared:** `MainLayout.tsx`, `Navbar.tsx`, `Footer.tsx`, `Logo.tsx` (brand mark img), `ScrollCanvas.tsx`, `TextBeat.tsx`, `icons/BrandIcons.tsx` (custom icon set), `theme-provider.tsx`.
- **Home:** `home/Pricing.tsx`, `home/FAQ.tsx`, `home/ROITable.tsx`.
- **Real estate:** `real-estate/` → `Hero`, `BeforeAfter`, `AgentPipeline`, `VirtualStagingGallery`, `ListingCopyDemo`, `ChatbotViz`, `IntegrationMap`, `RETestimonials`.
- **SMB:** `smb/` → `SMBHero`, `PainPoints`, `AgentShowcase`, `DeploymentTimeline`, `IntegrationGrid`, `SMBCalculator`, `SMBTestimonials`, `WorkflowViz`, `Calculator`.
- **Web dev:** `web-dev/` → `HeroSection`, `ProblemSection`, `TransformationSection`, `WhyUsSection`, `ServicesSection`, `LaptopCarousel`, `BusinessImpactSection`, `ProcessSection`, `TechStack`, `FAQSection`, `FinalCTASection`.
- **Enterprise:** `enterprise/` → `EnterpriseHero`, `OrgTransformation`, `AgentArchitecture`, `EnterpriseAgents`, `SecurityCompliance`, `ROIProjection`, `ImplementationRoadmap`.
- **Academy:** `academy/` → `AcademyHero`, `ProblemGap`, `DepartmentTracks`, `HowItWorks`, `WhyAcademy`, `WhoIsItFor`.
- **`components/ui/*`** — large shadcn/ui primitive set; appears largely unused by the live SPA.
- **Legacy/dead (see §A):** `header.tsx`, `about-section.tsx`, `services-section.tsx`, `contact-section.tsx`, `pricing-section.tsx`, `hero-section.tsx`, `lead-magnet-section.tsx`, `consultation-banner.tsx`, `chat-widget.tsx`, `LayerSyncLogo.tsx`, `app/**`.

## F. Functional notes (for the §6 "preserve working functionality" guardrail)

- **No working form integration found.** Hero/CTA buttons largely render as `<button>` with no handler, or anchor to `/#apply` — **but there is no `#apply` section/form in the codebase.** The "Book a Call" / "Request Audit" CTAs are effectively dead ends today.
- **No analytics** scripts detected in `index.html` or app bootstrap.
- **No backend / submission handler.** So the "preserve the contact funnel" guardrail has **nothing live to preserve** — the diagnostic form will be net-new (flag for Phase B).
- Routing is client-side (`react-router-dom`); `vercel.json` rewrites all paths to `index.html` (SPA).

## G. Page-by-page copy (current, verbatim highlights)

### Home (`/`)
- **Hero scroll beats (TextBeat):**
  1. "Synchronized *Intelligence*" — "We layer AI into your operations — automating the manual, scaling the human, and building what comes next. For real estate agencies, SMEs, and enterprises across Zimbabwe and the region."
  2. "The CRM That *Closes Deals.*" — SynCRM one-system pitch.
  3. "Your Business, *Running Itself.*" — reclaim 20 hrs/week.
  4. "Built to *Convert.* Engineered to Last." — websites.
  5. "Organisation-Wide AI. *Privately Deployed.*" — enterprise.
  6. "Sync *Academy*" — AI training.
- **Solutions hub:** eyebrow "Our Solutions"; "Five Verticals. One *Partner*." → 5 cards (SynCRM, SMB Automation, Web Development, Sync Academy, Enterprise AI) each with stats.
- **Why LayerSync:** "Why *LayerSync*?" → Deploy in 48 Hours · Enterprise Security · Guaranteed ROI · Built for African Markets.
- **Pricing (`home/Pricing.tsx`):** eyebrow "Solutions"; "Our *Systems*" → Growth Engine / Content Engine (Most Popular) / Operations Engine; CTA "Book a Call"; Academy cross-sell banner ("Learn More").
- **ROI table (`home/ROITable.tsx`):** "Market *Efficiency*" → 5-row cost-comparison (Virtual Staging, Copywriting, Lead Qual, Transaction Coord, Video Production).
- **FAQ (`home/FAQ.tsx`):** "Common *Questions*" → ZiG currency, free trial, implementation time, single-service.
- **Final CTA:** "Ready to *Sync*?" → "Request Your Free AI Audit".

### SynCRM / Real Estate (`/solutions/real-estate`)
- Hero badge "SynCRM · Real Estate OS"; headline "From First Lead to *Closed Deal.*"; subhead "fully integrated CRM, marketing, and operations ecosystem — purpose-built for real estate agencies in Zimbabwe."; CTA "Apply for Founding Partner Access"; stats 40% faster / 24/7 / 1 system.
- Sections: **How SynCRM Works** (6-step pipeline incl. WhatsApp agent, Sync Media, dashboards), **AI Virtual Staging** (before/after, "98% cost reduction"), **Virtual Staging Gallery** (style variants), **AI-Written Listing Copy** demo, **Automated Lead Qual** chatbot, **Integrations** ("Plugs Into Everything"), **Testimonials** ("Trusted by Zimbabwean Agencies" — Tariro M./Oasis, David T./Venture, Sarah B./Pam Golding), **Final CTA** "Be One of the *First* Agencies Running SynCRM." (Q2 2026 founding partners).

### SMB (`/solutions/smb`)
- Hero "Your Business, *Running Itself.*"; CTA "Calculate Your Savings"; stats $65K+/48hr/5000+/100%.
- Sections: **Pain Points** (6 manual tasks, 19.5 hrs/wk), **AI Workforce** (7 agents incl. WhatsApp Business Agent), **Live in 48 Hours** timeline, **5000+ Apps** integration grid (Zapier/Make), **ROI Calculator**, **Testimonials** (David Miller/Apex, Jessica Wong/Bright Smile, Thomas Wright/Wright Accounting), **Final CTA** "Stop Paying Humans to Do *Machine Work.*".

### Web Development (`/solutions/web-dev`)
- Hero "Your Website Should *Reflect* the Business You've Built."; CTAs "Request a Website Audit" / "See Our Process".
- Sections: **Problem** (6 cards), **Transformation** (6 before/after pairs), **Why Us** (6 differentiators), **Services** ("Built for Impact", 8 services), **Portfolio** carousel (Glow Energy, Solar Estimator, Savanna Energy), **Business Impact** (8 outcomes), **Process** (6 steps), **Tech Stack** (10), **FAQ** (6), **Final CTA** "Your Business Has *Evolved*. Your Website Should Too.".

### Academy (`/solutions/academy`)
- Hero "Make AI a Skill Your *Whole Organisation Owns.*"; CTA "Book a Training Audit"; stats 7 tracks / 1-2 day / 8-week / 90-day.
- Sections: **Problem & Gap** ("The Real AI Gap Isn't Tools. It's Confidence.") + comparison table, **Department Tracks** (7), **How It Works** (3 phases), **Why Sync Academy** (5), **Who Is It For** (Enterprises / SMEs / Professional Services + House of Stone case study), **Final CTA** "Train Your Team Before Your *Competitor Does*.".

### Enterprise (`/solutions/enterprise`)
- Hero "Organisation-Wide AI. *Privately Deployed.*"; CTA "Request Enterprise Assessment"; stats 10x / 99.9% / SOC 2 / 0 retention.
- Sections: **Transform Every Department** (6 dept tracks), **Security & Compliance** (6 features), **Enterprise Architecture** (4 layers), **Enterprise Capabilities** (5 agents), **ROI Calculator**, **Implementation Roadmap** (90-day, 4 phases), **Final CTA** "Design Your *Private AI* Operating System".

## H. Proof assets present (real vs. likely-illustrative)

- **Testimonials with named people/firms** appear on Real Estate (Oasis Realty, Venture Management, Pam Golding Zimbabwe) and SMB (Apex Logistics, Bright Smile Dental, Wright Accounting). **Unverified — likely illustrative.** Per spec §6 these must be confirmed real or replaced with flagged placeholders.
- **Case study:** House of Stone Properties (Academy) — appears specific/real; confirm.
- **Portfolio:** Glow Energy / Solar Estimator / Savanna Energy (Web Dev) — confirm real.
- **Metrics** ("40% faster closings", "$2M+ pipeline", "$65K+ savings") — unverified; treat as fabricated until confirmed.
- **No real SynCRM product UI screenshots** found (staging/chatbot visuals are illustrative mockups).

---

*End of Phase A inventory. Awaiting review before producing the Phase B audit/diff (`docs/WEBSITE-AUDIT.md`).*
