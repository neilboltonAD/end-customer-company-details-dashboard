import React, { useState } from "react";
import { 
  Space, Title, Text, Alert, Stack, Card, Button, Group, Badge,
  Accordion, Table, ActionIcon, Tooltip, Paper, Divider, TextInput,
  Modal, Checkbox, Stepper, ThemeIcon
} from "@mantine/core";
import { 
  IconInfoCircle, IconArrowsExchange, IconArrowDownLeft, IconArrowUpRight,
  IconCheck, IconX, IconEye, IconRefresh, IconPlus, IconSearch,
  IconAlertTriangle, IconCircleCheck, IconCircleX
} from "@tabler/icons-react";
import useMarketplaceContext from "../../hooks/useMarketplaceContext";
import { usePageTitle } from "../../hooks/usePageTitle";

// Inline mock data
const mockTransfers = [
  {
    id: "tr-001",
    direction: "Incoming" as const,
    partnerName: "Contoso Partners",
    itemCount: 3,
    value: 4500,
    status: "Pending" as const,
    expiresIn: 5,
    date: "2026-01-18",
  },
  {
    id: "tr-002", 
    direction: "Incoming" as const,
    partnerName: "Fabrikam Solutions",
    itemCount: 2,
    value: 2200,
    status: "Pending" as const,
    expiresIn: 12,
    date: "2026-01-25",
  },
  {
    id: "tr-003",
    direction: "Outgoing" as const,
    partnerName: "Adventure Works",
    itemCount: 5,
    value: 8750,
    status: "Pending" as const,
    expiresIn: 20,
    date: "2026-02-02",
  },
];

const mockSubscriptions = [
  { id: "sub-1", customer: "Woodgrove Bank", product: "Microsoft 365 E3", qty: 150, value: 5400, eligible: true },
  { id: "sub-2", customer: "Woodgrove Bank", product: "Power BI Pro", qty: 75, value: 750, eligible: true },
  { id: "sub-3", customer: "Contoso Ltd", product: "Microsoft 365 Business Premium", qty: 200, value: 4400, eligible: true },
  { id: "sub-4", customer: "Fabrikam Inc", product: "Microsoft 365 E5", qty: 500, value: 28500, eligible: true },
  { id: "sub-5", customer: "Adventure Works", product: "Azure Reserved VM", qty: 5, value: 2225, eligible: false },
];

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    Pending: "yellow",
    Completed: "green",
    Rejected: "red",
    Cancelled: "gray",
  };
  return <Badge color={colors[status] || "gray"} variant="light" size="sm">{status}</Badge>;
};

