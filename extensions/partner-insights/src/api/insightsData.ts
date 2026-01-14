// Mock data for Partner Center Insights Extension

export interface SubscriptionData {
  id: string;
  productName: string;
  displayName: string;
  sku: string;
  seats: number;
  assignedSeats: number;
  activeUsers: number;
  revenue: number;
  status: 'active' | 'suspended' | 'expired';
  renewalDate?: string;
  termType: string;
}

export interface OfficeUsageData {
  product: string;
  totalUsers: number;
  activeUsers: number;
  usagePercentage: number;
  services: {
    name: string;
    activeUsers: number;
    percentage: number;
  }[];
}

export interface RevenueProduct {
  name: string;
  revenue: number;
  percentage: number;
}

export const mockSubscriptions: SubscriptionData[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    productName: 'Microsoft 365 Business Premium',
    displayName: 'O365_BUSINESS_PREMIUM',
    sku: 'O365_BUSINESS_PREMIUM',
    seats: 90,
    assignedSeats: 85,
    activeUsers: 72,
    revenue: 1800,
    status: 'active',
    renewalDate: '2025-12-31',
    termType: 'Annual Up Front'
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    productName: 'Microsoft 365 Business Premium',
    displayName: 'M365 BP - Monthly Team',
    sku: 'O365_BUSINESS_PREMIUM',
    seats: 45,
    assignedSeats: 42,
    activeUsers: 38,
    revenue: 900,
    status: 'active',
    renewalDate: '2025-12-31',
    termType: 'Annual Billed Monthly'
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
    productName: 'Microsoft 365 Business Premium',
    displayName: 'M365 BP - Contractors',
    sku: 'O365_BUSINESS_PREMIUM',
    seats: 15,
    assignedSeats: 15,
    activeUsers: 12,
    revenue: 300,
    status: 'active',
    renewalDate: '2025-12-31',
    termType: 'Monthly Billed Monthly'
  },
  {
    id: 'd4e5f6a7-b8c9-0123-defa-456789012345',
    productName: 'Microsoft 365 E3',
    displayName: 'SPE_E3',
    sku: 'SPE_E3',
    seats: 50,
    assignedSeats: 48,
    activeUsers: 42,
    revenue: 1800,
    status: 'active',
    renewalDate: '2026-01-15',
    termType: 'Triannual Up Front'
  },
  {
    id: 'e5f6a7b8-c9d0-1234-efab-567890123456',
    productName: 'Microsoft 365 E3',
    displayName: 'M365 E3 - Sales Team',
    sku: 'SPE_E3',
    seats: 30,
    assignedSeats: 28,
    activeUsers: 25,
    revenue: 1080,
    status: 'active',
    renewalDate: '2026-01-15',
    termType: 'Annual Up Front'
  },
  {
    id: 'f6a7b8c9-d0e1-2345-fabc-678901234567',
    productName: 'Microsoft 365 E3',
    displayName: 'M365 E3 - New Hires',
    sku: 'SPE_E3',
    seats: 20,
    assignedSeats: 19,
    activeUsers: 15,
    revenue: 720,
    status: 'active',
    renewalDate: '2026-01-15',
    termType: 'Annual Billed Monthly'
  },
  {
    id: 'a7b8c9d0-e1f2-3456-abcd-789012345678',
    productName: 'Microsoft 365 E5',
    displayName: 'SPE_E5',
    sku: 'SPE_E5',
    seats: 40,
    assignedSeats: 38,
    activeUsers: 32,
    revenue: 2320,
    status: 'active',
    renewalDate: '2025-11-30',
    termType: 'Annual Up Front'
  },
  {
    id: 'b8c9d0e1-f2a3-4567-bcde-890123456789',
    productName: 'Microsoft 365 E5',
    displayName: 'M365 E5 - Executives',
    sku: 'SPE_E5',
    seats: 10,
    assignedSeats: 7,
    activeUsers: 6,
    revenue: 580,
    status: 'active',
    renewalDate: '2025-11-30',
    termType: 'Monthly Billed Monthly'
  },
  {
    id: 'c9d0e1f2-a3b4-5678-cdef-901234567890',
    productName: 'Office 365 E1',
    displayName: 'STANDARDPACK',
    sku: 'STANDARDPACK',
    seats: 25,
    assignedSeats: 18,
    activeUsers: 15,
    revenue: 200,
    status: 'active',
    renewalDate: '2026-02-28',
    termType: 'Annual Billed Monthly'
  },
  {
    id: 'd0e1f2a3-b4c5-6789-defa-012345678901',
    productName: 'Office 365 E1',
    displayName: 'O365 E1 - Temps',
    sku: 'STANDARDPACK',
    seats: 25,
    assignedSeats: 12,
    activeUsers: 12,
    revenue: 200,
    status: 'active',
    renewalDate: '2026-02-28',
    termType: 'Monthly Billed Monthly'
  }
];

