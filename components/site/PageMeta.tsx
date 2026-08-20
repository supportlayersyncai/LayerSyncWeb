import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Per-route document metadata.
 *
 * This is a client-side SPA, so crawlers and link-preview bots that do not run
 * JavaScript still see index.html's defaults. This component fixes titles and
 * previews for everything that DOES execute JS (Google, and users' browsers /
 * tabs / bookmarks). Prerendering the routes at build time is the follow-up
 * that makes previews correct for non-JS bots too.
 */

const SITE = 'https://layersyncai.com';
const DEFAULT_IMAGE = `${SITE}/og-image.png`;

export interface RouteMeta {
  title: string;
  description: string;
  image?: string;
}

/** Keyed by pathname. Keep in sync with App.tsx routes and public/sitemap.xml. */
export const ROUTE_META: Record<string, RouteMeta> = {
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
    title: 'Our Work — Systems we have shipped | LayerSync',
    description:
      'SynCRM is our flagship and it is live today. See the real product screens, plus the builds we are writing up as case studies.',
    image: `${SITE}/syncrm-dashboard.webp`,
  },
  '/about': {
    title: 'About — Young company, experienced builders | LayerSync',
    description:
      'LayerSync is two years old; the engineering team behind it is not. Over a decade each of production experience in banking, insurance and financial systems.',
  },
  '/contact': {
    title: 'Book a diagnostic | LayerSync',
    description:
      'Tell us what is breaking in your operation. A short, honest conversation about whether a system can fix it — no packages, no pressure.',
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
    description: 'The terms that apply to this website. Client engagements are governed by a separate signed agreement.',
  },
};

function setTag(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export const PageMeta: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const key = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const meta = ROUTE_META[key] ?? ROUTE_META['/'];
    const image = meta.image ?? DEFAULT_IMAGE;
    const url = `${SITE}${key === '/' ? '' : key}`;

    document.title = meta.title;
    setTag('meta[name="description"]', 'name', 'description', meta.description);
    setTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
    setTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
    setTag('meta[property="og:image"]', 'property', 'og:image', image);
    setTag('meta[property="og:url"]', 'property', 'og:url', url);
    setTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
    setTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);
    setTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    setCanonical(url);
  }, [pathname]);

  return null;
};
