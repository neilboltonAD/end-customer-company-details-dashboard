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

export type PartnerProfile = {
  mpnId: string | null;
  partnerName: string | null;
  companyName: string | null;
  country: string | null;
  rrrUrl: string | null;
};

export type PartnerCenterProfileResponse = {
  ok: boolean;
  profile: PartnerProfile | null;
  error?: string;
  timestamp: string;
};

export type CreateGdapRequestPayload = {
  customerTenantId: string;
  displayName: string;
  duration?: string; // ISO 8601 duration, e.g., "P730D" (730 days)
  roles: string[]; // Array of Azure AD role definition IDs
  autoExtendDuration?: string; // e.g., "P180D"
};

export type GdapRelationshipCreated = {
  id: string;
  displayName: string;
  status: string;
  duration: string;
  createdDateTime: string;
  endDateTime: string;
  customerApprovalUrl: string | null;
};

export type CreateGdapRequestResponse = {
  ok: boolean;
  relationship: GdapRelationshipCreated | null;
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

export type IndirectReseller = {
  id: string;
  name?: string;
  mpnId?: string;
  tenantId?: string;
  state?: string;
};

export type IndirectResellersResponse = {
  ok: boolean;
  resellers: IndirectReseller[];
  error?: string;
  timestamp: string;
};

/**
 * Get the list of indirect resellers from Partner Center.
 * Each reseller includes their tenantId which is needed for generating RRR URLs.
 */
export async function getIndirectResellers(): Promise<IndirectResellersResponse> {
  const baseUrl = window.location.hostname === 'localhost' && window.location.port === '3000'
    ? 'http://localhost:4000'
    : '';
  const res = await fetch(`${baseUrl}/api/partner-center/indirect-resellers`, { method: 'GET' });
  return await parseJsonResponse<IndirectResellersResponse>(res);
}

/**
 * Generate the Reseller Relationship Request (RRR) URL.
 * 
 * For Indirect Resellers, the URL format is:
 * https://admin.microsoft.com/Adminportal/Home#/partners/invitation/indirectReseller
 *   ?partnerId={PARTNER_MPN_ID}&indirectCSPId={RESELLER_TENANT_ID}
 * 
 * For Direct Partners (no reseller), the URL format is:
 * https://admin.microsoft.com/Adminportal/Home#/partners/invitation/reseller
 *   ?partnerId={PARTNER_MPN_ID}&msppId=0&DAP=true
 */
export function generateRrrUrl(options: {
  partnerMpnId: string;
  resellerTenantId?: string;
  isIndirectReseller?: boolean;
}): string {
  const { partnerMpnId, resellerTenantId, isIndirectReseller } = options;
  
  if (isIndirectReseller && resellerTenantId) {
    // Indirect Reseller RRR URL - includes the reseller's tenant ID
    return `https://admin.microsoft.com/Adminportal/Home#/partners/invitation/indirectReseller?partnerId=${encodeURIComponent(partnerMpnId)}&indirectCSPId=${encodeURIComponent(resellerTenantId)}`;
  }
  
  // Direct Partner RRR URL
  return `https://admin.microsoft.com/Adminportal/Home#/partners/invitation/reseller?partnerId=${encodeURIComponent(partnerMpnId)}&msppId=0&DAP=true`;
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

/**
 * Get the partner organization profile including MPN ID.
 * This is used to construct the Reseller Relationship Request (RRR) URL.
 */
export async function getPartnerCenterProfile(): Promise<PartnerCenterProfileResponse> {
  const baseUrl = window.location.hostname === 'localhost' && window.location.port === '3000'
    ? 'http://localhost:4000'
    : '';
  const res = await fetch(`${baseUrl}/api/partner-center/profile`, { method: 'GET' });
  return await parseJsonResponse<PartnerCenterProfileResponse>(res);
}

/**
 * Create a new GDAP relationship request.
 * Returns the relationship details including the customer approval URL.
 */
export async function createGdapRequest(
  payload: CreateGdapRequestPayload
): Promise<CreateGdapRequestResponse> {
  const baseUrl = window.location.hostname === 'localhost' && window.location.port === '3000'
    ? 'http://localhost:4000'
    : '';
  const res = await fetch(`${baseUrl}/api/partner-center/create-gdap-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await parseJsonResponse<CreateGdapRequestResponse>(res);
}

/**
 * Common Azure AD role IDs for GDAP relationships.
 * These are the role definition IDs used when creating GDAP requests.
 */
export const GDAP_COMMON_ROLES = {
  // Helpdesk roles
  HELPDESK_ADMINISTRATOR: '729827e3-9c14-49f7-bb1b-9608f156bbb8',
  SERVICE_SUPPORT_ADMINISTRATOR: 'f023fd81-a637-4b56-95fd-791ac0226033',
  
  // License management
  LICENSE_ADMINISTRATOR: '4d6ac14f-3453-41d0-bef9-a3e0c569773a',
  
  // Directory readers (minimal access)
  DIRECTORY_READERS: '88d8e3e3-8f55-4a1e-953a-9b9898b8876b',
  
  // User management
  USER_ADMINISTRATOR: 'fe930be7-5e62-47db-91af-98c3a49a38b1',
  
  // Security
  SECURITY_READER: '5d6b6bb7-de71-4623-b4af-96380a352509',
  SECURITY_ADMINISTRATOR: '194ae4cb-b126-40b2-bd5b-6091b380977d',
  
  // Exchange
  EXCHANGE_ADMINISTRATOR: '29232cdf-9323-42fd-ade2-1d097af3e4de',
  
  // SharePoint
  SHAREPOINT_ADMINISTRATOR: 'f28a1f50-f6e7-4571-818b-6a12f2af6b6c',
  
  // Teams
  TEAMS_ADMINISTRATOR: '69091246-20e8-4a56-aa4d-066075b2a7a8',
  
  // Intune
  INTUNE_ADMINISTRATOR: '3a2c62db-5318-420d-8d74-23affee5d9d5',
  
  // Global reader (read-only access to everything)
  GLOBAL_READER: 'f2ef992c-3afb-46b9-b7cf-a126ee74c451',
} as const;

// ============================================================================
// Azure Connector - Status and Health
// ============================================================================

export type AzureStatus = {
  ok: boolean;
  store?: {
    hasAzureToken?: boolean;
    azureConnectedAt?: string;
    azureScope?: string;
  };
  error?: string;
  timestamp: string;
};

export type AzureHealth = {
  ok: boolean;
  azure?: {
    status: string;
    httpStatus?: number;
    sampleEndpoint?: string;
  };
  subscriptionsSample?: Array<{
    subscriptionId?: string;
    displayName?: string;
    state?: string;
  }>;
  error?: string;
  hint?: string;
  timestamp: string;
};

export async function getAzureStatus(): Promise<AzureStatus> {
  const baseUrl = window.location.hostname === 'localhost' && window.location.port === '3000'
    ? 'http://localhost:4000'
    : '';
  const resp = await fetch(`${baseUrl}/api/azure/status`);
  return resp.json();
}

export async function getAzureHealth(): Promise<AzureHealth> {
  const baseUrl = window.location.hostname === 'localhost' && window.location.port === '3000'
    ? 'http://localhost:4000'
    : '';
  const resp = await fetch(`${baseUrl}/api/azure/health`);
  return resp.json();
}
