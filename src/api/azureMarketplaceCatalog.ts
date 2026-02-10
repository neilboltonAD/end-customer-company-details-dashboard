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
