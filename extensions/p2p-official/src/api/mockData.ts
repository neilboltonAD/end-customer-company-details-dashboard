import { TransferRequest, Subscription, BillingCycle } from '../context/types';

// Mock subscriptions available for transfer
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    microsoftSubscriptionId: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
    offerId: 'CFQ7TTC0LH18',
    productName: 'Microsoft 365 Business Premium',
    skuName: 'Microsoft 365 Business Premium',
    quantity: 50,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 1100,
    status: 'Active',
    isTransferable: true,
  },
  {
    id: 'sub-2',
    microsoftSubscriptionId: 'a1b2c3d4-e5f6-7890-abcd-222222222222',
    offerId: 'CFQ7TTC0LFLX',
    productName: 'Microsoft 365 E3',
    skuName: 'Microsoft 365 E3',
    quantity: 30,
    billingCycle: 'Annual',
    termDuration: 'P1Y',
    monthlyValue: 1080,
    status: 'Active',
    isTransferable: true,
  },
  {
    id: 'sub-3',
    microsoftSubscriptionId: 'a1b2c3d4-e5f6-7890-abcd-333333333333',
    offerId: 'CFQ7TTC0LFLZ',
    productName: 'Microsoft 365 E5',
    skuName: 'Microsoft 365 E5',
    quantity: 10,
    billingCycle: 'Monthly',
    termDuration: 'P3Y',
    monthlyValue: 570,
    status: 'Active',
    isTransferable: true,
  },
  {
    id: 'sub-4',
    microsoftSubscriptionId: 'a1b2c3d4-e5f6-7890-abcd-444444444444',
    offerId: 'CFQ7TTC0RM8K',
    productName: 'Microsoft Teams Rooms Pro',
    skuName: 'Teams Rooms Pro',
    quantity: 25,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 500,
    status: 'Active',
    isTransferable: true,
  },
  {
    id: 'sub-5',
    microsoftSubscriptionId: 'a1b2c3d4-e5f6-7890-abcd-555555555555',
    offerId: 'CFQ7TTC0LHXM',
    productName: 'Microsoft Defender for Business',
    skuName: 'Defender for Business',
    quantity: 50,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 250,
    status: 'Active',
    isTransferable: true,
  },
  {
    id: 'sub-6',
    microsoftSubscriptionId: 'a1b2c3d4-e5f6-7890-abcd-666666666666',
    offerId: 'CFQ7TTC0NXVL',
    productName: 'Power BI Pro',
    skuName: 'Power BI Pro',
    quantity: 15,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 150,
    status: 'Active',
    isTransferable: true,
  },
  {
    id: 'sub-7',
    microsoftSubscriptionId: 'a1b2c3d4-e5f6-7890-abcd-777777777777',
    offerId: 'CFQ7TTC0HDB1',
    productName: 'Azure Reserved VM Instances',
    skuName: 'Standard_D4s_v3 (3 Year)',
    quantity: 2,
    billingCycle: 'Annual',
    termDuration: 'P3Y',
    monthlyValue: 890,
    status: 'Active',
    isTransferable: false,
    ineligibilityReason: 'Azure Reserved Instances cannot be transferred',
  },
];

// Generate dates relative to now
const now = new Date();
const daysFromNow = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};
const daysAgo = (days: number) => daysFromNow(-days);

// Mock partner data for realistic demos
const partners = {
  contoso: {
    id: 'partner-contoso',
    name: 'Contoso Partner Ltd',
    tenantId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    mpnId: '1234567',
  },
  fabrikam: {
    id: 'partner-fabrikam',
    name: 'Fabrikam Inc',
    tenantId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    mpnId: '2345678',
  },
  northwind: {
    id: 'partner-northwind',
    name: 'Northwind Traders',
    tenantId: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
    mpnId: '3456789',
  },
  acme: {
    id: 'partner-acme',
    name: 'Acme Corp',
    tenantId: 'd4e5f6a7-b8c9-0123-def0-456789012345',
    mpnId: '4567890',
  },
  techstart: {
    id: 'partner-techstart',
    name: 'TechStart LLC',
    tenantId: 'e5f6a7b8-c9d0-1234-ef01-567890123456',
    mpnId: '5678901',
  },
  cloudfirst: {
    id: 'partner-cloudfirst',
    name: 'CloudFirst Partners',
    tenantId: 'f6a7b8c9-d0e1-2345-f012-678901234567',
    mpnId: '6789012',
  },
  demoReseller: {
    id: 'partner-demo',
    name: 'Demo Reseller',
    tenantId: '408f194e-7263-4a16-8b97-5d4f8a9e3b7c',
    mpnId: '9876543',
  },
};

