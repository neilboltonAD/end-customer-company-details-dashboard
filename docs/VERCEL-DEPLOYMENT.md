# Vercel Deployment Notes (CRA + Serverless API)

This project deploys to Vercel as:

- A **static React app** (Create React App build output)
- A set of **serverless API routes** under `api/*`

## Required Environment Variables (Vercel)

Set these in Vercel Project Settings → Environment Variables (Production / Preview as needed).

### Entra (Azure AD) App Registration

- `AZURE_TENANT_ID`
- `AZURE_CLIENT_ID`
- `AZURE_CLIENT_SECRET` (recommended for Vercel; confidential client)

### Scopes (delegated, OAuth v2)

- `PARTNER_CENTER_SCOPE_DELEGATED`
  - Default: `https://api.partnercenter.microsoft.com/user_impersonation offline_access openid profile`
- `GDAP_GRAPH_SCOPES`
  - Default: `https://graph.microsoft.com/DelegatedAdminRelationship.Read.All offline_access openid profile`

### Durable Token Storage (Vercel KV / Upstash Redis)

Provide **one** of the following pairs:

- `KV_REST_API_URL` + `KV_REST_API_TOKEN`
- `VERCEL_KV_REST_API_URL` + `VERCEL_KV_REST_API_TOKEN`
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`

### Token Encryption

- `TOKEN_ENCRYPTION_KEY`
  - Base64-encoded 32-byte key (AES-256-GCM)
  - Generate: `openssl rand -base64 32`

## OAuth Redirect URIs

The OAuth callback is:

- `https://<your-domain>/api/partner-center/callback`

This exact callback URI must be registered in the Entra App Registration (Authentication → Web platform).

### Preview deployments

Vercel preview domains are dynamic. If you want OAuth to work in previews, you must add the preview callback domains as redirect URIs, or use a dedicated fixed staging domain.

## SPA routing

Client-side routes (e.g. `/operations/microsoft/onboarding/gdap`) are handled by a Vercel rewrite in `vercel.json` so deep links don’t 404.

## Local development

- UI: `npm run dev:ui` (or `npm run dev`)
- API server: `npm run dev:api` (or `npm run dev`)

The CRA dev server proxies `/api/*` to `http://localhost:4000` via the `proxy` setting in `package.json`.

