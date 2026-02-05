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
          scope: kind === 'gdap' ? gdapGraphDelegatedScope() : partnerCenterDelegatedScope(),
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
      } else {
        writeTokenStore({
          ...nextStore,
          refreshToken,
          accessToken,
          accessTokenClaims: claims,
        });
      }

      // Redirect back to UI (default to GDAP page if we just connected GDAP)
      const uiRedirect =
        kind === 'gdap'
          ? 'http://localhost:3000/operations/microsoft/onboarding/gdap'
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
        connectedAt: store?.connectedAt,
        gdapConnectedAt: store?.gdapConnectedAt,
      },
      timestamp: new Date().toISOString(),
    });
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

      if (!customerTenantId) {
        json(res, 400, { ok: false, error: 'Missing required field: customerTenantId', relationship: null, timestamp: new Date().toISOString() });
        return;
      }
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
      const gdapPayload = {
        displayName,
        duration: duration || 'P730D',
        customer: { tenantId: customerTenantId },
        accessDetails: {
          unifiedRoles: roles.map((roleId) => ({ roleDefinitionId: roleId })),
        },
      };
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

  json(res, 404, { ok: false, error: 'Not found', timestamp: new Date().toISOString() });
});

server.listen(PORT, () => {
  console.log(`[partner-center-dev] Listening on http://localhost:${PORT}`);
});

