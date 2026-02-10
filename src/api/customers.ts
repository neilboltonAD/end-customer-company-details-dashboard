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
  azureTenantId?: string;
}

// Demo subscription ID authorized for Azure Marketplace Catalog API
export const DEMO_AZURE_SUBSCRIPTION_ID = '3aad85d7-6ac9-4ef0-bb0f-30837aebff49';

/**
 * Mock customer data representing our managed customers.
 * 
 * In production:
 * - Customers with hasTenantLinked: true have an Azure Plan subscription
 * - Customers with hasTenantLinked: false need to purchase an Azure Plan first
 */
export const MARKETPLACE_CUSTOMERS: Customer[] = [
  // Customers WITH linked tenants (can purchase from Azure Marketplace)
  // Note: azureTenantId is the Partner Center customer ID used for API calls
  { 
    id: 'mc-7', 
    name: 'VodafoneDemo2', 
    contactName: 'Tom Harris', 
    email: 'tom@vodafonedemo2.com', 
    createdOn: '10/23/25', 
    hasTenantLinked: true, 
    linkedDomain: 'vodafonedemo2.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: 'vodafonedemo2.onmicrosoft.com', // Partner Center customer ID
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
    azureTenantId: 'vodafonedemo1.onmicrosoft.com',
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
    azureTenantId: 'fabrikam.onmicrosoft.com',
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
    azureTenantId: 'contoso.onmicrosoft.com',
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
    azureTenantId: 'adventureworks.onmicrosoft.com',
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
    azureTenantId: 'appdirect.onmicrosoft.com',
  },
  // Demo Reseller customers (Azure-enabled for testing)
  { 
    id: 'mc-1', 
    name: 'demoresellercustomer3', 
    contactName: 'John Smith', 
    email: 'john@demoresellercustomer3.com', 
    createdOn: '11/11/25', 
    hasTenantLinked: true,
    linkedDomain: 'demoresellercustomer3.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: 'demoresellercustomer3.onmicrosoft.com',
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
    azureTenantId: 'demoresellercustomeropportunity.onmicrosoft.com',
  },
  { 
    id: 'mc-3', 
    name: 'demoresellercustomer2', 
    contactName: 'Mike Wilson', 
    email: 'mike@demoresellercustomer2.com', 
    createdOn: '11/10/25', 
    hasTenantLinked: true,
    linkedDomain: 'demoresellercustomer2.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: 'demoresellercustomer2.onmicrosoft.com',
  },
  { 
    id: 'mc-4', 
    name: 'demoresellercustomer1', 
    contactName: 'Emma Davis', 
    email: 'emma@demoresellercustomer1.com', 
    createdOn: '11/10/25', 
    hasTenantLinked: true,
    linkedDomain: 'demoresellercustomer1.onmicrosoft.com',
    azureSubscriptionId: DEMO_AZURE_SUBSCRIPTION_ID,
    azureTenantId: 'demoresellercustomer1.onmicrosoft.com',
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
    azureTenantId: 'demoreseller.onmicrosoft.com',
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
    azureTenantId: 'demoresellermanager.onmicrosoft.com',
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
