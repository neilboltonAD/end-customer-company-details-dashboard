import React, { useState } from 'react';
import { ExpandableSection } from '../layout/ExpandableSection';
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Package, Activity, Calendar } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  subtitle?: string;
  status?: 'good' | 'warning' | 'poor' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, trendLabel, icon, subtitle, status = 'neutral' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'poor': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return '';
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          {icon}
        </div>
        {trend !== undefined && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-xs font-medium ${getTrendColor()}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      {trendLabel && <div className="text-xs text-gray-500 mt-1">{trendLabel}</div>}
    </div>
  );
};

interface TermTypeSplit {
  termType: string;
  seats: number;
  percentage: number;
}

interface SubscriptionRowProps {
  productName: string;
  sku: string;
  seats: number;
  assignedSeats: number;
  activeUsers: number;
  revenue: number;
  status: 'active' | 'suspended' | 'expired';
  renewalDate?: string;
  termTypeSplit?: TermTypeSplit[];
}

const SubscriptionRow: React.FC<SubscriptionRowProps> = ({
  productName,
  sku,
  seats,
  assignedSeats,
  activeUsers,
  revenue,
  status,
  renewalDate,
  termTypeSplit
}) => {
  const [termTypeSplitOpen, setTermTypeSplitOpen] = useState(false);
  const deploymentPercentage = (assignedSeats / seats) * 100;
  const usagePercentage = assignedSeats > 0 ? (activeUsers / assignedSeats) * 100 : 0;

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-2 py-1">Active</span>;
      case 'suspended':
        return <span className="text-xs font-bold uppercase text-yellow-700 bg-yellow-100 rounded px-2 py-1">Suspended</span>;
      case 'expired':
        return <span className="text-xs font-bold uppercase text-red-700 bg-red-100 rounded px-2 py-1">Expired</span>;
    }
  };

  const getTermTypeColor = (termType: string) => {
    if (termType.includes('Annual')) return 'bg-blue-100 text-blue-700';
    if (termType.includes('Triannual')) return 'bg-purple-100 text-purple-700';
    if (termType.includes('Monthly')) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-gray-800">{productName}</h4>
            {getStatusBadge()}
          </div>
          <div className="text-xs text-gray-500">{sku}</div>
          {renewalDate && (
            <div className="text-xs text-gray-500 mt-1">Renewal: {renewalDate}</div>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">${revenue.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Monthly Revenue</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-3">
        <div>
          <div className="text-xs text-gray-600 mb-1">Total Seats</div>
          <div className="text-lg font-semibold text-gray-900">{seats}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Assigned</div>
          <div className="text-lg font-semibold text-gray-900">{assignedSeats}</div>
          <div className="text-xs text-gray-500">{deploymentPercentage.toFixed(1)}% deployed</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Active Users</div>
          <div className="text-lg font-semibold text-gray-900">{activeUsers}</div>
          <div className="text-xs text-gray-500">{usagePercentage.toFixed(1)}% usage</div>
        </div>
      </div>

      {/* Term Type Split Section */}
      {termTypeSplit && termTypeSplit.length > 0 && (
        <ExpandableSection
          title={
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span>Term Type Split</span>
            </div>
          }
          open={termTypeSplitOpen}
          onToggle={setTermTypeSplitOpen}
          className="mb-3"
        >
          <div className="space-y-2">
            {termTypeSplit.map((term, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getTermTypeColor(term.termType)}`}>
                    {term.termType}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-600">{term.seats} seats</span>
                  <span className="text-xs font-semibold text-gray-900 min-w-[45px] text-right">
                    {term.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Visual bar chart */}
          <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
            {termTypeSplit.map((term, index) => (
              <div
                key={index}
                className={`h-full ${
                  term.termType.includes('Annual') ? 'bg-blue-500' :
                  term.termType.includes('Triannual') ? 'bg-purple-500' :
                  term.termType.includes('Monthly') ? 'bg-green-500' : 'bg-gray-500'
                }`}
                style={{ width: `${term.percentage}%` }}
                title={`${term.termType}: ${term.percentage.toFixed(1)}%`}
              ></div>
            ))}
          </div>
        </ExpandableSection>
      )}

      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Deployment</span>
            <span>{deploymentPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                deploymentPercentage >= 90 ? 'bg-green-600' : 
                deploymentPercentage >= 70 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${deploymentPercentage}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Usage (Last 28 days)</span>
            <span>{usagePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                usagePercentage >= 80 ? 'bg-green-600' : 
                usagePercentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OfficeUsageData {
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

const OfficeUsageCard: React.FC<{ data: OfficeUsageData }> = ({ data }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800">{data.product}</h4>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{data.activeUsers}/{data.totalUsers}</div>
          <div className="text-xs text-gray-500">{data.usagePercentage.toFixed(1)}% active</div>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className={`h-3 rounded-full transition-all duration-300 ${
            data.usagePercentage >= 80 ? 'bg-green-600' : 
            data.usagePercentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
          }`}
          style={{ width: `${data.usagePercentage}%` }}
        ></div>
      </div>

      <div className="space-y-2">
        {data.services.map((service) => (
          <div key={service.name} className="flex items-center justify-between text-sm">
            <span className="text-gray-700">{service.name}</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">{service.activeUsers} users</span>
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                service.percentage >= 80 ? 'bg-green-100 text-green-700' : 
                service.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {service.percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PartnerCenterInsights: React.FC = () => {
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(true);
  const [officeUsageOpen, setOfficeUsageOpen] = useState(true);
  const [revenueOpen, setRevenueOpen] = useState(false);

  // Mock data - This would come from Microsoft Partner Center Insights API
  const insightsData = {
    overview: {
      totalSeats: 350,
      assignedSeats: 312,
      activeUsers: 245,
      monthlyRevenue: 12450,
      subscriptions: 8,
      trends: {
        seats: 5.2,
        activeUsers: -2.3,
        revenue: 8.7
      }
    },
    subscriptions: [
      {
        productName: 'Microsoft 365 Business Premium',
        sku: 'O365_BUSINESS_PREMIUM',
        seats: 150,
        assignedSeats: 142,
        activeUsers: 98,
        revenue: 3000,
        status: 'active' as const,
        renewalDate: '2025-12-31',
        termTypeSplit: [
          { termType: 'Annual Up Front', seats: 90, percentage: 60.0 },
          { termType: 'Annual Billed Monthly', seats: 45, percentage: 30.0 },
          { termType: 'Monthly Billed Monthly', seats: 15, percentage: 10.0 }
        ]
      },
      {
        productName: 'Microsoft 365 E3',
        sku: 'SPE_E3',
        seats: 100,
        assignedSeats: 95,
        activeUsers: 82,
        revenue: 3600,
        status: 'active' as const,
        renewalDate: '2026-01-15',
        termTypeSplit: [
          { termType: 'Triannual Up Front', seats: 50, percentage: 50.0 },
          { termType: 'Annual Up Front', seats: 30, percentage: 30.0 },
          { termType: 'Annual Billed Monthly', seats: 20, percentage: 20.0 }
        ]
      },
      {
        productName: 'Microsoft 365 E5',
        sku: 'SPE_E5',
        seats: 50,
        assignedSeats: 45,
        activeUsers: 38,
        revenue: 2900,
        status: 'active' as const,
        renewalDate: '2025-11-30',
        termTypeSplit: [
          { termType: 'Annual Up Front', seats: 40, percentage: 80.0 },
          { termType: 'Monthly Billed Monthly', seats: 10, percentage: 20.0 }
        ]
      },
      {
        productName: 'Office 365 E1',
        sku: 'STANDARDPACK',
        seats: 50,
        assignedSeats: 30,
        activeUsers: 27,
        revenue: 400,
        status: 'active' as const,
        renewalDate: '2026-02-28',
        termTypeSplit: [
          { termType: 'Annual Billed Monthly', seats: 25, percentage: 50.0 },
          { termType: 'Monthly Billed Monthly', seats: 25, percentage: 50.0 }
        ]
      }
    ],
    officeUsage: [
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
    ],
    revenueBreakdown: {
      byProduct: [
        { name: 'Microsoft 365 E3', revenue: 3600, percentage: 28.9 },
        { name: 'Microsoft 365 Business Premium', revenue: 3000, percentage: 24.1 },
        { name: 'Microsoft 365 E5', revenue: 2900, percentage: 23.3 },
        { name: 'Azure Subscriptions', revenue: 1550, percentage: 12.4 },
        { name: 'Office 365 E1', revenue: 400, percentage: 3.2 },
        { name: 'Other Products', revenue: 1000, percentage: 8.0 }
      ],
      total: 12450,
      growth: 8.7
    }
  };

  return (
    <ExpandableSection 
      title="Partner Center Insights" 
      open={overviewOpen}
      onToggle={setOverviewOpen}
      className="mb-3"
      helpContent="Partner Center Insights provides comprehensive analytics and metrics from Microsoft Partner Center about your customer's Microsoft 365 usage, deployment, and revenue. These insights help you understand customer engagement, optimize license allocation, and identify upsell opportunities. Data is refreshed daily and includes historical trends for performance tracking."
    >
      {/* Overview Metrics */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Overview</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Seats"
            value={insightsData.overview.totalSeats}
            trend={insightsData.overview.trends.seats}
            trendLabel="vs last month"
            icon={<Users className="w-5 h-5 text-blue-600" />}
            status="good"
          />
          <MetricCard
            title="Assigned Seats"
            value={insightsData.overview.assignedSeats}
            subtitle={`${((insightsData.overview.assignedSeats / insightsData.overview.totalSeats) * 100).toFixed(1)}% deployment`}
            icon={<Package className="w-5 h-5 text-blue-600" />}
            status="good"
          />
          <MetricCard
            title="Active Users (28d)"
            value={insightsData.overview.activeUsers}
            trend={insightsData.overview.trends.activeUsers}
            trendLabel="vs last month"
            icon={<Activity className="w-5 h-5 text-blue-600" />}
            status="warning"
            subtitle={`${((insightsData.overview.activeUsers / insightsData.overview.assignedSeats) * 100).toFixed(1)}% usage`}
          />
          <MetricCard
            title="Monthly Revenue"
            value={`$${insightsData.overview.monthlyRevenue.toLocaleString()}`}
            trend={insightsData.overview.trends.revenue}
            trendLabel="vs last month"
            icon={<DollarSign className="w-5 h-5 text-blue-600" />}
            status="good"
          />
        </div>
      </div>

      {/* Subscriptions Detail */}
      <ExpandableSection 
        title={`Subscriptions (${insightsData.subscriptions.length})`}
        open={subscriptionsOpen}
        onToggle={setSubscriptionsOpen}
        className="mb-3"
      >
        <div className="space-y-3">
          {insightsData.subscriptions.map((sub, index) => (
            <SubscriptionRow key={index} {...sub} />
          ))}
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-2">💡 Utilization Insights</div>
          <ul className="text-xs text-blue-700 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>You have <strong>{insightsData.overview.totalSeats - insightsData.overview.assignedSeats} unassigned seats</strong> across all subscriptions. Consider reassigning or reducing licenses.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Only <strong>{((insightsData.overview.activeUsers / insightsData.overview.assignedSeats) * 100).toFixed(1)}% of assigned users</strong> are actively using their licenses. Focus on adoption training.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Office 365 E1 has the lowest deployment rate. Review if this SKU meets user needs.</span>
            </li>
          </ul>
        </div>
      </ExpandableSection>

      {/* Office Usage */}
      <ExpandableSection 
        title="Office 365 Usage Analytics"
        open={officeUsageOpen}
        onToggle={setOfficeUsageOpen}
        className="mb-3"
      >
        <div className="space-y-4">
          {insightsData.officeUsage.map((usage, index) => (
            <OfficeUsageCard key={index} data={usage} />
          ))}
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm font-medium text-yellow-800 mb-2">💡 Service Usage Recommendations</div>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>SharePoint usage is at 59.9%</strong> - Consider training sessions on document collaboration and team sites.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Power Platform adoption is low (46.2%)</strong> - Showcase business automation use cases to increase engagement.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Teams has strong adoption (85.6%)</strong> - Leverage this success to promote other collaboration tools.</span>
            </li>
          </ul>
        </div>
      </ExpandableSection>

      {/* Revenue Breakdown */}
      <ExpandableSection 
        title="Revenue Analytics"
        open={revenueOpen}
        onToggle={setRevenueOpen}
        className="mb-3"
      >
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-semibold text-gray-700">Monthly Recurring Revenue</h5>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">${insightsData.revenueBreakdown.total.toLocaleString()}</div>
              <div className="flex items-center justify-end space-x-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+{insightsData.revenueBreakdown.growth}% MoM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {insightsData.revenueBreakdown.byProduct.map((product) => (
            <div key={product.name} className="border border-gray-200 rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{product.name}</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">${product.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{product.percentage.toFixed(1)}% of total</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${product.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm font-medium text-green-800 mb-2">💡 Revenue Opportunities</div>
          <ul className="text-xs text-green-700 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Microsoft 365 E3 is your top revenue generator. Consider upselling E3 users to E5 for advanced security features.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Azure subscriptions represent 12.4% of revenue with strong growth potential.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Office 365 E1 users may benefit from upgrading to Business Premium for desktop apps and advanced features.</span>
            </li>
          </ul>
        </div>
      </ExpandableSection>

      {/* Data Source Information */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="text-xs font-medium text-gray-700 mb-1">Data Source: Microsoft Partner Center Insights API</div>
            <div className="text-xs text-gray-600">
              This data is synchronized from Microsoft Partner Center and updated daily. Usage metrics reflect activity over the last 28 days. 
              Revenue figures are based on current subscription rates and may not include pending adjustments or credits.
              <a href="https://learn.microsoft.com/en-us/partner-center/insights/insights-programmatic-prerequisites" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 ml-1">
                Learn more about Partner Center Insights →
              </a>
            </div>
          </div>
        </div>
      </div>
    </ExpandableSection>
  );
};

export default PartnerCenterInsights;

