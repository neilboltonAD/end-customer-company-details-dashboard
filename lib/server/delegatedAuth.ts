import type { VercelRequest, VercelResponse } from '@vercel/node';
import { decryptString, encryptString } from './crypto';
import { kvDel, kvGet, kvSet } from './kv';
import { ensureSessionId, parseCookies, setCookie, cookieString } from './cookies';

export type TokenResponse = {
  token_type: string;
  scope?: string;
  expires_in: number;
  ext_expires_in?: number;
  access_token: string;
  refresh_token?: string;
  id_token?: string;
};

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function baseUrlFromReq(req: VercelRequest) {
  const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString().split(',')[0].trim();
  if (!host) throw new Error('Missing Host header.');
  return `${proto}://${host}`;
}

function sha256(input: string) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto') as typeof import('crypto');
  return crypto.createHash('sha256').update(input).digest();
}

function base64UrlEncode(buf: Buffer) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function cryptoRandomUrlSafe(bytes: number) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto') as typeof import('crypto');
  return base64UrlEncode(crypto.randomBytes(bytes));
}

function createPkcePair() {
  const verifier = cryptoRandomUrlSafe(64);
  const challenge = base64UrlEncode(sha256(verifier));
  return { verifier, challenge };
}

type OAuthCookie = {
  state: string;
  verifier: string;
  kind: 'partnerCenter' | 'gdap';
  returnTo?: string;
  createdAt: string;
};

function oauthCookieName(kind: OAuthCookie['kind']) {
  return kind === 'gdap' ? 'pc_oauth_gdap' : 'pc_oauth';
}

function setOAuthCookie(req: VercelRequest, res: VercelResponse, cookie: OAuthCookie) {
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

function readOAuthCookie(req: VercelRequest, kind: OAuthCookie['kind']): OAuthCookie | null {
  const cookies = parseCookies(req);
  const raw = cookies[oauthCookieName(kind)];
  if (!raw) return null;
  try {
    const json = decryptString(raw);
    return JSON.parse(json) as OAuthCookie;
  } catch {
    return null;
  }
}

function clearOAuthCookie(req: VercelRequest, res: VercelResponse, kind: OAuthCookie['kind']) {
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

export function buildAuthorizeUrl(req: VercelRequest, res: VercelResponse, opts: { kind: OAuthCookie['kind'] }) {
  const baseUrl = baseUrlFromReq(req);
  const tenantId = getTenantId();
  const clientId = getClientId();
  const redirectUri = `${baseUrl}/api/partner-center/callback`;

  const state = cryptoRandomUrlSafe(24);
  const pkce = createPkcePair();

  const scope = opts.kind === 'gdap' ? gdapGraphScopes() : partnerCenterScopes();
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
    returnTo: (req.headers.referer || '').toString() || undefined,
    createdAt: new Date().toISOString(),
  });

  ensureSessionId(req, res);
  return { authorizeUrl: url };
}

async function exchangeCodeForTokens(args: {
  code: string;
  redirectUri: string;
  codeVerifier: string;
  scope: string;
}): Promise<TokenResponse> {
  const tenantId = getTenantId();
  const clientId = getClientId();
  const clientSecret = getClientSecretOptional();

  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
  const body = new URLSearchParams();
  body.set('client_id', clientId);
  body.set('grant_type', 'authorization_code');
  body.set('code', args.code);
  body.set('redirect_uri', args.redirectUri);
  body.set('scope', args.scope);
  body.set('code_verifier', args.codeVerifier);
  if (clientSecret) body.set('client_secret', clientSecret);

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Code exchange failed (HTTP ${res.status}): ${text || res.statusText}`);
  return JSON.parse(text) as TokenResponse;
}

async function refreshAccessToken(args: { refreshToken: string; scope: string }): Promise<TokenResponse> {
  const tenantId = getTenantId();
  const clientId = getClientId();
  const clientSecret = getClientSecretOptional();
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
  const body = new URLSearchParams();
  body.set('client_id', clientId);
  body.set('grant_type', 'refresh_token');
  body.set('refresh_token', args.refreshToken);
  body.set('scope', args.scope);
  if (clientSecret) body.set('client_secret', clientSecret);

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Refresh failed (HTTP ${res.status}): ${text || res.statusText}`);
  return JSON.parse(text) as TokenResponse;
}

function refreshKey(sessionId: string, kind: OAuthCookie['kind']) {
  return kind === 'gdap' ? `pc:refresh:gdap:${sessionId}` : `pc:refresh:pc:${sessionId}`;
}

export async function storeRefreshToken(sessionId: string, kind: OAuthCookie['kind'], refreshToken: string) {
  await kvSet(refreshKey(sessionId, kind), encryptString(refreshToken));
}

export async function clearStoredTokens(sessionId: string) {
  await Promise.all([kvDel(refreshKey(sessionId, 'partnerCenter')), kvDel(refreshKey(sessionId, 'gdap'))]);
}

export async function getAccessTokenForSession(sessionId: string, kind: OAuthCookie['kind']): Promise<string> {
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

export async function handleOAuthCallback(req: VercelRequest, res: VercelResponse) {
  const baseUrl = baseUrlFromReq(req);
  const redirectUri = `${baseUrl}/api/partner-center/callback`;
  const code = (req.query.code || '').toString();
  const state = (req.query.state || '').toString();
  if (!code) throw new Error('Missing code');
  if (!state) throw new Error('Missing state');

  const pcCookie = readOAuthCookie(req, 'partnerCenter');
  const gdapCookie = readOAuthCookie(req, 'gdap');
  const cookie = gdapCookie && gdapCookie.state === state ? gdapCookie : pcCookie && pcCookie.state === state ? pcCookie : null;
  if (!cookie) throw new Error('State mismatch or missing OAuth cookie.');

  const sessionId = ensureSessionId(req, res);
  const scope = cookie.kind === 'gdap' ? gdapGraphScopes() : partnerCenterScopes();
  const token = await exchangeCodeForTokens({ code, redirectUri, codeVerifier: cookie.verifier, scope });

  if (!token.refresh_token) {
    throw new Error('No refresh_token returned. Ensure offline_access is included in scopes.');
  }

  await storeRefreshToken(sessionId, cookie.kind, token.refresh_token);
  clearOAuthCookie(req, res, cookie.kind);

  const returnTo =
    cookie.returnTo ||
    (cookie.kind === 'gdap'
      ? `${baseUrl}/operations/microsoft/onboarding/gdap`
      : `${baseUrl}/settings/vendor-integrations/microsoft`);

  res.status(302).setHeader('Location', returnTo);
  res.end();
}

