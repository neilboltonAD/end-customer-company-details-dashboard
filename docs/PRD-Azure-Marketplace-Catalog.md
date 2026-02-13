# PRD: Azure Marketplace Catalog

**Version:** 1.1  
**Last Updated:** 2026-02-13  
**Status:** POC Complete

---

## 1. Overview

The Azure Marketplace Catalog feature enables discovery and transaction of Azure Marketplace products through the Azure Marketplace Catalog API (2025-05-01). This feature allows marketplace operators to:

- **Discover** available products from the Azure Marketplace
- **View** product details, plans, and pricing
- **Select** offers for transaction
- **Track** orders and billing
- **Purchase** on behalf of customers (POC mode)

### Authorized Subscription

The feature operates using the following authorized Azure subscription:

```
Subscription ID: 3aad85d7-6ac9-4ef0-bb0f-30837aebff49
Tenant ID: 31941305-7fbe-4dc3-a5b3-ae5ed2a13980
Customer Domain: 5sep2023test1sj.onmicrosoft.com
```

This subscription has been authorized by Microsoft for access to the Marketplace Catalog APIs.

---

## 1.1 POC Mode vs Demo Mode

The feature supports two operating modes to facilitate both real testing and demonstrations:

### POC Mode (Real Transactions)

| Setting | Value |
|---------|-------|
| **Mode** | POC |
| **Customers Shown** | Only `5sep2023test1sj.onmicrosoft.com` |
| **Tenant Used** | `31941305-7fbe-4dc3-a5b3-ae5ed2a13980` |
| **Transactions** | Real Azure Marketplace API calls |
| **Use Case** | Testing real purchase flows |

### Demo Mode (Simulated)

| Setting | Value |
|---------|-------|
| **Mode** | Demo |
| **Customers Shown** | All mock customers |
| **Tenant Used** | POC tenant (behind the scenes) |
| **Transactions** | Uses POC tenant for all purchases |
| **Use Case** | Demonstrations, UI testing |

### Mode Toggle

- Located in the page header as a segmented control (POC / Demo)
- Mode is persisted to localStorage
- Visual badge indicates current mode (Blue = POC, Orange = Demo)
- Explanatory alert describes mode behavior

### Authentication for POC Mode

For real Azure transactions, users must authenticate to the POC customer's tenant:
1. Click **"Connect POC Customer"** button in the mode alert
2. Authenticate with credentials for `5sep2023test1sj.onmicrosoft.com`
3. Azure API calls will then use a token issued for the correct tenant

---

## 2. API Integration

### 2.1 Azure Marketplace Catalog API

**API Version:** 2025-05-01

**Endpoints Used:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Marketplace/products` | List products available for the billing account |
| GET | `/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Marketplace/products/{productId}` | Get specific product details |

**Documentation:**
- [List Products by Billing Account](https://learn.microsoft.com/en-us/rest/api/marketplacecatalog/resourcemanager/product-list/list-by-billing-account?view=rest-marketplacecatalog-resourcemanager-2025-05-01)
- [Get Product by Billing Account](https://learn.microsoft.com/en-us/rest/api/marketplacecatalog/resourcemanager/product-get/get-by-billing-account?view=rest-marketplacecatalog-resourcemanager-2025-05-01)

### 2.2 Authentication

Authentication uses Azure Active Directory OAuth2 Flow:
- **Authorization URL:** `https://login.microsoftonline.com/common/oauth2/authorize`
- **Scope:** `https://management.azure.com/.default`

The feature leverages the existing Partner Center connector's OAuth tokens, refreshing them as needed for Azure Management API access.

---

## 3. Data Models

### 3.1 Product Summary

```typescript
interface ProductSummary {
  uniqueProductId: string;
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
  lastModifiedDate?: string;
  plans?: PlanSummary[];
  imageUrl?: string;
}
```

### 3.2 Plan Summary with Pricing

```typescript
interface PlanSummary {
  planId: string;
  displayName: string;
  summary?: string;
  description?: string;
  skuId?: string;
  pricingTypes?: string[];
  cspState?: 'OptIn' | 'OptOut' | 'Terminated' | 'SelectiveOptIn';
  isPrivate?: boolean;
  pricing?: PlanPricing;
}

interface PlanPricing {
  currencyCode: string;
  retailPrice: number;
  unitPrice: number;
  unitOfMeasure: string;
  billingPeriod?: 'monthly' | 'annual' | 'hourly' | 'usage';
}
```

### 3.3 Order Item

```typescript
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  planId: string;
  planName: string;
  publisherName: string;
  quantity: number;
  pricingType: string;
  status: 'pending' | 'provisioning' | 'active' | 'failed' | 'cancelled';
  createdAt: string;
  billingCycle?: 'monthly' | 'annual' | 'usage-based';
  estimatedMonthlyPrice?: number;
  customerId?: string;
  customerName?: string;
}
```

---

## 4. Product Types Supported

| Product Type | Label | Description |
|--------------|-------|-------------|
| VirtualMachine | Virtual Machine | Azure VM images |
| SaaS | SaaS | Software as a Service |
| ContainerApps | Container Apps | Container-based applications |
| AzureApplication | Azure Application | Azure Resource Manager templates |
| ManagedServices | Managed Services | Managed service provider offerings |
| PowerBI | Power BI | Power BI visuals and templates |
| DynamicsBC | Dynamics 365 Business Central | Dynamics BC extensions |
| DynamicsCE | Dynamics 365 CE | Dynamics Customer Engagement |
| DynamicsOps | Dynamics 365 Operations | Dynamics Finance & Operations |
| Office365 | Office 365 | Microsoft 365 add-ins |

