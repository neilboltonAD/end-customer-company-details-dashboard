import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPartnerCenterAccessTokenWithCreds, partnerCenterFetchWithToken } from '../_lib/partnerCenter';

function summarizeCustomers(payload: any): Array<{ id?: string; companyName?: string; defaultDomain?: string }> {
  const items: any[] = Array.isArray(payload?.items) ? payload.items : [];
  return items.slice(0, 10).map((c) => ({
    id: c?.id,
    companyName: c?.companyProfile?.companyName,
    defaultDomain: c?.companyProfile?.domain,
  }));
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed', timestamp: new Date().toISOString() });
    return;
  }

  try {
    const { tenantId, clientId, clientSecret } = (req.body || {}) as {
      tenantId?: string;
      clientId?: string;
      clientSecret?: string;
    };

    if (!tenantId || !clientId || !clientSecret) {
      res.status(400).json({
        ok: false,
        error: 'Missing tenantId/clientId/clientSecret',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Acquire token using provided credentials (no persistence; demo only)
    const token = await getPartnerCenterAccessTokenWithCreds({ tenantId, clientId, clientSecret });

    // Validate Partner Center access and return a small sample for a "verbose" readout.
    const pc = await partnerCenterFetchWithToken<any>(token, '/v1/customers?size=10');
    const ok = pc.status >= 200 && pc.status < 300;

    res.status(ok ? 200 : pc.status).json({
      ok,
      partnerCenter: {
        status: pc.status,
        sampleEndpoint: '/v1/customers?size=10',
      },
      customersSample: ok ? summarizeCustomers(pc.data) : [],
      error: ok ? undefined : `Partner Center request failed (HTTP ${pc.status}).`,
      debug: ok
        ? undefined
        : {
            partnerCenterStatus: pc.status,
            partnerCenterResponse: safeTruncate(pc.data),
          },
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({
      ok: false,
      error: e?.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}

