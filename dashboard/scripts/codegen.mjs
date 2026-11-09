#!/usr/bin/env node
/**
 * Offline Convex codegen.
 *
 * `npx convex dev` / `npx convex codegen` write convex/_generated/ for you and
 * are the normal way to do this. They need a configured deployment, though,
 * which CI and fresh clones don't have. This script produces the same files
 * without one, so `npm run typecheck` and `npm test` work anywhere:
 *
 *   1. `convex codegen` writes server.*, dataModel.d.ts and api.js; it stops
 *      before the typed api.d.ts because that step asks a deployment for
 *      component definitions.
 *   2. We then write the typed api.d.ts ourselves, in the same shape Convex
 *      writes it, from the files in convex/ and the components mounted in
 *      convex/convex.config.ts.
 *
 * Once a deployment is linked, `npx convex dev` overwrites these files with
 * its own (identical) output.
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const convexDir = join(root, "convex");

// Step 1: let the CLI write everything it can. It fails at the deployment
// step on purpose (nothing is listening), which is fine.
spawnSync("npx", ["convex", "codegen", "--typecheck", "disable"], {
  cwd: root,
  stdio: "ignore",
  env: {
    ...process.env,
    CONVEX_DEPLOYMENT: "",
    CONVEX_SELF_HOSTED_URL: "http://127.0.0.1:9",
    CONVEX_SELF_HOSTED_ADMIN_KEY: "offline-codegen",
  },
});

// Step 2: the typed api.d.ts. Same rules Convex uses for entry points.
function modules(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(convexDir, full);
    if (statSync(full).isDirectory()) {
      if (name.startsWith(".") || name.startsWith("_") || name === "node_modules") continue;
      out.push(...modules(full));
      continue;
    }
    if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(name)) continue;
    if (name.startsWith(".") || name.startsWith("#")) continue;
    if (name === "schema.ts" || name === "schema.js") continue;
    if ((name.match(/\./g) || []).length > 1) continue; // foo.test.ts, auth.config.ts, x.d.ts
    if (!/\b(export|import)\b/.test(readFileSync(full, "utf8"))) continue;
    out.push(rel.replace(/\.(ts|tsx|js|jsx|mjs|cjs)$/, "").split(sep).join("/"));
  }
  return out.sort();
}

const mods = modules(convexDir);
const ident = (m) => m.replace(/\//g, "_");

// Components: `import x from "<pkg>/convex.config"` + `app.use(x)` or
// `app.use(x, { name: "y" })`.
const components = [];
try {
  const cfg = readFileSync(join(convexDir, "convex.config.ts"), "utf8");
  const imports = new Map();
  for (const m of cfg.matchAll(/import\s+(\w+)\s+from\s+["']([^"']+)\/convex\.config(?:\.js)?["']/g)) {
    imports.set(m[1], m[2]);
  }
  for (const m of cfg.matchAll(/app\.use\(\s*(\w+)\s*(?:,\s*\{\s*name:\s*["']([^"']+)["']\s*\})?\s*\)/g)) {
    const pkg = imports.get(m[1]);
    if (!pkg) continue;
    components.push({ name: m[2] ?? m[1], pkg });
  }
} catch {
  // no convex.config.ts: no components
}

const header = `/* eslint-disable */
/**
 * Generated \`api\` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run \`npx convex dev\`.
 * @module
 */
`;

const body = `${header}
${mods.map((m) => `import type * as ${ident(m)} from "../${m}.js";`).join("\n")}

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
${mods.map((m) => `  ${JSON.stringify(m)}: typeof ${ident(m)};`).join("\n")}
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * \`\`\`js
 * const myFunctionReference = api.myModule.myFunction;
 * \`\`\`
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * \`\`\`js
 * const myFunctionReference = internal.myModule.myFunction;
 * \`\`\`
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
${components
  .map((c) => `  ${c.name}: import("${c.pkg}/_generated/component.js").ComponentApi<${JSON.stringify(c.name)}>;`)
  .join("\n")}
};
`;

writeFileSync(join(convexDir, "_generated", "api.d.ts"), body);
console.log(`convex/_generated/api.d.ts: ${mods.length} modules, ${components.length} components`);
