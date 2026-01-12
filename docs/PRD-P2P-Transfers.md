# Product Requirements Document
## Partner to Partner (P2P) Subscription Transfers

| Document Info | |
|---------------|---|
| **Product Area** | Microsoft Marketplace Operations |
| **Feature** | Partner to Partner Transfers |
| **Author** | Neil Bolton |
| **Created** | January 12, 2026 |
| **Status** | Draft |
| **Version** | 1.0 |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [User Personas](#4-user-personas)
5. [Functional Requirements](#5-functional-requirements)
6. [User Experience Design](#6-user-experience-design)
7. [User Flows](#7-user-flows)
8. [Notifications & Alerts](#8-notifications--alerts)
9. [Logging & Audit Trail](#9-logging--audit-trail)
10. [Edge Cases & Error Handling](#10-edge-cases--error-handling)
11. [Dependencies & Constraints](#11-dependencies--constraints)
12. [Out of Scope](#12-out-of-scope)
13. [Appendix](#appendix)

---

## 1. Executive Summary

### 1.1 Overview

Within the AppDirect platform, it is possible to migrate in an existing subscription that is in the Partner Centre that is not present in the Marketplace. This underpins a core capability to develop **Partner to Partner (P2P) transfer support** as it is required that partners can easily manage P2P transfers operationally from within the AppDirect platform without needing to leave for Partner Centre.

The platform will enable a Marketplace Manager or privileged user to **initiate a transfer**, and **manage existing transfers**. This can be done by managing the subscriptions from within the **Company Details > Vendor Information** page.

### 1.2 Value Proposition

| Stakeholder | Value |
|-------------|-------|
| **Marketplace Managers** | Single pane of glass for all P2P transfer operations without context switching to Partner Centre |
| **Resellers** | Streamlined customer onboarding when acquiring customers from other partners |
| **End Customers** | Seamless subscription continuity during partner transitions |
| **Platform** | Increased stickiness and operational efficiency |

### 1.3 Reference Documentation

| Topic | Microsoft Documentation |
|-------|------------------------|
| Overview | [Transfer Subscriptions Overview](https://learn.microsoft.com/en-us/partner-center/customers/transfer-subscriptions#overview) |
| Supported Scenarios | [Supported Scenarios](https://learn.microsoft.com/en-us/partner-center/customers/transfer-subscriptions#supported-scenarios) |
| Supported Types | [Supported Transfer Types](https://learn.microsoft.com/en-us/partner-center/customers/transfer-subscriptions#supported-transfer-types) |
| Product Types | [Transfer Product Types](https://learn.microsoft.com/en-us/partner-center/customers/transfer-subscriptions#transfer-product-types) |
| Prerequisites | [Prerequisites](https://learn.microsoft.com/en-us/partner-center/customers/transfer-subscriptions#prerequisites) |
| Create Transfer | [Create a Transfer API](https://learn.microsoft.com/en-us/partner-center/developer/create-a-transfer) |
| Update Transfer | [Update a Transfer API](https://learn.microsoft.com/en-us/partner-center/developer/update-a-transfer) |
| Accept Transfer | [Accept a Transfer API](https://learn.microsoft.com/en-us/partner-center/developer/accept-a-transfer) |
| Reject Transfer | [Reject a Transfer API](https://learn.microsoft.com/en-us/partner-center/developer/reject-a-transfer) |
| Cancel Transfer | [Canceling a Transfer](https://learn.microsoft.com/en-us/partner-center/customers/transfer-subscriptions#canceling-a-transfer) |
| Notifications | [Notifications for Transfers](https://learn.microsoft.com/en-us/partner-center/customers/transfer-subscriptions#notifications-for-transfers) |
| Transfer Status | [Transfer Status](https://learn.microsoft.com/en-us/partner-center/customers/transfer-subscriptions#transfer-status) |
| Webhooks | [Webhook Support](https://learn.microsoft.com/en-us/partner-center/customers/transfer-subscriptions#webhook-support) |
| Activity Logs | [Activity Logs and Transfers](https://learn.microsoft.com/en-us/partner-center/customers/transfer-subscriptions#activity-logs-and-transfers) |

---

## 2. Problem Statement

### 2.1 Current State

Today, when a Marketplace Manager or Reseller needs to transfer subscriptions between partners, they must:

1. Leave the AppDirect platform
2. Navigate to Microsoft Partner Centre
3. Manually identify eligible subscriptions
4. Create transfer requests through Partner Centre UI
5. Return to AppDirect to verify subscription status
6. Repeat for each transfer operation

This creates:
- **Operational friction** — context switching between systems
- **Visibility gaps** — no unified view of transfer status in AppDirect
- **Manual effort** — duplicate data entry and verification
- **Risk of errors** — no validation or guidance in the workflow

### 2.2 Desired State

A fully integrated P2P transfer experience within the AppDirect platform where users can:

- View all available subscriptions eligible for transfer
- Initiate outgoing transfer requests to target partners
- Receive and respond to incoming transfer requests from source partners
- Monitor transfer status in real-time
- Cancel eligible transfers
- View complete transfer history and audit logs

**All without leaving the AppDirect platform.**

---

## 3. Goals & Success Metrics

### 3.1 Primary Goals

| Goal | Description |
|------|-------------|
| **G1** | Enable Marketplace Managers to initiate P2P transfer requests from within AppDirect |
| **G2** | Enable Marketplace Managers to accept/reject incoming transfer requests |
| **G3** | Provide real-time visibility into transfer status |
| **G4** | Reduce operational friction by eliminating need to use Partner Centre for transfers |
| **G5** | Maintain complete audit trail of all transfer activities |

### 3.2 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Transfer completion rate | > 90% | Completed transfers / Initiated transfers |
| Time to accept incoming transfer | < 24 hours | Average time from notification to action |
| User satisfaction | > 4.0 / 5.0 | Post-feature survey |
| Partner Centre dependency | -80% | Reduction in PC visits for transfer operations |
| Error rate | < 2% | Failed transfers due to user error |

---

## 4. User Personas

### 4.1 Marketplace Manager (Primary)

| Attribute | Description |
|-----------|-------------|
| **Role** | Manages the marketplace on behalf of the Distributor |
| **Responsibilities** | Customer onboarding, subscription management, partner relationships |
| **Pain Points** | Context switching, manual processes, lack of visibility |
| **Goals** | Efficient operations, complete visibility, reduced errors |
| **Permissions** | Full access to P2P transfer operations |

### 4.2 Reseller (Secondary)

| Attribute | Description |
|-----------|-------------|
| **Role** | Manages end customers and their subscriptions |
| **Responsibilities** | Customer acquisition, subscription sales, customer support |
| **Pain Points** | Slow customer onboarding, complex transfer process |
| **Goals** | Quick customer onboarding, self-service capabilities |
| **Permissions** | Limited access — can view but may require MM approval for actions |

### 4.3 End Customer (Informational Only)

| Attribute | Description |
|-----------|-------------|
| **Role** | The organization whose subscriptions are being transferred |
| **Responsibilities** | N/A — passive in transfer process |
| **Visibility** | May see transfer notifications but cannot take action |
| **Impact** | Subscription continuity must be maintained |

---

## 5. Functional Requirements

### 5.1 P2P Transfers Panel

The P2P Transfers Panel shall be a new section within the **Company Details > Vendor Information > Microsoft** page.

#### FR-1: Panel Location & Visibility

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | The P2P Transfers Panel SHALL appear within the Microsoft vendor section | Must Have |
| FR-1.2 | The Panel SHALL be positioned after Partner Centre Insights | Must Have |
| FR-1.3 | The Panel SHALL use Mantine UI components for consistency | Must Have |
| FR-1.4 | The Panel SHALL be visible to users with Marketplace Manager or equivalent permissions | Must Have |
| FR-1.5 | The Panel SHALL display a notification badge when incoming transfers are pending | Must Have |

#### FR-2: Transfer Overview Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | The Panel SHALL display a summary of transfer activity at the top | Must Have |
| FR-2.2 | Summary SHALL include count of Incoming Pending transfers | Must Have |
| FR-2.3 | Summary SHALL include count of Outgoing Pending transfers | Must Have |
| FR-2.4 | Summary SHALL include count of Completed transfers (last 90 days) | Should Have |
| FR-2.5 | Each summary card SHALL be clickable to filter the transfer list | Should Have |
| FR-2.6 | Incoming Pending count SHALL display a notification badge if > 0 | Must Have |

#### FR-3: Available Subscriptions for Transfer

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | The Panel SHALL display a list of subscriptions eligible for P2P transfer | Must Have |
| FR-3.2 | Each subscription SHALL show: Product Name, SKU, Quantity, Term, Billing Cycle | Must Have |
| FR-3.3 | Each subscription SHALL indicate transfer eligibility status | Must Have |
| FR-3.4 | Non-eligible subscriptions SHALL display the reason for ineligibility | Must Have |
| FR-3.5 | List SHALL support filtering by eligibility status | Should Have |
| FR-3.6 | List SHALL support sorting by Product Name, Quantity, Term | Should Have |

#### FR-4: Active Transfers List

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | The Panel SHALL display all active transfers for this customer | Must Have |
| FR-4.2 | Active transfers SHALL be categorized by direction: Incoming / Outgoing | Must Have |
| FR-4.3 | Each transfer SHALL show: Partner Name, Subscription Count, Total Value, Status, Date | Must Have |
| FR-4.4 | Each transfer SHALL have a "View Details" action | Must Have |
| FR-4.5 | Pending outgoing transfers SHALL have a "Cancel" action | Must Have |
| FR-4.6 | Pending incoming transfers SHALL have "Accept" and "Reject" actions | Must Have |
| FR-4.7 | Status SHALL be displayed using consistent color-coded badges | Must Have |

#### FR-5: Create Transfer Request

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | User SHALL be able to initiate a new transfer request via "Create Transfer Request" button | Must Have |
| FR-5.2 | Create Transfer modal SHALL require Target Partner Tenant ID | Must Have |
| FR-5.3 | Create Transfer modal SHALL allow optional Target Partner MPN ID | Should Have |
| FR-5.4 | User SHALL be able to select one or more eligible subscriptions | Must Have |
| FR-5.5 | Only transfer-eligible subscriptions SHALL be selectable | Must Have |
| FR-5.6 | Modal SHALL display a summary before submission | Must Have |
| FR-5.7 | User SHALL confirm the transfer request before it is submitted | Must Have |
| FR-5.8 | Successful submission SHALL show confirmation notification | Must Have |
| FR-5.9 | Failed submission SHALL show error message with reason | Must Have |

#### FR-6: Review Incoming Transfer Request

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | User SHALL be notified of new incoming transfer requests | Must Have |
| FR-6.2 | Incoming transfer details SHALL show: Source Partner, Subscriptions, Quantities, Values | Must Have |
| FR-6.3 | User SHALL be able to Accept an incoming transfer | Must Have |
| FR-6.4 | User SHALL be able to Reject an incoming transfer | Must Have |
| FR-6.5 | Reject action SHALL require a reason selection | Should Have |
| FR-6.6 | Accept action SHALL show confirmation before processing | Must Have |
| FR-6.7 | Transfer expiration date SHALL be clearly displayed | Must Have |

#### FR-7: Update Existing Transfer Request

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-7.1 | User SHALL be able to modify a pending outgoing transfer | Should Have |
| FR-7.2 | Modifications allowed: Add/remove subscriptions, update quantities | Should Have |
| FR-7.3 | Modifications SHALL be tracked in audit log | Must Have |

#### FR-8: Cancel Transfer Request

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-8.1 | User SHALL be able to cancel a pending outgoing transfer | Must Have |
| FR-8.2 | Cancel action SHALL require confirmation | Must Have |
| FR-8.3 | Cancelled transfers SHALL remain visible in history with "Cancelled" status | Must Have |
| FR-8.4 | Cancel reason SHALL be captured | Should Have |

---

## 6. User Experience Design

### 6.1 P2P Transfers Panel Layout

The P2P Transfers Panel follows the existing design patterns used in the Microsoft vendor section.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📦 P2P Subscription Transfers                              [New ▼] [Sync]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   📥 INCOMING   │  │   📤 OUTGOING   │  │   ✅ COMPLETED  │              │
│  │                 │  │                 │  │                 │              │
│  │       3 🔴      │  │       1         │  │       12        │              │
│  │   Pending       │  │   Pending       │  │   Last 90 days  │              │
│  │                 │  │                 │  │                 │              │
│  │  [Review Now]   │  │  [View]         │  │  [View History] │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ ▼ Available Subscriptions for Transfer                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Product                      │ Qty  │ Term     │ Billing  │ Eligible  │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ Microsoft 365 Business Prem  │  50  │ Annual   │ Monthly  │ ✅ Yes    │  │
│  │ Microsoft 365 E3             │  30  │ Annual   │ Upfront  │ ✅ Yes    │  │
│  │ Microsoft 365 E5             │  10  │ Triannual│ Monthly  │ ✅ Yes    │  │
│  │ Azure Plan                   │   1  │ -        │ Usage    │ ❌ No *   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  * Azure plans require a separate transfer process                          │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ ▼ Active Transfers                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📥 INCOMING                                                                │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ From: Contoso Partner Ltd              🟡 Pending                     │  │
│  │ 2 subscriptions • $2,400/mo • Expires: Jan 26, 2026                  │  │
│  │                                         [Details] [Reject] [Accept]   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ From: Fabrikam Inc                     🟡 Pending                     │  │
│  │ 1 subscription • $1,100/mo • Expires: Jan 28, 2026                   │  │
│  │                                         [Details] [Reject] [Accept]   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  📤 OUTGOING                                                                │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ To: Acme Corp                          🟡 Pending                     │  │
│  │ 3 subscriptions • $3,600/mo • Created: Jan 10, 2026                  │  │
│  │                                         [Details] [Cancel]            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ ▼ Transfer History (Last 90 Days)                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Date       │ Direction │ Partner        │ Items │ Status    │ Action │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ Jan 05     │ 📥 In     │ TechStart LLC  │   5   │ ✅ Done   │ [View] │  │
│  │ Dec 28     │ 📤 Out    │ CloudFirst     │   2   │ ❌ Reject │ [View] │  │
│  │ Dec 15     │ 📥 In     │ DataPro Inc    │   8   │ ✅ Done   │ [View] │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Create Transfer Request Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Create Transfer Request                                              [×]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  You are creating a transfer request to move subscriptions from this        │
│  customer's tenant to another partner.                                      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  STEP 1: Target Partner Information                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Target Partner Tenant ID *                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ e.g., 12345678-1234-1234-1234-123456789abc                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Target Partner MPN ID (Optional)                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ e.g., 1234567                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  STEP 2: Select Subscriptions to Transfer                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ☑ │ Product                      │ Qty  │ Term     │ Value/mo        │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ ☑ │ Microsoft 365 Business Prem  │  50  │ Annual   │ $1,100          │  │
│  │ ☑ │ Microsoft 365 E3             │  30  │ Annual   │ $1,080          │  │
│  │ ☐ │ Microsoft 365 E5             │  10  │ Triannual│ $570            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Summary                                                            │    │
│  │  ─────────────────────────────────────────────────────────────────  │    │
│  │  Subscriptions Selected:  2                                         │    │
│  │  Total Seats:             80                                        │    │
│  │  Monthly Value:           $2,180                                    │    │
│  │  Transfer Expires:        Feb 11, 2026 (30 days)                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ⚠️  The target partner will have 30 days to accept this transfer.         │
│      Subscriptions will remain active with you until transfer completes.    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                          [Cancel]    [Create Transfer →]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Review Incoming Transfer Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Review Incoming Transfer Request                                     [×]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  📥 Transfer Request from Contoso Partner Ltd                       │    │
│  │  ─────────────────────────────────────────────────────────────────  │    │
│  │  Partner Tenant ID:   a1b2c3d4-e5f6-7890-abcd-ef1234567890         │    │
│  │  Partner MPN ID:      1234567                                       │    │
│  │  Request Date:        January 12, 2026                              │    │
│  │  Expires:             January 26, 2026 (14 days remaining)          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Subscriptions Included in Transfer:                                        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Product                      │ Qty  │ Term     │ Billing  │ Value/mo │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ Microsoft 365 Business Prem  │  25  │ Annual   │ Monthly  │ $550     │  │
│  │ Microsoft 365 E3             │  15  │ Annual   │ Upfront  │ $540     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Total Subscriptions:   2                                           │    │
│  │  Total Seats:           40                                          │    │
│  │  Monthly Value:         $1,090                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ℹ️  What happens when you accept?                                  │    │
│  │                                                                      │    │
│  │  • You will become the billing partner for these subscriptions      │    │
│  │  • Customer service continuity will be maintained                    │    │
│  │  • The source partner will no longer have access                    │    │
│  │  • This action cannot be undone                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                              [Cancel]    [Reject]    [Accept Transfer →]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Transfer Details Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Transfer Details                                                     [×]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Transfer ID: TR-2026-0112-001                     Status: 🟢 Completed     │
│                                                                             │
│  ┌────────────────────────────────┬────────────────────────────────────┐    │
│  │  FROM (Source Partner)         │  TO (Target Partner)               │    │
│  │  ────────────────────────────  │  ────────────────────────────────  │    │
│  │  Contoso Partner Ltd           │  AppDirect Demo Reseller           │    │
│  │  Tenant: a1b2c3d4...           │  Tenant: 408f194e...               │    │
│  │  MPN: 1234567                  │  MPN: 7654321                      │    │
│  └────────────────────────────────┴────────────────────────────────────┘    │
│                                                                             │
│  Customer Tenant: demoresellercustomer3 (8e97f6e7-f67b-445f-9e85...)        │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  SUBSCRIPTIONS TRANSFERRED                                                  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Product                      │ Qty  │ Status                         │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ Microsoft 365 Business Prem  │  25  │ ✅ Transferred                 │  │
│  │ Microsoft 365 E3             │  15  │ ✅ Transferred                 │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  TIMELINE                                                                   │
│                                                                             │
│  ●───────────●───────────●───────────●                                      │
│  │           │           │           │                                      │
│  Created     Accepted    Processing  Completed                              │
│  Jan 5       Jan 6       Jan 6       Jan 6                                  │
│  10:30 AM    2:15 PM     2:16 PM     2:45 PM                               │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ACTIVITY LOG                                                               │
│                                                                             │
│  Jan 6, 2:45 PM  │ Transfer completed successfully                         │
│  Jan 6, 2:16 PM  │ Microsoft processing transfer                           │
│  Jan 6, 2:15 PM  │ Transfer accepted by neil.bolton@appdirect.com          │
│  Jan 5, 10:30 AM │ Transfer request created by source partner              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                               [Close]       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.5 Status Badge Design

| Status | Badge Design | Color | Use Case |
|--------|--------------|-------|----------|
| Pending | `🟡 Pending` | Yellow (#FEF3C7 bg, #92400E text) | Awaiting partner action |
| In Progress | `🔵 Processing` | Blue (#DBEAFE bg, #1E40AF text) | Transfer being executed |
| Completed | `🟢 Completed` | Green (#D1FAE5 bg, #065F46 text) | Successfully transferred |
| Failed | `🔴 Failed` | Red (#FEE2E2 bg, #991B1B text) | Transfer failed |
| Rejected | `⚫ Rejected` | Gray (#E5E7EB bg, #374151 text) | Partner rejected transfer |
| Cancelled | `⚫ Cancelled` | Gray (#E5E7EB bg, #374151 text) | Initiator cancelled |
| Expired | `🟠 Expired` | Orange (#FED7AA bg, #9A3412 text) | 30-day window passed |

---

## 7. User Flows

### 7.1 Create Outgoing Transfer Request

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CREATE OUTGOING TRANSFER FLOW                        │
└─────────────────────────────────────────────────────────────────────────────┘

     User navigates to                     User clicks
     Company Details >                     "Create Transfer
     Vendor Information >                  Request" button
     Microsoft                            
           │                                    │
           ▼                                    ▼
    ┌─────────────┐                      ┌─────────────┐
    │   P2P       │                      │   Modal     │
    │   Transfers │─────────────────────▶│   Opens     │
    │   Panel     │                      │             │
    └─────────────┘                      └──────┬──────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ Enter Target Partner  │
                                    │ Tenant ID & MPN ID    │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ Select Subscriptions  │
                                    │ to Transfer           │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ Review Summary        │
                                    │ & Confirm             │
                                    └───────────┬───────────┘
                                                │
                              ┌─────────────────┴─────────────────┐
                              ▼                                   ▼
                    ┌─────────────────┐                 ┌─────────────────┐
                    │    Success      │                 │     Error       │
                    │  Notification   │                 │   Notification  │
                    │                 │                 │                 │
                    │ "Transfer       │                 │ "Failed to      │
                    │  request        │                 │  create         │
                    │  created"       │                 │  transfer"      │
                    └────────┬────────┘                 └────────┬────────┘
                             │                                   │
                             ▼                                   ▼
                    ┌─────────────────┐                 ┌─────────────────┐
                    │ Transfer added  │                 │ User can retry  │
                    │ to "Outgoing    │                 │ or contact      │
                    │ Pending" list   │                 │ support         │
                    └─────────────────┘                 └─────────────────┘
```

### 7.2 Accept Incoming Transfer Request

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ACCEPT INCOMING TRANSFER FLOW                        │
└─────────────────────────────────────────────────────────────────────────────┘

   Notification badge                   User clicks on
   appears on P2P                       incoming transfer
   Transfers panel                      or "Review Now"
          │                                   │
          ▼                                   ▼
   ┌─────────────┐                     ┌─────────────┐
   │   📥 3 🔴   │                     │   Review    │
   │   Incoming  │────────────────────▶│   Modal     │
   │             │                     │   Opens     │
   └─────────────┘                     └──────┬──────┘
                                              │
                                              ▼
                                   ┌───────────────────────┐
                                   │ View Source Partner   │
                                   │ & Subscription        │
                                   │ Details               │
                                   └───────────┬───────────┘
                                              │
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                   ┌─────────────────┐             ┌─────────────────┐
                   │ User clicks     │             │ User clicks     │
                   │ "Accept"        │             │ "Reject"        │
                   └────────┬────────┘             └────────┬────────┘
                            │                               │
                            ▼                               ▼
                   ┌─────────────────┐             ┌─────────────────┐
                   │ Confirmation    │             │ Reason          │
                   │ Dialog          │             │ Selection       │
                   └────────┬────────┘             └────────┬────────┘
                            │                               │
                            ▼                               ▼
                   ┌─────────────────┐             ┌─────────────────┐
                   │ Processing      │             │ Transfer        │
                   │ Transfer...     │             │ Rejected        │
                   └────────┬────────┘             └─────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Success!        │
                   │ Subscriptions   │
                   │ now managed     │
                   │ by you          │
                   └─────────────────┘
```

### 7.3 Cancel Outgoing Transfer Request

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CANCEL OUTGOING TRANSFER FLOW                        │
└─────────────────────────────────────────────────────────────────────────────┘

   User views outgoing                  User clicks
   pending transfer                     "Cancel" button
          │                                   │
          ▼                                   ▼
   ┌─────────────┐                     ┌─────────────┐
   │ 📤 Outgoing │                     │ Confirmation│
   │ To: Acme    │────────────────────▶│ Dialog      │
   │ 🟡 Pending  │                     │             │
   └─────────────┘                     │ "Are you    │
                                       │ sure you    │
                                       │ want to     │
                                       │ cancel?"    │
                                       └──────┬──────┘
                                              │
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                   ┌─────────────────┐             ┌─────────────────┐
                   │ User confirms   │             │ User cancels    │
                   │ cancellation    │             │ (keeps transfer)│
                   └────────┬────────┘             └─────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Transfer        │
                   │ Cancelled       │
                   │ ⚫ Status       │
                   │ updated         │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Moved to        │
                   │ Transfer        │
                   │ History         │
                   └─────────────────┘
```

---

## 8. Notifications & Alerts

### 8.1 In-App Notifications

| Trigger | Notification | Type | Persistence |
|---------|--------------|------|-------------|
| New incoming transfer request | "New transfer request from {Partner Name}" | Info | Until dismissed |
| Transfer accepted | "Transfer from {Partner} completed successfully" | Success | 10 seconds |
| Transfer rejected | "Your transfer request to {Partner} was rejected" | Warning | Until dismissed |
| Transfer cancelled | "Transfer to {Partner} has been cancelled" | Info | 5 seconds |
| Transfer failed | "Transfer processing failed: {Reason}" | Error | Until dismissed |
| Transfer expiring soon | "Transfer request expires in {X} days" | Warning | Daily reminder |
| Transfer expired | "Transfer request from {Partner} has expired" | Warning | Until dismissed |

### 8.2 Notification Badge

- The P2P Transfers panel header SHALL display a badge with the count of pending incoming transfers
- Badge SHALL be red/orange to draw attention
- Badge SHALL update in real-time when new transfers arrive
- Badge SHALL disappear when all incoming transfers are processed

### 8.3 Webhook Events (Backend)

The system should subscribe to Microsoft Partner Centre webhooks for:

| Event | Description |
|-------|-------------|
| `transfer-created` | New transfer request created |
| `transfer-updated` | Transfer request modified |
| `transfer-accepted` | Transfer accepted by target partner |
| `transfer-rejected` | Transfer rejected by target partner |
| `transfer-completed` | Transfer successfully completed |
| `transfer-failed` | Transfer processing failed |

---

## 9. Logging & Audit Trail

### 9.1 Audit Log Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| LOG-1 | All transfer actions SHALL be logged | Must Have |
| LOG-2 | Logs SHALL include: Timestamp, User, Action, Transfer ID, Details | Must Have |
| LOG-3 | Logs SHALL be viewable from Transfer Details modal | Must Have |
| LOG-4 | Logs SHALL be searchable by Transfer ID, User, Date Range | Should Have |
| LOG-5 | Logs SHALL be exportable to CSV | Could Have |

### 9.2 Logged Events

| Event | Logged Data |
|-------|-------------|
| Transfer Created | User, Target Partner, Subscriptions, Timestamp |
| Transfer Accepted | User, Source Partner, Subscriptions, Timestamp |
| Transfer Rejected | User, Source Partner, Reason, Timestamp |
| Transfer Cancelled | User, Reason, Timestamp |
| Transfer Modified | User, Changes Made, Timestamp |
| Transfer Completed | Completion Timestamp, Processing Duration |
| Transfer Failed | Error Code, Error Message, Timestamp |

### 9.3 Admin Log

A separate admin-level log SHALL be maintained for platform administrators:

- All user actions across all customers
- API call logs to Partner Centre
- Webhook receipt logs
- Error and exception logs

---

## 10. Edge Cases & Error Handling

### 10.1 Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| User tries to transfer ineligible subscription | Subscription is disabled in selection list with tooltip explaining why |
| Transfer request expires before acceptance | Transfer moves to "Expired" status, user notified |
| Customer relationship removed during transfer | Transfer fails, user notified with clear error message |
| Partner Centre API unavailable | Graceful degradation — show cached data, disable actions, show error banner |
| Concurrent modification of same transfer | Last write wins, with conflict notification |
| Zero subscriptions selected | "Create Transfer" button disabled with tooltip |
| Invalid Partner Tenant ID format | Inline validation error, button disabled |

### 10.2 Error Messages

| Error Code | User-Facing Message | Suggested Action |
|------------|---------------------|------------------|
| `INVALID_PARTNER` | "The target partner tenant ID is invalid or not found." | "Please verify the tenant ID and try again." |
| `NO_RELATIONSHIP` | "No customer relationship exists with the target partner." | "The customer must establish a relationship with the target partner first." |
| `SUBSCRIPTION_NOT_ELIGIBLE` | "One or more subscriptions are not eligible for transfer." | "Review subscription eligibility requirements." |
| `TRANSFER_EXPIRED` | "This transfer request has expired." | "Create a new transfer request." |
| `ALREADY_TRANSFERRED` | "These subscriptions have already been transferred." | "Refresh the page to see the current status." |
| `API_UNAVAILABLE` | "Unable to connect to Microsoft Partner Centre." | "Please try again in a few minutes." |

---

## 11. Dependencies & Constraints

### 11.1 Dependencies

| Dependency | Description | Owner |
|------------|-------------|-------|
| Microsoft Partner Centre API | Required for all transfer operations | Microsoft |
| Customer Tenant Relationship | Customer must have relationship with both partners | Customer |
| GDAP Permissions | Appropriate admin permissions required | Platform |
| Mantine UI Library | For consistent component styling | Frontend |
| Webhook Infrastructure | For real-time status updates | Backend |

### 11.2 Constraints

| Constraint | Description |
|------------|-------------|
| Transfer Expiration | Transfer requests expire after 30 days |
| Eligible Products | Only certain product types are transferable (see Microsoft docs) |
| One Direction | A subscription can only be transferred to one partner at a time |
| Customer Consent | Implicit consent through existing relationship |
| API Rate Limits | Microsoft API rate limits apply |

### 11.3 Prerequisites (from Microsoft)

Per Microsoft documentation, before a transfer can occur:

1. ✅ Customer has established a relationship with the target partner
2. ✅ Target partner has signed the Microsoft Partner Agreement
3. ✅ Customer has signed the Microsoft Customer Agreement with target partner
4. ✅ Subscriptions are eligible for transfer (license-based, Azure Plan, etc.)
5. ✅ Subscriptions are not suspended or cancelled

---

## 12. Out of Scope

The following items are explicitly **out of scope** for this initial release:

| Item | Reason |
|------|--------|
| Azure Subscription Transfers | Requires separate process per Microsoft |
| Software Subscriptions | Not supported by Microsoft for P2P |
| Perpetual Software | Not supported by Microsoft for P2P |
| Third-Party Subscriptions | Not supported by Microsoft for P2P |
| Bulk Transfer (multiple customers) | Future enhancement |
| Automated Transfer Rules | Future enhancement |
| Email Notifications | Phase 2 |
| Mobile App Support | Phase 2 |
| Transfer Analytics Dashboard | Phase 2 |

---

## Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **P2P Transfer** | Partner to Partner Transfer — moving subscription billing from one CSP partner to another |
| **Source Partner** | The current billing partner who is transferring subscriptions away |
| **Target Partner** | The new billing partner who will receive the subscriptions |
| **CSP** | Cloud Solution Provider — Microsoft's partner program |
| **MPN ID** | Microsoft Partner Network ID |
| **GDAP** | Granular Delegated Admin Privileges |
| **MCA** | Microsoft Customer Agreement |

### B. Transfer Status State Machine

```
                    ┌───────────────┐
                    │    Created    │
                    │   (Pending)   │
                    └───────┬───────┘
                            │
            ┌───────────────┼───────────────┬───────────────┐
            ▼               ▼               ▼               ▼
    ┌───────────────┐ ┌───────────┐ ┌───────────────┐ ┌───────────────┐
    │   Accepted    │ │  Rejected │ │   Cancelled   │ │    Expired    │
    │               │ │   (End)   │ │     (End)     │ │     (End)     │
    └───────┬───────┘ └───────────┘ └───────────────┘ └───────────────┘
            │
            ▼
    ┌───────────────┐
    │  In Progress  │
    │               │
    └───────┬───────┘
            │
            ├───────────────┐
            ▼               ▼
    ┌───────────────┐ ┌───────────────┐
    │   Completed   │ │    Failed     │
    │     (End)     │ │     (End)     │
    └───────────────┘ └───────────────┘
```

### C. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 12, 2026 | Neil Bolton | Initial draft |

---

**End of Document**

