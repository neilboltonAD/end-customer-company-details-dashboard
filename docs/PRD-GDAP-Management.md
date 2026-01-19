# Product Requirements Document
## GDAP: Management (Marketplace-wide)

| Document Info | |
|---|---|
| **Product Area** | Microsoft Marketplace Operations |
| **Feature** | GDAP: Management |
| **Author** | Neil Bolton |
| **Created** | January 19, 2026 |
| **Last Updated** | January 19, 2026 |
| **Status** | 🧭 Planned |
| **Version** | 1.0 |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Personas](#4-personas)
5. [Scope](#5-scope)
6. [User Experience](#6-user-experience)
7. [Functional Requirements](#7-functional-requirements)
8. [Data Model (POC)](#8-data-model-poc)
9. [Implementation Notes (POC)](#9-implementation-notes-poc)
10. [Future Enhancements](#10-future-enhancements)

---

## 1. Executive Summary

### 1.1 Overview

**GDAP: Management** is a marketplace-wide Operations tool that lets privileged users review and manage Microsoft **Granular Delegated Admin Privileges (GDAP)** relationships across **any company** in the marketplace.

This feature is the marketplace-wide equivalent of the company-specific GDAP management area currently accessible from **Company → Vendor Information** (for a single company).

### 1.2 Value Proposition

| Stakeholder | Value |
|---|---|
| **Marketplace Ops** | One place to search and manage GDAP across all customers |
| **Reseller Ops** | Rapid renewal/request workflow when GDAP is expiring |
| **Support** | Faster remediation for access issues by identifying missing/expired GDAP |

### 1.3 Reference

- Role selection guidance source: `https://learn.microsoft.com/en-us/partner-center/customers/gdap-least-privileged-roles-by-task`

---

## 2. Problem Statement

### 2.1 Current State

GDAP relationship review and actions are currently **company-scoped**, requiring users to:

- Find the company first
- Navigate into vendor information
- Manually check whether GDAP is expiring/expired across the fleet elsewhere

### 2.2 Desired State

A marketplace-wide dashboard that:

- Supports **searching for a company** to manage its GDAP relationships
- Surfaces **expiring soon / expired** relationships across all companies
- Allows creating **GDAP request templates** (role sets) like “Teams” so the same role selection can be reused consistently

---

## 3. Goals & Success Metrics

### 3.1 Goals

| Goal | Description |
|---|---|
| **G1** | Reduce time to find expiring/expired GDAP across marketplace |
| **G2** | Standardize GDAP requests via reusable templates |
| **G3** | Keep management actions consistent with the existing company-scoped UI |

### 3.2 Success Metrics (POC)

| Metric | Target |
|---|---|
| Time to locate expiring GDAP relationships | < 30s |
| Template re-use | At least 3 templates created in POC |
| UX parity with company-scoped page | “Feels the same” (qualitative) |

---

## 4. Personas

| Persona | Description |
|---|---|
| Marketplace Ops Manager | Manages Microsoft relationship + access at scale |
| Support / Tier-2 | Responds to access incidents requiring GDAP checks |

---

## 5. Scope

### 5.1 In Scope (POC)

- Marketplace-wide page under Operations → Microsoft → **Reseller: Customer Onboarding** → **GDAP: Management**
- Company search + select
- For selected company: view existing GDAP relationships, rename, sync, and create new relationship requests (demo actions)
- Cross-company “Expiring / Expired” card with drill-through list
- Create/manage GDAP request templates (role sets)

### 5.2 Out of Scope (POC)

- Real Partner Center API integration
- Real email sending
- Permission model / RBAC

---

## 6. User Experience

### 6.1 Layout (High level)

1. **Header**: “GDAP: Management” + (optional) “Selected Company: …”
2. **Company Search**: search input + results list; selecting a company sets the context for management actions
3. **Expiring & Expired GDAP**: top card(s) showing counts (expiring soon, expired) with drill-through
4. **GDAP Relationships (Selected Company)**: reuses the same visual patterns as the company-scoped page
5. **GDAP Request Templates**: list of templates + create/edit modal for role selection

### 6.2 Key Interactions

- Search → select company → relationships panel becomes enabled
- Expiring card → click row → navigates (or sets context) to the company + highlights relationship
- Create template → choose roles → save template → template can be selected when creating a new GDAP request

---

## 7. Functional Requirements

### 7.1 Navigation & Page

| ID | Requirement | Priority |
|---|---|---|
| GM-1.1 | Add a new entry **GDAP: Management** under **Reseller: Customer Onboarding** | Must Have |
| GM-1.2 | Page supports marketplace-wide usage | Must Have |

### 7.2 Company Search & Context

| ID | Requirement | Priority |
|---|---|---|
| GM-2.1 | User can search companies by name | Must Have |
| GM-2.2 | Selecting a company sets the context for management actions | Must Have |
| GM-2.3 | Selected company is visible (breadcrumb / chip / header) | Must Have |

### 7.3 Expiring / Expired Dashboard

| ID | Requirement | Priority |
|---|---|---|
| GM-3.1 | Show count of relationships expiring soon | Must Have |
| GM-3.2 | Show count of relationships expired | Must Have |
| GM-3.3 | Drill-through list shows company, relationship name/id, expiry date, status | Must Have |
| GM-3.4 | Clicking a drill-through row selects that company and opens the relationship panel | Should Have |
| GM-3.5 | Drill-through list provides actions: View, Renew, New request | Must Have |

### 7.4 Relationships Management (Selected Company)

| ID | Requirement | Priority |
|---|---|---|
| GM-4.1 | Show existing GDAP relationships | Must Have |
| GM-4.2 | Allow renaming a relationship | Should Have |
| GM-4.3 | Allow sync with Partner Center (demo action) | Should Have |
| GM-4.4 | Allow creating a new GDAP relationship request (demo) | Must Have |
| GM-4.5 | Status filter chips (All/Active/Pending/Expired) control the relationships list | Must Have |
| GM-4.6 | Expiring threshold selector (N days) controls expiring-soon calculations | Must Have |

### 7.5 GDAP Request Templates (Role Sets)

| ID | Requirement | Priority |
|---|---|---|
| GM-5.1 | User can create a template with a name (e.g., “Teams”) | Must Have |
| GM-5.2 | User can choose roles for a template based on Microsoft role guidance | Must Have |
| GM-5.3 | User can edit/delete templates | Should Have |
| GM-5.4 | When creating a new GDAP request, user can select a template to pre-fill roles | Must Have |
| GM-5.5 | Templates support a description and “recommended for” tags (e.g., Teams/Support) | Must Have |

---

## 8. Data Model (POC)

### 8.1 Entities

- **Company**: id, name, defaultDomain
- **GdapRelationship**: id, companyId, displayName, status, startDate, endDate, roles[], autoRenew
- **GdapTemplate**: id, name, description?, roles[]

### 8.2 Status Rules (POC)

- **Expiring Soon**: endDate within N days (default 30)
- **Expired**: endDate < today

---

## 9. Implementation Notes (POC)

- Use existing dummy data patterns already in the repo.
- Template role catalog can be a curated subset aligned with the Microsoft roles-by-task guidance.
- Link for guidance: `https://learn.microsoft.com/en-us/partner-center/customers/gdap-least-privileged-roles-by-task`
- Seed the UI with common templates:
  - **Default GDAP** (baseline operational coverage)
  - **AppDirect Marketplace** (Cloud application administrator, License administrator, User administrator, Directory readers)

---

## 10. Future Enhancements

- Real Partner Center read/sync/create flows
- Permissions: restrict actions by role (Marketplace Manager vs Support)
- Audit trail for rename/sync/request actions
- Bulk renew for expiring relationships
