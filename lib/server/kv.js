function getKvEnv() {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.VERCEL_KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.VERCEL_KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      'Missing KV env vars. Set KV_REST_API_URL + KV_REST_API_TOKEN (or VERCEL_KV_REST_API_URL + VERCEL_KV_REST_API_TOKEN / UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).'
    );
  }

  return { url: url.replace(/\/$/, ''), token };
}

async function kvCall(path) {
  const { url, token } = getKvEnv();
  const res = await fetch(`${url}${path.startsWith('/') ? path : `/${path}`}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`KV request failed (HTTP ${res.status}): ${text || res.statusText}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function kvGet(key) {
  const r = await kvCall(`/get/${encodeURIComponent(key)}`);
  return r && Object.prototype.hasOwnProperty.call(r, 'result') ? r.result : null;
}

async function kvSet(key, value) {
  await kvCall(`/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`);
}

async function kvDel(key) {
  await kvCall(`/del/${encodeURIComponent(key)}`);
}

module.exports = { kvGet, kvSet, kvDel };

