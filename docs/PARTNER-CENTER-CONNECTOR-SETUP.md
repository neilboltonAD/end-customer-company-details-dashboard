# Partner Center Connector Setup

This project uses a **server-side** connector (Vercel API routes under `api/`, plus a local dev server under `server/`) to call Microsoft Partner Center APIs.

## Required environment variables

Set these as **server/runtime environment variables** (local `.env.local`, Vercel project env, etc.):

- `AZURE_TENANT_ID`: Entra **Directory (tenant) ID** (GUID)
- `AZURE_CLIENT_ID`: Entra **Application (client) ID** (GUID)
- `AZURE_CLIENT_SECRET`: **Client secret value** (long random string) — **NOT** the “Secret ID”  
  Note: if your Entra app is configured as a **Single-Page Application (SPA)** (public client), Azure AD will *not* allow server-side token redemption/refresh using this secret.

Optional:

- `PARTNER_CENTER_SCOPE` (default: `https://api.partnercenter.microsoft.com/.default`)
- `PARTNER_CENTER_BASE_URL` (default: `https://api.partnercenter.microsoft.com`)
- `AZURE_CLIENT_TYPE`:
  - `auto` (default): attempts server-side flows; falls back when Azure AD forces SPA redemption
  - `spa`: **forces browser-based auth code redemption** (recommended if you see `AADSTS9002327`)
  - `confidential`: forces server-side confidential-client behavior

## Health check

The UI “Connector Sync” button calls:

- `GET /api/partner-center/health`

Which performs a lightweight Partner Center request and returns:

- `ok`: true/false
- `mfa.amr`: the authentication methods (must include `mfa` for Partner Center App+User calls)
- `customersSample`: first 10 customers (when successful)

Important:

- If your tenant blocks **app-only** Partner Center access, `health` may return `403` until you click **Connect** (App+User + MFA).
- If you are using an **SPA app registration**, Azure AD restricts token exchange/refresh to the **browser** (CORS) and you may see `AADSTS9002327` unless SPA mode is used.

## Local development

Run the UI and local API server together:

- `npm run dev`

This starts:

- UI: `http://localhost:3000`
- API: `http://localhost:4000`

The local API server (`server/partnerCenterDevServer.js`) implements the Partner Center connect flow:

- **PKCE (S256)** for authorization code flow
- SPA fallback: for SPA client-type apps, auth code redemption is completed in the browser and tokens are posted back to the dev server (`POST /api/partner-center/store`) for local storage

