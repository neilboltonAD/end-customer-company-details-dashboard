# Product Requirements Document
## Reseller: Customer Onboarding

| Document Info | |
|---------------|---|
| **Product Area** | Microsoft Marketplace Operations |
| **Feature** | Reseller Customer Onboarding |
| **Author** | Neil Bolton |
| **Created** | January 16, 2026 |
| **Last Updated** | January 16, 2026 |
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

---

## 1. Executive Summary

### 1.1 Overview

The **Reseller: Customer Onboarding** feature enables Microsoft **Indirect Resellers** to onboard a new customer directly from the AppDirect Operations interface. The workflow collects tenant details, sends a reseller relationship request (RRR) email with GDAP authorization steps, and tracks approval status.

### 1.2 Value Proposition

| Stakeholder | Value |
|-------------|-------|
| **Marketplace Managers** | Streamlined onboarding from a single dashboard |
| **Resellers** | Clear, guided steps to establish customer relationships |
| **End Customers** | Consistent onboarding email with required links |
| **Operations Teams** | Visibility into pending approvals and status tracking |

---

## 2. Problem Statement

### 2.1 Current State

Indirect Resellers often manage customer onboarding across multiple tools, emails, and manual trackers. This creates delays, missed steps, and inconsistent email content.

### 2.2 Desired State

A single onboarding page inside Operations that:

- Collects tenant details for new or existing customers
- Generates an editable email template with required links
- Tracks onboarding status in a visible approvals table

---

## 3. Goals & Success Metrics

| Goal | Description |
|------|-------------|
| **G1** | Reduce time to send onboarding requests |
| **G2** | Ensure all required links are included every time |
| **G3** | Provide status visibility for all customer approvals |

---

## 4. User Personas

### 4.1 Marketplace Operations Manager

| Attribute | Description |
|-----------|-------------|
| **Role** | Manages reseller onboarding operations |
| **Pain Points** | Inconsistent process, lack of visibility |
| **Goals** | Faster onboarding, fewer missed steps |

---

## 5. Functional Requirements

### 5.1 Onboarding Form

| ID | Requirement | Priority |
|----|-------------|----------|
| RCO-1.1 | Capture Default Domain | Must Have |
| RCO-1.2 | Capture Name | Must Have |
| RCO-1.3 | Capture Email Address | Must Have |
| RCO-1.4 | Capture CC | Should Have |
| RCO-1.5 | Select New Company or Existing Company | Must Have |
| RCO-1.6 | Choose an Indirect Reseller (default None) | Must Have |
| RCO-1.7 | "Create" button opens the email modal | Must Have |

### 5.2 Email Template Modal

| ID | Requirement | Priority |
|----|-------------|----------|
| RCO-2.1 | Show editable email body in a WYSIWYG HTML editor | Must Have |
| RCO-2.2 | Include ITCloud.ca branding | Must Have |
| RCO-2.3 | Always include the Reseller Relationship Request URL | Must Have |
| RCO-2.4 | Always include the GDAP Request URL | Must Have |
| RCO-2.5 | If Existing Company is selected, allow selection in the modal | Must Have |

### 5.3 Current Approvals

| ID | Requirement | Priority |
|----|-------------|----------|
| RCO-3.1 | Show a list of customer approvals | Must Have |
| RCO-3.2 | Show status labels (e.g., Pending: Awaiting confirmation of RRR, Ready to Order) | Must Have |
| RCO-3.3 | Use demo data for initial implementation | Must Have |

---

## 6. User Experience Design

- Page lives under **Operations → Microsoft → Reseller: Customer Onboarding**.
- Form appears at the top of the page with a concise, two-column layout.
- The email modal opens on Create and includes an editable template.
- Approvals table appears below as a status dashboard.

---

## 7. Data Requirements

- Tenant metadata: default domain, email, CC, company type.
- Email template body and required URLs.
- Approval status list with timestamps and step labels.

---

## 8. Implementation Status

| Feature | Status | Notes |
|---------|--------|------|
| Onboarding form | 🚧 In Progress | Basic layout in main app |
| Email template modal | 🚧 In Progress | Editable template |
| Current approvals | 🚧 In Progress | Demo data table |

---

## 9. Future Enhancements

- Integrate with real Microsoft Partner Center APIs
- Automated sending and tracking of onboarding emails
- Role-based access controls
