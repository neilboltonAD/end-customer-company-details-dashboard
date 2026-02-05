# Product Requirements Document
## Reseller: Customer Onboarding

| Document Info | |
|---------------|---|
| **Product Area** | Microsoft Marketplace Operations |
| **Feature** | Reseller Customer Onboarding |
| **Author** | Neil Bolton |
| **Created** | January 16, 2026 |
| **Last Updated** | February 5, 2026 |
| **Status** | ✅ Implemented (Flow B + Partner Center Integration) |
| **Version** | 2.1 |

---

## Executive Summary

Reseller Customer Onboarding provides an Operations workflow for Microsoft Indirect Resellers to **collect onboarding details**, **generate a branded onboarding email (WYSIWYG)** with required Microsoft links, and **track customer approval status**. 

### v2.0 Updates (February 2026)

The feature has been redesigned with a **two-column layout** featuring a **live email preview** that updates in real-time as the sales agent fills in customer details. Key improvements include:

- **Fixed data source**: Existing company selection now pulls from **Marketplace Companies** (Operations → Companies) instead of Partner Center tenants
- **Live preview**: Email content updates immediately as form fields are filled
- **Streamlined workflow**: No modal required—everything visible on one page
- **Clear actions**: Explicit "Copy to Clipboard" and "Send Email" buttons

### Mini-features (bulleted)

