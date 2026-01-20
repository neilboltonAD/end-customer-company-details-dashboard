import React, { useState } from 'react';
import { ExpandableSection } from '../layout/ExpandableSection';
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Package, Activity, Calendar, Edit2, RotateCcw } from 'lucide-react';
import { ActionIcon, Badge, Button, Card, ConfirmationModal, Inline, Modal, Progress, Stack, Text, TextInput, Title } from 'components/DesignSystem';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  subtitle?: string;
  status?: 'good' | 'warning' | 'poor' | 'neutral';
}

// Compact horizontal metric card
const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, trendLabel, icon, subtitle, status = 'neutral' }) => {
  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp size={14} color="var(--mantine-color-green-6)" />;
    if (trend < 0) return <TrendingDown size={14} color="var(--mantine-color-red-6)" />;
    return <Minus size={14} color="var(--mantine-color-gray-6)" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return '';
    if (trend > 0) return 'var(--mantine-color-green-6)';
    if (trend < 0) return 'var(--mantine-color-red-6)';
    return 'var(--mantine-color-gray-6)';
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'good':
        return <Badge color="success" variant="outline">Good</Badge>;
      case 'warning':
        return <Badge color="pending" variant="outline">Monitor</Badge>;
      case 'poor':
        return <Badge color="danger" variant="outline">Risk</Badge>;
      default:
        return <Badge color="default" variant="outline">Info</Badge>;
    }
  };

  return (
    <Card>
      <Inline justify="space-between" align="flex-start" wrap="nowrap">
        <Inline gap="sm" align="flex-start" wrap="nowrap">
          <div style={{ padding: 8, background: 'var(--mantine-color-blue-1)', borderRadius: 8, flexShrink: 0 }}>
            {icon}
          </div>
          <Stack gap={2}>
            <Inline gap="xs">
              <Text size="sm" c="dimmed">
                {title}
              </Text>
              {getStatusBadge()}
            </Inline>
            <Inline gap="sm" align="baseline">
              <Title order={4} fw={800} m={0}>
                {value}
              </Title>
              {trend !== undefined && (
                <Inline gap={4} align="center" wrap="nowrap">
                  {getTrendIcon()}
                  <Text size="sm" fw={700} style={{ color: getTrendColor() }}>
                    {trend > 0 ? '+' : ''}
                    {trend}%
                  </Text>
                  {trendLabel && (
                    <Text size="sm" c="dimmed">
                      {trendLabel}
                    </Text>
                  )}
                </Inline>
              )}
            </Inline>
            {subtitle && (
              <Text size="sm" c="dimmed">
                {subtitle}
              </Text>
            )}
          </Stack>
        </Inline>
      </Inline>
    </Card>
  );
};

interface SubscriptionData {
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

// Revert Confirmation Modal
const RevertConfirmModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentName: string;
  originalName: string;
}> = ({ open, onClose, onConfirm, currentName, originalName }) => {
  return (
    <ConfirmationModal
      opened={open}
      onClose={onClose}
      title="Revert Subscription Name?"
      confirmLabel="Revert"
      cancelLabel="Cancel"
      confirmVariant="danger"
      onConfirm={onConfirm}
      onCancel={onClose}
      size="sm"
    >
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          Are you sure you want to revert the subscription nickname back to the original name?
        </Text>
        <Card>
          <Stack gap={6}>
            <Inline justify="space-between">
              <Text size="sm" c="dimmed">
                Current
              </Text>
              <Text size="sm" fw={700}>
                {currentName}
              </Text>
            </Inline>
            <Inline justify="space-between">
              <Text size="sm" c="dimmed">
                Original
              </Text>
              <Text size="sm" fw={700}>
                {originalName}
              </Text>
            </Inline>
          </Stack>
        </Card>
      </Stack>
    </ConfirmationModal>
  );
};

