# SyncSite

Analytics, a lead inbox and a simple CRM for the websites LayerSync builds.
Each client logs in and sees who visited their site, where those visitors came
from, and every enquiry the site received. They get an email or a phone
notification the moment a new one arrives. LayerSync's own site is the first
client.

```
 client website                      dashboard.layersyncai.com (Vercel)                 Convex
┌──────────────────┐   beacon    ┌────────────────────────────────────┐   secret   ┌──────────────────────────┐
│ <script s.js>    │ ──────────▶ │ api/collect, api/lead (Edge)       │ ─────────▶ │ /ingest/events, /lead     │
│ forms, SPA nav,  │             │  + visitor IP & country (Vercel    │            │  sessions → daily rollups │
│ taps, scroll     │             │    headers), never stored          │            │  contacts, notifications  │
└──────────────────┘             │ React dashboard (this folder)      │ ◀────────▶ │  queries / mutations      │
                                 └────────────────────────────────────┘  websocket │ /mcp  (API keys)          │
  Claude / any MCP client ─────────────────────────────────────────────────────────▶ │ webhooks → your CRM       │
                                                                                     └──────────────────────────┘
```

## What's in here

| Path | What |
| --- | --- |
| `convex/` | The backend: schema, auth, ingest, rollups, CRM, notifications, MCP server, webhooks. Pure logic in `convex/lib/` (unit-tested). |
| `api/` | Vercel Edge Functions in front of Convex: add IP/country, forward with the ingest secret. |
| `tracker/syncsite.ts` | The script sites embed, built to `public/s.js` (about 3 KB gzipped). |
| `src/` | The dashboard (Vite, React 19, Tailwind 4), styled after layersyncai.com. |
| `dev/` | Sample data for `npm run demo` (the real UI with no backend). Not in production builds. |
| `scripts/` | Tracker build, offline Convex codegen, tracker browser test. |

## Features

- **Overview:** visitors, visits, pageviews, time per visit, bounce rate and leads,
  each compared with the previous period; a daily (or hourly) chart; channels
  (search, social, AI assistants, email, paid, referral, direct); top pages with
  time in view, scroll depth, entries and leads; sources and campaigns
  (`utm_*`, ManyChat, ad click ids); countries; devices and scroll depth by
  device; taps on WhatsApp, phone, email, downloads and outbound links; where
  leads come from; a live view of the last five minutes.
- **Leads (CRM):** every form send becomes a contact, de-duplicated by email or
  phone. Pipeline (new, contacted, qualified, won, lost, spam), owner, follow-up
  date, deal value, tags, notes and a full history. Each lead shows how they
  found you: the source, the landing page, the pages they read before getting in
  touch and how long it took. Search, CSV export (spreadsheet-formula safe),
  and erasure for data-protection requests.
- **Notifications:** in the dashboard (live), by email (Resend), by Web Push to
  browsers and installed phones, and a Monday summary email. Each person picks
  per workspace.
- **MCP server:** connect Claude (or any MCP client) with a workspace API key
  and ask about traffic and leads, or let it update leads, add notes and add
  leads from elsewhere. Read-only keys can't change anything.
- **Webhooks:** signed JSON POSTs to Zapier, Make, n8n or your own CRM on
  `lead.created`, `contact.updated` and `note.created`, retried with backoff.
- **Multi-tenant:** one workspace per client, roles (viewer, member, admin,
  owner), several sites per workspace. LayerSync staff can open every workspace;
  everything they change is in that workspace's audit log.

## Setting it up (once)

You need a Convex account, a Vercel account and a Resend account (for email).

1. **Convex project.** In this folder:
   ```bash
   npm install
   npx convex dev          # log in, create the project "syncsite"; writes .env.local
   ```
   Leave it running in one terminal while developing; it pushes functions as
   you edit.

2. **Auth keys.** `npx @convex-dev/auth` (sets `JWT_PRIVATE_KEY`, `JWKS` and
   `SITE_URL` on the deployment). Then set `SITE_URL` to the dashboard address.

3. **Deployment environment** (`npx convex env set NAME value`, or the Convex
   dashboard). Do this for the production deployment too (`--prod`).

   | Name | Value |
   | --- | --- |
   | `SYNCSITE_INGEST_SECRET` | `openssl rand -hex 32`. Same value goes on Vercel. |
   | `DASHBOARD_URL` | `https://dashboard.layersyncai.com` (links in emails) |
   | `SITE_URL` | same as `DASHBOARD_URL` |
   | `RESEND_API_KEY` | from resend.com |
   | `EMAIL_FROM` | `SyncSite <notify@layersyncai.com>` on a domain verified in Resend |
   | `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | `npx web-push generate-vapid-keys`; subject `mailto:support@layersyncai.com` |
   | `MCP_ALLOWED_ORIGINS` | optional; browser origins allowed to call `/mcp` (normally leave unset) |

4. **First staff account.** Nobody can sign up without an invitation, so make the first one from the terminal:
   ```bash
   npx convex run invites:bootstrapStaff '{"email":"you@layersyncai.com"}' --prod
   ```
   It prints a link (and emails it). Open it, set your password. That command
   refuses to run again once a staff account exists; invite more staff from
   the dashboard (All clients, Invite staff).

5. **Vercel.** New project from this repository with **Root Directory
   `dashboard`**. Environment variables:

   | Name | Value |
   | --- | --- |
   | `VITE_CONVEX_URL` | `https://<deployment>.convex.cloud` |
   | `CONVEX_SITE_URL` | `https://<deployment>.convex.site` |
   | `SYNCSITE_INGEST_SECRET` | same as in Convex |

   Build command: `npx convex deploy --cmd 'npm run build'` (deploys the
   functions, then builds with the right `VITE_CONVEX_URL`), with
   `CONVEX_DEPLOY_KEY` set from the Convex dashboard. Add the domain
   `dashboard.layersyncai.com`.

