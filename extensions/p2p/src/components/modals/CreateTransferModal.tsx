import React, { useState, useEffect, useCallback } from 'react';
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
  SegmentedControl,
  ActionIcon,
  Loader,
  Center,
  Stepper,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { ArrowUpRight, AlertCircle, Info, Search, X, Building2 } from 'lucide-react';
import { Subscription } from '../../context/types';
import { useTransfers } from '../../hooks/useTransfers';
import { formatCurrency } from '../../utils/formatters';
import { validateCreateTransferInput, isValidTenantId } from '../../utils/validators';

// Extended mock data for search
const mockSearchableSubscriptions: (Subscription & { customerName: string; customerId: string })[] = [
  {
    id: 'sub-1',
    microsoftSubscriptionId: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
    offerId: 'CFQ7TTC0LH18',
    productName: 'Microsoft 365 Business Premium',
    skuName: 'Microsoft 365 Business Premium',
    quantity: 50,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 1100,
    status: 'Active',
    isTransferable: true,
    customerName: 'demoresellercustomer3',
    customerId: 'cust-001',
  },
  {
    id: 'sub-2',
    microsoftSubscriptionId: 'a1b2c3d4-e5f6-7890-abcd-222222222222',
    offerId: 'CFQ7TTC0LFLX',
    productName: 'Microsoft 365 E3',
    skuName: 'Microsoft 365 E3',
    quantity: 30,
    billingCycle: 'Annual',
    termDuration: 'P1Y',
    monthlyValue: 1080,
    status: 'Active',
    isTransferable: true,
    customerName: 'demoresellercustomer3',
    customerId: 'cust-001',
  },
  {
    id: 'sub-wg-1',
    microsoftSubscriptionId: 'b2c3d4e5-f6a7-8901-bcde-111111111111',
    offerId: 'CFQ7TTC0LFLX',
    productName: 'Microsoft 365 E3',
    skuName: 'Microsoft 365 E3',
    quantity: 150,
    billingCycle: 'Annual',
    termDuration: 'P1Y',
    monthlyValue: 5400,
    status: 'Active',
    isTransferable: true,
    customerName: 'Woodgrove Bank',
    customerId: 'cust-002',
  },
  {
    id: 'sub-wg-2',
    microsoftSubscriptionId: 'b2c3d4e5-f6a7-8901-bcde-222222222222',
    offerId: 'CFQ7TTC0NXVL',
    productName: 'Power BI Pro',
    skuName: 'Power BI Pro',
    quantity: 75,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 750,
    status: 'Active',
    isTransferable: true,
    customerName: 'Woodgrove Bank',
    customerId: 'cust-002',
  },
  {
    id: 'sub-co-1',
    microsoftSubscriptionId: 'c3d4e5f6-a7b8-9012-cdef-111111111111',
    offerId: 'CFQ7TTC0LH18',
    productName: 'Microsoft 365 Business Premium',
    skuName: 'Microsoft 365 Business Premium',
    quantity: 200,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 4400,
    status: 'Active',
    isTransferable: true,
    customerName: 'Contoso Ltd',
    customerId: 'cust-003',
  },
  {
    id: 'sub-fab-1',
    microsoftSubscriptionId: 'd4e5f6a7-b8c9-0123-def0-111111111111',
    offerId: 'CFQ7TTC0LFLZ',
    productName: 'Microsoft 365 E5',
    skuName: 'Microsoft 365 E5',
    quantity: 500,
    billingCycle: 'Annual',
    termDuration: 'P1Y',
    monthlyValue: 28500,
    status: 'Active',
    isTransferable: true,
    customerName: 'Fabrikam Inc',
    customerId: 'cust-004',
  },
];

interface CreateTransferModalProps {
  open: boolean;
  onClose: () => void;
  selectedSubscriptionIds?: string[];
  subscriptions?: Subscription[];
}

type SearchType = 'customer' | 'subscription';

