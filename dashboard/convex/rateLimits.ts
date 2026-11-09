/**
 * Every rate limit in one place (@convex-dev/rate-limiter). Public endpoints
 * are limited per site and per visitor; the MCP server per API key.
 */
import { HOUR, MINUTE, RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Analytics events per site. Generous: a busy small-business site does
  // a few per second at peak. Sharded so bursts don't contend.
  ingestSite: { kind: "token bucket", rate: 1500, period: MINUTE, capacity: 3000, shards: 4 },
  // Form submissions per site, and per visitor (hashed) per 10 minutes.
  leadSite: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 30 },
  leadVisitor: { kind: "fixed window", rate: 5, period: 10 * MINUTE },
  // Per visitor IP (daily-salted hash; the IP itself is never stored), so
  // a script forging Origin headers can't use a whole site's allowance.
  ingestIp: { kind: "token bucket", rate: 240, period: MINUTE, capacity: 480 },
  leadIp: { kind: "fixed window", rate: 10, period: HOUR },
  // Lead alerts (email + push) per workspace; past this, leads still land
  // in the inbox but stop emailing everyone.
  leadAlerts: { kind: "token bucket", rate: 30, period: HOUR, capacity: 15 },
  // Account flows, per email address.
  signUp: { kind: "fixed window", rate: 5, period: HOUR },
  resetEmail: { kind: "fixed window", rate: 3, period: HOUR },
  resetCode: { kind: "fixed window", rate: 10, period: HOUR },
  // MCP calls per API key.
  mcpKey: { kind: "token bucket", rate: 120, period: MINUTE, capacity: 60 },
  // Invitation emails per signed-in user.
  invites: { kind: "token bucket", rate: 30, period: HOUR, capacity: 10 },
  // "Send test" on a webhook.
  webhookTest: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 5 },
});
