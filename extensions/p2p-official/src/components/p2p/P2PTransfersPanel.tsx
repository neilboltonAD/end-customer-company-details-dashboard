import { useState } from 'react';
import {
  Paper,
  Title,
  Group,
  Button,
  Card,
  Text,
  Accordion,
  Table,
  ThemeIcon,
  ActionIcon,
  Tooltip,
  Badge,
  Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Eye,
  Check,
  X,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { TransferRequest } from '../../types';
import { formatCurrency, formatDate, getDaysUntilExpiration } from '../../utils/formatters';
import { TransferStatusBadge, LoadingState } from './shared/TransferStatusBadge';
import { CreateTransferModal } from './modals/CreateTransferModal';
import { ReviewTransferModal } from './modals/ReviewTransferModal';
import { TransferDetailsModal } from './modals/TransferDetailsModal';
import { SubscriptionSearch } from './SubscriptionSearch';
import { mockTransferRequests, getTransferSummary } from '../../api/mockData';

// Custom hook using mock data
function useTransfers() {
  const transfers = mockTransferRequests;
  const summary = getTransferSummary();
  
  return {
    incomingPending: transfers.filter(t => t.direction === 'Incoming' && t.status === 'Pending'),
    outgoingPending: transfers.filter(t => t.direction === 'Outgoing' && t.status === 'Pending'),
    completedTransfers: transfers.filter(t => t.status === 'Completed'),
    failedTransfers: transfers.filter(t => t.status === 'Rejected' || t.status === 'Cancelled' || t.status === 'Failed'),
    summary,
    loading: false,
    refresh: async () => { await new Promise(r => setTimeout(r, 1000)); },
    accept: async (_id: string) => { await new Promise(r => setTimeout(r, 500)); },
    reject: async (_id: string, _reason: string) => { await new Promise(r => setTimeout(r, 500)); },
    cancel: async (_id: string) => { await new Promise(r => setTimeout(r, 500)); },
  };
}

interface P2PTransfersPanelProps {
  companyId?: string;
}

function P2PTransfersPanel(_props: P2PTransfersPanelProps) {
  const {
    incomingPending,
    outgoingPending,
    completedTransfers,
    failedTransfers,
    summary,
    loading: loadingTransfers,
    refresh: refreshTransfers,
    accept,
    reject,
    cancel,
  } = useTransfers();

  const [isSyncing, setIsSyncing] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRequest | null>(null);
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);

  const handleSync = async () => {
    setIsSyncing(true);
    notifications.show({
      id: 'p2p-sync',
      title: 'Syncing',
      message: 'Syncing P2P transfer data from Microsoft Partner Centre...',
      color: 'blue',
      loading: true,
      autoClose: false,
    });

    try {
      await refreshTransfers();
      notifications.update({
        id: 'p2p-sync',
        title: 'Sync Complete',
        message: 'All transfer data is up to date.',
        color: 'green',
        loading: false,
        autoClose: 3000,
      });
    } catch {
      notifications.update({
        id: 'p2p-sync',
        title: 'Sync Failed',
        message: 'Failed to sync transfer data. Please try again.',
        color: 'red',
        loading: false,
        autoClose: 5000,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleViewDetails = (transfer: TransferRequest) => {
    setSelectedTransfer(transfer);
    setDetailsModalOpen(true);
  };

  const handleReview = (transfer: TransferRequest) => {
    setSelectedTransfer(transfer);
    setReviewModalOpen(true);
  };

  const handleAccept = async () => {
    if (!selectedTransfer) return;
    
    notifications.show({
      id: 'accept-transfer',
      title: 'Processing',
      message: 'Accepting transfer request...',
      color: 'blue',
      loading: true,
      autoClose: false,
    });

    try {
      await accept(selectedTransfer.id);
      notifications.update({
        id: 'accept-transfer',
        title: 'Transfer Accepted',
        message: 'The transfer is being processed by Microsoft.',
        color: 'green',
        loading: false,
        autoClose: 5000,
      });
      setReviewModalOpen(false);
      setSelectedTransfer(null);
    } catch {
      notifications.update({
        id: 'accept-transfer',
        title: 'Failed',
        message: 'Failed to accept transfer. Please try again.',
        color: 'red',
        loading: false,
        autoClose: 5000,
      });
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedTransfer) return;
    
    try {
      await reject(selectedTransfer.id, reason);
      notifications.show({
        title: 'Transfer Rejected',
        message: 'The transfer request has been rejected.',
        color: 'orange',
      });
      setReviewModalOpen(false);
      setSelectedTransfer(null);
    } catch {
      notifications.show({
        title: 'Failed',
        message: 'Failed to reject transfer. Please try again.',
        color: 'red',
      });
    }
  };

  const handleCancel = async (transferId: string) => {
    try {
      await cancel(transferId);
      notifications.show({
        title: 'Transfer Cancelled',
        message: 'The transfer request has been cancelled.',
        color: 'gray',
      });
    } catch {
      notifications.show({
        title: 'Failed',
        message: 'Failed to cancel transfer. Please try again.',
        color: 'red',
      });
    }
  };

  const handleOpenCreate = () => {
    setCreateModalOpen(true);
  };

  const handleInitiateTransfer = () => {
    setCreateModalOpen(true);
  };

  if (loadingTransfers) {
    return <LoadingState message="Loading P2P transfers..." />;
  }

  const renderTransferRow = (transfer: TransferRequest) => {
    const daysRemaining = getDaysUntilExpiration(transfer.expirationDate);
    const isUrgent = daysRemaining <= 7 && transfer.status === 'Pending';
    const partnerName = transfer.direction === 'Incoming'
      ? transfer.sourcePartner.name
      : transfer.targetPartner.name;

    return (
      <Table.Tr key={transfer.id} style={{ backgroundColor: isUrgent ? 'var(--mantine-color-orange-0)' : undefined }}>
        <Table.Td>
          <Group gap="xs">
            {transfer.direction === 'Incoming' ? (
              <ThemeIcon size="sm" color="blue" variant="light">
                <ArrowDownLeft size={12} />
              </ThemeIcon>
            ) : (
              <ThemeIcon size="sm" color="teal" variant="light">
                <ArrowUpRight size={12} />
              </ThemeIcon>
            )}
            <Text size="sm">{transfer.direction}</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text size="sm" fw={500}>{partnerName}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{transfer.lineItems.length}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">~{formatCurrency(transfer.totalMonthlyValue)}</Text>
        </Table.Td>
        <Table.Td>
          <TransferStatusBadge status={transfer.status} size="xs" />
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            {isUrgent && (
              <Tooltip label={`Expires in ${daysRemaining} days`}>
                <AlertTriangle size={14} className="text-orange-500" />
              </Tooltip>
            )}
            <Text size="xs" c="dimmed">
              {transfer.status === 'Pending'
                ? formatDate(transfer.expirationDate)
                : formatDate(transfer.lastModifiedDate)}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            <Tooltip label="View Details">
              <ActionIcon variant="subtle" size="sm" onClick={() => handleViewDetails(transfer)}>
                <Eye size={14} />
              </ActionIcon>
            </Tooltip>
            {transfer.status === 'Pending' && transfer.direction === 'Incoming' && (
              <>
                <Tooltip label="Review & Accept">
                  <ActionIcon variant="subtle" size="sm" color="green" onClick={() => handleReview(transfer)}>
                    <Check size={14} />
                  </ActionIcon>
                </Tooltip>
              </>
            )}
            {transfer.status === 'Pending' && transfer.direction === 'Outgoing' && (
              <Tooltip label="Cancel">
                <ActionIcon variant="subtle" size="sm" color="red" onClick={() => handleCancel(transfer.id)}>
                  <X size={14} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  };

  return (
    <Paper shadow="xs" radius="md" withBorder p="md">
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <Title order={4}>P2P Subscription Transfers</Title>
          {summary.incomingPending > 0 && (
            <Badge color="red" size="lg" circle>
              {summary.incomingPending}
            </Badge>
          )}
        </Group>
        <Group gap="xs">
          <Button
            size="xs"
            variant="light"
            leftSection={<RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />}
            onClick={handleSync}
            loading={isSyncing}
          >
            Sync
          </Button>
          <Button
            size="xs"
            leftSection={<Plus size={14} />}
            onClick={handleOpenCreate}
          >
            New Transfer
          </Button>
        </Group>
      </Group>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <Card shadow="xs" padding="sm" radius="md" withBorder>
          <Group gap="xs" mb={4}>
            <ThemeIcon size="sm" color="blue" variant="light">
              <ArrowDownLeft size={12} />
            </ThemeIcon>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Incoming</Text>
          </Group>
          <Text size="xl" fw={700}>{summary.incomingPending}</Text>
          <Text size="xs" c="dimmed">pending review</Text>
        </Card>
        <Card shadow="xs" padding="sm" radius="md" withBorder>
          <Group gap="xs" mb={4}>
            <ThemeIcon size="sm" color="teal" variant="light">
              <ArrowUpRight size={12} />
            </ThemeIcon>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Outgoing</Text>
          </Group>
          <Text size="xl" fw={700}>{summary.outgoingPending}</Text>
          <Text size="xs" c="dimmed">awaiting response</Text>
        </Card>
        <Card shadow="xs" padding="sm" radius="md" withBorder>
          <Group gap="xs" mb={4}>
            <ThemeIcon size="sm" color="green" variant="light">
              <CheckCircle size={12} />
            </ThemeIcon>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Completed</Text>
          </Group>
          <Text size="xl" fw={700}>{summary.completedLast90Days}</Text>
          <Text size="xs" c="dimmed">last 90 days</Text>
        </Card>
        <Card shadow="xs" padding="sm" radius="md" withBorder>
          <Group gap="xs" mb={4}>
            <ThemeIcon size="sm" color="red" variant="light">
              <XCircle size={12} />
            </ThemeIcon>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Failed</Text>
          </Group>
          <Text size="xl" fw={700}>{summary.failedLast90Days}</Text>
          <Text size="xs" c="dimmed">last 90 days</Text>
        </Card>
      </div>

      <Divider my="md" />

      {/* Accordion Sections */}
      <Accordion variant="separated" radius="md" multiple defaultValue={['subscriptions', 'active']}>
        {/* Find Subscriptions for Transfer */}
        <Accordion.Item value="subscriptions">
          <Accordion.Control>
            <Group gap="xs">
              <Search size={16} />
              <Text fw={500}>Find Subscriptions for Transfer</Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <SubscriptionSearch
              selectedSubscriptions={selectedSubs}
              onSelectionChange={setSelectedSubs}
              onInitiateTransfer={handleInitiateTransfer}
            />
          </Accordion.Panel>
        </Accordion.Item>

        {/* Active Transfers */}
        <Accordion.Item value="active">
          <Accordion.Control>
            <Group gap="xs">
              <Text fw={500}>Active Transfers</Text>
              <Badge size="sm" variant="light" color="blue">
                {incomingPending.length + outgoingPending.length}
              </Badge>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            {incomingPending.length + outgoingPending.length > 0 ? (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Direction</Table.Th>
                    <Table.Th>Partner</Table.Th>
                    <Table.Th>Items</Table.Th>
                    <Table.Th>Est. Value</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Expires</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {[...incomingPending, ...outgoingPending].map(renderTransferRow)}
                </Table.Tbody>
              </Table>
            ) : (
              <Text size="sm" c="dimmed" ta="center" py="xl">
                No active transfers
              </Text>
            )}
          </Accordion.Panel>
        </Accordion.Item>

        {/* Transfer History */}
        <Accordion.Item value="history">
          <Accordion.Control>
            <Group gap="xs">
              <Text fw={500}>Transfer History</Text>
              <Badge size="sm" variant="light" color="gray">
                {completedTransfers.length + failedTransfers.length}
              </Badge>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            {completedTransfers.length + failedTransfers.length > 0 ? (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Direction</Table.Th>
                    <Table.Th>Partner</Table.Th>
                    <Table.Th>Items</Table.Th>
                    <Table.Th>Est. Value</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {[...completedTransfers, ...failedTransfers].map(renderTransferRow)}
                </Table.Tbody>
              </Table>
            ) : (
              <Text size="sm" c="dimmed" ta="center" py="xl">
                No transfer history
              </Text>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      {/* Modals */}
      <CreateTransferModal
        open={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setSelectedSubs([]);
        }}
        selectedSubscriptionIds={selectedSubs}
      />

      <ReviewTransferModal
        open={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedTransfer(null);
        }}
        transfer={selectedTransfer}
        onAccept={handleAccept}
        onReject={handleReject}
      />

      <TransferDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedTransfer(null);
        }}
        transfer={selectedTransfer}
      />
    </Paper>
  );
}

export default P2PTransfersPanel;
