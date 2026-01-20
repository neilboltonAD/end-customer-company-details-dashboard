const { ensureSessionId } = require('../../lib/server/cookies');
const { clearStoredTokens } = require('../../lib/server/delegatedAuth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  try {
    const sessionId = ensureSessionId(req, res);
    await clearStoredTokens(sessionId);
    res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: (e && e.message) || 'Disconnect failed', timestamp: new Date().toISOString() });
  }
};

