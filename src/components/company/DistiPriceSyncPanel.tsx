import React, { useMemo, useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  X,
  Trash2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { ActionIcon, Badge, Button, Card, Inline, Modal, Select, Stack, Tabs, Text, TextInput, Title } from 'components/DesignSystem';
import { DataTable } from 'components/DesignSystem';
import type { DataTableColumn } from 'components/DesignSystem';

type Distributor = 'INGRAM' | 'TD_SYNNEX' | 'MICROSOFT' | 'ARROW';
type UpdateStatus = 'AVAILABLE' | 'PENDING' | 'SUCCESS' | 'FAILED';

interface PriceUpdate {
  id: string;
  productId: string;
  productName: string;
  distributor: Distributor;
  currentPrice: number;
  newPrice: number;
  percentChange: number;
  detectedAt: string;
  status: UpdateStatus;
  updatedAt?: string;
  updatedBy?: string;
  errorMessage?: string;
}

const distributorInfo: Record<Distributor, { name: string }> = {
  INGRAM: { name: 'Ingram Micro' },
  TD_SYNNEX: { name: 'TD Synnex' },
  MICROSOFT: { name: 'Microsoft Marketplace' },
  ARROW: { name: 'Arrow Electronics' },
};

const calcPercent = (current: number, newPrice: number): number => {
  return Number((((newPrice - current) / current) * 100).toFixed(1));
};

const initialPriceUpdates: PriceUpdate[] = [
  { id: 'pu-001', productId: 'MS-365-E3-001', productName: 'Microsoft 365 E3', distributor: 'INGRAM', currentPrice: 32.0, newPrice: 35.0, percentChange: calcPercent(32.0, 35.0), detectedAt: '2026-01-14T08:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-002', productId: 'WIN-SRV-2022', productName: 'Windows Server 2022 Standard', distributor: 'TD_SYNNEX', currentPrice: 120.0, newPrice: 115.0, percentChange: calcPercent(120.0, 115.0), detectedAt: '2026-01-14T08:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-003', productId: 'AZ-VM-RES-01', productName: 'Azure Reserved VM Instance (D2s v3)', distributor: 'MICROSOFT', currentPrice: 89.0, newPrice: 92.0, percentChange: calcPercent(89.0, 92.0), detectedAt: '2026-01-14T07:30:00Z', status: 'AVAILABLE' },
  { id: 'pu-004', productId: 'D365-SALES-ENT', productName: 'Dynamics 365 Sales Enterprise', distributor: 'ARROW', currentPrice: 65.0, newPrice: 68.0, percentChange: calcPercent(65.0, 68.0), detectedAt: '2026-01-14T06:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-005', productId: 'PBI-PRO-001', productName: 'Power BI Pro', distributor: 'INGRAM', currentPrice: 10.0, newPrice: 9.99, percentChange: calcPercent(10.0, 9.99), detectedAt: '2026-01-14T08:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-006', productId: 'MS-365-BP-001', productName: 'Microsoft 365 Business Premium', distributor: 'TD_SYNNEX', currentPrice: 22.0, newPrice: 24.0, percentChange: calcPercent(22.0, 24.0), detectedAt: '2026-01-13T22:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-007', productId: 'O365-E1-001', productName: 'Office 365 E1', distributor: 'MICROSOFT', currentPrice: 8.0, newPrice: 8.25, percentChange: calcPercent(8.0, 8.25), detectedAt: '2026-01-13T20:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-008', productId: 'INTUNE-001', productName: 'Microsoft Intune Plan 1', distributor: 'ARROW', currentPrice: 8.0, newPrice: 8.5, percentChange: calcPercent(8.0, 8.5), detectedAt: '2026-01-13T18:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-009', productId: 'DEFENDER-BIZ', productName: 'Microsoft Defender for Business', distributor: 'INGRAM', currentPrice: 3.0, newPrice: 2.75, percentChange: calcPercent(3.0, 2.75), detectedAt: '2026-01-13T16:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-010', productId: 'TEAMS-PREM', productName: 'Microsoft Teams Premium', distributor: 'TD_SYNNEX', currentPrice: 10.0, newPrice: 12.0, percentChange: calcPercent(10.0, 12.0), detectedAt: '2026-01-13T14:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-011', productId: 'VISIO-P1', productName: 'Visio Plan 1', distributor: 'MICROSOFT', currentPrice: 5.0, newPrice: 5.5, percentChange: calcPercent(5.0, 5.5), detectedAt: '2026-01-13T12:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-012', productId: 'PROJECT-P3', productName: 'Project Plan 3', distributor: 'ARROW', currentPrice: 30.0, newPrice: 32.0, percentChange: calcPercent(30.0, 32.0), detectedAt: '2026-01-13T10:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-013', productId: 'COPILOT-M365', productName: 'Microsoft 365 Copilot', distributor: 'INGRAM', currentPrice: 30.0, newPrice: 28.0, percentChange: calcPercent(30.0, 28.0), detectedAt: '2026-01-12T08:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-014', productId: 'EXCHANGE-P1', productName: 'Exchange Online Plan 1', distributor: 'TD_SYNNEX', currentPrice: 4.0, newPrice: 4.25, percentChange: calcPercent(4.0, 4.25), detectedAt: '2026-01-12T06:00:00Z', status: 'AVAILABLE' },
  { id: 'pu-015', productId: 'SHAREPOINT-P1', productName: 'SharePoint Online Plan 1', distributor: 'MICROSOFT', currentPrice: 5.0, newPrice: 5.25, percentChange: calcPercent(5.0, 5.25), detectedAt: '2026-01-12T04:00:00Z', status: 'AVAILABLE' },
];

const initialSyncedPrices: PriceUpdate[] = [
  { id: 'sp-001', productId: 'MS-365-E5-001', productName: 'Microsoft 365 E5', distributor: 'INGRAM', currentPrice: 54.0, newPrice: 57.0, percentChange: 5.6, detectedAt: '2026-01-13T08:00:00Z', status: 'SUCCESS', updatedAt: '2026-01-14T09:15:00Z', updatedBy: 'neil.bolton@appdirect.com' },
  { id: 'sp-002', productId: 'WIN-SRV-DC', productName: 'Windows Server 2022 Datacenter', distributor: 'TD_SYNNEX', currentPrice: 350.0, newPrice: 340.0, percentChange: -2.9, detectedAt: '2026-01-13T08:00:00Z', status: 'SUCCESS', updatedAt: '2026-01-14T09:15:00Z', updatedBy: 'neil.bolton@appdirect.com' },
  { id: 'sp-003', productId: 'AZ-SQL-DB', productName: 'Azure SQL Database (Basic)', distributor: 'MICROSOFT', currentPrice: 5.0, newPrice: 4.99, percentChange: -0.2, detectedAt: '2026-01-13T06:00:00Z', status: 'PENDING', updatedAt: '2026-01-14T09:00:00Z', updatedBy: 'neil.bolton@appdirect.com' },
  { id: 'sp-004', productId: 'D365-BASIC', productName: 'Dynamics 365 Business Central Essential', distributor: 'ARROW', currentPrice: 70.0, newPrice: 75.0, percentChange: 7.1, detectedAt: '2026-01-12T08:00:00Z', status: 'FAILED', updatedAt: '2026-01-13T10:00:00Z', updatedBy: 'neil.bolton@appdirect.com', errorMessage: 'Product not found in catalogue. SKU may have been deprecated.' },
  { id: 'sp-005', productId: 'TEAMS-ESS', productName: 'Microsoft Teams Essentials', distributor: 'INGRAM', currentPrice: 4.0, newPrice: 4.5, percentChange: 12.5, detectedAt: '2026-01-12T06:00:00Z', status: 'SUCCESS', updatedAt: '2026-01-12T14:30:00Z', updatedBy: 'admin@appdirect.com' },
  { id: 'sp-006', productId: 'ONEDRIVE-B1', productName: 'OneDrive for Business Plan 1', distributor: 'TD_SYNNEX', currentPrice: 5.0, newPrice: 5.1, percentChange: 2.0, detectedAt: '2026-01-11T08:00:00Z', status: 'SUCCESS', updatedAt: '2026-01-11T16:00:00Z', updatedBy: 'admin@appdirect.com' },
  { id: 'sp-007', productId: 'POWER-APPS', productName: 'Power Apps per User Plan', distributor: 'MICROSOFT', currentPrice: 20.0, newPrice: 21.0, percentChange: 5.0, detectedAt: '2026-01-10T08:00:00Z', status: 'SUCCESS', updatedAt: '2026-01-10T12:00:00Z', updatedBy: 'admin@appdirect.com' },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const StatusBadge = ({ status }: { status: UpdateStatus }) => {
  const config = {
    SUCCESS: { icon: Check, label: 'Success', color: 'success' as const },
    PENDING: { icon: Clock, label: 'Pending', color: 'pending' as const },
    FAILED: { icon: X, label: 'Failed', color: 'danger' as const },
    AVAILABLE: { icon: Clock, label: 'Available', color: 'info' as const },
  };

  const { icon: Icon, label, color } = config[status];

  return (
    <Badge size="xs" color={color} variant="outline">
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon size={12} />
        {label}
      </span>
    </Badge>
  );
};

const DistributorBadge = ({ distributor }: { distributor: Distributor }) => {
  const info = distributorInfo[distributor];
  return (
    <Badge size="xs" color="default" variant="outline">
      {info.name}
    </Badge>
  );
};

const PriceChangeBadge = ({ percentChange }: { percentChange: number }) => {
  const isIncrease = percentChange > 0;
  const isDecrease = percentChange < 0;
  const Icon = isIncrease ? ArrowUp : ArrowDown;

  return (
    <Badge
      size="xs"
      variant="outline"
      color={isIncrease ? 'danger' : isDecrease ? 'success' : 'default'}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {percentChange !== 0 && <Icon size={12} />}
        {percentChange > 0 ? '+' : ''}
        {percentChange}%
      </span>
    </Badge>
  );
};

const ReviewModal = ({
  isOpen,
  onClose,
  selectedItems,
  onRemoveItem,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: PriceUpdate[];
  onRemoveItem: (id: string) => void;
  onConfirm: () => void;
}) => {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Review Price Updates"
      size="lg"
      actions={[
        { id: 'cancel', label: 'Cancel', variant: 'outline', onClick: onClose, closeOnClick: true },
        {
          id: 'confirm',
          label: `Confirm & Update ${selectedItems.length} Price${selectedItems.length !== 1 ? 's' : ''}`,
          variant: 'primary',
          onClick: onConfirm,
          disabled: selectedItems.length === 0,
          closeOnClick: true,
        },
      ]}
    >
      <Stack gap="md">
        <Inline gap="sm" align="center" wrap="nowrap">
          <RefreshCw size={16} />
          <Title order={5} m={0}>
            Review selected updates
          </Title>
        </Inline>

        <Text size="sm" c="dimmed">
          You are about to update <Text span fw={700}>{selectedItems.length}</Text> product price
          {selectedItems.length !== 1 ? 's' : ''}.
        </Text>

        <Card>
          <Stack gap="xs">
            {selectedItems.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center">
                No items selected
              </Text>
            ) : (
              selectedItems.map((item) => (
                <Card key={item.id}>
                  <Inline justify="space-between" align="flex-start" wrap="nowrap">
                    <div style={{ flex: 1 }}>
                      <Text fw={700} size="sm">
                        {item.productName}
                      </Text>
                      <Inline gap="xs" align="center">
                        <DistributorBadge distributor={item.distributor} />
                        <Text size="xs" c="dimmed">
                          • {item.productId}
                        </Text>
                      </Inline>
                      <Inline gap="xs" align="center">
                        <Text size="sm" c="dimmed" td="line-through">
                          {formatCurrency(item.currentPrice)}
                        </Text>
                        <Text size="sm">→</Text>
                        <Text size="sm" fw={700}>
                          {formatCurrency(item.newPrice)}
                        </Text>
                        <PriceChangeBadge percentChange={item.percentChange} />
                      </Inline>
                    </div>

                    <ActionIcon
                      aria-label="Remove"
                      onClick={() => onRemoveItem(item.id)}
                      customFill="var(--mantine-color-red-0)"
                      customBorder="1px solid var(--mantine-color-red-2)"
                      style={{ color: 'var(--mantine-color-red-7)' }}
                    >
                      <Trash2 size={16} />
                    </ActionIcon>
                  </Inline>
                </Card>
              ))
            )}
          </Stack>
        </Card>

        <Card style={{ background: 'var(--mantine-color-yellow-0)', border: '1px solid var(--mantine-color-yellow-2)' }}>
          <Inline gap="sm" align="flex-start" wrap="nowrap">
            <AlertTriangle size={18} />
            <Text size="sm">
              This action will update prices in your marketplace catalogue. Changes will be reflected immediately after processing.
            </Text>
          </Inline>
        </Card>
      </Stack>
    </Modal>
  );
};

