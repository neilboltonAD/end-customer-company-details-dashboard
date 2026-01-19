import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSessionId } from '../../lib/server/cookies';
import { getAccessTokenForSession } from '../../lib/server/delegatedAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', relationships: [], timestamp: new Date().toISOString() });
    return;
  }

  try {
    const customerTenantId = (req.query.customerTenantId || '').toString();
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
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    const ok = resp.status >= 200 && resp.status < 300;
    const value = Array.isArray(data?.value) ? data.value : [];
    const relationships = value.map((r: any) => ({
      id: r?.id,
      displayName: r?.displayName || r?.id,
      status: r?.status,
      createdDateTime: r?.createdDateTime,
      endDateTime: r?.endDateTime,
      autoExtendDuration: r?.autoExtendDuration,
      roles: Array.isArray(r?.accessDetails?.unifiedRoles)
        ? r.accessDetails.unifiedRoles.map((ur: any) => ur?.roleDefinitionId || ur?.displayName || ur?.id).filter(Boolean)
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
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'GDAP relationships failed', relationships: [], timestamp: new Date().toISOString() });
  }
}

