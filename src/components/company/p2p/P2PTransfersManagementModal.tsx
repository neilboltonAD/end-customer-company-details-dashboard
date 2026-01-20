import React, { useState } from 'react';
import {
  Modal,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Tabs,
  Table,
  Card,
  ActionIcon,
  Tooltip,
  ThemeIcon,
  Divider,
  Loader,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { TransferRequest } from './types';
import {
  mockTransferRequests,
  formatDate,
  formatCurrency,
  getDaysUntilExpiration,
  getTransferSummary,
} from './mockData';
import { TransferStatusBadge } from './TransferStatusBadge';
import { ReviewTransferModal } from './ReviewTransferModal';
import { TransferDetailsModal } from './TransferDetailsModal';

interface P2PTransfersManagementModalProps {
  open: boolean;
  onClose: () => void;
}

export const P2PTransfersManagementModal: React.FC<P2PTransfersManagementModalProps> = ({
  open,
  onClose,
}) => {
  const [transfers, setTransfers] = useState<TransferRequest[]>(mockTransferRequests);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRequest | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const summary = getTransferSummary(transfers);

  const incomingPending = transfers.filter(t => t.direction === 'Incoming' && t.status === 'Pending');
  const outgoingPending = transfers.filter(t => t.direction === 'Outgoing' && t.status === 'Pending');
  const allPending = [...incomingPending, ...outgoingPending];
  const completedTransfers = transfers.filter(t => t.status === 'Completed');
  const failedTransfers = transfers.filter(t => t.status === 'Failed' || t.status === 'Rejected' || t.status === 'Cancelled');

  const handleSync = () => {
    setIsLoading(true);
    notifications.show({
      id: 'p2p-sync-all',
      title: 'Syncing',
      message: 'Syncing all P2P transfer data from Microsoft Partner Centre...',
      color: 'blue',
      loading: true,
      autoClose: false,
    });

    setTimeout(() => {
      setIsLoading(false);
      notifications.update({
        id: 'p2p-sync-all',
        title: 'Sync Complete',
        message: 'All transfer data is up to date.',
        color: 'green',
        loading: false,
        autoClose: 3000,
      });
    }, 2000);
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

    setTimeout(() => {
      setTransfers(prev => prev.map(t =>
        t.id === transferId
          ? { ...t, status: 'Completed' as const, completedDate: new Date().toISOString(), lastModifiedDate: new Date().toISOString() }
          : t
      ));

      notifications.update({
        id: `accept-${transferId}`,
        title: 'Transfer Completed',
        message: 'Subscriptions have been successfully transferred.',
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

  const renderTransferRow = (transfer: TransferRequest) => {
    const daysRemaining = getDaysUntilExpiration(transfer.expirationDate);
    const isUrgent = daysRemaining <= 7 && transfer.status === 'Pending';
    const partnerName = transfer.direction === 'Incoming'
      ? transfer.sourcePartner.name
      : transfer.targetPartner.name;

    return (
      <Table.Tr key={transfer.id} style={isUrgent ? { background: 'var(--mantine-color-orange-0)' } : undefined}>
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
          <Text size="sm" fw={500}>{transfer.customerName}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{partnerName}</Text>
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
                <AlertTriangle size={14} color="var(--mantine-color-orange-6)" />
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
              <ActionIcon variant="subtle" size="sm" onClick={() => handleViewTransfer(transfer)}>
                <Eye size={14} />
              </ActionIcon>
            </Tooltip>
            {transfer.status === 'Pending' && transfer.direction === 'Incoming' && (
              <>
                <Tooltip label="Accept">
                  <ActionIcon variant="subtle" size="sm" color="green" onClick={() => handleReviewTransfer(transfer)}>
                    <Check size={14} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Reject">
                  <ActionIcon variant="subtle" size="sm" color="red" onClick={() => handleRejectTransfer(transfer.id)}>
                    <X size={14} />
                  </ActionIcon>
                </Tooltip>
              </>
            )}
            {transfer.status === 'Pending' && transfer.direction === 'Outgoing' && (
              <Tooltip label="Cancel">
                <ActionIcon variant="subtle" size="sm" color="red" onClick={() => handleCancelTransfer(transfer.id)}>
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
    <>
      <Modal
        opened={open}
        onClose={onClose}
        title={
          <Group gap="sm">
            <Text fw={600} size="lg">P2P Subscription Transfers</Text>
            {summary.incomingPending > 0 && (
              <Badge color="red" size="lg" circle>
                {summary.incomingPending}
              </Badge>
            )}
          </Group>
        }
        size="xl"
        centered
      >
        <Stack gap="md">
          {/* Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
            }}
          >
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

          {/* Sync Button */}
          <Group justify="flex-end">
            <Button
              size="xs"
              variant="light"
              leftSection={isLoading ? <Loader size="xs" /> : <RefreshCw size={14} />}
              onClick={handleSync}
              loading={isLoading}
            >
              Sync All
            </Button>
          </Group>

          <Divider />

          {/* Tabs for different views */}
          <Tabs defaultValue="pending">
            <Tabs.List>
              <Tabs.Tab value="pending" leftSection={<Clock size={14} />}>
                Pending
                {allPending.length > 0 && (
                  <Badge size="xs" color="red" ml={6}>{allPending.length}</Badge>
                )}
              </Tabs.Tab>
              <Tabs.Tab value="completed" leftSection={<CheckCircle size={14} />}>
                Completed
              </Tabs.Tab>
              <Tabs.Tab value="failed" leftSection={<XCircle size={14} />}>
                Failed/Rejected
              </Tabs.Tab>
              <Tabs.Tab value="all">All Transfers</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="pending" pt="md">
              {allPending.length > 0 ? (
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Direction</Table.Th>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Partner</Table.Th>
                      <Table.Th>Items</Table.Th>
                      <Table.Th>Est. Value</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Expires</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {allPending.map(renderTransferRow)}
                  </Table.Tbody>
                </Table>
              ) : (
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  No pending transfers
                </Text>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="completed" pt="md">
              {completedTransfers.length > 0 ? (
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Direction</Table.Th>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Partner</Table.Th>
                      <Table.Th>Items</Table.Th>
                      <Table.Th>Est. Value</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Completed</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {completedTransfers.map(renderTransferRow)}
                  </Table.Tbody>
                </Table>
              ) : (
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  No completed transfers
                </Text>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="failed" pt="md">
              {failedTransfers.length > 0 ? (
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Direction</Table.Th>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Partner</Table.Th>
                      <Table.Th>Items</Table.Th>
                      <Table.Th>Est. Value</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {failedTransfers.map(renderTransferRow)}
                  </Table.Tbody>
                </Table>
              ) : (
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  No failed or rejected transfers
                </Text>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="all" pt="md">
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Direction</Table.Th>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Partner</Table.Th>
                    <Table.Th>Items</Table.Th>
                    <Table.Th>Est. Value</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {transfers.map(renderTransferRow)}
                </Table.Tbody>
              </Table>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Modal>

      {/* Sub-modals */}
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
    </>
  );
};