// Compact subscription row
const SubscriptionRow: React.FC<{
  subscription: SubscriptionData;
  onRename: (id: string, newName: string) => void;
}> = ({ subscription, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subscription.displayName);
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);
  
  const deploymentPercentage = (subscription.assignedSeats / subscription.seats) * 100;
  const usagePercentage = subscription.assignedSeats > 0 ? (subscription.activeUsers / subscription.assignedSeats) * 100 : 0;
  
  // Check if name has been customized from the default SKU
  const isCustomName = subscription.displayName !== subscription.sku;

  const handleRevertConfirm = () => {
    onRename(subscription.id, subscription.sku);
    setShowRevertConfirm(false);
  };

  const getStatusBadge = () => {
    switch (subscription.status) {
      case 'active':
        return (
          <Badge color="success" variant="outline">
            Active
          </Badge>
        );
      case 'suspended':
        return (
          <Badge color="pending" variant="outline">
            Suspended
          </Badge>
        );
      case 'expired':
        return (
          <Badge color="danger" variant="outline">
            Expired
          </Badge>
        );
    }
  };

  const handleSaveName = () => {
    onRename(subscription.id, editName);
    setIsEditing(false);
  };

  const ChangeButton = ({ onClick }: { onClick?: () => void }) => (
    <Button variant="link" size="xs" onClick={onClick}>
      Change
    </Button>
  );

  return (
    <Card interactive>
      <Inline justify="space-between" align="flex-start" wrap="nowrap">
        {/* Left side - Product info */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
          {/* Product name and editable subscription name */}
          <Inline gap="sm" style={{ marginBottom: 6 }}>
            <Title order={5} fw={700} m={0}>
              {subscription.productName}
            </Title>
            {getStatusBadge()}
            
            {/* Editable Subscription Name/Nickname */}
            <div>
              {isEditing ? (
                <Inline gap="xs" align="center">
                  <TextInput
                    value={editName}
                    onChange={(e) => setEditName(e.currentTarget.value)}
                    size="xs"
                    w={240}
                    autoFocus
                  />
                  <Button variant="link" size="xs" onClick={handleSaveName}>
                    Save
                  </Button>
                  <Button
                    variant="link"
                    size="xs"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(subscription.displayName);
                    }}
                  >
                    Cancel
                  </Button>
                </Inline>
              ) : (
                <Inline gap="xs" align="center">
                  <Text size="sm" c="dimmed">
                    {isCustomName ? 'Nickname:' : 'Name:'}
                  </Text>
                  <Text size="sm" fw={700}>
                    {subscription.displayName}
                  </Text>
                  <ActionIcon size="xs" onClick={() => setIsEditing(true)} aria-label="Edit nickname">
                    <Edit2 size={14} />
                  </ActionIcon>
                  {isCustomName && (
                    <ActionIcon
                      size="xs"
                      onClick={() => setShowRevertConfirm(true)}
                      aria-label="Revert to original name"
                    >
                      <RotateCcw size={14} />
                    </ActionIcon>
                  )}
                </Inline>
              )}
            </div>
            
            {/* Revert Confirmation Modal */}
            <RevertConfirmModal
              open={showRevertConfirm}
              onClose={() => setShowRevertConfirm(false)}
              onConfirm={handleRevertConfirm}
              currentName={subscription.displayName}
              originalName={subscription.sku}
            />
          </Inline>
          
          {/* Renewal with Change button */}
          {subscription.renewalDate && (
            <Inline gap="xs">
              <Text size="sm" c="dimmed">
                Renewal: {subscription.renewalDate}
              </Text>
              <ChangeButton />
            </Inline>
          )}
          
          {/* Revenue */}
          <Inline gap={6} mt="xs">
            <Text fw={800}>${subscription.revenue.toLocaleString()}</Text>
            <Text size="sm" c="dimmed">
              /mo
            </Text>
          </Inline>
        </div>

        {/* Right side - Metrics as compact list with progress bars */}
        <div style={{ width: 300, borderLeft: '1px solid var(--mantine-color-gray-3)', paddingLeft: 16 }}>
          <Stack gap={8}>
            <Inline justify="space-between" align="center">
              <Text size="sm" c="dimmed">
                Total Seats
              </Text>
              <Inline gap="xs" align="center">
                <Text fw={800}>{subscription.seats}</Text>
                <ChangeButton />
              </Inline>
            </Inline>
          
          {/* Assigned with progress bar */}
            <Stack gap={4}>
              <Inline justify="space-between">
                <Text size="sm" c="dimmed">
                  Assigned
                </Text>
                <Text size="sm" c="dimmed">
                  {subscription.assignedSeats} ({deploymentPercentage.toFixed(0)}%)
                </Text>
              </Inline>
              <Progress value={Math.min(100, Math.max(0, deploymentPercentage))} size="xs" />
            </Stack>
          
          {/* Active Users with progress bar */}
            <Stack gap={4}>
              <Inline justify="space-between">
                <Text size="sm" c="dimmed">
                  Active
                </Text>
                <Text size="sm" c="dimmed">
                  {subscription.activeUsers} ({usagePercentage.toFixed(0)}%)
                </Text>
              </Inline>
              <Progress value={Math.min(100, Math.max(0, usagePercentage))} size="xs" />
            </Stack>
          </Stack>
        </div>
      </Inline>
    </Card>
  );
};

