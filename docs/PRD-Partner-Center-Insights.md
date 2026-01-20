# Product Requirements Document
## Partner Center Insights Extension

| Document Info | |
|---------------|---|
| **Product Area** | Microsoft Marketplace Operations |
| **Feature** | Partner Center Insights |
| **Author** | Neil Bolton |
| **Created** | January 13, 2026 |
| **Last Updated** | January 20, 2026 |
| **Status** | ✅ Implemented (AppDirect Extension Demo) |
| **Version** | 1.0 |

---

## Executive Summary

Partner Center Insights provides a consolidated view of Microsoft customer usage, seats, and revenue trends, with drilldowns into subscription-level metrics and Office usage. The current implementation is a demo UI designed for AppDirect extension deployment, with clear pathways to wire up Partner Center/Graph APIs.

### Mini-features (bulleted)

- **Overview dashboard**: key totals (seats, assigned, active users, revenue) with trends.
- **Subscriptions panel**: per-subscription metrics, health indicators, and nicknames.
- **All subscriptions modal**: grouped summaries and risk indicators.
- **Office usage analytics**: service-level adoption breakdown.
- **Revenue analytics**: product-level breakdown and totals.
- **Recommendations**: contextual insights based on utilization.

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

The **Partner Center Insights Extension** provides Marketplace Managers and Resellers with comprehensive analytics from Microsoft Partner Center directly within the AppDirect platform. This extension surfaces critical metrics about Microsoft 365 subscriptions, usage patterns, and revenue—enabling data-driven decisions without context-switching to Partner Center.

### 1.2 Value Proposition

| Stakeholder | Value |
|-------------|-------|
| **Marketplace Managers** | Single pane of glass for Microsoft subscription analytics and revenue tracking |
| **Resellers** | Visibility into customer license utilization to identify optimization opportunities |
| **Customer Success** | Proactive identification of underutilized licenses and churn risks |
| **Finance** | Accurate revenue tracking and forecasting by product |

### 1.3 Reference Documentation