const App = (): JSX.Element => {
  const { tenant } = useMarketplaceContext();
  usePageTitle("P2P Subscription Transfers");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<typeof mockTransfers[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof mockSubscriptions>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [transfers, setTransfers] = useState(mockTransfers);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const results = mockSubscriptions.filter(s => 
      s.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.product.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleReview = (transfer: typeof mockTransfers[0]) => {
    setSelectedTransfer(transfer);
    setReviewModalOpen(true);
  };

  const handleViewDetails = (transfer: typeof mockTransfers[0]) => {
    setSelectedTransfer(transfer);
    setDetailsModalOpen(true);
  };

  const handleCancel = (transferId: string) => {
    setTransfers(prev => prev.filter(t => t.id !== transferId));
  };

  const handleAccept = () => {
    if (selectedTransfer) {
      setTransfers(prev => prev.filter(t => t.id !== selectedTransfer.id));
    }
    setReviewModalOpen(false);
    setSelectedTransfer(null);
  };

  const handleReject = () => {
    if (selectedTransfer) {
      setTransfers(prev => prev.filter(t => t.id !== selectedTransfer.id));
    }
    setReviewModalOpen(false);
    setSelectedTransfer(null);
  };

  return (
    <div data-e2e="microUIPage">
      {/* Demo Mode Banner */}
      <Alert 
        icon={<IconInfoCircle size={16} />} 
        color="orange"
        variant="light"
        mb="md"
        py="xs"
      >
        <Text size="sm"><strong>Demo Mode</strong> — Running with demo data on <strong>{tenant}</strong>. In production, connects to Microsoft Partner Center APIs.</Text>
      </Alert>

      {/* Header */}
      <Card shadow="xs" withBorder mb="md">
        <Card.Section withBorder p="md">
          <Group gap="md">
            <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'teal', to: 'blue' }} radius="md">
              <IconArrowsExchange size={24} />
            </ThemeIcon>
            <div>
              <Group gap="xs">
                <Title order={2}>P2P Transfers</Title>
                <Badge color="orange" variant="light" size="sm">DEMO</Badge>
              </Group>
              <Text size="sm" c="dimmed">
                Partner to Partner Subscription Transfer Management
              </Text>
            </div>
          </Group>
        </Card.Section>
      </Card>

      <Space h="md" />
      
      <Stack gap="md">

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <Card shadow="xs" padding="sm" radius="md" withBorder>
            <Group gap="xs" mb={4}>
              <ThemeIcon size="sm" color="blue" variant="light"><IconArrowDownLeft size={12} /></ThemeIcon>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Incoming</Text>
            </Group>
            <Text size="xl" fw={700}>2</Text>
            <Text size="xs" c="dimmed">pending review</Text>
          </Card>
          <Card shadow="xs" padding="sm" radius="md" withBorder>
            <Group gap="xs" mb={4}>
              <ThemeIcon size="sm" color="teal" variant="light"><IconArrowUpRight size={12} /></ThemeIcon>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Outgoing</Text>
            </Group>
            <Text size="xl" fw={700}>1</Text>
            <Text size="xs" c="dimmed">awaiting response</Text>
          </Card>
          <Card shadow="xs" padding="sm" radius="md" withBorder>
            <Group gap="xs" mb={4}>
              <ThemeIcon size="sm" color="green" variant="light"><IconCircleCheck size={12} /></ThemeIcon>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Completed</Text>
            </Group>
            <Text size="xl" fw={700}>5</Text>
            <Text size="xs" c="dimmed">last 90 days</Text>
          </Card>
          <Card shadow="xs" padding="sm" radius="md" withBorder>
            <Group gap="xs" mb={4}>
              <ThemeIcon size="sm" color="red" variant="light"><IconCircleX size={12} /></ThemeIcon>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Failed</Text>
            </Group>
            <Text size="xl" fw={700}>1</Text>
            <Text size="xs" c="dimmed">last 90 days</Text>
          </Card>
        </div>

        {/* Main Panel */}
        <Paper shadow="xs" radius="md" withBorder p="md">
          <Group justify="space-between" mb="md">
            <Group gap="sm">
              <Title order={4}>P2P Subscription Transfers</Title>
              {transfers.filter(t => t.direction === 'Incoming').length > 0 && (
                <Badge color="red" size="lg" circle>
                  {transfers.filter(t => t.direction === 'Incoming').length}
                </Badge>
              )}
            </Group>
            <Group gap="xs">
              <Button size="xs" variant="light" leftSection={<IconRefresh size={14} />}>
                Sync
              </Button>
              <Button size="xs" leftSection={<IconPlus size={14} />} onClick={() => setCreateModalOpen(true)}>
                New Transfer
              </Button>
            </Group>
          </Group>

          <Divider my="md" />

          <Accordion variant="separated" radius="md" multiple defaultValue={['search', 'active']}>
            {/* Search Subscriptions */}
            <Accordion.Item value="search">
              <Accordion.Control>
                <Group gap="xs">
                  <IconSearch size={16} />
                  <Text fw={500}>Find Subscriptions for Transfer</Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="md">
                  <Group gap="xs">
                    <TextInput
                      placeholder="Search by customer name or product..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.currentTarget.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      leftSection={<IconSearch size={14} />}
                      style={{ flex: 1 }}
                    />
                    <Button onClick={handleSearch} disabled={!searchQuery.trim()}>Search</Button>
                  </Group>

                  {hasSearched && searchResults.length === 0 && (
                    <Alert icon={<IconInfoCircle size={16} />} color="gray" variant="light">
                      No subscriptions found matching "{searchQuery}". Try: Woodgrove, Contoso, Fabrikam
                    </Alert>
                  )}

                  {searchResults.length > 0 && (
                    <Card withBorder padding="xs">
                      <Table striped highlightOnHover>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th style={{ width: 40 }}>
                              {searchResults.filter(s => s.eligible).length > 1 && (
                                <Checkbox
                                  checked={searchResults.filter(s => s.eligible).every(s => selectedSubs.includes(s.id))}
                                  indeterminate={
                                    searchResults.filter(s => s.eligible).some(s => selectedSubs.includes(s.id)) &&
                                    !searchResults.filter(s => s.eligible).every(s => selectedSubs.includes(s.id))
                                  }
                                  onChange={() => {
                                    const eligibleIds = searchResults.filter(s => s.eligible).map(s => s.id);
                                    const allSelected = eligibleIds.every(id => selectedSubs.includes(id));
                                    if (allSelected) {
                                      setSelectedSubs(selectedSubs.filter(id => !eligibleIds.includes(id)));
                                    } else {
                                      setSelectedSubs([...new Set([...selectedSubs, ...eligibleIds])]);
                                    }
                                  }}
                                  aria-label="Select all eligible"
                                />
                              )}
                            </Table.Th>
                            <Table.Th>Customer</Table.Th>
                            <Table.Th>Product</Table.Th>
                            <Table.Th>Qty</Table.Th>
                            <Table.Th>Est. Value/mo</Table.Th>
                            <Table.Th>Eligible</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {searchResults.map((sub) => (
                            <Table.Tr key={sub.id} style={{ 
                              opacity: sub.eligible ? 1 : 0.6,
                              backgroundColor: selectedSubs.includes(sub.id) ? 'var(--mantine-color-teal-0)' : undefined
                            }}>
                              <Table.Td>
                                <Checkbox
                                  checked={selectedSubs.includes(sub.id)}
                                  onChange={() => {
                                    setSelectedSubs(prev => 
                                      prev.includes(sub.id) 
                                        ? prev.filter(id => id !== sub.id)
                                        : [...prev, sub.id]
                                    );
                                  }}
                                  disabled={!sub.eligible}
                                />
                              </Table.Td>
                              <Table.Td><Text size="sm">{sub.customer}</Text></Table.Td>
                              <Table.Td><Text size="sm">{sub.product}</Text></Table.Td>
                              <Table.Td>{sub.qty}</Table.Td>
                              <Table.Td>~{formatCurrency(sub.value)}</Table.Td>
                              <Table.Td>
                                <Badge size="xs" color={sub.eligible ? "green" : "red"} variant="light">
                                  {sub.eligible ? "Yes" : "No"}
                                </Badge>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>

                      {selectedSubs.length > 0 && (
                        <Card withBorder bg="teal.0" padding="sm" mt="sm">
                          <Group justify="space-between">
                            <Text size="sm"><strong>{selectedSubs.length}</strong> subscription(s) selected</Text>
                            <Button size="xs" onClick={() => setCreateModalOpen(true)}>
                              Initiate Transfer
                            </Button>
                          </Group>
                        </Card>
                      )}
                    </Card>
                  )}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            {/* Active Transfers */}
            <Accordion.Item value="active">
              <Accordion.Control>
                <Group gap="xs">
                  <Text fw={500}>Active Transfers</Text>
                  <Badge size="sm" variant="light" color="blue">{transfers.length}</Badge>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
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
                    {transfers.map((transfer) => (
                      <Table.Tr 
                        key={transfer.id}
                        style={{ backgroundColor: transfer.expiresIn <= 7 ? 'var(--mantine-color-orange-0)' : undefined }}
                      >
                        <Table.Td>
                          <Group gap="xs">
                            <ThemeIcon 
                              size="sm" 
                              color={transfer.direction === 'Incoming' ? 'blue' : 'teal'} 
                              variant="light"
                            >
                              {transfer.direction === 'Incoming' 
                                ? <IconArrowDownLeft size={12} />
                                : <IconArrowUpRight size={12} />
                              }
                            </ThemeIcon>
                            <Text size="sm">{transfer.direction}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td><Text size="sm" fw={500}>{transfer.partnerName}</Text></Table.Td>
                        <Table.Td>{transfer.itemCount}</Table.Td>
                        <Table.Td>~{formatCurrency(transfer.value)}</Table.Td>
                        <Table.Td><StatusBadge status={transfer.status} /></Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            {transfer.expiresIn <= 7 && (
                              <Tooltip label={`Expires in ${transfer.expiresIn} days`}>
                                <IconAlertTriangle size={14} color="orange" />
                              </Tooltip>
                            )}
                            <Text size="xs" c="dimmed">{transfer.date}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Tooltip label="View Details">
                              <ActionIcon variant="subtle" size="sm" onClick={() => handleViewDetails(transfer)}>
                                <IconEye size={14} />
                              </ActionIcon>
                            </Tooltip>
                            {transfer.direction === 'Incoming' && (
                              <Tooltip label="Review & Accept">
                                <ActionIcon 
                                  variant="subtle" 
                                  size="sm" 
                                  color="green"
                                  onClick={() => handleReview(transfer)}
                                >
                                  <IconCheck size={14} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                            {transfer.direction === 'Outgoing' && (
                              <Tooltip label="Cancel Transfer">
                                <ActionIcon 
                                  variant="subtle" 
                                  size="sm" 
                                  color="red"
                                  onClick={() => handleCancel(transfer.id)}
                                >
                                  <IconX size={14} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Paper>
      </Stack>

      {/* Create Transfer Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => { setCreateModalOpen(false); setStep(0); }}
        title={
          <Group gap="xs">
            <ThemeIcon size="md" color="teal" variant="light">
              <IconArrowUpRight size={16} />
            </ThemeIcon>
            <Text fw={600}>Create Outbound Transfer</Text>
          </Group>
        }
        size="lg"
        centered
      >
        <Stepper active={step} size="sm" mb="lg">
          <Stepper.Step label="Select" description="Choose subscriptions" />
          <Stepper.Step label="Target" description="Partner details" />
          <Stepper.Step label="Confirm" description="Review & submit" />
        </Stepper>

        {step === 0 && (
          <Stack gap="md">
            <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
              <Text size="sm">Review the subscriptions below. Remove any you don't want to transfer.</Text>
            </Alert>
            
            {selectedSubs.length === 0 ? (
              <Alert color="orange" variant="light">
                <Text size="sm">No subscriptions selected. Go back to search and select subscriptions.</Text>
              </Alert>
            ) : (
              <Card withBorder padding="xs">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>{selectedSubs.length} subscription(s) selected</Text>
                  <Text size="sm" c="dimmed">
                    Est. Total: ~{formatCurrency(
                      mockSubscriptions
                        .filter(s => selectedSubs.includes(s.id))
                        .reduce((sum, s) => sum + s.value, 0)
                    )}/mo
                  </Text>
                </Group>
                <Table striped highlightOnHover withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Product</Table.Th>
                      <Table.Th>Qty</Table.Th>
                      <Table.Th>Est. Value/mo</Table.Th>
                      <Table.Th style={{ width: 50 }}></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockSubscriptions
                      .filter(s => selectedSubs.includes(s.id))
                      .map(sub => (
                        <Table.Tr key={sub.id}>
                          <Table.Td><Text size="sm">{sub.customer}</Text></Table.Td>
                          <Table.Td><Text size="sm">{sub.product}</Text></Table.Td>
                          <Table.Td>{sub.qty}</Table.Td>
                          <Table.Td>~{formatCurrency(sub.value)}</Table.Td>
                          <Table.Td>
                            <Tooltip label="Remove from transfer">
                              <ActionIcon 
                                variant="subtle" 
                                color="red" 
                                size="sm"
                                onClick={() => setSelectedSubs(selectedSubs.filter(id => id !== sub.id))}
                              >
                                <IconX size={14} />
                              </ActionIcon>
                            </Tooltip>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </Card>
            )}

            <Group justify="flex-end">
              <Button variant="default" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setStep(1)} disabled={selectedSubs.length === 0}>Next</Button>
            </Group>
          </Stack>
        )}

        {step === 1 && (
          <Stack gap="md">
            <TextInput label="Target Partner Tenant ID" placeholder="e.g., a1b2c3d4-e5f6-7890-abcd-ef1234567890" required />
            <TextInput label="MPN ID (optional)" placeholder="e.g., 1234567" />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>Next</Button>
            </Group>
          </Stack>
        )}

        {step === 2 && (
          <Stack gap="md">
            <Alert icon={<IconAlertTriangle size={16} />} color="yellow" variant="light">
              <Text size="sm">Please confirm. The target partner will have 30 days to accept.</Text>
            </Alert>
            <Card withBorder padding="sm">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Subscriptions</Text>
                <Text size="sm" fw={500}>{selectedSubs.length}</Text>
              </Group>
            </Card>
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setStep(1)}>Back</Button>
              <Button color="teal" onClick={() => { setCreateModalOpen(false); setStep(0); setSelectedSubs([]); }}>
                Confirm Transfer
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Review Transfer Modal */}
      <Modal
        opened={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={
          <Group gap="xs">
            <ThemeIcon size="md" color="blue" variant="light">
              <IconArrowDownLeft size={16} />
            </ThemeIcon>
            <Text fw={600}>Review Incoming Transfer</Text>
          </Group>
        }
        size="lg"
        centered
      >
        {selectedTransfer && (
          <Stack gap="md">
            {selectedTransfer.expiresIn <= 7 && (
              <Alert icon={<IconAlertTriangle size={16} />} color="orange" variant="filled">
                <Text size="sm" fw={500}>Expires in {selectedTransfer.expiresIn} days!</Text>
              </Alert>
            )}

            <Card withBorder padding="sm">
              <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">Source Partner</Text>
              <Text size="sm" fw={500}>{selectedTransfer.partnerName}</Text>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <Card withBorder padding="sm" ta="center">
                <Text size="xs" c="dimmed">Subscriptions</Text>
                <Text size="lg" fw={700}>{selectedTransfer.itemCount}</Text>
              </Card>
              <Card withBorder padding="sm" ta="center">
                <Text size="xs" c="dimmed">Est. Monthly Value</Text>
                <Text size="lg" fw={700}>~{formatCurrency(selectedTransfer.value)}</Text>
              </Card>
              <Card withBorder padding="sm" ta="center">
                <Text size="xs" c="dimmed">Expires</Text>
                <Text size="lg" fw={700}>{selectedTransfer.expiresIn}d</Text>
              </Card>
            </div>

            <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
              <Text size="sm">
                By accepting, you agree to manage these subscriptions worth ~{formatCurrency(selectedTransfer.value)}/month.
              </Text>
            </Alert>

            <Group justify="flex-end" gap="xs">
              <Button variant="default" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
              <Button variant="light" color="red" onClick={handleReject}>Reject</Button>
              <Button color="green" onClick={handleAccept}>Accept Transfer</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Details Modal */}
      <Modal
        opened={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={
          <Group gap="xs">
            <ThemeIcon size="md" color="gray" variant="light">
              <IconEye size={16} />
            </ThemeIcon>
            <Text fw={600}>Transfer Details</Text>
            {selectedTransfer && <StatusBadge status={selectedTransfer.status} />}
          </Group>
        }
        size="lg"
        centered
      >
        {selectedTransfer && (
          <Stack gap="md">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Card withBorder padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">
                  {selectedTransfer.direction === 'Incoming' ? 'Source Partner' : 'Target Partner'}
                </Text>
                <Text size="sm" fw={500}>{selectedTransfer.partnerName}</Text>
                <Text size="xs" c="dimmed" ff="monospace">tenant-id-placeholder</Text>
              </Card>
              <Card withBorder padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">Transfer Type</Text>
                <Group gap="xs">
                  <ThemeIcon 
                    size="sm" 
                    color={selectedTransfer.direction === 'Incoming' ? 'blue' : 'teal'} 
                    variant="light"
                  >
                    {selectedTransfer.direction === 'Incoming' 
                      ? <IconArrowDownLeft size={12} />
                      : <IconArrowUpRight size={12} />
                    }
                  </ThemeIcon>
                  <Text size="sm" fw={500}>{selectedTransfer.direction}</Text>
                </Group>
              </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <Card withBorder padding="sm" ta="center">
                <Text size="xs" c="dimmed">Subscriptions</Text>
                <Text size="lg" fw={700}>{selectedTransfer.itemCount}</Text>
              </Card>
              <Card withBorder padding="sm" ta="center">
                <Text size="xs" c="dimmed">Est. Monthly Value</Text>
                <Text size="lg" fw={700}>~{formatCurrency(selectedTransfer.value)}</Text>
              </Card>
              <Card withBorder padding="sm" ta="center">
                <Text size="xs" c="dimmed">Created</Text>
                <Text size="sm" fw={500}>2026-01-10</Text>
              </Card>
              <Card withBorder padding="sm" ta="center">
                <Text size="xs" c="dimmed">Expires</Text>
                <Group gap={4} justify="center">
                  <Text size="sm" fw={500}>{selectedTransfer.date}</Text>
                  {selectedTransfer.expiresIn <= 7 && (
                    <Badge size="xs" color="red">URGENT</Badge>
                  )}
                </Group>
              </Card>
            </div>

            <Card withBorder padding="sm">
              <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="sm">Subscription Line Items</Text>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Qty</Table.Th>
                    <Table.Th>Est. Value/mo</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td><Text size="sm">Microsoft 365 E3</Text></Table.Td>
                    <Table.Td>50</Table.Td>
                    <Table.Td>~$1,800</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td><Text size="sm">Power BI Pro</Text></Table.Td>
                    <Table.Td>25</Table.Td>
                    <Table.Td>~$250</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td><Text size="sm">Microsoft Defender</Text></Table.Td>
                    <Table.Td>50</Table.Td>
                    <Table.Td>~$150</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Card>

            <Group justify="flex-end">
              <Button variant="default" onClick={() => setDetailsModalOpen(false)}>Close</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  );
};

export default App;
