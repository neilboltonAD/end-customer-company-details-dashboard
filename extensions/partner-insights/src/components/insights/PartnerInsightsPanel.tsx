import React, { useState } from 'react';
import {
  Paper, Title, Group, Card, Text, Accordion, Table, ThemeIcon,
  ActionIcon, Tooltip, Badge, Progress, Modal, Stack, Alert, Button, Divider, TextInput
} from '@mantine/core';
import {
  IconTrendingUp, IconTrendingDown, IconMinus, IconCurrencyDollar, IconUsers,
  IconPackage, IconActivity, IconCalendar, IconX, IconEdit, IconRotate,
  IconInfoCircle, IconChevronDown, IconExternalLink
} from '@tabler/icons-react';
import {
  SubscriptionData, OfficeUsageData,
  mockSubscriptions, mockOfficeUsage, mockRevenueBreakdown,
  calculateOverview, getChurnRisk, getTermTypeColor, formatCurrency, groupSubscriptionsByProduct
} from '../../api/insightsData';

// MetricCard component
interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  subtitle?: string;
  status?: 'good' | 'warning' | 'poor' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon, subtitle, status = 'neutral' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'green';
      case 'warning': return 'yellow';
      case 'poor': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Card withBorder padding="sm" radius="md" bg={status !== 'neutral' ? `${getStatusColor()}.0` : undefined}>
      <Group gap="sm" wrap="nowrap">
        <ThemeIcon size="lg" color="blue" variant="light" radius="md">
          {icon}
        </ThemeIcon>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text size="xs" c="dimmed">{title}</Text>
          <Group gap="xs" align="center">
            <Text size="lg" fw={700}>{value}</Text>
            {trend !== undefined && (
              <Group gap={2}>
                {trend > 0 ? <IconTrendingUp size={14} color="green" /> :
                 trend < 0 ? <IconTrendingDown size={14} color="red" /> :
                 <IconMinus size={14} color="gray" />}
                <Text size="xs" fw={500} c={trend > 0 ? 'green' : trend < 0 ? 'red' : 'gray'}>
                  {trend > 0 ? '+' : ''}{trend}%
                </Text>
              </Group>
            )}
          </Group>
          {subtitle && <Text size="xs" c="dimmed">{subtitle}</Text>}
        </div>
      </Group>
    </Card>
  );
};

