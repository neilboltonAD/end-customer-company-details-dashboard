type TokenResponse = {
  token_type: string;
  expires_in: number;
  ext_expires_in?: number;
  access_token: string;
};

const getEnv = (name: string) => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
};

let cachedToken: { token: string; expiresAtMs: number } | null = null;

export async function getPartnerCenterAccessToken(): Promise<string> {
  const tenantId = getEnv('AZURE_TENANT_ID');
  const clientId = getEnv('AZURE_CLIENT_ID');
  const clientSecret = getEnv('AZURE_CLIENT_SECRET');
  const scope = process.env.PARTNER_CENTER_SCOPE || 'https://api.partnercenter.microsoft.com/.default';

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAtMs - 60_000 > now) {
    return cachedToken.token;
  }

  const url = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
  const body = new URLSearchParams();
  body.set('client_id', clientId);
  body.set('client_secret', clientSecret);
  body.set('grant_type', 'client_credentials');
  body.set('scope', scope);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Token request failed (${res.status}): ${text || res.statusText}`);
  }

  const json = (await res.json()) as TokenResponse;
  const expiresAtMs = now + json.expires_in * 1000;
  cachedToken = { token: json.access_token, expiresAtMs };
  return json.access_token;
}

export async function getPartnerCenterAccessTokenWithCreds(creds: {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  scope?: string;
}): Promise<string> {
  const scope = creds.scope || process.env.PARTNER_CENTER_SCOPE || 'https://api.partnercenter.microsoft.com/.default';
  const url = `https://login.microsoftonline.com/${encodeURIComponent(creds.tenantId)}/oauth2/v2.0/token`;
  const body = new URLSearchParams();
  body.set('client_id', creds.clientId);
  body.set('client_secret', creds.clientSecret);
  body.set('grant_type', 'client_credentials');
  body.set('scope', scope);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Token request failed (${res.status}): ${text || res.statusText}`);
  }

  const json = (await res.json()) as TokenResponse;
  return json.access_token;
}

export async function partnerCenterFetchWithToken<T>(
  token: string,
  path: string,
  init?: RequestInit
): Promise<{ status: number; data: T; headers: Headers }> {
  const baseUrl = process.env.PARTNER_CENTER_BASE_URL || 'https://api.partnercenter.microsoft.com';
  const url = `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  const text = await res.text();
  let data: T;
  try {
    data = (text ? JSON.parse(text) : null) as T;
  } catch {
    data = ({ raw: text } as unknown) as T;
  }

  return { status: res.status, data, headers: res.headers };
}

export async function partnerCenterFetch<T>(
  path: string,
  init?: RequestInit
): Promise<{ status: number; data: T; headers: Headers }> {
  const token = await getPartnerCenterAccessToken();
  return await partnerCenterFetchWithToken<T>(token, path, init);
}

