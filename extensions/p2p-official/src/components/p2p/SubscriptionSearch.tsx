import React, { useState, useCallback } from 'react';
import {
  TextInput,
  Button,
  Group,
  Stack,
  Table,
  Text,
  Checkbox,
  Card,
  Badge,
  ActionIcon,
  Tooltip,
  Alert,
  Loader,
  Center,
  ThemeIcon,
} from '@mantine/core';
import { Search, X, AlertCircle, Building2 } from 'lucide-react';
import { formatCurrency, formatTermDuration } from '../../utils/formatters';
import { mockSearchableSubscriptions, calculateTotalValue } from '../../api/subscriptionData';

interface SubscriptionSearchProps {
  selectedSubscriptions: string[];
  onSelectionChange: (ids: string[]) => void;
  onInitiateTransfer: () => void;
}

export function SubscriptionSearch({
  selectedSubscriptions,
  onSelectionChange,
  onInitiateTransfer,
}: SubscriptionSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof mockSearchableSubscriptions>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const query = searchQuery.toLowerCase().trim();
    
    // Search across both customer and subscription fields
    const results = mockSearchableSubscriptions.filter(sub => 
      sub.customerName.toLowerCase().includes(query) ||
      sub.customerId.toLowerCase().includes(query) ||
      sub.microsoftSubscriptionId.toLowerCase().includes(query) ||
      sub.id.toLowerCase().includes(query) ||
      sub.productName.toLowerCase().includes(query) ||
      sub.skuName.toLowerCase().includes(query)
    );

    setSearchResults(results);
    setIsSearching(false);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    onSelectionChange([]);
  };

  const toggleSubscription = (subId: string) => {
    if (selectedSubscriptions.includes(subId)) {
      onSelectionChange(selectedSubscriptions.filter(id => id !== subId));
    } else {
      onSelectionChange([...selectedSubscriptions, subId]);
    }
  };

  const toggleAll = () => {
    const transferableIds = searchResults
      .filter(s => s.isTransferable)
      .map(s => s.id);
    
    const allSelected = transferableIds.every(id => selectedSubscriptions.includes(id));
    
    if (allSelected) {
      onSelectionChange(selectedSubscriptions.filter(id => !transferableIds.includes(id)));
    } else {
      onSelectionChange([...new Set([...selectedSubscriptions, ...transferableIds])]);
    }
  };

  const selectedFromResults = searchResults.filter(s => 
    selectedSubscriptions.includes(s.id) && s.isTransferable
  );
  // Use centralized calculation for accurate totals
  const totalSelectedValue = calculateTotalValue(selectedSubscriptions);

  // Group results by customer for better display
  const groupedResults = searchResults.reduce((acc, sub) => {
    if (!acc[sub.customerId]) {
      acc[sub.customerId] = {
        customerName: sub.customerName,
        customerId: sub.customerId,
        subscriptions: [],
      };
    }
    acc[sub.customerId].subscriptions.push(sub);
    return acc;
  }, {} as Record<string, { customerName: string; customerId: string; subscriptions: typeof searchResults }>);

  return (
    <Stack gap="md">
      {/* Search Controls */}
      <Group gap="xs">
        <TextInput
          placeholder="Search by customer name, subscription ID, or product name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          leftSection={<Search size={14} />}
          rightSection={
            searchQuery && (
              <ActionIcon size="xs" variant="subtle" onClick={clearSearch}>
                <X size={12} />
              </ActionIcon>
            )
          }
          style={{ flex: 1 }}
        />
        <Button 
          onClick={handleSearch}
          loading={isSearching}
          disabled={!searchQuery.trim()}
        >
          Search
        </Button>
      </Group>

      {/* Search Results */}
      {isSearching && (
        <Center py="xl">
          <Loader size="sm" />
        </Center>
      )}

      {!isSearching && hasSearched && searchResults.length === 0 && (
        <Alert icon={<AlertCircle size={16} />} color="gray" variant="light">
          <Text size="sm">
            No subscriptions found matching "{searchQuery}". Try a different search term.
          </Text>
        </Alert>
      )}

      {!isSearching && searchResults.length > 0 && (
        <Stack gap="md">
          {/* Results Summary */}
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Found <strong>{searchResults.length}</strong> subscription{searchResults.length !== 1 ? 's' : ''} across{' '}
              <strong>{Object.keys(groupedResults).length}</strong> customer{Object.keys(groupedResults).length !== 1 ? 's' : ''}
            </Text>
            <Button
              variant="subtle"
              size="xs"
              onClick={toggleAll}
            >
              {searchResults.filter(s => s.isTransferable).every(s => selectedSubscriptions.includes(s.id))
                ? 'Deselect All'
                : 'Select All Eligible'}
            </Button>
          </Group>

          {/* Grouped Results */}
          {Object.values(groupedResults).map((group) => (
            <Card key={group.customerId} withBorder padding="xs" radius="md">
              <Group gap="xs" mb="xs">
                <ThemeIcon size="sm" color="blue" variant="light">
                  <Building2 size={12} />
                </ThemeIcon>
                <Text size="sm" fw={600}>{group.customerName}</Text>
                <Badge size="xs" variant="light" color="gray">
                  {group.subscriptions.length} subscription{group.subscriptions.length !== 1 ? 's' : ''}
                </Badge>
              </Group>
              
              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ width: 40 }}></Table.Th>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Subscription ID</Table.Th>
                    <Table.Th>Qty</Table.Th>
                    <Table.Th>Term</Table.Th>
                    <Table.Th>Est. Value/mo</Table.Th>
                    <Table.Th>Eligible</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {group.subscriptions.map((sub) => (
                    <Table.Tr 
                      key={sub.id}
                      style={{ 
                        opacity: sub.isTransferable ? 1 : 0.6,
                        backgroundColor: selectedSubscriptions.includes(sub.id) ? 'var(--mantine-color-teal-0)' : undefined
                      }}
                    >
                      <Table.Td>
                        <Checkbox
                          checked={selectedSubscriptions.includes(sub.id)}
                          onChange={() => toggleSubscription(sub.id)}
                          disabled={!sub.isTransferable}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={500}>{sub.productName}</Text>
                        <Text size="xs" c="dimmed">{sub.skuName}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Tooltip label={sub.microsoftSubscriptionId}>
                          <Text size="xs" ff="monospace" c="dimmed">
                            {sub.microsoftSubscriptionId.slice(0, 8)}...
                          </Text>
                        </Tooltip>
                      </Table.Td>
                      <Table.Td>{sub.quantity}</Table.Td>
                      <Table.Td>{formatTermDuration(sub.termDuration)}</Table.Td>
                      <Table.Td>~{formatCurrency(sub.monthlyValue)}</Table.Td>
                      <Table.Td>
                        {sub.isTransferable ? (
                          <Badge size="xs" color="green" variant="light">Yes</Badge>
                        ) : (
                          <Tooltip label={sub.ineligibilityReason}>
                            <Badge size="xs" color="red" variant="light">No</Badge>
                          </Tooltip>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          ))}

          {/* Selection Summary & Action */}
          {selectedSubscriptions.length > 0 && (
            <Card withBorder bg="teal.0" padding="sm" radius="md">
              <Group justify="space-between">
                <Stack gap={2}>
                  <Text size="sm" fw={500}>
                    {selectedFromResults.length} subscription{selectedFromResults.length !== 1 ? 's' : ''} selected
                  </Text>
                  <Text size="xs" c="dimmed">
                    Est. total: ~{formatCurrency(totalSelectedValue)}/mo
                  </Text>
                </Stack>
                <Button onClick={onInitiateTransfer}>
                  Initiate Transfer
                </Button>
              </Group>
            </Card>
          )}
        </Stack>
      )}

    </Stack>
  );
}
