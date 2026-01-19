import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSessionId } from './_lib/cookies';
import { buildAuthorizeUrl, getAccessTokenForSession, handleOAuthCallback, clearStoredTokens } from './_lib/delegatedAuth';
import { partnerCenterFetch, partnerCenterFetchWithToken } from './_lib/partnerCenter';

function json(res: VercelResponse, status: number, payload: any) {
  res.status(status).json(payload);
}

function opFrom(req: VercelRequest): string {
  const q = (req.query.op || '').toString();
  if (q) return q;
  // If called directly as /api/partner-center/<op> without rewrite, infer from path.
  const base = `http://${req.headers.host || 'localhost'}`;
  const u = new URL(req.url || '/', base);
  const m = u.pathname.match(/^\/api\/partner-center\/(.+)$/);
  return m?.[1] || '';
}

function safeTruncate(value: any, maxLen = 3000) {
  try {
    const s = typeof value === 'string' ? value : JSON.stringify(value);
    if (s.length <= maxLen) return s;
    return `${s.slice(0, maxLen)}\n... (truncated)`;
  } catch {
    return String(value);
  }
}

function summarizeCustomers(payload: any): Array<{ id?: string; companyName?: string; defaultDomain?: string }> {
  const items: any[] = Array.isArray(payload?.items) ? payload.items : [];
  return items.slice(0, 10).map((c) => ({
    id: c?.id,
    companyName: c?.companyProfile?.companyName,
    defaultDomain: c?.companyProfile?.domain,
  }));
}

