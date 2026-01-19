type UpstashResult<T> = { result: T };

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

async function kvCall<T>(path: string): Promise<T> {
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
    return JSON.parse(text) as T;
  } catch {
    // Upstash always returns JSON; keep best-effort.
    return ({ raw: text } as unknown) as T;
  }
}

export async function kvGet(key: string): Promise<string | null> {
  const r = await kvCall<UpstashResult<string | null>>(`/get/${encodeURIComponent(key)}`);
  return (r as any)?.result ?? null;
}

export async function kvSet(key: string, value: string): Promise<void> {
  await kvCall<UpstashResult<'OK'>>(`/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`);
}

export async function kvDel(key: string): Promise<void> {
  await kvCall<UpstashResult<number>>(`/del/${encodeURIComponent(key)}`);
}

