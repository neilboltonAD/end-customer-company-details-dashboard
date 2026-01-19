import { PublicClientApplication } from '@azure/msal-browser';

const STORAGE_KEY = 'partnerCenterSessionAuthV1';

export type PartnerCenterSessionAuth = {
  tenantId: string;
  clientId: string;
  accountUsername?: string;
};

export function loadPartnerCenterSessionAuth(): PartnerCenterSessionAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PartnerCenterSessionAuth>;
    if (!parsed.tenantId || !parsed.clientId) return null;
    return {
      tenantId: String(parsed.tenantId),
      clientId: String(parsed.clientId),
      accountUsername: parsed.accountUsername ? String(parsed.accountUsername) : undefined,
    };
  } catch {
    return null;
  }
}

export function savePartnerCenterSessionAuth(auth: PartnerCenterSessionAuth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  window.dispatchEvent(new Event('partner-center-session-auth-updated'));
}

export function clearPartnerCenterSessionAuth() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('partner-center-session-auth-updated'));
}

export function onPartnerCenterSessionAuthUpdated(handler: () => void) {
  window.addEventListener('partner-center-session-auth-updated', handler);
  return () => window.removeEventListener('partner-center-session-auth-updated', handler);
}

// Partner Center delegated scope (requires API permission + admin consent in your tenant)
export const PARTNER_CENTER_SCOPES = ['https://api.partnercenter.microsoft.com/user_impersonation'];

const msalInstances = new Map<string, Promise<PublicClientApplication>>();
const PENDING_KEY = 'partnerCenterMsalPendingV1';

export function savePendingMsalConfig(tenantId: string, clientId: string) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ tenantId, clientId }));
  } catch {
    // ignore
  }
}

export function loadPendingMsalConfig(): { tenantId: string; clientId: string } | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as any;
    if (!parsed?.tenantId || !parsed?.clientId) return null;
    return { tenantId: String(parsed.tenantId), clientId: String(parsed.clientId) };
  } catch {
    return null;
  }
}

export function clearPendingMsalConfig() {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
}

export function clearMsalInteractionState() {
  // MSAL uses sessionStorage for interaction-in-progress markers.
  // If a popup/redirect was interrupted, this can get stuck and block future logins.
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const k = sessionStorage.key(i);
      if (!k) continue;
      if (k.includes('interaction.status') || k.includes('interaction_in_progress')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch {
    // ignore
  }
}

export async function getMsalClient(tenantId: string, clientId: string) {
  const key = `${tenantId}::${clientId}`;
  const existing = msalInstances.get(key);
  if (existing) return await existing;

  const created = (async () => {
    const msal = new PublicClientApplication({
      auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri: window.location.origin + '/settings/vendor-integrations/microsoft',
      },
      cache: {
        cacheLocation: 'sessionStorage',
      },
    });

    // Required by newer msal-browser versions before calling login/acquireToken APIs.
    await msal.initialize();
    return msal;
  })();

  msalInstances.set(key, created);
  return await created;
}

