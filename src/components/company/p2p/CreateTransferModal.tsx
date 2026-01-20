import React, { useState } from 'react';
import {
  Modal,
  Text,
  TextInput,
  Button,
  Group,
  Stack,
  Checkbox,
  Table,
  Card,
  Divider,
  Alert,
} from '@mantine/core';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { EligibleSubscription } from './types';
import { formatCurrency, formatTermDuration } from './mockData';

interface CreateTransferModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (targetPartner: { tenantId: string; mpnId?: string }, subscriptionIds: string[]) => void;
  eligibleSubscriptions: EligibleSubscription[];
}

export const CreateTransferModal: React.FC<CreateTransferModalProps> = ({
  open,
  onClose,
  onSubmit,
  eligibleSubscriptions,
}) => {
  const [targetTenantId, setTargetTenantId] = useState('');
  const [targetMpnId, setTargetMpnId] = useState('');
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);

  const resetForm = () => {
    setTargetTenantId('');
    setTargetMpnId('');
    setSelectedSubscriptions([]);
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(
      { tenantId: targetTenantId, mpnId: targetMpnId || undefined },
      selectedSubscriptions
    );
    resetForm();
  };

  const toggleSubscription = (id: string) => {
    setSelectedSubscriptions(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedSubscriptions.length === eligibleSubscriptions.length) {
      setSelectedSubscriptions([]);
    } else {
      setSelectedSubscriptions(eligibleSubscriptions.map(s => s.id));
    }
  };

  const selectedSubs = eligibleSubscriptions.filter(s => selectedSubscriptions.includes(s.id));
  const totalSeats = selectedSubs.reduce((sum, s) => sum + s.quantity, 0);
  const totalValue = selectedSubs.reduce((sum, s) => sum + s.monthlyValue, 0);

  const isValidTenantId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetTenantId);
  const canProceed = step === 1 ? isValidTenantId : selectedSubscriptions.length > 0;

  return (
    <Modal
      opened={open}
      onClose={handleClose}
      title={
        <Text fw={600} size="lg">
          Create Transfer Request
        </Text>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        {step === 1 ? (
          <>
            <Text size="sm" c="dimmed">
              You are creating a transfer request to move subscriptions from this customer's tenant to another partner.
            </Text>

            <Card withBorder padding="md" radius="md" bg="gray.0">
              <Text size="sm" fw={600} mb="sm">
                Step 1: Target Partner Information
              </Text>

              <Stack gap="sm">
                <TextInput
                  label="Target Partner Tenant ID"
                  placeholder="e.g., 12345678-1234-1234-1234-123456789abc"
                  value={targetTenantId}
                  onChange={(e) => setTargetTenantId(e.target.value)}
                  required
                  error={targetTenantId && !isValidTenantId ? 'Invalid tenant ID format' : undefined}
                />

                <TextInput
                  label="Target Partner MPN ID (Optional)"
                  placeholder="e.g., 1234567"
                  value={targetMpnId}
                  onChange={(e) => setTargetMpnId(e.target.value)}
                />
              </Stack>
            </Card>

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep(2)} 
                disabled={!canProceed}
                rightSection={<ArrowRight size={16} />}
              >
                Next: Select Subscriptions
              </Button>
            </Group>
          </>
        ) : (
          <>
            <Card withBorder padding="md" radius="md" bg="gray.0">
              <Text size="sm" fw={600} mb="sm">
                Step 2: Select Subscriptions to Transfer
              </Text>

              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>
                      <Checkbox
                        checked={selectedSubscriptions.length === eligibleSubscriptions.length}
                        indeterminate={selectedSubscriptions.length > 0 && selectedSubscriptions.length < eligibleSubscriptions.length}
                        onChange={selectAll}
                      />
                    </Table.Th>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Qty</Table.Th>
                    <Table.Th>Term</Table.Th>
                    <Table.Th>Est. Value/mo</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {eligibleSubscriptions.map((sub) => (
                    <Table.Tr 
                      key={sub.id}
                      onClick={() => toggleSubscription(sub.id)}
                      style={{
                        cursor: 'pointer',
                        ...(selectedSubscriptions.includes(sub.id) ? { background: 'var(--mantine-color-blue-0)' } : undefined),
                      }}
                    >
                      <Table.Td>
                        <Checkbox
                          checked={selectedSubscriptions.includes(sub.id)}
                          onChange={() => toggleSubscription(sub.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={500}>{sub.productName}</Text>
                      </Table.Td>
                      <Table.Td>{sub.quantity}</Table.Td>
                      <Table.Td>{formatTermDuration(sub.termDuration)}</Table.Td>
                      <Table.Td>{formatCurrency(sub.monthlyValue)}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>

            {selectedSubscriptions.length > 0 && (
              <Card withBorder padding="md" radius="md" bg="teal.0">
                <Text size="sm" fw={600} mb="xs">Summary</Text>
                <Group justify="space-between">
                  <div>
                    <Text size="xs" c="dimmed">Subscriptions Selected</Text>
                    <Text size="lg" fw={700}>{selectedSubscriptions.length}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">Total Seats</Text>
                    <Text size="lg" fw={700}>{totalSeats}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">Est. Monthly Value</Text>
                    <Text size="lg" fw={700}>~{formatCurrency(totalValue)}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">Transfer Expires</Text>
                    <Text size="lg" fw={700}>30 days</Text>
                  </div>
                </Group>
              </Card>
            )}

            <Alert 
              icon={<AlertTriangle size={16} />} 
              color="yellow"
              variant="light"
            >
              <Text size="xs">
                The target partner will have 30 days to accept this transfer. 
                Subscriptions will remain active with you until the transfer completes.
              </Text>
            </Alert>

            <Divider />

            <Group justify="space-between">
              <Button variant="subtle" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Group>
                <Button variant="subtle" onClick={handleClose}>
                  Cancel
                </Button>
                <Button 
                  color="teal"
                  onClick={handleSubmit} 
                  disabled={selectedSubscriptions.length === 0}
                >
                  Create Transfer →
                </Button>
              </Group>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
};

