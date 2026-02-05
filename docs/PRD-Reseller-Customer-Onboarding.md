# Product Requirements Document
## Reseller: Customer Onboarding

| Document Info | |
|---------------|---|
| **Product Area** | Microsoft Marketplace Operations |
| **Feature** | Reseller Customer Onboarding |
| **Author** | Neil Bolton |
| **Created** | January 16, 2026 |
| **Last Updated** | February 5, 2026 |
| **Status** | ✅ Implemented (Full Partner Center Integration) |
| **Version** | 2.2 |

---

## Executive Summary

Reseller Customer Onboarding provides an Operations workflow for Microsoft Indirect Resellers to **collect onboarding details**, **generate a branded onboarding email** with required Microsoft links, and **track customer approval status**. 

### v2.2 Updates (February 2026)

Major improvements to the GDAP flow and email formatting:

- **GDAP Role Templates**: Select from pre-defined role templates (e.g., AppDirect Marketplace, Helpdesk Only)
- **GDAP Duration**: Configurable duration from 30 days to 730 days (default: max)
- **Action Checklist Email Format**: New email design with clear "Action 1 of 2" / "Action 2 of 2" format
- **Linked Tenant Detection**: Warning when company already has a linked tenant
- **Smart RRR URLs**: Indirect Reseller URLs include reseller tenant ID
- **GDAP Invitation Links**: Creates GDAP request with roles, returns unique approval URL

### Mini-features (bulleted)

