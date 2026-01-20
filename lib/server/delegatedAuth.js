const { decryptString, encryptString } = require('./crypto');
const { kvDel, kvGet, kvSet } = require('./kv');
const { ensureSessionId, parseCookies, setCookie, cookieString } = require('./cookies');

function getEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function baseUrlFromReq(req) {
  const proto = String((req.headers && req.headers['x-forwarded-proto']) || 'https')
    .split(',')[0]
    .trim();
  const host = String((req.headers && (req.headers['x-forwarded-host'] || req.headers.host)) || '')
    .split(',')[0]
    .trim();
  if (!host) throw new Error('Missing Host header.');
  return `${proto}://${host}`;
}

function sha256(input) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(String(input)).digest();
}

function base64UrlEncode(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function cryptoRandomUrlSafe(bytes) {
  const crypto = require('crypto');
  return base64UrlEncode(crypto.randomBytes(bytes));
}

function createPkcePair() {
  const verifier = cryptoRandomUrlSafe(64);
  const challenge = base64UrlEncode(sha256(verifier));
  return { verifier, challenge };
}

function oauthCookieName(kind) {
  return kind === 'gdap' ? 'pc_oauth_gdap' : 'pc_oauth';
}

function setOAuthCookie(req, res, cookie) {
  const secure = baseUrlFromReq(req).startsWith('https://');
  setCookie(
    res,
    cookieString({
      name: oauthCookieName(cookie.kind),
      value: encryptString(JSON.stringify(cookie)),
      secure,
      sameSite: 'Lax',
      httpOnly: true,
      path: '/',
      maxAgeSeconds: 60 * 10,
    })
  );
}

function readOAuthCookie(req, kind) {
  const cookies = parseCookies(req);
  const raw = cookies[oauthCookieName(kind)];
  if (!raw) return null;
  try {
    const json = decryptString(raw);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function clearOAuthCookie(req, res, kind) {
  const secure = baseUrlFromReq(req).startsWith('https://');
  setCookie(
    res,
    cookieString({
      name: oauthCookieName(kind),
      value: '',
      secure,
      sameSite: 'Lax',
      httpOnly: true,
      path: '/',
      maxAgeSeconds: 0,
    })
  );
}

function getTenantId() {
  return getEnv('AZURE_TENANT_ID');
}
function getClientId() {
  return getEnv('AZURE_CLIENT_ID');
}
function getClientSecretOptional() {
  return process.env.AZURE_CLIENT_SECRET || '';
}

function partnerCenterScopes() {
  return (
    process.env.PARTNER_CENTER_SCOPE_DELEGATED ||
    'https://api.partnercenter.microsoft.com/user_impersonation offline_access openid profile'
  );
}

function gdapGraphScopes() {
  return (
    process.env.GDAP_GRAPH_SCOPES ||
    'https://graph.microsoft.com/DelegatedAdminRelationship.Read.All offline_access openid profile'
  );
}

function unionScopes(scopesA, scopesB) {
  const tokens = []
    .concat(String(scopesA || '').split(/\s+/).filter(Boolean))
    .concat(String(scopesB || '').split(/\s+/).filter(Boolean));
  // Deduplicate while keeping order.
  const seen = new Set();
  const out = [];
  for (const t of tokens) {
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out.join(' ');
}

function buildAuthorizeUrl(req, res, opts) {
  const baseUrl = baseUrlFromReq(req);
  const tenantId = getTenantId();
  const clientId = getClientId();
  const redirectUri = `${baseUrl}/api/partner-center/callback`;

  const state = cryptoRandomUrlSafe(24);
  const pkce = createPkcePair();

  const scope =
    opts.kind === 'gdap'
      ? gdapGraphScopes()
      : // Partner Center connect should also consent GDAP scopes so a single connect enables both.
        unionScopes(partnerCenterScopes(), gdapGraphScopes());
  const url =
    `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_mode=query` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${encodeURIComponent(state)}` +
    `&code_challenge=${encodeURIComponent(pkce.challenge)}` +
    `&code_challenge_method=S256`;

  setOAuthCookie(req, res, {
    state,
    verifier: pkce.verifier,
    kind: opts.kind,
    returnTo: String(req.headers && req.headers.referer ? req.headers.referer : '') || undefined,
    createdAt: new Date().toISOString(),
  });

  ensureSessionId(req, res);
  return { authorizeUrl: url };
}

async function exchangeCodeForTokens({ code, redirectUri, codeVerifier, scope }) {
  const tenantId = getTenantId();
  const clientId = getClientId();
  const clientSecret = getClientSecretOptional();

  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
  const body = new URLSearchParams();
  body.set('client_id', clientId);
  body.set('grant_type', 'authorization_code');
  body.set('code', code);
  body.set('redirect_uri', redirectUri);
  body.set('scope', scope);
  body.set('code_verifier', codeVerifier);
  if (clientSecret) body.set('client_secret', clientSecret);

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Code exchange failed (HTTP ${res.status}): ${text || res.statusText}`);
  return JSON.parse(text);
}

async function refreshAccessToken({ refreshToken, scope }) {
  const tenantId = getTenantId();
  const clientId = getClientId();
  const clientSecret = getClientSecretOptional();

  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
  const body = new URLSearchParams();
  body.set('client_id', clientId);
  body.set('grant_type', 'refresh_token');
  body.set('refresh_token', refreshToken);
  body.set('scope', scope);
  if (clientSecret) body.set('client_secret', clientSecret);

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Refresh failed (HTTP ${res.status}): ${text || res.statusText}`);
  return JSON.parse(text);
}

function refreshKey(sessionId, kind) {
  return kind === 'gdap' ? `pc:refresh:gdap:${sessionId}` : `pc:refresh:pc:${sessionId}`;
}

async function storeRefreshToken(sessionId, kind, refreshToken) {
  await kvSet(refreshKey(sessionId, kind), encryptString(refreshToken));
}

async function clearStoredTokens(sessionId) {
  await Promise.all([kvDel(refreshKey(sessionId, 'partnerCenter')), kvDel(refreshKey(sessionId, 'gdap'))]);
}

async function getAccessTokenForSession(sessionId, kind) {
  const enc = await kvGet(refreshKey(sessionId, kind));
  if (!enc) throw new Error(kind === 'gdap' ? 'Not connected to GDAP (Graph).' : 'Not connected to Partner Center.');

  const refreshToken = decryptString(enc);
  const scope = kind === 'gdap' ? gdapGraphScopes() : partnerCenterScopes();
  const refreshed = await refreshAccessToken({ refreshToken, scope });

  if (refreshed.refresh_token) {
    await storeRefreshToken(sessionId, kind, refreshed.refresh_token);
  }

  return refreshed.access_token;
}

async function handleOAuthCallback(req, res) {
  const baseUrl = baseUrlFromReq(req);
  const redirectUri = `${baseUrl}/api/partner-center/callback`;
  const code = String((req.query && req.query.code) || '');
  const state = String((req.query && req.query.state) || '');
  if (!code) throw new Error('Missing code');
  if (!state) throw new Error('Missing state');

  const pcCookie = readOAuthCookie(req, 'partnerCenter');
  const gdapCookie = readOAuthCookie(req, 'gdap');
  const cookie =
    gdapCookie && gdapCookie.state === state
      ? gdapCookie
      : pcCookie && pcCookie.state === state
        ? pcCookie
        : null;
  if (!cookie) throw new Error('State mismatch or missing OAuth cookie.');

  const sessionId = ensureSessionId(req, res);
  const scope =
    cookie.kind === 'gdap' ? gdapGraphScopes() : unionScopes(partnerCenterScopes(), gdapGraphScopes());
  const token = await exchangeCodeForTokens({ code, redirectUri, codeVerifier: cookie.verifier, scope });

  if (!token.refresh_token) {
    throw new Error('No refresh_token returned. Ensure offline_access is included in scopes.');
  }

  // If the user connected via the Partner Center flow, we store the refresh token for BOTH Partner Center and GDAP.
  // This makes the GDAP pages work immediately without requiring a second manual "Connect GDAP".
  if (cookie.kind === 'partnerCenter') {
    await Promise.all([
      storeRefreshToken(sessionId, 'partnerCenter', token.refresh_token),
      storeRefreshToken(sessionId, 'gdap', token.refresh_token),
    ]);
  } else {
    await storeRefreshToken(sessionId, cookie.kind, token.refresh_token);
  }
  clearOAuthCookie(req, res, cookie.kind);

  const returnTo =
    cookie.returnTo ||
    (cookie.kind === 'gdap'
      ? `${baseUrl}/operations/microsoft/onboarding/gdap`
      : `${baseUrl}/settings/vendor-integrations/microsoft`);

  res.status(302).setHeader('Location', returnTo);
  res.end();
}

module.exports = {
  buildAuthorizeUrl,
  handleOAuthCallback,
  storeRefreshToken,
  clearStoredTokens,
  getAccessTokenForSession,
};

