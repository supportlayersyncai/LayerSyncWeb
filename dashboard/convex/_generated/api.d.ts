/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as access from "../access.js";
import type * as analytics from "../analytics.js";
import type * as apiKeys from "../apiKeys.js";
import type * as audit from "../audit.js";
import type * as auth from "../auth.js";
import type * as contacts from "../contacts.js";
import type * as crons from "../crons.js";
import type * as email from "../email.js";
import type * as http from "../http.js";
import type * as ingest from "../ingest.js";
import type * as invites from "../invites.js";
import type * as lib_crypto from "../lib/crypto.js";
import type * as lib_dates from "../lib/dates.js";
import type * as lib_domains from "../lib/domains.js";
import type * as lib_emails from "../lib/emails.js";
import type * as lib_geo from "../lib/geo.js";
import type * as lib_ingest from "../lib/ingest.js";
import type * as lib_leads from "../lib/leads.js";
import type * as lib_mcp from "../lib/mcp.js";
import type * as lib_paths from "../lib/paths.js";
import type * as lib_referrer from "../lib/referrer.js";
import type * as lib_roles from "../lib/roles.js";
import type * as lib_rollup from "../lib/rollup.js";
import type * as lib_ua from "../lib/ua.js";
import type * as lib_webhooks from "../lib/webhooks.js";
import type * as maintenance from "../maintenance.js";
import type * as mcp from "../mcp.js";
import type * as mcpTools from "../mcpTools.js";
import type * as members from "../members.js";
import type * as notifications from "../notifications.js";
import type * as push from "../push.js";
import type * as pushSender from "../pushSender.js";
import type * as rateLimits from "../rateLimits.js";
import type * as rollups from "../rollups.js";
import type * as sites from "../sites.js";
import type * as staff from "../staff.js";
import type * as webhooks from "../webhooks.js";
import type * as workspaces from "../workspaces.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "access": typeof access;
  "analytics": typeof analytics;
  "apiKeys": typeof apiKeys;
  "audit": typeof audit;
  "auth": typeof auth;
  "contacts": typeof contacts;
  "crons": typeof crons;
  "email": typeof email;
  "http": typeof http;
  "ingest": typeof ingest;
  "invites": typeof invites;
  "lib/crypto": typeof lib_crypto;
  "lib/dates": typeof lib_dates;
  "lib/domains": typeof lib_domains;
  "lib/emails": typeof lib_emails;
  "lib/geo": typeof lib_geo;
  "lib/ingest": typeof lib_ingest;
  "lib/leads": typeof lib_leads;
  "lib/mcp": typeof lib_mcp;
  "lib/paths": typeof lib_paths;
  "lib/referrer": typeof lib_referrer;
  "lib/roles": typeof lib_roles;
  "lib/rollup": typeof lib_rollup;
  "lib/ua": typeof lib_ua;
  "lib/webhooks": typeof lib_webhooks;
  "maintenance": typeof maintenance;
  "mcp": typeof mcp;
  "mcpTools": typeof mcpTools;
  "members": typeof members;
  "notifications": typeof notifications;
  "push": typeof push;
  "pushSender": typeof pushSender;
  "rateLimits": typeof rateLimits;
  "rollups": typeof rollups;
  "sites": typeof sites;
  "staff": typeof staff;
  "webhooks": typeof webhooks;
  "workspaces": typeof workspaces;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
};
