import React, { useState } from 'react';
import { 
  Card, 
  Text, 
  Badge, 
  Button, 
  Group, 
  Loader,
  Stack,
  SimpleGrid,
  Accordion,
  Table,
  ActionIcon,
  Tooltip,
  Divider,
  ThemeIcon,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle, 
  RefreshCw, 
  Plus,
  Eye,
  X,
  Check,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { 
  TransferRequest, 
  EligibleSubscription,
  TransferSummary,
} from './types';
import { 
  mockTransferRequests, 
  mockEligibleSubscriptions,
  customerTenant,
  getTransferSummary,
  formatDate,
  formatCurrency,
  getDaysUntilExpiration,
  formatTermDuration,
} from './mockData';
import { TransferStatusBadge } from './TransferStatusBadge';
import { CreateTransferModal } from './CreateTransferModal';
import { ReviewTransferModal } from './ReviewTransferModal';
import { TransferDetailsModal } from './TransferDetailsModal';

// Summary Card Component
const SummaryCard: React.FC<{
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  count: number;
  subtitle: string;
  badge?: number;
  onClick?: () => void;
  actionLabel?: string;
}> = ({ icon, iconColor, title, count, subtitle, badge, onClick, actionLabel }) => (
  <Card 
    shadow="xs" 
    padding="md" 
    radius="md" 
    withBorder
    style={{ flex: 1, minWidth: 180, cursor: onClick ? 'pointer' : undefined }}
    onClick={onClick}
  >
    <Group justify="space-between" mb="xs">
      <ThemeIcon size="lg" radius="md" color={iconColor} variant="light">
        {icon}
      </ThemeIcon>
      {badge !== undefined && badge > 0 && (
        <Badge color="red" size="lg" circle>
          {badge}
        </Badge>
      )}
    </Group>
    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
      {title}
    </Text>
    <Text size="xl" fw={700} mt={4}>
      {count}
    </Text>
    <Text size="xs" c="dimmed">
      {subtitle}
    </Text>
    {/* Keep a consistent card height: reserve space for the optional action */}
    {actionLabel ? (
      <Button
        variant="subtle"
        size="xs"
        mt="sm"
        fullWidth
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        {actionLabel}
      </Button>
    ) : (
      <div style={{ height: 30, marginTop: 12 }} />
    )}
  </Card>
);

// Transfer Row Component
const TransferRow: React.FC<{
  transfer: TransferRequest;
  onView: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
}> = ({ transfer, onView, onAccept, onReject, onCancel }) => {
  const daysRemaining = getDaysUntilExpiration(transfer.expirationDate);
  const partnerName = transfer.direction === 'Incoming' 
    ? transfer.sourcePartner.name 
    : transfer.targetPartner.name;
  const isUrgent = daysRemaining <= 7 && transfer.status === 'Pending';

  return (
    <Card 
      shadow="xs" 
      padding="sm" 
      radius="md" 
      withBorder 
      mb="xs"
      style={isUrgent ? { borderLeft: '4px solid var(--mantine-color-orange-6)' } : undefined}
    >
      <Group justify="space-between" wrap="nowrap">
        <div style={{ flex: 1 }}>
          <Group gap="xs" mb={4}>
            {transfer.direction === 'Incoming' ? (
              <ArrowDownLeft size={14} color="var(--mantine-color-blue-6)" />
            ) : (
              <ArrowUpRight size={14} color="var(--mantine-color-blue-6)" />
            )}
            <Text size="sm" fw={600}>
              {transfer.direction === 'Incoming' ? 'From: ' : 'To: '}
              {partnerName}
            </Text>
            <TransferStatusBadge status={transfer.status} size="xs" />
          </Group>
          <Text size="xs" c="dimmed">
            {transfer.lineItems.length} subscription{transfer.lineItems.length !== 1 ? 's' : ''} • ~{formatCurrency(transfer.totalMonthlyValue)}/mo est.
            {transfer.status === 'Pending' && (
              <span style={isUrgent ? { color: 'var(--mantine-color-orange-7)', fontWeight: 600 } : undefined}>
                {' '}• {transfer.direction === 'Incoming' ? 'Expires' : 'Created'}: {formatDate(transfer.direction === 'Incoming' ? transfer.expirationDate : transfer.createdDate)}
                {isUrgent && ` (${daysRemaining} days)`}
              </span>
            )}
            {transfer.completedDate && (
              <span> • Completed: {formatDate(transfer.completedDate)}</span>
            )}
          </Text>
        </div>
        <Group gap="xs">
          <Tooltip label="View Details">
            <ActionIcon variant="subtle" onClick={onView}>
              <Eye size={16} />
            </ActionIcon>
          </Tooltip>
          {transfer.status === 'Pending' && transfer.direction === 'Incoming' && (
            <>
              <Tooltip label="Reject">
                <ActionIcon variant="subtle" color="red" onClick={onReject}>
                  <X size={16} />
                </ActionIcon>
              </Tooltip>
              <Button size="xs" color="teal" onClick={onAccept}>
                Accept
              </Button>
            </>
          )}
          {transfer.status === 'Pending' && transfer.direction === 'Outgoing' && (
            <Button size="xs" variant="subtle" color="red" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Group>
      </Group>
    </Card>
  );
};

// Main P2P Transfers Panel
export const P2PTransfersPanel: React.FC<{ allowOutbound?: boolean }> = ({ allowOutbound = true }) => {
  const [transfers, setTransfers] = useState<TransferRequest[]>(mockTransferRequests);
  const [eligibleSubscriptions] = useState<EligibleSubscription[]>(mockEligibleSubscriptions);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRequest | null>(null);

  const summary: TransferSummary = getTransferSummary(transfers);

  const filteredEligibleSubscriptions = hasSearched
    ? eligibleSubscriptions.filter((sub) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return false;
        return (
          sub.subscriptionId.toLowerCase().includes(query) ||
          sub.productName.toLowerCase().includes(query) ||
          sub.sku.toLowerCase().includes(query) ||
          customerTenant.name.toLowerCase().includes(query)
        );
      })
    : [];

  const incomingPending = transfers.filter(t => t.direction === 'Incoming' && t.status === 'Pending');
  const outgoingPending = allowOutbound
    ? transfers.filter(t => t.direction === 'Outgoing' && t.status === 'Pending')
    : [];
  const historyTransfers = transfers.filter(t => 
    t.status === 'Completed' || t.status === 'Failed' || t.status === 'Rejected' || t.status === 'Cancelled'
  );

  const handleSync = () => {
    setIsLoading(true);
    notifications.show({
      id: 'p2p-sync',
      title: 'Syncing',
      message: 'Syncing transfer data from Microsoft Partner Centre...',
      color: 'blue',
      loading: true,
      autoClose: false,
    });

    setTimeout(() => {
      setIsLoading(false);
      notifications.update({
        id: 'p2p-sync',
        title: 'Sync Complete',
        message: 'Transfer data is up to date.',
        color: 'green',
        loading: false,
        autoClose: 3000,
      });
    }, 2000);
  };

  const handleCreateTransfer = (targetPartner: { tenantId: string; mpnId?: string }, subscriptionIds: string[]) => {
    const selectedSubs = eligibleSubscriptions.filter(s => subscriptionIds.includes(s.id));
    const totalValue = selectedSubs.reduce((sum, s) => sum + s.monthlyValue, 0);
    
    const newTransfer: TransferRequest = {
      id: `TR-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(transfers.length + 1).padStart(3, '0')}`,
      status: 'Pending',
      direction: 'Outgoing',
      sourcePartner: {
        tenantId: '408f194e-dc4a-4a2e-ac65-d1d6b0c11a8a',
        name: 'AppDirect Demo Reseller',
        mpnId: '7654321',
      },
      targetPartner: {
        tenantId: targetPartner.tenantId,
        name: 'Target Partner',
        mpnId: targetPartner.mpnId,
      },
      customerTenantId: '8e97f6e7-f67b-445f-9e85-393c7daff321',
      customerName: 'demoresellercustomer3',
      lineItems: selectedSubs.map(s => ({
        id: `li-new-${s.id}`,
        subscriptionId: s.subscriptionId,
        offerId: 'CFQ7TTC0LH18:0001',
        productName: s.productName,
        sku: s.sku,
        quantity: s.quantity,
        billingCycle: s.billingCycle,
        termDuration: s.termDuration,
        monthlyValue: s.monthlyValue,
        status: 'Pending' as const,
        transferEligible: true,
      })),
      totalMonthlyValue: totalValue,
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setTransfers(prev => [newTransfer, ...prev]);
    setCreateModalOpen(false);

    notifications.show({
      title: 'Transfer Request Created',
      message: `Transfer request sent to target partner. ${selectedSubs.length} subscription(s) included.`,
      color: 'green',
    });
  };

  const handleAcceptTransfer = (transferId: string) => {
    setTransfers(prev => prev.map(t => 
      t.id === transferId 
        ? { ...t, status: 'InProgress' as const, lastModifiedDate: new Date().toISOString() }
        : t
    ));

    notifications.show({
      id: `accept-${transferId}`,
      title: 'Processing Transfer',
      message: 'Transfer is being processed by Microsoft...',
      color: 'blue',
      loading: true,
      autoClose: false,
    });

    // Simulate processing
    setTimeout(() => {
      setTransfers(prev => prev.map(t => 
        t.id === transferId 
          ? { ...t, status: 'Completed' as const, completedDate: new Date().toISOString(), lastModifiedDate: new Date().toISOString() }
          : t
      ));

      notifications.update({
        id: `accept-${transferId}`,
        title: 'Transfer Completed',
        message: 'Subscriptions have been successfully transferred to your account.',
        color: 'green',
        loading: false,
        autoClose: 5000,
      });
    }, 3000);

    setReviewModalOpen(false);
    setSelectedTransfer(null);
  };

  const handleRejectTransfer = (transferId: string, reason?: string) => {
    setTransfers(prev => prev.map(t => 
      t.id === transferId 
        ? { 
            ...t, 
            status: 'Rejected' as const, 
            rejectionReason: reason || 'Rejected by partner',
            lastModifiedDate: new Date().toISOString() 
          }
        : t
    ));

    notifications.show({
      title: 'Transfer Rejected',
      message: 'The transfer request has been rejected.',
      color: 'orange',
    });

    setReviewModalOpen(false);
    setSelectedTransfer(null);
  };

  const handleCancelTransfer = (transferId: string) => {
    setTransfers(prev => prev.map(t => 
      t.id === transferId 
        ? { 
            ...t, 
            status: 'Cancelled' as const, 
            lastModifiedDate: new Date().toISOString() 
          }
        : t
    ));

    notifications.show({
      title: 'Transfer Cancelled',
      message: 'The transfer request has been cancelled.',
      color: 'gray',
    });
  };

  const handleViewTransfer = (transfer: TransferRequest) => {
    setSelectedTransfer(transfer);
    setDetailsModalOpen(true);
  };

  const handleReviewTransfer = (transfer: TransferRequest) => {
    setSelectedTransfer(transfer);
    setReviewModalOpen(true);
  };

  return (
    <Card withBorder shadow="xs">
      <Card style={{ background: 'var(--mantine-color-gray-0)', border: '1px solid var(--mantine-color-gray-2)' }}>
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap="xs">
            <Text fw={600} size="sm">📦 P2P Subscription Transfers</Text>
            {summary.incomingPending > 0 && (
              <Badge color="red" size="sm" circle>
                {summary.incomingPending}
              </Badge>
            )}
          </Group>
          <Group gap="xs" wrap="wrap">
          <Tooltip
            label="Outbound transfers are disabled in Indirect mode"
            disabled={allowOutbound}
          >
            <span>
              <Button 
                size="xs" 
                variant="light" 
                leftSection={<Plus size={14} />}
                onClick={() => allowOutbound && setCreateModalOpen(true)}
                disabled={!allowOutbound}
              >
                New
              </Button>
            </span>
          </Tooltip>
          <Button 
            size="xs" 
            variant="light" 
            leftSection={
              isLoading
                ? <Loader size="xs" />
                : <RefreshCw size={14} />
            }
            onClick={handleSync}
            loading={isLoading}
          >
            Sync
          </Button>
          </Group>
        </Group>
      </Card>

      <div style={{ padding: 16 }}>
        {/* Summary Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" verticalSpacing="md">
          <SummaryCard
            icon={<ArrowDownLeft size={18} />}
            iconColor="blue"
            title="Incoming"
            count={summary.incomingPending}
            subtitle="Pending"
            badge={summary.incomingPending}
            actionLabel={summary.incomingPending > 0 ? "Review Now" : undefined}
            onClick={() => {
              if (incomingPending.length > 0) {
                handleReviewTransfer(incomingPending[0]);
              }
            }}
          />
          <SummaryCard
            icon={<ArrowUpRight size={18} />}
            iconColor="blue"
            title="Outgoing"
            count={allowOutbound ? summary.outgoingPending : 0}
            subtitle="Pending"
            onClick={() => {}}
          />
          <SummaryCard
            icon={<CheckCircle size={18} />}
            iconColor="green"
            title="Completed"
            count={summary.completedLast90Days}
            subtitle="Last 90 days"
            onClick={() => {}}
          />
        </SimpleGrid>

        <Accordion variant="separated" radius="md" multiple defaultValue={["subscriptions", "active"]}>
          {/* Available Subscriptions */}
          <Accordion.Item value="subscriptions">
            <Accordion.Control>
              <Group gap="xs">
                <Text size="sm" fw={500}>Available Subscriptions for Transfer</Text>
                <Badge size="xs" color="gray">{filteredEligibleSubscriptions.length}</Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Group align="flex-end" mb="sm" wrap="wrap">
                <TextInput
                  label="Search customer or subscription ID"
                  placeholder="Customer name or subscription ID"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.currentTarget.value)}
                  style={{ flex: 1, minWidth: 260 }}
                />
                <Button
                  size="sm"
                  onClick={() => setHasSearched(true)}
                  disabled={!searchQuery.trim()}
                >
                  Search
                </Button>
              </Group>

              {!hasSearched ? (
                <Card withBorder padding="md">
                  <Text size="sm" c="dimmed">
                    Search for a customer or subscription ID to view available subscriptions.
                  </Text>
                </Card>
              ) : filteredEligibleSubscriptions.length === 0 ? (
                <Card withBorder padding="md">
                  <Text size="sm" c="dimmed">
                    No subscriptions found for “{searchQuery.trim()}”.
                  </Text>
                </Card>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <Table striped highlightOnHover withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Product</Table.Th>
                      <Table.Th>Qty</Table.Th>
                      <Table.Th>Term</Table.Th>
                      <Table.Th>Billing</Table.Th>
                      <Table.Th>Est. Value/mo</Table.Th>
                      <Table.Th>Eligible</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredEligibleSubscriptions.map((sub) => (
                      <Table.Tr key={sub.id} style={!sub.transferEligible ? { opacity: 0.5 } : undefined}>
                        <Table.Td>
                          <Text size="sm" fw={500}>{sub.productName}</Text>
                          <Text size="xs" c="dimmed">{sub.sku}</Text>
                        </Table.Td>
                        <Table.Td>{sub.quantity}</Table.Td>
                        <Table.Td>{formatTermDuration(sub.termDuration)}</Table.Td>
                        <Table.Td>{sub.billingCycle}</Table.Td>
                        <Table.Td>{formatCurrency(sub.monthlyValue)}</Table.Td>
                        <Table.Td>
                          {sub.transferEligible ? (
                            <Badge color="green" size="xs">✅ Yes</Badge>
                          ) : (
                            <Tooltip label={sub.eligibilityReason}>
                              <Badge color="red" size="xs">❌ No</Badge>
                            </Tooltip>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                  </Table>
                </div>
              )}
            </Accordion.Panel>
          </Accordion.Item>

          {/* Active Transfers */}
          <Accordion.Item value="active">
            <Accordion.Control>
              <Group gap="xs">
                <Text size="sm" fw={500}>Active Transfers</Text>
                <Badge size="xs" color="blue">{incomingPending.length + outgoingPending.length}</Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {incomingPending.length > 0 && (
                <>
                  <Group gap="xs" mb="xs">
                    <ArrowDownLeft size={14} color="var(--mantine-color-blue-6)" />
                    <Text size="xs" fw={600} c="dimmed" tt="uppercase">Incoming</Text>
                  </Group>
                  {incomingPending.map(transfer => (
                    <TransferRow
                      key={transfer.id}
                      transfer={transfer}
                      onView={() => handleViewTransfer(transfer)}
                      onAccept={() => handleReviewTransfer(transfer)}
                      onReject={() => handleRejectTransfer(transfer.id)}
                    />
                  ))}
                  <Divider my="md" />
                </>
              )}
              
              {outgoingPending.length > 0 && (
                <>
                  <Group gap="xs" mb="xs">
                    <ArrowUpRight size={14} color="var(--mantine-color-blue-6)" />
                    <Text size="xs" fw={600} c="dimmed" tt="uppercase">Outgoing</Text>
                  </Group>
                  {outgoingPending.map(transfer => (
                    <TransferRow
                      key={transfer.id}
                      transfer={transfer}
                      onView={() => handleViewTransfer(transfer)}
                      onCancel={() => handleCancelTransfer(transfer.id)}
                    />
                  ))}
                </>
              )}

              {incomingPending.length === 0 && outgoingPending.length === 0 && (
                <Text size="sm" c="dimmed" ta="center" py="md">
                  No active transfers
                </Text>
              )}
            </Accordion.Panel>
          </Accordion.Item>

          {/* Transfer History */}
          <Accordion.Item value="history">
            <Accordion.Control>
              <Group gap="xs">
                <Text size="sm" fw={500}>Transfer History (Last 90 Days)</Text>
                <Badge size="xs" color="gray">{historyTransfers.length}</Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {historyTransfers.length > 0 ? (
                historyTransfers.map(transfer => (
                  <TransferRow
                    key={transfer.id}
                    transfer={transfer}
                    onView={() => handleViewTransfer(transfer)}
                  />
                ))
              ) : (
                <Text size="sm" c="dimmed" ta="center" py="md">
                  No transfer history
                </Text>
              )}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Modals */}
      <CreateTransferModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateTransfer}
        eligibleSubscriptions={eligibleSubscriptions.filter(s => s.transferEligible)}
      />

      <ReviewTransferModal
        open={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedTransfer(null);
        }}
        transfer={selectedTransfer}
        onAccept={() => selectedTransfer && handleAcceptTransfer(selectedTransfer.id)}
        onReject={(reason?: string) => selectedTransfer && handleRejectTransfer(selectedTransfer.id, reason)}
      />

      <TransferDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedTransfer(null);
        }}
        transfer={selectedTransfer}
      />
    </Card>
  );
};

