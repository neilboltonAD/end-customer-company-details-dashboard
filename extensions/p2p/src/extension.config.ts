export const extensionConfig = {
  id: 'p2p-subscription-transfers',
  name: 'P2P Subscription Transfers',
  version: '1.0.0',
  vendor: 'AppDirect',
  description: 'Manage Partner-to-Partner subscription transfers for Microsoft CSP',
  
  // Where this extension can be embedded
  placements: [
    {
      id: 'company-vendor-microsoft',
      location: 'company.details.vendor.microsoft',
      label: 'P2P Transfers',
    },
    {
      id: 'operations-companies',
      location: 'operations.companies.header',
      label: 'P2P Transfers',
      icon: 'arrow-left-right',
    }
  ],
  
  // Required permissions
  permissions: [
    'company.read',
    'company.subscriptions.read',
    'company.subscriptions.write',
    'vendor.microsoft.read',
    'vendor.microsoft.write',
  ],
  
  // Settings schema (configurable per marketplace)
  settings: {
    enableNotifications: {
      type: 'boolean',
      default: true,
      label: 'Enable in-app notifications',
    },
    transferExpiryDays: {
      type: 'number',
      default: 30,
      label: 'Transfer expiry period (days)',
    },
  },
};

