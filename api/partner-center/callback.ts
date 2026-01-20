import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOAuthCallback } from '../../lib/server/delegatedAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  try {
    await handleOAuthCallback(req, res);
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'Callback failed', timestamp: new Date().toISOString() });
  }
}

