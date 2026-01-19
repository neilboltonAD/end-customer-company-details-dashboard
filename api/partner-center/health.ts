import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSessionId } from '../../lib/server/cookies';
import { getAccessTokenForSession } from '../../lib/server/delegatedAuth';
import { partnerCenterFetch, partnerCenterFetchWithToken } from '../../lib/server/partnerCenter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  try {
    // Prefer delegated token if session exists; else fall back to app-only token.
    let token: string | null = null;
    try {
      const sessionId = ensureSessionId(req, res);
      token = await getAccessTokenForSession(sessionId, 'partnerCenter');
    } catch {
      token = null;
    }

    const pc = token
      ? await partnerCenterFetchWithToken<any>(token, '/v1/customers?size=1')
      : await partnerCenterFetch<any>('/v1/customers?size=1');

    const ok = pc.status >= 200 && pc.status < 300;
    res.status(ok ? 200 : pc.status).json({
      ok,
      partnerCenter: { status: pc.status, sampleEndpoint: '/v1/customers?size=1' },
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'Unknown error', timestamp: new Date().toISOString() });
  }
}

