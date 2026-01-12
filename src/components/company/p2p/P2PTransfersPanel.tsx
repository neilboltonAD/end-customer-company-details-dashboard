import React, { useState } from 'react';
import { 
  Card, 
  Text, 
  Badge, 
  Button, 
  Group, 
  Stack,
  Accordion,
  Table,
  ActionIcon,
  Tooltip,
  Divider,
  ThemeIcon,
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
    className="flex-1 min-w-[180px] hover:shadow-md transition-shadow cursor-pointer"
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
    {actionLabel && (
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
      className={isUrgent ? 'border-l-4 border-l-orange-500' : ''}
    >
      <Group justify="space-between" wrap="nowrap">
        <div className="flex-1">
          <Group gap="xs" mb={4}>
            {transfer.direction === 'Incoming' ? (
              <ArrowDownLeft size={14} className="text-blue-600" />
            ) : (
              <ArrowUpRight size={14} className="text-teal-600" />
            )}
            <Text size="sm" fw={600}>
              {transfer.direction === 'Incoming' ? 'From: ' : 'To: '}
              {partnerName}
            </Text>
            <TransferStatusBadge status={transfer.status} size="xs" />
          </Group>
          <Text size="xs" c="dimmed">
            {transfer.lineItems.length} subscription{transfer.lineItems.length !== 1 ? 's' : ''} • {formatCurrency(transfer.totalMonthlyValue)}/mo
            {transfer.status === 'Pending' && (
              <span className={isUrgent ? 'text-orange-600 font-medium' : ''}>
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
export const P2PTransfersPanel: React.FC = () => {
  const [transfers, setTransfers] = useState<TransferRequest[]>(mockTransferRequests);
  const [eligibleSubscriptions] = useState<EligibleSubscription[]>(mockEligibleSubscriptions);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRequest | null>(null);

  const summary: TransferSummary = getTransferSummary(transfers);

  const incomingPending = transfers.filter(t => t.direction === 'Incoming' && t.status === 'Pending');
  const outgoingPending = transfers.filter(t => t.direction === 'Outgoing' && t.status === 'Pending');
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
    <div className="border border-gray-300 rounded-lg bg-white mb-2 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Text fw={600} size="sm">📦 P2P Subscription Transfers</Text>
          {summary.incomingPending > 0 && (
            <Badge color="red" size="sm" circle>
              {summary.incomingPending}
            </Badge>
          )}
        </div>
        <Group gap="xs">
          <Button 
            size="xs" 
            variant="light" 
            leftSection={<Plus size={14} />}
            onClick={() => setCreateModalOpen(true)}
          >
            New
          </Button>
          <Button 
            size="xs" 
            variant="light" 
            leftSection={<RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />}
            onClick={handleSync}
            loading={isLoading}
          >
            Sync
          </Button>
        </Group>
      </div>

      <div className="p-4">
        {/* Summary Cards */}
        <div className="flex gap-4 mb-4 flex-wrap">
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
            iconColor="teal"
            title="Outgoing"
            count={summary.outgoingPending}
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
        </div>

        <Accordion variant="separated" radius="md" multiple defaultValue={["subscriptions", "active"]}>
          {/* Available Subscriptions */}
          <Accordion.Item value="subscriptions">
            <Accordion.Control>
              <Group gap="xs">
                <Text size="sm" fw={500}>Available Subscriptions for Transfer</Text>
                <Badge size="xs" color="gray">{eligibleSubscriptions.length}</Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Qty</Table.Th>
                    <Table.Th>Term</Table.Th>
                    <Table.Th>Billing</Table.Th>
                    <Table.Th>Value/mo</Table.Th>
                    <Table.Th>Eligible</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {eligibleSubscriptions.map((sub) => (
                    <Table.Tr key={sub.id} className={!sub.transferEligible ? 'opacity-50' : ''}>
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
                    <ArrowDownLeft size={14} className="text-blue-600" />
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
                    <ArrowUpRight size={14} className="text-teal-600" />
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
    </div>
  );
};

