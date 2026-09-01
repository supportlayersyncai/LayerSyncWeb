/**
 * Per-route metadata — the single source of truth.
 *
 * Imported by BOTH:
 *   - components/site/PageMeta.tsx  (runtime, for real browsers)
 *   - scripts/prerender.mjs         (build time, for crawlers and link-preview
 *                                    bots such as WhatsApp and Facebook, which
 *                                    do not execute JavaScript)
 *
 * Plain JS on purpose so Node can import it directly during the build.
 * Keep in sync with App.tsx routes and public/sitemap.xml.
 */

export const SITE = 'https://layersyncai.com';
// Versioned filename: WhatsApp/Facebook cache OG images hard, so a new URL is
// the only reliable way to make previews pick up new artwork.
export const DEFAULT_IMAGE = `${SITE}/og-image-v2.png`;

/** @type {Record<string, {title: string, description: string, image?: string}>} */
export const ROUTE_META = {
  '/': {
    title: 'LayerSync — We build the systems businesses run on',
    description:
      'LayerSync builds custom operations software for businesses that have outgrown spreadsheets and WhatsApp. We diagnose, build, and hand over. Harare, Zimbabwe.',
  },
  '/syncrm': {
    title: 'SynCRM — The operating system for real estate agencies | LayerSync',
    description:
      'Stop running your agency blind. SynCRM captures every lead, routes it to an agent, and shows your whole pipeline on one board. Built for real estate agencies.',
    image: `${SITE}/syncrm-dashboard.webp`,
  },
  '/what-we-build': {
    title: 'What We Build — Custom operations systems & AI agents | LayerSync',
    description:
      'Workflow systems, AI agents, dashboards and custom software for businesses that have outgrown manual work and off-the-shelf tools. Built by engineers from regulated industries.',
  },
  '/work': {
    title: 'Our Work — Live systems, not slideware | LayerSync',
    description:
      'SynCRM and KurimaSense are live in production today. See what we built, plus the bespoke systems we deliver for clients across real estate, professional services and events.',
    image: `${SITE}/syncrm-dashboard.webp`,
  },
  '/about': {
    title: 'About — Four founding partners | LayerSync',
    description:
      'Meet the four founding partners behind LayerSync — an AI systems and software company founded in 2024 in Harare, building production platforms for banking, insurance and real estate.',
  },
  '/contact': {
    title: 'Book a diagnostic | LayerSync',
    description:
      'Tell us what is breaking in your operation. A short, honest conversation about whether a system can fix it — no packages, no pressure.',
  },
  '/layer-map': {
    title: 'The Layer Map — a free LayerSync field guide',
    description:
      'What using AI actually looks like at each stage of a business, how to tell which stage you are on, and exactly what has to change to reach the next one. 33 pages, free, no email required.',
    image: `${SITE}/og-layer-map.png`,
  },
  '/solutions/real-estate': {
    title: 'Real Estate — Staging, listing copy & SynCRM | LayerSync',
    description:
      'AI virtual staging, listing copy and the integrations that keep your tools talking — built around SynCRM, the system that makes sure enquiries actually get worked.',
  },
  '/solutions/web-dev': {
    title: 'Web Development — Sites built to convert | LayerSync',
    description:
      'We build and rebuild websites into modern digital experiences that earn trust, communicate value, and make your business impossible to ignore.',
  },
  '/solutions/academy': {
    title: 'Sync Academy — AI training for your whole organisation | LayerSync',
    description:
      'Department-by-department AI training that turns your people into confident operators, in the workflows they actually run.',
  },
  '/privacy': {
    title: 'Privacy Policy | LayerSync',
    description:
      'What we collect when you contact us, why we hold it, and how to get it removed. No trackers, no mailing lists, no selling your data.',
  },
  '/terms': {
    title: 'Terms of Service | LayerSync',
    description:
      'The terms that apply to this website. Client engagements are governed by a separate signed agreement.',
  },
};
