import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSessionId } from '../_lib/cookies';
import { clearStoredTokens } from '../_lib/delegatedAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  try {
    const sessionId = ensureSessionId(req, res);
    await clearStoredTokens(sessionId);
    res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'Disconnect failed', timestamp: new Date().toISOString() });
  }
}

