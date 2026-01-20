const { ensureSessionId } = require('../../lib/server/cookies');
const { getAccessTokenForSession } = require('../../lib/server/delegatedAuth');
const { partnerCenterFetch, partnerCenterFetchWithToken } = require('../../lib/server/partnerCenter');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  try {
    // Prefer delegated token if session exists; else fall back to app-only token.
    let token = null;
    try {
      const sessionId = ensureSessionId(req, res);
      token = await getAccessTokenForSession(sessionId, 'partnerCenter');
    } catch {
      token = null;
    }

    const pc = token
      ? await partnerCenterFetchWithToken(token, '/v1/customers?size=1')
      : await partnerCenterFetch('/v1/customers?size=1');

    const ok = pc.status >= 200 && pc.status < 300;
    res.status(ok ? 200 : pc.status).json({
      ok,
      partnerCenter: { status: pc.status, sampleEndpoint: '/v1/customers?size=1' },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: (e && e.message) || 'Unknown error', timestamp: new Date().toISOString() });
  }
};

