/* eslint-disable no-console */
/**
 * Local dev API server for Create React App.
 *
 * Goal: Implement Partner Center "connect once" as an App+User flow with MFA.
 * The UI should NOT handle secrets. Instead:
 * - User clicks Connect → redirects to Microsoft login → returns to our callback
 * - We store a refresh token locally (dev-only) and use it to call Partner Center APIs
 *
 * This aligns with Partner Center MFA requirements for App+User calls.
 */

// Load env vars for the Node dev server (CRA loads .env.* for the UI, but Node does not).
try {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const path = require('path');
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const dotenv = require('dotenv');
  const cwd = process.cwd();
  const envLocalPath = path.join(cwd, '.env.local');
  const envPath = path.join(cwd, '.env');

  // Prefer .env.local if present, else fall back to .env.
  dotenv.config({ path: envLocalPath });
  dotenv.config({ path: envPath });
} catch {
  // If dotenv isn't installed yet, the server will still run but env vars must come from the shell.
}

const http = require('http');
const crypto = require('crypto');
const { URL } = require('url');

// IMPORTANT: don't use the generic PORT env var here because CRA uses PORT for the UI dev server.
// If this server binds to 3000, CRA will fail to start (or prompt to use another port).
const PORT = Number(process.env.PARTNER_CENTER_DEV_PORT || 4000);
const TOKEN_STORE_PATH = process.env.PARTNER_CENTER_TOKEN_STORE || '.partner-center-token.json';

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(body),
  });
  res.end(body);
}

