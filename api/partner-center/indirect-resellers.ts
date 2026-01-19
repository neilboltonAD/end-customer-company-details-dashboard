import type { VercelRequest, VercelResponse } from '@vercel/node';
import { partnerCenterFetch, partnerCenterFetchWithToken } from '../_lib/partnerCenter';
import { ensureSessionId } from '../_lib/cookies';
import { getAccessTokenForSession } from '../_lib/delegatedAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed', resellers: [], timestamp: new Date().toISOString() });
    return;
  }

  try {
    // Docs: GET /v1/relationships?relationship_type=IsIndirectCloudSolutionProviderOf
    let token: string | null = null;
    try {
      const sessionId = ensureSessionId(req, res);
      token = await getAccessTokenForSession(sessionId, 'partnerCenter');
    } catch {
      token = null;
    }

    const pc = token
      ? await partnerCenterFetchWithToken<any>(token, '/v1/relationships?relationship_type=IsIndirectCloudSolutionProviderOf')
      : await partnerCenterFetch<any>('/v1/relationships?relationship_type=IsIndirectCloudSolutionProviderOf');
    const ok = pc.status >= 200 && pc.status < 300;
    const items = Array.isArray((pc.data as any)?.items) ? (pc.data as any).items : Array.isArray(pc.data) ? pc.data : [];

    const resellers = items.map((r: any) => {
      const name = r?.companyProfile?.companyName || r?.reseller?.companyName || r?.name || r?.companyName;
      const mpnId = r?.mpnId || r?.mpnID || r?.reseller?.mpnId || r?.reseller?.mpnID || r?.reseller?.mpn || r?.mpn;
      // Partner Center "relationships" responses often use `id` as the reseller tenant identifier (GUID).
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

    res.status(ok ? 200 : pc.status).json({
      ok,
      partnerCenter: { status: pc.status, sampleEndpoint: '/v1/relationships?relationship_type=IsIndirectCloudSolutionProviderOf' },
      resellers: ok ? resellers : [],
      error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
      debug: ok ? undefined : { partnerCenter: pc.data },
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({
      ok: false,
      error: e?.message || 'Unknown error',
      resellers: [],
      timestamp: new Date().toISOString(),
    });
  }
}

