#!/usr/bin/env node
/**
 * Post-build prerender of <head> metadata.
 * -------------------------------------------------------------------------
 * This is a client-rendered SPA, so a crawler that does not execute JavaScript
 * only ever sees dist/index.html — meaning every route shares the home page's
 * title, description and OG image. That breaks link previews in WhatsApp,
 * Facebook/Messenger and Slack, which matters most for campaign links such as
 * /layer-map shared from ManyChat.
 *
 * This script copies dist/index.html once per route and rewrites the meta tags
 * in each copy. No rendering, no headless browser — the app still boots and
 * hydrates exactly as before; only the <head> differs per file.
 *
 * Output for a route like /solutions/real-estate:
 *   dist/solutions/real-estate.html        (Vercel serves this for the clean URL)
 *   dist/solutions/real-estate/index.html  (directory-index fallback)
 *
 * Static files take precedence over the SPA rewrite in vercel.json, so these
 * are served instead of the generic shell.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { ROUTE_META, SITE, DEFAULT_IMAGE } from '../lib/routeMeta.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

/** Escape for use inside a double-quoted HTML attribute. */
const attr = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Replace an existing tag matched by `re`, or append `tag` to <head>. */
function upsert(html, re, tag) {
  return re.test(html) ? html.replace(re, tag) : html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function applyMeta(html, { title, description, image, url }) {
  const t = attr(title);
  const d = attr(description);
  const i = attr(image);
  const u = attr(url);

  html = upsert(html, /<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`);
  html = upsert(html, /<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${d}">`);
  html = upsert(html, /<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${t}">`);
  html = upsert(html, /<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${d}">`);
  html = upsert(html, /<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${i}">`);
  html = upsert(html, /<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${u}">`);
  html = upsert(html, /<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${t}">`);
  html = upsert(html, /<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${d}">`);
  html = upsert(html, /<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${i}">`);
  html = upsert(html, /<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${u}">`);
  return html;
}

async function main() {
  const shellPath = path.join(DIST, 'index.html');
  let shell;
  try {
    shell = await readFile(shellPath, 'utf8');
  } catch {
    console.error('prerender: dist/index.html not found — run the build first.');
    process.exit(1);
  }

  let count = 0;
  for (const [route, meta] of Object.entries(ROUTE_META)) {
    const url = `${SITE}${route === '/' ? '' : route}`;
    const html = applyMeta(shell, {
      title: meta.title,
      description: meta.description,
      image: meta.image ?? DEFAULT_IMAGE,
      url,
    });

    if (route === '/') {
      await writeFile(shellPath, html);
    } else {
      const rel = route.replace(/^\//, '');
      // clean-URL file: dist/<route>.html
      const flat = path.join(DIST, `${rel}.html`);
      await mkdir(path.dirname(flat), { recursive: true });
      await writeFile(flat, html);
      // directory-index fallback: dist/<route>/index.html
      const nested = path.join(DIST, rel, 'index.html');
      await mkdir(path.dirname(nested), { recursive: true });
      await writeFile(nested, html);
    }
    count++;
    console.log(`  ${route.padEnd(26)} ${meta.title}`);
  }
  console.log(`prerender: wrote metadata for ${count} routes`);
}

main();
