import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    include: ["convex/tests/**/*.test.ts", "src/**/*.test.ts", "tracker/**/*.test.ts", "api/**/*.test.ts"],
    server: { deps: { inline: ["convex-test"] } },
  },
});
