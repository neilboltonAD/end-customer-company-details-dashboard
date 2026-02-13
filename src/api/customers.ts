/**
 * Shared Customer/Company Data
 * 
 * In production, this would come from the Marketplace Operations > Companies API.
 * For this POC, we use mock data representing our managed customers.
 * 
 * Each customer can make purchases from the Azure Marketplace.
 * For demo purposes, all customers use the same Azure subscription ID.
 */

export interface Customer {
  id: string;
  name: string;
  contactName: string;
  email: string;
  createdOn: string;
  hasTenantLinked: boolean;
  linkedDomain?: string;
  // Azure-specific fields
  azureSubscriptionId?: string; // For demo, all use the same subscription
  azureTenantId?: string; // Partner Center customer GUID (required for API calls)
}

// Note: In production, these GUIDs should come from Partner Center's customer list
// Use GET /v1/customers to retrieve real customer GUIDs

// Demo subscription ID authorized for Azure Marketplace Catalog API
export const DEMO_AZURE_SUBSCRIPTION_ID = '3aad85d7-6ac9-4ef0-bb0f-30837aebff49';

// ============================================================================
// POC Mode Configuration
// ============================================================================
// The POC mode uses a single real customer with an authorized Azure subscription.
// This is the only customer that can make real Azure Marketplace transactions.

export const POC_CUSTOMER = {
  id: 'mc-real-1',
  name: 'Azure Plan Provisioning',
  tenantId: '31941305-7fbe-4dc3-a5b3-ae5ed2a13980',
  domain: '5sep2023test1sj.onmicrosoft.com',
  subscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
};

// Mode types for the Azure Marketplace feature
export type MarketplaceMode = 'poc' | 'demo';

// Storage key for persisting mode selection
const MARKETPLACE_MODE_KEY = 'azure-marketplace-mode';

/**
 * Get the current marketplace mode from localStorage
 */
export function getMarketplaceMode(): MarketplaceMode {
  if (typeof window === 'undefined') return 'demo';
  const stored = localStorage.getItem(MARKETPLACE_MODE_KEY);
  return stored === 'poc' ? 'poc' : 'demo';
}

/**
 * Set the marketplace mode in localStorage
 */
export function setMarketplaceMode(mode: MarketplaceMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MARKETPLACE_MODE_KEY, mode);
}

/**
 * Get customers filtered by mode
 * - POC mode: Only returns the real POC customer
 * - Demo mode: Returns all customers
 */
export function getCustomersByMode(mode: MarketplaceMode): Customer[] {
  if (mode === 'poc') {
    return MARKETPLACE_CUSTOMERS.filter(c => c.id === POC_CUSTOMER.id);
  }
  return getAzureEnabledCustomers();
}

/**
 * Get the effective tenant ID for transactions
 * - In POC mode: Uses the real POC customer tenant
 * - In Demo mode: Also uses POC tenant (all transactions go through the one authorized tenant)
 */
export function getEffectiveTenantId(mode: MarketplaceMode, _selectedCustomerId?: string): string {
  // Both modes use the POC tenant for actual transactions
  // (Demo mode just allows showing different customers in the UI)
  return POC_CUSTOMER.tenantId;
}

/**
 * Get the effective subscription ID for transactions
 */
export function getEffectiveSubscriptionId(): string {
  return POC_CUSTOMER.subscriptionId;
}

/**
 * Mock customer data representing our managed customers.
 * 
 * In production:
 * - Customers with hasTenantLinked: true have an Azure Plan subscription
 * - Customers with hasTenantLinked: false need to purchase an Azure Plan first
 */
