import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  TextInput,
  Text,
  Group,
  Stack,
  Table,
  Card,
  Checkbox,
  Divider,
  Alert,
  ThemeIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { ArrowUpRight, AlertCircle, Info } from 'lucide-react';
import { Subscription } from '../../context/types';
import { useTransfers } from '../../hooks/useTransfers';
import { formatCurrency, formatTermDuration } from '../../utils/formatters';
import { validateCreateTransferInput, isValidTenantId } from '../../utils/validators';

interface CreateTransferModalProps {
  open: boolean;
  onClose: () => void;
  selectedSubscriptionIds: string[];
  subscriptions: Subscription[];
}

export function CreateTransferModal({
  open,
  onClose,
  selectedSubscriptionIds,
  subscriptions,
}: CreateTransferModalProps) {
  const { create, submitting } = useTransfers();
  
  const [targetTenantId, setTargetTenantId] = useState('');
  const [targetMpnId, setTargetMpnId] = useState('');
  const [selectedSubs, setSelectedSubs] = useState<string[]>(selectedSubscriptionIds);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<'select' | 'confirm'>('select');

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedSubs(selectedSubscriptionIds);
      setStep('select');
      setErrors([]);
    }
  }, [open, selectedSubscriptionIds]);

  const selectedSubscriptions = subscriptions.filter(s => selectedSubs.includes(s.id));
  const totalValue = selectedSubscriptions.reduce((sum, s) => sum + s.monthlyValue, 0);

  const toggleSubscription = (subId: string) => {
    setSelectedSubs(prev =>
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
    );
  };

  const handleNext = () => {
    const validation = validateCreateTransferInput({
      targetPartnerTenantId: targetTenantId,
      targetPartnerMpnId: targetMpnId || undefined,
      subscriptionIds: selectedSubs,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    setStep('confirm');
  };

  const handleSubmit = async () => {
    try {
      await create({
        targetPartnerTenantId: targetTenantId,
        targetPartnerMpnId: targetMpnId || undefined,
        subscriptionIds: selectedSubs,
      });

      notifications.show({
        title: 'Transfer Request Sent',
        message: `${selectedSubs.length} subscription(s) transfer request sent to target partner.`,
        color: 'green',
      });

      onClose();
    } catch (err) {
      notifications.show({
        title: 'Transfer Failed',
        message: err instanceof Error ? err.message : 'Failed to create transfer request',
        color: 'red',
      });
    }
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title={
        <Group gap="xs">
          <ThemeIcon size="md" color="teal" variant="light">
            <ArrowUpRight size={16} />
          </ThemeIcon>
          <Text fw={600}>Create Outbound Transfer</Text>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        {errors.length > 0 && (
          <Alert icon={<AlertCircle size={16} />} title="Validation Error" color="red">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        {step === 'select' && (
          <>
            <Alert icon={<Info size={16} />} color="blue" variant="light">
              <Text size="sm">
                Transfer subscriptions to another Microsoft CSP Partner. The target partner must
                accept the transfer within 30 days.
              </Text>
            </Alert>

            {/* Target Partner Info */}
            <Card withBorder padding="sm">
              <Text size="sm" fw={600} mb="xs">Target Partner Information</Text>
              <Stack gap="xs">
                <TextInput
                  label="Target Partner Tenant ID"
                  placeholder="e.g., a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                  value={targetTenantId}
                  onChange={(e) => setTargetTenantId(e.currentTarget.value)}
                  error={targetTenantId && !isValidTenantId(targetTenantId) ? 'Invalid GUID format' : undefined}
                  required
                />
                <TextInput
                  label="MPN ID (optional)"
                  placeholder="e.g., 1234567"
                  value={targetMpnId}
                  onChange={(e) => setTargetMpnId(e.currentTarget.value)}
                />
              </Stack>
            </Card>

            <Divider />

            {/* Subscription Selection */}
            <Text size="sm" fw={600}>Select Subscriptions to Transfer</Text>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 40 }}></Table.Th>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>Qty</Table.Th>
                  <Table.Th>Term</Table.Th>
                  <Table.Th>Est. Value/mo</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {subscriptions.map((sub) => (
                  <Table.Tr key={sub.id}>
                    <Table.Td>
                      <Checkbox
                        checked={selectedSubs.includes(sub.id)}
                        onChange={() => toggleSubscription(sub.id)}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>{sub.productName}</Text>
                    </Table.Td>
                    <Table.Td>{sub.quantity}</Table.Td>
                    <Table.Td>{formatTermDuration(sub.termDuration)}</Table.Td>
                    <Table.Td>~{formatCurrency(sub.monthlyValue)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {selectedSubs.length > 0 && (
              <Card withBorder bg="gray.0" padding="sm">
                <Group justify="space-between">
                  <Text size="sm">
                    <strong>{selectedSubs.length}</strong> subscription(s) selected
                  </Text>
                  <Text size="sm">
                    Est. Total: <strong>~{formatCurrency(totalValue)}/mo</strong>
                  </Text>
                </Group>
              </Card>
            )}

            <Group justify="flex-end" gap="xs">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleNext} disabled={selectedSubs.length === 0 || !targetTenantId}>
                Continue
              </Button>
            </Group>
          </>
        )}

        {step === 'confirm' && (
          <>
            <Alert icon={<AlertCircle size={16} />} color="yellow" variant="light">
              <Text size="sm">
                Please confirm you want to transfer these subscriptions. The target partner
                will have 30 days to accept the transfer.
              </Text>
            </Alert>

            <Card withBorder padding="sm">
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Target Tenant ID</Text>
                  <Text size="sm" fw={500} ff="monospace">{targetTenantId}</Text>
                </Group>
                {targetMpnId && (
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">MPN ID</Text>
                    <Text size="sm" fw={500}>{targetMpnId}</Text>
                  </Group>
                )}
                <Divider />
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Subscriptions</Text>
                  <Text size="sm" fw={500}>{selectedSubs.length}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Est. Monthly Value</Text>
                  <Text size="lg" fw={700}>~{formatCurrency(totalValue)}</Text>
                </Group>
              </Stack>
            </Card>

            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>Qty</Table.Th>
                  <Table.Th>Est. Value/mo</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {selectedSubscriptions.map((sub) => (
                  <Table.Tr key={sub.id}>
                    <Table.Td>
                      <Text size="sm">{sub.productName}</Text>
                    </Table.Td>
                    <Table.Td>{sub.quantity}</Table.Td>
                    <Table.Td>~{formatCurrency(sub.monthlyValue)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Group justify="flex-end" gap="xs">
              <Button variant="default" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button loading={submitting} onClick={handleSubmit}>
                Confirm Transfer
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}

