import React from 'react';
import {
  Modal,
  Text,
  Button,
  Group,
  Stack,
  Table,
  Card,
  Divider,
  Timeline,
  Badge,
  CopyButton,
  ActionIcon,
  Tooltip,
  SimpleGrid,
} from '@mantine/core';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Copy, 
  Check,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  FileText,
} from 'lucide-react';
import { TransferRequest, TransferAuditLogEntry } from './types';
import { formatDate, formatDateTime, formatCurrency, formatTermDuration, mockAuditLog } from './mockData';
import { TransferStatusBadge } from './TransferStatusBadge';

interface TransferDetailsModalProps {
  open: boolean;
  onClose: () => void;
  transfer: TransferRequest | null;
}

export const TransferDetailsModal: React.FC<TransferDetailsModalProps> = ({
  open,
  onClose,
  transfer,
}) => {
  if (!transfer) return null;

  const isIncoming = transfer.direction === 'Incoming';
  const totalSeats = transfer.lineItems.reduce((sum, item) => sum + item.quantity, 0);

  // Get audit log for this transfer
  const auditLog = mockAuditLog.filter(log => log.transferId === transfer.id);

  // Generate timeline based on status
  const getTimelineItems = () => {
    const items = [
      {
        title: 'Transfer Request Created',
        date: formatDateTime(transfer.createdDate),
        active: true,
        icon: <FileText size={12} />,
      },
    ];

    if (transfer.status === 'Completed') {
      items.push(
        {
          title: 'Transfer Accepted',
          date: formatDateTime(transfer.lastModifiedDate),
          active: true,
          icon: <Check size={12} />,
        },
        {
          title: 'Processing by Microsoft',
          date: formatDateTime(transfer.lastModifiedDate),
          active: true,
          icon: <Loader size={12} />,
        },
        {
          title: 'Transfer Completed',
          date: formatDateTime(transfer.completedDate || transfer.lastModifiedDate),
          active: true,
          icon: <CheckCircle size={12} />,
        }
      );
    } else if (transfer.status === 'Rejected') {
      items.push({
        title: 'Transfer Rejected',
        date: formatDateTime(transfer.lastModifiedDate),
        active: true,
        icon: <XCircle size={12} />,
      });
    } else if (transfer.status === 'Cancelled') {
      items.push({
        title: 'Transfer Cancelled',
        date: formatDateTime(transfer.lastModifiedDate),
        active: true,
        icon: <XCircle size={12} />,
      });
    } else if (transfer.status === 'InProgress') {
      items.push(
        {
          title: 'Transfer Accepted',
          date: formatDateTime(transfer.lastModifiedDate),
          active: true,
          icon: <Check size={12} />,
        },
        {
          title: 'Processing by Microsoft',
          date: 'In progress...',
          active: true,
          icon: <Loader size={12} style={{ animation: 'mantine-rotate 1s linear infinite' }} />,
        }
      );
    } else if (transfer.status === 'Pending') {
      items.push({
        title: 'Awaiting Partner Response',
        date: `Expires ${formatDate(transfer.expirationDate)}`,
        active: false,
        icon: <Clock size={12} />,
      });
    }

    return items;
  };

  const timelineItems = getTimelineItems();

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title={
        <Group gap="sm">
          <Text fw={600} size="lg">Transfer Details</Text>
          <Text size="sm" c="dimmed" style={{ fontFamily: 'monospace' }}>{transfer.id}</Text>
        </Group>
      }
      size="xl"
      centered
    >
      <Stack gap="md">
        {/* Header with status */}
        <Group justify="space-between">
          <Group gap="xs">
            {isIncoming ? (
              <ArrowDownLeft size={18} color="var(--mantine-color-blue-6)" />
            ) : (
              <ArrowUpRight size={18} color="var(--mantine-color-blue-6)" />
            )}
            <Text size="sm" fw={500}>
              {isIncoming ? 'Incoming' : 'Outgoing'} Transfer
            </Text>
          </Group>
          <TransferStatusBadge status={transfer.status} size="md" />
        </Group>

        {/* Partner Information */}
        <SimpleGrid cols={2} spacing="md">
          <Card withBorder padding="md" radius="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">
              From (Source Partner)
            </Text>
            <Text size="sm" fw={600}>{transfer.sourcePartner.name}</Text>
            <Group gap="xs" mt={4}>
              <Text size="xs" c="dimmed">Tenant:</Text>
              <Text size="xs" style={{ fontFamily: 'monospace' }}>{transfer.sourcePartner.tenantId.slice(0, 8)}...</Text>
              <CopyButton value={transfer.sourcePartner.tenantId}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied!' : 'Copy'}>
                    <ActionIcon size="xs" variant="subtle" onClick={copy}>
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
            {transfer.sourcePartner.mpnId && (
              <Text size="xs" c="dimmed" mt={2}>MPN: {transfer.sourcePartner.mpnId}</Text>
            )}
          </Card>

          <Card withBorder padding="md" radius="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">
              To (Target Partner)
            </Text>
            <Text size="sm" fw={600}>{transfer.targetPartner.name}</Text>
            <Group gap="xs" mt={4}>
              <Text size="xs" c="dimmed">Tenant:</Text>
              <Text size="xs" style={{ fontFamily: 'monospace' }}>{transfer.targetPartner.tenantId.slice(0, 8)}...</Text>
              <CopyButton value={transfer.targetPartner.tenantId}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied!' : 'Copy'}>
                    <ActionIcon size="xs" variant="subtle" onClick={copy}>
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
            {transfer.targetPartner.mpnId && (
              <Text size="xs" c="dimmed" mt={2}>MPN: {transfer.targetPartner.mpnId}</Text>
            )}
          </Card>
        </SimpleGrid>

        {/* Customer Tenant */}
        <Card withBorder padding="sm" radius="md" bg="gray.0">
          <Group gap="xs">
            <Text size="xs" c="dimmed">Customer Tenant:</Text>
            <Text size="xs" fw={500}>{transfer.customerName}</Text>
            <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>({transfer.customerTenantId})</Text>
          </Group>
        </Card>

        <Divider />

        {/* Subscriptions */}
        <div>
          <Text size="sm" fw={600} mb="xs">
            {transfer.status === 'Completed' ? 'Subscriptions Transferred' : 'Subscriptions in Transfer'}
          </Text>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Qty</Table.Th>
                <Table.Th>Term</Table.Th>
                <Table.Th>Billing</Table.Th>
                <Table.Th>Est. Value/mo</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {transfer.lineItems.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>{item.productName}</Text>
                    <Text size="xs" c="dimmed">{item.sku}</Text>
                  </Table.Td>
                  <Table.Td>{item.quantity}</Table.Td>
                  <Table.Td>{formatTermDuration(item.termDuration)}</Table.Td>
                  <Table.Td>{item.billingCycle}</Table.Td>
                  <Table.Td>{formatCurrency(item.monthlyValue)}</Table.Td>
                  <Table.Td>
                    {item.status === 'Completed' ? (
                      <Badge color="green" size="xs">✅ Transferred</Badge>
                    ) : item.status === 'Failed' ? (
                      <Badge color="red" size="xs">❌ Failed</Badge>
                    ) : item.status === 'InProgress' ? (
                      <Badge color="blue" size="xs">⏳ Processing</Badge>
                    ) : (
                      <Badge color="yellow" size="xs">🕐 Pending</Badge>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {/* Summary */}
          <Card withBorder padding="sm" radius="md" bg="gray.0" mt="xs">
            <Group justify="space-around">
              <div style={{ textAlign: 'center' }}>
                <Text size="xs" c="dimmed">Subscriptions</Text>
                <Text size="md" fw={700}>{transfer.lineItems.length}</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text size="xs" c="dimmed">Total Seats</Text>
                <Text size="md" fw={700}>{totalSeats}</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text size="xs" c="dimmed">Est. Monthly Value</Text>
                <Text size="md" fw={700}>~{formatCurrency(transfer.totalMonthlyValue)}</Text>
              </div>
            </Group>
          </Card>
        </div>

        <Divider />

        {/* Timeline */}
        <div>
          <Text size="sm" fw={600} mb="md">Timeline</Text>
          <Timeline active={timelineItems.filter(i => i.active).length - 1} bulletSize={24} lineWidth={2}>
            {timelineItems.map((item, index) => (
              <Timeline.Item 
                key={index} 
                bullet={item.icon}
                title={item.title}
              >
                <Text size="xs" c="dimmed">{item.date}</Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>

        {/* Activity Log */}
        {auditLog.length > 0 && (
          <>
            <Divider />
            <div>
              <Text size="sm" fw={600} mb="xs">Activity Log</Text>
              <Stack gap={4}>
                {auditLog.map((log) => (
                  <Group key={log.id} gap="xs">
                    <Text size="xs" c="dimmed" style={{ width: 140 }}>{formatDateTime(log.timestamp)}</Text>
                    <Text size="xs">{log.action}</Text>
                    {log.user !== 'system' && (
                      <Text size="xs" c="dimmed">by {log.user}</Text>
                    )}
                  </Group>
                ))}
              </Stack>
            </div>
          </>
        )}

        {/* Rejection/Cancellation Reason */}
        {transfer.rejectionReason && (
          <Card withBorder padding="sm" radius="md" bg="red.0">
            <Text size="xs" fw={600} c="red.8">Rejection Reason:</Text>
            <Text size="sm">{transfer.rejectionReason}</Text>
          </Card>
        )}

        {transfer.cancellationReason && (
          <Card withBorder padding="sm" radius="md" bg="gray.1">
            <Text size="xs" fw={600}>Cancellation Reason:</Text>
            <Text size="sm">{transfer.cancellationReason}</Text>
          </Card>
        )}

        <Divider />

        <Group justify="flex-end">
          <Button onClick={onClose}>Close</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