export const MARKETPLACE_CUSTOMERS: Customer[] = [
  // ============================================================================
  // REAL PARTNER CENTER CUSTOMER (Azure Plan Provisioned)
  // This is the customer with the authorized subscription for Marketplace API
  // ============================================================================
  { 
    id: 'mc-real-1', 
    name: 'Azure Plan Provisioning', 
    contactName: 'Test Customer', 
    email: 'admin@5sep2023test1sj.onmicrosoft.com', 
    createdOn: '09/05/23', 
    hasTenantLinked: true,
    linkedDomain: '5sep2023test1sj.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: '31941305-7fbe-4dc3-a5b3-ae5ed2a13980', // Real GUID from Partner Center
  },

  // ============================================================================
  // Demo Customers (placeholder GUIDs)
  // ============================================================================
  // IMPORTANT: azureTenantId must be the Partner Center customer GUID
  // Get real GUIDs from: GET /v1/customers in Partner Center API
  { 
    id: 'mc-7', 
    name: 'VodafoneDemo2', 
    contactName: 'Tom Harris', 
    email: 'tom@vodafonedemo2.com', 
    createdOn: '10/23/25', 
    hasTenantLinked: true, 
    linkedDomain: 'vodafonedemo2.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Replace with real GUID from Partner Center
  },
  { 
    id: 'mc-8', 
    name: 'VodafoneDemo1', 
    contactName: 'Lisa Chen', 
    email: 'lisa@vodafonedemo1.com', 
    createdOn: '10/23/25', 
    hasTenantLinked: true, 
    linkedDomain: 'vodafonedemo1.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: 'b2c3d4e5-f678-90ab-cdef-123456789012', // Replace with real GUID
  },
  { 
    id: 'mc-9', 
    name: 'Fabrikam Inc', 
    contactName: 'James Miller', 
    email: 'james@fabrikam.com', 
    createdOn: '10/20/25', 
    hasTenantLinked: true, 
    linkedDomain: 'fabrikam.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: 'c3d4e5f6-7890-abcd-ef12-345678901234', // Replace with real GUID
  },
  { 
    id: 'mc-10', 
    name: 'Contoso Ltd', 
    contactName: 'John Doe', 
    email: 'john@contoso.com', 
    createdOn: '10/15/25', 
    hasTenantLinked: true, 
    linkedDomain: 'contoso.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: 'd4e5f678-90ab-cdef-1234-567890123456', // Replace with real GUID
  },
  { 
    id: 'mc-11', 
    name: 'Adventure Works', 
    contactName: 'Amy Wilson', 
    email: 'amy@adventureworks.com', 
    createdOn: '10/10/25', 
    hasTenantLinked: true, 
    linkedDomain: 'adventureworks.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: 'e5f67890-abcd-ef12-3456-789012345678', // Replace with real GUID
  },
  { 
    id: 'mc-12', 
    name: 'Appdirect', 
    contactName: 'Bob Martinez', 
    email: 'bob@appdirect.com', 
    createdOn: '10/13/25', 
    hasTenantLinked: true, 
    linkedDomain: 'appdirect.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: 'f6789012-abcd-ef34-5678-901234567890', // Replace with real GUID
  },
  // Demo Reseller customers (Azure-enabled for testing)
  // These GUIDs are placeholders - replace with real Partner Center customer GUIDs
  { 
    id: 'mc-1', 
    name: 'demoresellercustomer3', 
    contactName: 'John Smith', 
    email: 'john@demoresellercustomer3.com', 
    createdOn: '11/11/25', 
    hasTenantLinked: true,
    linkedDomain: 'demoresellercustomer3.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: '11111111-1111-1111-1111-111111111111', // Replace with real GUID
  },
  { 
    id: 'mc-2', 
    name: 'demoresellercustomeropportunity', 
    contactName: 'Sarah Johnson', 
    email: 'sarah@opportunity.com', 
    createdOn: '11/11/25', 
    hasTenantLinked: true,
    linkedDomain: 'demoresellercustomeropportunity.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: '22222222-2222-2222-2222-222222222222', // Replace with real GUID
  },
  { 
    id: 'mc-3', 
    name: 'demoresellercustomer2', 
    contactName: 'Mike Wilson', 
    email: 'mike@demoresellercustomer26851.onmicrosoft.com', 
    createdOn: '11/10/25', 
    hasTenantLinked: true,
    linkedDomain: 'demoresellercustomer26851.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: '71d4a690-6a18-4b55-87d0-b26b21bc81ce', // Real GUID from Partner Center
  },
  { 
    id: 'mc-4', 
    name: 'demoresellercustomer1', 
    contactName: 'Emma Davis', 
    email: 'emma@demoresellercustomer13799.onmicrosoft.com', 
    createdOn: '11/10/25', 
    hasTenantLinked: true,
    linkedDomain: 'demoresellercustomer13799.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: '8e97f6e7-f67b-445f-9e85-393c7daff321', // Real GUID from Partner Center
  },
  { 
    id: 'mc-5', 
    name: 'Demo Reseller', 
    contactName: 'Alex Brown', 
    email: 'alex@demoreseller.com', 
    createdOn: '11/10/25', 
    hasTenantLinked: true,
    linkedDomain: 'demoreseller.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: '55555555-5555-5555-5555-555555555555', // Replace with real GUID
  },
  { 
    id: 'mc-6', 
    name: 'Demo Reseller Manager', 
    contactName: 'Chris Lee', 
    email: 'chris@demoresellermanager.com', 
    createdOn: '11/10/25', 
    hasTenantLinked: true,
    linkedDomain: 'demoresellermanager.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: '66666666-6666-6666-6666-666666666666', // Replace with real GUID
  },
];

/**
 * Get customers that can purchase from Azure Marketplace
 * (i.e., have an Azure Plan subscription linked)
 */
export function getAzureEnabledCustomers(): Customer[] {
  return MARKETPLACE_CUSTOMERS.filter(c => c.hasTenantLinked);
}

/**
 * Get customers that need to purchase an Azure Plan first
 */
export function getCustomersNeedingAzurePlan(): Customer[] {
  return MARKETPLACE_CUSTOMERS.filter(c => !c.hasTenantLinked);
}

/**
 * Get all customers
 */
export function getAllCustomers(): Customer[] {
  return MARKETPLACE_CUSTOMERS;
}

/**
 * Get customer by ID
 */
export function getCustomerById(id: string): Customer | undefined {
  return MARKETPLACE_CUSTOMERS.find(c => c.id === id);
}
