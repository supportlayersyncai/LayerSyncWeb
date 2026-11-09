# SyncSite security model

What's protected, how, and where in the code. Keep this current when changing
any of it.

## Accounts and sign-in (`convex/auth.ts`, `convex/invites.ts`)

- **Invite-only.** There is no sign-up form. An account can be created only
  with an unexpired, unused invitation, and only for the exact email it was
  sent to. The check runs inside the transaction that creates the user, so a
  bad invite creates nothing.
- **Invitation links** carry 32 random bytes in the URL fragment
  (`/invite#token`): fragments never reach servers, logs or `Referer` headers.
  Only the SHA-256 is stored. Links work once and expire after 7 days; a new
  invite to the same person cancels the old one. The invite page removes the
  token from the address bar.
- **No account pre-hijacking.** Workspace admins never see invite links (only
  the invitee's inbox does), so an admin can't create an account "as" someone
  and sit on it until another workspace invites them. LayerSync staff can copy
  links, to send them on WhatsApp.
- **Passwords:** 10 to 128 characters, common choices refused, hashed with
  Scrypt by Convex Auth. Failed sign-ins are throttled per account. Sign-in
  errors don't say whether an address has an account; neither does "forgot
  password".
- **Sign-up can't be used to test passwords.** Convex Auth's sign-up flow,
  given an address that already has an account, checks the password and signs
  in, without the sign-in throttle. A guard in front of the provider
  (`convex/auth.ts`, `invites.guardAuthFlow`) refuses any sign-up without a
  valid invitation for that exact, account-less address, with the same answer
  whether or not an account exists. Sign-ups, reset emails and reset codes are
  also rate-limited per address. Covered end to end in `convex/tests/auth.test.ts`.
- **Password reset:** an 8-digit code by email, valid 15 minutes. Resetting
  signs out every other session.
- **Sessions** end after 14 days unused and 30 days regardless. Staff can
  switch any account off (All clients, LayerSync staff, or `staff.setDisabled`):
  every function re-reads the user, so they're cut off at their next request,
  and their sessions and refresh tokens are deleted. Staff access can be
  removed, and staff invitations cancelled, the same way.
- **First staff account** is created from the terminal
  (`invites:bootstrapStaff`), an internal function that refuses once any staff
  account exists.

## Authorisation (`convex/access.ts`)

- Every public query and mutation calls `requireUser`, `requireWorkspace`,
  `requireSite` or `requireContact` before touching data. Identity always comes
  from the auth token; no function accepts a user id as proof of anything.
- Ids sent by the browser (site, contact, membership, invite, webhook, key) are
  loaded and checked against a workspace the caller belongs to. A missing
  record and a record in someone else's workspace give the same error, so ids
  can't be probed.
- Roles: viewer (read), member (work leads), admin (sites, team below owner,
  keys, webhooks, exports, erasure), owner (everything). Admins can't create,
  change or remove owners or admins. A workspace always keeps at least one owner.
- LayerSync staff act as owner on any workspace. The dashboard shows a banner
  when they do, and their changes are labelled "(LayerSync)" in the
  workspace's audit log.
- Internal functions (`internalQuery`, `internalMutation`, `internalAction`)
  can't be called from outside; HTTP routes and crons are the only callers.

## Public entry points

| Entry | Protection |
| --- | --- |
| `api/collect`, `api/lead` (Vercel Edge) | Size limits (32/48 KB), JSON shape checks, CORS without credentials. Adds IP and country from headers Vercel sets (clients can't forge them). Answers analytics requests with a bare 202 so nobody learns why something was dropped. |
| `POST /ingest/events`, `/ingest/lead` (Convex) | Require `X-SyncSite-Ingest`, compared in constant time; refuse everything if the secret is unset or short. Payloads re-validated (`convex/lib/ingest.ts`). |
| Site check | The site key is public by design. Requests must carry an `Origin` on one of the site's domains (`convex/lib/domains.ts`), which stops other websites using a copied key. A script can forge that header, so the rate limits below are what bound abuse, not the Origin check. |
| Rate limits (`convex/rateLimits.ts`) | Per IP on each site for events (240 a minute) and leads (10 an hour), keyed by a daily-salted hash of the IP alone so rotating user agents doesn't help; per visitor for leads (5 per 10 minutes); per site for both; per API key for MCP, counting every message in a batch; per user for invitations and webhook tests. |
| Lead alerts | Email and push alerts are capped per workspace (a burst of 15, then 30 an hour). Past that, leads still land in the inbox and the dashboard, but nobody's inbox gets flooded and the shared email quota isn't used up. |
| Rollups | One recompute per site and day at a time (`rollupRuns`), so a flood of events can't stack up overlapping work. |
| Spam | Honeypot field, too-fast submissions and link-stuffed messages are kept but marked spam: no notifications, no webhooks, and the bot gets the same 200 as a person. |
| `POST /mcp` | Bearer API key (32 random bytes, stored as SHA-256, optional expiry, revocable). Browser requests (an `Origin` header) are refused unless listed in `MCP_ALLOWED_ORIGINS`, which blocks DNS-rebinding attacks. Every tool call is scoped to the key's workspace inside the Convex function; ids from other workspaces behave as not found. Write tools need a write-scoped key and are audited. |

## Data handling

- **No IPs or user agents are stored.** They're combined with a daily salt
  into a visitor hash; salts are deleted when the UTC day ends
  (`maintenance.rotateSalts`).
- **Paths are cleaned** before storage: query strings dropped (only `utm_*`
  kept, by the tracker), emails, phone-like numbers and long random ids
  masked (`convex/lib/paths.ts`).
- **Form fields** named like passwords, card numbers, CVVs, OTPs, tokens or
  captcha responses are dropped, in the tracker and again on the server
  (`convex/lib/leads.ts`).
- **Visitor-typed text is untrusted.** The dashboard renders it as text (React
  escaping, no `dangerouslySetInnerHTML`); emails escape every value
  (`convex/lib/emails.ts`); CSV exports prefix cells starting with `= + - @`
  so spreadsheets don't run them (`src/lib/csv.ts`); the MCP server's
  instructions tell assistants not to follow instructions found in lead text.
- **Erasure:** admins can delete a contact with every form send, note and
  notification about them.
- **Retention:** see README.

## Webhooks (`convex/webhooks.ts`, `convex/lib/webhooks.ts`)

- HTTPS only, standard ports, no credentials in the URL, no raw IP addresses
  (IPv4 private ranges, any IPv6 literal, decimal and hex forms) and no
  wildcard-DNS services such as nip.io. Re-checked before every delivery.
  Redirects are never followed, and admins only ever see a status code, never
  a response body. A public name that resolves to a private address can't be
  caught (Convex functions can't resolve DNS); Convex's network isolation is
  what stands behind that.
- A webhook (and an API key) only works while the person who made it is still
  an admin or owner of the workspace. Removing or demoting them revokes their
  keys and switches their webhooks off, and both are re-checked at use.
- Each delivery is signed: `SyncSite-Signature: t=<seconds>,v1=<HMAC-SHA256(secret, "t.body")>`.
  Receivers should reject anything older than five minutes. The secret is
  shown once; the dashboard only shows its last four characters.
- Retries back off over about nine hours; 25 failures in a row switch the
  webhook off and notify the workspace's admins. Delivery logs (which contain
  lead details) are deleted after 30 days.

## Web Push

Subscriptions are only accepted for the browsers' own push services (Google,
Mozilla, Apple, Microsoft), and the sender checks again before every POST, so
a signed-in user can't point our server at an address of their choosing.

## The dashboard in the browser

- Its own origin (`dashboard.layersyncai.com`), separate from the marketing
  site, which loads Tailwind from a CDN at runtime.
- Strict headers (`vercel.json`): a Content-Security-Policy with no inline or
  third-party scripts (only Google Fonts styles), `frame-ancestors 'none'`,
  HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP.
- `?next=` after sign-in only accepts same-site paths.
- `noindex` on every page.

## Tested

`convex/tests/` covers sign-up through Convex Auth (no password testing via
sign-up, invite misuse, per-address limits), cross-workspace reads and writes, viewer/member/admin
limits, invite misuse (wrong email, reused, expired, missing), last-owner
protection, disabled users and their sessions, staff controls, keys and
webhooks dying with their creator's access, MCP auth, scopes, batch limits and
isolation, ingest secret and origin checks, per-IP limits, alert throttling,
the rollup lock, spam handling, masking, erasure, webhook signing, retries,
SSRF refusal and the push-service allowlist (`convex/tests/hardening.test.ts`
holds the regressions from the security review). `scripts/test-tracker.mjs` checks in a real browser that no
cookies or storage are used, that only campaign tags leave the page, that
sensitive form fields are never sent, and that Do Not Track, Global Privacy
Control and `data-exclude` are honoured.

## Review

An independent review of this code found, and this version fixes: password
testing through sign-up, floods using forged Origin headers, keys and webhooks
outliving their creator, unrevocable staff invitations, an admin cancelling an
owner's invitation by re-inviting, MCP batches bypassing the rate limit, gaps
in path and file-name masking, IP-literal webhook URLs and arbitrary push
endpoints.

## Not done yet (worth doing as usage grows)

- Two-factor sign-in for staff and owners.
- OAuth for the MCP server (claude.ai's custom connectors need it; Claude Code
  and Claude Desktop work with keys today).
- A CAPTCHA (e.g. Cloudflare Turnstile) on forms if a site starts getting
  targeted spam that gets past the honeypot.
- Encrypting webhook secrets at rest with a key held outside the database.
