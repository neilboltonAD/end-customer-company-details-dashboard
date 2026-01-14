import { Subscription } from '../context/types';

export type SearchableSubscription = Subscription & { 
  customerName: string; 
  customerId: string; 
};

// Centralized mock data for all subscription searches
export const mockSearchableSubscriptions: SearchableSubscription[] = [
  // demoresellercustomer3's subscriptions
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
    customerName: 'demoresellercustomer3',
    customerId: 'cust-001',
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
    customerName: 'demoresellercustomer3',
    customerId: 'cust-001',
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
    customerName: 'demoresellercustomer3',
    customerId: 'cust-001',
  },
  // Woodgrove Bank subscriptions
  {
    id: 'sub-wg-1',
    microsoftSubscriptionId: 'b2c3d4e5-f6a7-8901-bcde-111111111111',
    offerId: 'CFQ7TTC0LFLX',
    productName: 'Microsoft 365 E3',
    skuName: 'Microsoft 365 E3',
    quantity: 150,
    billingCycle: 'Annual',
    termDuration: 'P1Y',
    monthlyValue: 5400,
    status: 'Active',
    isTransferable: true,
    customerName: 'Woodgrove Bank',
    customerId: 'cust-002',
  },
  {
    id: 'sub-wg-2',
    microsoftSubscriptionId: 'b2c3d4e5-f6a7-8901-bcde-222222222222',
    offerId: 'CFQ7TTC0NXVL',
    productName: 'Power BI Pro',
    skuName: 'Power BI Pro',
    quantity: 75,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 750,
    status: 'Active',
    isTransferable: true,
    customerName: 'Woodgrove Bank',
    customerId: 'cust-002',
  },
  {
    id: 'sub-wg-3',
    microsoftSubscriptionId: 'b2c3d4e5-f6a7-8901-bcde-333333333333',
    offerId: 'CFQ7TTC0HDB1',
    productName: 'Azure Reserved VM Instances',
    skuName: 'Standard_D4s_v3 (3 Year)',
    quantity: 5,
    billingCycle: 'Annual',
    termDuration: 'P3Y',
    monthlyValue: 2225,
    status: 'Active',
    isTransferable: false,
    ineligibilityReason: 'Azure Reserved Instances cannot be transferred',
    customerName: 'Woodgrove Bank',
    customerId: 'cust-002',
  },
  // Contoso Ltd subscriptions
  {
    id: 'sub-co-1',
    microsoftSubscriptionId: 'c3d4e5f6-a7b8-9012-cdef-111111111111',
    offerId: 'CFQ7TTC0LH18',
    productName: 'Microsoft 365 Business Premium',
    skuName: 'Microsoft 365 Business Premium',
    quantity: 200,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 4400,
    status: 'Active',
    isTransferable: true,
    customerName: 'Contoso Ltd',
    customerId: 'cust-003',
  },
  {
    id: 'sub-co-2',
    microsoftSubscriptionId: 'c3d4e5f6-a7b8-9012-cdef-222222222222',
    offerId: 'CFQ7TTC0RM8K',
    productName: 'Microsoft Teams Rooms Pro',
    skuName: 'Teams Rooms Pro',
    quantity: 50,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 1000,
    status: 'Active',
    isTransferable: true,
    customerName: 'Contoso Ltd',
    customerId: 'cust-003',
  },
  // Fabrikam Inc subscriptions
  {
    id: 'sub-fab-1',
    microsoftSubscriptionId: 'd4e5f6a7-b8c9-0123-def0-111111111111',
    offerId: 'CFQ7TTC0LFLZ',
    productName: 'Microsoft 365 E5',
    skuName: 'Microsoft 365 E5',
    quantity: 500,
    billingCycle: 'Annual',
    termDuration: 'P1Y',
    monthlyValue: 28500,
    status: 'Active',
    isTransferable: true,
    customerName: 'Fabrikam Inc',
    customerId: 'cust-004',
  },
  {
    id: 'sub-fab-2',
    microsoftSubscriptionId: 'd4e5f6a7-b8c9-0123-def0-222222222222',
    offerId: 'CFQ7TTC0LHXM',
    productName: 'Microsoft Defender for Business',
    skuName: 'Defender for Business',
    quantity: 500,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 2500,
    status: 'Active',
    isTransferable: true,
    customerName: 'Fabrikam Inc',
    customerId: 'cust-004',
  },
  // Adventure Works subscriptions
  {
    id: 'sub-aw-1',
    microsoftSubscriptionId: 'e5f6a7b8-c9d0-1234-ef01-111111111111',
    offerId: 'CFQ7TTC0LFLX',
    productName: 'Microsoft 365 E3',
    skuName: 'Microsoft 365 E3',
    quantity: 25,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 900,
    status: 'Active',
    isTransferable: true,
    customerName: 'Adventure Works',
    customerId: 'cust-005',
  },
];

// Helper to find subscription by ID
export function findSubscriptionById(id: string): SearchableSubscription | undefined {
  return mockSearchableSubscriptions.find(s => s.id === id);
}

// Helper to get subscriptions by IDs
export function getSubscriptionsByIds(ids: string[]): SearchableSubscription[] {
  return ids
    .map(id => findSubscriptionById(id))
    .filter((s): s is SearchableSubscription => s !== undefined);
}

// Helper to calculate total value
export function calculateTotalValue(ids: string[]): number {
  return getSubscriptionsByIds(ids)
    .filter(s => s.isTransferable)
    .reduce((sum, s) => sum + s.monthlyValue, 0);
}


