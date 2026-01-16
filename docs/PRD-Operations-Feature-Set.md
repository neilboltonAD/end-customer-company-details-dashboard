# Product Requirements Document
## Operations Feature Set (Microsoft + Price Management)

| Document Info | |
|---------------|---|
| **Product Area** | Marketplace Operations |
| **Scope** | Microsoft Reseller Insights, Reseller P2P Transfers, Disti Price Sync |
| **Author** | Neil Bolton |
| **Created** | January 16, 2026 |
| **Last Updated** | January 16, 2026 |
| **Status** | 🚧 In Development |
| **Version** | 1.0 |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Feature A: Reseller PC Insights](#2-feature-a-reseller-pc-insights)
3. [Feature B: Reseller P2P Transfers](#3-feature-b-reseller-p2p-transfers)
4. [Feature C: Disti Price Sync](#4-feature-c-disti-price-sync)
5. [Implementation Status](#5-implementation-status)
6. [Future Enhancements](#6-future-enhancements)

---

## 1. Overview

This PRD covers three marketplace-wide Operations features:

- **Reseller PC Insights** — analytics and rollups of subscription health by customer and product type.
- **Reseller P2P Transfers** — initiate and manage Microsoft subscription transfers across partners.
- **Disti Price Sync** — review and commit distributor catalogue price updates.

All features are integrated into the main application (not extensions) and are accessible from the Operations navigation.

---

## 2. Feature A: Reseller PC Insights

### 2.1 Objective

Provide a marketplace-wide view of Microsoft subscription performance with drill-downs by customer and by product type.

### 2.2 Primary Users

- Marketplace Operations Managers
- Partner Success Managers

### 2.3 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| RPCI-1 | Provide a top summary card with marketplace-wide metrics | Must Have |
| RPCI-2 | Include collapsible **By Customer** view | Must Have |
| RPCI-3 | Expand customer rows to show product-type summaries | Must Have |
| RPCI-4 | Include collapsible **By Product** view | Must Have |
| RPCI-5 | Expand product types to list customers with that type | Must Have |
| RPCI-6 | Sort customers by Seats or Highest Value via column headers | Must Have |
| RPCI-7 | Use consistent summary styling (trend, icons, colors) | Must Have |

### 2.4 UX Notes

- Marketplace overview always appears above the two subsections.
- Expandable sections remember open/closed state.
- Summary cards use consistent visual language (trend indicators, status colors).

### 2.5 Data Requirements

- Marketplace totals: subscriptions, product types, seats, assigned seats, revenue.
- Per-customer rollups: subscriptions, seats, value, and health status.
- Per-product rollups: seats, assigned, revenue, and health status.

---

## 3. Feature B: Reseller P2P Transfers

### 3.1 Objective

Enable marketplace-wide management of Microsoft P2P subscription transfers from a single Operations page.

### 3.2 Primary Users

- Marketplace Operations Managers
- Partner Account Managers

### 3.3 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| RP2P-1 | Show summary cards for incoming, outgoing, completed transfers | Must Have |
| RP2P-2 | Show **Available Subscriptions** only after a search | Must Have |
| RP2P-3 | Search by customer name or subscription ID | Must Have |
| RP2P-4 | Display eligibility status with reasons for ineligible items | Must Have |
| RP2P-5 | Provide create, review, and detail modals | Must Have |
| RP2P-6 | Show active transfers and transfer history | Must Have |

### 3.4 UX Notes

- Search gating prevents subscription lists from appearing before a query.
- Status badges and eligibility reasons are prominent and accessible.

### 3.5 Data Requirements

- Transfer request metadata (direction, status, dates, partners).
- Eligible subscriptions (SKU, term, billing, value, eligibility reason).

---

## 4. Feature C: Disti Price Sync

### 4.1 Objective

Provide a centralized tool to review and commit distributor price changes.

### 4.2 Primary Users

- Marketplace Managers
- Operations Analysts

### 4.3 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| DPS-1 | Filter by distributor catalogue | Must Have |
| DPS-2 | Search by product name or ID | Must Have |
| DPS-3 | Show old vs new prices | Must Have |
| DPS-4 | Select and review updates in a modal | Must Have |
| DPS-5 | Allow removal of items before confirm | Must Have |
| DPS-6 | Track updates in **Synced Prices** tab | Must Have |
| DPS-7 | Status colors: Success/ Pending / Failed | Must Have |

### 4.4 UX Notes

- Located under **Price Management** → **Disti Price Sync**.
- Review modal is a confirmation checkpoint before committing.

### 4.5 Data Requirements

- Product pricing snapshots (old price, new price, % delta).
- Distributor metadata and sync timestamp.
- Status tracking for each update attempt.

---

## 5. Implementation Status

| Feature | Status | Notes |
|---------|--------|------|
| Reseller PC Insights | ✅ Implemented (Demo) | Marketplace summary + collapsible sections |
| Reseller P2P Transfers | ✅ Implemented (Demo) | Search gating + full transfer workflow |
| Disti Price Sync | ✅ Implemented (Demo) | Review modal + synced status tracking |

---

## 6. Future Enhancements

- Live API integration with Microsoft Partner Center and distributor feeds
- Audit trails tied to user identity and timestamps
- Role-based access controls and permissioned actions