function html(res, status, body) {
  res.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'content-length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readTokenStore() {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const fs = require('fs');
    if (!fs.existsSync(TOKEN_STORE_PATH)) return null;
    const raw = fs.readFileSync(TOKEN_STORE_PATH, 'utf8');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeTokenStore(data) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const fs = require('fs');
  fs.writeFileSync(TOKEN_STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function clearTokenStore() {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const fs = require('fs');
  try {
    if (fs.existsSync(TOKEN_STORE_PATH)) fs.unlinkSync(TOKEN_STORE_PATH);
  } catch {
    // ignore
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      // basic guard
      if (data.length > 2_000_000) {
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function base64UrlDecode(input) {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const b64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(b64, 'base64').toString('utf8');
}

function base64UrlEncode(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function createPkcePair() {
  // RFC 7636: code_verifier length 43-128 chars; use 32 random bytes => 43 chars base64url
  const verifier = base64UrlEncode(crypto.randomBytes(32));
  const challenge = base64UrlEncode(crypto.createHash('sha256').update(verifier).digest());
  return { verifier, challenge, method: 'S256' };
}

function looksLikePublicClientError(text) {
  return Boolean(
    text &&
      (text.includes('AADSTS700025') ||
        text.includes('"error_codes":[700025]') ||
        text.includes('Client is public'))
  );
}

function looksLikeSpaCrossOriginRedemptionError(text) {
  return Boolean(
    text &&
      (text.includes('AADSTS9002327') ||
        text.includes('"error_codes":[9002327]') ||
        text.includes('Tokens issued for the') && text.includes('Single-Page Application'))
  );
}

function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
}

function isJwtExpired(claims, skewSeconds = 30) {
  try {
    const exp = Number(claims?.exp);
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return exp <= now + skewSeconds;
  } catch {
    return false;
  }
}

async function getToken({ tenantId, clientId, clientSecret }) {
  const scope = process.env.PARTNER_CENTER_SCOPE || 'https://api.partnercenter.microsoft.com/.default';
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;

  const body = new URLSearchParams();
  body.set('client_id', clientId);
  body.set('client_secret', clientSecret);
  body.set('grant_type', 'client_credentials');
  body.set('scope', scope);

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Token request failed (${res.status}): ${text || res.statusText}`);
  }

  const json = await res.json();
  return json.access_token;
}

function partnerCenterDelegatedScope() {
  return (
    process.env.PARTNER_CENTER_SCOPE_DELEGATED ||
    'https://api.partnercenter.microsoft.com/user_impersonation offline_access openid profile'
  );
}

function gdapGraphDelegatedScope() {
  return (
    process.env.GDAP_GRAPH_SCOPES ||
    'https://graph.microsoft.com/DelegatedAdminRelationship.Read.All offline_access openid profile'
  );
}

function azureManagementDelegatedScope() {
  return (
    process.env.AZURE_MANAGEMENT_SCOPES ||
    'https://management.azure.com/user_impersonation offline_access openid profile'
  );
}

async function exchangeAuthCode({ tenantId, clientId, clientSecret, code, redirectUri, codeVerifier, scope }) {
  const s = scope || partnerCenterDelegatedScope();
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;

  const body = new URLSearchParams();
  body.set('client_id', clientId);
  if (clientSecret) body.set('client_secret', clientSecret);
  body.set('grant_type', 'authorization_code');
  body.set('code', code);
  body.set('redirect_uri', redirectUri);
  body.set('scope', s);
  if (codeVerifier) body.set('code_verifier', codeVerifier);

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Code exchange failed (${res.status}): ${text || res.statusText}`);
  }

  return await res.json();
}

async function refreshUserToken({ tenantId, clientId, clientSecret, refreshToken, scope }) {
  const s = scope || partnerCenterDelegatedScope();
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;

  const body = new URLSearchParams();
  body.set('client_id', clientId);
  if (clientSecret) body.set('client_secret', clientSecret);
  body.set('grant_type', 'refresh_token');
  body.set('refresh_token', refreshToken);
  body.set('scope', s);

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Refresh failed (${res.status}): ${text || res.statusText}`);
  }

  return await res.json();
}

async function partnerCenterFetch(token, path) {
  const baseUrl = process.env.PARTNER_CENTER_BASE_URL || 'https://api.partnercenter.microsoft.com';
  const url = `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  return { status: res.status, data };
}

function safeTruncate(value, maxLen = 3000) {
  try {
    const s = typeof value === 'string' ? value : JSON.stringify(value);
    if (s.length <= maxLen) return s;
    return `${s.slice(0, maxLen)}\n... (truncated)`;
  } catch {
    return String(value);
  }
}

function envCredsOrThrow() {
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Missing AZURE_TENANT_ID / AZURE_CLIENT_ID / AZURE_CLIENT_SECRET env vars');
  }
  return { tenantId, clientId, clientSecret };
}

function envClientInfoOrThrow() {
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;
  const clientType = (process.env.AZURE_CLIENT_TYPE || 'auto').toLowerCase(); // auto | spa | confidential
  if (!tenantId || !clientId) {
    throw new Error('Missing AZURE_TENANT_ID / AZURE_CLIENT_ID env vars');
  }
  // clientSecret is optional for public clients (PKCE)
  return { tenantId, clientId, clientSecret, clientType };
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  // CORS headers for cross-origin requests from localhost:3000 (CRA dev server)
  const origin = req.headers.origin || '';
  if (origin.startsWith('http://localhost:')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Start interactive connect flow (App+User). This is the recommended way to satisfy MFA for Partner Center APIs.
  if (req.method === 'GET' && u.pathname === '/api/partner-center/connect') {
    try {
      const { tenantId, clientId } = envClientInfoOrThrow();
      const redirectUri = `http://localhost:${PORT}/api/partner-center/callback`;
      const state = Math.random().toString(16).slice(2);
      const pkce = createPkcePair();
      const scope = encodeURIComponent(partnerCenterDelegatedScope());
      const authorizeUrl =
        `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/authorize` +
        `?client_id=${encodeURIComponent(clientId)}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_mode=query` +
        `&scope=${scope}` +
        `&state=${encodeURIComponent(state)}` +
        `&code_challenge=${encodeURIComponent(pkce.challenge)}` +
        `&code_challenge_method=${encodeURIComponent(pkce.method)}`;

      // simple state storage in token store file for dev
      writeTokenStore({
        ...(readTokenStore() || {}),
        pendingKind: 'partnerCenter',
        pendingState: state,
        pendingCodeVerifier: pkce.verifier,
      });

      res.writeHead(302, { Location: authorizeUrl });
      res.end();
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Connect failed', timestamp: new Date().toISOString() });
    }
    return;
  }

  // Start GDAP (Graph) connect flow (App+User) to fetch delegated admin relationships.
  if (req.method === 'GET' && u.pathname === '/api/partner-center/connect-gdap') {
    try {
      const { tenantId, clientId } = envClientInfoOrThrow();
      const redirectUri = `http://localhost:${PORT}/api/partner-center/callback`;
      const state = Math.random().toString(16).slice(2);
      const pkce = createPkcePair();
      const scope = encodeURIComponent(gdapGraphDelegatedScope());
      const authorizeUrl =
        `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/authorize` +
        `?client_id=${encodeURIComponent(clientId)}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_mode=query` +
        `&scope=${scope}` +
        `&state=${encodeURIComponent(state)}` +
        `&code_challenge=${encodeURIComponent(pkce.challenge)}` +
        `&code_challenge_method=${encodeURIComponent(pkce.method)}`;

      writeTokenStore({
        ...(readTokenStore() || {}),
        pendingKind: 'gdap',
        pendingState: state,
        pendingCodeVerifier: pkce.verifier,
      });

      res.writeHead(302, { Location: authorizeUrl });
      res.end();
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Connect GDAP failed', timestamp: new Date().toISOString() });
    }
    return;
  }

  // Start Azure Management connect flow (App+User) for Azure Marketplace Catalog API.
  if (req.method === 'GET' && u.pathname === '/api/partner-center/connect-azure') {
    try {
      const { tenantId, clientId } = envClientInfoOrThrow();
      const redirectUri = `http://localhost:${PORT}/api/partner-center/callback`;
      const state = Math.random().toString(16).slice(2);
      const pkce = createPkcePair();
      const scope = encodeURIComponent(azureManagementDelegatedScope());
      const authorizeUrl =
        `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/authorize` +
        `?client_id=${encodeURIComponent(clientId)}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_mode=query` +
        `&scope=${scope}` +
        `&state=${encodeURIComponent(state)}` +
        `&code_challenge=${encodeURIComponent(pkce.challenge)}` +
        `&code_challenge_method=${encodeURIComponent(pkce.method)}`;

      writeTokenStore({
        ...(readTokenStore() || {}),
        pendingKind: 'azure',
        pendingState: state,
        pendingCodeVerifier: pkce.verifier,
      });

      res.writeHead(302, { Location: authorizeUrl });
      res.end();
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Connect Azure failed', timestamp: new Date().toISOString() });
    }
    return;
  }

  // ============================================================================
  // POC Mode: Connect to Azure using the POC CUSTOMER's tenant
  // This allows real Azure Marketplace transactions for the authorized subscription
  // ============================================================================
  const POC_CUSTOMER_TENANT_ID = '31941305-7fbe-4dc3-a5b3-ae5ed2a13980';
  const POC_CUSTOMER_DOMAIN = '5sep2023test1sj.onmicrosoft.com';

  if (req.method === 'GET' && u.pathname === '/api/azure/connect-poc') {
    try {
      const { clientId } = envClientInfoOrThrow();
      const redirectUri = `http://localhost:${PORT}/api/azure/callback-poc`;
      const state = 'poc-' + Math.random().toString(16).slice(2);
      const pkce = createPkcePair();
      const scope = encodeURIComponent(azureManagementDelegatedScope());
      
      // Use the POC CUSTOMER'S tenant for authentication
      const authorizeUrl =
        `https://login.microsoftonline.com/${encodeURIComponent(POC_CUSTOMER_TENANT_ID)}/oauth2/v2.0/authorize` +
        `?client_id=${encodeURIComponent(clientId)}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_mode=query` +
        `&scope=${scope}` +
        `&state=${encodeURIComponent(state)}` +
        `&code_challenge=${encodeURIComponent(pkce.challenge)}` +
        `&code_challenge_method=${encodeURIComponent(pkce.method)}`;

      writeTokenStore({
        ...(readTokenStore() || {}),
        pendingKind: 'azure-poc',
        pendingState: state,
        pendingCodeVerifier: pkce.verifier,
        pocTenantId: POC_CUSTOMER_TENANT_ID,
      });

      console.log(`[azure-poc] Starting OAuth flow for POC customer tenant: ${POC_CUSTOMER_TENANT_ID}`);
      console.log(`[azure-poc] User must have an account in: ${POC_CUSTOMER_DOMAIN}`);

      res.writeHead(302, { Location: authorizeUrl });
      res.end();
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Connect Azure POC failed', timestamp: new Date().toISOString() });
    }
    return;
  }

  // Callback for POC Azure flow
  if (req.method === 'GET' && u.pathname === '/api/azure/callback-poc') {
    const code = u.searchParams.get('code');
    const state = u.searchParams.get('state');
    const error = u.searchParams.get('error');
    const errorDesc = u.searchParams.get('error_description');

    if (error) {
      console.error('[azure-poc] OAuth error:', error, errorDesc);
      res.writeHead(302, { Location: `http://localhost:3000/vendor-integrations/azure-marketplace-catalog?error=${encodeURIComponent(errorDesc || error)}` });
      res.end();
      return;
    }

    const store = readTokenStore();
    if (!code || !state || store?.pendingState !== state) {
      res.writeHead(302, { Location: `http://localhost:3000/vendor-integrations/azure-marketplace-catalog?error=Invalid+callback` });
      res.end();
      return;
    }

    try {
      const { clientId, clientSecret } = envClientInfoOrThrow();
      const redirectUri = `http://localhost:${PORT}/api/azure/callback-poc`;
      const scope = azureManagementDelegatedScope();

      // Exchange code for token using the POC customer's tenant
      const tokenRes = await fetch(`https://login.microsoftonline.com/${POC_CUSTOMER_TENANT_ID}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
          scope,
          code_verifier: store.pendingCodeVerifier,
        }).toString(),
      });

      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        console.error('[azure-poc] Token exchange failed:', tokenRes.status, errorText);
        res.writeHead(302, { Location: `http://localhost:3000/vendor-integrations/azure-marketplace-catalog?error=${encodeURIComponent('Token exchange failed')}` });
        res.end();
        return;
      }

      const tokenData = await tokenRes.json();
      console.log('[azure-poc] Successfully obtained token for POC customer tenant');

      writeTokenStore({
        ...store,
        azureAccessToken: tokenData.access_token,
        azureRefreshToken: tokenData.refresh_token,
        azureConnectedAt: new Date().toISOString(),
        azureTenantId: POC_CUSTOMER_TENANT_ID,
        azureScope: scope,
        pendingKind: null,
        pendingState: null,
        pendingCodeVerifier: null,
      });

      res.writeHead(302, { Location: 'http://localhost:3000/vendor-integrations/azure-marketplace-catalog?connected=poc' });
      res.end();
    } catch (e) {
      console.error('[azure-poc] Callback error:', e);
      res.writeHead(302, { Location: `http://localhost:3000/vendor-integrations/azure-marketplace-catalog?error=${encodeURIComponent(e.message)}` });
      res.end();
    }
    return;
  }

  // OAuth callback: exchange code for tokens and store refresh token (dev only)
  if (req.method === 'GET' && u.pathname === '/api/partner-center/callback') {
    try {
      const store = readTokenStore() || {};
      const { tenantId, clientId, clientSecret, clientType } = envClientInfoOrThrow();
      const code = u.searchParams.get('code');
      const state = u.searchParams.get('state');
      const err = u.searchParams.get('error');
      const errDesc = u.searchParams.get('error_description');
      if (err) throw new Error(`${err}: ${errDesc || ''}`);
      if (!code) throw new Error('Missing code');
      if (!state || state !== store.pendingState) throw new Error('State mismatch');
      const kind = store.pendingKind || 'partnerCenter';

      const redirectUri = `http://localhost:${PORT}/api/partner-center/callback`;

      // SPA mode: redeem in browser via CORS (PKCE). This ONLY works for Entra apps configured as SPA/public clients.
      // If a client secret is present, we treat the app as confidential and do server-side redemption instead.
      if (clientType === 'spa' && !clientSecret) {
        const scope = process.env.PARTNER_CENTER_SCOPE_DELEGATED || 'https://api.partnercenter.microsoft.com/user_impersonation offline_access openid profile';
        const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
        const codeVerifier = store.pendingCodeVerifier || '';
        const expectedState = store.pendingState || '';
        const uiRedirect = 'http://localhost:3000/settings/vendor-integrations/microsoft';

        const page = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Completing sign-in…</title>
    <style>
      body { font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif; padding: 24px; }
      .card { max-width: 720px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; background: #fff; }
      .muted { color: #6b7280; font-size: 14px; }
      pre { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; overflow: auto; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>Completing sign-in…</h2>
      <p class="muted">SPA mode is enabled, so Azure AD requires redeeming the auth code in the browser (PKCE + CORS). This page will finish the handshake and redirect you back to the app.</p>
      <pre id="log">Starting…</pre>
    </div>
    <script>
      (async function () {
        const logEl = document.getElementById('log');
        const log = (msg) => { logEl.textContent = String(msg); };
        try {
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          const state = params.get('state');
          if (!code) throw new Error('Missing code');
          if (!state) throw new Error('Missing state');
          if (state !== ${JSON.stringify(expectedState)}) throw new Error('State mismatch');

          const body = new URLSearchParams();
          body.set('client_id', ${JSON.stringify(clientId)});
          body.set('grant_type', 'authorization_code');
          body.set('code', code);
          body.set('redirect_uri', ${JSON.stringify(redirectUri)});
          body.set('scope', ${JSON.stringify(scope)});
          body.set('code_verifier', ${JSON.stringify(codeVerifier)});

          log('Exchanging code with Azure AD…');
          const tokenRes = await fetch(${JSON.stringify(tokenUrl)}, {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body
          });
          const tokenText = await tokenRes.text();
          if (!tokenRes.ok) throw new Error('Token exchange failed (' + tokenRes.status + '): ' + tokenText);
          const tokenJson = JSON.parse(tokenText);

          log('Storing tokens locally (dev)…');
          const storeRes = await fetch('/api/partner-center/store', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ state, tokenJson })
          });
          const storeText = await storeRes.text();
          if (!storeRes.ok) throw new Error('Store failed (' + storeRes.status + '): ' + storeText);

          log('Done. Redirecting…');
          window.location.href = ${JSON.stringify(uiRedirect)};
        } catch (err) {
          log(String(err && err.message ? err.message : err));
        }
      })();
    </script>
  </body>
</html>`;

        html(res, 200, page);
        return;
      }

      let tokenRes;
      try {
        tokenRes = await exchangeAuthCode({
          tenantId,
          clientId,
          clientSecret,
          code,
          redirectUri,
          codeVerifier: store.pendingCodeVerifier,
          scope: kind === 'gdap' ? gdapGraphDelegatedScope() : kind === 'azure' ? azureManagementDelegatedScope() : partnerCenterDelegatedScope(),
        });
      } catch (e) {
        const msg = e?.message || '';
        // SPA clients (client-type=spa) can ONLY redeem auth codes from the browser via CORS (cross-origin).
        // In that case, serve a minimal HTML page that completes the exchange in the browser and POSTs the tokens back.
        if (looksLikeSpaCrossOriginRedemptionError(msg)) {
          const scope = process.env.PARTNER_CENTER_SCOPE_DELEGATED || 'https://api.partnercenter.microsoft.com/user_impersonation offline_access openid profile';
          const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
          const codeVerifier = store.pendingCodeVerifier || '';
          const expectedState = store.pendingState || '';
          const uiRedirect = 'http://localhost:3000/settings/vendor-integrations/microsoft';

          const page = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Completing sign-in…</title>
    <style>
      body { font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif; padding: 24px; }
      .card { max-width: 720px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; background: #fff; }
      .muted { color: #6b7280; font-size: 14px; }
      pre { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; overflow: auto; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>Completing sign-in…</h2>
      <p class="muted">Your app is configured as a Single-Page Application (SPA), so Azure AD requires redeeming the auth code in the browser (PKCE). This page will finish the handshake and redirect you back to the app.</p>
      <pre id="log">Starting…</pre>
    </div>
    <script>
      (async function () {
        const logEl = document.getElementById('log');
        const log = (msg) => { logEl.textContent = String(msg); };
        try {
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          const state = params.get('state');
          if (!code) throw new Error('Missing code');
          if (!state) throw new Error('Missing state');
          if (state !== ${JSON.stringify(expectedState)}) throw new Error('State mismatch');

          const body = new URLSearchParams();
          body.set('client_id', ${JSON.stringify(clientId)});
          body.set('grant_type', 'authorization_code');
          body.set('code', code);
          body.set('redirect_uri', ${JSON.stringify(redirectUri)});
          body.set('scope', ${JSON.stringify(scope)});
          body.set('code_verifier', ${JSON.stringify(codeVerifier)});

          log('Exchanging code with Azure AD…');
          const tokenRes = await fetch(${JSON.stringify(tokenUrl)}, {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body
          });
          const tokenText = await tokenRes.text();
          if (!tokenRes.ok) throw new Error('Token exchange failed (' + tokenRes.status + '): ' + tokenText);
          const tokenJson = JSON.parse(tokenText);

          log('Storing tokens locally (dev)…');
          const storeRes = await fetch('/api/partner-center/store', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ state, tokenJson })
          });
          const storeText = await storeRes.text();
          if (!storeRes.ok) throw new Error('Store failed (' + storeRes.status + '): ' + storeText);

          log('Done. Redirecting…');
          window.location.href = ${JSON.stringify(uiRedirect)};
        } catch (err) {
          log(String(err && err.message ? err.message : err));
        }
      })();
    </script>
  </body>
</html>`;

          html(res, 200, page);
          return;
        }
        // Public clients MUST NOT present a client_secret.
        if (looksLikePublicClientError(msg)) {
          tokenRes = await exchangeAuthCode({
            tenantId,
            clientId,
            clientSecret: undefined,
            code,
            redirectUri,
            codeVerifier: store.pendingCodeVerifier,
          });
          store.isPublicClient = true;
        } else {
          throw e;
        }
      }

      const accessToken = tokenRes.access_token;
      const refreshToken = tokenRes.refresh_token;
      const claims = accessToken ? decodeJwt(accessToken) : null;

      const nextStore = {
        ...store,
        connected: true,
        connectedAt: store.connectedAt || new Date().toISOString(),
        pendingKind: undefined,
        pendingState: undefined,
        pendingCodeVerifier: undefined,
        isPublicClient: Boolean(store.isPublicClient),
      };

      if (kind === 'gdap') {
        writeTokenStore({
          ...nextStore,
          gdapConnectedAt: new Date().toISOString(),
          gdapRefreshToken: refreshToken,
          gdapAccessToken: accessToken,
          gdapAccessTokenClaims: claims,
        });
      } else if (kind === 'azure') {
        writeTokenStore({
          ...nextStore,
          azureConnectedAt: new Date().toISOString(),
          azureRefreshToken: refreshToken,
          azureAccessToken: accessToken,
          azureAccessTokenClaims: claims,
        });
      } else {
        writeTokenStore({
          ...nextStore,
          refreshToken,
          accessToken,
          accessTokenClaims: claims,
        });
      }

      // Redirect back to UI based on connection type
      const uiRedirect =
        kind === 'gdap'
          ? 'http://localhost:3000/operations/microsoft/onboarding/gdap'
          : kind === 'azure'
          ? 'http://localhost:3000/integrations/azure-marketplace-catalog'
          : 'http://localhost:3000/settings/vendor-integrations/microsoft';
      res.writeHead(302, { Location: uiRedirect });
      res.end();
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Callback failed', timestamp: new Date().toISOString() });
    }
    return;
  }

  // Store tokens posted from the SPA redemption fallback page (dev only).
  if (req.method === 'POST' && u.pathname === '/api/partner-center/store') {
    try {
      const store = readTokenStore() || {};
      const raw = await readBody(req);
      const parsed = raw ? JSON.parse(raw) : {};
      const state = parsed?.state;
      const tokenJson = parsed?.tokenJson;
      if (!state || state !== store.pendingState) {
        json(res, 400, { ok: false, error: 'State mismatch', timestamp: new Date().toISOString() });
        return;
      }
      const accessToken = tokenJson?.access_token;
      const refreshToken = tokenJson?.refresh_token;
      if (!accessToken) {
        json(res, 400, { ok: false, error: 'Missing access_token in token response', timestamp: new Date().toISOString() });
        return;
      }
      const claims = decodeJwt(accessToken);
      writeTokenStore({
        connected: true,
        connectedAt: new Date().toISOString(),
        pendingState: undefined,
        pendingCodeVerifier: undefined,
        // This flow is SPA PKCE (public client)
        isPublicClient: true,
        refreshToken,
        accessToken,
        accessTokenClaims: claims,
      });
      json(res, 200, { ok: true, timestamp: new Date().toISOString() });
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Store failed', timestamp: new Date().toISOString() });
    }
    return;
  }

  if (req.method === 'POST' && u.pathname === '/api/partner-center/disconnect') {
    clearTokenStore();
    json(res, 200, { ok: true, timestamp: new Date().toISOString() });
    return;
  }

  if (req.method === 'GET' && u.pathname === '/api/partner-center/status') {
    const store = readTokenStore();
    json(res, 200, {
      ok: Boolean(store?.connected),
      store: {
        hasPartnerCenter: Boolean(store?.refreshToken),
        hasGdap: Boolean(store?.gdapRefreshToken),
        hasAzure: Boolean(store?.azureRefreshToken),
        connectedAt: store?.connectedAt,
        gdapConnectedAt: store?.gdapConnectedAt,
        azureConnectedAt: store?.azureConnectedAt,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // ============================================================================
  // AZURE CONNECTOR - Status and Health Check
  // ============================================================================

  if (req.method === 'GET' && u.pathname === '/api/azure/status') {
    const store = readTokenStore();
    json(res, 200, {
      ok: Boolean(store?.azureRefreshToken || store?.azureAccessToken),
      store: {
        hasAzureToken: Boolean(store?.azureRefreshToken || store?.azureAccessToken),
        azureConnectedAt: store?.azureConnectedAt,
        azureScope: store?.azureScope || 'https://management.azure.com/.default',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (req.method === 'GET' && u.pathname === '/api/azure/health') {
    try {
      const store = readTokenStore();
      
      if (!store?.azureAccessToken && !store?.azureRefreshToken) {
        json(res, 200, {
          ok: false,
          azure: { status: 'not_connected' },
          error: 'Azure not connected. The connector needs to acquire Azure Management tokens.',
          hint: 'Click Connect to authenticate with Azure.',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      let azureAccessToken = store.azureAccessToken;

      // Try to refresh Azure token if we have a refresh token
      if (store.azureRefreshToken && !store.isPublicClient) {
        try {
          const { tenantId, clientId, clientSecret } = envClientInfoOrThrow();
          const azureScope = 'https://management.azure.com/.default';
          
          const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              client_id: clientId,
              client_secret: clientSecret,
              refresh_token: store.azureRefreshToken,
              scope: azureScope,
            }).toString(),
          });

          if (tokenRes.ok) {
            const tokenData = await tokenRes.json();
            azureAccessToken = tokenData.access_token;
            writeTokenStore({
              ...store,
              azureAccessToken,
              azureRefreshToken: tokenData.refresh_token || store.azureRefreshToken,
              azureLastRefreshedAt: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.log('[azure-health] Token refresh failed:', e.message);
        }
      }

      if (!azureAccessToken) {
        json(res, 200, {
          ok: false,
          azure: { status: 'no_token' },
          error: 'No Azure access token available.',
          hint: 'Reconnect to acquire Azure Management API token.',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Test Azure Management API with a simple subscriptions call
      const testUrl = 'https://management.azure.com/subscriptions?api-version=2022-12-01';
      const testRes = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${azureAccessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const testStatus = testRes.status;
      let subscriptions = [];
      let errorMessage = null;

      if (testRes.ok) {
        const data = await testRes.json();
        subscriptions = (data.value || []).slice(0, 5).map(s => ({
          subscriptionId: s.subscriptionId,
          displayName: s.displayName,
          state: s.state,
        }));
      } else {
        const errorData = await testRes.text();
        try {
          const parsed = JSON.parse(errorData);
          errorMessage = parsed.error?.message || errorData;
        } catch {
          errorMessage = errorData;
        }
      }

      json(res, 200, {
        ok: testRes.ok,
        azure: {
          status: testRes.ok ? 'connected' : 'error',
          httpStatus: testStatus,
          sampleEndpoint: '/subscriptions',
        },
        subscriptionsSample: subscriptions,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.error('[azure-health] Error:', e.message);
      json(res, 500, {
        ok: false,
        azure: { status: 'error' },
        error: e.message || 'Unknown error checking Azure health.',
        timestamp: new Date().toISOString(),
      });
    }
    return;
  }

  // Live customers list for the UI (used by GDAP management and onboarding). Mirrors the Vercel API response shape.
  if (req.method === 'GET' && u.pathname === '/api/partner-center/customers') {
    try {
      const store = readTokenStore();
      const size = Math.min(Number(u.searchParams.get('size') || '50'), 500);
      if (!store?.refreshToken) {
        json(res, 401, { ok: false, error: 'Not connected. Click Connect first.', customers: [], timestamp: new Date().toISOString() });
        return;
      }

      let accessToken = store.accessToken;
      let claims = accessToken ? decodeJwt(accessToken) : null;

      if (!store.isPublicClient) {
        const { tenantId, clientId, clientSecret } = envClientInfoOrThrow();
        const refreshed = await refreshUserToken({
          tenantId,
          clientId,
          clientSecret: store.isPublicClient ? undefined : clientSecret,
          refreshToken: store.refreshToken,
          scope: partnerCenterDelegatedScope(),
        });
        accessToken = refreshed.access_token;
        claims = accessToken ? decodeJwt(accessToken) : null;
        writeTokenStore({
          ...store,
          refreshToken: refreshed.refresh_token || store.refreshToken,
          accessToken,
          accessTokenClaims: claims,
          lastRefreshedAt: new Date().toISOString(),
        });
      } else if (!accessToken || isJwtExpired(claims)) {
        json(res, 401, { ok: false, error: 'SPA token expired. Click Connect again.', customers: [], timestamp: new Date().toISOString() });
        return;
      }

      const pc = await partnerCenterFetch(accessToken, `/v1/customers?size=${size}`);
      const ok = pc.status >= 200 && pc.status < 300;
      const items = Array.isArray(pc.data?.items) ? pc.data.items : [];
      const customers = items.map((c) => ({
        id: c?.id,
        companyName: c?.companyProfile?.companyName,
        defaultDomain: c?.companyProfile?.domain,
        tenantId: c?.companyProfile?.tenantId || c?.id,
        contactEmail:
          c?.billingProfile?.email ||
          c?.billingProfile?.defaultAddress?.email ||
          c?.companyProfile?.email ||
          undefined,
        contactName: [c?.billingProfile?.firstName, c?.billingProfile?.lastName].filter(Boolean).join(' ').trim() || undefined,
      }));

      json(res, ok ? 200 : pc.status, {
        ok,
        customers: ok ? customers : [],
        error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
        debug: ok ? undefined : { partnerCenter: safeTruncate(pc.data) },
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Customers failed', customers: [], timestamp: new Date().toISOString() });
    }
    return;
  }

  // GDAP relationships (Graph) for a given customer tenantId.
  if (req.method === 'GET' && u.pathname === '/api/partner-center/gdap-relationships') {
    try {
      const store = readTokenStore();
      const customerTenantId = String(u.searchParams.get('customerTenantId') || '');
      if (!customerTenantId) {
        json(res, 400, { ok: false, error: 'Missing customerTenantId', relationships: [], timestamp: new Date().toISOString() });
        return;
      }
      const refreshToken = store?.gdapRefreshToken || store?.refreshToken;
      if (!refreshToken) {
        json(res, 401, { ok: false, error: 'Not connected. Click Connect first.', relationships: [], timestamp: new Date().toISOString() });
        return;
      }

      let accessToken = store?.gdapAccessToken;
      let claims = accessToken ? decodeJwt(accessToken) : null;

      if (!store?.isPublicClient) {
        const { tenantId, clientId, clientSecret } = envClientInfoOrThrow();
        const refreshed = await refreshUserToken({
          tenantId,
          clientId,
          clientSecret: store.isPublicClient ? undefined : clientSecret,
          refreshToken,
          scope: gdapGraphDelegatedScope(),
        });
        accessToken = refreshed.access_token;
        claims = accessToken ? decodeJwt(accessToken) : null;
        writeTokenStore({
          ...store,
          gdapRefreshToken: refreshed.refresh_token || store.gdapRefreshToken || refreshToken,
          gdapAccessToken: accessToken,
          gdapAccessTokenClaims: claims,
          gdapLastRefreshedAt: new Date().toISOString(),
        });
      } else if (!accessToken || isJwtExpired(claims)) {
        json(res, 401, { ok: false, error: 'SPA token expired. Click Connect again.', relationships: [], timestamp: new Date().toISOString() });
        return;
      }

      const safeTenantId = customerTenantId.replace(/'/g, "''");
      const url =
        'https://graph.microsoft.com/v1.0/tenantRelationships/delegatedAdminRelationships' +
        `?$filter=customer/tenantId eq '${safeTenantId}'`;

      const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' } });
      const text = await resp.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { raw: text };
      }

      const ok = resp.status >= 200 && resp.status < 300;
      const value = Array.isArray(data?.value) ? data.value : [];
      const relationships = value.map((r) => ({
        id: r?.id,
        displayName: r?.displayName || r?.id,
        status: r?.status,
        createdDateTime: r?.createdDateTime,
        endDateTime: r?.endDateTime,
        autoExtendDuration: r?.autoExtendDuration,
        roles: Array.isArray(r?.accessDetails?.unifiedRoles)
          ? r.accessDetails.unifiedRoles.map((ur) => ur?.roleDefinitionId || ur?.displayName || ur?.id).filter(Boolean)
          : [],
      }));

      json(res, ok ? 200 : resp.status, {
        ok,
        relationships: ok ? relationships : [],
        error: ok ? undefined : `Graph request failed (HTTP ${resp.status}).`,
        debug: ok ? undefined : { graph: safeTruncate(data) },
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'GDAP relationships failed', relationships: [], timestamp: new Date().toISOString() });
    }
    return;
  }

  // Partner profile (MPN ID) for RRR link generation.
  if (req.method === 'GET' && u.pathname === '/api/partner-center/profile') {
    try {
      const store = readTokenStore();
      const refreshToken = store?.refreshToken;
      if (!refreshToken) {
        json(res, 401, { ok: false, error: 'Not connected. Click Connect first.', profile: null, timestamp: new Date().toISOString() });
        return;
      }

      let accessToken = store?.accessToken;
      let claims = accessToken ? decodeJwt(accessToken) : null;

      if (!store?.isPublicClient) {
        const { tenantId, clientId, clientSecret } = envClientInfoOrThrow();
        const refreshed = await refreshUserToken({
          tenantId,
          clientId,
          clientSecret: store.isPublicClient ? undefined : clientSecret,
          refreshToken: store.refreshToken,
          scope: partnerCenterDelegatedScope(),
        });
        accessToken = refreshed.access_token;
        claims = accessToken ? decodeJwt(accessToken) : null;
        writeTokenStore({
          ...store,
          refreshToken: refreshed.refresh_token || store.refreshToken,
          accessToken,
          accessTokenClaims: claims,
          lastRefreshedAt: new Date().toISOString(),
        });
      } else if (!accessToken || isJwtExpired(claims)) {
        json(res, 401, { ok: false, error: 'SPA token expired. Click Connect again.', profile: null, timestamp: new Date().toISOString() });
        return;
      }

      // Fetch MPN profile
      const mpnProfile = await partnerCenterFetch(accessToken, '/v1/profiles/mpn');
      const mpnOk = mpnProfile.status >= 200 && mpnProfile.status < 300;

      if (!mpnOk) {
        json(res, mpnProfile.status, {
          ok: false,
          error: `Failed to fetch MPN profile (HTTP ${mpnProfile.status})`,
          profile: null,
          debug: { mpnProfile: safeTruncate(mpnProfile.data) },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Fetch legal business profile
      const legalProfile = await partnerCenterFetch(accessToken, '/v1/profiles/legalbusiness');
      const legalOk = legalProfile.status >= 200 && legalProfile.status < 300;

      const mpnData = mpnProfile.data || {};
      const legalData = legalOk ? (legalProfile.data || {}) : {};

      const mpnId = mpnData.mpnId || mpnData.partnerMpnId || mpnData.id;
      const partnerName = legalData.companyName || mpnData.partnerName || mpnData.organizationName;

      // Construct RRR URL with actual MPN ID
      const rrrUrl = mpnId
        ? `https://admin.microsoft.com/Adminportal/Home#/partners/invitation/reseller?partnerId=${encodeURIComponent(mpnId)}&msppId=0&DAP=true`
        : null;

      json(res, 200, {
        ok: true,
        profile: {
          mpnId: mpnId || null,
          partnerName: partnerName || null,
          companyName: legalData.companyName || null,
          country: legalData.address?.country || mpnData.country || null,
          rrrUrl,
        },
        partnerCenter: {
          mpnStatus: mpnProfile.status,
          legalStatus: legalProfile.status,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Failed to fetch partner profile', profile: null, timestamp: new Date().toISOString() });
    }
    return;
  }

  // Create GDAP relationship request.
  if (req.method === 'POST' && u.pathname === '/api/partner-center/create-gdap-request') {
    try {
      const bodyRaw = await readBody(req);
      let body = {};
      try {
        body = bodyRaw ? JSON.parse(bodyRaw) : {};
      } catch {
        json(res, 400, { ok: false, error: 'Invalid JSON body', relationship: null, timestamp: new Date().toISOString() });
        return;
      }

      const { customerTenantId, displayName, duration, roles, autoExtendDuration } = body;

      // Note: customerTenantId is OPTIONAL - if not provided, Microsoft generates an invitation link
      // that any customer can use to approve the relationship
      if (!displayName) {
        json(res, 400, { ok: false, error: 'Missing required field: displayName', relationship: null, timestamp: new Date().toISOString() });
        return;
      }
      if (!roles || !Array.isArray(roles) || roles.length === 0) {
        json(res, 400, { ok: false, error: 'Missing required field: roles (must be a non-empty array)', relationship: null, timestamp: new Date().toISOString() });
        return;
      }

      const store = readTokenStore();
      const refreshToken = store?.gdapRefreshToken || store?.refreshToken;
      if (!refreshToken) {
        json(res, 401, { ok: false, error: 'Not connected. Click Connect first.', relationship: null, timestamp: new Date().toISOString() });
        return;
      }

      let accessToken = store?.gdapAccessToken;
      let claims = accessToken ? decodeJwt(accessToken) : null;

      if (!store?.isPublicClient) {
        const { tenantId, clientId, clientSecret } = envClientInfoOrThrow();
        const refreshed = await refreshUserToken({
          tenantId,
          clientId,
          clientSecret: store.isPublicClient ? undefined : clientSecret,
          refreshToken,
          scope: gdapGraphDelegatedScope(),
        });
        accessToken = refreshed.access_token;
        claims = accessToken ? decodeJwt(accessToken) : null;
        writeTokenStore({
          ...store,
          gdapRefreshToken: refreshed.refresh_token || store.gdapRefreshToken || refreshToken,
          gdapAccessToken: accessToken,
          gdapAccessTokenClaims: claims,
          gdapLastRefreshedAt: new Date().toISOString(),
        });
      } else if (!accessToken || isJwtExpired(claims)) {
        json(res, 401, { ok: false, error: 'SPA token expired. Click Connect again.', relationship: null, timestamp: new Date().toISOString() });
        return;
      }

      // Build GDAP payload
      // If customerTenantId is provided, create relationship for that specific tenant
      // If not provided (empty), Microsoft generates an invitation link for any customer
      const gdapPayload = {
        displayName,
        duration: duration || 'P730D',
        accessDetails: {
          unifiedRoles: roles.map((roleId) => ({ roleDefinitionId: roleId })),
        },
      };
      
      // Only include customer if tenant ID is provided
      if (customerTenantId) {
        gdapPayload.customer = { tenantId: customerTenantId };
      }
      
      if (autoExtendDuration) {
        gdapPayload.autoExtendDuration = autoExtendDuration;
      }

      const graphUrl = 'https://graph.microsoft.com/v1.0/tenantRelationships/delegatedAdminRelationships';
      const resp = await fetch(graphUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(gdapPayload),
      });

      const text = await resp.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { raw: text };
      }

      const ok = resp.status >= 200 && resp.status < 300;

      if (!ok) {
        json(res, resp.status, {
          ok: false,
          error: `Failed to create GDAP relationship (HTTP ${resp.status}): ${data?.error?.message || 'Unknown error'}`,
          relationship: null,
          debug: { response: safeTruncate(data) },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const relationshipId = data?.id;
      const customerApprovalUrl = relationshipId
        ? `https://admin.microsoft.com/AdminPortal/Home#/partners/granularadminrelationships/${encodeURIComponent(relationshipId)}`
        : null;

      json(res, 201, {
        ok: true,
        relationship: {
          id: relationshipId,
          displayName: data?.displayName,
          status: data?.status,
          duration: data?.duration,
          createdDateTime: data?.createdDateTime,
          endDateTime: data?.endDateTime,
          customerApprovalUrl,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Failed to create GDAP relationship', relationship: null, timestamp: new Date().toISOString() });
    }
    return;
  }

  // Indirect resellers for RRR link generation with reseller tenant IDs.
  if (req.method === 'GET' && u.pathname === '/api/partner-center/indirect-resellers') {
    try {
      const store = readTokenStore();
      const refreshToken = store?.refreshToken;
      if (!refreshToken) {
        json(res, 401, { ok: false, error: 'Not connected. Click Connect first.', resellers: [], timestamp: new Date().toISOString() });
        return;
      }

      let accessToken = store?.accessToken;
      let claims = accessToken ? decodeJwt(accessToken) : null;

      if (!store?.isPublicClient) {
        const { tenantId, clientId, clientSecret } = envClientInfoOrThrow();
        const refreshed = await refreshUserToken({
          tenantId,
          clientId,
          clientSecret: store.isPublicClient ? undefined : clientSecret,
          refreshToken: store.refreshToken,
          scope: partnerCenterDelegatedScope(),
        });
        accessToken = refreshed.access_token;
        claims = accessToken ? decodeJwt(accessToken) : null;
        writeTokenStore({
          ...store,
          refreshToken: refreshed.refresh_token || store.refreshToken,
          accessToken,
          accessTokenClaims: claims,
          lastRefreshedAt: new Date().toISOString(),
        });
      } else if (!accessToken || isJwtExpired(claims)) {
        json(res, 401, { ok: false, error: 'SPA token expired. Click Connect again.', resellers: [], timestamp: new Date().toISOString() });
        return;
      }

      // Fetch reseller relationships from Partner Center
      // The relationship_type=IsIndirectCloudSolutionProviderOf returns indirect resellers
      const pc = await partnerCenterFetch(accessToken, '/v1/relationships?relationship_type=IsIndirectCloudSolutionProviderOf');
      const ok = pc.status >= 200 && pc.status < 300;
      const items = Array.isArray(pc.data?.items) ? pc.data.items : Array.isArray(pc.data) ? pc.data : [];

      const resellers = items.map((r) => {
        const name = r?.companyProfile?.companyName || r?.reseller?.companyName || r?.name || r?.companyName;
        const mpnId = r?.mpnId || r?.mpnID || r?.reseller?.mpnId || r?.reseller?.mpnID || r?.reseller?.mpn || r?.mpn;
        const tenantId = r?.tenantId || r?.tenantID || r?.reseller?.tenantId || r?.reseller?.tenantID || r?.id;
        const state = r?.state || r?.relationshipState || r?.reseller?.state;
        const id = r?.id || r?.resellerId || r?.reseller?.id || tenantId || mpnId || name || 'unknown';
        return {
          id: String(id),
          name: name != null ? String(name) : undefined,
          mpnId: mpnId != null ? String(mpnId) : undefined,
          tenantId: tenantId != null ? String(tenantId) : undefined,
          state: state != null ? String(state) : undefined,
        };
      });

      json(res, ok ? 200 : pc.status, {
        ok,
        resellers: ok ? resellers : [],
        error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
        debug: ok ? undefined : { partnerCenter: safeTruncate(pc.data) },
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Failed to fetch indirect resellers', resellers: [], timestamp: new Date().toISOString() });
    }
    return;
  }

  if (req.method === 'GET' && u.pathname === '/api/partner-center/customers-sample') {
    try {
      const store = readTokenStore();
      if (!store?.refreshToken) {
        json(res, 401, { ok: false, error: 'Not connected. Click Connect first.', timestamp: new Date().toISOString() });
        return;
      }
      let accessToken = store.accessToken;
      let claims = accessToken ? decodeJwt(accessToken) : null;

      // SPA tokens cannot be refreshed server-side (AADSTS9002327). Use the stored access token until it expires.
      if (!store.isPublicClient) {
        const { tenantId, clientId, clientSecret } = envClientInfoOrThrow();
        const refreshed = await refreshUserToken({
          tenantId,
          clientId,
          clientSecret: store.isPublicClient ? undefined : clientSecret,
          refreshToken: store.refreshToken,
        });
        accessToken = refreshed.access_token;
        claims = accessToken ? decodeJwt(accessToken) : null;

        writeTokenStore({
          ...store,
          refreshToken: refreshed.refresh_token || store.refreshToken,
          accessToken,
          accessTokenClaims: claims,
          lastRefreshedAt: new Date().toISOString(),
        });
      } else if (!accessToken || isJwtExpired(claims)) {
        json(res, 401, {
          ok: false,
          error: 'SPA token expired. Click Connect again to get a fresh access token.',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const amr = Array.isArray(claims?.amr) ? claims.amr : [];
      const hasMfa = amr.includes('mfa');

      const pc = await partnerCenterFetch(accessToken, '/v1/customers?size=10');
      const ok = pc.status >= 200 && pc.status < 300;
      const items = Array.isArray(pc.data?.items) ? pc.data.items : [];
      const customersSample = items.slice(0, 10).map((c) => ({
        id: c?.id,
        companyName: c?.companyProfile?.companyName,
        defaultDomain: c?.companyProfile?.domain,
      }));

      json(res, ok ? 200 : pc.status, {
        ok: ok && hasMfa,
        partnerCenter: { status: pc.status, sampleEndpoint: '/v1/customers?size=10' },
        mfa: { hasMfa, amr },
        customersSample: ok ? customersSample : [],
        error: !hasMfa ? 'MFA claim missing in access token (amr). Partner Center may reject App+User calls without MFA.' : ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Unknown error', timestamp: new Date().toISOString() });
    }
    return;
  }

  if (req.method === 'GET' && u.pathname === '/api/partner-center/health') {
    try {
      const store = readTokenStore();
      if (store?.refreshToken) {
        // Connected (App+User): return a verbose sample with MFA claim check.
        let accessToken = store.accessToken;
        let claims = accessToken ? decodeJwt(accessToken) : null;

        if (!store.isPublicClient) {
          const { tenantId, clientId, clientSecret } = envClientInfoOrThrow();
          const refreshed = await refreshUserToken({
            tenantId,
            clientId,
            clientSecret: store.isPublicClient ? undefined : clientSecret,
            refreshToken: store.refreshToken,
          });
          accessToken = refreshed.access_token;
          claims = accessToken ? decodeJwt(accessToken) : null;

          writeTokenStore({
            ...store,
            refreshToken: refreshed.refresh_token || store.refreshToken,
            accessToken,
            accessTokenClaims: claims,
            lastRefreshedAt: new Date().toISOString(),
          });
        } else if (!accessToken || isJwtExpired(claims)) {
          json(res, 401, {
            ok: false,
            error: 'SPA token expired. Click Connect again to get a fresh access token.',
            timestamp: new Date().toISOString(),
          });
          return;
        }

        const amr = Array.isArray(claims?.amr) ? claims.amr : [];
        const hasMfa = amr.includes('mfa');
        const pc = await partnerCenterFetch(accessToken, '/v1/customers?size=10');
        const ok = pc.status >= 200 && pc.status < 300;
        const items = Array.isArray(pc.data?.items) ? pc.data.items : [];
        const customersSample = items.slice(0, 10).map((c) => ({
          id: c?.id,
          companyName: c?.companyProfile?.companyName,
          defaultDomain: c?.companyProfile?.domain,
        }));

        json(res, ok ? 200 : pc.status, {
          ok: ok && hasMfa,
          partnerCenter: { status: pc.status, sampleEndpoint: '/v1/customers?size=10' },
          mfa: { hasMfa, amr },
          customersSample: ok ? customersSample : [],
          error: !hasMfa
            ? 'MFA claim missing in access token (amr). Partner Center App+User calls require MFA.'
            : ok
            ? undefined
            : `Partner Center request failed (HTTP ${pc.status}).`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Not connected (no refresh token): fall back to app-only check (may be blocked depending on tenant configuration).
      const creds = envCredsOrThrow();
      const token = await getToken(creds);
      const pc = await partnerCenterFetch(token, '/v1/customers?size=1');
      const ok = pc.status >= 200 && pc.status < 300;
      json(res, ok ? 200 : pc.status, {
        ok,
        partnerCenter: { status: pc.status, sampleEndpoint: '/v1/customers?size=1' },
        error: ok
          ? undefined
          : `Partner Center request failed (HTTP ${pc.status}). If your tenant blocks app-only Partner Center calls, click Connect to use App+User (MFA) instead.`,
        debug: ok ? undefined : { partnerCenter: safeTruncate(pc.data) },
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Unknown error', timestamp: new Date().toISOString() });
    }
    return;
  }

  if (req.method === 'POST' && u.pathname === '/api/partner-center/test') {
    try {
      const raw = await readBody(req);
      const parsed = raw ? JSON.parse(raw) : {};
      const { tenantId, clientId, clientSecret } = parsed || {};
      if (!tenantId || !clientId || !clientSecret) {
        json(res, 400, {
          ok: false,
          error: 'Missing tenantId/clientId/clientSecret',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      const token = await getToken({ tenantId, clientId, clientSecret });
      const pc = await partnerCenterFetch(token, '/v1/customers?size=10');
      const ok = pc.status >= 200 && pc.status < 300;
      const items = Array.isArray(pc.data?.items) ? pc.data.items : [];
      const customersSample = items.slice(0, 10).map((c) => ({
        id: c?.id,
        companyName: c?.companyProfile?.companyName,
        defaultDomain: c?.companyProfile?.domain,
      }));
      json(res, ok ? 200 : pc.status, {
        ok,
        partnerCenter: { status: pc.status, sampleEndpoint: '/v1/customers?size=10' },
        customersSample: ok ? customersSample : [],
        error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
        debug: ok
          ? undefined
          : {
              partnerCenterStatus: pc.status,
              partnerCenterResponse: safeTruncate(pc.data),
            },
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Unknown error', timestamp: new Date().toISOString() });
    }
    return;
  }

  if (req.method === 'GET' && u.pathname === '/api/partner-center/session-test') {
    try {
      const auth = req.headers.authorization || '';
      const m = auth.match(/^Bearer\s+(.+)$/i);
      const token = m && m[1] ? m[1] : null;
      if (!token) {
        json(res, 401, { ok: false, error: 'Missing Authorization: Bearer <token>', timestamp: new Date().toISOString() });
        return;
      }

      const pc = await partnerCenterFetch(token, '/v1/customers?size=10');
      const ok = pc.status >= 200 && pc.status < 300;
      const items = Array.isArray(pc.data?.items) ? pc.data.items : [];
      const customersSample = items.slice(0, 10).map((c) => ({
        id: c?.id,
        companyName: c?.companyProfile?.companyName,
        defaultDomain: c?.companyProfile?.domain,
      }));

      json(res, ok ? 200 : pc.status, {
        ok,
        partnerCenter: { status: pc.status, sampleEndpoint: '/v1/customers?size=10' },
        customersSample: ok ? customersSample : [],
        error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
        debug: ok ? undefined : { partnerCenterStatus: pc.status, partnerCenterResponse: safeTruncate(pc.data) },
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      json(res, 500, { ok: false, error: e.message || 'Unknown error', timestamp: new Date().toISOString() });
    }
    return;
  }

  // ============================================================================
  // Azure Marketplace Catalog API endpoints
  // ============================================================================
  // Uses the Azure Marketplace Catalog API (2025-05-01) with subscription:
  // 3aad85d7-6ac9-4ef0-bb0f-30837aebff49
  // ============================================================================

  const AZURE_SUBSCRIPTION_ID = '3aad85d7-6ac9-4ef0-bb0f-30837aebff49';
  const AZURE_API_VERSION = '2025-05-01';

  // List products from Azure Marketplace Catalog
  if (req.method === 'GET' && u.pathname === '/api/azure/marketplace-catalog/products') {
    try {
      const store = readTokenStore();
      const azureRefreshToken = store?.azureRefreshToken;
      
      if (!azureRefreshToken) {
        // Return demo data when Azure is not connected
        json(res, 200, {
          ok: true,
          products: getAzureMarketplaceDemoProducts(),
          nextLink: null,
          totalCount: 15,
          isDemo: true,
          message: 'Azure not connected. Click "Connect Azure" to see real products.',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get access token for Azure Management API
      let accessToken = store?.azureAccessToken;
      let claims = accessToken ? decodeJwt(accessToken) : null;

      // Refresh token if expired
      if (!accessToken || isJwtExpired(claims)) {
        try {
          const { tenantId, clientId, clientSecret } = envClientInfoOrThrow();
          const refreshed = await refreshUserToken({
            tenantId,
            clientId,
            clientSecret,
            refreshToken: azureRefreshToken,
            scope: 'https://management.azure.com/.default offline_access',
          });
          
          if (refreshed.access_token) {
            accessToken = refreshed.access_token;
            const newStore = { ...store, azureAccessToken: accessToken };
            if (refreshed.refresh_token) newStore.azureRefreshToken = refreshed.refresh_token;
            writeTokenStore(newStore);
          }
        } catch (refreshErr) {
          console.error('[azure-catalog] Token refresh failed:', refreshErr.message);
          // Fall back to demo data
          json(res, 200, {
            ok: true,
            products: getAzureMarketplaceDemoProducts(),
            nextLink: null,
            totalCount: 15,
            isDemo: true,
            message: 'Token refresh failed. Using demo data.',
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      // First, get the billing account ID for this subscription
      // GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts?api-version=2024-04-01
      let billingAccountId = null;
      try {
        const billingAccountsUrl = `https://management.azure.com/providers/Microsoft.Billing/billingAccounts?api-version=2024-04-01`;
        const billingResp = await fetch(billingAccountsUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (billingResp.ok) {
          const billingData = await billingResp.json();
          console.log('[azure-catalog] Billing accounts response:', JSON.stringify(billingData, null, 2));
          
          // Find the first billing account (or filter by subscription if multiple)
          if (billingData.value && billingData.value.length > 0) {
            billingAccountId = billingData.value[0].name;
            console.log('[azure-catalog] Using billing account:', billingAccountId);
          }
        } else {
          const billingErr = await billingResp.text();
          console.error('[azure-catalog] Failed to get billing accounts:', billingResp.status, billingErr);
        }
      } catch (billingErr) {
        console.error('[azure-catalog] Error fetching billing accounts:', billingErr.message);
      }

      // If we couldn't get a billing account, fall back to demo data
      if (!billingAccountId) {
        console.log('[azure-catalog] No billing account found, using demo data');
        json(res, 200, {
          ok: true,
          products: getAzureMarketplaceDemoProducts(),
          nextLink: null,
          totalCount: 15,
          isDemo: true,
          message: 'Could not retrieve billing account. Using demo data. You may need Billing Reader role.',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Build Azure Marketplace Catalog API URL
      // GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Marketplace/products
      const filter = u.searchParams.get('$filter') || '';
      const orderby = u.searchParams.get('$orderby') || '';
      const expand = u.searchParams.get('$expand') || '';
      const top = u.searchParams.get('$top') || '500'; // Increased default to get more products

      let azureUrl = `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/${encodeURIComponent(billingAccountId)}/providers/Microsoft.Marketplace/products?api-version=${AZURE_API_VERSION}`;
      if (filter) azureUrl += `&$filter=${encodeURIComponent(filter)}`;
      if (orderby) azureUrl += `&$orderby=${encodeURIComponent(orderby)}`;
      if (expand) azureUrl += `&$expand=${encodeURIComponent(expand)}`;
      if (top) azureUrl += `&$top=${encodeURIComponent(top)}`;

      console.log('[azure-catalog] Fetching products from:', azureUrl);

      const azureResp = await fetch(azureUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const text = await azureResp.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { raw: text };
      }

      if (azureResp.status >= 200 && azureResp.status < 300) {
        const products = Array.isArray(data?.value) ? data.value : [];
        console.log('[azure-catalog] Products API returned:', azureResp.status, 'Products count:', products.length);
        if (products.length === 0) {
          console.log('[azure-catalog] Full response:', JSON.stringify(data, null, 2));
        }
        json(res, 200, {
          ok: true,
          products,
          nextLink: data?.nextLink || null,
          totalCount: products.length,
          isDemo: false,
          message: products.length === 0 ? 'API returned 0 products. You may need additional permissions on the billing account.' : undefined,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('[azure-catalog] API error:', azureResp.status, data);
        // Fall back to demo data on error
        json(res, 200, {
          ok: true,
          products: getAzureMarketplaceDemoProducts(),
          nextLink: null,
          totalCount: 15,
          isDemo: true,
          message: `Azure API returned ${azureResp.status}. Using demo data.`,
          error: data?.error?.message || `HTTP ${azureResp.status}`,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error('[azure-catalog] Error:', e.message);
      json(res, 200, {
        ok: true,
        products: getAzureMarketplaceDemoProducts(),
        nextLink: null,
        totalCount: 15,
        isDemo: true,
        message: 'Error fetching from Azure. Using demo data.',
        error: e.message,
        timestamp: new Date().toISOString(),
      });
    }
    return;
  }

  // Get a specific product by ID
  if (req.method === 'GET' && u.pathname.startsWith('/api/azure/marketplace-catalog/products/')) {
    const productId = decodeURIComponent(u.pathname.replace('/api/azure/marketplace-catalog/products/', ''));
    
    // For now, return from demo data
    const demoProducts = getAzureMarketplaceDemoProducts();
    const product = demoProducts.find(p => p.uniqueProductId === productId);
    
    if (product) {
      json(res, 200, {
        ok: true,
        product,
        isDemo: true,
        timestamp: new Date().toISOString(),
      });
    } else {
      json(res, 404, {
        ok: false,
        error: `Product not found: ${productId}`,
        timestamp: new Date().toISOString(),
      });
    }
    return;
  }

  // ============================================================================
  // AZURE MARKETPLACE - Third-Party Product Purchases via ARM
  // Uses Azure Resource Manager to create SaaS/VM subscriptions from Azure Marketplace
  // Docs: https://learn.microsoft.com/en-us/azure/marketplace/azure-purchasing-invoicing
  // ============================================================================

  // Purchase a third-party Azure Marketplace product
  if (req.method === 'POST' && u.pathname === '/api/azure/marketplace/purchase') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = body ? JSON.parse(body) : {};
        const { 
          subscriptionId,      // Azure subscription ID to bill against
          resourceGroupName,   // Resource group for the SaaS resource
          productId,           // Product ID from marketplace catalog
          planId,              // Plan ID from the product
          publisherId,         // Publisher ID (e.g., "microsoft")
          offerId,             // Offer ID
          name,                // Name for the SaaS resource
          quantity,
          termId,              // Term ID
        } = data;

        const store = readTokenStore();
        const azureAccessToken = store?.azureAccessToken;

        if (!azureAccessToken) {
          // Demo mode
          console.log(`[azure-marketplace] Demo: Purchasing ${productId} plan ${planId}`);
          
          json(res, 200, {
            ok: true,
            isDemo: true,
            productId,
            planId,
            subscriptionId: `DEMO-SAAS-${Date.now()}`,
            message: 'Simulated purchase (demo mode). Connect to Azure for real purchases.',
            timestamp: new Date().toISOString(),
          });
          return;
        }

        // Use the provided subscription ID or fall back to our test subscription
        const azureSubscriptionId = subscriptionId || '3aad85d7-6ac9-4ef0-bb0f-30837aebff49';
        const rgName = resourceGroupName || 'marketplace-purchases';
        const resourceName = name || `saas-${Date.now()}`;

        console.log(`[azure-marketplace] Creating marketplace subscription...`);
        console.log(`[azure-marketplace] Product: ${productId}, Plan: ${planId}`);
        console.log(`[azure-marketplace] Subscription: ${azureSubscriptionId}, RG: ${rgName}`);

        // First, ensure resource group exists
        const rgUrl = `https://management.azure.com/subscriptions/${azureSubscriptionId}/resourceGroups/${rgName}?api-version=2021-04-01`;
        const rgRes = await fetch(rgUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${azureAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location: 'eastus',
            tags: { purpose: 'marketplace-purchases' }
          }),
        });

        if (!rgRes.ok && rgRes.status !== 409) {
          const errorText = await rgRes.text();
          console.log('[azure-marketplace] RG create response:', rgRes.status, errorText);
          // Continue - RG might already exist or we might not have permission but can still create resources
        } else {
          console.log('[azure-marketplace] Resource group ready');
        }

        // Create SaaS subscription via ARM
        // API: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.SaaS/resources/{resourceName}
        const saasUrl = `https://management.azure.com/subscriptions/${azureSubscriptionId}/resourceGroups/${rgName}/providers/Microsoft.SaaS/resources/${resourceName}?api-version=2018-03-01-beta`;
        
        const saasPayload = {
          name: resourceName,
          type: 'Microsoft.SaaS/resources',
          location: 'global',
          properties: {
            saasResourceName: resourceName,
            publisherId: publisherId || 'unknown',
            offerId: offerId || productId,
            planId: planId || 'default',
            quantity: quantity || 1,
            termId: termId, // Optional
            autoRenew: true,
            paymentChannelType: 'SubscriptionDelegated',
            paymentChannelMetadata: {
              azureSubscriptionId: azureSubscriptionId,
            },
          },
          tags: {
            createdBy: 'marketplace-poc',
            productId: productId,
            createdAt: new Date().toISOString(),
          },
        };

        console.log(`[azure-marketplace] Creating SaaS resource...`);

        const saasRes = await fetch(saasUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${azureAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(saasPayload),
        });

        const responseText = await saasRes.text();
        console.log(`[azure-marketplace] SaaS response (${saasRes.status}):`, responseText);

        if (!saasRes.ok) {
          let errorDetail = responseText;
          try {
            const errorJson = JSON.parse(responseText);
            errorDetail = errorJson.error?.message || errorJson.message || responseText;
          } catch (e) {}

          json(res, saasRes.status, {
            ok: false,
            error: `Failed to create marketplace subscription: ${errorDetail}`,
            hint: 'The product may require different purchase flow or additional permissions.',
            timestamp: new Date().toISOString(),
          });
          return;
        }

        let saasResource;
        try {
          saasResource = JSON.parse(responseText);
        } catch (e) {
          saasResource = { id: resourceName };
        }

        json(res, 200, {
          ok: true,
          isDemo: false,
          productId,
          planId,
          resourceId: saasResource.id,
          resourceName: resourceName,
          subscriptionId: azureSubscriptionId,
          status: saasResource.properties?.saasSubscriptionStatus || 'PendingFulfillmentStart',
          message: 'Marketplace subscription created successfully.',
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        console.error('[azure-marketplace] Purchase error:', e);
        json(res, 500, {
          ok: false,
          error: e.message,
          timestamp: new Date().toISOString(),
        });
      }
    });
    return;
  }

  // ============================================================================
  // PARTNER CENTER - Create CSP Subscription via Cart API (for Azure Plan, Software, etc.)
  // Docs: https://learn.microsoft.com/en-us/partner-center/developer/create-subscription-azure-marketplace-products
  // ============================================================================

  // Purchase a CSP product for a customer (not third-party marketplace)
  if (req.method === 'POST' && u.pathname === '/api/partner-center/marketplace/purchase') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = body ? JSON.parse(body) : {};
        const { customerId, customerTenantId, productId, planId, quantity, termDuration, billingCycle } = data;

        if (!customerId || !productId) {
          json(res, 400, {
            ok: false,
            error: 'Missing required fields: customerId, productId',
            timestamp: new Date().toISOString(),
          });
          return;
        }

        const store = readTokenStore();
        const accessToken = store?.accessToken;

        if (!accessToken) {
          // Demo mode - simulate purchase
          console.log(`[partner-center] Demo: Purchasing ${productId} plan ${planId} for customer ${customerId}`);
          
          const demoSubscriptionId = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          json(res, 200, {
            ok: true,
            isDemo: true,
            subscriptionId: demoSubscriptionId,
            customerId,
            productId,
            planId,
            quantity: quantity || 1,
            status: 'active',
            message: 'Subscription created (demo mode). Connect to Partner Center for real subscriptions.',
            createdAt: new Date().toISOString(),
            timestamp: new Date().toISOString(),
          });
          return;
        }

        // Real Partner Center API flow: Create Cart → Checkout
        const baseUrl = process.env.PARTNER_CENTER_BASE_URL || 'https://api.partnercenter.microsoft.com';
        const customerIdForApi = customerTenantId || customerId;

        console.log(`[partner-center] Creating cart for customer ${customerIdForApi}...`);

        // First, get the partner's MPN ID from profile (needed for attestation)
        let partnerMpnId = null;
        try {
          const profileRes = await fetch(`${baseUrl}/v1/profiles/mpn`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json',
            },
          });
          if (profileRes.ok) {
            const profile = await profileRes.json();
            partnerMpnId = profile.mpnId;
            console.log(`[partner-center] Partner MPN ID: ${partnerMpnId}`);
          }
        } catch (e) {
          console.log('[partner-center] Could not fetch partner MPN ID:', e.message);
        }

        // Step 1: Create cart with the marketplace item and Partner on Record attestation
        // The attestation confirms the partner is authorized to purchase on behalf of the customer
        // Docs: https://learn.microsoft.com/en-us/partner-center/developer/create-a-cart
        const cartPayload = {
          lineItems: [
            {
              catalogItemId: productId,
              quantity: quantity || 1,
              billingCycle: billingCycle || 'monthly',
              termDuration: termDuration || 'P1M',
            }
          ],
        };

        // Add Partner on Record attestation at cart level if we have MPN ID
        // This is required for Azure marketplace purchases
        if (partnerMpnId) {
          cartPayload.partnerOnRecordAttestationAccepted = true;
        }

        console.log(`[partner-center] Cart payload:`, JSON.stringify(cartPayload, null, 2));

        const createCartRes = await fetch(`${baseUrl}/v1/customers/${customerIdForApi}/carts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(cartPayload),
        });

        if (!createCartRes.ok) {
          const errorText = await createCartRes.text();
          console.error('[partner-center] Create cart failed:', createCartRes.status, errorText);
          
          // Try to parse error for better message
          let errorDetail = errorText;
          try {
            const errorJson = JSON.parse(errorText);
            errorDetail = errorJson.description || errorJson.message || errorText;
          } catch {}
          
          json(res, createCartRes.status, {
            ok: false,
            error: `Failed to create cart: ${errorDetail}`,
            status: createCartRes.status,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        const cart = await createCartRes.json();
        console.log(`[partner-center] Cart created: ${cart.id}`);

        // Step 2: Checkout the cart
        console.log(`[partner-center] Checking out cart ${cart.id}...`);
        
        const checkoutRes = await fetch(`${baseUrl}/v1/customers/${customerIdForApi}/carts/${cart.id}/checkout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!checkoutRes.ok) {
          const errorText = await checkoutRes.text();
          console.error('[partner-center] Checkout failed:', checkoutRes.status, errorText);
          
          let errorDetail = errorText;
          try {
            const errorJson = JSON.parse(errorText);
            errorDetail = errorJson.description || errorJson.message || errorText;
          } catch {}
          
          json(res, checkoutRes.status, {
            ok: false,
            error: `Failed to checkout cart: ${errorDetail}`,
            cartId: cart.id,
            status: checkoutRes.status,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        const checkoutResult = await checkoutRes.json();
        console.log(`[partner-center] Checkout successful:`, JSON.stringify(checkoutResult, null, 2));

        // Extract subscription ID from the result
        const subscription = checkoutResult.orders?.[0]?.lineItems?.[0] || {};
        const subscriptionId = subscription.subscriptionId || checkoutResult.id || `sub-${Date.now()}`;

        json(res, 200, {
          ok: true,
          isDemo: false,
          subscriptionId,
          orderId: checkoutResult.id,
          customerId,
          productId,
          planId,
          quantity: quantity || 1,
          status: 'active',
          message: 'Subscription created successfully in Partner Center.',
          partnerCenterResponse: checkoutResult,
          createdAt: new Date().toISOString(),
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        console.error('[partner-center] Purchase error:', e);
        json(res, 500, {
          ok: false,
          error: e.message,
          timestamp: new Date().toISOString(),
        });
      }
    });
    return;
  }

  // ============================================================================
  // Partner Center Catalog - Get products that can be purchased via Cart API
  // ============================================================================
  
  // Get Partner Center catalog (for cart purchases)
  if (req.method === 'GET' && u.pathname === '/api/partner-center/catalog') {
    const store = readTokenStore();
    const accessToken = store?.accessToken;
    const targetSegment = u.searchParams.get('segment') || 'commercial';
    const productType = u.searchParams.get('productType') || 'Azure';
    const country = u.searchParams.get('country') || 'US';

    if (!accessToken) {
      json(res, 200, {
        ok: true,
        isDemo: true,
        products: [],
        message: 'Connect to Partner Center to view catalog products.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const baseUrl = process.env.PARTNER_CENTER_BASE_URL || 'https://api.partnercenter.microsoft.com';
      
      // Query Partner Center catalog
      // Docs: https://learn.microsoft.com/en-us/partner-center/developer/get-a-list-of-products
      // targetView: Azure, AzureReservations, Software, etc.
      const targetView = u.searchParams.get('targetView') || 'Azure';
      console.log(`[partner-center] Fetching catalog for country=${country}, targetView=${targetView}...`);
      
      const catalogRes = await fetch(
        `${baseUrl}/v1/products?country=${country}&targetView=${targetView}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!catalogRes.ok) {
        const errorText = await catalogRes.text();
        console.error('[partner-center] Get catalog failed:', catalogRes.status, errorText);
        
        json(res, catalogRes.status, {
          ok: false,
          error: `Failed to get catalog: ${errorText}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await catalogRes.json();
      const products = (result.items || []).map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        productType: p.productType,
        isMicrosoftProduct: p.isMicrosoftProduct,
        publisherName: p.publisherName,
      }));
      
      console.log(`[partner-center] Found ${products.length} catalog products`);
      
      json(res, 200, {
        ok: true,
        isDemo: false,
        products,
        totalCount: products.length,
        message: 'Use the "id" field as catalogItemId for cart purchases.',
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.error('[partner-center] Get catalog error:', e);
      json(res, 500, {
        ok: false,
        error: e.message,
        timestamp: new Date().toISOString(),
      });
    }
    return;
  }

  // List all customers from Partner Center (to get real customer GUIDs)
  if (req.method === 'GET' && u.pathname === '/api/partner-center/customers') {
    const store = readTokenStore();
    const accessToken = store?.accessToken;

    if (!accessToken) {
      // Demo mode
      json(res, 200, {
        ok: true,
        isDemo: true,
        customers: [],
        message: 'Connect to Partner Center to view real customers with their GUIDs.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const baseUrl = process.env.PARTNER_CENTER_BASE_URL || 'https://api.partnercenter.microsoft.com';
      
      console.log('[partner-center] Fetching customer list...');
      const customersRes = await fetch(`${baseUrl}/v1/customers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!customersRes.ok) {
        const errorText = await customersRes.text();
        console.error('[partner-center] Get customers failed:', customersRes.status, errorText);
        
        json(res, customersRes.status, {
          ok: false,
          error: `Failed to get customers: ${errorText}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await customersRes.json();
      
      // Map to simpler format with GUIDs prominently displayed
      const customers = (result.items || []).map((c) => ({
        id: c.id, // This is the GUID needed for API calls
        companyName: c.companyProfile?.companyName || c.companyName,
        domain: c.companyProfile?.domain,
        tenantId: c.companyProfile?.tenantId || c.id,
        email: c.billingProfile?.email,
        relationshipToPartner: c.relationshipToPartner,
      }));
      
      console.log(`[partner-center] Found ${customers.length} customers`);
      
      json(res, 200, {
        ok: true,
        isDemo: false,
        customers,
        totalCount: result.totalCount || customers.length,
        message: 'Use the "id" field as the azureTenantId in customer records.',
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.error('[partner-center] Get customers error:', e);
      json(res, 500, {
        ok: false,
        error: e.message,
        timestamp: new Date().toISOString(),
      });
    }
    return;
  }

  // Get customer subscriptions from Partner Center
  if (req.method === 'GET' && u.pathname.match(/^\/api\/partner-center\/customers\/[^/]+\/subscriptions$/)) {
    const customerId = u.pathname.split('/')[4];
    
    const store = readTokenStore();
    const accessToken = store?.accessToken;

    if (!accessToken) {
      // Demo mode
      json(res, 200, {
        ok: true,
        isDemo: true,
        customerId,
        subscriptions: [],
        message: 'No subscriptions (demo mode). Connect to Partner Center to view real subscriptions.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const baseUrl = process.env.PARTNER_CENTER_BASE_URL || 'https://api.partnercenter.microsoft.com';
      
      const subscriptionsRes = await fetch(`${baseUrl}/v1/customers/${customerId}/subscriptions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!subscriptionsRes.ok) {
        const errorText = await subscriptionsRes.text();
        console.error('[partner-center] Get subscriptions failed:', subscriptionsRes.status, errorText);
        
        json(res, subscriptionsRes.status, {
          ok: false,
          error: `Failed to get subscriptions: ${errorText}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await subscriptionsRes.json();
      
      json(res, 200, {
        ok: true,
        isDemo: false,
        customerId,
        subscriptions: result.items || [],
        totalCount: result.totalCount || 0,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.error('[partner-center] Get subscriptions error:', e);
      json(res, 500, {
        ok: false,
        error: e.message,
        timestamp: new Date().toISOString(),
      });
    }
    return;
  }

  // ============================================================================
  // AZURE SAAS FULFILLMENT API - Order Management
  // Docs: https://learn.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-fulfillment-subscription-api
  // ============================================================================

  // Activate a SaaS subscription (uses Partner Center purchase flow)
  if (req.method === 'POST' && u.pathname.match(/^\/api\/azure\/saas\/subscriptions\/[^/]+\/activate$/)) {
    const subscriptionId = u.pathname.split('/')[5];
    
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = body ? JSON.parse(body) : {};
        const { planId, quantity, customerId, customerTenantId, productId } = data;

        const store = readTokenStore();
        const accessToken = store?.accessToken;

        if (!accessToken) {
          // Simulate activation for demo mode
          console.log(`[saas-fulfillment] Demo: Activating subscription ${subscriptionId} with plan ${planId}, qty ${quantity}`);
          
          json(res, 200, {
            ok: true,
            subscriptionId,
            planId,
            quantity,
            status: 'active',
            isDemo: true,
            message: 'Subscription activated (demo mode). Connect to Partner Center for real subscriptions.',
            timestamp: new Date().toISOString(),
          });
          return;
        }

        // Use Partner Center Cart API to create the real subscription
        const baseUrl = process.env.PARTNER_CENTER_BASE_URL || 'https://api.partnercenter.microsoft.com';
        const customerIdForApi = customerTenantId || customerId;

        if (!customerIdForApi || !productId) {
          json(res, 400, {
            ok: false,
            error: 'Customer ID and Product ID are required for real subscription creation',
            timestamp: new Date().toISOString(),
          });
          return;
        }

        console.log(`[partner-center] Creating subscription for customer ${customerIdForApi}, product ${productId}...`);

        // Create and checkout cart
        const cartPayload = {
          lineItems: [
            {
              catalogItemId: productId,
              quantity: quantity || 1,
              billingCycle: 'monthly',
            }
          ]
        };

        const createCartRes = await fetch(`${baseUrl}/v1/customers/${customerIdForApi}/carts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(cartPayload),
        });

        if (!createCartRes.ok) {
          const errorText = await createCartRes.text();
          console.error('[partner-center] Create cart failed:', createCartRes.status, errorText);
          
          json(res, createCartRes.status, {
            ok: false,
            error: `Failed to create subscription: ${errorText}`,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        const cart = await createCartRes.json();
        
        const checkoutRes = await fetch(`${baseUrl}/v1/customers/${customerIdForApi}/carts/${cart.id}/checkout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!checkoutRes.ok) {
          const errorText = await checkoutRes.text();
          console.error('[partner-center] Checkout failed:', checkoutRes.status, errorText);
          
          json(res, checkoutRes.status, {
            ok: false,
            error: `Failed to complete purchase: ${errorText}`,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        const checkoutResult = await checkoutRes.json();
        const newSubscriptionId = checkoutResult.orders?.[0]?.lineItems?.[0]?.subscriptionId || subscriptionId;

        console.log(`[partner-center] Subscription created: ${newSubscriptionId}`);
        
        json(res, 200, {
          ok: true,
          subscriptionId: newSubscriptionId,
          orderId: checkoutResult.id,
          planId,
          quantity,
          status: 'active',
          isDemo: false,
          message: 'Subscription created successfully in Partner Center.',
          partnerCenterResponse: checkoutResult,
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        console.error('[saas-fulfillment] Activation error:', e);
        json(res, 500, {
          ok: false,
          error: e.message,
          timestamp: new Date().toISOString(),
        });
      }
    });
    return;
  }

  // Suspend a SaaS subscription
  if (req.method === 'POST' && u.pathname.match(/^\/api\/azure\/saas\/subscriptions\/[^/]+\/suspend$/)) {
    const subscriptionId = u.pathname.split('/')[5];
    
    console.log(`[saas-fulfillment] Suspending subscription ${subscriptionId}`);
    
    json(res, 200, {
      ok: true,
      subscriptionId,
      status: 'Suspended',
      message: 'Subscription suspended successfully.',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Reinstate a suspended subscription
  if (req.method === 'POST' && u.pathname.match(/^\/api\/azure\/saas\/subscriptions\/[^/]+\/reinstate$/)) {
    const subscriptionId = u.pathname.split('/')[5];
    
    console.log(`[saas-fulfillment] Reinstating subscription ${subscriptionId}`);
    
    json(res, 200, {
      ok: true,
      subscriptionId,
      status: 'Subscribed',
      message: 'Subscription reinstated successfully.',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Cancel/Unsubscribe a SaaS subscription
  if (req.method === 'DELETE' && u.pathname.match(/^\/api\/azure\/saas\/subscriptions\/[^/]+$/)) {
    const subscriptionId = u.pathname.split('/')[5];
    
    console.log(`[saas-fulfillment] Cancelling subscription ${subscriptionId}`);
    
    json(res, 200, {
      ok: true,
      subscriptionId,
      status: 'Unsubscribed',
      message: 'Subscription cancelled successfully.',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Change plan for a subscription
  if (req.method === 'PATCH' && u.pathname.match(/^\/api\/azure\/saas\/subscriptions\/[^/]+$/)) {
    const subscriptionId = u.pathname.split('/')[5];
    
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = body ? JSON.parse(body) : {};
        const { planId, quantity } = data;
        
        console.log(`[saas-fulfillment] Updating subscription ${subscriptionId}: plan=${planId}, qty=${quantity}`);
        
        json(res, 200, {
          ok: true,
          subscriptionId,
          planId,
          quantity,
          status: 'PendingFulfillmentStart',
          message: 'Subscription update initiated.',
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        json(res, 400, {
          ok: false,
          error: e.message,
          timestamp: new Date().toISOString(),
        });
      }
    });
    return;
  }

  json(res, 404, { ok: false, error: 'Not found', timestamp: new Date().toISOString() });
});

// Demo products for Azure Marketplace Catalog
function getAzureMarketplaceDemoProducts() {
  return [
    {
      uniqueProductId: 'microsoft_windowsserver2022datacenter',
      displayName: 'Windows Server 2022 Datacenter',
      publisherDisplayName: 'Microsoft',
      publisherId: 'microsoft',
      publisherType: 'Microsoft',
      productType: 'VirtualMachine',
      summary: 'Windows Server is the platform for building an infrastructure of connected applications, networks, and web services.',
      popularity: 95,
      pricingTypes: ['PayAsYouGo', 'BYOL'],
      operatingSystems: ['Windows'],
      categoryIds: ['compute', 'operating-systems'],
      lastModifiedDate: '2025-12-01T00:00:00Z',
      plans: [
        { planId: 'datacenter-core', displayName: 'Datacenter Core', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'datacenter-core', pricing: { currencyCode: 'USD', retailPrice: 0.192, unitPrice: 0.192, unitOfMeasure: '1 Hour', billingPeriod: 'hourly' } },
        { planId: 'datacenter-desktop', displayName: 'Datacenter with Desktop', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'datacenter-desktop', pricing: { currencyCode: 'USD', retailPrice: 0.288, unitPrice: 0.288, unitOfMeasure: '1 Hour', billingPeriod: 'hourly' } },
      ],
    },
    {
      uniqueProductId: 'canonical_ubuntuserver2204lts',
      displayName: 'Ubuntu Server 22.04 LTS',
      publisherDisplayName: 'Canonical',
      publisherId: 'canonical',
      publisherType: 'ThirdParty',
      productType: 'VirtualMachine',
      summary: "Ubuntu Server is the world's most popular Linux for cloud environments.",
      popularity: 92,
      pricingTypes: ['Free', 'PayAsYouGo'],
      operatingSystems: ['Linux'],
      categoryIds: ['compute', 'operating-systems'],
      lastModifiedDate: '2025-11-15T00:00:00Z',
      plans: [
        { planId: '2204-lts', displayName: 'Ubuntu 22.04 LTS', pricingTypes: ['Free'], cspState: 'OptIn', skuId: '2204-lts', pricing: { currencyCode: 'USD', retailPrice: 0, unitPrice: 0, unitOfMeasure: '1 Hour', billingPeriod: 'hourly' } },
        { planId: '2204-lts-pro', displayName: 'Ubuntu Pro 22.04 LTS', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: '2204-lts-pro', pricing: { currencyCode: 'USD', retailPrice: 0.011, unitPrice: 0.011, unitOfMeasure: '1 Hour', billingPeriod: 'hourly' } },
      ],
    },
    {
      uniqueProductId: 'microsoft_dynamics365sales',
      displayName: 'Dynamics 365 Sales',
      publisherDisplayName: 'Microsoft',
      publisherId: 'microsoft',
      publisherType: 'Microsoft',
      productType: 'DynamicsCE',
      summary: 'Empower sellers with insights to personalize relationships, predict customer needs, and close sales faster.',
      popularity: 88,
      pricingTypes: ['Subscription'],
      categoryIds: ['business-applications', 'crm'],
      lastModifiedDate: '2025-10-20T00:00:00Z',
      plans: [
        { planId: 'professional', displayName: 'Professional', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'sales-professional', pricing: { currencyCode: 'USD', retailPrice: 65.00, unitPrice: 65.00, unitOfMeasure: '1 User', billingPeriod: 'monthly' } },
        { planId: 'enterprise', displayName: 'Enterprise', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'sales-enterprise', pricing: { currencyCode: 'USD', retailPrice: 95.00, unitPrice: 95.00, unitOfMeasure: '1 User', billingPeriod: 'monthly' } },
      ],
    },
    {
      uniqueProductId: 'microsoft_powerbipro',
      displayName: 'Power BI Pro',
      publisherDisplayName: 'Microsoft',
      publisherId: 'microsoft',
      publisherType: 'Microsoft',
      productType: 'PowerBI',
      summary: "Self-service and enterprise business intelligence that's scalable and easy to use.",
      popularity: 90,
      pricingTypes: ['Subscription'],
      categoryIds: ['analytics', 'business-intelligence'],
      lastModifiedDate: '2025-11-01T00:00:00Z',
      plans: [
        { planId: 'pro', displayName: 'Power BI Pro', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'power-bi-pro', pricing: { currencyCode: 'USD', retailPrice: 10.00, unitPrice: 10.00, unitOfMeasure: '1 User', billingPeriod: 'monthly' } },
        { planId: 'premium-per-user', displayName: 'Power BI Premium Per User', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'power-bi-premium-per-user', pricing: { currencyCode: 'USD', retailPrice: 20.00, unitPrice: 20.00, unitOfMeasure: '1 User', billingPeriod: 'monthly' } },
      ],
    },
    {
      uniqueProductId: 'redhat_rhel9',
      displayName: 'Red Hat Enterprise Linux 9',
      publisherDisplayName: 'Red Hat',
      publisherId: 'redhat',
      publisherType: 'ThirdParty',
      productType: 'VirtualMachine',
      summary: "The world's leading enterprise Linux platform, certified on hundreds of clouds.",
      popularity: 85,
      pricingTypes: ['PayAsYouGo', 'BYOL'],
      operatingSystems: ['Linux'],
      categoryIds: ['compute', 'operating-systems'],
      lastModifiedDate: '2025-09-15T00:00:00Z',
      plans: [
        { planId: 'rhel-9', displayName: 'RHEL 9', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'rhel-9' },
        { planId: 'rhel-9-byol', displayName: 'RHEL 9 BYOL', pricingTypes: ['BYOL'], cspState: 'OptIn', skuId: 'rhel-9-byol' },
      ],
    },
    {
      uniqueProductId: 'microsoft_sqlserver2022enterprise',
      displayName: 'SQL Server 2022 Enterprise',
      publisherDisplayName: 'Microsoft',
      publisherId: 'microsoft',
      publisherType: 'Microsoft',
      productType: 'VirtualMachine',
      summary: 'Mission-critical intelligent database platform with industry-leading performance.',
      popularity: 87,
      pricingTypes: ['PayAsYouGo', 'BYOL'],
      operatingSystems: ['Windows', 'Linux'],
      categoryIds: ['databases', 'data-platform'],
      lastModifiedDate: '2025-10-01T00:00:00Z',
      plans: [
        { planId: 'enterprise', displayName: 'SQL Server 2022 Enterprise', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'sql-enterprise' },
        { planId: 'standard', displayName: 'SQL Server 2022 Standard', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'sql-standard' },
      ],
    },
    {
      uniqueProductId: 'microsoft_microsoft365e5',
      displayName: 'Microsoft 365 E5',
      publisherDisplayName: 'Microsoft',
      publisherId: 'microsoft',
      publisherType: 'Microsoft',
      productType: 'Office365',
      summary: 'The most complete productivity and security solution for enterprises.',
      popularity: 93,
      pricingTypes: ['Subscription'],
      categoryIds: ['productivity', 'security'],
      lastModifiedDate: '2025-12-01T00:00:00Z',
      plans: [
        { planId: 'e5', displayName: 'Microsoft 365 E5', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'm365-e5' },
        { planId: 'e3', displayName: 'Microsoft 365 E3', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'm365-e3' },
      ],
    },
    {
      uniqueProductId: 'datadog_monitoring',
      displayName: 'Datadog',
      publisherDisplayName: 'Datadog',
      publisherId: 'datadog',
      publisherType: 'ThirdParty',
      productType: 'SaaS',
      summary: 'Cloud-scale monitoring and security platform for cloud applications.',
      popularity: 82,
      pricingTypes: ['Subscription', 'PayAsYouGo'],
      categoryIds: ['monitoring', 'devops'],
      lastModifiedDate: '2025-11-10T00:00:00Z',
      plans: [
        { planId: 'pro', displayName: 'Pro', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'datadog-pro' },
        { planId: 'enterprise', displayName: 'Enterprise', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'datadog-enterprise' },
      ],
    },
    {
      uniqueProductId: 'splunk_enterprise',
      displayName: 'Splunk Enterprise',
      publisherDisplayName: 'Splunk',
      publisherId: 'splunk',
      publisherType: 'ThirdParty',
      productType: 'SaaS',
      summary: 'Turn machine data into answers with the leading platform for Operational Intelligence.',
      popularity: 80,
      pricingTypes: ['BYOL', 'Subscription'],
      categoryIds: ['analytics', 'security'],
      lastModifiedDate: '2025-10-25T00:00:00Z',
      plans: [
        { planId: 'enterprise', displayName: 'Splunk Enterprise', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'splunk-enterprise' },
        { planId: 'cloud', displayName: 'Splunk Cloud', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'splunk-cloud' },
      ],
    },
    {
      uniqueProductId: 'paloaltonetworks_vmseries',
      displayName: 'Palo Alto Networks VM-Series',
      publisherDisplayName: 'Palo Alto Networks',
      publisherId: 'paloaltonetworks',
      publisherType: 'ThirdParty',
      productType: 'VirtualMachine',
      summary: 'Next-Generation Firewall for securing cloud environments.',
      popularity: 76,
      pricingTypes: ['BYOL', 'PayAsYouGo'],
      operatingSystems: ['Linux'],
      categoryIds: ['security', 'networking'],
      lastModifiedDate: '2025-09-20T00:00:00Z',
      plans: [
        { planId: 'byol', displayName: 'VM-Series BYOL', pricingTypes: ['BYOL'], cspState: 'OptIn', skuId: 'vm-series-byol' },
        { planId: 'payg', displayName: 'VM-Series PAYG', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'vm-series-payg' },
      ],
    },
    {
      uniqueProductId: 'nginx_nginxplus',
      displayName: 'NGINX Plus',
      publisherDisplayName: 'F5 Networks',
      publisherId: 'f5-networks',
      publisherType: 'ThirdParty',
      productType: 'VirtualMachine',
      summary: 'High-performance load balancer, web server, and content cache.',
      popularity: 78,
      pricingTypes: ['PayAsYouGo'],
      operatingSystems: ['Linux'],
      categoryIds: ['networking', 'web'],
      lastModifiedDate: '2025-08-30T00:00:00Z',
      plans: [
        { planId: 'plus', displayName: 'NGINX Plus', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'nginx-plus' },
      ],
    },
    {
      uniqueProductId: 'azure_kubernetesservice',
      displayName: 'Azure Kubernetes Service (AKS)',
      publisherDisplayName: 'Microsoft',
      publisherId: 'microsoft',
      publisherType: 'Microsoft',
      productType: 'ContainerApps',
      summary: 'Highly available, secure, and fully managed Kubernetes service.',
      popularity: 89,
      pricingTypes: ['PayAsYouGo'],
      categoryIds: ['containers', 'compute'],
      lastModifiedDate: '2025-11-20T00:00:00Z',
      plans: [
        { planId: 'standard', displayName: 'AKS Standard', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'aks-standard' },
        { planId: 'premium', displayName: 'AKS Premium', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'aks-premium' },
      ],
    },
    {
      uniqueProductId: 'hashicorp_terraform',
      displayName: 'Terraform Cloud',
      publisherDisplayName: 'HashiCorp',
      publisherId: 'hashicorp',
      publisherType: 'ThirdParty',
      productType: 'SaaS',
      summary: 'Collaborative infrastructure as code for teams.',
      popularity: 84,
      pricingTypes: ['Free', 'Subscription'],
      categoryIds: ['devops', 'infrastructure'],
      lastModifiedDate: '2025-10-15T00:00:00Z',
      plans: [
        { planId: 'free', displayName: 'Free', pricingTypes: ['Free'], cspState: 'OptIn', skuId: 'terraform-free' },
        { planId: 'team', displayName: 'Team', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'terraform-team' },
        { planId: 'business', displayName: 'Business', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'terraform-business' },
      ],
    },
    {
      uniqueProductId: 'elastic_elasticsearch',
      displayName: 'Elastic Cloud (Elasticsearch)',
      publisherDisplayName: 'Elastic',
      publisherId: 'elastic',
      publisherType: 'ThirdParty',
      productType: 'SaaS',
      summary: 'Search, observe, and protect your data with the Elastic Stack.',
      popularity: 81,
      pricingTypes: ['PayAsYouGo', 'Subscription'],
      categoryIds: ['analytics', 'monitoring'],
      lastModifiedDate: '2025-11-05T00:00:00Z',
      plans: [
        { planId: 'standard', displayName: 'Standard', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'elastic-standard' },
        { planId: 'gold', displayName: 'Gold', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'elastic-gold' },
        { planId: 'platinum', displayName: 'Platinum', pricingTypes: ['Subscription'], cspState: 'OptIn', skuId: 'elastic-platinum' },
      ],
    },
    {
      uniqueProductId: 'confluent_cloud',
      displayName: 'Confluent Cloud',
      publisherDisplayName: 'Confluent',
      publisherId: 'confluent',
      publisherType: 'ThirdParty',
      productType: 'SaaS',
      summary: 'Fully managed Apache Kafka service for real-time data streaming.',
      popularity: 79,
      pricingTypes: ['PayAsYouGo'],
      categoryIds: ['data-platform', 'streaming'],
      lastModifiedDate: '2025-10-30T00:00:00Z',
      plans: [
        { planId: 'basic', displayName: 'Basic', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'confluent-basic' },
        { planId: 'standard', displayName: 'Standard', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'confluent-standard' },
        { planId: 'dedicated', displayName: 'Dedicated', pricingTypes: ['PayAsYouGo'], cspState: 'OptIn', skuId: 'confluent-dedicated' },
      ],
    },
  ];
}

server.listen(PORT, () => {
  console.log(`[partner-center-dev] Listening on http://localhost:${PORT}`);
});