// SubscriptionRow component
const SubscriptionRow: React.FC<{
  subscription: SubscriptionData;
  onRename: (id: string, newName: string) => void;
}> = ({ subscription, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subscription.displayName);
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);

  const deploymentPercentage = (subscription.assignedSeats / subscription.seats) * 100;
  const usagePercentage = subscription.assignedSeats > 0 ? (subscription.activeUsers / subscription.assignedSeats) * 100 : 0;
  const isCustomName = subscription.displayName !== subscription.sku;

  const handleSaveName = () => {
    onRename(subscription.id, editName);
    setIsEditing(false);
  };

  const handleRevertConfirm = () => {
    onRename(subscription.id, subscription.sku);
    setShowRevertConfirm(false);
  };

  const getStatusBadge = () => {
    switch (subscription.status) {
      case 'active':
        return <Badge color="green" size="xs" variant="light">Active</Badge>;
      case 'suspended':
        return <Badge color="yellow" size="xs" variant="light">Suspended</Badge>;
      case 'expired':
        return <Badge color="red" size="xs" variant="light">Expired</Badge>;
    }
  };

  return (
    <Card withBorder padding="sm" radius="md" mb="xs">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        {/* Left side - Product info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Group gap="xs" mb={4}>
            <Text size="sm" fw={600}>{subscription.productName}</Text>
            {getStatusBadge()}
          </Group>

          {/* Editable Name */}
          {isEditing ? (
            <Group gap="xs" mb="xs">
              <TextInput
                size="xs"
                value={editName}
                onChange={(e) => setEditName(e.currentTarget.value)}
                style={{ width: 180 }}
                autoFocus
              />
              <Button size="xs" variant="light" onClick={handleSaveName}>Save</Button>
              <Button size="xs" variant="subtle" color="gray" onClick={() => { setIsEditing(false); setEditName(subscription.displayName); }}>Cancel</Button>
            </Group>
          ) : (
            <Group gap={4} mb="xs">
              <Badge variant="light" color="gray" size="sm">
                <Group gap={4}>
                  <Text size="xs" c="dimmed">{isCustomName ? 'Nickname:' : 'Name:'}</Text>
                  <Text size="xs" fw={500}>{subscription.displayName}</Text>
                </Group>
              </Badge>
              <ActionIcon size="xs" variant="subtle" onClick={() => setIsEditing(true)}>
                <IconEdit size={12} />
              </ActionIcon>
              {isCustomName && (
                <Tooltip label="Revert to original">
                  <ActionIcon size="xs" variant="subtle" color="orange" onClick={() => setShowRevertConfirm(true)}>
                    <IconRotate size={12} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          )}

          {subscription.renewalDate && (
            <Group gap="xs">
              <Text size="xs" c="dimmed">Renewal: {subscription.renewalDate}</Text>
              <Button size="xs" variant="light" compact>Change</Button>
            </Group>
          )}

          <Text size="sm" fw={700} mt="xs">{formatCurrency(subscription.revenue)}<Text span size="xs" c="dimmed">/mo</Text></Text>
        </div>

        {/* Right side - Metrics */}
        <Stack gap={4} style={{ width: 220 }} pl="md" style={{ borderLeft: '1px solid var(--mantine-color-gray-2)' }}>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Total Seats</Text>
            <Group gap="xs">
              <Text size="sm" fw={600}>{subscription.seats}</Text>
              <Button size="xs" variant="light" compact>Change</Button>
            </Group>
          </Group>

          <div>
            <Group justify="space-between" mb={2}>
              <Text size="xs" c="dimmed">Assigned</Text>
              <Text size="xs">{subscription.assignedSeats} ({deploymentPercentage.toFixed(0)}%)</Text>
            </Group>
            <Progress
              value={deploymentPercentage}
              size="xs"
              color={deploymentPercentage >= 90 ? 'green' : deploymentPercentage >= 70 ? 'yellow' : 'red'}
            />
          </div>

          <div>
            <Group justify="space-between" mb={2}>
              <Text size="xs" c="dimmed">Active</Text>
              <Text size="xs">{subscription.activeUsers} ({usagePercentage.toFixed(0)}%)</Text>
            </Group>
            <Progress
              value={usagePercentage}
              size="xs"
              color={usagePercentage >= 80 ? 'green' : usagePercentage >= 60 ? 'yellow' : 'red'}
            />
          </div>
        </Stack>
      </Group>

      {/* Revert Confirmation Modal */}
      <Modal
        opened={showRevertConfirm}
        onClose={() => setShowRevertConfirm(false)}
        title="Revert Subscription Name?"
        size="sm"
        centered
      >
        <Text size="sm" mb="md">Are you sure you want to revert to the original name?</Text>
        <Card withBorder padding="xs" bg="gray.0" mb="md">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Current:</Text>
            <Text size="sm" fw={500}>{subscription.displayName}</Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Original:</Text>
            <Text size="sm" fw={500}>{subscription.sku}</Text>
          </Group>
        </Card>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setShowRevertConfirm(false)}>Cancel</Button>
          <Button color="orange" onClick={handleRevertConfirm}>Revert</Button>
        </Group>
      </Modal>
    </Card>
  );
};

