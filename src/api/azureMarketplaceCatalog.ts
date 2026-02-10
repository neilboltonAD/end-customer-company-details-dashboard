/**
 * Azure Marketplace Catalog API Client
 * 
 * Uses the Azure Marketplace Catalog API (2025-05-01) to discover
 * products available for transaction through a billing account.
 * 
 * API Documentation:
 * - List Products: https://learn.microsoft.com/en-us/rest/api/marketplacecatalog/resourcemanager/product-list/list-by-billing-account
 * - Get Product: https://learn.microsoft.com/en-us/rest/api/marketplacecatalog/resourcemanager/product-get/get-by-billing-account
 */

const API_BASE_URL = 'http://localhost:4000';
const AZURE_API_VERSION = '2025-05-01';

// The authorized subscription ID for marketplace catalog access
export const AUTHORIZED_SUBSCRIPTION_ID = '3aad85d7-6ac9-4ef0-bb0f-30837aebff49';

// ============================================================================
// Types based on Azure Marketplace Catalog API response
// ============================================================================

export interface PlanPricing {
  currencyCode: string;
  retailPrice: number;
  unitPrice: number;
  unitOfMeasure: string;
  billingPeriod?: 'monthly' | 'annual' | 'hourly' | 'usage';
  meterName?: string;
  minimumQuantity?: number;
  includedQuantity?: number;
}

export interface PlanSummary {
  planId: string;
  displayName: string;
  summary?: string;
  description?: string;
  skuId?: string;
  pricingTypes?: string[];
  cspState?: 'OptIn' | 'OptOut' | 'Terminated' | 'SelectiveOptIn';
  isPrivate?: boolean;
  hasProtectedArtifacts?: boolean;
  categoryIds?: string[];
  stackType?: string;
  displayRank?: number;
  metadata?: PlanMetadata;
  pricing?: PlanPricing;
}

export interface PlanMetadata {
  generation?: string;
  altStackReference?: string;
}

export interface StartingPrice {
  market?: string;
  termUnits?: string; // P1M = monthly, P1Y = yearly
  minTermPrice?: number;
  currency?: string;
}

export interface ProductSummary {
  uniqueProductId?: string; // May not be present in all API responses
  productId?: string; // Alternative ID field from API
  displayName: string;
  publisherDisplayName: string;
  publisherId?: string;
  publisherType?: 'Microsoft' | 'ThirdParty';
  productType: string;
  summary?: string;
  longSummary?: string;
  description?: string;
  popularity?: number;
  pricingTypes?: string[];
  operatingSystems?: string[];
  categoryIds?: string[];
  industryIds?: string[];
  linkedAddinsTypes?: string[];
  supportedProducts?: string[];
  applicableProducts?: string[];
  lastModifiedDate?: string;
  plans?: PlanSummary[];
  imageUrl?: string;
  startingPrice?: StartingPrice;
  productFamily?: string;
  service?: string;
  serviceFamily?: string;
}

export interface ProductSummaryListResult {
  value: ProductSummary[];
  nextLink?: string;
}

export interface CatalogListResponse {
  ok: boolean;
  products?: ProductSummary[];
  nextLink?: string;
  error?: string;
  totalCount?: number;
  timestamp: string;
  isDemo?: boolean;
  message?: string;
}

export interface CatalogProductResponse {
  ok: boolean;
  product?: ProductSummary;
  error?: string;
  timestamp: string;
}

// ============================================================================
// Filter and sort options
// ============================================================================