// Mock transfer requests with varied statuses
export const mockTransferRequests: TransferRequest[] = [
  // Incoming pending transfers - these need action
  {
    id: 'transfer-in-1',
    direction: 'Incoming',
    status: 'Pending',
    sourcePartner: partners.contoso,
    targetPartner: partners.demoReseller,
    customerTenantId: '8e97f6e7-f67b-445f-9e85-3b2c4f7d8a9e',
    customerName: 'demoresellercustomer3',
    lineItems: [
      {
        id: 'li-1',
        subscriptionId: 'ext-sub-001',
        offerId: 'CFQ7TTC0LH18',
        productName: 'Microsoft 365 Business Premium',
        skuName: 'Microsoft 365 Business Premium',
        quantity: 25,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 550,
        status: 'Pending',
      },
      {
        id: 'li-2',
        subscriptionId: 'ext-sub-002',
        offerId: 'CFQ7TTC0LFLX',
        productName: 'Microsoft 365 E3',
        skuName: 'Microsoft 365 E3',
        quantity: 15,
        billingCycle: 'Annual',
        termDuration: 'P1Y',
        monthlyValue: 540,
        status: 'Pending',
      },
    ],
    totalMonthlyValue: 1090,
    createdDate: daysAgo(2),
    lastModifiedDate: daysAgo(2),
    expirationDate: daysFromNow(28),
  },
  {
    id: 'transfer-in-2',
    direction: 'Incoming',
    status: 'Pending',
    sourcePartner: partners.fabrikam,
    targetPartner: partners.demoReseller,
    customerTenantId: '8e97f6e7-f67b-445f-9e85-3b2c4f7d8a9e',
    customerName: 'demoresellercustomer3',
    lineItems: [
      {
        id: 'li-3',
        subscriptionId: 'ext-sub-003',
        offerId: 'CFQ7TTC0LFLZ',
        productName: 'Microsoft 365 E5',
        skuName: 'Microsoft 365 E5',
        quantity: 10,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 600,
        status: 'Pending',
      },
    ],
    totalMonthlyValue: 600,
    createdDate: daysAgo(5),
    lastModifiedDate: daysAgo(5),
    expirationDate: daysFromNow(5), // URGENT - expires soon!
  },
  {
    id: 'transfer-in-3',
    direction: 'Incoming',
    status: 'Pending',
    sourcePartner: partners.northwind,
    targetPartner: partners.demoReseller,
    customerTenantId: '8e97f6e7-f67b-445f-9e85-3b2c4f7d8a9e',
    customerName: 'demoresellercustomer3',
    lineItems: [
      {
        id: 'li-4',
        subscriptionId: 'ext-sub-004',
        offerId: 'CFQ7TTC0RM8K',
        productName: 'Microsoft Teams Rooms Pro',
        skuName: 'Teams Rooms Pro',
        quantity: 10,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 500,
        status: 'Pending',
      },
      {
        id: 'li-5',
        subscriptionId: 'ext-sub-005',
        offerId: 'CFQ7TTC0NXVL',
        productName: 'Power BI Pro',
        skuName: 'Power BI Pro',
        quantity: 20,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 200,
        status: 'Pending',
      },
    ],
    totalMonthlyValue: 700,
    createdDate: daysAgo(0),
    lastModifiedDate: daysAgo(0),
    expirationDate: daysFromNow(30),
  },
  // Outgoing pending transfer - awaiting partner response
  {
    id: 'transfer-out-1',
    direction: 'Outgoing',
    status: 'Pending',
    sourcePartner: partners.demoReseller,
    targetPartner: partners.acme,
    customerTenantId: '8e97f6e7-f67b-445f-9e85-3b2c4f7d8a9e',
    customerName: 'demoresellercustomer3',
    lineItems: [
      {
        id: 'li-6',
        subscriptionId: 'sub-5',
        offerId: 'CFQ7TTC0LHXM',
        productName: 'Microsoft Defender for Business',
        skuName: 'Defender for Business',
        quantity: 20,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 220,
        status: 'Pending',
      },
    ],
    totalMonthlyValue: 220,
    createdDate: daysAgo(3),
    lastModifiedDate: daysAgo(3),
    expirationDate: daysFromNow(27),
  },
  // Completed transfer - success story
  {
    id: 'transfer-completed-1',
    direction: 'Incoming',
    status: 'Completed',
    sourcePartner: partners.techstart,
    targetPartner: partners.demoReseller,
    customerTenantId: '8e97f6e7-f67b-445f-9e85-3b2c4f7d8a9e',
    customerName: 'demoresellercustomer3',
    lineItems: [
      {
        id: 'li-7',
        subscriptionId: 'completed-sub-001',
        offerId: 'CFQ7TTC0LFLX',
        productName: 'Microsoft 365 E3',
        skuName: 'Microsoft 365 E3',
        quantity: 40,
        billingCycle: 'Annual',
        termDuration: 'P1Y',
        monthlyValue: 1440,
        status: 'Transferred',
      },
    ],
    totalMonthlyValue: 1440,
    createdDate: daysAgo(15),
    lastModifiedDate: daysAgo(10),
    expirationDate: daysAgo(0),
    completedDate: daysAgo(10),
  },
  {
    id: 'transfer-completed-2',
    direction: 'Outgoing',
    status: 'Completed',
    sourcePartner: partners.demoReseller,
    targetPartner: partners.fabrikam,
    customerTenantId: 'different-customer-123',
    customerName: 'Woodgrove Bank',
    lineItems: [
      {
        id: 'li-8',
        subscriptionId: 'completed-sub-002',
        offerId: 'CFQ7TTC0NXVL',
        productName: 'Power BI Pro',
        skuName: 'Power BI Pro',
        quantity: 50,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 500,
        status: 'Transferred',
      },
    ],
    totalMonthlyValue: 500,
    createdDate: daysAgo(45),
    lastModifiedDate: daysAgo(40),
    expirationDate: daysAgo(15),
    completedDate: daysAgo(40),
  },
  // Rejected transfer - shows rejection flow
  {
    id: 'transfer-rejected-1',
    direction: 'Outgoing',
    status: 'Rejected',
    sourcePartner: partners.demoReseller,
    targetPartner: partners.cloudfirst,
    customerTenantId: '8e97f6e7-f67b-445f-9e85-3b2c4f7d8a9e',
    customerName: 'demoresellercustomer3',
    lineItems: [
      {
        id: 'li-9',
        subscriptionId: 'rejected-sub-001',
        offerId: 'CFQ7TTC0NXVL',
        productName: 'Power BI Pro',
        skuName: 'Power BI Pro',
        quantity: 20,
        billingCycle: 'Monthly',
        termDuration: 'P1Y',
        monthlyValue: 440,
        status: 'Failed',
      },
    ],
    totalMonthlyValue: 440,
    createdDate: daysAgo(25),
    lastModifiedDate: daysAgo(20),
    expirationDate: daysAgo(5),
    rejectionReason: 'Customer relationship not established with target partner',
  },
];

// Utility functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getDaysUntilExpiration(expirationDate: string): number {
  const now = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatTermDuration(term: string): string {
  switch (term) {
    case 'P1M': return 'Monthly';
    case 'P1Y': return 'Annual';
    case 'P3Y': return 'Triennial';
    default: return term;
  }
}

export function getTransferSummary(transfers: TransferRequest[]) {
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  
  return {
    incomingPending: transfers.filter(t => t.direction === 'Incoming' && t.status === 'Pending').length,
    outgoingPending: transfers.filter(t => t.direction === 'Outgoing' && t.status === 'Pending').length,
    completedLast90Days: transfers.filter(t => 
      t.status === 'Completed' && 
      t.completedDate && 
      new Date(t.completedDate) >= ninetyDaysAgo
    ).length,
    failedLast90Days: transfers.filter(t => 
      (t.status === 'Failed' || t.status === 'Rejected' || t.status === 'Cancelled') &&
      new Date(t.lastModifiedDate) >= ninetyDaysAgo
    ).length,
  };
}

// Export partners for use in components
export { partners };
