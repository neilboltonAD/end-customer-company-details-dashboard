# Product Requirements Document (PRD)
## Marketplace Administration Settings Interface

**Project:** AppSettings from Magic Patterns  
**Version:** 1.0.0  
**Last Updated:** October 30, 2025  
**Author:** Neil Bolton  
**Jira Ticket:** [PRODUCT-2282](https://appdirect.jira.com/browse/PRODUCT-2282)

---

## 1. Executive Summary

The Marketplace Administration Settings Interface is a comprehensive update designed to provide marketplace users with intuitive controls for managing synchronization settings, company information, and vendor integrations. 

The application streamlines the configuration of critical marketplace operations including company sync, tenant linking, user synchronization across Microsoft, and detailed vendor-specific information management.

### 1.0 Mini-features (bulleted)

- **Marketplace sync settings dashboard**: one place to view/edit all sync toggles and dependencies.
- **Company sync**: enable/disable company discovery + sub-settings.
- **Microsoft tenant linking**: configure and guide tenant relationship setup.
- **Microsoft user sync**: enable/disable user synchronization + sub-settings.
- **Vendor information (per company)**: vendor selector and vendor-specific sections.
- **Partner Center insights (customer metrics)**: usage and revenue rollups (where available).
- **P2P transfers (Microsoft)**: transfer initiation + management tooling (where enabled).
- **GDAP management**: relationship visibility + template-based request creation (where enabled).
- **Reseller customer onboarding**: capture onboarding info + email template workflow (where enabled).
- **Price sync tooling**: review deltas + confirm updates + status tracking (where enabled).

### 1.1 Business Objectives

- **Centralized Configuration Management**: Provide a single interface for all marketplace synchronization and vendor settings
- **Improved User Experience**: Deliver an intuitive, modern UI that reduces training time and configuration errors
- **Enhanced Vendor Integration**: Enable seamless management of Microsoft, Adobe, and Google vendor relationships
- **Operational Efficiency**: Reduce time spent on configuration tasks by 60%
- **Error Prevention**: Implement safety mechanisms (confirmations, dependency management) to prevent misconfigurations

---

## 2. Problem Statement

Marketplace administrators currently face challenges in:
- Managing complex synchronization settings across multiple vendor platforms
- Understanding dependencies between various configuration options
- Accessing vendor-specific information in a fragmented manner
- Preventing misconfiguration that could disrupt service operations
- Tracking company and vendor relationships efficiently

**Impact**: These challenges lead to increased configuration time, higher error rates, and operational inefficiencies that affect overall marketplace performance.

---

## 3. Target Audience

### 3.1 Primary Users
- **Marketplace Administrators**: IT professionals responsible for configuring and maintaining marketplace settings
- **System Integrators**: Technical staff managing vendor integrations and synchronization
- **Customer Success Managers**: Team members needing visibility into company and vendor configurations

### 3.2 User Personas

**Persona 1: Marketplace Administrator**
- **Role**: Senior IT Administrator
- **Goals**: Configure sync settings accurately, minimize downtime, ensure data consistency
- **Pain Points**: Complex configuration UIs, fear of breaking critical integrations
- **Technical Level**: Advanced

**Persona 2: Partner Operations Specialist**
- **Role**: Customer Onboarding Specialist
- **Goals**: View company details, understand vendor relationships, troubleshoot sync issues
- **Pain Points**: Difficulty accessing vendor information, unclear status indicators
- **Technical Level**: Intermediate

---

## 4. Product Overview

### 4.1 Core Features

The application consists of two primary modules:

#### Module 1: Sync Settings Management
A comprehensive interface for configuring marketplace-wide and vendor-specific synchronization settings.

#### Module 2: Company Details & Vendor Information
A detailed view of company information with vendor-specific configurations and status monitoring.

---

## 5. Detailed Feature Requirements

### 5.1 Sync Settings Module

#### 5.1.1 Marketplace Wide Settings

**Feature: Company Sync**
- **Priority**: P0 (Critical)
- **Description**: Automatically discover and import companies from connected platforms
- **User Story**: As a marketplace administrator, I want to enable company sync so that new companies are automatically discovered and imported into my marketplace.

**Requirements:**
- Toggle control to enable/disable company sync
- Visual status indicator (ENABLED/DISABLED badge)
- Help tooltip explaining functionality
- Expandable section for detailed sub-settings
- Warning modal when disabling (prevents accidental disablement)

**Sub-Settings (dependent on Company Sync):**
1. **Create Companies Automatically**
   - Default: Enabled
   - When disabled: Companies go to pending status requiring manual approval

2. **Invite admins when companies are created**
   - Default: Disabled
   - Automatically sends invitation to company administrators

3. **Sales Support can manage pending companies**
   - Default: Disabled
   - Grants Sales Support Role (SSR) access to pending companies

4. **Customer Support can manage pending companies**
   - Default: Disabled
   - Grants Customer Support Role (CSR) access to pending companies

**Acceptance Criteria:**
- [ ] Company Sync toggle functions correctly
- [ ] Disabling Company Sync shows confirmation modal
- [ ] Sub-settings are disabled when parent is disabled
- [ ] Status badge reflects current state accurately
- [ ] Help tooltip displays informative content

---

#### 5.1.2 Microsoft Settings

**Feature: Tenant Linking**
- **Priority**: P0 (Critical)
- **Description**: Enable direct relationship with customer Microsoft 365/Azure environments
- **User Story**: As a marketplace administrator, I want to enable tenant linking so that customers can establish automated relationships with their Microsoft tenants.

**Requirements:**
- Dependent on Company Sync being enabled
- Toggle control with visual status
- Email notification sent with reseller relationship link
- Help tooltip explaining Microsoft tenant relationships

**Acceptance Criteria:**
- [ ] Cannot enable if Company Sync is disabled
- [ ] Toggle is disabled/grayed out when Company Sync is off
- [ ] Visual indicator shows dependency relationship
- [ ] Help content explains Microsoft tenant linking

**Feature: Microsoft Sync Tool**
- **Priority**: P1 (High)
- **Description**: Comprehensive interface for Microsoft Partner Center synchronization
- **User Story**: As a marketplace administrator, I want to enable the Microsoft Sync Tool to manage synchronization between my marketplace and Microsoft Partner Center.

**Requirements:**
- Independent toggle (not dependent on other settings)
- Handles user data, license assignments, relationship management
- Help tooltip with detailed explanation

**Feature: User Sync**
- **Priority**: P0 (Critical)
- **Description**: Automatically import user accounts from Microsoft 365 and Azure AD
- **User Story**: As a marketplace administrator, I want to enable user sync so that user information is automatically synchronized from Microsoft Online Portal.

**Requirements:**
- Toggle control with status indicator
- Creates new users automatically on marketplace
- Cascading disable of sub-settings when parent disabled

**Sub-Settings (dependent on User Sync):**
1. **Enable invitation of Microsoft synced users**
   - Allows Company Admins to invite external synced users

2. **Force Microsoft User to reset on first login**
   - Requires password reset for end users (not admins)
   - Admins always required to reset password

3. **Enable Graph Sync v2**
   - Resolves discrepancies in domains, user accounts, entitlements
   - Handles actions taken in Microsoft Portal
   - Manages migrations from existing platforms

**Acceptance Criteria:**
- [ ] User Sync toggle functions independently
- [ ] Sub-settings automatically disable when parent disabled
- [ ] Graph Sync v2 provides comprehensive reconciliation
- [ ] Status badges accurately reflect state

---

#### 5.1.3 Google Settings

**Feature: Google User Sync**
- **Priority**: P1 (High)
- **Description**: Connect marketplace to Google Workspace for user synchronization
- **User Story**: As a marketplace administrator, I want to enable Google User Sync to automatically synchronize user accounts from Google Workspace.

**Requirements:**
- Toggle control with status indicator
- Synchronizes accounts, groups, organizational units
- Help tooltip explaining Google Workspace integration
- Unified user management across Google and marketplace

**Acceptance Criteria:**
- [ ] Toggle functions independently
- [ ] Status indicator reflects current state
- [ ] Help content explains Google Workspace integration

---

#### 5.1.4 Global Controls

**Feature: Save All Settings**
- **Priority**: P0 (Critical)
- **Description**: Persist all configuration changes
- **User Story**: As a marketplace administrator, I want to save all my settings changes at once so that my configurations are applied consistently.

**Requirements:**
- Prominent primary button in top-right corner
- Saves all settings across all sections
- Provides feedback on save success/failure
- Validation before save

**Acceptance Criteria:**
- [ ] Button is always visible and accessible
- [ ] All settings are persisted on click
- [ ] User receives confirmation of save
- [ ] Validation prevents invalid configurations

---

### 5.2 Company Details Module

#### 5.2.1 Company Summary Card

**Feature: Company Overview**
- **Priority**: P0 (Critical)
- **Description**: Display high-level company information and key metrics
- **User Story**: As a partner operations specialist, I want to view company summary information so that I can quickly understand the company's status and activity.

**Requirements:**
- Company icon/logo placeholder
- Company name (editable display name)
- Status indicator (Enabled/Disabled)
- Quick stats below company name:
  - Active subscriptions count
  - License utilization percentage
- Key metrics dashboard (Enhanced with Partner Center Insights 🆕):
  - **Total Seats**: Microsoft 365 licenses with MoM trend
  - **Active Users (28d)**: Users actively using licenses with MoM trend
  - **Monthly Revenue**: Recurring monthly revenue with MoM trend
  - **Total Spent (12m)**: Annual spending
  - **Active Subscriptions**: Count of Microsoft products
  - **Unpaid Invoices**: Outstanding invoices count

**Visual Design:**
- Card-based layout with shadow
- Metrics displayed in equal-width columns with hover tooltips
- Trend indicators (up/down arrows) with color coding:
  - Green for positive trends
  - Red for negative trends
- Status badge with colored indicator dot
- Gray background for metrics section
- Warning colors for concerning metrics (low usage, unpaid invoices)

**Enhanced Features 🆕:**
- Trend visualization with TrendingUp/TrendingDown icons
- Percentage change display for metrics with trends
- Color-coded metric values based on status:
  - Yellow for declining active users
  - Red for unpaid invoices
- Hover tooltips explaining each metric
- Integration with Partner Center Insights data

**Acceptance Criteria:**
- [x] All metrics display correctly
- [x] Status badge shows accurate state
- [x] Layout is responsive
- [x] Metrics update in real-time
- [x] Trend indicators display correctly
- [x] Color coding reflects metric status
- [x] Tooltips provide helpful context
- [x] Partner Center Insights data integrated

---

#### 5.2.2 Company Tabs & Vendor Selection

**Feature: Vendor Information Navigation**
- **Priority**: P0 (Critical)
- **Description**: Enable users to switch between different vendor configurations
- **User Story**: As a marketplace administrator, I want to select different vendors so that I can view and manage vendor-specific configurations.

**Requirements:**
- Tab interface showing active section
- Dropdown selector for vendor choice
- Supported vendors:
  - Microsoft (default)
  - Adobe
  - Google
- Dynamic content loading based on selection

**Acceptance Criteria:**
- [ ] Tab navigation is intuitive
- [ ] Vendor selector functions correctly
- [ ] Content updates when vendor is changed
- [ ] Active state is clearly indicated

---

#### 5.2.3 Microsoft Vendor Section

**Feature: Microsoft Configuration Display**
- **Priority**: P0 (Critical)
- **Description**: Display detailed Microsoft-specific configuration and status
- **User Story**: As a marketplace administrator, I want to view Microsoft configuration details so that I can verify my Microsoft integration settings.

**Requirements:**
- Expandable sections for organization
- Microsoft-specific settings and values
- Connection status indicators
- Partner Center information
- Tenant relationship status
- License and subscription details

**Acceptance Criteria:**
- [ ] All Microsoft settings display correctly
- [ ] Connection status is accurate
- [ ] Expandable sections function smoothly
- [ ] Help tooltips provide context

---

#### 5.2.3.1 Partner Center Insights Integration 🆕

**Feature: Microsoft Partner Center Insights Dashboard**
- **Priority**: P0 (Critical)
- **Description**: Display comprehensive analytics and metrics from Microsoft Partner Center about customer Microsoft 365 usage, deployment, subscriptions, revenue, and Office 365 service utilization
- **User Story**: As a marketplace administrator or CSP partner, I want to view detailed Partner Center Insights so that I can understand customer engagement, identify optimization opportunities, and track revenue performance.
- **Reference**: [Microsoft Partner Center Insights API Prerequisites](https://learn.microsoft.com/en-us/partner-center/insights/insights-programmatic-prerequisites)

**Key Metrics Displayed:**

1. **Overview Dashboard**
   - **Total Seats**: Total Microsoft 365 licenses purchased across all subscriptions with month-over-month trend
   - **Assigned Seats**: Number of licenses assigned to users with deployment percentage
   - **Active Users (28 days)**: Count of users actively using their licenses with month-over-month trend and usage percentage
   - **Monthly Revenue**: Recurring monthly revenue from Microsoft subscriptions with growth trend

2. **Subscription Details**
   - List of all Microsoft subscriptions (M365 Business Premium, E3, E5, Office 365, etc.)
   - Per-subscription metrics:
     - Product name and SKU
     - Total seats purchased
     - Assigned seats with deployment percentage
     - Active users with usage percentage
     - Monthly revenue contribution
     - Subscription status (Active, Suspended, Expired)
     - Renewal date
   - Visual progress bars for deployment and usage percentages
   - Color-coded status indicators:
     - Green (≥90% deployment, ≥80% usage)
     - Yellow (70-89% deployment, 60-79% usage)
     - Red (<70% deployment, <60% usage)
   - Utilization insights and recommendations

3. **Office 365 Usage Analytics**
   - Per-product usage breakdown:
     - Microsoft 365 Apps
     - Power Platform
   - Per-service metrics:
     - **Exchange**: Email usage
     - **SharePoint**: Document collaboration
     - **OneDrive**: Cloud storage
     - **Teams**: Communication and collaboration
     - **Office Apps**: Word, Excel, PowerPoint usage
     - **Power BI**: Business intelligence
     - **Power Apps**: Custom applications
     - **Power Automate**: Workflow automation
   - Active user counts and percentages per service
   - Service-specific recommendations to improve adoption

4. **Revenue Analytics**
   - Monthly Recurring Revenue (MRR) with growth trend
   - Revenue breakdown by product:
     - Microsoft 365 E3, E5, Business Premium
     - Office 365 SKUs
     - Azure subscriptions
     - Other products
   - Revenue contribution percentage per product
   - Visual progress bars for revenue distribution
   - Revenue opportunity recommendations
   - Upsell and cross-sell suggestions

**Requirements:**

1. **Data Visualization**
   - Card-based metric display with icons
   - Color-coded status indicators (good/warning/poor)
   - Trend indicators (up/down arrows) with percentage change
   - Progress bars for deployment and usage metrics
   - Responsive grid layout

2. **User Insights & Recommendations**
   - Automated recommendations based on metrics:
     - **Low deployment**: Identify unassigned seats, suggest license optimization
     - **Low usage**: Recommend training, adoption programs, feature showcases
     - **Service-specific**: Tailored suggestions per Office 365 service
     - **Revenue opportunities**: Upsell/cross-sell recommendations based on usage patterns

3. **Expandable Sections**
   - Overview (default open)
   - Subscriptions detail (default open)
   - Office 365 Usage Analytics (default open)
   - Revenue Analytics (default closed)

4. **Data Source Attribution**
   - Clear indication of data source (Microsoft Partner Center Insights API)
   - Data refresh frequency (daily)
   - Time period for usage metrics (last 28 days)
   - Link to Microsoft documentation
   - Disclaimers about revenue figures

**Technical Implementation:**

**Data Model:**
```typescript
interface PartnerCenterInsights {
  overview: {
    totalSeats: number;
    assignedSeats: number;
    activeUsers: number;
    monthlyRevenue: number;
    subscriptions: number;
    trends: {
      seats: number;        // % change MoM
      activeUsers: number;  // % change MoM
      revenue: number;      // % change MoM
    };
  };
  subscriptions: Array<{
    productName: string;
    sku: string;
    seats: number;
    assignedSeats: number;
    activeUsers: number;
    revenue: number;
    status: 'active' | 'suspended' | 'expired';
    renewalDate?: string;
  }>;
  officeUsage: Array<{
    product: string;
    totalUsers: number;
    activeUsers: number;
    usagePercentage: number;
    services: Array<{
      name: string;
      activeUsers: number;
      percentage: number;
    }>;
  }>;
  revenueBreakdown: {
    byProduct: Array<{
      name: string;
      revenue: number;
      percentage: number;
    }>;
    total: number;
    growth: number;
  };
}
```

**API Integration (Future):**
```typescript
// When backend is implemented, this will call:
// GET /api/partner-center/insights/:customerId
// Authorization: Executive Report Viewer (ERV) role required
// Azure AD App registration with Partner Center API permissions
```

**Acceptance Criteria:**
- [x] Overview metrics display correctly with trends
- [x] Subscription details show all products with accurate metrics
- [x] Deployment and usage percentages calculate correctly
- [x] Color-coded indicators reflect actual status
- [x] Office 365 usage analytics display per-service data
- [x] Revenue breakdown shows accurate distribution
- [x] Recommendations are contextual and actionable
- [x] All sections are expandable/collapsible
- [x] Data source attribution is clear and links to MS docs
- [x] Component is integrated into Microsoft vendor section
- [x] Responsive design works on all screen sizes
- [x] No linting errors

**Business Value:**
- **Customer Utilization Visibility**: Partners can immediately see if customers are utilizing purchased services
- **Proactive Account Management**: Low usage alerts enable partners to engage before renewal
- **Revenue Optimization**: Identify upsell opportunities based on usage patterns
- **Adoption Insights**: Understand which Office 365 services need promotion
- **Data-Driven Decisions**: Make informed recommendations backed by actual usage data
- **Competitive Advantage**: Provide value-added insights that differentiate partner services

**Future Enhancements:**
- Historical trend charts (90 days, 12 months)
- Export to PDF/Excel functionality
- Email alerts for threshold breaches
- Comparative analytics (vs industry benchmarks)
- Predictive churn analysis
- Custom date range selection
- Real-time data refresh
- Integration with Power BI for advanced analytics

---

#### 5.2.4 Adobe Vendor Section

**Feature: Adobe Configuration Display**
- **Priority**: P1 (High)
- **Description**: Display Adobe-specific configuration and status
- **User Story**: As a marketplace administrator, I want to view Adobe configuration details so that I can manage Adobe product integrations.

**Requirements:**
- Adobe-specific configuration display
- License information
- Product catalog
- Integration status

**Acceptance Criteria:**
- [ ] Adobe settings display correctly
- [ ] Layout matches design system
- [ ] Information is accurate and current

---

#### 5.2.5 Google Vendor Section

**Feature: Google Configuration Display**
- **Priority**: P1 (High)
- **Description**: Display Google Workspace configuration and status
- **User Story**: As a marketplace administrator, I want to view Google Workspace configuration details so that I can manage Google integrations.

**Requirements:**
- Google Workspace-specific settings
- Connection status
- Domain verification status
- User sync configuration
- Placeholder for future expansion

**Current State:**
- Placeholder message: "No Google data available."
- Framework in place for future implementation

**Acceptance Criteria:**
- [ ] Section displays correctly
- [ ] Placeholder message is clear
- [ ] Help tooltip explains Google integration

---

## 6. User Experience Requirements

### 6.1 Navigation

**Primary Navigation (Top Navbar)**
- **Components**: Logo, Search, Notifications, Help, User Profile
- **Behavior**: Fixed position, always visible
- **Responsive**: Collapses on mobile

**Secondary Navigation**
- **Components**: Breadcrumbs, Section identifier
- **Behavior**: Contextual to current page
- **Purpose**: Orientation within application

**Sidebar Navigation**
- **Components**: Categorized settings menu
- **Behavior**: Active state highlighting
- **Sections**:
  - Marketplace Settings
  - Company Management
  - Vendor Integrations
  - User Management
  - Reports & Analytics

### 6.2 Interaction Patterns

**Toggles**
- **Visual States**: On (blue), Off (gray)
- **Feedback**: Immediate visual change
- **Animation**: Smooth transition (0.2s)
- **Accessibility**: Keyboard navigable, ARIA labels

**Expandable Sections**
- **Behavior**: Click to expand/collapse
- **Icon**: Chevron indicating state
- **Animation**: Smooth accordion effect
- **Default State**: Collapsed for cleaner view
- **Help Icon**: Tooltip on hover with detailed information

**Modals**
- **Trigger**: Destructive or critical actions
- **Content**: Clear message, action buttons
- **Actions**: Cancel (secondary), Confirm (primary)
- **Overlay**: Semi-transparent backdrop
- **Close**: X button, ESC key, click outside

**Buttons**
- **Variants**:
  - Primary: Blue, high emphasis actions
  - Secondary: Gray, medium emphasis
  - Outline: Border only, low emphasis
- **States**: Default, Hover, Active, Disabled
- **Loading**: Spinner indicator for async actions

### 6.3 Help System

**Tooltips**
- **Trigger**: Hover over help icon (?)
- **Content**: Concise explanation (50-150 words)
- **Position**: Smart positioning to avoid viewport edges
- **Styling**: White background, subtle shadow, readable typography

**Learn More Links**
- **Purpose**: Link to detailed documentation
- **Placement**: Below complex settings
- **Behavior**: Opens in new tab
- **Icon**: External link indicator

### 6.4 Feedback & Notifications

**Toast Notifications**
- **Position**: Bottom-right corner
- **Duration**: 3-5 seconds (auto-dismiss)
- **Types**:
  - Success: Green, checkmark icon
  - Error: Red, X icon
  - Warning: Yellow, alert icon
  - Info: Blue, info icon

**Confirmation Modals**
- **When**: Disabling critical features, bulk actions
- **Content**: Clear consequence explanation
- **Remember**: Warning message should explain what will happen

**Status Badges**
- **Visual**: Rounded rectangle, bold text
- **Colors**:
  - Green: Active/Enabled
  - Red: Inactive/Disabled
  - Yellow: Pending/Warning
  - Gray: Neutral/Unknown

---

## 7. Technical Requirements

### 7.1 Technology Stack

**Frontend Framework**
- React 18.2.0
- TypeScript 4.9.5
- React Router DOM 6.30.1

**UI Libraries**
- Tailwind CSS 3.3.0 (utility-first styling)
- Mantine Core 8.1.2 (component library)
- Mantine Hooks 8.1.2 (React hooks)
- Mantine Notifications 8.1.2 (notification system)
- Lucide React 0.263.1 (icon library)

**Build Tools**
- React Scripts 5.0.1 (Create React App)
- PostCSS 8.4.0
- Autoprefixer 10.4.0

**Development Tools**
- TypeScript type checking
- ESLint for code quality
- Hot module replacement

### 7.2 Component Architecture

**Component Structure**
```
src/
├── components/
│   ├── company/         # Company-specific components
│   │   ├── CompanySummaryCard.tsx
│   │   ├── CompanyTabs.tsx
│   │   ├── VendorInformation.tsx
│   │   ├── MicrosoftSection.tsx
│   │   ├── CompanyDetailsAdobe.tsx
│   │   └── CompanyDetailsMantine.tsx
│   ├── form/            # Form controls
│   │   ├── Button.tsx
│   │   ├── RadioButton.tsx
│   │   ├── SearchInput.tsx
│   │   └── Toggle.tsx
│   ├── layout/          # Layout components
│   │   ├── Card.tsx
│   │   ├── ExpandableSection.tsx
│   │   ├── PageLayout.tsx
│   │   ├── Section.tsx
│   │   └── SettingItem.tsx
│   ├── navigation/      # Navigation components
│   │   ├── TopNavbar.tsx
│   │   ├── SecondaryNavbar.tsx
│   │   └── Sidebar.tsx
│   ├── typography/      # Text components
│   │   ├── Heading.tsx
│   │   └── Text.tsx
│   └── misc/           # Miscellaneous
│       ├── Avatar.tsx
│       ├── HelpTooltip.tsx
│       ├── LearnMoreLink.tsx
│       └── Modal.tsx
├── pages/              # Page components
│   ├── ComponentLibrary.tsx (Sync Settings)
│   └── CompanyDetails.tsx
└── App.tsx            # Root component with routing
```

**Component Design Principles**
- **Reusability**: All components are designed for reuse
- **Composition**: Complex UIs built from simple components
- **Props-driven**: Configuration through props
- **Type Safety**: Full TypeScript coverage
- **Accessibility**: ARIA labels, keyboard navigation

### 7.3 State Management

**Local State (useState)**
- Toggle states (boolean)
- Modal visibility and content
- Form inputs
- UI state (expanded/collapsed)

**State Location**
- **Page-level state**: Shared across page components
- **Component-level state**: Local to specific component
- **Derived state**: Calculated from other state

**State Dependencies**
- Company Sync → Tenant Linking (dependency)
- User Sync → Sub-settings (cascade disable)
- Modal state → Confirmation actions

**Future Considerations**
- Context API for global state (user, permissions)
- React Query for server state management
- Local storage persistence for user preferences

### 7.4 Routing

**Route Structure**
```
/ → Redirect to /company-details
/settings → Sync Settings page (ComponentLibrary)
/company-details → Company Details page
* → 404 or redirect to /company-details
```

**Navigation**
- Declarative routing with React Router
- Route guards for authentication (future)
- Deep linking support
- Browser history management

### 7.5 Data Flow

**Current Implementation (MVP)**
- Mock data hard-coded in components
- Local state management
- No backend API integration

**Future Backend Integration**
```
Frontend → API Layer → Backend Services
           ↓
    [Validation & Error Handling]
           ↓
    [State Management]
           ↓
    [UI Updates & Notifications]
```

**API Requirements (Future)**
- RESTful API endpoints
- Authentication & authorization
- Real-time updates (WebSocket/SSE)
- Optimistic updates
- Error handling & retry logic

### 7.6 Performance Requirements

**Load Time**
- Initial page load: < 2 seconds
- Route transitions: < 300ms
- Component interactions: < 100ms

**Bundle Size**
- Main bundle: < 500KB (gzipped)
- Code splitting by route
- Lazy loading for heavy components
- Tree shaking for unused code

**Optimization Strategies**
- React.memo for expensive components
- useMemo/useCallback for computed values
- Virtual scrolling for large lists (future)
- Image optimization and lazy loading

### 7.7 Browser Support

**Supported Browsers**
- Chrome (last 1 version)
- Firefox (last 1 version)
- Safari (last 1 version)
- Edge (Chromium-based)

**Production Targets**
- Modern browsers (> 0.2% usage)
- No IE11 support
- ES6+ features supported

### 7.8 Responsive Design

**Breakpoints**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Responsive Behavior**
- Fluid layouts with Tailwind utilities
- Collapsing navigation on mobile
- Stacked layouts on small screens
- Touch-friendly targets (44x44px minimum)

### 7.9 Accessibility Requirements

**WCAG 2.1 Level AA Compliance**
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Color contrast ratios (4.5:1 minimum)
- Screen reader compatibility
- Skip navigation links

**Keyboard Interactions**
- Tab: Navigate through interactive elements
- Enter/Space: Activate buttons and toggles
- Escape: Close modals
- Arrow keys: Navigate within components

---

## 8. Design System

### 8.1 Color Palette

**Primary Colors**
- Primary Blue: `#3B82F6` (buttons, links, active states)
- Primary Blue Hover: `#2563EB`

**Status Colors**
- Success Green: `#10B981` (enabled states)
- Success Green Background: `#D1FAE5`
- Error Red: `#EF4444` (disabled states, errors)
- Error Red Background: `#FEE2E2`
- Warning Yellow: `#F59E0B`
- Warning Yellow Background: `#FEF3C7`

**Neutral Colors**
- Gray 50: `#F9FAFB` (backgrounds)
- Gray 100: `#F3F4F6` (subtle backgrounds)
- Gray 200: `#E5E7EB` (borders)
- Gray 300: `#D1D5DB` (disabled)
- Gray 500: `#6B7280` (secondary text)
- Gray 700: `#374151` (primary text)
- Gray 800: `#1F2937` (headings)
- Gray 900: `#111827` (high emphasis)

### 8.2 Typography

**Font Family**
- System font stack (optimized for each platform)

**Font Sizes**
- Heading 1: `text-2xl` (24px)
- Heading 2: `text-xl` (20px)
- Heading 3: `text-lg` (18px)
- Body: `text-base` (16px)
- Small: `text-sm` (14px)
- Extra Small: `text-xs` (12px)

**Font Weights**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### 8.3 Spacing

**Spacing Scale** (Tailwind units)
- 0: 0px
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)

**Usage**
- Component padding: 16px (p-4)
- Section spacing: 24px (space-y-6)
- Card spacing: 24px (p-6)

### 8.4 Components

**Cards**
- Background: White
- Border radius: 8px
- Shadow: `shadow` (subtle)
- Padding: 24px

**Buttons**
- Border radius: 6px
- Padding: 8px 16px
- Font weight: 600
- Transition: 200ms

**Inputs**
- Border radius: 6px
- Border: 1px solid gray-300
- Focus ring: 2px blue-500
- Padding: 8px 12px

**Toggles**
- Width: 44px
- Height: 24px
- Transition: 200ms
- Active: Blue background
- Inactive: Gray background

---

## 9. Security & Compliance

### 9.1 Authentication

**Current State**: Not implemented (MVP)

**Future Requirements**
- OAuth 2.0 / OpenID Connect
- JWT tokens for session management
- Refresh token rotation
- Multi-factor authentication (MFA) support

### 9.2 Authorization

**Role-Based Access Control (RBAC)**
- Marketplace Administrator: Full access
- Company Administrator: Company-specific access
- Sales Support Role (SSR): Limited access based on settings
- Customer Support Role (CSR): Limited access based on settings
- Read-only User: View-only access

**Permission Granularity**
- Page-level permissions
- Feature-level permissions
- Action-level permissions (create, read, update, delete)

### 9.3 Data Security

**In Transit**
- HTTPS/TLS 1.3
- Certificate pinning (mobile apps)
- Secure WebSocket (WSS) for real-time features

**At Rest**
- Encrypted sensitive fields
- Secure session storage
- No sensitive data in localStorage

**Client-Side Security**
- XSS prevention (React default escaping)
- CSRF tokens for mutations
- Content Security Policy (CSP)
- Subresource Integrity (SRI)

### 9.4 Audit & Logging

**Audit Trail Requirements**
- User actions (who, what, when)
- Configuration changes
- Login/logout events
- Failed authentication attempts
- API calls and responses

**Log Levels**
- Error: Critical failures
- Warning: Recoverable issues
- Info: Normal operations
- Debug: Development information

### 9.5 Compliance

**Standards**
- GDPR (data protection)
- SOC 2 Type II
- WCAG 2.1 Level AA (accessibility)
- OWASP Top 10 security practices

---

## 10. Testing Requirements

### 10.1 Unit Tests

**Coverage Target**: 80%

**Test Cases**
- Component rendering
- Props handling
- State management
- Event handlers
- Conditional rendering
- Edge cases and error states

**Tools**
- Jest (test runner)
- React Testing Library (component testing)
- TypeScript type checking

### 10.2 Integration Tests

**Scope**
- Multi-component interactions
- Route navigation
- State persistence
- Form submissions
- Modal workflows
- API integration (when implemented)

### 10.3 End-to-End Tests

**Critical User Flows**
1. Enable Company Sync → Configure sub-settings → Save
2. Disable Company Sync → Confirm modal → Verify cascade
3. Enable User Sync → Configure Microsoft settings → Save
4. Navigate to Company Details → Select vendor → View information
5. Change vendor selection → Verify content update

**Tools** (Future)
- Cypress or Playwright
- Visual regression testing

### 10.4 Manual Testing

**Test Matrix**
- Browser compatibility
- Responsive design
- Accessibility
- Keyboard navigation
- Screen reader compatibility

### 10.5 Performance Testing

**Metrics**
- Lighthouse scores (> 90)
- Core Web Vitals
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
- Bundle size analysis
- Network waterfall

---

## 11. Deployment & Operations

### 11.1 Build Process

**Development**
```bash
npm install           # Install dependencies
npm start            # Start dev server (port 3000)
PORT=3001 npm start  # Start on custom port
```

**Production**
```bash
npm run build        # Create optimized build
```

**Output**
- Static files in `/build` directory
- Minified and optimized JavaScript
- CSS extracted and minified
- Source maps for debugging

### 11.2 Deployment Strategy

**Hosting Options**
- Static hosting (Netlify, Vercel, AWS S3 + CloudFront)
- Docker containerization
- Kubernetes orchestration

**CI/CD Pipeline** (Recommended)
```
Code Push → GitHub Actions
    ↓
Run Tests → ESLint, TypeScript, Jest
    ↓
Build → Production bundle
    ↓
Deploy → Staging environment
    ↓
Smoke Tests
    ↓
Deploy → Production
```

**Environment Variables**
- `REACT_APP_API_URL`: Backend API endpoint
- `REACT_APP_ENV`: Environment (dev, staging, prod)
- `REACT_APP_VERSION`: Application version

### 11.3 Monitoring

**Application Monitoring**
- Error tracking (Sentry, Rollbar)
- Performance monitoring (Datadog, New Relic)
- User analytics (Google Analytics, Mixpanel)
- Real User Monitoring (RUM)

**Metrics to Track**
- Page load times
- API response times
- Error rates and types
- User engagement
- Feature usage

### 11.4 Rollback Strategy

**Deployment Versioning**
- Git tags for releases
- Semantic versioning (MAJOR.MINOR.PATCH)
- Rollback to previous stable version if issues detected

**Health Checks**
- Smoke tests post-deployment
- Automated health monitoring
- Alert system for critical failures

---

## 12. Documentation Requirements

### 12.1 User Documentation

**Administrator Guide**
- Getting started
- Feature overview
- Configuration walkthroughs
- Best practices
- Troubleshooting

**Help System**
- In-app tooltips (implemented)
- Contextual help links
- Video tutorials (future)
- FAQ section

### 12.2 Developer Documentation

**Code Documentation**
- Component API documentation
- Props and types
- Usage examples
- Architecture decisions

**Technical Documentation**
- Setup instructions (README.md)
- Architecture overview
- API integration guide
- Deployment guide
- Contributing guidelines

**Repository Documentation**
- README.md ✓ (exists)
- PRD.md ✓ (this document)
- CHANGELOG.md (future)
- CONTRIBUTING.md (future)

---

## 13. Future Enhancements

### 13.1 Short-term (Next 3 months)

**Priority 1: Backend Integration**
- Connect to real API endpoints
- Implement authentication
- Real-time data updates
- Error handling and retry logic

**Priority 2: Enhanced Vendor Support**
- Complete Adobe section
- Complete Google section
- Add AWS Marketplace
- Add Salesforce

**Priority 3: Advanced Features**
- Bulk operations
- Configuration templates
- Export/import settings
- Audit log viewer

### 13.2 Medium-term (3-6 months)

**Analytics Dashboard**
- Sync statistics
- Performance metrics
- Error tracking
- Usage analytics

**Notification System**
- Email notifications for critical events
- In-app notification center
- Customizable notification preferences

**Advanced Permissions**
- Custom roles
- Granular permissions
- Delegation of authority

### 13.3 Long-term (6-12 months)

**AI-Powered Features**
- Configuration recommendations
- Anomaly detection
- Predictive insights
- Automated troubleshooting

**Multi-marketplace Management**
- Manage multiple marketplaces
- Cross-marketplace synchronization
- Consolidated reporting

**Mobile Application**
- iOS and Android apps
- Push notifications
- Mobile-optimized workflows

---

## 14. Success Metrics

### 14.1 Key Performance Indicators (KPIs)

**User Adoption**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Feature adoption rate
- Time to first successful configuration

**User Satisfaction**
- Net Promoter Score (NPS): Target > 40
- Customer Satisfaction (CSAT): Target > 4.5/5
- Task completion rate: Target > 95%
- User feedback sentiment

**Operational Efficiency**
- Time to configure sync settings: Reduce by 60%
- Configuration errors: Reduce by 80%
- Support tickets related to settings: Reduce by 50%
- Time to resolution for configuration issues: Reduce by 40%

**Technical Performance**
- Page load time: < 2 seconds
- API response time: < 500ms
- Error rate: < 0.1%
- Uptime: > 99.9%

### 14.2 Success Criteria

**Phase 1 (MVP) - Complete ✓**
- [x] Core UI components implemented
- [x] Sync Settings page functional
- [x] Company Details page functional
- [x] Responsive design
- [x] Basic help system

**Phase 2 (Backend Integration) - Future**
- [ ] API integration complete
- [ ] Authentication implemented
- [ ] Real-time updates working
- [ ] Error handling robust

**Phase 3 (Production Ready) - Future**
- [ ] All vendors fully supported
- [ ] Performance targets met
- [ ] Security audit passed
- [ ] User acceptance testing complete

---

## 15. Risks & Mitigations

### 15.1 Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Browser compatibility issues | Medium | Low | Comprehensive browser testing, polyfills |
| Performance degradation | High | Medium | Code splitting, lazy loading, monitoring |
| API integration complexity | High | Medium | Phased rollout, comprehensive testing |
| State management at scale | Medium | Medium | Consider Redux/Context API when needed |

### 15.2 User Experience Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Complex UI overwhelming users | High | Medium | Progressive disclosure, help system |
| Accidental misconfiguration | High | Medium | Confirmation modals, undo functionality |
| Learning curve too steep | Medium | Medium | Onboarding flow, tooltips, documentation |

### 15.3 Business Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Low user adoption | High | Low | User research, iterative design, training |
| Competitor features | Medium | Medium | Continuous feature development |
| Vendor API changes | Medium | High | API versioning, adapter pattern |

---

## 16. Dependencies

### 16.1 Internal Dependencies

- Backend API services
- Authentication system
- User management service
- Vendor integration services (Microsoft, Adobe, Google)

### 16.2 External Dependencies

**Vendor APIs**
- Microsoft Partner Center API
- Microsoft Graph API
- Adobe Admin Console API
- Google Workspace Admin API

**Third-party Services**
- Authentication provider (Auth0, Okta)
- Analytics service
- Error tracking service
- CDN for static assets

### 16.3 Infrastructure

- CI/CD pipeline
- Hosting platform
- SSL certificates
- DNS configuration
- Monitoring services

---

## 17. Timeline & Milestones

### Completed Milestones ✓

**Phase 1: MVP Development (Complete)**
- ✓ Component library created
- ✓ Sync Settings page implemented
- ✓ Company Details page implemented
- ✓ Responsive design completed
- ✓ Basic routing implemented
- ✓ Help system (tooltips) added

### Future Milestones

**Phase 2: Backend Integration (Months 1-2)**
- API client implementation
- Authentication integration
- State management enhancement
- Error handling

**Phase 3: Enhanced Features (Months 3-4)**
- Complete vendor sections
- Advanced permissions
- Audit logging
- Notification system

**Phase 4: Optimization (Months 5-6)**
- Performance optimization
- Security hardening
- Comprehensive testing
- Documentation completion

**Phase 5: Production Launch (Month 6)**
- Beta testing
- User training
- Production deployment
- Post-launch monitoring

---

## 18. Stakeholder Sign-off

### Document Review

| Stakeholder | Role | Sign-off Date | Status |
|------------|------|---------------|--------|
| Neil Bolton | Product Owner | 2025-10-30 | ✓ Approved |
| [Engineering Lead] | Technical Lead | TBD | Pending |
| [UX Designer] | Design Lead | TBD | Pending |
| [QA Manager] | Quality Lead | TBD | Pending |

---

## 19. Appendices

### 19.1 Glossary

- **Company Sync**: Automated process to discover and import companies from vendor platforms
- **Tenant Linking**: Establishing direct relationship with customer's Microsoft 365/Azure environment
- **User Sync**: Automatic synchronization of user accounts from external platforms
- **Graph Sync**: Microsoft Graph API-based synchronization for comprehensive data reconciliation
- **CSP**: Cloud Solution Provider (Microsoft program)
- **SSR**: Sales Support Role
- **CSR**: Customer Support Role
- **RBAC**: Role-Based Access Control
- **SPA**: Single Page Application

### 19.2 References

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Mantine UI Documentation](https://mantine.dev)
- [Microsoft Partner Center API](https://docs.microsoft.com/partner-center)
- [Google Workspace Admin API](https://developers.google.com/admin-sdk)
- [Adobe Admin Console API](https://developer.adobe.com)

### 19.3 Related Documents

- Project README: `/README.md`
- Jira Epic: [PRODUCT-2282](https://appdirect.jira.com/browse/PRODUCT-2282)
- Repository: Local workspace at `/Users/neilbolton/Cursor/AppSettings`

---

## 20. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-30 | Neil Bolton | Initial PRD creation |

---

**Document Status**: Draft - Pending Review  
**Next Review Date**: TBD  
**Distribution**: Internal team, stakeholders  

---

*This PRD is a living document and will be updated as requirements evolve and new features are added.*