export const mockOfficeUsage: OfficeUsageData[] = [
  {
    product: 'Microsoft 365 Apps',
    totalUsers: 312,
    activeUsers: 245,
    usagePercentage: 78.5,
    services: [
      { name: 'Exchange', activeUsers: 298, percentage: 95.5 },
      { name: 'SharePoint', activeUsers: 187, percentage: 59.9 },
      { name: 'OneDrive', activeUsers: 234, percentage: 75.0 },
      { name: 'Teams', activeUsers: 267, percentage: 85.6 },
      { name: 'Office Apps', activeUsers: 198, percentage: 63.5 }
    ]
  },
  {
    product: 'Power Platform',
    totalUsers: 145,
    activeUsers: 67,
    usagePercentage: 46.2,
    services: [
      { name: 'Power BI', activeUsers: 45, percentage: 31.0 },
      { name: 'Power Apps', activeUsers: 28, percentage: 19.3 },
      { name: 'Power Automate', activeUsers: 34, percentage: 23.4 }
    ]
  }
];

export const mockRevenueBreakdown: RevenueProduct[] = [
  { name: 'Microsoft 365 E3', revenue: 3600, percentage: 28.9 },
  { name: 'Microsoft 365 Business Premium', revenue: 3000, percentage: 24.1 },
  { name: 'Microsoft 365 E5', revenue: 2900, percentage: 23.3 },
  { name: 'Azure Subscriptions', revenue: 1550, percentage: 12.4 },
  { name: 'Office 365 E1', revenue: 400, percentage: 3.2 },
  { name: 'Other Products', revenue: 1000, percentage: 8.0 }
];

// Utility functions
export const calculateOverview = (subscriptions: SubscriptionData[]) => ({
  totalSeats: subscriptions.reduce((sum, s) => sum + s.seats, 0),
  assignedSeats: subscriptions.reduce((sum, s) => sum + s.assignedSeats, 0),
  activeUsers: subscriptions.reduce((sum, s) => sum + s.activeUsers, 0),
  monthlyRevenue: subscriptions.reduce((sum, s) => sum + s.revenue, 0),
  subscriptionCount: subscriptions.length,
  trends: {
    seats: 5.2,
    activeUsers: -2.3,
    revenue: 8.7
  }
});

export const getChurnRisk = (sub: SubscriptionData) => {
  const assignmentRate = (sub.assignedSeats / sub.seats) * 100;
  const usageRate = sub.assignedSeats > 0 ? (sub.activeUsers / sub.assignedSeats) * 100 : 0;
  
  if (assignmentRate < 50 || usageRate < 40) return 'high';
  if (assignmentRate < 70 || usageRate < 60) return 'medium';
  return 'low';
};

export const getTermTypeColor = (termType: string) => {
  if (termType.includes('Triannual')) return { bg: 'purple.1', text: 'purple.7', border: 'purple.3' };
  if (termType.includes('Annual') && termType.includes('Up Front')) return { bg: 'blue.1', text: 'blue.7', border: 'blue.3' };
  if (termType.includes('Annual') && termType.includes('Monthly')) return { bg: 'cyan.0', text: 'cyan.7', border: 'cyan.3' };
  if (termType.includes('Monthly')) return { bg: 'green.1', text: 'green.7', border: 'green.3' };
  return { bg: 'gray.1', text: 'gray.7', border: 'gray.3' };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const groupSubscriptionsByProduct = (subscriptions: SubscriptionData[]) => {
  return subscriptions.reduce((acc, sub) => {
    if (!acc[sub.productName]) {
      acc[sub.productName] = [];
    }
    acc[sub.productName].push(sub);
    return acc;
  }, {} as Record<string, SubscriptionData[]>);
};


