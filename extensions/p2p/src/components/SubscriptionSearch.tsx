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
  SegmentedControl,
  ThemeIcon,
} from '@mantine/core';
import { Search, X, AlertCircle, Building2 } from 'lucide-react';
import { Subscription } from '../context/types';
import { formatCurrency, formatTermDuration } from '../utils/formatters';

// Extended mock data for search demo - represents searching across many customers
const mockSearchableSubscriptions: (Subscription & { customerName: string; customerId: string })[] = [
  // demoresellercustomer3's subscriptions
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
    id: 'sub-3',
    microsoftSubscriptionId: 'a1b2c3d4-e5f6-7890-abcd-333333333333',
    offerId: 'CFQ7TTC0LFLZ',
    productName: 'Microsoft 365 E5',
    skuName: 'Microsoft 365 E5',
    quantity: 10,
    billingCycle: 'Monthly',
    termDuration: 'P3Y',
    monthlyValue: 570,
    status: 'Active',
    isTransferable: true,
    customerName: 'demoresellercustomer3',
    customerId: 'cust-001',
  },
  // Woodgrove Bank subscriptions
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
    id: 'sub-wg-3',
    microsoftSubscriptionId: 'b2c3d4e5-f6a7-8901-bcde-333333333333',
    offerId: 'CFQ7TTC0HDB1',
    productName: 'Azure Reserved VM Instances',
    skuName: 'Standard_D4s_v3 (3 Year)',
    quantity: 5,
    billingCycle: 'Annual',
    termDuration: 'P3Y',
    monthlyValue: 2225,
    status: 'Active',
    isTransferable: false,
    ineligibilityReason: 'Azure Reserved Instances cannot be transferred',
    customerName: 'Woodgrove Bank',
    customerId: 'cust-002',
  },
  // Contoso Ltd subscriptions
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
    id: 'sub-co-2',
    microsoftSubscriptionId: 'c3d4e5f6-a7b8-9012-cdef-222222222222',
    offerId: 'CFQ7TTC0RM8K',
    productName: 'Microsoft Teams Rooms Pro',
    skuName: 'Teams Rooms Pro',
    quantity: 50,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 1000,
    status: 'Active',
    isTransferable: true,
    customerName: 'Contoso Ltd',
    customerId: 'cust-003',
  },
  // Fabrikam Inc subscriptions
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
  {
    id: 'sub-fab-2',
    microsoftSubscriptionId: 'd4e5f6a7-b8c9-0123-def0-222222222222',
    offerId: 'CFQ7TTC0LHXM',
    productName: 'Microsoft Defender for Business',
    skuName: 'Defender for Business',
    quantity: 500,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 2500,
    status: 'Active',
    isTransferable: true,
    customerName: 'Fabrikam Inc',
    customerId: 'cust-004',
  },
  // Adventure Works subscriptions
  {
    id: 'sub-aw-1',
    microsoftSubscriptionId: 'e5f6a7b8-c9d0-1234-ef01-111111111111',
    offerId: 'CFQ7TTC0LFLX',
    productName: 'Microsoft 365 E3',
    skuName: 'Microsoft 365 E3',
    quantity: 25,
    billingCycle: 'Monthly',
    termDuration: 'P1Y',
    monthlyValue: 900,
    status: 'Active',
    isTransferable: true,
    customerName: 'Adventure Works',
    customerId: 'cust-005',
  },
];

interface SubscriptionSearchProps {
  selectedSubscriptions: string[];
  onSelectionChange: (ids: string[]) => void;
  onInitiateTransfer: () => void;
}

type SearchType = 'customer' | 'subscription';

export function SubscriptionSearch({
  selectedSubscriptions,
  onSelectionChange,
  onInitiateTransfer,
}: SubscriptionSearchProps) {
  const [searchType, setSearchType] = useState<SearchType>('customer');
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
    
    const results = mockSearchableSubscriptions.filter(sub => {
      if (searchType === 'customer') {
        return (
          sub.customerName.toLowerCase().includes(query) ||
          sub.customerId.toLowerCase().includes(query)
        );
      } else {
        return (
          sub.microsoftSubscriptionId.toLowerCase().includes(query) ||
          sub.id.toLowerCase().includes(query) ||
          sub.productName.toLowerCase().includes(query)
        );
      }
    });

    setSearchResults(results);
    setIsSearching(false);
  }, [searchQuery, searchType]);

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
  const totalSelectedValue = selectedFromResults.reduce((sum, s) => sum + s.monthlyValue, 0);

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
              placeholder={
                searchType === 'customer'
                  ? 'Enter customer name or ID (e.g., "Woodgrove", "Contoso", "Fabrikam")...'
                  : 'Enter subscription ID or product name (e.g., "E3", "Defender")...'
              }
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
              size="sm" 
              onClick={handleSearch}
              loading={isSearching}
              disabled={!searchQuery.trim()}
            >
              Search
            </Button>
          </Group>

          <Text size="xs" c="dimmed">
            {searchType === 'customer' 
              ? 'Search across all customers to find subscriptions eligible for P2P transfer'
              : 'Search by Microsoft subscription ID or product name'}
          </Text>
        </Stack>
      </Card>

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

      {/* Initial State - Search Hints */}
      {!hasSearched && (
        <Card withBorder padding="md" bg="gray.0" ta="center">
          <Stack gap="sm" align="center">
            <ThemeIcon size="xl" color="gray" variant="light">
              <Search size={24} />
            </ThemeIcon>
            <Text size="sm" fw={500}>Search for Subscriptions</Text>
            <Text size="xs" c="dimmed" maw={400}>
              Use the search above to find subscriptions by customer name/ID or subscription ID. 
              Then select which subscriptions to include in a P2P transfer.
            </Text>
            <Group gap="xs" mt="xs">
              <Badge variant="outline" color="gray" size="sm">Try: "Woodgrove"</Badge>
              <Badge variant="outline" color="gray" size="sm">Try: "Contoso"</Badge>
              <Badge variant="outline" color="gray" size="sm">Try: "E5"</Badge>
            </Group>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}