async function getDelegatedTokenIfConnected(req: VercelRequest, res: VercelResponse): Promise<string | null> {
  try {
    const sessionId = ensureSessionId(req, res);
    return await getAccessTokenForSession(sessionId, 'partnerCenter');
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const op = opFrom(req);
  const timestamp = new Date().toISOString();

  try {
    // CONNECT (Partner Center)
    if (op === 'connect') {
      if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'Method not allowed', timestamp });
      const { authorizeUrl } = buildAuthorizeUrl(req, res, { kind: 'partnerCenter' });
      res.status(302).setHeader('Location', authorizeUrl);
      res.end();
      return;
    }

    // CONNECT (GDAP / Graph)
    if (op === 'connect-gdap') {
      if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'Method not allowed', timestamp });
      const { authorizeUrl } = buildAuthorizeUrl(req, res, { kind: 'gdap' });
      res.status(302).setHeader('Location', authorizeUrl);
      res.end();
      return;
    }

    // CALLBACK (both flows)
    if (op === 'callback') {
      if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'Method not allowed', timestamp });
      await handleOAuthCallback(req, res);
      return;
    }

    // STATUS
    if (op === 'status') {
      if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'Method not allowed', timestamp });
      const sessionId = ensureSessionId(req, res);
      // We can’t inspect KV here without importing kv; easiest is to attempt token refresh cheaply?
      // Instead, just report presence by attempting to refresh silently in the background via our helper.
      // If it fails, we treat as disconnected.
      let hasPartnerCenter = false;
      let hasGdap = false;
      try {
        await getAccessTokenForSession(sessionId, 'partnerCenter');
        hasPartnerCenter = true;
      } catch {
        hasPartnerCenter = false;
      }
      try {
        await getAccessTokenForSession(sessionId, 'gdap');
        hasGdap = true;
      } catch {
        hasGdap = false;
      }
      return json(res, 200, { ok: hasPartnerCenter, store: { hasPartnerCenter, hasGdap }, timestamp });
    }

    // DISCONNECT
    if (op === 'disconnect') {
      if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed', timestamp });
      const sessionId = ensureSessionId(req, res);
      await clearStoredTokens(sessionId);
      return json(res, 200, { ok: true, timestamp });
    }

    // HEALTH
    if (op === 'health') {
      if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'Method not allowed', timestamp });
      const delegated = await getDelegatedTokenIfConnected(req, res);
      const pc = delegated
        ? await partnerCenterFetchWithToken<any>(delegated, '/v1/customers?size=1')
        : await partnerCenterFetch<any>('/v1/customers?size=1');
      const ok = pc.status >= 200 && pc.status < 300;
      return json(res, ok ? 200 : pc.status, {
        ok,
        partnerCenter: { status: pc.status, sampleEndpoint: '/v1/customers?size=1' },
        timestamp,
      });
    }

    // CUSTOMERS
    if (op === 'customers') {
      if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'Method not allowed', customers: [], timestamp });
      const size = Math.min(Number(req.query.size || '50'), 500);
      const sessionId = ensureSessionId(req, res);
      const token = await getAccessTokenForSession(sessionId, 'partnerCenter');
      const pc = await partnerCenterFetchWithToken<any>(token, `/v1/customers?size=${size}`);
      const ok = pc.status >= 200 && pc.status < 300;
      const items = Array.isArray(pc.data?.items) ? pc.data.items : [];
      const customers = items.map((c: any) => ({
        id: c?.id,
        companyName: c?.companyProfile?.companyName,
        defaultDomain: c?.companyProfile?.domain,
        tenantId: c?.companyProfile?.tenantId || c?.id,
      }));
      return json(res, ok ? 200 : pc.status, {
        ok,
        partnerCenter: { status: pc.status, sampleEndpoint: `/v1/customers?size=${size}` },
        customers: ok ? customers : [],
        error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
        debug: ok ? undefined : { partnerCenter: pc.data },
        timestamp,
      });
    }

    // INDIRECT RESELLERS
    if (op === 'indirect-resellers') {
      if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'Method not allowed', resellers: [], timestamp });
      const delegated = await getDelegatedTokenIfConnected(req, res);
      const pc = delegated
        ? await partnerCenterFetchWithToken<any>(delegated, '/v1/relationships?relationship_type=IsIndirectCloudSolutionProviderOf')
        : await partnerCenterFetch<any>('/v1/relationships?relationship_type=IsIndirectCloudSolutionProviderOf');
      const ok = pc.status >= 200 && pc.status < 300;
      const items = Array.isArray((pc.data as any)?.items) ? (pc.data as any).items : Array.isArray(pc.data) ? pc.data : [];
      const resellers = items.map((r: any) => {
        const name = r?.companyProfile?.companyName || r?.reseller?.companyName || r?.name || r?.companyName;
        const mpnId = r?.mpnId || r?.mpnID || r?.reseller?.mpnId || r?.reseller?.mpnID || r?.reseller?.mpn || r?.mpn;
        const tenantId = r?.tenantId || r?.tenantID || r?.reseller?.tenantId || r?.reseller?.tenantID || r?.id;
        const state = r?.state || r?.relationshipState || r?.reseller?.state;
        const id = r?.id || r?.resellerId || r?.reseller?.id || tenantId || mpnId || name || 'unknown';
        return {
          id: String(id),
          name: name ? String(name) : undefined,
          mpnId: mpnId != null ? String(mpnId) : undefined,
          tenantId: tenantId != null ? String(tenantId) : undefined,
          state: state ? String(state) : undefined,
        };
      });
      return json(res, ok ? 200 : pc.status, {
        ok,
        partnerCenter: { status: pc.status, sampleEndpoint: '/v1/relationships?relationship_type=IsIndirectCloudSolutionProviderOf' },
        resellers: ok ? resellers : [],
        error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
        debug: ok ? undefined : { partnerCenter: pc.data },
        timestamp,
      });
    }

    // GDAP RELATIONSHIPS (Graph)
    if (op === 'gdap-relationships') {
      if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'Method not allowed', relationships: [], timestamp });
      const customerTenantId = (req.query.customerTenantId || '').toString();
      if (!customerTenantId) return json(res, 400, { ok: false, error: 'Missing customerTenantId', relationships: [], timestamp });
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
      return json(res, ok ? 200 : resp.status, {
        ok,
        graph: { status: resp.status, sampleEndpoint: 'tenantRelationships/delegatedAdminRelationships' },
        relationships: ok ? relationships : [],
        error: ok ? undefined : `Graph request failed (HTTP ${resp.status}).`,
        debug: ok ? undefined : { graph: safeTruncate(data) },
        timestamp,
      });
    }

    // TEST (demo credential check)
    if (op === 'test') {
      if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed', timestamp });
      // Keep the existing behavior from api/partner-center/test.ts (client credentials provided in body)
      const { tenantId, clientId, clientSecret } = (req.body || {}) as any;
      if (!tenantId || !clientId || !clientSecret) {
        return json(res, 400, { ok: false, error: 'Missing tenantId/clientId/clientSecret', timestamp });
      }
      // Reuse the existing library helper (client credentials flow)
      // Dynamically import to avoid duplicating logic in this file.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const lib = require('./_lib/partnerCenter') as typeof import('./_lib/partnerCenter');
      const token = await lib.getPartnerCenterAccessTokenWithCreds({ tenantId, clientId, clientSecret });
      const pc = await lib.partnerCenterFetchWithToken<any>(token, '/v1/customers?size=10');
      const ok = pc.status >= 200 && pc.status < 300;
      return json(res, ok ? 200 : pc.status, {
        ok,
        partnerCenter: { status: pc.status, sampleEndpoint: '/v1/customers?size=10' },
        customersSample: ok ? summarizeCustomers(pc.data) : [],
        error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
        debug: ok ? undefined : { partnerCenterStatus: pc.status, partnerCenterResponse: safeTruncate(pc.data) },
        timestamp,
      });
    }

    // SESSION-TEST (accept bearer token header)
    if (op === 'session-test') {
      if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'Method not allowed', timestamp });
      const header = (req.headers.authorization || '').toString();
      const m = header.match(/^Bearer\s+(.+)$/i);
      const token = m?.[1] || null;
      if (!token) return json(res, 401, { ok: false, error: 'Missing Authorization: Bearer <token>', timestamp });
      const pc = await partnerCenterFetchWithToken<any>(token, '/v1/customers?size=10');
      const ok = pc.status >= 200 && pc.status < 300;
      return json(res, ok ? 200 : pc.status, {
        ok,
        partnerCenter: { status: pc.status, sampleEndpoint: '/v1/customers?size=10' },
        customersSample: ok ? summarizeCustomers(pc.data) : [],
        error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
        debug: ok ? undefined : { partnerCenterStatus: pc.status, partnerCenterResponse: pc.data },
        timestamp,
      });
    }

    return json(res, 404, { ok: false, error: `Unknown op: ${op || '(none)'}`, timestamp });
  } catch (e: any) {
    return json(res, 500, { ok: false, error: e?.message || 'Unknown error', timestamp });
  }
}

