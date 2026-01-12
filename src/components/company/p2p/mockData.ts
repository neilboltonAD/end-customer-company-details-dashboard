// P2P Transfer Mock Data for Demo

import { 
  TransferRequest, 
  EligibleSubscription, 
  TransferAuditLogEntry,
  TransferSummary 
} from './types';

// Current partner info (us)
export const currentPartner = {
  tenantId: '408f194e-dc4a-4a2e-ac65-d1d6b0c11a8a',
  name: 'AppDirect Demo Reseller',
  mpnId: '7654321',
};

// Customer tenant info
export const customerTenant = {
  tenantId: '8e97f6e7-f67b-445f-9e85-393c7daff321',
  name: 'demoresellercustomer3',
};

// Mock eligible subscriptions for transfer
export const mockEligibleSubscriptions: EligibleSubscription[] = [
  {
    id: 'sub-001',
    subscriptionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    productName: 'Microsoft 365 Business Premium',
    sku: 'O365_BUSINESS_PREMIUM',
    quantity: 50,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 1100,
    renewalDate: '2026-12-31',
    transferEligible: true,
  },
  {
    id: 'sub-002',
    subscriptionId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    productName: 'Microsoft 365 E3',
    sku: 'SPE_E3',
    quantity: 30,
    billingCycle: 'Annual',
    termDuration: 'P1Y',
    monthlyValue: 1080,
    renewalDate: '2026-06-15',
    transferEligible: true,
  },
  {
    id: 'sub-003',
    subscriptionId: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
    productName: 'Microsoft 365 E5',
    sku: 'SPE_E5',
    quantity: 10,
    billingCycle: 'Monthly',
    termDuration: 'P3Y',
    monthlyValue: 570,
    renewalDate: '2028-01-15',
    transferEligible: true,
  },
  {
    id: 'sub-004',
    subscriptionId: 'd4e5f6a7-b8c9-0123-defa-456789012345',
    productName: 'Azure Plan',
    sku: 'AZURE_PLAN',
    quantity: 1,
    billingCycle: 'Monthly',
    termDuration: 'P1M',
    monthlyValue: 2500,
    renewalDate: 'N/A',
    transferEligible: false,
    eligibilityReason: 'Azure plans require a separate transfer process',
  },
  {
    id: 'sub-005',
    subscriptionId: 'e5f6a7b8-c9d0-1234-efab-567890123456',
    productName: 'Power BI Pro',
    sku: 'POWER_BI_PRO',
    quantity: 25,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 250,
    renewalDate: '2026-09-30',
    transferEligible: true,
  },
];