// Grouped Subscriptions Modal - Groups by Offer/Edition
const AllSubscriptionsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  subscriptions: SubscriptionData[];
}> = ({ open, onClose, subscriptions }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group subscriptions by productName (Offer/Edition)
  const groupedSubscriptions = subscriptions.reduce((acc, sub) => {
    if (!acc[sub.productName]) {
      acc[sub.productName] = [];
    }
    acc[sub.productName].push(sub);
    return acc;
  }, {} as Record<string, SubscriptionData[]>);

  // Calculate churn risk based on usage/assignment
  const getChurnRisk = (sub: SubscriptionData) => {
    const assignmentRate = (sub.assignedSeats / sub.seats) * 100;
    const usageRate = sub.assignedSeats > 0 ? (sub.activeUsers / sub.assignedSeats) * 100 : 0;
    
    if (assignmentRate < 50 || usageRate < 40) return 'high';
    if (assignmentRate < 70 || usageRate < 60) return 'medium';
    return 'low';
  };

  const getChurnRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge size="xs" color="danger" variant="outline">⚠ High Churn Risk</Badge>;
      case 'medium':
        return <Badge size="xs" color="pending" variant="outline">⚡ Monitor</Badge>;
      default:
        return null;
    }
  };

  const toggleGroup = (productName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productName)) {
        newSet.delete(productName);
      } else {
        newSet.add(productName);
      }
      return newSet;
    });
  };

  // Calculate group totals
  const getGroupTotals = (subs: SubscriptionData[]) => ({
    totalSeats: subs.reduce((sum, s) => sum + s.seats, 0),
    totalAssigned: subs.reduce((sum, s) => sum + s.assignedSeats, 0),
    totalActive: subs.reduce((sum, s) => sum + s.activeUsers, 0),
    totalRevenue: subs.reduce((sum, s) => sum + s.revenue, 0),
    subscriptionCount: subs.length,
    hasChurnRisk: subs.some(s => getChurnRisk(s) !== 'low')
  });

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Microsoft Subscription Summary"
      size="xl"
      actions={[
        {
          id: 'close',
          label: 'Close',
          variant: 'outline',
          closeOnClick: true,
        },
      ]}
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Stack gap="xs">
            {Object.entries(groupedSubscriptions).map(([productName, subs]) => {
              const isExpanded = expandedGroups.has(productName);
              const totals = getGroupTotals(subs);
              const assignmentRate = ((totals.totalAssigned / totals.totalSeats) * 100).toFixed(0);
              
              return (
                <Card key={productName} style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(productName)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: 'var(--mantine-color-gray-0)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Inline gap="sm" align="center" wrap="nowrap">
                      <Text fw={800} size="sm">{productName}</Text>
                      <Text size="xs" c="dimmed">({subs.length} subscription{subs.length > 1 ? 's' : ''})</Text>
                      {totals.hasChurnRisk && (
                        <Badge size="xs" color="danger" variant="outline">⚠ Attention needed</Badge>
                      )}
                    </Inline>
                    <Inline gap="md" align="center" wrap="nowrap">
                      <div style={{ textAlign: 'right' }}>
                        <Text size="xs" c="dimmed">{totals.totalSeats} seats • {assignmentRate}% assigned</Text>
                        <Text size="sm" fw={800}>${totals.totalRevenue.toLocaleString()}/mo</Text>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        style={{
                          color: 'var(--mantine-color-gray-6)',
                          transform: isExpanded ? 'rotate(180deg)' : undefined,
                          transition: 'transform 120ms ease',
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Inline>
                  </button>
                  
                  {/* Expanded Subscriptions */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                      {subs.map((sub, idx) => {
                        const churnRisk = getChurnRisk(sub);
                        const assignRate = ((sub.assignedSeats / sub.seats) * 100).toFixed(0);
                        const usageRate = sub.assignedSeats > 0 ? ((sub.activeUsers / sub.assignedSeats) * 100).toFixed(0) : '0';
                        
                        return (
                          <div 
                            key={sub.id} 
                            style={{
                              padding: '10px 12px',
                              borderTop: idx > 0 ? '1px solid var(--mantine-color-gray-1)' : undefined,
                              background:
                                churnRisk === 'high'
                                  ? 'var(--mantine-color-red-0)'
                                  : churnRisk === 'medium'
                                  ? 'var(--mantine-color-yellow-0)'
                                  : 'white',
                            }}
                          >
                            <Inline justify="space-between" align="flex-start" wrap="nowrap">
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <Inline gap="xs" align="center" mb={6} wrap="nowrap">
                                  <Badge size="xs" color="default" variant="outline">
                                    {sub.termType}
                                  </Badge>
                                  {getChurnRiskBadge(churnRisk)}
                                </Inline>
                                <Text size="xs" c="dimmed">
                                  {sub.displayName !== sub.sku && (
                                    <Text span fw={800} style={{ color: 'var(--mantine-color-gray-8)' }}>{sub.displayName} • </Text>
                                  )}
                                  <Text span style={{ fontFamily: 'monospace', color: 'var(--mantine-color-gray-5)' }}>{sub.id.substring(0, 8)}...</Text>
                                </Text>
                              </div>
                              <Inline gap="xl" align="flex-start" wrap="nowrap" style={{ textAlign: 'right' }}>
                                <div>
                                  <Text size="xs" c="dimmed">Seats</Text>
                                  <Text size="sm" fw={800}>{sub.seats}</Text>
                                </div>
                                <div>
                                  <Text size="xs" c="dimmed">Assigned</Text>
                                  <Text size="sm" fw={800} style={parseInt(assignRate) < 70 ? { color: 'var(--mantine-color-orange-7)' } : undefined}>
                                    {sub.assignedSeats} ({assignRate}%)
                                  </Text>
                                </div>
                                <div>
                                  <Text size="xs" c="dimmed">Active</Text>
                                  <Text size="sm" fw={800} style={parseInt(usageRate) < 60 ? { color: 'var(--mantine-color-red-7)' } : undefined}>
                                    {sub.activeUsers} ({usageRate}%)
                                  </Text>
                                </div>
                                <div style={{ width: 90 }}>
                                  <Text size="xs" c="dimmed">Revenue</Text>
                                  <Text size="sm" fw={800}>${sub.revenue.toLocaleString()}</Text>
                                </div>
                              </Inline>
                            </Inline>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
          </Stack>
          
          {/* Summary Footer */}
          <Card style={{ marginTop: 12, background: 'var(--mantine-color-blue-0)', border: '1px solid var(--mantine-color-blue-2)' }}>
            <Inline justify="space-between" align="center" wrap="nowrap">
              <Text size="sm" fw={800} style={{ color: 'var(--mantine-color-blue-8)' }}>
                Total: {subscriptions.length} subscriptions across {Object.keys(groupedSubscriptions).length} products
              </Text>
              <Text size="sm" fw={900} style={{ color: 'var(--mantine-color-blue-9)' }}>
                ${subscriptions.reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}/mo
              </Text>
            </Inline>
          </Card>
      </div>
    </Modal>
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
    <Card>
      <Inline justify="space-between" align="flex-start" mb="sm" wrap="nowrap">
        <Text fw={800}>{data.product}</Text>
        <div style={{ textAlign: 'right' }}>
          <Text fw={900} size="lg">
            {data.activeUsers}/{data.totalUsers}
          </Text>
          <Text size="xs" c="dimmed">
            {data.usagePercentage.toFixed(1)}% active
          </Text>
        </div>
      </Inline>

      <Progress value={data.usagePercentage} mb="sm" />

      <Stack gap="xs">
        {data.services.map((service) => (
          <Inline key={service.name} justify="space-between" align="center" wrap="nowrap">
            <Text size="sm">{service.name}</Text>
            <Inline gap="xs" align="center" wrap="nowrap">
              <Text size="sm" c="dimmed">{service.activeUsers} users</Text>
              <Badge
                size="xs"
                variant="outline"
                color={service.percentage >= 80 ? 'success' : service.percentage >= 60 ? 'pending' : 'danger'}
              >
                {service.percentage.toFixed(0)}%
              </Badge>
            </Inline>
          </Inline>
        ))}
      </Stack>
    </Card>
  );
};

export const PartnerCenterInsights: React.FC = () => {
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(true);
  const [officeUsageOpen, setOfficeUsageOpen] = useState(true);
  const [revenueOpen, setRevenueOpen] = useState(false);
  const [showAllSubscriptionsModal, setShowAllSubscriptionsModal] = useState(false);

  // Subscription data with editable display names - each subscription has ONE term type
  // displayName defaults to SKU, can be renamed to a custom "Subscription Nickname"
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      productName: 'Microsoft 365 Business Premium',
      displayName: 'O365_BUSINESS_PREMIUM',
      sku: 'O365_BUSINESS_PREMIUM',
      seats: 90,
      assignedSeats: 85,
      activeUsers: 72,
      revenue: 1800,
      status: 'active' as const,
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
      status: 'active' as const,
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
      status: 'active' as const,
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
      status: 'active' as const,
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
      status: 'active' as const,
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
      status: 'active' as const,
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
      status: 'active' as const,
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
      status: 'active' as const,
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
      status: 'active' as const,
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
      status: 'active' as const,
      renewalDate: '2026-02-28',
      termType: 'Monthly Billed Monthly'
    }
  ]);

  const handleRenameSubscription = (id: string, newName: string) => {
    setSubscriptions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, displayName: newName } : sub)
    );
  };

  // Calculate overview from subscriptions
  const overview = {
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
  };

  const officeUsage = [
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

  const revenueBreakdown = {
    byProduct: [
      { name: 'Microsoft 365 E3', revenue: 3600, percentage: 28.9 },
      { name: 'Microsoft 365 Business Premium', revenue: 3000, percentage: 24.1 },
      { name: 'Microsoft 365 E5', revenue: 2900, percentage: 23.3 },
      { name: 'Azure Subscriptions', revenue: 1550, percentage: 12.4 },
      { name: 'Office 365 E1', revenue: 400, percentage: 3.2 },
      { name: 'Other Products', revenue: 1000, percentage: 8.0 }
    ],
    total: overview.monthlyRevenue,
    growth: 8.7
  };

  return (
    <ExpandableSection 
      title="Partner Center Insights" 
      open={overviewOpen}
      onToggle={setOverviewOpen}
      helpContent="Partner Center Insights provides comprehensive analytics and metrics from Microsoft Partner Center about your customer's Microsoft 365 usage, deployment, and revenue. These insights help you understand customer engagement, optimize license allocation, and identify upsell opportunities. Data is refreshed daily and includes historical trends for performance tracking."
    >
      {/* Overview Metrics - Compact horizontal layout */}
      <Stack gap="sm" style={{ marginBottom: 12 }}>
        <Text fw={800} size="sm">Overview</Text>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 8,
          }}
        >
          <MetricCard
            title="Total Seats"
            value={overview.totalSeats}
            trend={overview.trends.seats}
            icon={<Users size={16} color="var(--mantine-color-blue-6)" />}
            status="good"
          />
          <MetricCard
            title="Assigned Seats"
            value={overview.assignedSeats}
            subtitle={`${((overview.assignedSeats / overview.totalSeats) * 100).toFixed(0)}% deployed`}
            icon={<Package size={16} color="var(--mantine-color-blue-6)" />}
            status="good"
          />
          <MetricCard
            title="Active Users (28d)"
            value={overview.activeUsers}
            trend={overview.trends.activeUsers}
            icon={<Activity size={16} color="var(--mantine-color-blue-6)" />}
            status="warning"
          />
          <MetricCard
            title="Monthly Revenue"
            value={`$${overview.monthlyRevenue.toLocaleString()}`}
            trend={overview.trends.revenue}
            icon={<DollarSign size={16} color="var(--mantine-color-blue-6)" />}
            status="good"
          />
        </div>
      </Stack>

      {/* Subscriptions Detail */}
      <ExpandableSection 
        title={
          <Inline justify="space-between" align="center" wrap="nowrap" style={{ width: '100%' }}>
            <Text fw={800} size="sm">
              Subscriptions ({subscriptions.length})
            </Text>
            <Button
              size="xs"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllSubscriptionsModal(true);
              }}
            >
              Summarise all my Microsoft subscriptions
            </Button>
          </Inline>
        }
        open={subscriptionsOpen}
        onToggle={setSubscriptionsOpen}
      >
        <Stack gap="xs">
          {subscriptions.map((sub) => (
            <SubscriptionRow 
              key={sub.id} 
              subscription={sub}
              onRename={handleRenameSubscription}
            />
          ))}
        </Stack>

        <Card style={{ background: 'var(--mantine-color-blue-0)', border: '1px solid var(--mantine-color-blue-2)' }}>
          <Stack gap={6}>
            <Text size="xs" fw={800} style={{ color: 'var(--mantine-color-blue-8)' }}>
              💡 Utilization Insights
            </Text>
            <Stack gap={4}>
              <Text size="xs" style={{ color: 'var(--mantine-color-blue-8)' }}>
                - You have <Text span fw={800}>{overview.totalSeats - overview.assignedSeats} unassigned seats</Text> across all subscriptions.
              </Text>
              <Text size="xs" style={{ color: 'var(--mantine-color-blue-8)' }}>
                - Only <Text span fw={800}>{((overview.activeUsers / overview.assignedSeats) * 100).toFixed(1)}% of assigned users</Text> are actively using their licenses.
              </Text>
            </Stack>
          </Stack>
        </Card>
      </ExpandableSection>

      {/* Office Usage */}
      <ExpandableSection 
        title="Office 365 Usage Analytics"
        open={officeUsageOpen}
        onToggle={setOfficeUsageOpen}
      >
        <Stack gap="md">
          {officeUsage.map((usage, index) => (
            <OfficeUsageCard key={index} data={usage} />
          ))}
        </Stack>

        <Card style={{ background: 'var(--mantine-color-yellow-0)', border: '1px solid var(--mantine-color-yellow-2)' }}>
          <Stack gap={6}>
            <Text fw={800} size="sm" style={{ color: 'var(--mantine-color-yellow-9)' }}>
              💡 Service Usage Recommendations
            </Text>
            <Stack gap={4}>
              <Text size="xs" style={{ color: 'var(--mantine-color-yellow-9)' }}>
                - <Text span fw={800}>SharePoint usage is at 59.9%</Text> - Consider training sessions on document collaboration.
              </Text>
              <Text size="xs" style={{ color: 'var(--mantine-color-yellow-9)' }}>
                - <Text span fw={800}>Teams has strong adoption (85.6%)</Text> - Leverage this success to promote other tools.
              </Text>
            </Stack>
          </Stack>
        </Card>
      </ExpandableSection>

      {/* Revenue Breakdown */}
      <ExpandableSection 
        title="Revenue Analytics"
        open={revenueOpen}
        onToggle={setRevenueOpen}
      >
        <Card style={{ marginBottom: 12 }}>
          <Inline justify="space-between" align="flex-start" wrap="nowrap">
            <Text fw={800} size="sm">Monthly Recurring Revenue</Text>
            <div style={{ textAlign: 'right' }}>
              <Text fw={900} size="lg">${revenueBreakdown.total.toLocaleString()}</Text>
              <Inline gap={4} justify="flex-end" align="center" wrap="nowrap">
                <TrendingUp size={12} color="var(--mantine-color-green-6)" />
                <Text size="xs" fw={800} style={{ color: 'var(--mantine-color-green-7)' }}>
                  +{revenueBreakdown.growth}% MoM
                </Text>
              </Inline>
            </div>
          </Inline>
        </Card>

        <Stack gap="xs">
          {revenueBreakdown.byProduct.map((product) => (
            <Card key={product.name} style={{ padding: 12 }}>
              <Inline justify="space-between" align="center" wrap="nowrap" mb={6}>
                <Text size="xs" fw={700} style={{ color: 'var(--mantine-color-gray-7)' }}>
                  {product.name}
                </Text>
                <Inline gap={6} align="baseline" wrap="nowrap">
                  <Text size="xs" fw={900}>${product.revenue.toLocaleString()}</Text>
                  <Text size="xs" c="dimmed">({product.percentage.toFixed(0)}%)</Text>
                </Inline>
              </Inline>
              <Progress value={product.percentage} />
            </Card>
          ))}
        </Stack>
      </ExpandableSection>

      {/* Data Source Information */}
      <Card style={{ background: 'var(--mantine-color-gray-0)', border: '1px solid var(--mantine-color-gray-2)' }}>
        <Inline gap="xs" align="flex-start" wrap="nowrap">
          <svg width="12" height="12" style={{ color: 'var(--mantine-color-blue-6)', marginTop: 3, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <Text size="xs" c="dimmed">
            Data from Microsoft Partner Center Insights API. Updated daily.
            <a href="https://learn.microsoft.com/en-us/partner-center/insights/insights-programmatic-prerequisites" 
               target="_blank" 
               rel="noopener noreferrer"
               style={{ marginLeft: 6, color: 'var(--mantine-color-blue-7)', textDecoration: 'underline' }}>
              Learn more →
            </a>
          </Text>
        </Inline>
      </Card>

      {/* All Subscriptions Modal */}
      <AllSubscriptionsModal
        open={showAllSubscriptionsModal}
        onClose={() => setShowAllSubscriptionsModal(false)}
        subscriptions={subscriptions}
      />
    </ExpandableSection>
  );
};

export default PartnerCenterInsights;
