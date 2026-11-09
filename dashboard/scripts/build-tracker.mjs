#!/usr/bin/env node
/** Builds tracker/syncsite.ts into public/s.js (minified, ES2018) and reports its size. */
import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
await build({
  entryPoints: [`${root}tracker/syncsite.ts`],
  outfile: `${root}public/s.js`,
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2018", "safari13"],
  legalComments: "none",
  banner: { js: "/* SyncSite by LayerSync. No cookies, nothing stored on your device. */" },
});
const out = readFileSync(`${root}public/s.js`);
console.log(`public/s.js: ${out.length} bytes, ${gzipSync(out).length} gzipped`);
