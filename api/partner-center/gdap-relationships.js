const { ensureSessionId } = require('../../lib/server/cookies');
const { getAccessTokenForSession } = require('../../lib/server/delegatedAuth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', relationships: [], timestamp: new Date().toISOString() });
    return;
  }

  try {
    const customerTenantId = String((req.query && req.query.customerTenantId) || '');
    if (!customerTenantId) {
      res.status(400).json({ ok: false, error: 'Missing customerTenantId', relationships: [], timestamp: new Date().toISOString() });
      return;
    }

    const sessionId = ensureSessionId(req, res);
    const token = await getAccessTokenForSession(sessionId, 'gdap');

    const safeTenantId = customerTenantId.replace(/'/g, "''");
    const url =
      'https://graph.microsoft.com/v1.0/tenantRelationships/delegatedAdminRelationships' +
      `?$filter=customer/tenantId eq '${safeTenantId}'`;

    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
    const text = await resp.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    const ok = resp.status >= 200 && resp.status < 300;
    const value = Array.isArray(data && data.value) ? data.value : [];
    const relationships = value.map((r) => ({
      id: r && r.id,
      displayName: (r && (r.displayName || r.id)) || undefined,
      status: r && r.status,
      createdDateTime: r && r.createdDateTime,
      endDateTime: r && r.endDateTime,
      autoExtendDuration: r && r.autoExtendDuration,
      roles: Array.isArray(r && r.accessDetails && r.accessDetails.unifiedRoles)
        ? r.accessDetails.unifiedRoles
            .map((ur) => (ur && (ur.roleDefinitionId || ur.displayName || ur.id)) || null)
            .filter(Boolean)
        : [],
    }));

    res.status(ok ? 200 : resp.status).json({
      ok,
      graph: { status: resp.status, sampleEndpoint: 'tenantRelationships/delegatedAdminRelationships' },
      relationships: ok ? relationships : [],
      error: ok ? undefined : `Graph request failed (HTTP ${resp.status}).`,
      debug: ok ? undefined : { graph: data },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: (e && e.message) || 'GDAP relationships failed',
      relationships: [],
      timestamp: new Date().toISOString(),
    });
  }
};

