const { partnerCenterFetch, partnerCenterFetchWithToken } = require('../../lib/server/partnerCenter');
const { ensureSessionId } = require('../../lib/server/cookies');
const { getAccessTokenForSession } = require('../../lib/server/delegatedAuth');

/**
 * GET /api/partner-center/profile
 * 
 * Returns the partner organization profile including MPN ID.
 * This is used to construct Reseller Relationship Request (RRR) links.
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ 
      ok: false, 
      error: 'Method not allowed', 
      profile: null,
      timestamp: new Date().toISOString() 
    });
    return;
  }

  try {
    // Try to get a delegated access token first (App+User with MFA)
    let token = null;
    try {
      const sessionId = ensureSessionId(req, res);
      token = await getAccessTokenForSession(sessionId, 'partnerCenter');
    } catch {
      token = null;
    }

    // Fetch the partner's MPN profile
    const mpnProfile = token
      ? await partnerCenterFetchWithToken(token, '/v1/profiles/mpn')
      : await partnerCenterFetch('/v1/profiles/mpn');

    // Also fetch the legal business profile for company name
    const legalProfile = token
      ? await partnerCenterFetchWithToken(token, '/v1/profiles/legalbusiness')
      : await partnerCenterFetch('/v1/profiles/legalbusiness');

    const mpnOk = mpnProfile.status >= 200 && mpnProfile.status < 300;
    const legalOk = legalProfile.status >= 200 && legalProfile.status < 300;

    if (!mpnOk) {
      res.status(mpnProfile.status).json({
        ok: false,
        error: `Failed to fetch MPN profile (HTTP ${mpnProfile.status})`,
        profile: null,
        debug: { mpnProfile: mpnProfile.data },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const mpnData = mpnProfile.data || {};
    const legalData = legalOk ? (legalProfile.data || {}) : {};

    // Extract the MPN ID - it can be in different fields depending on the API version
    const mpnId = mpnData.mpnId || mpnData.partnerMpnId || mpnData.id;
    const partnerName = legalData.companyName || mpnData.partnerName || mpnData.organizationName;

    // Construct the RRR (Reseller Relationship Request) URL
    // For indirect resellers, DAP=true allows delegated admin privileges
    const rrrUrl = mpnId
      ? `https://admin.microsoft.com/Adminportal/Home#/partners/invitation/reseller?partnerId=${encodeURIComponent(mpnId)}&msppId=0&DAP=true`
      : null;

    res.status(200).json({
      ok: true,
      profile: {
        mpnId: mpnId || null,
        partnerName: partnerName || null,
        companyName: legalData.companyName || null,
        country: legalData.address?.country || mpnData.country || null,
        rrrUrl,
      },
      partnerCenter: {
        mpnStatus: mpnProfile.status,
        legalStatus: legalProfile.status,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: (e && e.message) || 'Failed to fetch partner profile',
      profile: null,
      timestamp: new Date().toISOString(),
    });
  }
};