// Mock transfer requests
export const mockTransferRequests: TransferRequest[] = [
  // Incoming pending transfers
  {
    id: 'TR-2026-0112-001',
    status: 'Pending',
    direction: 'Incoming',
    sourcePartner: {
      tenantId: 'f1e2d3c4-b5a6-7890-fedc-ba9876543210',
      name: 'Contoso Partner Ltd',
      mpnId: '1234567',
    },
    targetPartner: currentPartner,
    customerTenantId: customerTenant.tenantId,
    customerName: customerTenant.name,
    lineItems: [
      {
        id: 'li-001',
        subscriptionId: 'incoming-sub-001',
        offerId: 'CFQ7TTC0LH18:0001',
        productName: 'Microsoft 365 Business Premium',
        sku: 'O365_BUSINESS_PREMIUM',
        quantity: 25,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 550,
        status: 'Pending',
        transferEligible: true,
      },
      {
        id: 'li-002',
        subscriptionId: 'incoming-sub-002',
        offerId: 'CFQ7TTC0LCHC:0001',
        productName: 'Microsoft 365 E3',
        sku: 'SPE_E3',
        quantity: 15,
        billingCycle: 'Annual',
        termDuration: 'P1Y',
        monthlyValue: 540,
        status: 'Pending',
        transferEligible: true,
      },
    ],
    totalMonthlyValue: 1090,
    createdDate: '2026-01-10T10:30:00Z',
    lastModifiedDate: '2026-01-10T10:30:00Z',
    expirationDate: '2026-02-09T10:30:00Z',
  },
  {
    id: 'TR-2026-0112-002',
    status: 'Pending',
    direction: 'Incoming',
    sourcePartner: {
      tenantId: 'a9b8c7d6-e5f4-3210-abcd-123456789abc',
      name: 'Fabrikam Inc',
      mpnId: '9876543',
    },
    targetPartner: currentPartner,
    customerTenantId: customerTenant.tenantId,
    customerName: customerTenant.name,
    lineItems: [
      {
        id: 'li-003',
        subscriptionId: 'incoming-sub-003',
        offerId: 'CFQ7TTC0LH18:0002',
        productName: 'Microsoft 365 Business Basic',
        sku: 'O365_BUSINESS_ESSENTIALS',
        quantity: 100,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 600,
        status: 'Pending',
        transferEligible: true,
      },
    ],
    totalMonthlyValue: 600,
    createdDate: '2026-01-11T14:15:00Z',
    lastModifiedDate: '2026-01-11T14:15:00Z',
    expirationDate: '2026-02-10T14:15:00Z',
  },
  {
    id: 'TR-2026-0112-003',
    status: 'Pending',
    direction: 'Incoming',
    sourcePartner: {
      tenantId: 'b1c2d3e4-f5a6-7890-bcde-234567890bcd',
      name: 'Northwind Traders',
      mpnId: '5555555',
    },
    targetPartner: currentPartner,
    customerTenantId: customerTenant.tenantId,
    customerName: customerTenant.name,
    lineItems: [
      {
        id: 'li-004',
        subscriptionId: 'incoming-sub-004',
        offerId: 'CFQ7TTC0LH2Z:0001',
        productName: 'Power BI Pro',
        sku: 'POWER_BI_PRO',
        quantity: 50,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 500,
        status: 'Pending',
        transferEligible: true,
      },
    ],
    totalMonthlyValue: 500,
    createdDate: '2026-01-12T09:00:00Z',
    lastModifiedDate: '2026-01-12T09:00:00Z',
    expirationDate: '2026-02-11T09:00:00Z',
  },
  // Outgoing pending transfer
  {
    id: 'TR-2026-0110-001',
    status: 'Pending',
    direction: 'Outgoing',
    sourcePartner: currentPartner,
    targetPartner: {
      tenantId: 'c2d3e4f5-a6b7-8901-cdef-345678901cde',
      name: 'Acme Corp',
      mpnId: '1112223',
    },
    customerTenantId: customerTenant.tenantId,
    customerName: customerTenant.name,
    lineItems: [
      {
        id: 'li-005',
        subscriptionId: 'outgoing-sub-001',
        offerId: 'CFQ7TTC0LH18:0001',
        productName: 'Microsoft 365 Business Premium',
        sku: 'O365_BUSINESS_PREMIUM',
        quantity: 10,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 220,
        status: 'Pending',
        transferEligible: true,
      },
      {
        id: 'li-006',
        subscriptionId: 'outgoing-sub-002',
        offerId: 'CFQ7TTC0LH2Z:0001',
        productName: 'Power BI Pro',
        sku: 'POWER_BI_PRO',
        quantity: 5,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 50,
        status: 'Pending',
        transferEligible: true,
      },
    ],
    totalMonthlyValue: 270,
    createdDate: '2026-01-08T16:45:00Z',
    lastModifiedDate: '2026-01-08T16:45:00Z',
    expirationDate: '2026-02-07T16:45:00Z',
  },
  // Completed transfers (history)
  {
    id: 'TR-2026-0105-001',
    status: 'Completed',
    direction: 'Incoming',
    sourcePartner: {
      tenantId: 'd3e4f5a6-b7c8-9012-defa-456789012def',
      name: 'TechStart LLC',
      mpnId: '3334445',
    },
    targetPartner: currentPartner,
    customerTenantId: customerTenant.tenantId,
    customerName: customerTenant.name,
    lineItems: [
      {
        id: 'li-007',
        subscriptionId: 'completed-sub-001',
        offerId: 'CFQ7TTC0LCHC:0001',
        productName: 'Microsoft 365 E3',
        sku: 'SPE_E3',
        quantity: 40,
        billingCycle: 'Annual',
        termDuration: 'P1Y',
        monthlyValue: 1440,
        status: 'Completed',
        transferEligible: true,
      },
    ],
    totalMonthlyValue: 1440,
    createdDate: '2026-01-03T10:00:00Z',
    lastModifiedDate: '2026-01-05T14:30:00Z',
    expirationDate: '2026-02-02T10:00:00Z',
    completedDate: '2026-01-05T14:30:00Z',
  },
  {
    id: 'TR-2025-1228-001',
    status: 'Rejected',
    direction: 'Outgoing',
    sourcePartner: currentPartner,
    targetPartner: {
      tenantId: 'e4f5a6b7-c8d9-0123-efab-567890123efa',
      name: 'CloudFirst Partners',
      mpnId: '6667778',
    },
    customerTenantId: customerTenant.tenantId,
    customerName: customerTenant.name,
    lineItems: [
      {
        id: 'li-008',
        subscriptionId: 'rejected-sub-001',
        offerId: 'CFQ7TTC0LH18:0001',
        productName: 'Microsoft 365 Business Premium',
        sku: 'O365_BUSINESS_PREMIUM',
        quantity: 20,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 440,
        status: 'Failed',
        transferEligible: true,
      },
    ],
    totalMonthlyValue: 440,
    createdDate: '2025-12-26T11:00:00Z',
    lastModifiedDate: '2025-12-28T09:15:00Z',
    expirationDate: '2026-01-25T11:00:00Z',
    rejectionReason: 'Customer relationship not established',
  },
  {
    id: 'TR-2025-1215-001',
    status: 'Completed',
    direction: 'Incoming',
    sourcePartner: {
      tenantId: 'f5a6b7c8-d9e0-1234-fabc-678901234fab',
      name: 'DataPro Inc',
      mpnId: '8889990',
    },
    targetPartner: currentPartner,
    customerTenantId: customerTenant.tenantId,
    customerName: customerTenant.name,
    lineItems: [
      {
        id: 'li-009',
        subscriptionId: 'completed-sub-002',
        offerId: 'CFQ7TTC0LH2Z:0001',
        productName: 'Power BI Pro',
        sku: 'POWER_BI_PRO',
        quantity: 75,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 750,
        status: 'Completed',
        transferEligible: true,
      },
      {
        id: 'li-010',
        subscriptionId: 'completed-sub-003',
        offerId: 'CFQ7TTC0LH18:0001',
        productName: 'Microsoft 365 Business Premium',
        sku: 'O365_BUSINESS_PREMIUM',
        quantity: 35,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 770,
        status: 'Completed',
        transferEligible: true,
      },
    ],
    totalMonthlyValue: 1520,
    createdDate: '2025-12-12T08:30:00Z',
    lastModifiedDate: '2025-12-15T16:00:00Z',
    expirationDate: '2026-01-11T08:30:00Z',
    completedDate: '2025-12-15T16:00:00Z',
  },
];

