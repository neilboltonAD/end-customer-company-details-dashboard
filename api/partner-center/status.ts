import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
      return;
    }

    // Use dynamic imports so any bundling/module-resolution issues become a JSON error instead of a hard crash page.
    const { ensureSessionId } = await import('../_lib/cookies');
    const { getAccessTokenForSession } = await import('../_lib/delegatedAuth');

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
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ ok: false, error: message, timestamp: new Date().toISOString() });
  }
}

