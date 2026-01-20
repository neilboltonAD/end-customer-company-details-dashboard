import React, { useState } from 'react';
import {
  Modal,
  Text,
  Button,
  Group,
  Stack,
  Table,
  Card,
  Divider,
  Alert,
  Select,
  Badge,
} from '@mantine/core';
import { AlertCircle, Info, ArrowDownLeft, Clock } from 'lucide-react';
import { TransferRequest } from './types';
import { formatDate, formatCurrency, getDaysUntilExpiration, formatTermDuration } from './mockData';
import { TransferStatusBadge } from './TransferStatusBadge';

interface ReviewTransferModalProps {
  open: boolean;
  onClose: () => void;
  transfer: TransferRequest | null;
  onAccept: () => void;
  onReject: (reason?: string) => void;
}

const rejectionReasons = [
  { value: 'no_relationship', label: 'Customer relationship not established' },
  { value: 'duplicate', label: 'Duplicate transfer request' },
  { value: 'incorrect_subscriptions', label: 'Incorrect subscriptions included' },
  { value: 'business_decision', label: 'Business decision' },
  { value: 'other', label: 'Other' },
];

export const ReviewTransferModal: React.FC<ReviewTransferModalProps> = ({
  open,
  onClose,
  transfer,
  onAccept,
  onReject,
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState<string | null>(null);
  const [confirmAccept, setConfirmAccept] = useState(false);

  if (!transfer) return null;

  const daysRemaining = getDaysUntilExpiration(transfer.expirationDate);
  const isUrgent = daysRemaining <= 7;
  const totalSeats = transfer.lineItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleClose = () => {
    setShowRejectForm(false);
    setRejectReason(null);
    setConfirmAccept(false);
    onClose();
  };

  const handleReject = () => {
    const reason = rejectionReasons.find(r => r.value === rejectReason)?.label;
    onReject(reason);
    handleClose();
  };

  const handleAccept = () => {
    onAccept();
    handleClose();
  };

  return (
    <Modal
      opened={open}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <Text fw={600} size="lg">
            Review Incoming Transfer Request
          </Text>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        {/* Transfer Info Card */}
        <Card withBorder padding="md" radius="md" bg="blue.0">
          <Group justify="space-between" align="flex-start">
            <div>
              <Group gap="xs" mb="xs">
                <ArrowDownLeft size={16} color="var(--mantine-color-blue-6)" />
                <Text size="sm" fw={600}>Transfer Request from {transfer.sourcePartner.name}</Text>
              </Group>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  Partner Tenant ID:{' '}
                  <Text span style={{ fontFamily: 'monospace' }}>
                    {transfer.sourcePartner.tenantId}
                  </Text>
                </Text>
                {transfer.sourcePartner.mpnId && (
                  <Text size="xs" c="dimmed">
                    Partner MPN ID: {transfer.sourcePartner.mpnId}
                  </Text>
                )}
                <Text size="xs" c="dimmed">
                  Request Date: {formatDate(transfer.createdDate)}
                </Text>
              </Stack>
            </div>
            <div style={{ textAlign: 'right' }}>
              <TransferStatusBadge status={transfer.status} />
              <Group gap={4} mt="xs">
                <Clock size={12} color={isUrgent ? 'var(--mantine-color-orange-7)' : 'var(--mantine-color-gray-5)'} />
                <Text size="xs" c={isUrgent ? 'orange' : 'dimmed'} fw={isUrgent ? 600 : 400}>
                  Expires: {formatDate(transfer.expirationDate)}
                  {isUrgent && ` (${daysRemaining} days remaining!)`}
                </Text>
              </Group>
            </div>
          </Group>
        </Card>

        {/* Subscriptions Table */}
        <div>
          <Text size="sm" fw={600} mb="xs">Subscriptions Included in Transfer:</Text>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Qty</Table.Th>
                <Table.Th>Term</Table.Th>
                <Table.Th>Billing</Table.Th>
                <Table.Th>Est. Value/mo</Table.Th>
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
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        {/* Summary */}
        <Card withBorder padding="sm" radius="md" bg="gray.0">
          <Group justify="space-around">
            <div style={{ textAlign: 'center' }}>
              <Text size="xs" c="dimmed">Total Subscriptions</Text>
              <Text size="lg" fw={700}>{transfer.lineItems.length}</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text size="xs" c="dimmed">Total Seats</Text>
              <Text size="lg" fw={700}>{totalSeats}</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
<Text size="xs" c="dimmed">Est. Monthly Value</Text>
            <Text size="lg" fw={700}>~{formatCurrency(transfer.totalMonthlyValue)}</Text>
            </div>
          </Group>
        </Card>

        {/* What happens when you accept */}
        {!showRejectForm && !confirmAccept && (
          <Alert icon={<Info size={16} />} color="blue" variant="light">
            <Text size="xs" fw={600} mb={4}>What happens when you accept?</Text>
            <Stack gap={4}>
              <Text size="xs">- You will become the billing partner for these subscriptions</Text>
              <Text size="xs">- Customer service continuity will be maintained</Text>
              <Text size="xs">- The source partner will no longer have access</Text>
              <Text size="xs">- This action cannot be undone</Text>
            </Stack>
          </Alert>
        )}

        {/* Confirm Accept */}
        {confirmAccept && (
          <Alert icon={<AlertCircle size={16} />} color="green" variant="light">
            <Text size="sm" fw={600} mb={8}>
              Are you sure you want to accept this transfer?
            </Text>
            <Text size="xs" c="dimmed" mb="md">
              You will become the billing partner for {transfer.lineItems.length} subscription(s) 
              worth an estimated {formatCurrency(transfer.totalMonthlyValue)}/month.
            </Text>
            <Group justify="flex-end">
              <Button variant="subtle" size="xs" onClick={() => setConfirmAccept(false)}>
                Go Back
              </Button>
              <Button color="green" size="xs" onClick={handleAccept}>
                Yes, Accept Transfer
              </Button>
            </Group>
          </Alert>
        )}

        {/* Reject Form */}
        {showRejectForm && (
          <Alert icon={<AlertCircle size={16} />} color="red" variant="light">
            <Text size="sm" fw={600} mb={8}>
              Reject this transfer?
            </Text>
            <Select
              label="Reason for rejection"
              placeholder="Select a reason"
              data={rejectionReasons}
              value={rejectReason}
              onChange={setRejectReason}
              size="sm"
              mb="md"
            />
            <Group justify="flex-end">
              <Button variant="subtle" size="xs" onClick={() => setShowRejectForm(false)}>
                Go Back
              </Button>
              <Button 
                color="red" 
                size="xs" 
                onClick={handleReject}
                disabled={!rejectReason}
              >
                Confirm Rejection
              </Button>
            </Group>
          </Alert>
        )}

        <Divider />

        {/* Action Buttons */}
        {!showRejectForm && !confirmAccept && (
          <Group justify="flex-end">
            <Button variant="subtle" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant="subtle" 
              color="red" 
              onClick={() => setShowRejectForm(true)}
            >
              Reject
            </Button>
            <Button 
              color="teal"
              onClick={() => setConfirmAccept(true)}
            >
              Accept Transfer
            </Button>
          </Group>
        )}
      </Stack>
    </Modal>
  );
};