- **Yes/No question**: "Does this customer have an existing Marketplace Company?"
- **Contact auto-fill**: Selecting existing company fills Contact Name and Email from Company data
- **Linked tenant warning**: Orange alert if company already has Microsoft tenant linked
- **GDAP Role Template selector**: Choose from pre-defined role combinations
- **GDAP Duration selector**: 30, 90, 180, 365, or 730 days
- **Action Checklist email**: Modern email format with prominent CTA buttons
- **Real GDAP creation**: Creates GDAP request via Graph API, returns unique approval URL
- **Indirect Reseller RRR**: Uses reseller's tenant ID in RRR URL format

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
10. [Partner Center Integration](#10-partner-center-integration)
11. [Future Enhancements](#11-future-enhancements)

---

## 2. Problem Statement

### 2.1 Current State (v2.1 Issues)

| Issue | Impact |
|-------|--------|
| No GDAP role selection | Agents couldn't specify which admin roles to request |
| Fixed GDAP duration | No flexibility in relationship length |
| Wall-of-text email | Low readability, customers missed action items |
| No linked tenant detection | Agents might send unnecessary RRR/GDAP to already-linked companies |

### 2.2 Desired State (v2.2)

- Select GDAP role template based on customer needs
- Choose appropriate GDAP duration
- Professional, action-oriented email format
- Clear warning when tenant is already linked

---

## 3. Goals & Success Metrics

| Goal | Description | v2.2 Status |
|------|-------------|-------------|
| **G1** | Reduce time to send onboarding requests | ✅ Live preview + auto-fill |
| **G2** | Ensure all required links are included every time | ✅ Template enforces RRR + GDAP links |
| **G3** | Provide status visibility for all customer approvals | ✅ Approvals table with status badges |
| **G4** | Use correct data source for existing customers | ✅ Uses Marketplace Companies |
| **G5** | Allow GDAP role customization | ✅ Role template selector |
| **G6** | Improve email readability | ✅ Action Checklist format |

---

## 4. User Personas

### 4.1 Sales Agent (Primary)

| Attribute | Description |
|-----------|-------------|
| **Role** | Onboards new customers for Microsoft Indirect Reseller |
| **Pain Points** | Slow process, unclear email content, wrong customer list |
| **Goals** | Quickly send professional onboarding email with appropriate roles |
| **Key Tasks** | Fill customer details → Select GDAP roles → Review email → Send |

### 4.2 Marketplace Operations Manager

| Attribute | Description |
|-----------|-------------|
| **Role** | Manages reseller onboarding operations |
| **Pain Points** | Inconsistent GDAP permissions, lack of visibility |
| **Goals** | Standardize role templates, track onboarding status |

---

## 5. Functional Requirements

### 5.1 Two-Column Layout

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| RCO-1.1 | Display form on left, email preview on right | Must Have | ✅ |
| RCO-1.2 | Email preview expands to match form height | Should Have | ✅ |
| RCO-1.3 | Responsive: Stack columns on mobile | Should Have | ✅ |

### 5.2 Customer Details Form (Left Column)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| RCO-2.1 | Yes/No toggle: "Does this customer have an existing Marketplace Company?" | Must Have | ✅ |
| RCO-2.2 | If Yes: Show searchable company dropdown | Must Have | ✅ |
| RCO-2.3 | Company dropdown sources from **Marketplace Companies** | Must Have | ✅ |
| RCO-2.4 | Auto-fill Contact Name and Email when company selected | Must Have | ✅ |
| RCO-2.5 | Warning alert if company has linked tenant | Must Have | ✅ |
| RCO-2.6 | Capture Microsoft Domain (required) | Must Have | ✅ |
| RCO-2.7 | Capture Contact Name | Should Have | ✅ |
| RCO-2.8 | Capture Email Address (required) | Must Have | ✅ |
| RCO-2.9 | Capture CC email | Should Have | ✅ |
| RCO-2.10 | Select Indirect Reseller (required) | Must Have | ✅ |
| RCO-2.11 | Select GDAP Role Template | Must Have | ✅ |
| RCO-2.12 | Select GDAP Duration (default: 730 days) | Must Have | ✅ |

### 5.3 Live Email Preview (Right Column)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| RCO-3.1 | Show email header (To, Subject) | Must Have | ✅ |
| RCO-3.2 | Action Checklist email format | Must Have | ✅ |
| RCO-3.3 | Update preview in real-time as form changes | Must Have | ✅ |
| RCO-3.4 | Include RRR approval link (with reseller tenant ID for indirect) | Must Have | ✅ |
| RCO-3.5 | Include GDAP approval link (unique URL with roles) | Must Have | ✅ |
| RCO-3.6 | Show requested roles and duration in email | Must Have | ✅ |
| RCO-3.7 | "Edit" button enables WYSIWYG editing | Must Have | ✅ |
| RCO-3.8 | "Copy to Clipboard" button copies email text | Must Have | ✅ |
| RCO-3.9 | "Send Email" creates GDAP then opens mailto | Must Have | ✅ |

### 5.4 GDAP Role Templates

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| RCO-5.1 | Dropdown with pre-defined role templates | Must Have | ✅ |
| RCO-5.2 | Show template description and roles when selected | Must Have | ✅ |
| RCO-5.3 | Templates shared with GDAP: Management feature | Must Have | ✅ |
| RCO-5.4 | "Default GDAP" template hidden (only for new tenant creation) | Must Have | ✅ |

### 5.5 Current Approvals Table

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| RCO-4.1 | Show list of customer approvals | Must Have | ✅ |
| RCO-4.2 | Display: Client, Domain, Step, Status | Must Have | ✅ |
| RCO-4.3 | Status badges with color coding | Must Have | ✅ |
| RCO-4.4 | Resend Email action per row | Must Have | ✅ |

---

## 6. User Experience Design

### 6.1 Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Companies / Microsoft / Reseller: Customer Onboarding             │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ✓ PARTNER CENTER CONNECTED                                                     │
├───────────────────────────────────┬─────────────────────────────────────────────┤
│                                   │                                             │
│  📝 CUSTOMER DETAILS              │  📧 EMAIL PREVIEW                           │
│                                   │                                             │
│  Does this customer have an       │  To: john@contoso.com                       │
│  existing Marketplace Company?    │  Subject: Action required: Approve RRR...  │
│  [ No ] [ Yes ]                   │  ─────────────────────────                  │
│                                   │                                             │
│  [If Yes: Company Search]         │  Hello John,                                │
│  [⚠️ Warning if linked]          │                                             │
│                                   │  You have 2 quick actions...               │
│  ─────────────────                │                                             │
│  Microsoft Tenant Details         │  ☐ Action 1 of 2                            │
│  • Microsoft Domain *             │  Approve Reseller Relationship              │
│  • Contact Name                   │  [▶ APPROVE RELATIONSHIP]                   │
│  • Email Address *                │                                             │
│  • CC                             │  ☐ Action 2 of 2                            │
│                                   │  Approve Admin Access (GDAP)                │
│  ─────────────────                │  Valid for 730 days. You can revoke anytime.│
│  Indirect Reseller *              │  Permissions: Cloud App Admin, License...   │
│  [ITCloud.ca             ▾]       │  [▶ APPROVE ADMIN ACCESS]                   │
│                                   │                                             │
│  ─────────────────                │  — The ITCloud.ca Team                      │
│  GDAP Role Template               │  ─────────────────────────                  │
│  [AppDirect Marketplace   ▾]      │  [Edit] [Copy] [Send Email]                 │
│  └ Cloud App Admin, License...    │                                             │
│                                   │                                             │
│  GDAP Duration                    │                                             │
│  [730 days (2 years) - Max ▾]     │                                             │
│                                   │                                             │
├───────────────────────────────────┴─────────────────────────────────────────────┤
│  📋 CURRENT APPROVALS                                                           │
│  ┌──────────────┬─────────────────────────┬────────────────┬──────────┬───────┐ │
│  │ Client       │ Domain                  │ Step           │ Status   │ Actions│ │
│  └──────────────┴─────────────────────────┴────────────────┴──────────┴───────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Email Format (Action Checklist)

```
Hello John,

You have 2 quick actions to complete your Microsoft 365 
setup with ITCloud.ca:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐  ACTION 1 of 2
   
   Approve Reseller Relationship
   ─────────────────────────────
   
   This makes ITCloud.ca your official Microsoft partner.
   Takes about 30 seconds.
   
   ┌──────────────────────────────────┐
   │   ▶  APPROVE RELATIONSHIP        │
   └──────────────────────────────────┘


☐  ACTION 2 of 2
   
   Approve Admin Access (GDAP)
   ───────────────────────────
   
   This lets ITCloud.ca help manage your Microsoft 365.
   Valid for 2 years. You can revoke anytime.
   
   Permissions requested:
   • Cloud Application Administrator
   • License Administrator
   • User Administrator
   • Directory Readers
   
   ┌──────────────────────────────────┐
   │   ▶  APPROVE ADMIN ACCESS        │
   └──────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? Just hit reply — we're here to help!

— The ITCloud.ca Team
```

### 6.3 User Flow

1. **Navigate** to Operations → Microsoft → Reseller: Customer Onboarding
2. **Answer**: "Does this customer have an existing Marketplace Company?" (No/Yes)
3. **If Yes**: Search and select company (auto-fills Contact Name + Email)
4. **If Warning**: Company has linked tenant → cannot proceed (use GDAP Management instead)
5. **Fill**: Microsoft Domain, optional CC email
6. **Select**: Indirect Reseller
7. **Select**: GDAP Role Template and Duration
8. **Review**: Live email preview with roles and CTAs
9. **Optional**: Click "Edit" to customize email content
10. **Send**: Click "Send Email" → Creates GDAP → Opens mailto with unique URL

---

## 7. Data Requirements

### 7.1 Marketplace Company Data

| Field | Type | Used For |
|-------|------|----------|
| id | String | Selection key |
| name | String | Display in dropdown |
| contactName | String | Auto-fill Contact Name |
| email | String | Auto-fill Email Address |
| hasTenantLinked | Boolean | Show warning if true |
| linkedDomain | String | Display linked domain in warning |

### 7.2 GDAP Role Templates

| Template | Roles |
|----------|-------|
| AppDirect Marketplace | Cloud App Admin, License Admin, User Admin, Directory Readers |
| Teams Administration | Teams Admin, User Admin |
| User Management | User Admin, Helpdesk Admin |
| Helpdesk Only | Helpdesk Admin |
| Security Operations | Security Admin, Security Reader |
| Exchange Administration | Exchange Admin |
| Intune Device Management | Intune Admin |

### 7.3 GDAP Duration Options

| Value | Label |
|-------|-------|
| P30D | 30 days |
| P90D | 90 days |
| P180D | 180 days (6 months) |
| P365D | 365 days (1 year) |
| P730D | 730 days (2 years) - Maximum |

---

## 8. Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Two-column layout | ✅ Complete | Form left, preview right, flex height |
| Yes/No company question | ✅ Complete | Replaces "New/Existing" toggle |
| Company auto-fill | ✅ Complete | Contact Name + Email from Company |
| Linked tenant warning | ✅ Complete | Orange alert with guidance |
| GDAP Role Template selector | ✅ Complete | Shared with GDAP Management |
| GDAP Duration selector | ✅ Complete | Default 730 days |
| Action Checklist email | ✅ Complete | Modern format with CTAs |
| Indirect Reseller RRR URL | ✅ Complete | Includes reseller tenant ID |
| GDAP invitation creation | ✅ Complete | Creates via Graph API |
| Live email preview | ✅ Complete | Real-time updates |
| Send Email flow | ✅ Complete | Creates GDAP → Opens mailto |

---

## 9. Changelog

### v2.2 (February 5, 2026)

**GDAP Role Templates & Email Redesign**

- ✨ **New**: GDAP Role Template selector (shared with GDAP: Management)
- ✨ **New**: GDAP Duration selector (30d to 730d, default max)
- ✨ **New**: Action Checklist email format with prominent CTAs
- ✨ **New**: Yes/No question for existing Marketplace Company
- ✨ **New**: Auto-fill Contact Name from Company data
- ✨ **New**: Linked tenant detection with warning alert
- ✨ **New**: Indirect Reseller RRR URLs include reseller tenant ID
- ✨ **New**: GDAP invitation created via Graph API (no customer tenant ID needed)
- ✨ **New**: Unique GDAP approval URL with specific roles
- 🔧 **Fixed**: Form disabled when company has linked tenant
- 🔧 **Fixed**: Email preview updates when GDAP template/duration changes

### v2.1 (February 5, 2026)

**Real Partner Center Integration**

- ✨ Real MPN ID fetched from Partner Center API
- ✨ RRR links use actual partner MPN ID
- ✨ Partner Center connection status indicator

### v2.0 (February 5, 2026)

**Major UX Overhaul - Flow B Implementation**

- 🔧 Fixed: Company selector now pulls from Marketplace Companies
- ✨ Two-column layout with live email preview
- ✨ Real-time preview updates
- ✨ "Copy to Clipboard" and "Send Email" buttons

### v1.0 (January 20, 2026)

- Initial implementation

---

## 10. Partner Center Integration

### 10.1 RRR Link Generation

**For Direct Partners:**
```
https://admin.microsoft.com/Adminportal/Home#/partners/invitation/reseller
  ?partnerId={PARTNER_MPN_ID}
  &msppId=0
  &DAP=true
```

**For Indirect Resellers:**
```
https://admin.microsoft.com/Adminportal/Home#/partners/invitation/indirectReseller
  ?partnerId={PARTNER_MPN_ID}
  &indirectCSPId={RESELLER_TENANT_ID}
```

### 10.2 GDAP Relationship Creation

GDAP relationships are created via Microsoft Graph API **without** requiring the customer's tenant ID. Microsoft generates an invitation URL that any customer can use to approve.

**API Endpoint**: `POST /api/partner-center/create-gdap-request`

**Request (no customer tenant ID):**
```json
{
  "customerTenantId": "",
  "displayName": "ITCloud - AppDirect Marketplace - contoso.com",
  "duration": "P730D",
  "roles": [
    "158c047a-c907-4556-b7ef-446551a6b5f7",
    "4d6ac14f-3453-41d0-bef9-a3e0c569773a",
    "fe930be7-5e62-47db-91af-98c3a49a38b1",
    "88d8e3e3-8f55-4a1e-953a-9b9898b8876b"
  ],
  "autoExtendDuration": "P180D"
}
```

**Response:**
```json
{
  "ok": true,
  "relationship": {
    "id": "relationship-guid",
    "displayName": "ITCloud - AppDirect Marketplace - contoso.com",
    "status": "Created",
    "customerApprovalUrl": "https://admin.microsoft.com/AdminPortal/Home#/partners/granularadminrelationships/{id}"
  }
}
```

### 10.3 Indirect Resellers API

**API Endpoint**: `GET /api/partner-center/indirect-resellers`

Returns list of indirect resellers with their tenant IDs for RRR URL generation:

```json
{
  "ok": true,
  "resellers": [
    {
      "id": "reseller-guid",
      "name": "ITCloud.ca",
      "mpnId": "4668400",
      "tenantId": "tenant-guid",
      "state": "Active"
    }
  ]
}
```

---

## 11. Future Enhancements

| Enhancement | Priority | Description |
|-------------|----------|-------------|
| Email send via API | High | Send directly without mailto |
| Approval status sync | Medium | Pull real status from Partner Center |
| Custom email templates | Medium | Multiple branded templates |
| Bulk onboarding | Low | Onboard multiple customers at once |
| Role-based access controls | Low | Restrict to authorized users |
