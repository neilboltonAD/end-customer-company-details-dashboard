const getEnv = (name) => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
};

let cachedToken = null;

async function getPartnerCenterAccessToken() {
  const tenantId = getEnv('AZURE_TENANT_ID');
  const clientId = getEnv('AZURE_CLIENT_ID');
  const clientSecret = getEnv('AZURE_CLIENT_SECRET');
  const scope = process.env.PARTNER_CENTER_SCOPE || 'https://api.partnercenter.microsoft.com/.default';

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAtMs - 60_000 > now) return cachedToken.token;

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

  const json = await res.json();
  cachedToken = { token: json.access_token, expiresAtMs: now + Number(json.expires_in || 0) * 1000 };
  return json.access_token;
}

async function getPartnerCenterAccessTokenWithCreds(creds) {
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

  const json = await res.json();
  return json.access_token;
}

async function partnerCenterFetchWithToken(token, path, init) {
  const baseUrl = process.env.PARTNER_CENTER_BASE_URL || 'https://api.partnercenter.microsoft.com';
  const url = `${String(baseUrl).replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

  const res = await fetch(url, {
    ...(init || {}),
    headers: {
      ...((init && init.headers) || {}),
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

  return { status: res.status, data, headers: res.headers };
}

async function partnerCenterFetch(path, init) {
  const token = await getPartnerCenterAccessToken();
  return partnerCenterFetchWithToken(token, path, init);
}

module.exports = {
  getPartnerCenterAccessToken,
  getPartnerCenterAccessTokenWithCreds,
  partnerCenterFetchWithToken,
  partnerCenterFetch,
};

