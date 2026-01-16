# Product Requirements Document
## Disti Connector Price Sync Tool

| Document Info | |
|---------------|---|
| **Product Area** | Marketplace Operations |
| **Feature** | Distributor Catalogue Price Synchronization |
| **Author** | Neil Bolton |
| **Created** | January 14, 2026 |
| **Last Updated** | January 14, 2026 |
| **Status** | 🚧 In Development |
| **Version** | 1.0 |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [User Personas](#4-user-personas)
5. [Functional Requirements](#5-functional-requirements)
6. [User Experience Design](#6-user-experience-design)
7. [Data Requirements](#7-data-requirements)
8. [Implementation Status](#8-implementation-status)
9. [Future Enhancements](#9-future-enhancements)
10. [Appendix](#appendix)

---

## 1. Executive Summary

### 1.1 Overview

The **Disti Connector Price Sync Tool** enables Marketplace Managers to efficiently manage and synchronize product pricing across multiple distributor catalogues (Ingram Micro, TD Synnex, Microsoft Marketplace, Arrow Electronics). The tool automatically detects price changes from distributor feeds and provides a streamlined workflow to review, approve, and commit price updates to the marketplace.

### 1.2 Value Proposition

| Stakeholder | Value |
|-------------|-------|
| **Marketplace Managers** | Centralized price management across all distributor catalogues |
| **Operations Teams** | Reduced manual effort in tracking and updating prices |
| **Finance** | Accurate pricing ensures correct margins and revenue |
| **End Customers** | Up-to-date pricing reflects current market rates |

### 1.3 Key Features

- **Multi-Distributor Support** — Filter and manage prices by catalogue (Ingram, TD Synnex, Microsoft, Arrow)
- **Price Change Detection** — Daily automated sync identifies new prices
- **Bulk Update Workflow** — Select multiple products, review changes, confirm updates
- **Audit Trail** — Complete history of all price updates with status tracking
- **Status Indicators** — Visual feedback for Success (green), Pending (orange), Failed (red)

---

## 2. Problem Statement

### 2.1 Current State

Marketplace Managers must manually:

1. Check each distributor portal for price changes
2. Export price lists to spreadsheets
3. Compare against current marketplace prices
4. Identify discrepancies
5. Manually update prices in AppDirect
6. Track which updates succeeded or failed

This creates:
- **Pricing errors** — Manual process leads to mistakes
- **Delayed updates** — Days or weeks to reflect new prices
- **Lost margin** — Cost increases not passed through
- **Compliance risk** — Incorrect pricing on regulated products
- **Operational burden** — Hours spent on repetitive tasks

### 2.2 Desired State

An automated price synchronization tool where users can:

- View all price changes from distributor catalogues in one dashboard
- Filter by distributor to focus on specific catalogues
- Search for specific products by name or ID
- Review old vs new prices with clear visual indicators
- Bulk select and update prices with a single workflow
- Track the status of all price updates
- Maintain a complete audit history

**All within the AppDirect platform.**

---

## 3. Goals & Success Metrics

### 3.1 Primary Goals

| Goal | Description |
|------|-------------|
| **G1** | Reduce time to identify price changes from days to seconds |
| **G2** | Enable bulk price updates with a single approval workflow |
| **G3** | Provide complete visibility into price sync status |
| **G4** | Eliminate manual price comparison across distributor portals |
| **G5** | Maintain audit trail for compliance and troubleshooting |

### 3.2 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Price update time | < 5 minutes | From detection to update for bulk changes |
| Manual effort reduction | -80% | Time spent on price management |
| Pricing accuracy | 99.9% | Correct prices in marketplace |
| Audit compliance | 100% | All changes tracked with timestamp and user |

---

## 4. User Personas

### 4.1 Marketplace Manager (Primary)

| Attribute | Description |
|-----------|-------------|
| **Role** | Manages product catalogue and pricing for the marketplace |
| **Responsibilities** | Price updates, catalogue maintenance, margin management |
| **Pain Points** | Manual price tracking, multiple distributor portals, error-prone updates |
| **Goals** | Efficient price management, accurate margins, reduced manual work |

### 4.2 Operations Analyst

| Attribute | Description |
|-----------|-------------|
| **Role** | Monitors operational health and data accuracy |
| **Responsibilities** | Audit compliance, error investigation, reporting |
| **Pain Points** | No visibility into price change history |
| **Goals** | Complete audit trail, easy troubleshooting |

---

## 5. Functional Requirements

### 5.1 Price Updates Available Tab

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Display all products with detected price changes | Must Have |
| FR-1.2 | Show product name, ID, distributor, current price, new price, % change | Must Have |
| FR-1.3 | Filter by distributor catalogue (Ingram, TD Synnex, Microsoft, Arrow) | Must Have |
| FR-1.4 | Search by product name or product ID | Must Have |
| FR-1.5 | Sort by any column (ascending/descending) | Must Have |
| FR-1.6 | Checkbox selection for individual products | Must Have |
| FR-1.7 | "Select All" checkbox in header | Should Have |
| FR-1.8 | Display count of selected items | Must Have |
| FR-1.9 | "Update Selected Prices" button (disabled when none selected) | Must Have |
| FR-1.10 | Show "Last synced" timestamp | Should Have |
| FR-1.11 | Color-code price changes (increase = red, decrease = green) | Should Have |
| FR-1.12 | Pagination with configurable rows per page | Must Have |

### 5.2 Review & Confirm Modal

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Open modal when "Update Selected Prices" clicked | Must Have |
| FR-2.2 | Display list of all selected products with price changes | Must Have |
| FR-2.3 | Show old price → new price for each item | Must Have |
| FR-2.4 | "Remove" button for each item to exclude from update | Must Have |
| FR-2.5 | Warning message about the action being taken | Must Have |
| FR-2.6 | "Cancel" button to close without action | Must Have |
| FR-2.7 | "Confirm & Update Prices" button to commit changes | Must Have |
| FR-2.8 | Disable confirm button if no items remain | Should Have |
| FR-2.9 | Show total count of items being updated | Should Have |

### 5.3 Synced Prices Tab

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Display history of all price update operations | Must Have |
| FR-3.2 | Show product name, distributor, old price, new price, updated at, status | Must Have |
| FR-3.3 | Status badges: Success (green), Pending (orange), Failed (red) | Must Have |
| FR-3.4 | Filter by status (All, Success, Pending, Failed) | Should Have |
| FR-3.5 | Filter by distributor | Should Have |
| FR-3.6 | Search by product name or ID | Should Have |
| FR-3.7 | Sort by any column | Should Have |
| FR-3.8 | Show "Updated By" username | Should Have |
| FR-3.9 | Pagination | Must Have |
| FR-3.10 | "Retry" action for failed updates | Could Have |

### 5.4 Daily Sync Process

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Automated daily pull from distributor catalogues | Must Have |
| FR-4.2 | Compare new prices against current marketplace prices | Must Have |
| FR-4.3 | Create line items only for products with price differences | Must Have |
| FR-4.4 | Store detected date for each price change | Must Have |
| FR-4.5 | Manual "Sync Now" button for on-demand refresh | Should Have |

---

## 6. User Experience Design

### 6.1 Extension Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ Demo Mode — Running with mock data. Production connects to distributor APIs│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  💰 Price Sync Tool                                            [DEMO]       │
│  Synchronize product pricing across distributor catalogues                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Price Updates Available (15)]  [Synced Prices]                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [🔽 Distributor ▾]  [🔍 Search product name or ID          ]  Last sync: 2h│
│                                                                             │
│  15 price updates available                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │☐│ Product Name          │ Product ID    │ Distributor │ Current │ New  │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │☑│ Microsoft 365 E3      │ MS-365-E3-001 │ Ingram      │ $32.00  │$35.00│ │
│  │☑│ Windows Server 2022   │ WIN-SRV-2022  │ TD Synnex   │ $120.00 │$115  │ │
│  │☐│ Azure Reserved VM     │ AZ-VM-RES-01  │ MS Market   │ $89.00  │$92.00│ │
│  │☐│ Dynamics 365 Sales    │ D365-SALES    │ Arrow       │ $65.00  │$68.00│ │
│  │☐│ Power BI Pro          │ PBI-PRO-001   │ Ingram      │ $10.00  │$9.99 │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Rows per page: [25 ▾]                               1-15 of 15    < >      │
│                                                                             │
│  2 selected                                    [Update Selected Prices]     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Review Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Review Price Updates                                                  [X]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  You are about to update 2 product prices:                                  │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ 💼 Microsoft 365 E3                                                    │ │
│  │    Ingram Micro • MS-365-E3-001                                       │ │
│  │    $32.00 → $35.00 (+9.4%)                              [Remove]      │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │ 💼 Windows Server 2022                                                 │ │
│  │    TD Synnex • WIN-SRV-2022                                           │ │
│  │    $120.00 → $115.00 (-4.2%)                            [Remove]      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ⚠️ This action will update prices in your marketplace catalogue.           │
│     Changes will be reflected immediately after processing.                 │
│                                                                             │
│                                  [Cancel]    [Confirm & Update Prices]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Synced Prices Tab

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Price Updates Available]  [Synced Prices (47)]                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [🔽 Status ▾] [🔽 Distributor ▾]  [🔍 Search                    ]          │
│                                                                             │
│  47 synced prices                                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Product Name        │ Distributor │ Old    │ New    │ Updated    │Status│ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │ Microsoft 365 E3    │ Ingram      │ $32.00 │ $35.00 │ 2 min ago  │ ✅   │ │
│  │ Windows Server 2022 │ TD Synnex   │ $120   │ $115   │ 2 min ago  │ ✅   │ │
│  │ Office 365 E1       │ MS Market   │ $8.00  │ $8.25  │ 1 hour ago │ ⏳   │ │
│  │ Dynamics 365 Basic  │ Arrow       │ $40.00 │ $42.00 │ Yesterday  │ ❌   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Rows per page: [25 ▾]                               1-47 of 47    < >      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Status Badge Styles

| Status | Badge | Color | Description |
|--------|-------|-------|-------------|
| Success | ✅ Success | Green (`#40c057`) | Price updated successfully |
| Pending | ⏳ Pending | Orange (`#fd7e14`) | Update in progress |
| Failed | ❌ Failed | Red (`#fa5252`) | Update failed, retry available |

### 6.5 Price Change Indicators

| Change Type | Color | Example |
|-------------|-------|---------|
| Price Increase | Red text | `$32.00 → $35.00 (+9.4%)` |
| Price Decrease | Green text | `$120.00 → $115.00 (-4.2%)` |
| No Change | Gray text | `$50.00 → $50.00 (0%)` |

---

## 7. Data Requirements

### 7.1 Data Sources

| Data Type | Source | Refresh Rate |
|-----------|--------|--------------|
| Ingram Micro prices | Ingram API / SFTP feed | Daily |
| TD Synnex prices | Synnex API / SFTP feed | Daily |
| Microsoft prices | Partner Center API | Daily |
| Arrow prices | Arrow API | Daily |
| Current marketplace prices | AppDirect Catalogue API | Real-time |

### 7.2 Price Update Record Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `productId` | String | Product SKU/ID |
| `productName` | String | Product display name |
| `distributor` | Enum | INGRAM, TD_SYNNEX, MICROSOFT, ARROW |
| `currentPrice` | Decimal | Price in marketplace |
| `newPrice` | Decimal | Price from distributor |
| `percentChange` | Decimal | Calculated % difference |
| `detectedAt` | DateTime | When change was detected |
| `status` | Enum | AVAILABLE, PENDING, SUCCESS, FAILED |
| `updatedAt` | DateTime | When update was processed |
| `updatedBy` | String | Username who approved |
| `errorMessage` | String | Error details if failed |

---

## 8. Implementation Status

### 8.1 Architecture

| Attribute | Value |
|-----------|-------|
| **Location** | Microsoft > Reseller Tools (`src/components/company/DistiPriceSyncPanel.tsx`) |
| **Entry Point** | Operations → Companies → Microsoft → Reseller Tools |
| **UI Framework** | React + Tailwind CSS + Lucide Icons |
| **State Management** | React Hooks + useState |
| **Demo Mode** | ✅ Enabled (mock data) |

### 8.2 Demo Data

| Data Type | Count | Examples |
|-----------|-------|----------|
| **Price Updates** | 15 | Various products across all distributors |
| **Synced History** | 7 | Mix of Success, Pending, Failed statuses |
| **Distributors** | 4 | Ingram Micro, TD Synnex, Microsoft Marketplace, Arrow |

### 8.3 Running the Application

**Development Mode:**
```bash
cd end-customer-company-details-dashboard
npm start
```

Access via: `http://localhost:3000/operations/companies/<companyName>` and open **Microsoft → Reseller Tools**

---

## 9. Future Enhancements

| Enhancement | Priority | Description |
|-------------|----------|-------------|
| **Live API Integration** | High | Connect to actual distributor price feeds |
| **Scheduled Sync** | High | Configurable sync frequency |
| **Auto-Approve Rules** | Medium | Automatically approve changes within threshold |
| **Email Notifications** | Medium | Alert on new price changes detected |
| **Price History Charts** | Low | Visualize price trends over time |
| **Bulk Export** | Low | Download price change reports |
| **Margin Calculator** | Low | Show impact on margin for each change |

---

## Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **Distributor** | Vendor providing products to the marketplace (Ingram, TD Synnex, etc.) |
| **Catalogue** | Collection of products and prices from a distributor |
| **Price Sync** | Process of comparing and updating marketplace prices |
| **MRR Impact** | Change in Monthly Recurring Revenue from price updates |

### B. Distributor Catalogue Codes

| Distributor | Code | Color |
|-------------|------|-------|
| Ingram Micro | `INGRAM` | Blue |
| TD Synnex | `TD_SYNNEX` | Purple |
| Microsoft Marketplace | `MICROSOFT` | Cyan |
| Arrow Electronics | `ARROW` | Orange |

### C. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 14, 2026 | Neil Bolton | Initial PRD |

---

**End of Document**
