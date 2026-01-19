import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSessionId } from '../../lib/server/cookies';
import { getAccessTokenForSession } from '../../lib/server/delegatedAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  const sessionId = ensureSessionId(req, res);
  let hasPartnerCenter = false;
  let hasGdap = false;
  try {
    await getAccessTokenForSession(sessionId, 'partnerCenter');
    hasPartnerCenter = true;
  } catch {
    hasPartnerCenter = false;
  }
  try {
    await getAccessTokenForSession(sessionId, 'gdap');
    hasGdap = true;
  } catch {
    hasGdap = false;
  }

  res.status(200).json({
    ok: hasPartnerCenter,
    store: { hasPartnerCenter, hasGdap },
    timestamp: new Date().toISOString(),
  });
}