| Topic | Microsoft Documentation |
|-------|------------------------|
| Partner Center Insights | [Insights Overview](https://learn.microsoft.com/en-us/partner-center/insights/partner-center-insights) |
| Programmatic Access | [Programmatic Prerequisites](https://learn.microsoft.com/en-us/partner-center/insights/insights-programmatic-prerequisites) |
| Usage Reports | [Office 365 Usage Reports](https://learn.microsoft.com/en-us/partner-center/insights/insights-office-365-usage-report) |
| Revenue Analytics | [Revenue and Usage Dashboard](https://learn.microsoft.com/en-us/partner-center/insights/insights-revenue-usage) |

---

## 2. Problem Statement

### 2.1 Current State

Today, when a Marketplace Manager or Reseller needs to understand Microsoft 365 subscription performance, they must:

1. Leave the AppDirect platform
2. Navigate to Microsoft Partner Center
3. Access multiple reports (Subscriptions, Usage, Revenue)
4. Manually correlate data across different views
5. Export data to spreadsheets for analysis
6. Return to AppDirect to take action

This creates:
- **Visibility gaps** — no unified view of subscription health in AppDirect
- **Delayed insights** — manual process delays identification of issues
- **Missed opportunities** — underutilized licenses go unnoticed
- **Churn risk** — low engagement not flagged proactively

### 2.2 Desired State

An integrated Partner Center Insights experience within the AppDirect platform where users can:

- View real-time subscription metrics (seats, assignments, active users)
- Track revenue by product and subscription
- Analyze Office 365 service usage patterns
- Identify underutilized licenses and churn risks
- Manage subscription nicknames for easier identification
- Access detailed subscription summaries with one click

**All without leaving the AppDirect platform.**

---

## 3. Goals & Success Metrics

### 3.1 Primary Goals

| Goal | Description |
|------|-------------|
| **G1** | Provide real-time visibility into Microsoft 365 subscription health |
| **G2** | Enable proactive identification of underutilized licenses |
| **G3** | Surface revenue analytics by product and subscription |
| **G4** | Reduce time spent in Partner Center for routine analytics |
| **G5** | Highlight churn risks before they become cancellations |

### 3.2 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| License utilization visibility | 100% | All subscriptions show assignment/usage rates |
| Time to identify underutilization | < 30 seconds | From page load to identifying issue |
| Partner Center visits reduction | -60% | Reduction in PC visits for analytics |
| Churn risk identification | > 90% | At-risk subscriptions flagged before cancellation |

---

## 4. User Personas

### 4.1 Marketplace Manager (Primary)

| Attribute | Description |
|-----------|-------------|
| **Role** | Manages the marketplace on behalf of the Distributor |
| **Responsibilities** | Revenue tracking, subscription optimization, customer health |
| **Pain Points** | Scattered data, manual reporting, delayed insights |
| **Goals** | Unified analytics, proactive alerts, efficient operations |

### 4.2 Reseller (Secondary)

| Attribute | Description |
|-----------|-------------|
| **Role** | Manages end customers and their subscriptions |
| **Responsibilities** | Customer success, license optimization, upselling |
| **Pain Points** | No visibility into customer usage patterns |
| **Goals** | Understand customer engagement, identify opportunities |

### 4.3 Customer Success Manager

| Attribute | Description |
|-----------|-------------|
| **Role** | Ensures customer satisfaction and retention |
| **Responsibilities** | Proactive outreach, adoption support, churn prevention |
| **Pain Points** | Reactive approach, no early warning system |
| **Goals** | Early churn indicators, usage insights for coaching |

---

## 5. Functional Requirements

### 5.1 Overview Metrics Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Display Total Seats across all subscriptions | Must Have |
| FR-1.2 | Display Assigned Seats with deployment percentage | Must Have |
| FR-1.3 | Display Active Users (28-day) with trend indicator | Must Have |
| FR-1.4 | Display Monthly Revenue with growth trend | Must Have |
| FR-1.5 | Color-code metrics based on health status (good/warning/poor) | Should Have |
| FR-1.6 | Show percentage change trends where applicable | Should Have |

### 5.2 Subscriptions Panel

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | List all Microsoft subscriptions for the customer | Must Have |
| FR-2.2 | Show product name, status badge, and revenue for each | Must Have |
| FR-2.3 | Display seat metrics (Total, Assigned, Active) with progress bars | Must Have |
| FR-2.4 | Allow editing subscription display name (nickname) | Must Have |
| FR-2.5 | Provide revert option for custom nicknames | Should Have |
| FR-2.6 | Show renewal date with "Change" action button | Should Have |
| FR-2.7 | Provide "Summarise all subscriptions" modal view | Must Have |

### 5.3 All Subscriptions Modal

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Group subscriptions by product (Offer/Edition) | Must Have |
| FR-3.2 | Show collapsible groups with aggregate metrics | Must Have |
| FR-3.3 | Display term type badges (Annual, Monthly, Triannual) | Must Have |
| FR-3.4 | Calculate and display churn risk indicators | Must Have |
| FR-3.5 | Highlight low assignment/usage rates with color coding | Should Have |
| FR-3.6 | Show subscription UUID (truncated) for reference | Should Have |
| FR-3.7 | Display summary footer with totals | Must Have |

### 5.4 Office 365 Usage Analytics

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Display usage by product category (M365 Apps, Power Platform) | Must Have |
| FR-4.2 | Show active users vs total users with percentage | Must Have |
| FR-4.3 | Break down usage by service (Exchange, Teams, SharePoint, etc.) | Must Have |
| FR-4.4 | Color-code usage percentages (green >80%, yellow >60%, red <60%) | Should Have |
| FR-4.5 | Provide service-level recommendations | Should Have |

### 5.5 Revenue Analytics

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Display Monthly Recurring Revenue (MRR) total | Must Have |
| FR-5.2 | Show revenue breakdown by product | Must Have |
| FR-5.3 | Display percentage contribution per product | Must Have |
| FR-5.4 | Show month-over-month growth trend | Should Have |
| FR-5.5 | Visualize with progress bars | Should Have |

### 5.6 Utilization Insights

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | Calculate unassigned seats across all subscriptions | Must Have |
| FR-6.2 | Calculate active user percentage of assigned seats | Must Have |
| FR-6.3 | Display insights in a highlighted alert box | Must Have |
| FR-6.4 | Provide actionable recommendations | Should Have |

---

## 6. User Experience Design

### 6.1 Extension Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ Demo Mode — Running with demo data. In production, connects to APIs.     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📊 Partner Center Insights                                    [DEMO]       │
│  Microsoft 365 analytics, subscription management, and revenue insights    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  OVERVIEW                                                                   │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐│
│  │ 👥 Total Seats │ │ 📦 Assigned    │ │ ⚡ Active Users│ │ 💰 Revenue     ││
│  │     350        │ │     312        │ │     269        │ │   $9,900       ││
│  │   ▲ +5.2%      │ │   89% deployed │ │   ▼ -2.3%     │ │   ▲ +8.7%      ││
│  └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘│
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ ▼ Subscriptions (10)                    [Summarise all my subscriptions]    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Microsoft 365 Business Premium  [Active]                              │  │
│  │ [Nickname: M365 BP - Monthly Team] ✏️ ↩️                               │  │
│  │ Renewal: 2025-12-31 [Change]                                          │  │
│  │ $900/mo                          │ Total Seats: 45 [Change]           │  │
│  │                                  │ Assigned ████████░░ 42 (93%)       │  │
│  │                                  │ Active   ███████░░░ 38 (90%)       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ... more subscriptions ...                                                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 💡 Utilization Insights                                             │    │
│  │ • You have 38 unassigned seats across all subscriptions.            │    │
│  │ • Only 86.2% of assigned users are actively using their licenses.   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ ▶ Office 365 Usage Analytics                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ ▶ Revenue Analytics                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ ℹ️ Data from Microsoft Partner Center Insights API. Updated daily.          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Metric Card Design

| Status | Color | Criteria |
|--------|-------|----------|
| Good | Green background | Assignment >90%, Usage >80%, Revenue growing |
| Warning | Yellow background | Assignment 70-90%, Usage 60-80% |
| Poor | Red background | Assignment <70%, Usage <60% |
| Neutral | White background | Default, no specific threshold |

### 6.3 Churn Risk Indicators

| Risk Level | Badge | Criteria |
|------------|-------|----------|
| High | 🔴 `⚠ High Churn Risk` | Assignment <50% OR Usage <40% |
| Medium | 🟡 `⚡ Monitor` | Assignment <70% OR Usage <60% |
| Low | (none) | Assignment ≥70% AND Usage ≥60% |

### 6.4 Term Type Badges

| Term Type | Color |
|-----------|-------|
| Triannual Up Front | Purple |
| Annual Up Front | Blue |
| Annual Billed Monthly | Cyan |
| Monthly Billed Monthly | Green |

---

## 7. Data Requirements

### 7.1 Data Sources

| Data Type | Source | Refresh Rate |
|-----------|--------|--------------|
| Subscription details | Partner Center Subscriptions API | Real-time |
| Seat counts | Partner Center Subscriptions API | Real-time |
| Usage data | Partner Center Insights API | Daily |
| Revenue data | Partner Center Analytics API | Daily |
| Service usage | Microsoft Graph Reports API | Daily |

### 7.2 Key Metrics Calculations

| Metric | Calculation |
|--------|-------------|
| Deployment Rate | `(Assigned Seats / Total Seats) × 100` |
| Usage Rate | `(Active Users / Assigned Seats) × 100` |
| MRR | `Sum of all subscription monthly revenues` |
| Unassigned Seats | `Total Seats - Assigned Seats` |
| Service Adoption | `(Service Active Users / Total Licensed Users) × 100` |

---

## 8. Implementation Status

### 8.1 AppDirect Extension Architecture

| Attribute | Value |
|-----------|-------|
| **Extension Name** | `partner_insights` |
| **Extension Type** | Micro-UI / Embedded React App |
| **Build Tool** | Webpack with Module Federation |
| **UI Framework** | Mantine 8.x |
| **State Management** | React Hooks + useState |
| **Demo Mode** | ✅ Enabled (mock data, no live API calls) |

### 8.2 Completed Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Demo Mode Banner** | ✅ Complete | Single-line banner indicating demo mode |
| **Overview Metrics** | ✅ Complete | 4 metric cards with trends and status colors |
| **Subscriptions Panel** | ✅ Complete | Accordion with 10 demo subscriptions |
| **Editable Nicknames** | ✅ Complete | Inline edit with save/cancel, revert option |
| **Progress Bars** | ✅ Complete | Assignment and usage visualization |
| **All Subscriptions Modal** | ✅ Complete | Grouped by product with churn risk |
| **Office 365 Usage** | ✅ Complete | M365 Apps and Power Platform breakdown |
| **Revenue Analytics** | ✅ Complete | Product-level revenue breakdown |
| **Utilization Insights** | ✅ Complete | Alert box with key findings |
| **Data Source Footer** | ✅ Complete | API attribution with learn more link |

### 8.3 Extension File Structure

```
extensions/partner-insights/
├── src/
│   ├── components/
│   │   ├── App/index.tsx              # Main extension entry point
│   │   └── insights/
│   │       └── PartnerInsightsPanel.tsx  # Core insights component
│   ├── api/
│   │   └── insightsData.ts            # Mock data and utilities
│   ├── hooks/
│   │   ├── useMarketplaceContext.ts   # AppDirect context hook
│   │   └── usePageTitle.ts            # Page title management
│   └── translations/
│       └── en.json                    # i18n strings
├── static/
│   └── app-dev-config.json            # Extension configuration
├── webpack.config.js                  # Build configuration
└── package.json                       # Dependencies
```

### 8.4 Demo Data

| Data Type | Count | Examples |
|-----------|-------|----------|
| **Subscriptions** | 10 | M365 Business Premium (3), M365 E3 (3), M365 E5 (2), O365 E1 (2) |
| **Total Seats** | 350 | Across all subscriptions |
| **Monthly Revenue** | $9,900 | Aggregate MRR |
| **Office Products** | 2 | Microsoft 365 Apps, Power Platform |
| **Services Tracked** | 8 | Exchange, SharePoint, OneDrive, Teams, Office Apps, Power BI, Power Apps, Power Automate |

### 8.5 Running the Extension

**Development Mode:**
```bash
cd extensions/partner-insights
npm install
npm start
```
Access at: `https://connectors2.test.devappdirect.me/app/partner-insights?devMode=true&appName=partner_insights`

**Build for Upload:**
```bash
npm run build
# Zip file created in dist/ folder
```

---

## 9. Future Enhancements

| Enhancement | Priority | Description |
|-------------|----------|-------------|
| **Partner Center API Integration** | High | Replace mock data with live API calls |
| **Real-time Usage Data** | High | Connect to Microsoft Graph Reports API |
| **Seat Change Requests** | Medium | Allow seat modifications from UI |
| **Renewal Management** | Medium | View and modify renewal settings |
| **Export to CSV** | Medium | Download subscription and usage data |
| **Email Alerts** | Low | Notify on low utilization thresholds |
| **Historical Trends** | Low | Charts showing metrics over time |
| **Comparison Views** | Low | Compare usage across customers |

---

## Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **MRR** | Monthly Recurring Revenue |
| **Deployment Rate** | Percentage of purchased seats that are assigned to users |
| **Usage Rate** | Percentage of assigned users actively using the service |
| **Churn Risk** | Likelihood of subscription cancellation based on utilization |
| **Partner Center** | Microsoft's portal for CSP partners to manage customers |
| **CSP** | Cloud Solution Provider — Microsoft's partner program |

### B. Status Color Mapping

```
Good (Green):     Assignment ≥90%, Usage ≥80%, Revenue ↑
Warning (Yellow): Assignment 70-89%, Usage 60-79%
Poor (Red):       Assignment <70%, Usage <60%
```

### C. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 13, 2026 | Neil Bolton | Initial release as AppDirect Extension |

---

**End of Document**