---

## 5. Pricing Types

| Type | Label | Color | Description |
|------|-------|-------|-------------|
| Free | Free | Green | No cost |
| FreeTrial | Free Trial | Teal | Trial period available |
| PayAsYouGo | Pay-As-You-Go | Blue | Usage-based billing |
| BYOL | Bring Your Own License | Orange | Customer provides license |
| Subscription | Subscription | Violet | Fixed subscription fee |
| RI | Reserved Instance | Indigo | Reserved capacity pricing |

---

## 6. CSP States

| State | Label | Description |
|-------|-------|-------------|
| OptIn | CSP Available | Available for CSP partners |
| OptOut | Not CSP | Not available for CSP |
| Terminated | Terminated | Offer terminated |
| SelectiveOptIn | Selective CSP | Available to selected CSP partners |

---

## 7. User Interface

### 7.1 Navigation

The feature is accessible from:
- **Operations > Microsoft > Azure Marketplace Catalog**
- **Direct URL:** `/integrations/azure-marketplace-catalog`

### 7.2 Product Catalog Tab

**Filters:**
- Search by product name/description
- Filter by Product Type
- Filter by Publisher
- Filter by Pricing Type

**Product Cards Display:**
- Product name and publisher
- Product description (truncated)
- Product type badge
- Pricing type badges
- Number of available plans

### 7.3 Product Detail Modal

When clicking a product card:
- Full product information
- List of available plans with:
  - Plan name
  - Pricing (retail price, billing period)
  - Pricing type badges
  - CSP state indicator
- Plan selection
- Quantity selector
- Add to Orders button

### 7.4 Orders & Billing Tab

**Orders Table:**
- Order ID
- Product name and publisher
- Plan name
- Quantity
- Estimated monthly cost
- Order status
- Creation date

**Billing Summary Cards:**
- Active Subscriptions count
- Pending Orders count
- Total unique Products

---

## 8. Order Workflow

```
┌─────────────────┐
│  Browse Catalog │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Select Product │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Select Plan   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Set Quantity   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Place Order    │──────► Status: pending
└────────┬────────┘
         │
         ▼ (Azure API call)
┌─────────────────┐
│  Provisioning   │──────► Status: provisioning
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Active      │──────► Status: active
└─────────────────┘
```

---

## 9. Billing Tracking

### 9.1 Estimated Monthly Cost Calculation

| Billing Period | Calculation |
|----------------|-------------|
| Monthly | `retailPrice × quantity` |
| Hourly | `retailPrice × 730 hours × quantity` |
| Annual | `retailPrice ÷ 12 × quantity` |

### 9.2 Storage

Orders are persisted to localStorage:
- **Key:** `azure_marketplace_orders_v1`
- **Format:** JSON array of OrderItem objects

### 9.3 Future Billing Integration

For production use, billing should integrate with:
- Azure Cost Management APIs
- Customer billing/invoicing systems
- Revenue recognition systems

---

## 10. Demo Mode

When Azure credentials are not configured, the feature operates in **Demo Mode**:
- Displays 15 sample products from various publishers
- Shows realistic pricing data
- Full functionality for testing order workflow
- Clear "Demo Mode" alert displayed to users

**Demo Products Include:**
- Microsoft: Windows Server, SQL Server, M365, Power BI, Dynamics 365, AKS
- Third-Party: Ubuntu (Canonical), RHEL (Red Hat), Datadog, Splunk, Terraform, Elastic, Confluent, Palo Alto, NGINX

---

## 11. Security Considerations

1. **Token Management:** OAuth tokens refreshed automatically; stored securely
2. **Subscription Isolation:** Uses single authorized subscription
3. **No Secrets in Frontend:** All API calls routed through backend server
4. **Demo Data Fallback:** Graceful degradation when credentials unavailable

---

## 12. Future Enhancements

1. **Real Order Placement:** Integrate with Azure Marketplace Purchase APIs
2. **Customer Assignment:** Assign orders to specific customers/tenants
3. **Invoice Generation:** Generate invoices from order data
4. **Usage Monitoring:** Track actual usage vs. estimates
5. **Approval Workflow:** Multi-step order approval process
6. **Bulk Operations:** Import/export orders, bulk actions

---

## 13. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-02-13 | Added POC/Demo mode toggle, customer filtering by mode, POC customer OAuth flow |
| 1.0 | 2026-02-10 | Initial POC release with product discovery, pricing display, and order tracking |

---

## 14. Files

| File | Description |
|------|-------------|
| `src/api/azureMarketplaceCatalog.ts` | Frontend API client and types |
| `src/api/customers.ts` | Customer data, POC mode config, mode helpers |
| `src/pages/AzureMarketplaceCatalog.tsx` | Main UI component with mode toggle |
| `server/partnerCenterDevServer.js` | Backend API endpoints including POC OAuth |
| `docs/PRD-Azure-Marketplace-Catalog.md` | This document |

### Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/azure/marketplace/purchase` | POST | Purchase third-party Azure Marketplace product |
| `/api/azure/connect-poc` | GET | Start OAuth flow for POC customer tenant |
| `/api/azure/callback-poc` | GET | OAuth callback for POC customer |
| `/api/azure/status` | GET | Check Azure connector status |
| `/api/azure/health` | GET | Health check Azure Management API |
