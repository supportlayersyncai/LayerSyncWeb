#!/usr/bin/env node
/**
 * One-off asset generation via OpenAI Images (gpt-image-1).
 * -------------------------------------------------------------------------
 * Run:  OPENAI_API_KEY=sk-... npm run generate:assets
 *   or: put OPENAI_API_KEY in a (gitignored) .env and run the same command.
 *
 * The key is read ONLY here, server-side. It is never imported by the app and
 * never bundled into the client. Do not add a VITE_ prefix to it.
 *
 * Scope: brand/background art we can legitimately synthesize — e.g. the social
 * share image (og-image.png). It intentionally does NOT generate "proof"
 * (fake product screenshots, logos, headshots): those must be real.
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

// Minimal .env loader (no dependency) — only for local dev convenience.
async function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!existsSync(envPath)) return;
  const text = await readFile(envPath, 'utf8');
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const BRAND = {
  orange: '#D36135',
  green: '#7FB069',
  dark: '#050505',
};

/** Assets to generate. Add more entries as needed. */
const ASSETS = [
  {
    file: 'public/og-image.png',
    size: '1536x1024', // closest gpt-image-1 size to the 1.91:1 OG ratio
    prompt: `A premium, minimal social share image for a software company called "LayerSync".
Dark near-black background (${BRAND.dark}). Subtle abstract layered-grid / stacked-planes motif
suggesting systems and structure, rendered in warm orange (${BRAND.orange}) and soft green
(${BRAND.green}) with gentle ambient glow and fine film grain. Lots of negative space.
Centered wordmark text "LayerSync" in a clean modern sans-serif, white, with a smaller tagline
"We build the systems businesses run on". Elegant, high-end, restrained — no clutter, no stock-photo
people, no fake UI. Flat, modern, editorial tech aesthetic.`,
  },
];

async function generate(asset, apiKey) {
  process.stdout.write(`• ${asset.file} … `);
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: asset.prompt,
      size: asset.size,
      n: 1,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI request failed (${res.status}): ${body.slice(0, 400)}`);
  }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error('No image data returned');
  const out = path.join(ROOT, asset.file);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(b64, 'base64'));
  console.log('done');
}

async function main() {
  await loadEnv();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error(
      'OPENAI_API_KEY is not set.\n' +
        'Set it in a gitignored .env file (see .env.example) or export it before running:\n' +
        '  OPENAI_API_KEY=sk-... npm run generate:assets'
    );
    process.exit(1);
  }
  console.log('Generating assets with gpt-image-1:');
  const only = process.argv[2]; // optional: pass a filename substring to filter
  for (const asset of ASSETS) {
    if (only && !asset.file.includes(only)) continue;
    try {
      await generate(asset, apiKey);
    } catch (err) {
      console.error(`  failed: ${err.message}`);
      process.exitCode = 1;
    }
  }
}

main();
