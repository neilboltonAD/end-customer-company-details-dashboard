import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, SimpleGrid } from '@mantine/core';
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
import { ExpandableSection } from '../components/layout/ExpandableSection';
import { OperationsLayout } from '../components/layout/OperationsLayout';
import { ActionIcon, Badge, Button, Card, Text, Title } from 'components/DesignSystem';
import { Inline, Stack, TextInput } from 'components/DesignSystem';

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
  const getStatusStyle = (): React.CSSProperties => {
    switch (status) {
      case 'good':
        return { backgroundColor: 'var(--mantine-color-green-0)', borderColor: 'var(--mantine-color-green-2)' };
      case 'warning':
        return { backgroundColor: 'var(--mantine-color-yellow-0)', borderColor: 'var(--mantine-color-yellow-2)' };
      case 'poor':
        return { backgroundColor: 'var(--mantine-color-red-0)', borderColor: 'var(--mantine-color-red-2)' };
      default:
        return { backgroundColor: 'var(--mantine-color-white)', borderColor: 'var(--mantine-color-gray-3)' };
    }
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp size={12} color="var(--mantine-color-green-6)" />;
    if (trend < 0) return <TrendingDown size={12} color="var(--mantine-color-red-6)" />;
  return <Minus size={12} style={{ color: 'var(--mantine-color-gray-6)' }} />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return '';
    if (trend > 0) return 'var(--mantine-color-green-6)';
    if (trend < 0) return 'var(--mantine-color-red-6)';
    return 'var(--mantine-color-gray-6)';
  };

  return (
    <Card style={getStatusStyle()} p="sm">
      <Group gap="sm" wrap="nowrap" align="flex-start">
        <div style={{ padding: 6, background: 'var(--mantine-color-blue-0)', borderRadius: 10, flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text size="xs" c="dimmed">
            {title}
          </Text>
          <Group gap="xs" wrap="nowrap">
            <Text fw={800} size="lg">
              {value}
            </Text>
            {trend !== undefined && (
              <Group gap={4} wrap="nowrap">
                {getTrendIcon()}
                <Text size="xs" fw={700} style={{ color: getTrendColor() }}>
                  {trend > 0 ? '+' : ''}
                  {trend}%
                </Text>
              </Group>
            )}
          </Group>
          {subtitle && (
            <Text size="xs" c="dimmed">
              {subtitle}
            </Text>
          )}
        </div>
      </Group>
    </Card>
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
    <OperationsLayout>
      <main>
        <Stack gap="xl">
          <Inline gap="xs" align="center" wrap="wrap">
            <Button variant="link" onClick={() => navigate('/operations/companies')}>
              Companies
            </Button>
            <Text size="sm" c="dimmed">/</Text>
            <Text size="sm">Microsoft</Text>
            <Text size="sm" c="dimmed">/</Text>
            <Text size="sm">Reseller: PC Insights</Text>
          </Inline>

          <Card>
            <Group justify="space-between" align="flex-start">
              <div>
                <Title order={2} fw={600}>
                  Reseller: PC Insights
                </Title>
                <Text c="dimmed" size="sm">
                  Marketplace-wide Microsoft tools and subscription insights
                </Text>
              </div>
            </Group>
          </Card>

        <Card>
          <Group justify="space-between" align="flex-start" mb="sm">
            <div>
              <Title order={4}>Overview</Title>
              <Text c="dimmed" size="sm">
                Performance across all customers and subscriptions
              </Text>
            </div>
            <Badge size="sm" color={attentionCount > 0 ? 'pending' : 'success'} variant="outline">
              {attentionCount > 0 ? `${attentionCount} attention needed` : 'Healthy'}
            </Badge>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" verticalSpacing="md">
            <MetricCard
              title="Total Seats"
              value={totalSeats}
              trend={5.2}
              icon={<Users size={16} color="var(--mantine-color-blue-6)" />}
              status="good"
            />
            <MetricCard
              title="Assigned Seats"
              value={totalAssigned}
              subtitle={`${assignmentRate}% deployed`}
              icon={<Package size={16} color="var(--mantine-color-blue-6)" />}
              status={assignmentRate >= 85 ? 'good' : 'warning'}
            />
            <MetricCard
              title="Active Users (28d)"
              value={activeUsers}
              trend={-2.3}
              icon={<Activity size={16} color="var(--mantine-color-blue-6)" />}
              status="warning"
            />
            <MetricCard
              title="Monthly Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              trend={8.7}
              icon={<DollarSign size={16} color="var(--mantine-color-blue-6)" />}
              status="good"
            />
          </SimpleGrid>
          <Text size="xs" c="dimmed" mt="sm">
            {customers.length} customers • {totalSubscriptions} subscriptions • {totalProducts} product types
          </Text>
        </Card>

          <ExpandableSection
            title="By Customer"
            defaultOpen
            helpContent="Summary of all reseller customers and their Microsoft subscription activity."
          >
            <Inline justify="space-between" mb="sm" wrap="wrap">
              <div>
                <Text size="xs" c="dimmed">
                  Summary
                </Text>
                <Text size="sm" c="dimmed">
                  {customers.length} customers • {customers.reduce((sum, c) => sum + c.subscriptions, 0)} subscriptions
                </Text>
              </div>
              <TextInput
                placeholder="Search customers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                leftSection={<Search size={16} />}
                w={300}
              />
            </Inline>

            <Card>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', background: 'var(--mantine-color-gray-0)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: 'var(--mantine-color-gray-6)' }}>Customer</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: 'var(--mantine-color-gray-6)' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: 'var(--mantine-color-gray-6)' }}>Subscriptions</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: 'var(--mantine-color-gray-6)' }}>Last Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((customer) => {
                    const isExpanded = expandedCustomer === customer.name;
                    const products = customerSubscriptionsByProduct[customer.name] || [];

                    return (
                      <React.Fragment key={customer.name}>
                        <tr style={{ borderBottom: '1px solid var(--mantine-color-gray-1)' }}>
                          <td style={{ padding: '12px 16px', fontSize: 14 }}>
                            <button
                              onClick={() => setExpandedCustomer(isExpanded ? null : customer.name)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                color: 'var(--mantine-color-blue-7)',
                                background: 'transparent',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                              }}
                            >
                              {isExpanded ? (
                                <ChevronUp size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                              ) : (
                                <ChevronDown size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                              )}
                              <span style={{ color: 'var(--mantine-color-gray-9)', fontWeight: 600 }}>{customer.name}</span>
                            </button>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <Badge
                              size="sm"
                              variant="outline"
                              color={customer.status === 'Enabled' ? 'success' : 'pending'}
                            >
                              {customer.status}
                            </Badge>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <Text size="sm" c="dimmed">
                              {customer.subscriptions}
                            </Text>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <Text size="sm" c="dimmed">
                              {customer.lastSync}
                            </Text>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr style={{ background: 'var(--mantine-color-gray-0)' }}>
                            <td colSpan={4} style={{ padding: 12 }}>
                              <Text size="xs" c="dimmed" mb="xs">
                                Subscriptions by product type
                              </Text>
                              <Stack gap="xs">
                                {products.map((product) => (
                                  <Card key={product.product}>
                                    <Inline justify="space-between" wrap="nowrap">
                                      <div>
                                        <Text fw={700} size="sm">
                                          {product.product}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                          {product.subscriptions} subscriptions • {product.totalSeats} seats • {product.assignedSeats} assigned (
                                          {product.totalSeats ? Math.round((product.assignedSeats / product.totalSeats) * 100) : 0}%)
                                        </Text>
                                      </div>
                                      <Inline gap="xs" wrap="nowrap">
                                        <Badge color={product.status === 'Healthy' ? 'success' : 'pending'} variant="filled" size="sm">
                                          {product.status}
                                        </Badge>
                                        <Text fw={700} size="sm">
                                          ${product.revenue.toLocaleString()}/mo
                                        </Text>
                                      </Inline>
                                    </Inline>
                                  </Card>
                                ))}
                              </Stack>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              {totalPages > 1 && (
                <Inline justify="flex-end" align="center" gap="md" style={{ paddingTop: 12, borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                  <Text size="sm" c="dimmed">
                    {pageStart + 1}-{Math.min(pageEnd, filteredCustomers.length)} of {filteredCustomers.length}
                  </Text>
                  <Inline gap="xs" align="center" wrap="nowrap">
                    <ActionIcon
                      aria-label="Previous page"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <ChevronLeft size={18} />
                    </ActionIcon>
                    <TextInput
                      value={String(currentPage)}
                      onChange={(e) => setCurrentPage(Number(e.currentTarget.value) || 1)}
                      w={72}
                      styles={{ input: { textAlign: 'center' } }}
                    />
                    <ActionIcon
                      aria-label="Next page"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <ChevronRight size={18} />
                    </ActionIcon>
                  </Inline>
                </Inline>
              )}
            </Card>
          </ExpandableSection>

          <ExpandableSection
            title="By Product"
            defaultOpen
            helpContent="Roll-up view of Microsoft subscription insights grouped by product type."
          >
            <Text size="xs" c="dimmed" mb="sm">
              Product types
            </Text>
            <Stack gap="sm">
              {productTypeSummaries.map((product) => {
                const customersForProduct = (productTypeCustomers[product.name] || [])
                  .slice()
                  .sort((a, b) => (productSort === 'seats' ? b.seats - a.seats : b.value - a.value));

                return (
                  <ExpandableSection
                    key={product.name}
                    title={
                      <Inline justify="space-between" wrap="nowrap" style={{ width: '100%' }}>
                        <div>
                          <Text fw={700} size="sm">
                            {product.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {product.subscriptions} subscriptions
                          </Text>
                          <Text size="xs" c="dimmed">
                            {product.totalSeats} seats • {product.assignedSeats} assigned (
                            {product.totalSeats ? Math.round((product.assignedSeats / product.totalSeats) * 100) : 0}%)
                          </Text>
                        </div>
                        <Inline gap="xs" wrap="nowrap">
                          <Badge color={product.status === 'Healthy' ? 'success' : 'pending'} variant="filled" size="sm">
                            {product.status}
                          </Badge>
                          <Text fw={700} size="sm">
                            ${product.revenue.toLocaleString()}/mo
                          </Text>
                        </Inline>
                      </Inline>
                    }
                  >
                    <Card>
                      <Inline justify="space-between" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)', paddingBottom: 10, marginBottom: 10 }}>
                        <Text size="xs" c="dimmed">
                          Customer
                        </Text>
                        <Inline gap="xl">
                          <button
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontSize: 12,
                              fontWeight: 800,
                              color: productSort === 'seats' ? 'var(--mantine-color-gray-9)' : 'var(--mantine-color-gray-6)',
                            }}
                            onClick={() => setProductSort('seats')}
                          >
                            Seats
                            <ChevronDown size={12} style={{ opacity: productSort === 'seats' ? 1 : 0.4 }} />
                          </button>
                          <button
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontSize: 12,
                              fontWeight: 800,
                              color: productSort === 'value' ? 'var(--mantine-color-gray-9)' : 'var(--mantine-color-gray-6)',
                            }}
                            onClick={() => setProductSort('value')}
                          >
                            Value
                            <ChevronDown size={12} style={{ opacity: productSort === 'value' ? 1 : 0.4 }} />
                          </button>
                        </Inline>
                      </Inline>

                      <Stack gap="xs">
                        {customersForProduct.map((item) => (
                          <Inline key={item.customer} justify="space-between" wrap="nowrap">
                            <Text size="sm">{item.customer}</Text>
                            <Inline gap="xl" wrap="nowrap">
                              <Text size="sm" c="dimmed">
                                {item.seats}
                              </Text>
                              <Text size="sm" c="dimmed">
                                ${item.value.toLocaleString()}/mo
                              </Text>
                            </Inline>
                          </Inline>
                        ))}
                      </Stack>
                    </Card>
                  </ExpandableSection>
                );
              })}
            </Stack>
          </ExpandableSection>

        </Stack>
      </main>

      <div style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <ActionIcon
          aria-label="Help"
          customFill="var(--mantine-color-blue-6)"
          customBorder="1px solid var(--mantine-color-blue-7)"
          style={{ color: 'white', boxShadow: 'var(--mantine-shadow-lg)' }}
        >
          <HelpCircle size={18} />
        </ActionIcon>
      </div>
    </OperationsLayout>
  );
};
