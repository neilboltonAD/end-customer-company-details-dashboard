import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Users,
  Package,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { ExpandableSection } from '../components/layout/ExpandableSection';

const OperationsSidebar = ({ activeItem }: { activeItem: string }) => {
  const navigate = useNavigate();

  const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-1">
      <div className="bg-gray-100 border-y border-gray-200 px-4 py-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );

  const SidebarItem = ({
    label,
    active,
    onClick,
    className = '',
  }: {
    label: string;
    active?: boolean;
    onClick?: () => void;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm transition-colors ${className} ${
        active ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <aside className="w-56 bg-white min-h-[calc(100vh-56px)] border-r border-gray-200">
      <SidebarSection title="OPERATIONS">
        <SidebarItem label="Users" active={activeItem === 'Users'} onClick={() => navigate('/operations')} />
        <SidebarItem label="Companies" active={activeItem === 'Companies'} onClick={() => navigate('/operations/companies')} />
        <SidebarItem label="Pending Companies" active={activeItem === 'Pending Companies'} />
        <SidebarItem label="Leads" active={activeItem === 'Leads'} />
        <SidebarItem label="Quotes" active={activeItem === 'Quotes'} />
      </SidebarSection>

      <SidebarSection title="BILLING">
        <SidebarItem label="Dashboard" active={activeItem === 'Dashboard'} />
        <SidebarItem label="Purchases" active={activeItem === 'Purchases'} />
        <SidebarItem label="Orders" active={activeItem === 'Orders'} />
        <SidebarItem label="Invoices" active={activeItem === 'Invoices'} />
        <SidebarItem label="Payments" active={activeItem === 'Payments'} />
        <SidebarItem label="Metered Usage" active={activeItem === 'Metered Usage'} />
      </SidebarSection>

      <SidebarSection title="EVENTS">
        <SidebarItem label="Event Logs" active={activeItem === 'Event Logs'} />
        <SidebarItem label="App Usage Logs" active={activeItem === 'App Usage Logs'} />
        <SidebarItem label="Admin Logs" active={activeItem === 'Admin Logs'} />
      </SidebarSection>

      <SidebarSection title="ADMIN TASKS">
        <SidebarItem
          label="Microsoft"
          active={activeItem === 'Microsoft'}
          onClick={() => navigate('/operations/microsoft')}
        />
        <SidebarItem
          label="Reseller: PC Insights"
          active={activeItem === 'Reseller: PC Insights'}
          className="pl-8"
          onClick={() => navigate('/operations/microsoft/reseller')}
        />
        <SidebarItem
          label="Reseller: P2P Transfers"
          active={activeItem === 'Reseller: P2P Transfers'}
          className="pl-8"
          onClick={() => navigate('/operations/microsoft/p2p')}
        />
      </SidebarSection>
    </aside>
  );
};

const customers = [
  { name: 'demoresellercustomer1', status: 'Enabled', subscriptions: 14, lastSync: '2h ago' },
  { name: 'demoresellercustomer2', status: 'Enabled', subscriptions: 9, lastSync: '5h ago' },
  { name: 'demoresellercustomer3', status: 'Enabled', subscriptions: 6, lastSync: 'Yesterday' },
  { name: 'Contoso Ltd', status: 'Enabled', subscriptions: 12, lastSync: '3h ago' },
  { name: 'Fabrikam Solutions', status: 'Pending', subscriptions: 4, lastSync: '2d ago' },
  { name: 'Adventure Works', status: 'Enabled', subscriptions: 18, lastSync: '1h ago' },
];

const customerSubscriptionsByProduct: Record<string, Array<{
  product: string;
  subscriptions: number;
  totalSeats: number;
  assignedSeats: number;
  revenue: number;
  status: 'Healthy' | 'Attention needed';
}>> = {
  demoresellercustomer1: [
    { product: 'Microsoft 365 Business Premium', subscriptions: 2, totalSeats: 60, assignedSeats: 56, revenue: 1200, status: 'Healthy' },
    { product: 'Microsoft 365 E3', subscriptions: 2, totalSeats: 40, assignedSeats: 38, revenue: 1440, status: 'Healthy' },
    { product: 'Office 365 E1', subscriptions: 1, totalSeats: 20, assignedSeats: 12, revenue: 160, status: 'Attention needed' },
  ],
  demoresellercustomer2: [
    { product: 'Microsoft 365 E3', subscriptions: 2, totalSeats: 45, assignedSeats: 42, revenue: 1620, status: 'Healthy' },
    { product: 'Microsoft 365 E5', subscriptions: 1, totalSeats: 25, assignedSeats: 20, revenue: 1450, status: 'Healthy' },
  ],
  demoresellercustomer3: [
    { product: 'Microsoft 365 Business Premium', subscriptions: 1, totalSeats: 30, assignedSeats: 28, revenue: 600, status: 'Healthy' },
    { product: 'Office 365 E1', subscriptions: 1, totalSeats: 10, assignedSeats: 6, revenue: 80, status: 'Attention needed' },
  ],
  'Contoso Ltd': [
    { product: 'Microsoft 365 E5', subscriptions: 2, totalSeats: 60, assignedSeats: 55, revenue: 2900, status: 'Healthy' },
    { product: 'Microsoft 365 E3', subscriptions: 2, totalSeats: 40, assignedSeats: 38, revenue: 1440, status: 'Healthy' },
  ],
  'Fabrikam Solutions': [
    { product: 'Office 365 E1', subscriptions: 2, totalSeats: 20, assignedSeats: 10, revenue: 160, status: 'Attention needed' },
  ],
  'Adventure Works': [
    { product: 'Microsoft 365 Business Premium', subscriptions: 3, totalSeats: 90, assignedSeats: 85, revenue: 1800, status: 'Healthy' },
    { product: 'Microsoft 365 E3', subscriptions: 3, totalSeats: 60, assignedSeats: 58, revenue: 2160, status: 'Healthy' },
    { product: 'Microsoft 365 E5', subscriptions: 2, totalSeats: 40, assignedSeats: 36, revenue: 2320, status: 'Healthy' },
  ],
};

const productTypeSummaries = [
  {
    name: 'Microsoft 365 Business Premium',
    subscriptions: 3,
    totalSeats: 150,
    assignedSeats: 142,
    revenue: 3000,
    status: 'Healthy',
  },
  {
    name: 'Microsoft 365 E3',
    subscriptions: 3,
    totalSeats: 100,
    assignedSeats: 95,
    revenue: 3600,
    status: 'Healthy',
  },
  {
    name: 'Microsoft 365 E5',
    subscriptions: 2,
    totalSeats: 50,
    assignedSeats: 45,
    revenue: 2900,
    status: 'Healthy',
  },
  {
    name: 'Office 365 E1',
    subscriptions: 2,
    totalSeats: 50,
    assignedSeats: 30,
    revenue: 400,
    status: 'Attention needed',
  },
];

const productTypeCustomers: Record<string, Array<{
  customer: string;
  seats: number;
  value: number;
}>> = {
  'Microsoft 365 Business Premium': [
    { customer: 'demoresellercustomer1', seats: 60, value: 1200 },
    { customer: 'Adventure Works', seats: 90, value: 1800 },
    { customer: 'demoresellercustomer3', seats: 30, value: 600 },
  ],
  'Microsoft 365 E3': [
    { customer: 'demoresellercustomer1', seats: 40, value: 1440 },
    { customer: 'demoresellercustomer2', seats: 45, value: 1620 },
    { customer: 'Contoso Ltd', seats: 40, value: 1440 },
    { customer: 'Adventure Works', seats: 60, value: 2160 },
  ],
  'Microsoft 365 E5': [
    { customer: 'demoresellercustomer2', seats: 25, value: 1450 },
    { customer: 'Contoso Ltd', seats: 60, value: 2900 },
    { customer: 'Adventure Works', seats: 40, value: 2320 },
  ],
  'Office 365 E1': [
    { customer: 'demoresellercustomer1', seats: 20, value: 160 },
    { customer: 'demoresellercustomer3', seats: 10, value: 80 },
    { customer: 'Fabrikam Solutions', seats: 20, value: 160 },
  ],
};

const MetricCard = ({
  title,
  value,
  trend,
  icon,
  subtitle,
  status = 'neutral',
}: {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  subtitle?: string;
  status?: 'good' | 'warning' | 'poor' | 'neutral';
}) => {
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
    if (trend > 0) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-3 h-3 text-red-600" />;
    return <Minus className="w-3 h-3 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return '';
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={`border rounded-lg p-3 ${getStatusColor()}`}>
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-600">{title}</div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">{value}</span>
            {trend !== undefined && (
              <div className="flex items-center space-x-0.5">
                {getTrendIcon()}
                <span className={`text-xs font-medium ${getTrendColor()}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              </div>
            )}
          </div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

export const OperationsMicrosoft = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [productSort, setProductSort] = useState<'seats' | 'value'>('seats');
  const rowsPerPage = 5;

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const pageStart = (currentPage - 1) * rowsPerPage;
  const pageEnd = pageStart + rowsPerPage;
  const paginatedCustomers = filteredCustomers.slice(pageStart, pageEnd);
  const totalSubscriptions = customers.reduce((sum, c) => sum + c.subscriptions, 0);
  const totalProducts = productTypeSummaries.length;
  const totalSeats = productTypeSummaries.reduce((sum, p) => sum + p.totalSeats, 0);
  const totalAssigned = productTypeSummaries.reduce((sum, p) => sum + p.assignedSeats, 0);
  const totalRevenue = productTypeSummaries.reduce((sum, p) => sum + p.revenue, 0);
  const assignmentRate = totalSeats ? Math.round((totalAssigned / totalSeats) * 100) : 0;
  const attentionCount = productTypeSummaries.filter((p) => p.status === 'Attention needed').length;
  const activeUsers = Math.round(totalAssigned * 0.86);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="flex">
        <OperationsSidebar activeItem="Reseller: PC Insights" />

        <main className="flex-1 p-6">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <button onClick={() => navigate('/operations/companies')} className="hover:text-teal-600">
              Companies
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Microsoft</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Reseller: PC Insights</span>
          </div>

          <div className="bg-white rounded shadow p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Reseller: PC Insights</h1>
                <p className="text-sm text-gray-500">Marketplace-wide Microsoft tools and subscription insights</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
                <p className="text-sm text-gray-500">Performance across all customers and subscriptions</p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  attentionCount > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}
              >
                {attentionCount > 0 ? `${attentionCount} attention needed` : 'Healthy'}
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricCard
                title="Total Seats"
                value={totalSeats}
                trend={5.2}
                icon={<Users className="w-4 h-4 text-blue-600" />}
                status="good"
              />
              <MetricCard
                title="Assigned Seats"
                value={totalAssigned}
                subtitle={`${assignmentRate}% deployed`}
                icon={<Package className="w-4 h-4 text-blue-600" />}
                status={assignmentRate >= 85 ? 'good' : 'warning'}
              />
              <MetricCard
                title="Active Users (28d)"
                value={activeUsers}
                trend={-2.3}
                icon={<Activity className="w-4 h-4 text-blue-600" />}
                status="warning"
              />
              <MetricCard
                title="Monthly Revenue"
                value={`$${totalRevenue.toLocaleString()}`}
                trend={8.7}
                icon={<DollarSign className="w-4 h-4 text-blue-600" />}
                status="good"
              />
            </div>
            <div className="text-xs text-gray-500 mt-3">
              {customers.length} customers • {totalSubscriptions} subscriptions • {totalProducts} product types
            </div>
          </div>

          <ExpandableSection
            title="By Customer"
            defaultOpen
            className="mb-4"
            helpContent="Summary of all reseller customers and their Microsoft subscription activity."
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-gray-500">Summary</div>
                <div className="text-sm text-gray-700">
                  {customers.length} customers • {customers.reduce((sum, c) => sum + c.subscriptions, 0)} subscriptions
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded shadow">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Subscriptions</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Last Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((customer) => {
                    const isExpanded = expandedCustomer === customer.name;
                    const products = customerSubscriptionsByProduct[customer.name] || [];

                    return (
                      <React.Fragment key={customer.name}>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">
                            <button
                              onClick={() => setExpandedCustomer(isExpanded ? null : customer.name)}
                              className="flex items-center gap-2 text-teal-700 hover:underline"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                              {customer.name}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                customer.status === 'Enabled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {customer.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">{customer.subscriptions}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{customer.lastSync}</td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-gray-50">
                            <td colSpan={4} className="p-3">
                              <div className="text-xs text-gray-500 mb-2">Subscriptions by product type</div>
                              <div className="space-y-2">
                                {products.map((product) => (
                                  <div key={product.product} className="border border-gray-200 rounded p-3 bg-white">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm font-semibold text-gray-800">{product.product}</div>
                                        <div className="text-xs text-gray-500">
                                          {product.subscriptions} subscriptions • {product.totalSeats} seats • {product.assignedSeats} assigned (
                                          {product.totalSeats ? Math.round((product.assignedSeats / product.totalSeats) * 100) : 0}%)
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                            product.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                          }`}
                                        >
                                          {product.status}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-800">${product.revenue.toLocaleString()}/mo</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 flex items-center justify-end space-x-4">
                  <span className="text-sm text-gray-600">
                    {pageStart + 1}-{Math.min(pageEnd, filteredCustomers.length)} of {filteredCustomers.length}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <input
                      type="text"
                      value={currentPage}
                      onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
                      className="w-8 text-center py-1 text-sm border border-gray-300 rounded"
                    />
                    <button
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="By Product"
            defaultOpen
            helpContent="Roll-up view of Microsoft subscription insights grouped by product type."
          >
            <div className="text-xs text-gray-500 mb-3">Product types</div>
            <div className="space-y-2">
              {productTypeSummaries.map((product) => {
                const customersForProduct = (productTypeCustomers[product.name] || [])
                  .slice()
                  .sort((a, b) => (productSort === 'seats' ? b.seats - a.seats : b.value - a.value));

                return (
                  <ExpandableSection
                    key={product.name}
                    title={
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.subscriptions} subscriptions</div>
                          <div className="text-xs text-gray-500">
                            {product.totalSeats} seats • {product.assignedSeats} assigned (
                            {product.totalSeats ? Math.round((product.assignedSeats / product.totalSeats) * 100) : 0}%)
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              product.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {product.status}
                          </span>
                          <span className="text-sm font-semibold text-gray-800">${product.revenue.toLocaleString()}/mo</span>
                        </div>
                      </div>
                    }
                    className="mb-2"
                  >
                    <div className="border border-gray-200 rounded bg-white">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50 text-xs text-gray-500">
                        <span>Customer</span>
                        <div className="flex items-center gap-6">
                          <button
                            className={`inline-flex items-center gap-1 ${
                              productSort === 'seats' ? 'text-gray-900' : 'text-gray-500'
                            }`}
                            onClick={() => setProductSort('seats')}
                          >
                            Seats
                            <ChevronDown className={`h-3 w-3 ${productSort === 'seats' ? 'opacity-100' : 'opacity-40'}`} />
                          </button>
                          <button
                            className={`inline-flex items-center gap-1 ${
                              productSort === 'value' ? 'text-gray-900' : 'text-gray-500'
                            }`}
                            onClick={() => setProductSort('value')}
                          >
                            Value
                            <ChevronDown className={`h-3 w-3 ${productSort === 'value' ? 'opacity-100' : 'opacity-40'}`} />
                          </button>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {customersForProduct.map((item) => (
                          <div key={item.customer} className="flex items-center justify-between px-3 py-2">
                            <div className="text-sm text-gray-900">{item.customer}</div>
                            <div className="flex items-center gap-6 text-sm text-gray-700">
                              <span>{item.seats}</span>
                              <span>${item.value.toLocaleString()}/mo</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ExpandableSection>
                );
              })}
            </div>
          </ExpandableSection>

        </main>
      </div>

      <button className="fixed bottom-6 right-6 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700">
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
};