// Mock audit log entries
export const mockAuditLog: TransferAuditLogEntry[] = [
  {
    id: 'log-001',
    transferId: 'TR-2026-0105-001',
    timestamp: '2026-01-05T14:30:00Z',
    action: 'Transfer completed successfully',
    user: 'system',
  },
  {
    id: 'log-002',
    transferId: 'TR-2026-0105-001',
    timestamp: '2026-01-05T14:25:00Z',
    action: 'Microsoft processing transfer',
    user: 'system',
  },
  {
    id: 'log-003',
    transferId: 'TR-2026-0105-001',
    timestamp: '2026-01-05T14:20:00Z',
    action: 'Transfer accepted',
    user: 'neil.bolton@appdirect.com',
  },
  {
    id: 'log-004',
    transferId: 'TR-2026-0105-001',
    timestamp: '2026-01-03T10:00:00Z',
    action: 'Transfer request received from TechStart LLC',
    user: 'system',
  },
];

// Helper function to calculate transfer summary
export const getTransferSummary = (transfers: TransferRequest[]): TransferSummary => {
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  return {
    incomingPending: transfers.filter(
      t => t.direction === 'Incoming' && t.status === 'Pending'
    ).length,
    outgoingPending: transfers.filter(
      t => t.direction === 'Outgoing' && t.status === 'Pending'
    ).length,
    completedLast90Days: transfers.filter(
      t => t.status === 'Completed' && new Date(t.completedDate || t.lastModifiedDate) >= ninetyDaysAgo
    ).length,
    failedLast90Days: transfers.filter(
      t => (t.status === 'Failed' || t.status === 'Rejected') && 
           new Date(t.lastModifiedDate) >= ninetyDaysAgo
    ).length,
  };
};

// Format helpers
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const getDaysUntilExpiration = (expirationDate: string): number => {
  const now = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatTermDuration = (term: string): string => {
  switch (term) {
    case 'P1M': return 'Monthly';
    case 'P1Y': return 'Annual';
    case 'P3Y': return 'Triennial';
    default: return term;
  }
};