- **Two-column layout**: Form on left, live email preview on right
- **Client type toggle**: New Customer vs Existing Customer (segmented control)
- **Company search**: When "Existing Customer" selected, searchable dropdown of Marketplace Companies
- **Auto-fill**: Selecting an existing company auto-populates domain and email fields
- **Live email preview**: Updates in real-time as form fields change
- **Editable template**: Click "Edit" to modify the email content with WYSIWYG editor
- **Required links**: Template always includes RRR + GDAP approval URLs
- **Action buttons**: "Copy to Clipboard" and "Send Email" (opens mailto)
- **Approvals dashboard**: Current approvals table with status badges
- **Resend reminder**: Resend action with confirmation modal and toast notification

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [User Personas](#4-user-personas)
5. [Functional Requirements](#5-functional-requirements)
6. [User Experience Design](#6-user-experience-design)
7. [Data Requirements](#7-data-requirements)
8. [Implementation Status](#8-implementation-status)
9. [Changelog](#9-changelog)
10. [Future Enhancements](#10-future-enhancements)

---

## 2. Problem Statement

### 2.1 Current State (v1.0 Issues)

The original implementation had several friction points:

| Issue | Impact |
|-------|--------|
| Company selector pulled from Partner Center tenants | Agents couldn't find existing Marketplace customers |
| Company selection was inside a modal | Disjointed flow, required extra clicks |
| No live preview | Agent couldn't see email until clicking "Create" |
| "Submit" button opened preview window | Confusing—unclear if email was actually sent |

### 2.2 Desired State (v2.0)

A streamlined, single-page onboarding experience where:

- Sales agents can quickly onboard new or existing customers
- The email preview updates live as they fill in details
- Actions are clear and explicit (Copy, Send)
- Existing companies are sourced from the Marketplace, not Partner Center

---

## 3. Goals & Success Metrics

| Goal | Description | v2.0 Status |
|------|-------------|-------------|
| **G1** | Reduce time to send onboarding requests | ✅ Live preview eliminates modal step |
| **G2** | Ensure all required links are included every time | ✅ Template enforces RRR + GDAP links |
| **G3** | Provide status visibility for all customer approvals | ✅ Approvals table with status badges |
| **G4** | Use correct data source for existing customers | ✅ Fixed: Now uses Marketplace Companies |

---

## 4. User Personas

### 4.1 Sales Agent (Primary)

| Attribute | Description |
|-----------|-------------|
| **Role** | Onboards new customers for Microsoft Indirect Reseller |
| **Pain Points** | Slow process, unclear email content, wrong customer list |
| **Goals** | Quickly send professional onboarding email with all required info |
| **Key Tasks** | Fill customer details → Review email → Send to customer |

### 4.2 Marketplace Operations Manager

| Attribute | Description |
|-----------|-------------|
| **Role** | Manages reseller onboarding operations |
| **Pain Points** | Inconsistent process, lack of visibility |
| **Goals** | Track onboarding status, ensure compliance |

---

## 5. Functional Requirements

### 5.1 Two-Column Layout

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| RCO-1.1 | Display form on left, email preview on right | Must Have | ✅ |
| RCO-1.2 | Responsive: Stack columns on mobile | Should Have | ✅ |

### 5.2 Customer Details Form (Left Column)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| RCO-2.1 | Client type toggle: New Customer / Existing Customer | Must Have | ✅ |
| RCO-2.2 | If Existing: Show searchable company dropdown | Must Have | ✅ |
| RCO-2.3 | Company dropdown sources from **Marketplace Companies** | Must Have | ✅ |
| RCO-2.4 | Auto-fill domain and email when company selected | Should Have | ✅ |
| RCO-2.5 | Capture Default Domain (required) | Must Have | ✅ |
| RCO-2.6 | Capture Contact Name | Should Have | ✅ |
| RCO-2.7 | Capture Email Address (required) | Must Have | ✅ |
| RCO-2.8 | Capture CC email | Should Have | ✅ |
| RCO-2.9 | Select Indirect Reseller (required) | Must Have | ✅ |

### 5.3 Live Email Preview (Right Column)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| RCO-3.1 | Show email header (To, CC, Subject) | Must Have | ✅ |
| RCO-3.2 | Show email body with template content | Must Have | ✅ |
| RCO-3.3 | Update preview in real-time as form changes | Must Have | ✅ |
| RCO-3.4 | Include Reseller Relationship Request (RRR) URL | Must Have | ✅ |
| RCO-3.5 | Include GDAP Request URL | Must Have | ✅ |
| RCO-3.6 | "Edit" button enables WYSIWYG editing | Must Have | ✅ |
| RCO-3.7 | "Copy to Clipboard" button copies email HTML | Must Have | ✅ |
| RCO-3.8 | "Send Email" button opens mailto with content | Must Have | ✅ |

### 5.4 Current Approvals Table

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| RCO-4.1 | Show list of customer approvals | Must Have | ✅ |
| RCO-4.2 | Display: Client, Domain, Step, Status | Must Have | ✅ |
| RCO-4.3 | Status badges with color coding | Must Have | ✅ |
| RCO-4.4 | Resend Email action per row | Must Have | ✅ |
| RCO-4.5 | Confirmation modal before resend | Must Have | ✅ |
| RCO-4.6 | Success toast after resend | Should Have | ✅ |

---

## 6. User Experience Design

### 6.1 Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Companies / Microsoft / Reseller: Customer Onboarding             │
├─────────────────────────────────────────────────────────────────────────────────┤
│  Header Card: Title + Description                                               │
├───────────────────────────────────┬─────────────────────────────────────────────┤
│                                   │                                             │
│  📝 CUSTOMER DETAILS              │  📧 EMAIL PREVIEW                           │
│                                   │                                             │
│  Client                           │  To: [email]                                │
│  [● New] [○ Existing]             │  Subject: Action required...                │
│                                   │  ─────────────────────────                  │
│  [If Existing: Company Search]    │                                             │
│                                   │  Hello [Name],                              │
│  ─────────────────                │                                             │
│  Microsoft Tenant Details         │  [Reseller] is requesting to become         │
│  • Default Domain *               │  your Microsoft 365 provider...             │
│  • Contact Name                   │                                             │
│  • Email Address *                │  Step 1: Approve RRR → [Link]               │
│  • CC                             │  Step 2: Approve GDAP → [Link]              │
│                                   │                                             │
│  ─────────────────                │  Best regards,                              │
│  Indirect Reseller *              │  [Reseller] Team                            │
│  [Dropdown]                       │  ─────────────────────────                  │
│                                   │  [Edit] [Copy] [Send Email]                 │
│                                   │                                             │
├───────────────────────────────────┴─────────────────────────────────────────────┤
│  📋 CURRENT APPROVALS                                                           │
│  ┌──────────────┬─────────────────────────┬────────────────┬──────────┬───────┐ │
│  │ Client       │ Domain                  │ Step           │ Status   │ Actions│ │
│  ├──────────────┼─────────────────────────┼────────────────┼──────────┼───────┤ │
│  │ IT CLOUD...  │ itcloudacademie.ca      │ RRR Sent       │ Pending  │ 📧    │ │
│  │ Contoso Ltd  │ contoso.onmicrosoft.com │ GDAP Requested │ Pending  │ 📧    │ │
│  │ Fabrikam Inc │ fabrikam.onmicrosoft.com│ Approved       │ Ready ✓  │ 📧    │ │
│  └──────────────┴─────────────────────────┴────────────────┴──────────┴───────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 User Flow

1. **Navigate** to Operations → Microsoft → Reseller: Customer Onboarding
2. **Select client type**: New Customer or Existing Customer
3. **If Existing**: Search and select from Marketplace Companies (auto-fills domain/email)
4. **Fill remaining fields**: Contact name, email (if not auto-filled), CC, reseller
5. **Review live preview**: See exactly what the customer will receive
6. **Optional**: Click "Edit" to customize email content
7. **Send**: Click "Send Email" (opens mail client) or "Copy to Clipboard"
8. **Track**: Monitor status in Current Approvals table

---

## 7. Data Requirements

### 7.1 Form Data

| Field | Type | Required | Source |
|-------|------|----------|--------|
| Client Type | Enum | Yes | User selection |
| Company | Reference | If Existing | Marketplace Companies |
| Default Domain | String | Yes | User input / Auto-fill |
| Contact Name | String | No | User input |
| Email Address | Email | Yes | User input / Auto-fill |
| CC | Email | No | User input |
| Indirect Reseller | Reference | Yes | Reseller list |

### 7.2 Email Template

| Component | Content |
|-----------|---------|
| Greeting | "Hello [Contact Name]," |
| Body | Reseller relationship request message |
| Step 1 | RRR approval link |
| Step 2 | GDAP approval link |
| Closing | "Best regards, [Reseller] Team" |

### 7.3 Approvals Data (Demo)

| Field | Type |
|-------|------|
| Customer Name | String |
| Default Domain | String |
| Step | Enum (RRR Sent, GDAP Requested, Approved) |
| Status | Enum (Pending, Ready to Order) |

---

## 8. Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Two-column layout | ✅ Complete | Form left, preview right |
| Client type toggle | ✅ Complete | Segmented control |
| Company search (Marketplace) | ✅ Complete | Fixed data source |
| Auto-fill on selection | ✅ Complete | Domain + email |
| Live email preview | ✅ Complete | Real-time updates |
| WYSIWYG editor | ✅ Complete | TipTap integration |
| Copy to Clipboard | ✅ Complete | With success toast |
| Send Email (mailto) | ✅ Complete | Opens mail client |
| Current Approvals table | ✅ Complete | Demo data |
| Resend action | ✅ Complete | With confirmation |

---

## 9. Changelog

### v2.1 (February 5, 2026)

**Real Partner Center Integration**

- ✨ **New**: Real MPN ID fetched from Partner Center API (`/api/partner-center/profile`)
- ✨ **New**: RRR links now use actual partner MPN ID instead of placeholder
- ✨ **New**: GDAP relationship creation API (`/api/partner-center/create-gdap-request`)
- ✨ **New**: Partner Center connection status indicator in header
- ✨ **New**: Warning alert when Partner Center is not connected
- ✨ **New**: Common GDAP role IDs exported for easy reference

### v2.0 (February 5, 2026)

**Major UX Overhaul - Flow B Implementation**

- 🔧 **Fixed**: Company selector now pulls from Marketplace Companies instead of Partner Center tenants
- ✨ **New**: Two-column layout with live email preview
- ✨ **New**: Real-time preview updates as form fields change
- ✨ **New**: Auto-fill domain and email when existing company selected
- ✨ **New**: "Copy to Clipboard" button with success feedback
- ✨ **New**: "Send Email" button opens mailto link
- 🗑️ **Removed**: Modal-based email generation (replaced with inline preview)
- 🗑️ **Removed**: Confusing "Submit" button (replaced with explicit actions)

### v1.0 (January 20, 2026)

- Initial implementation with modal-based email generation
- Form fields: domain, name, email, CC, company type, reseller
- Current approvals table with demo data

---

## 10. Partner Center Integration

### 10.1 RRR Link Generation

The Reseller Relationship Request (RRR) URL is now generated using the real MPN ID from Partner Center:

```
https://admin.microsoft.com/Adminportal/Home#/partners/invitation/reseller
  ?partnerId={MPN_ID}
  &msppId=0
  &DAP=true
```

**API Endpoint**: `GET /api/partner-center/profile`

Returns:
```json
{
  "ok": true,
  "profile": {
    "mpnId": "1234567",
    "partnerName": "ITCloud.ca",
    "companyName": "ITCloud Inc.",
    "country": "CA",
    "rrrUrl": "https://admin.microsoft.com/Adminportal/Home#/partners/invitation/reseller?partnerId=1234567&msppId=0&DAP=true"
  }
}
```

### 10.2 GDAP Relationship Creation

GDAP relationships can be created via the Microsoft Graph API:

**API Endpoint**: `POST /api/partner-center/create-gdap-request`

Request:
```json
{
  "customerTenantId": "customer-tenant-guid",
  "displayName": "ITCloud GDAP - Contoso",
  "duration": "P730D",
  "roles": ["729827e3-9c14-49f7-bb1b-9608f156bbb8"],
  "autoExtendDuration": "P180D"
}
```

Returns:
```json
{
  "ok": true,
  "relationship": {
    "id": "relationship-guid",
    "displayName": "ITCloud GDAP - Contoso",
    "status": "Created",
    "customerApprovalUrl": "https://admin.microsoft.com/AdminPortal/Home#/partners/granularadminrelationships/{id}"
  }
}
```

### 10.3 Common GDAP Roles

| Role | ID | Use Case |
|------|-----|----------|
| Helpdesk Administrator | `729827e3-9c14-49f7-bb1b-9608f156bbb8` | Password resets, user support |
| License Administrator | `4d6ac14f-3453-41d0-bef9-a3e0c569773a` | Assign/remove licenses |
| User Administrator | `fe930be7-5e62-47db-91af-98c3a49a38b1` | Create/manage users |
| Global Reader | `f2ef992c-3afb-46b9-b7cf-a126ee74c451` | Read-only access |

---

## 11. Future Enhancements

| Enhancement | Priority | Description |
|-------------|----------|-------------|
| ~~Real Microsoft Partner Center integration~~ | ~~High~~ | ✅ Implemented |
| Email send via API | High | Send directly without mailto |
| Approval status sync | Medium | Pull real status from Partner Center |
| Email templates library | Medium | Multiple branded templates |
| GDAP role template presets | Medium | One-click common role combinations |
| Role-based access controls | Low | Restrict to authorized users |
| Bulk onboarding | Low | Onboard multiple customers at once |
