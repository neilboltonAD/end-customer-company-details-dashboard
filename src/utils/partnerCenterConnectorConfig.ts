export type PartnerCenterConnectorConfig = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
};

const STORAGE_KEY = 'partnerCenterConnectorConfigV1';
const UPDATED_EVENT = 'partner-center-connector-config-updated';

export function loadPartnerCenterConnectorConfig(): PartnerCenterConnectorConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PartnerCenterConnectorConfig>;
    if (!parsed.tenantId || !parsed.clientId || !parsed.clientSecret) return null;
    return {
      tenantId: String(parsed.tenantId),
      clientId: String(parsed.clientId),
      clientSecret: String(parsed.clientSecret),
    };
  } catch {
    return null;
  }
}

export function savePartnerCenterConnectorConfig(config: PartnerCenterConnectorConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event(UPDATED_EVENT));
}

export function clearPartnerCenterConnectorConfig() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(UPDATED_EVENT));
}

export function onPartnerCenterConnectorConfigUpdated(handler: () => void) {
  window.addEventListener(UPDATED_EVENT, handler);
  return () => window.removeEventListener(UPDATED_EVENT, handler);
}

