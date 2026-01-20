export type PartnerCenterHealth = {
  ok: boolean;
  partnerCenter?: {
    status: number;
    sampleEndpoint?: string;
  };
  customersSample?: Array<{ id?: string; companyName?: string; defaultDomain?: string }>;
  debug?: any;
  error?: string;
  timestamp: string;
};

export type PartnerCenterStatus = {
  ok: boolean;
  store?: any;
  error?: string;
  timestamp: string;
};

export type PartnerCenterCustomer = {
  id?: string;
  tenantId?: string;
  companyName?: string;
  defaultDomain?: string;
  contactName?: string;
  contactEmail?: string;
};

export type PartnerCenterCustomersResponse = {
  ok: boolean;
  customers: PartnerCenterCustomer[];
  error?: string;
  timestamp: string;
};

export type PartnerCenterGdapRelationship = {
  id?: string;
  displayName?: string;
  status?: string;
  createdDateTime?: string;
  endDateTime?: string;
  autoExtendDuration?: string;
  roles?: string[];
};

export type PartnerCenterGdapRelationshipsResponse = {
  ok: boolean;
  relationships: PartnerCenterGdapRelationship[];
  error?: string;
  timestamp: string;
};

export function getPartnerCenterConnectUrl() {
  // CRA dev server won't proxy full-page navigations to /api/*, so use the API server directly.
  if (window.location.hostname === 'localhost' && window.location.port === '3000') {
    return 'http://localhost:4000/api/partner-center/connect';
  }
  return '/api/partner-center/connect';
}

export function getPartnerCenterConnectGdapUrl(returnTo?: string) {
  const qs = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : '';
  if (window.location.hostname === 'localhost' && window.location.port === '3000') {
    return `http://localhost:4000/api/partner-center/connect-gdap${qs}`;
  }
  return `/api/partner-center/connect-gdap${qs}`;
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();

  // Common local-dev failure: CRA serves index.html for unknown routes, including /api/*
  if (text.trim().startsWith('<')) {
    throw new Error(
      `API route returned HTML (not JSON). If you're running locally, ensure \`npm run dev\` is running (UI on :3000 and API on :4000) so /api/* requests are proxied. HTTP ${res.status}.`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch (e) {
    throw new Error(`Failed to parse JSON response. HTTP ${res.status}. Content-Type: ${contentType || 'unknown'}.`);
  }
}

export async function getPartnerCenterHealth(): Promise<PartnerCenterHealth> {
  const res = await fetch('/api/partner-center/health', { method: 'GET' });
  return await parseJsonResponse<PartnerCenterHealth>(res);
}

export async function getPartnerCenterStatus(): Promise<PartnerCenterStatus> {
  const res = await fetch('/api/partner-center/status', { method: 'GET' });
  return await parseJsonResponse<PartnerCenterStatus>(res);
}

export async function disconnectPartnerCenter(): Promise<{ ok: boolean; error?: string; timestamp: string }> {
  const res = await fetch('/api/partner-center/disconnect', { method: 'POST' });
  return await parseJsonResponse<{ ok: boolean; error?: string; timestamp: string }>(res);
}

export async function getPartnerCenterCustomers(size = 200): Promise<PartnerCenterCustomersResponse> {
  const s = Math.max(1, Math.min(size, 500));
  const res = await fetch(`/api/partner-center/customers?size=${encodeURIComponent(String(s))}`, { method: 'GET' });
  return await parseJsonResponse<PartnerCenterCustomersResponse>(res);
}

export async function getPartnerCenterGdapRelationships(
  customerTenantId: string
): Promise<PartnerCenterGdapRelationshipsResponse> {
  const res = await fetch(
    `/api/partner-center/gdap-relationships?customerTenantId=${encodeURIComponent(customerTenantId)}`,
    { method: 'GET' }
  );
  return await parseJsonResponse<PartnerCenterGdapRelationshipsResponse>(res);
}

export type PartnerCenterTestRequest = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
};

export async function testPartnerCenterCredentials(
  req: PartnerCenterTestRequest
): Promise<PartnerCenterHealth> {
  const res = await fetch('/api/partner-center/test', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(req),
  });
  return await parseJsonResponse<PartnerCenterHealth>(res);
}

export async function testPartnerCenterSession(bearerToken: string): Promise<PartnerCenterHealth> {
  const res = await fetch('/api/partner-center/session-test', {
    method: 'GET',
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
  return await parseJsonResponse<PartnerCenterHealth>(res);
}

