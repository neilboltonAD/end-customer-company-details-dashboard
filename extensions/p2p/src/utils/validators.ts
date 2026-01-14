// UUID/GUID format validator
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidTenantId(tenantId: string): boolean {
  return UUID_REGEX.test(tenantId.trim());
}

export function isValidMpnId(mpnId: string): boolean {
  // MPN IDs are typically 7-digit numbers
  return /^\d{5,10}$/.test(mpnId.trim());
}

export function validateCreateTransferInput(input: {
  targetPartnerTenantId: string;
  targetPartnerMpnId?: string;
  subscriptionIds: string[];
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.targetPartnerTenantId) {
    errors.push('Target Partner Tenant ID is required');
  } else if (!isValidTenantId(input.targetPartnerTenantId)) {
    errors.push('Target Partner Tenant ID must be a valid GUID');
  }

  if (input.targetPartnerMpnId && !isValidMpnId(input.targetPartnerMpnId)) {
    errors.push('MPN ID must be a valid numeric identifier');
  }

  if (!input.subscriptionIds || input.subscriptionIds.length === 0) {
    errors.push('At least one subscription must be selected');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}


