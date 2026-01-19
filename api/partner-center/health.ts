import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPartnerCenterAccessToken, partnerCenterFetch } from '../_lib/partnerCenter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    // Acquire token (proves Entra creds + consent are valid)
    await getPartnerCenterAccessToken();

    // Lightweight API call to validate Partner Center access (safe, low cost)
    // Note: If tenant lacks permissions, this will 401/403 and we’ll surface that.
    const pc = await partnerCenterFetch<any>('/v1/customers?size=1');

    const ok = pc.status >= 200 && pc.status < 300;
    res.status(ok ? 200 : pc.status).json({
      ok,
      partnerCenter: {
        status: pc.status,
        sampleEndpoint: '/v1/customers?size=1',
      },
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

