import React from 'react';
import {
  Modal,
  Text,
  Group,
  Stack,
  Table,
  Card,
  Divider,
  ThemeIcon,
  Timeline,
  Badge,
} from '@mantine/core';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Building2, 
  Clock, 
  CheckCircle, 
  XCircle,
  Send,
  FileCheck,
} from 'lucide-react';
import { TransferRequest } from '../../context/types';
import { formatCurrency, formatDate, formatDateTime, getDaysUntilExpiration } from '../../utils/formatters';
import { TransferStatusBadge } from '../shared/TransferStatusBadge';

interface TransferDetailsModalProps {
  open: boolean;
  onClose: () => void;
  transfer: TransferRequest | null;
}

export function TransferDetailsModal({
  open,
  onClose,
  transfer,
}: TransferDetailsModalProps) {
  if (!transfer) return null;

  const isIncoming = transfer.direction === 'Incoming';
  const daysRemaining = getDaysUntilExpiration(transfer.expirationDate);
  const isUrgent = daysRemaining <= 7 && transfer.status === 'Pending';

  // Generate timeline based on status
  const getTimelineItems = () => {
    const items = [
      {
        title: 'Transfer Created',
        date: transfer.createdDate,
        description: `Transfer request initiated by ${isIncoming ? transfer.sourcePartner.name : 'you'}`,
        icon: <Send size={12} />,
        color: 'blue',
        active: true,
      },
    ];

    if (transfer.status === 'Completed') {
      items.push({
        title: 'Transfer Accepted',
        date: transfer.lastModifiedDate,
        description: `Transfer accepted by ${isIncoming ? 'you' : transfer.targetPartner.name}`,
        icon: <FileCheck size={12} />,
        color: 'green',
        active: true,
      });
      items.push({
        title: 'Transfer Completed',
        date: transfer.completedDate || transfer.lastModifiedDate,
        description: 'All subscriptions successfully transferred',
        icon: <CheckCircle size={12} />,
        color: 'green',
        active: true,
      });
    } else if (transfer.status === 'Rejected') {
      items.push({
        title: 'Transfer Rejected',
        date: transfer.lastModifiedDate,
        description: transfer.rejectionReason || 'Transfer was rejected',
        icon: <XCircle size={12} />,
        color: 'red',
        active: true,
      });
    } else if (transfer.status === 'Cancelled') {
      items.push({
        title: 'Transfer Cancelled',
        date: transfer.lastModifiedDate,
        description: 'Transfer was cancelled by the initiating partner',
        icon: <XCircle size={12} />,
        color: 'gray',
        active: true,
      });
    } else if (transfer.status === 'Pending') {
      items.push({
        title: 'Awaiting Response',
        date: '',
        description: `Expires on ${formatDate(transfer.expirationDate)}`,
        icon: <Clock size={12} />,
        color: 'yellow',
        active: true,
      });
    }

    return items;
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title={
        <Group gap="xs">
          <ThemeIcon 
            size="md" 
            color={isIncoming ? 'blue' : 'teal'} 
            variant="light"
          >
            {isIncoming ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
          </ThemeIcon>
          <Text fw={600}>Transfer Details</Text>
          <TransferStatusBadge status={transfer.status} />
        </Group>
      }
      size="xl"
      centered
    >
      <Stack gap="md">
        {/* Partner Information Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Card withBorder padding="sm">
            <Group gap="xs" mb="xs">
              <Building2 size={14} className="text-gray-500" />
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Source Partner</Text>
            </Group>
            <Stack gap={2}>
              <Text size="sm" fw={500}>{transfer.sourcePartner.name}</Text>
              <Text size="xs" ff="monospace" c="dimmed">{transfer.sourcePartner.tenantId}</Text>
              {transfer.sourcePartner.mpnId && (
                <Text size="xs" c="dimmed">MPN: {transfer.sourcePartner.mpnId}</Text>
              )}
            </Stack>
          </Card>
          <Card withBorder padding="sm">
            <Group gap="xs" mb="xs">
              <Building2 size={14} className="text-gray-500" />
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Target Partner</Text>
            </Group>
            <Stack gap={2}>
              <Text size="sm" fw={500}>{transfer.targetPartner.name}</Text>
              <Text size="xs" ff="monospace" c="dimmed">{transfer.targetPartner.tenantId}</Text>
              {transfer.targetPartner.mpnId && (
                <Text size="xs" c="dimmed">MPN: {transfer.targetPartner.mpnId}</Text>
              )}
            </Stack>
          </Card>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <Card withBorder padding="sm" ta="center">
            <Text size="xs" c="dimmed">Subscriptions</Text>
            <Text size="lg" fw={700}>{transfer.lineItems.length}</Text>
          </Card>
          <Card withBorder padding="sm" ta="center">
            <Text size="xs" c="dimmed">Est. Monthly Value</Text>
            <Text size="lg" fw={700}>~{formatCurrency(transfer.totalMonthlyValue)}</Text>
          </Card>
          <Card withBorder padding="sm" ta="center">
            <Text size="xs" c="dimmed">Created</Text>
            <Text size="sm" fw={500}>{formatDate(transfer.createdDate)}</Text>
          </Card>
          <Card withBorder padding="sm" ta="center">
            <Text size="xs" c="dimmed">
              {transfer.status === 'Pending' ? 'Expires' : 'Last Update'}
            </Text>
            <Group gap={4} justify="center">
              <Text size="sm" fw={500}>
                {transfer.status === 'Pending' 
                  ? formatDate(transfer.expirationDate)
                  : formatDate(transfer.lastModifiedDate)}
              </Text>
              {isUrgent && <Badge size="xs" color="red">URGENT</Badge>}
            </Group>
          </Card>
        </div>

        <Divider />

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          {/* Subscriptions */}
          <Stack gap="xs">
            <Text size="sm" fw={600}>Subscription Line Items</Text>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>Qty</Table.Th>
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
                      <Text size="xs" c="dimmed">{item.skuName}</Text>
                    </Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                    <Table.Td>{item.billingCycle}</Table.Td>
                    <Table.Td>~{formatCurrency(item.monthlyValue)}</Table.Td>
                    <Table.Td>
                      <Badge 
                        size="xs" 
                        color={item.status === 'Transferred' ? 'green' : item.status === 'Failed' ? 'red' : 'yellow'}
                        variant="light"
                      >
                        {item.status}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>

          {/* Timeline */}
          <Stack gap="xs">
            <Text size="sm" fw={600}>Activity Timeline</Text>
            <Card withBorder padding="sm">
              <Timeline active={getTimelineItems().length - 1} bulletSize={24} lineWidth={2}>
                {getTimelineItems().map((item, index) => (
                  <Timeline.Item
                    key={index}
                    bullet={item.icon}
                    title={
                      <Text size="sm" fw={500}>{item.title}</Text>
                    }
                    color={item.color}
                  >
                    {item.date && (
                      <Text size="xs" c="dimmed" mt={2}>{formatDateTime(item.date)}</Text>
                    )}
                    <Text size="xs" mt={4}>{item.description}</Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Stack>
        </div>

        {/* Rejection Reason */}
        {transfer.rejectionReason && (
          <Card withBorder bg="red.0" padding="sm">
            <Group gap="xs" mb="xs">
              <XCircle size={14} className="text-red-500" />
              <Text size="xs" c="red" tt="uppercase" fw={600}>Rejection Reason</Text>
            </Group>
            <Text size="sm">{transfer.rejectionReason}</Text>
          </Card>
        )}
      </Stack>
    </Modal>
  );
}