export function CreateTransferModal({
  open,
  onClose,
  selectedSubscriptionIds = [],
}: CreateTransferModalProps) {
  const { create, submitting } = useTransfers();
  
  const [active, setActive] = useState(0);
  const [targetTenantId, setTargetTenantId] = useState('');
  const [targetMpnId, setTargetMpnId] = useState('');
  const [selectedSubs, setSelectedSubs] = useState<string[]>(selectedSubscriptionIds);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Search state
  const [searchType, setSearchType] = useState<SearchType>('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof mockSearchableSubscriptions>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setActive(0);
      setSelectedSubs(selectedSubscriptionIds);
      setErrors([]);
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
      setTargetTenantId('');
      setTargetMpnId('');
    }
  }, [open, selectedSubscriptionIds]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    await new Promise(resolve => setTimeout(resolve, 400));

    const query = searchQuery.toLowerCase().trim();
    const results = mockSearchableSubscriptions.filter(sub => {
      if (searchType === 'customer') {
        return sub.customerName.toLowerCase().includes(query) || sub.customerId.toLowerCase().includes(query);
      } else {
        return sub.microsoftSubscriptionId.toLowerCase().includes(query) || 
               sub.productName.toLowerCase().includes(query);
      }
    });

    setSearchResults(results);
    setIsSearching(false);
  }, [searchQuery, searchType]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const toggleSubscription = (subId: string) => {
    setSelectedSubs(prev => prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]);
  };

  const selectedSubscriptions = searchResults.filter(s => selectedSubs.includes(s.id) && s.isTransferable);
  const totalValue = selectedSubscriptions.reduce((sum, s) => sum + s.monthlyValue, 0);

  const handleNext = () => {
    if (active === 0) {
      if (selectedSubs.length === 0) {
        setErrors(['Select at least one subscription']);
        return;
      }
      setErrors([]);
      setActive(1);
    } else if (active === 1) {
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
      setActive(2);
    }
  };

  const handleBack = () => {
    setErrors([]);
    setActive(prev => Math.max(0, prev - 1));
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

  // Group results by customer
  const groupedResults = searchResults.reduce((acc, sub) => {
    if (!acc[sub.customerId]) {
      acc[sub.customerId] = { customerName: sub.customerName, customerId: sub.customerId, subscriptions: [] };
    }
    acc[sub.customerId].subscriptions.push(sub);
    return acc;
  }, {} as Record<string, { customerName: string; customerId: string; subscriptions: typeof searchResults }>);

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
      size="xl"
      centered
    >
      <Stack gap="md">
        <Stepper active={active} size="sm">
          <Stepper.Step label="Select Subscriptions" description="Search and select" />
          <Stepper.Step label="Target Partner" description="Enter partner details" />
          <Stepper.Step label="Confirm" description="Review and submit" />
        </Stepper>

        {errors.length > 0 && (
          <Alert icon={<AlertCircle size={16} />} title="Validation Error" color="red">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>
          </Alert>
        )}

        {/* Step 1: Search & Select Subscriptions */}
        {active === 0 && (
          <Stack gap="md">
            <Alert icon={<Info size={16} />} color="blue" variant="light">
              <Text size="sm">Search for subscriptions by customer or subscription ID to include in this transfer.</Text>
            </Alert>

            <Card withBorder padding="sm" bg="gray.0">
              <Stack gap="sm">
                <Group gap="xs">
                  <Text size="sm" fw={500}>Search by:</Text>
                  <SegmentedControl
                    size="xs"
                    value={searchType}
                    onChange={(v) => setSearchType(v as SearchType)}
                    data={[
                      { label: 'Customer', value: 'customer' },
                      { label: 'Subscription', value: 'subscription' },
                    ]}
                  />
                </Group>
                
                <Group gap="xs">
                  <TextInput
                    placeholder={searchType === 'customer' ? 'Enter customer name (e.g., "Woodgrove", "Contoso")...' : 'Enter subscription ID or product name...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
                    leftSection={<Search size={14} />}
                    rightSection={searchQuery && (
                      <ActionIcon size="xs" variant="subtle" onClick={() => { setSearchQuery(''); setSearchResults([]); setHasSearched(false); }}>
                        <X size={12} />
                      </ActionIcon>
                    )}
                    style={{ flex: 1 }}
                  />
                  <Button size="sm" onClick={handleSearch} loading={isSearching} disabled={!searchQuery.trim()}>
                    Search
                  </Button>
                </Group>
              </Stack>
            </Card>

            {isSearching && <Center py="md"><Loader size="sm" /></Center>}

            {!isSearching && hasSearched && searchResults.length === 0 && (
              <Alert icon={<AlertCircle size={16} />} color="gray" variant="light">
                No subscriptions found matching "{searchQuery}".
              </Alert>
            )}

            {!isSearching && searchResults.length > 0 && (
              <Stack gap="sm">
                <Text size="sm" c="dimmed">
                  Found <strong>{searchResults.length}</strong> subscription(s) across <strong>{Object.keys(groupedResults).length}</strong> customer(s)
                </Text>

                {Object.values(groupedResults).map((group) => (
                  <Card key={group.customerId} withBorder padding="xs" radius="md">
                    <Group gap="xs" mb="xs">
                      <ThemeIcon size="sm" color="blue" variant="light"><Building2 size={12} /></ThemeIcon>
                      <Text size="sm" fw={600}>{group.customerName}</Text>
                    </Group>
                    
                    <Table striped highlightOnHover withTableBorder>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th style={{ width: 40 }}></Table.Th>
                          <Table.Th>Product</Table.Th>
                          <Table.Th>Qty</Table.Th>
                          <Table.Th>Est. Value/mo</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {group.subscriptions.map((sub) => (
                          <Table.Tr key={sub.id} style={{ backgroundColor: selectedSubs.includes(sub.id) ? 'var(--mantine-color-teal-0)' : undefined }}>
                            <Table.Td>
                              <Checkbox
                                checked={selectedSubs.includes(sub.id)}
                                onChange={() => toggleSubscription(sub.id)}
                                disabled={!sub.isTransferable}
                              />
                            </Table.Td>
                            <Table.Td>
                              <Text size="sm" fw={500}>{sub.productName}</Text>
                            </Table.Td>
                            <Table.Td>{sub.quantity}</Table.Td>
                            <Table.Td>~{formatCurrency(sub.monthlyValue)}</Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Card>
                ))}
              </Stack>
            )}

            {selectedSubs.length > 0 && (
              <Card withBorder bg="teal.0" padding="sm">
                <Group justify="space-between">
                  <Text size="sm"><strong>{selectedSubs.length}</strong> subscription(s) selected</Text>
                  <Text size="sm">Est. Total: <strong>~{formatCurrency(totalValue)}/mo</strong></Text>
                </Group>
              </Card>
            )}

            <Group justify="flex-end" gap="xs">
              <Button variant="default" onClick={onClose}>Cancel</Button>
              <Button onClick={handleNext} disabled={selectedSubs.length === 0}>Continue</Button>
            </Group>
          </Stack>
        )}

        {/* Step 2: Target Partner */}
        {active === 1 && (
          <Stack gap="md">
            <Alert icon={<Info size={16} />} color="blue" variant="light">
              <Text size="sm">Enter the Microsoft Partner Centre details for the partner receiving these subscriptions.</Text>
            </Alert>

            <Card withBorder padding="md">
              <Text size="sm" fw={600} mb="md">Target Partner Information</Text>
              <Stack gap="sm">
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

            <Card withBorder bg="gray.0" padding="sm">
              <Text size="xs" c="dimmed" fw={600} mb="xs">SELECTED SUBSCRIPTIONS</Text>
              <Text size="sm">{selectedSubs.length} subscription(s) • Est. ~{formatCurrency(totalValue)}/mo</Text>
            </Card>

            <Group justify="flex-end" gap="xs">
              <Button variant="default" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} disabled={!targetTenantId}>Continue</Button>
            </Group>
          </Stack>
        )}

        {/* Step 3: Confirm */}
        {active === 2 && (
          <Stack gap="md">
            <Alert icon={<AlertCircle size={16} />} color="yellow" variant="light">
              <Text size="sm">Please confirm this transfer request. The target partner will have 30 days to accept.</Text>
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
                  <Table.Th>Customer</Table.Th>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>Qty</Table.Th>
                  <Table.Th>Est. Value/mo</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {selectedSubscriptions.map((sub) => (
                  <Table.Tr key={sub.id}>
                    <Table.Td><Text size="xs" c="dimmed">{sub.customerName}</Text></Table.Td>
                    <Table.Td><Text size="sm">{sub.productName}</Text></Table.Td>
                    <Table.Td>{sub.quantity}</Table.Td>
                    <Table.Td>~{formatCurrency(sub.monthlyValue)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Group justify="flex-end" gap="xs">
              <Button variant="default" onClick={handleBack}>Back</Button>
              <Button loading={submitting} onClick={handleSubmit}>Confirm Transfer</Button>
            </Group>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}