6. **LayerSync's own site.** In the dashboard: All clients, New client
   ("LayerSync", domain `layersyncai.com`). In the website's Vercel project set
   `VITE_SYNCSITE_URL=https://dashboard.layersyncai.com` and
   `VITE_SYNCSITE_KEY=<key from Settings, Sites>`, then redeploy. The contact
   dialog and the diagnostic form start sending leads here. For the SyncEstate
   landing page (syncrm repo) add a second site and set
   `NEXT_PUBLIC_SYNCSITE_URL` / `NEXT_PUBLIC_SYNCSITE_KEY` there.

## Adding a client (every new website)

1. All clients, New client: business name, dashboard address, domain, the
   owner's email. The owner gets an invitation (staff can also copy the link to
   send on WhatsApp).
2. Paste the snippet from Settings, Sites into the site's `<head>`:
   ```html
   <script defer src="https://dashboard.layersyncai.com/s.js" data-site="ss_..."></script>
   ```
3. Connect the forms: add `data-syncsite-form="contact"` to each `<form>`, or
   call `await window.syncsite.lead({ form: "contact", fields: {...} })` from
   the site's own code and show `result.error` if `result.ok` is false.
4. Custom events: `data-syncsite-event="book_demo"` (plus
   `data-syncsite-prop-plan="pro"`) on any element, or `syncsite.track(name, props)`.
5. If the site has a signed-in area on the same domain, add
   `data-exclude="/account,/admin"` to the script tag and the same paths under
   Settings, Sites, Never track.

Owners can leave their own visits out by opening `https://their-site/?syncsite_ignore=1` once per browser.

## Connecting Claude (MCP)

Settings, Integrations, New key. The dialog shows the exact command for
Claude Code, the config for Claude Desktop and for other clients, e.g.

```bash
claude mcp add --transport http syncsite https://<deployment>.convex.site/mcp \
  --header "Authorization: Bearer ssk_..."
```

Tools: `list_sites`, `get_traffic_overview`, `get_live_visitors`,
`list_leads`, `get_lead`, `get_recent_activity`, and with a write key
`update_lead`, `add_lead_note`, `create_lead`. `get_recent_activity` is the one
to use for keeping another CRM in step ("since" a time). The server is
stateless Streamable HTTP (JSON responses, no SSE) and speaks protocol
versions 2024-11-05 through 2025-11-25.

## Privacy

- No cookies and nothing stored on the visitor's device. Visitors are counted
  per day with `hash(daily salt, site, IP, user agent)`; the salt is deleted
  each day, so nobody (including us) can follow someone across days or recover
  an IP. IPs and user agents are never written to the database.
- Do Not Track and Global Privacy Control turn analytics off (forms still work).
  Automated browsers and known bots are ignored.
- Only `utm_*` tags and the presence of ad click ids leave the browser; the
  rest of the query string doesn't. Emails, phone numbers and token-like ids in
  paths are masked before storage.
- Retention: raw pageviews 90 days, visits 400 days, webhook deliveries 30
  days, notifications 90 days; daily totals are kept.
- Lead data is the client's. Admins can export it and erase a person
  completely (contact, form sends, history, notifications).

The website's privacy policy (`pages/Legal.tsx`) describes exactly this.

## Security

See [SECURITY.md](SECURITY.md) for the full model. In short: invite-only
accounts tied to the invited email, role checks on every function, tenant
isolation enforced server-side from the caller's identity, hashed API keys and
invite tokens, signed webhooks with SSRF protection, rate limits on every
public entry point, a strict CSP on the dashboard, and an audit log.

## Development

```bash
npm run dev:backend      # npx convex dev
npm run dev              # dashboard on :5174; api/* served by Vite in dev
npm run demo             # the dashboard on sample data, no backend needed
npm test                 # unit + Convex integration tests (convex-test)
npm run test:tracker     # tracker in a real browser (needs Playwright)
npm run typecheck        # app + convex
npm run codegen          # regenerate convex/_generated without a deployment
```

To try the tracker locally, set `CONVEX_SITE_URL` and `SYNCSITE_INGEST_SECRET`
in `.env.local`, turn on "Accept visits from localhost" for a site, and add
`data-dev` to the script tag.
