import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTE_META, SITE, DEFAULT_IMAGE } from '../../lib/routeMeta.js';

/**
 * Per-route document metadata at runtime.
 *
 * Route metadata itself lives in lib/routeMeta.js so that scripts/prerender.mjs
 * can bake the same values into static HTML at build time — that is what
 * non-JavaScript crawlers and link-preview bots (WhatsApp, Facebook, Slack)
 * actually read. This component keeps titles correct as users navigate
 * client-side.
 */

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
