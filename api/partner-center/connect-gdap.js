const { buildAuthorizeUrl } = require('../../lib/server/delegatedAuth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  try {
    const { authorizeUrl } = buildAuthorizeUrl(req, res, { kind: 'gdap' });
    res.status(302).setHeader('Location', authorizeUrl);
    res.end();
  } catch (e) {
    res.status(500).json({ ok: false, error: (e && e.message) || 'Connect failed', timestamp: new Date().toISOString() });
  }
};

