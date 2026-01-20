const { handleOAuthCallback } = require('../../lib/server/delegatedAuth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  try {
    await handleOAuthCallback(req, res);
  } catch (e) {
    res.status(500).json({ ok: false, error: (e && e.message) || 'Callback failed', timestamp: new Date().toISOString() });
  }
};

