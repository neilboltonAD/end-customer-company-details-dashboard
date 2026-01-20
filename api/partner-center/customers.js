const { ensureSessionId } = require('../../lib/server/cookies');
const { getAccessTokenForSession } = require('../../lib/server/delegatedAuth');
const { partnerCenterFetchWithToken } = require('../../lib/server/partnerCenter');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', customers: [], timestamp: new Date().toISOString() });
    return;
  }

  try {
    const size = Math.min(Number((req.query && req.query.size) || '50'), 500);
    const sessionId = ensureSessionId(req, res);
    const token = await getAccessTokenForSession(sessionId, 'partnerCenter');
    const pc = await partnerCenterFetchWithToken(token, `/v1/customers?size=${size}`);

    const ok = pc.status >= 200 && pc.status < 300;
    const items = Array.isArray(pc.data && pc.data.items) ? pc.data.items : [];
    const customers = items.map((c) => ({
      id: c && c.id,
      companyName: c && c.companyProfile && c.companyProfile.companyName,
      defaultDomain: c && c.companyProfile && c.companyProfile.domain,
      tenantId: (c && c.companyProfile && c.companyProfile.tenantId) || (c && c.id),
      // Best-effort contact info for outbound customer comms (may be empty depending on Partner Center tenant config).
      contactEmail:
        (c && c.billingProfile && (c.billingProfile.email || (c.billingProfile.defaultAddress && c.billingProfile.defaultAddress.email))) ||
        (c && c.companyProfile && c.companyProfile.email) ||
        undefined,
      contactName:
        (c &&
          c.billingProfile &&
          [c.billingProfile.firstName, c.billingProfile.lastName].filter(Boolean).join(' ').trim()) ||
        undefined,
    }));

    res.status(ok ? 200 : pc.status).json({
      ok,
      partnerCenter: { status: pc.status, sampleEndpoint: `/v1/customers?size=${size}` },
      customers: ok ? customers : [],
      error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
      debug: ok ? undefined : { partnerCenter: pc.data },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: (e && e.message) || 'Customers failed',
      customers: [],
      timestamp: new Date().toISOString(),
    });
  }
};

