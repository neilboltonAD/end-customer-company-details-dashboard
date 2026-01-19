import type { VercelRequest, VercelResponse } from '@vercel/node';
import { partnerCenterFetchWithToken } from '../_lib/partnerCenter';

function summarizeCustomers(payload: any): Array<{ id?: string; companyName?: string; defaultDomain?: string }> {
  const items: any[] = Array.isArray(payload?.items) ? payload.items : [];
  return items.slice(0, 10).map((c) => ({
    id: c?.id,
    companyName: c?.companyProfile?.companyName,
    defaultDomain: c?.companyProfile?.domain,
  }));
}

function bearerFrom(req: VercelRequest): string | null {
  const header = req.headers.authorization || '';
  const m = header.match(/^Bearer\s+(.+)$/i);
  return m?.[1] || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  try {
    const token = bearerFrom(req);
    if (!token) {
      res.status(401).json({ ok: false, error: 'Missing Authorization: Bearer <token>', timestamp: new Date().toISOString() });
      return;
    }

    const pc = await partnerCenterFetchWithToken<any>(token, '/v1/customers?size=10');
    const ok = pc.status >= 200 && pc.status < 300;

    res.status(ok ? 200 : pc.status).json({
      ok,
      partnerCenter: {
        status: pc.status,
        sampleEndpoint: '/v1/customers?size=10',
      },
      customersSample: ok ? summarizeCustomers(pc.data) : [],
      error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
      debug: ok ? undefined : { partnerCenterStatus: pc.status, partnerCenterResponse: pc.data },
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({
      ok: false,
      error: e?.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}