export interface CatalogListOptions {
  filter?: {
    productType?: string;
    publisherId?: string;
    displayName?: string;
    pricingTypes?: string[];
    categoryIds?: string[];
  };
  orderBy?: 'displayName' | 'popularity' | 'lastModifiedDate' | 'uniqueProductId';
  orderDirection?: 'asc' | 'desc';
  expand?: ('plans' | 'categories' | 'industries')[];
  top?: number;
  skip?: number;
  locations?: string[];
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List products available in the Azure Marketplace Catalog
 * for the authorized billing account.
 */
export async function listMarketplaceCatalogProducts(
  options: CatalogListOptions = {}
): Promise<CatalogListResponse> {
  try {
    // Build query params
    const params = new URLSearchParams();
    
    if (options.filter) {
      const filterParts: string[] = [];
      if (options.filter.productType) {
        filterParts.push(`productType eq '${options.filter.productType}'`);
      }
      if (options.filter.publisherId) {
        filterParts.push(`publisherId eq '${options.filter.publisherId}'`);
      }
      if (options.filter.displayName) {
        filterParts.push(`contains(displayName, '${options.filter.displayName}')`);
      }
      if (filterParts.length > 0) {
        params.set('$filter', filterParts.join(' and '));
      }
    }
    
    if (options.orderBy) {
      params.set('$orderby', `${options.orderBy} ${options.orderDirection || 'asc'}`);
    }
    
    if (options.expand && options.expand.length > 0) {
      params.set('$expand', options.expand.join(','));
    }
    
    if (options.top) {
      params.set('$top', String(options.top));
    }
    
    if (options.skip) {
      params.set('$skip', String(options.skip));
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/azure/marketplace-catalog/products${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data as CatalogListResponse;
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Failed to fetch marketplace catalog',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Get a specific product from the Azure Marketplace Catalog
 */
export async function getMarketplaceCatalogProduct(
  productId: string
): Promise<CatalogProductResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/azure/marketplace-catalog/products/${encodeURIComponent(productId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return data as CatalogProductResponse;
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Failed to fetch product details',
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// Product Type Constants
// ============================================================================

export const PRODUCT_TYPES = [
  { value: '', label: 'All Product Types' },
  { value: 'VirtualMachine', label: 'Virtual Machine' },
  { value: 'SaaS', label: 'SaaS' },
  { value: 'ContainerApps', label: 'Container Apps' },
  { value: 'AzureApplication', label: 'Azure Application' },
  { value: 'ManagedServices', label: 'Managed Services' },
  { value: 'CoreVirtualMachine', label: 'Core Virtual Machine' },
  { value: 'DevService', label: 'Dev Service' },
  { value: 'PowerBI', label: 'Power BI' },
  { value: 'DynamicsBC', label: 'Dynamics 365 Business Central' },
  { value: 'DynamicsCE', label: 'Dynamics 365 CE' },
  { value: 'DynamicsOps', label: 'Dynamics 365 Operations' },
  { value: 'Office365', label: 'Office 365' },
];

export const PRICING_TYPES = [
  { value: 'Free', label: 'Free', color: 'green' },
  { value: 'FreeTrial', label: 'Free Trial', color: 'teal' },
  { value: 'PayAsYouGo', label: 'Pay-As-You-Go', color: 'blue' },
  { value: 'BYOL', label: 'Bring Your Own License', color: 'orange' },
  { value: 'Subscription', label: 'Subscription', color: 'violet' },
  { value: 'RI', label: 'Reserved Instance', color: 'indigo' },
];

export const CSP_STATES = {
  OptIn: { label: 'CSP Available', color: 'green' },
  OptOut: { label: 'Not CSP', color: 'gray' },
  Terminated: { label: 'Terminated', color: 'red' },
  SelectiveOptIn: { label: 'Selective CSP', color: 'yellow' },
};

// ============================================================================
// Azure SaaS Fulfillment API - Order Management
// https://learn.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-fulfillment-subscription-api
// ============================================================================

export type SubscriptionStatus = 
  | 'pending'           // Order placed, not yet activated
  | 'provisioning'      // Activation in progress
  | 'active'            // Subscribed and active
  | 'suspended'         // Temporarily suspended
  | 'cancelled'         // Cancelled/Unsubscribed
  | 'failed';           // Activation failed

export interface SaaSFulfillmentResponse {
  ok: boolean;
  subscriptionId?: string;
  planId?: string;
  quantity?: number;
  status?: string;
  isDemo?: boolean;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * Activate a pending SaaS subscription
 * This provisions the resource in Azure
 */
export async function activateSubscription(
  subscriptionId: string,
  planId: string,
  quantity: number = 1
): Promise<SaaSFulfillmentResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/azure/saas/subscriptions/${encodeURIComponent(subscriptionId)}/activate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId, quantity }),
      }
    );

    const data = await response.json();
    return data as SaaSFulfillmentResponse;
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Failed to activate subscription',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Suspend an active subscription
 */
export async function suspendSubscription(
  subscriptionId: string
): Promise<SaaSFulfillmentResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/azure/saas/subscriptions/${encodeURIComponent(subscriptionId)}/suspend`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return data as SaaSFulfillmentResponse;
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Failed to suspend subscription',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Reinstate a suspended subscription
 */
export async function reinstateSubscription(
  subscriptionId: string
): Promise<SaaSFulfillmentResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/azure/saas/subscriptions/${encodeURIComponent(subscriptionId)}/reinstate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return data as SaaSFulfillmentResponse;
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Failed to reinstate subscription',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Cancel/Unsubscribe a subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<SaaSFulfillmentResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/azure/saas/subscriptions/${encodeURIComponent(subscriptionId)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return data as SaaSFulfillmentResponse;
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Failed to cancel subscription',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Change the plan or quantity for a subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  planId?: string,
  quantity?: number
): Promise<SaaSFulfillmentResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/azure/saas/subscriptions/${encodeURIComponent(subscriptionId)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId, quantity }),
      }
    );

    const data = await response.json();
    return data as SaaSFulfillmentResponse;
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Failed to update subscription',
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// Partner Center Marketplace Purchase API
// ============================================================================

export interface MarketplacePurchaseRequest {
  customerId: string;
  customerTenantId?: string;
  productId: string;
  planId?: string;
  quantity?: number;
  termDuration?: string;
  billingCycle?: 'monthly' | 'annual';
}

export interface MarketplacePurchaseResponse {
  ok: boolean;
  isDemo?: boolean;
  subscriptionId?: string;
  orderId?: string;
  customerId?: string;
  productId?: string;
  planId?: string;
  quantity?: number;
  status?: string;
  message?: string;
  error?: string;
  partnerCenterResponse?: any;
  createdAt?: string;
  timestamp: string;
}

/**
 * Purchase a CSP product for a customer via Partner Center Cart API
 * Used for Azure Plan, Software licenses, etc.
 */
export async function purchaseMarketplaceProduct(
  request: MarketplacePurchaseRequest
): Promise<MarketplacePurchaseResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/partner-center/marketplace/purchase`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    const data = await response.json();
    return data as MarketplacePurchaseResponse;
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Failed to purchase marketplace product',
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// Azure Marketplace - Third-Party Product Purchases
// ============================================================================

export interface AzureMarketplacePurchaseRequest {
  subscriptionId?: string;      // Azure subscription ID to bill against
  resourceGroupName?: string;   // Resource group for the resource
  productId: string;            // Product ID from marketplace catalog
  planId?: string;              // Plan ID
  publisherId?: string;         // Publisher ID
  offerId?: string;             // Offer ID
  name?: string;                // Name for the resource
  quantity?: number;
  termId?: string;              // Term ID
}

export interface AzureMarketplacePurchaseResponse {
  ok: boolean;
  isDemo?: boolean;
  productId?: string;
  planId?: string;
  resourceId?: string;
  resourceName?: string;
  subscriptionId?: string;
  status?: string;
  message?: string;
  error?: string;
  hint?: string;
  timestamp: string;
}

/**
 * Purchase a third-party Azure Marketplace product via ARM API
 * Used for SaaS, VMs, and other Azure Marketplace products
 */
export async function purchaseAzureMarketplaceProduct(
  request: AzureMarketplacePurchaseRequest
): Promise<AzureMarketplacePurchaseResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/azure/marketplace/purchase`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    const data = await response.json();
    return data as AzureMarketplacePurchaseResponse;
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Failed to purchase Azure Marketplace product',
      timestamp: new Date().toISOString(),
    };
  }
}

export interface CustomerSubscriptionsResponse {
  ok: boolean;
  isDemo?: boolean;
  customerId?: string;
  subscriptions?: any[];
  totalCount?: number;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * Get customer subscriptions from Partner Center
 */
export async function getCustomerSubscriptions(
  customerId: string
): Promise<CustomerSubscriptionsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/partner-center/customers/${encodeURIComponent(customerId)}/subscriptions`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return data as CustomerSubscriptionsResponse;
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Failed to get customer subscriptions',
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// Partner Center Customer List (for getting real customer GUIDs)
// ============================================================================

export interface PartnerCenterCustomer {
  id: string; // This is the GUID needed for API calls
  companyName?: string;
  domain?: string;
  tenantId?: string;
  email?: string;
  relationshipToPartner?: string;
}

export interface CustomerListResponse {
  ok: boolean;
  isDemo?: boolean;
  customers?: PartnerCenterCustomer[];
  totalCount?: number;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * Get list of customers from Partner Center with their GUIDs
 * Use the returned 'id' field as the azureTenantId for purchases
 */
export async function getPartnerCenterCustomers(): Promise<CustomerListResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/partner-center/customers`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return data as CustomerListResponse;
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Failed to get customers from Partner Center',
      timestamp: new Date().toISOString(),
    };
  }
}
