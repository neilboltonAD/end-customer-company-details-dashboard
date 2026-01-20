const { buildAuthorizeUrl } = require('../../lib/server/delegatedAuth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  try {
    const returnTo = (req.query && req.query.returnTo ? String(req.query.returnTo) : '') || undefined;
    const { authorizeUrl } = buildAuthorizeUrl(req, res, { kind: 'partnerCenter', returnTo });
    res.status(302).setHeader('Location', authorizeUrl);
    res.end();
  } catch (e) {
    res.status(500).json({ ok: false, error: (e && e.message) || 'Connect failed', timestamp: new Date().toISOString() });
  }
};

