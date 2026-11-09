import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite";

/**
 * In development, serve api/collect and api/lead (Vercel Edge Functions in
 * production) from the Vite server, so the tracker can be tried locally
 * against a dev Convex deployment. Set CONVEX_SITE_URL and
 * SYNCSITE_INGEST_SECRET in .env.local.
 */
function devCollector(env: Record<string, string>): Plugin {
  return {
    name: "syncsite-dev-collector",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const kind = req.url?.startsWith("/api/collect") ? "events" : req.url?.startsWith("/api/lead") ? "lead" : null;
        if (!kind) return next();
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") headers.set(k, v);
        headers.set("x-real-ip", req.socket.remoteAddress ?? "127.0.0.1");
        const request = new Request(`http://localhost${req.url}`, {
          method: req.method,
          headers,
          body: req.method === "POST" ? Buffer.concat(chunks) : undefined,
        });
        const { collect } = (await server.ssrLoadModule("/api/_collector.ts")) as typeof import("./api/_collector");
        const response = await collect(request, kind, { convexSiteUrl: env.CONVEX_SITE_URL, secret: env.SYNCSITE_INGEST_SECRET });
        res.statusCode = response.status;
        response.headers.forEach((v, k) => res.setHeader(k, v));
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // `npm run demo`: the real UI on sample data, no backend (dev/fixtures.ts).
  const demo = mode === "demo";
  return {
    plugins: [react(), tailwindcss(), devCollector(env)],
    define: demo ? { "import.meta.env.VITE_CONVEX_URL": JSON.stringify("https://demo.convex.cloud") } : undefined,
    resolve: demo
      ? {
          alias: [
            { find: /^convex\/react$/, replacement: fileURLToPath(new URL("./dev/mock-convex-react.tsx", import.meta.url)) },
            { find: /^@convex-dev\/auth\/react$/, replacement: fileURLToPath(new URL("./dev/mock-auth.tsx", import.meta.url)) },
          ],
        }
      : undefined,
    server: { port: 5174 },
    build: { sourcemap: false, target: "es2020" },
  };
});