export const DistiPriceSyncPanel = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'synced'>('available');
  const [distributorFilter, setDistributorFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [pendingReviewItems, setPendingReviewItems] = useState<PriceUpdate[]>([]);
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>(initialPriceUpdates);
  const [syncedPrices, setSyncedPrices] = useState<PriceUpdate[]>(initialSyncedPrices);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredAvailable = useMemo(() => {
    return priceUpdates.filter((item) => {
      if (item.status !== 'AVAILABLE') return false;
      if (distributorFilter && item.distributor !== distributorFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return item.productName.toLowerCase().includes(query) || item.productId.toLowerCase().includes(query);
      }
      return true;
    });
  }, [priceUpdates, distributorFilter, searchQuery]);

  const filteredSynced = useMemo(() => {
    return syncedPrices.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (distributorFilter && item.distributor !== distributorFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return item.productName.toLowerCase().includes(query) || item.productId.toLowerCase().includes(query);
      }
      return true;
    });
  }, [syncedPrices, distributorFilter, statusFilter, searchQuery]);

  const currentData = activeTab === 'available' ? filteredAvailable : filteredSynced;
  const totalPages = Math.ceil(currentData.length / rowsPerPage);
  const paginatedData = currentData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAvailable.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAvailable.map((item) => item.id)));
    }
  };

  const handleOpenReview = () => {
    const items = priceUpdates.filter((item) => selectedIds.has(item.id));
    setPendingReviewItems(items);
    setReviewModalOpen(true);
  };

  const handleRemoveFromReview = (id: string) => {
    setPendingReviewItems((prev) => prev.filter((item) => item.id !== id));
    const newSelected = new Set(selectedIds);
    newSelected.delete(id);
    setSelectedIds(newSelected);
  };

  const handleConfirmUpdates = () => {
    const now = new Date().toISOString();
    const updatedItems = pendingReviewItems.map((item) => ({
      ...item,
      status: 'PENDING' as UpdateStatus,
      updatedAt: now,
      updatedBy: 'neil.bolton@appdirect.com',
    }));

    setSyncedPrices((prev) => [...updatedItems, ...prev]);
    setPriceUpdates((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
    setReviewModalOpen(false);
    setPendingReviewItems([]);

    setTimeout(() => {
      setSyncedPrices((prev) =>
        prev.map((item) => {
          if (item.status === 'PENDING' && updatedItems.some((u) => u.id === item.id)) {
            return { ...item, status: 'SUCCESS' as UpdateStatus };
          }
          return item;
        })
      );
    }, 3000);
  };

  const handleTabChange = (tab: 'available' | 'synced') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedIds(new Set());
    setSearchQuery('');
    setDistributorFilter('');
    setStatusFilter('');
  };

  const availableCount = priceUpdates.filter((p) => p.status === 'AVAILABLE').length;

  const tableColumns: DataTableColumn<PriceUpdate>[] = useMemo(() => {
    const cols: DataTableColumn<PriceUpdate>[] = [];

    if (activeTab === 'available') {
      cols.push({
        accessorKey: '__select',
        header: (
          <input
            type="checkbox"
            checked={selectedIds.size === filteredAvailable.length && filteredAvailable.length > 0}
            onChange={toggleSelectAll}
            aria-label="Select all"
          />
        ),
        enableSorting: false,
        align: 'center',
        cell: (row) => (
          <input
            type="checkbox"
            checked={selectedIds.has(row.id)}
            onChange={() => toggleSelection(row.id)}
            aria-label="Select row"
          />
        ),
      });
    }

    cols.push(
      {
        accessorKey: 'productName',
        header: 'Product',
        enableSorting: true,
        cell: (row) => <Text fw={700} size="sm">{row.productName}</Text>,
      },
      {
        accessorKey: 'productId',
        header: 'Product ID',
        enableSorting: true,
        cell: (row) => (
          <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
            {row.productId}
          </Text>
        ),
      },
      {
        accessorKey: 'distributor',
        header: 'Distributor',
        enableSorting: true,
        cell: (row) => <DistributorBadge distributor={row.distributor} />,
      },
      {
        accessorKey: 'currentPrice',
        header: 'Current',
        enableSorting: true,
        align: 'right',
        cell: (row) => (
          <Text size="sm" c={activeTab === 'synced' ? 'dimmed' : undefined} style={activeTab === 'synced' ? { textDecoration: 'line-through' } : undefined}>
            {formatCurrency(row.currentPrice)}
          </Text>
        ),
      },
      {
        accessorKey: 'newPrice',
        header: 'New',
        enableSorting: true,
        align: 'right',
        cell: (row) => <Text size="sm" fw={700}>{formatCurrency(row.newPrice)}</Text>,
      },
      {
        accessorKey: 'percentChange',
        header: 'Change',
        enableSorting: true,
        cell: (row) => <PriceChangeBadge percentChange={row.percentChange} />,
      },
      {
        accessorKey: activeTab === 'available' ? 'detectedAt' : 'updatedAt',
        header: activeTab === 'available' ? 'Detected' : 'Updated',
        enableSorting: true,
        cell: (row) => (
          <Text size="xs" c="dimmed">
            {formatDate(activeTab === 'available' ? row.detectedAt : row.updatedAt || row.detectedAt)}
          </Text>
        ),
      }
    );

    if (activeTab === 'synced') {
      cols.push({
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        cell: (row) => (
          <Inline gap="xs" align="center" wrap="nowrap">
            <StatusBadge status={row.status} />
            {row.status === 'FAILED' && row.errorMessage && (
              <span title={row.errorMessage} style={{ color: 'var(--mantine-color-red-6)', cursor: 'help' }}>
                <AlertTriangle size={16} />
              </span>
            )}
          </Inline>
        ),
      });
    }

    return cols;
  }, [activeTab, filteredAvailable.length, selectedIds, statusFilter, distributorFilter, searchQuery]);

  return (
    <Card>
      <Inline justify="space-between" align="center" wrap="nowrap">
        <div>
          <Text fw={700} size="sm">
            Disti Price Sync
          </Text>
          <Text size="xs" c="dimmed">
            Review and sync distributor price updates
          </Text>
        </div>
        <Button variant="outline" size="sm" leftIcon={<RefreshCw size={16} />}>
          Sync Now
        </Button>
      </Inline>

      <Card style={{ paddingTop: 8 }}>
        <Tabs
          value={activeTab}
          onTabChange={(v) => handleTabChange((v as typeof activeTab) || 'available')}
          tabs={[
            {
              id: 'available',
              label: `Price Updates Available (${availableCount})`,
            },
            {
              id: 'synced',
              label: `Synced Prices (${syncedPrices.length})`,
            },
          ]}
        />
      </Card>

      <Card>
        <Inline justify="space-between" align="center" wrap="wrap">
          <Inline gap="sm" align="center" wrap="wrap">
            <Select
              value={distributorFilter || null}
              onChange={(v) => setDistributorFilter(v || '')}
              placeholder="All Distributors"
              data={[
                { value: '', label: 'All Distributors' },
                { value: 'INGRAM', label: 'Ingram Micro' },
                { value: 'TD_SYNNEX', label: 'TD Synnex' },
                { value: 'MICROSOFT', label: 'Microsoft Marketplace' },
                { value: 'ARROW', label: 'Arrow Electronics' },
              ]}
              selectProps={{ leftSection: <Filter size={14} /> }}
            />
            {activeTab === 'synced' && (
              <Select
                value={statusFilter || null}
                onChange={(v) => setStatusFilter(v || '')}
                placeholder="All Statuses"
                data={[
                  { value: '', label: 'All Statuses' },
                  { value: 'SUCCESS', label: '✅ Success' },
                  { value: 'PENDING', label: '⏳ Pending' },
                  { value: 'FAILED', label: '❌ Failed' },
                ]}
              />
            )}
          </Inline>
          <TextInput
            placeholder="Search product name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftIcon={<Search size={16} />}
            style={{ width: 320 }}
          />
        </Inline>
      </Card>

      <Card style={{ background: 'var(--mantine-color-gray-0)', border: '1px solid var(--mantine-color-gray-2)' }}>
        <Inline justify="space-between" align="center" wrap="nowrap">
          <Text size="sm" c="dimmed">
            {currentData.length} results
          </Text>
        {activeTab === 'available' && selectedIds.size > 0 && (
          <Inline gap="sm" align="center" wrap="nowrap">
            <Text size="sm" fw={700}>
              {selectedIds.size} selected
            </Text>
            <Button onClick={handleOpenReview} size="sm" leftIcon={<Check size={16} />}>
              Update Selected Prices
            </Button>
          </Inline>
        )}
        </Inline>
      </Card>

      <DataTable
        data={paginatedData}
        columns={tableColumns}
        showSearch={false}
        emptyMessage={
          searchQuery || distributorFilter || statusFilter
            ? 'No results match your filters'
            : activeTab === 'available'
            ? 'No price updates available'
            : 'No synced prices yet'
        }
        minWidth={980}
      />

      {totalPages > 1 && (
        <Inline justify="flex-end" align="center" gap="md" mt="sm">
          <Text size="sm" c="dimmed">
            {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, currentData.length)} of {currentData.length}
          </Text>
          <Inline gap="xs" align="center" wrap="nowrap">
            <ActionIcon
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={18} />
            </ActionIcon>
            <TextInput
              value={String(currentPage)}
              onChange={(e) => setCurrentPage(Number(e.currentTarget.value) || 1)}
              style={{ width: 72 }}
              styles={{ input: { textAlign: 'center' } }}
            />
            <ActionIcon
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={18} />
            </ActionIcon>
          </Inline>
        </Inline>
      )}

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        selectedItems={pendingReviewItems}
        onRemoveItem={handleRemoveFromReview}
        onConfirm={handleConfirmUpdates}
      />
    </Card>
  );
};
