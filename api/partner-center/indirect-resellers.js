const { partnerCenterFetch, partnerCenterFetchWithToken } = require('../../lib/server/partnerCenter');
const { ensureSessionId } = require('../../lib/server/cookies');
const { getAccessTokenForSession } = require('../../lib/server/delegatedAuth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', resellers: [], timestamp: new Date().toISOString() });
    return;
  }

  try {
    let token = null;
    try {
      const sessionId = ensureSessionId(req, res);
      token = await getAccessTokenForSession(sessionId, 'partnerCenter');
    } catch {
      token = null;
    }

    const pc = token
      ? await partnerCenterFetchWithToken(token, '/v1/relationships?relationship_type=IsIndirectCloudSolutionProviderOf')
      : await partnerCenterFetch('/v1/relationships?relationship_type=IsIndirectCloudSolutionProviderOf');

    const ok = pc.status >= 200 && pc.status < 300;
    const items = Array.isArray(pc.data && pc.data.items)
      ? pc.data.items
      : Array.isArray(pc.data)
        ? pc.data
        : [];

    const resellers = items.map((r) => {
      const name = (r && r.companyProfile && r.companyProfile.companyName) || (r && r.reseller && r.reseller.companyName) || r?.name || r?.companyName;
      const mpnId =
        r?.mpnId ||
        r?.mpnID ||
        (r && r.reseller && (r.reseller.mpnId || r.reseller.mpnID || r.reseller.mpn)) ||
        r?.mpn;
      const tenantId =
        r?.tenantId || r?.tenantID || (r && r.reseller && (r.reseller.tenantId || r.reseller.tenantID)) || r?.id;
      const state = r?.state || r?.relationshipState || (r && r.reseller && r.reseller.state);
      const id = r?.id || r?.resellerId || (r && r.reseller && r.reseller.id) || tenantId || mpnId || name || 'unknown';
      return {
        id: String(id),
        name: name != null ? String(name) : undefined,
        mpnId: mpnId != null ? String(mpnId) : undefined,
        tenantId: tenantId != null ? String(tenantId) : undefined,
        state: state != null ? String(state) : undefined,
      };
    });

    res.status(ok ? 200 : pc.status).json({
      ok,
      partnerCenter: {
        status: pc.status,
        sampleEndpoint: '/v1/relationships?relationship_type=IsIndirectCloudSolutionProviderOf',
      },
      resellers: ok ? resellers : [],
      error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
      debug: ok ? undefined : { partnerCenter: pc.data },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: (e && e.message) || 'Unknown error',
      resellers: [],
      timestamp: new Date().toISOString(),
    });
  }
};

