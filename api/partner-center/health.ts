import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPartnerCenterAccessToken, partnerCenterFetch, partnerCenterFetchWithToken } from '../_lib/partnerCenter';
import { ensureSessionId } from '../_lib/cookies';
import { getAccessTokenForSession } from '../_lib/delegatedAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    // Prefer delegated token if user is connected (better parity with UI / MFA scenarios).
    let token: string | null = null;
    try {
      const sessionId = ensureSessionId(req, res);
      token = await getAccessTokenForSession(sessionId, 'partnerCenter');
    } catch {
      token = null;
    }

    // Lightweight API call to validate Partner Center access (safe, low cost)
    // Note: If tenant lacks permissions, this will 401/403 and we’ll surface that.
    const pc = token
      ? await partnerCenterFetchWithToken<any>(token, '/v1/customers?size=1')
      : await partnerCenterFetch<any>('/v1/customers?size=1');

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

