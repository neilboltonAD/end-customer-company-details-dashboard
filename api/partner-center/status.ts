import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSessionId } from '../_lib/cookies';
import { kvGet } from '../_lib/kv';

function refreshKey(sessionId: string, kind: 'pc' | 'gdap') {
  return kind === 'gdap' ? `pc:refresh:gdap:${sessionId}` : `pc:refresh:pc:${sessionId}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  try {
    const sessionId = ensureSessionId(req, res);
    const [pc, gdap] = await Promise.all([kvGet(refreshKey(sessionId, 'pc')), kvGet(refreshKey(sessionId, 'gdap'))]);
    res.status(200).json({
      ok: Boolean(pc),
      store: {
        hasPartnerCenter: Boolean(pc),
        hasGdap: Boolean(gdap),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'Status failed', timestamp: new Date().toISOString() });
  }
}

