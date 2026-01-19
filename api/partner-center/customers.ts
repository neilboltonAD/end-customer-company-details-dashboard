import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSessionId } from '../_lib/cookies';
import { getAccessTokenForSession } from '../_lib/delegatedAuth';
import { partnerCenterFetchWithToken } from '../_lib/partnerCenter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', customers: [], timestamp: new Date().toISOString() });
    return;
  }

  try {
    const sessionId = ensureSessionId(req, res);
    const size = Math.min(Number(req.query.size || '50'), 500);
    const token = await getAccessTokenForSession(sessionId, 'partnerCenter');
    const pc = await partnerCenterFetchWithToken<any>(token, `/v1/customers?size=${size}`);
    const ok = pc.status >= 200 && pc.status < 300;
    const items = Array.isArray(pc.data?.items) ? pc.data.items : [];
    const customers = items.map((c: any) => ({
      id: c?.id,
      companyName: c?.companyProfile?.companyName,
      defaultDomain: c?.companyProfile?.domain,
      tenantId: c?.companyProfile?.tenantId || c?.id,
    }));

    res.status(ok ? 200 : pc.status).json({
      ok,
      partnerCenter: { status: pc.status, sampleEndpoint: `/v1/customers?size=${size}` },
      customers: ok ? customers : [],
      error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
      debug: ok ? undefined : { partnerCenter: pc.data },
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'Customers failed', customers: [], timestamp: new Date().toISOString() });
  }
}

