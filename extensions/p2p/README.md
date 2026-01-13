# P2P Subscription Transfers Extension

An AppDirect Platform Extension for managing Partner-to-Partner subscription transfers for Microsoft CSP.

## Overview

This extension enables marketplace managers and resellers to:
- View incoming P2P transfer requests from other partners
- Create outbound transfer requests to send subscriptions to other partners
- Accept or reject incoming transfers with reason tracking
- View complete transfer history with audit timeline
- Monitor transfer status and expiration dates

## Architecture

```
extensions/p2p/
├── src/
│   ├── api/                    # API layer
│   │   ├── graphql/           # Apollo GraphQL client & queries
│   │   └── mockData.ts        # Demo data for development
│   ├── components/            # React components
│   │   ├── modals/           # Modal dialogs
│   │   ├── shared/           # Reusable components
│   │   └── P2PTransfersPanel.tsx
│   ├── context/              # React context providers
│   │   ├── ExtensionContext.tsx
│   │   └── P2PContext.tsx
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── locales/              # i18n translations
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
├── public/                   # Static assets
├── tests/                    # Test files
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Demo Mode

This extension runs in **demo mode** when accessed standalone (not embedded in AppDirect). Demo mode features:

- ✅ All UI components fully functional
- ✅ Mock data for subscriptions, transfers, and partners
- ✅ Simulated API delays for realistic behavior
- ✅ Create, accept, reject, and cancel transfers (persists in session)
- ✅ Demo banner to indicate demo mode
- ✅ Mock user context (Marketplace Manager role)

**No backend or GraphQL schema required** - perfect for stakeholder demos!

### Demo Data Includes:

| Category | Count | Details |
|----------|-------|---------|
| **Incoming Pending** | 3 | From Contoso, Fabrikam, Northwind (1 urgent) |
| **Outgoing Pending** | 1 | To Acme Corp |
| **Completed** | 2 | Successful transfers in last 90 days |
| **Rejected** | 1 | Shows rejection reason flow |
| **Subscriptions** | 7 | Mix of M365, Teams Rooms, Power BI, Defender |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd extensions/p2p
npm install
```

### Development

```bash
npm run dev
```

This starts a local development server at `http://localhost:5173`.

In development mode, the extension provides mock context data simulating the AppDirect host environment.

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment to AppDirect.

### Testing

```bash
npm test
```

## Extension Context

When embedded in the AppDirect platform, the extension receives context via `postMessage`:

```typescript
interface ExtensionContext {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    permissions: string[];
  };
  company: {
    id: string;
    name: string;
    microsoftTenantId: string;
    mpnId: string;
  };
  marketplace: {
    id: string;
    name: string;
    apiUrl: string;
  };
  sessionToken: string;
}
```

## API Integration

### AppDirect GraphQL API

The extension uses Apollo Client to communicate with the AppDirect GraphQL API for:
- Fetching company details
- Retrieving subscription data
- Managing transfer records

### Microsoft Partner Centre API

Transfer operations are proxied through a secure backend that communicates with:
- `POST /v1/customers/{customer-tenant-id}/transfers` - Create transfer
- `POST /v1/customers/{customer-tenant-id}/transfers/{transfer-id}/accept` - Accept transfer
- `POST /v1/customers/{customer-tenant-id}/transfers/{transfer-id}/reject` - Reject transfer

## Components

### P2PTransfersPanel

Main panel component displaying:
- Summary cards (Incoming, Outgoing, Completed, Failed)
- Available subscriptions for transfer
- Active transfers table
- Transfer history

### Modals

- **CreateTransferModal** - Create outbound transfer requests
- **ReviewTransferModal** - Accept or reject incoming transfers
- **TransferDetailsModal** - View complete transfer details with timeline

## Permissions

Required permissions for this extension:
- `company.read` - Read company information
- `company.subscriptions.read` - View subscriptions
- `company.subscriptions.write` - Manage transfers
- `vendor.microsoft.read` - Access Microsoft integration
- `vendor.microsoft.write` - Modify Microsoft settings

## Configuration

Extension settings can be configured per marketplace:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `enableNotifications` | boolean | true | Show in-app notifications |
| `transferExpiryDays` | number | 30 | Transfer expiry period |

## License

Proprietary - AppDirect Inc.