// Office Usage Card
const OfficeUsageCard: React.FC<{ data: OfficeUsageData }> = ({ data }) => {
  return (
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between" mb="md">
        <Text fw={600}>{data.product}</Text>
        <div style={{ textAlign: 'right' }}>
          <Text size="lg" fw={700}>{data.activeUsers}/{data.totalUsers}</Text>
          <Text size="xs" c="dimmed">{data.usagePercentage.toFixed(1)}% active</Text>
        </div>
      </Group>

      <Progress
        value={data.usagePercentage}
        size="md"
        color={data.usagePercentage >= 80 ? 'green' : data.usagePercentage >= 60 ? 'yellow' : 'red'}
        mb="md"
      />

      <Stack gap="xs">
        {data.services.map((service) => (
          <Group key={service.name} justify="space-between">
            <Text size="sm">{service.name}</Text>
            <Group gap="xs">
              <Text size="sm" c="dimmed">{service.activeUsers} users</Text>
              <Badge
                size="sm"
                color={service.percentage >= 80 ? 'green' : service.percentage >= 60 ? 'yellow' : 'red'}
                variant="light"
              >
                {service.percentage.toFixed(0)}%
              </Badge>
            </Group>
          </Group>
        ))}
      </Stack>
    </Card>
  );
};

// All Subscriptions Modal
const AllSubscriptionsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  subscriptions: SubscriptionData[];
}> = ({ open, onClose, subscriptions }) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const grouped = groupSubscriptionsByProduct(subscriptions);

  const toggleGroup = (productName: string) => {
    setExpandedGroups(prev =>
      prev.includes(productName)
        ? prev.filter(n => n !== productName)
        : [...prev, productName]
    );
  };

  const getGroupTotals = (subs: SubscriptionData[]) => ({
    totalSeats: subs.reduce((sum, s) => sum + s.seats, 0),
    totalAssigned: subs.reduce((sum, s) => sum + s.assignedSeats, 0),
    totalActive: subs.reduce((sum, s) => sum + s.activeUsers, 0),
    totalRevenue: subs.reduce((sum, s) => sum + s.revenue, 0),
    hasChurnRisk: subs.some(s => getChurnRisk(s) !== 'low')
  });

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title={<Text fw={600}>Microsoft Subscription Summary</Text>}
      size="xl"
      centered
    >
      <Stack gap="sm">
        {Object.entries(grouped).map(([productName, subs]) => {
          const isExpanded = expandedGroups.includes(productName);
          const totals = getGroupTotals(subs);
          const assignmentRate = ((totals.totalAssigned / totals.totalSeats) * 100).toFixed(0);

          return (
            <Card key={productName} withBorder padding={0} radius="md">
              <div
                onClick={() => toggleGroup(productName)}
                style={{ padding: '12px', cursor: 'pointer', backgroundColor: 'var(--mantine-color-gray-0)' }}
              >
                <Group justify="space-between">
                  <Group gap="xs">
                    <Text size="sm" fw={600}>{productName}</Text>
                    <Text size="xs" c="dimmed">({subs.length} subscription{subs.length > 1 ? 's' : ''})</Text>
                    {totals.hasChurnRisk && (
                      <Badge size="xs" color="red" variant="light">⚠ Attention needed</Badge>
                    )}
                  </Group>
                  <Group gap="md">
                    <div style={{ textAlign: 'right' }}>
                      <Text size="xs" c="dimmed">{totals.totalSeats} seats • {assignmentRate}% assigned</Text>
                      <Text size="sm" fw={600}>{formatCurrency(totals.totalRevenue)}/mo</Text>
                    </div>
                    <IconChevronDown size={16} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </Group>
                </Group>
              </div>

              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                  {subs.map((sub, idx) => {
                    const churnRisk = getChurnRisk(sub);
                    const colors = getTermTypeColor(sub.termType);

                    return (
                      <div
                        key={sub.id}
                        style={{
                          padding: '8px 12px',
                          borderTop: idx > 0 ? '1px solid var(--mantine-color-gray-1)' : 'none',
                          backgroundColor: churnRisk === 'high' ? 'var(--mantine-color-red-0)' : churnRisk === 'medium' ? 'var(--mantine-color-yellow-0)' : 'white'
                        }}
                      >
                        <Group justify="space-between">
                          <div>
                            <Group gap="xs" mb={2}>
                              <Badge size="xs" color={colors.text.split('.')[0]} variant="light">
                                {sub.termType}
                              </Badge>
                              {churnRisk === 'high' && <Badge size="xs" color="red" variant="light">⚠ High Churn Risk</Badge>}
                              {churnRisk === 'medium' && <Badge size="xs" color="yellow" variant="light">⚡ Monitor</Badge>}
                            </Group>
                            <Text size="xs" c="dimmed">
                              {sub.displayName !== sub.sku && <Text span fw={500} c="dark">{sub.displayName} • </Text>}
                              <Text span ff="monospace">{sub.id.substring(0, 8)}...</Text>
                            </Text>
                          </div>
                          <Group gap="xl">
                            <div style={{ textAlign: 'center' }}>
                              <Text size="xs" c="dimmed">Seats</Text>
                              <Text size="sm" fw={600}>{sub.seats}</Text>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <Text size="xs" c="dimmed">Assigned</Text>
                              <Text size="sm" fw={600} c={(sub.assignedSeats / sub.seats) < 0.7 ? 'orange' : undefined}>
                                {sub.assignedSeats} ({((sub.assignedSeats / sub.seats) * 100).toFixed(0)}%)
                              </Text>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <Text size="xs" c="dimmed">Active</Text>
                              <Text size="sm" fw={600} c={sub.assignedSeats > 0 && (sub.activeUsers / sub.assignedSeats) < 0.6 ? 'red' : undefined}>
                                {sub.activeUsers} ({sub.assignedSeats > 0 ? ((sub.activeUsers / sub.assignedSeats) * 100).toFixed(0) : 0}%)
                              </Text>
                            </div>
                            <div style={{ textAlign: 'right', width: 80 }}>
                              <Text size="xs" c="dimmed">Revenue</Text>
                              <Text size="sm" fw={600}>{formatCurrency(sub.revenue)}</Text>
                            </div>
                          </Group>
                        </Group>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}

        {/* Summary Footer */}
        <Alert color="blue" variant="light">
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Total: {subscriptions.length} subscriptions across {Object.keys(grouped).length} products
            </Text>
            <Text size="sm" fw={700}>{formatCurrency(subscriptions.reduce((sum, s) => sum + s.revenue, 0))}/mo</Text>
          </Group>
        </Alert>
      </Stack>
    </Modal>
  );
};

// Main Panel Component
export const PartnerInsightsPanel: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>(mockSubscriptions);
  const [showAllSubscriptionsModal, setShowAllSubscriptionsModal] = useState(false);

  const handleRenameSubscription = (id: string, newName: string) => {
    setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...sub, displayName: newName } : sub));
  };

  const overview = calculateOverview(subscriptions);

  return (
    <Stack gap="md">
      {/* Overview Metrics */}
      <div>
        <Text size="sm" fw={600} mb="xs">Overview</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          <MetricCard
            title="Total Seats"
            value={overview.totalSeats}
            trend={overview.trends.seats}
            icon={<IconUsers size={18} />}
            status="good"
          />
          <MetricCard
            title="Assigned Seats"
            value={overview.assignedSeats}
            subtitle={`${((overview.assignedSeats / overview.totalSeats) * 100).toFixed(0)}% deployed`}
            icon={<IconPackage size={18} />}
            status="good"
          />
          <MetricCard
            title="Active Users (28d)"
            value={overview.activeUsers}
            trend={overview.trends.activeUsers}
            icon={<IconActivity size={18} />}
            status="warning"
          />
          <MetricCard
            title="Monthly Revenue"
            value={formatCurrency(overview.monthlyRevenue)}
            trend={overview.trends.revenue}
            icon={<IconCurrencyDollar size={18} />}
            status="good"
          />
        </div>
      </div>

      {/* Subscriptions */}
      <Accordion defaultValue="subscriptions" variant="contained">
        <Accordion.Item value="subscriptions">
          <Accordion.Control>
            <Group justify="space-between" pr="md">
              <Text fw={500}>Subscriptions ({subscriptions.length})</Text>
              <Button
                size="xs"
                variant="light"
                onClick={(e) => { e.stopPropagation(); setShowAllSubscriptionsModal(true); }}
              >
                Summarise all my Microsoft subscriptions
              </Button>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="xs">
              {subscriptions.map((sub) => (
                <SubscriptionRow
                  key={sub.id}
                  subscription={sub}
                  onRename={handleRenameSubscription}
                />
              ))}
            </Stack>

            <Alert color="blue" variant="light" mt="md" icon={<IconInfoCircle size={16} />}>
              <Text size="xs" fw={500} mb={4}>💡 Utilization Insights</Text>
              <Text size="xs">
                • You have <strong>{overview.totalSeats - overview.assignedSeats} unassigned seats</strong> across all subscriptions.<br />
                • Only <strong>{((overview.activeUsers / overview.assignedSeats) * 100).toFixed(1)}% of assigned users</strong> are actively using their licenses.
              </Text>
            </Alert>
          </Accordion.Panel>
        </Accordion.Item>

        {/* Office Usage */}
        <Accordion.Item value="office-usage">
          <Accordion.Control>
            <Text fw={500}>Office 365 Usage Analytics</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              {mockOfficeUsage.map((usage, idx) => (
                <OfficeUsageCard key={idx} data={usage} />
              ))}
            </Stack>

            <Alert color="yellow" variant="light" mt="md" icon={<IconInfoCircle size={16} />}>
              <Text size="xs" fw={500} mb={4}>💡 Service Usage Recommendations</Text>
              <Text size="xs">
                • <strong>SharePoint usage is at 59.9%</strong> - Consider training sessions on document collaboration.<br />
                • <strong>Teams has strong adoption (85.6%)</strong> - Leverage this success to promote other tools.
              </Text>
            </Alert>
          </Accordion.Panel>
        </Accordion.Item>

        {/* Revenue Analytics */}
        <Accordion.Item value="revenue">
          <Accordion.Control>
            <Text fw={500}>Revenue Analytics</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Group justify="space-between" mb="md">
              <Text size="sm" fw={600}>Monthly Recurring Revenue</Text>
              <div style={{ textAlign: 'right' }}>
                <Text size="xl" fw={700}>{formatCurrency(overview.monthlyRevenue)}</Text>
                <Group gap={4} justify="flex-end">
                  <IconTrendingUp size={14} color="green" />
                  <Text size="xs" fw={500} c="green">+8.7% MoM</Text>
                </Group>
              </div>
            </Group>

            <Stack gap="xs">
              {mockRevenueBreakdown.map((product) => (
                <Card key={product.name} withBorder padding="xs" radius="md">
                  <Group justify="space-between" mb={4}>
                    <Text size="xs" fw={500}>{product.name}</Text>
                    <Text size="xs" fw={700}>{formatCurrency(product.revenue)} <Text span c="dimmed">({product.percentage.toFixed(0)}%)</Text></Text>
                  </Group>
                  <Progress value={product.percentage} size="xs" color="blue" />
                </Card>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      {/* Data Source */}
      <Alert variant="light" color="gray" py="xs">
        <Group gap="xs">
          <IconInfoCircle size={14} />
          <Text size="xs" c="dimmed">
            Data from Microsoft Partner Center Insights API. Updated daily.
            <Text
              component="a"
              href="https://learn.microsoft.com/en-us/partner-center/insights/insights-programmatic-prerequisites"
              target="_blank"
              size="xs"
              c="blue"
              ml={4}
            >
              Learn more <IconExternalLink size={10} style={{ verticalAlign: 'middle' }} />
            </Text>
          </Text>
        </Group>
      </Alert>

      {/* All Subscriptions Modal */}
      <AllSubscriptionsModal
        open={showAllSubscriptionsModal}
        onClose={() => setShowAllSubscriptionsModal(false)}
        subscriptions={subscriptions}
      />
    </Stack>
  );
};

export default PartnerInsightsPanel;

