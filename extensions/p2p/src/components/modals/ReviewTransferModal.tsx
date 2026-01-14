import React, { useState } from 'react';
import {
  Modal,
  Button,
  Text,
  Group,
  Stack,
  Table,
  Card,
  Divider,
  Alert,
  ThemeIcon,
  Select,
  Textarea,
  Badge,
} from '@mantine/core';
import { ArrowDownLeft, AlertCircle, Clock, Building2 } from 'lucide-react';
import { TransferRequest } from '../../context/types';
import { formatCurrency, formatDate, getDaysUntilExpiration } from '../../utils/formatters';
import { TransferStatusBadge } from '../shared/TransferStatusBadge';
import { REJECTION_REASONS } from '../../utils/constants';

interface ReviewTransferModalProps {
  open: boolean;
  onClose: () => void;
  transfer: TransferRequest | null;
  onAccept: () => void;
  onReject: (reason: string) => void;
}

export function ReviewTransferModal({
  open,
  onClose,
  transfer,
  onAccept,
  onReject,
}: ReviewTransferModalProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!transfer) return null;

  const daysRemaining = getDaysUntilExpiration(transfer.expirationDate);
  const isUrgent = daysRemaining <= 7;

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await onAccept();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    const reason = rejectionReason === 'other' ? customReason : 
      REJECTION_REASONS.find(r => r.value === rejectionReason)?.label || 'No reason provided';
    
    setIsProcessing(true);
    try {
      await onReject(reason);
      setShowRejectForm(false);
      setRejectionReason(null);
      setCustomReason('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title={
        <Group gap="xs">
          <ThemeIcon size="md" color="blue" variant="light">
            <ArrowDownLeft size={16} />
          </ThemeIcon>
          <Text fw={600}>Review Incoming Transfer</Text>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        {/* Urgency Warning */}
        {isUrgent && (
          <Alert icon={<Clock size={16} />} color="orange" variant="filled">
            <Text size="sm" fw={500}>
              This transfer expires in {daysRemaining} days. Please review promptly.
            </Text>
          </Alert>
        )}

        {/* Source Partner Info */}
        <Card withBorder padding="sm">
          <Group gap="xs" mb="xs">
            <Building2 size={14} className="text-gray-500" />
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Source Partner</Text>
          </Group>
          <Stack gap={4}>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Partner Name</Text>
              <Text size="sm" fw={500}>{transfer.sourcePartner.name}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Tenant ID</Text>
              <Text size="xs" ff="monospace" c="dimmed">{transfer.sourcePartner.tenantId}</Text>
            </Group>
            {transfer.sourcePartner.mpnId && (
              <Group justify="space-between">
                <Text size="sm" c="dimmed">MPN ID</Text>
                <Text size="sm">{transfer.sourcePartner.mpnId}</Text>
              </Group>
            )}
          </Stack>
        </Card>

        {/* Transfer Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <Card withBorder padding="sm" ta="center">
            <Text size="xs" c="dimmed">Subscriptions</Text>
            <Text size="lg" fw={700}>{transfer.lineItems.length}</Text>
          </Card>
          <Card withBorder padding="sm" ta="center">
            <Text size="xs" c="dimmed">Est. Monthly Value</Text>
            <Text size="lg" fw={700}>~{formatCurrency(transfer.totalMonthlyValue)}</Text>
          </Card>
          <Card withBorder padding="sm" ta="center">
            <Text size="xs" c="dimmed">Expires</Text>
            <Group gap={4} justify="center">
              <Text size="lg" fw={700}>{daysRemaining}d</Text>
              {isUrgent && <Badge size="xs" color="red">URGENT</Badge>}
            </Group>
          </Card>
        </div>

        <Divider />

        {/* Subscriptions Table */}
        <Text size="sm" fw={600}>Subscriptions to be Transferred</Text>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Product</Table.Th>
              <Table.Th>Qty</Table.Th>
              <Table.Th>Billing</Table.Th>
              <Table.Th>Est. Value/mo</Table.Th>
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
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Divider />

        {/* Rejection Form */}
        {showRejectForm ? (
          <Card withBorder bg="gray.0" padding="md">
            <Stack gap="sm">
              <Text size="sm" fw={600}>Reason for Rejection</Text>
              <Select
                placeholder="Select a reason"
                data={REJECTION_REASONS.map(r => ({ value: r.value, label: r.label }))}
                value={rejectionReason}
                onChange={setRejectionReason}
              />
              {rejectionReason === 'other' && (
                <Textarea
                  placeholder="Please provide details..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.currentTarget.value)}
                  minRows={2}
                />
              )}
              <Group justify="flex-end" gap="xs">
                <Button variant="default" size="xs" onClick={() => setShowRejectForm(false)}>
                  Cancel
                </Button>
                <Button 
                  color="red" 
                  size="xs" 
                  onClick={handleReject}
                  loading={isProcessing}
                  disabled={!rejectionReason || (rejectionReason === 'other' && !customReason)}
                >
                  Confirm Rejection
                </Button>
              </Group>
            </Stack>
          </Card>
        ) : (
          <>
            {/* Info Alert */}
            <Alert icon={<AlertCircle size={16} />} color="blue" variant="light">
              <Text size="sm">
                By accepting this transfer, you agree to take over the management of these 
                subscriptions. The transfer will be worth an estimated {formatCurrency(transfer.totalMonthlyValue)}/month.
              </Text>
            </Alert>

            {/* Action Buttons */}
            <Group justify="flex-end" gap="xs">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                variant="light" 
                color="red" 
                onClick={() => setShowRejectForm(true)}
              >
                Reject
              </Button>
              <Button 
                color="green" 
                onClick={handleAccept}
                loading={isProcessing}
              >
                Accept Transfer
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}


