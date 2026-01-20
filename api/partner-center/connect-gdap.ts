import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildAuthorizeUrl } from '../_lib/delegatedAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  try {
    const { authorizeUrl } = buildAuthorizeUrl(req, res, { kind: 'gdap' });
    res.status(302).setHeader('Location', authorizeUrl);
    res.end();
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'Connect GDAP failed', timestamp: new Date().toISOString() });
  }
}

