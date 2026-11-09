<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1iCRNYhwLCwuXx4YtEvY20fID2-760KVV

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## SyncSite (the client dashboard)

`dashboard/` holds SyncSite: website analytics, a lead inbox and a small CRM
for every site LayerSync builds, including this one. It deploys as its own
Vercel project (root directory `dashboard`). Setup, client onboarding and the
MCP server are in [dashboard/README.md](dashboard/README.md); the security
model is in [dashboard/SECURITY.md](dashboard/SECURITY.md).
