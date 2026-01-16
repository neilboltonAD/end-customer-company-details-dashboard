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

const distributorInfo: Record<Distributor, { name: string; color: string; bg: string }> = {
  INGRAM: { name: 'Ingram Micro', color: 'text-blue-700', bg: 'bg-blue-100' },
  TD_SYNNEX: { name: 'TD Synnex', color: 'text-purple-700', bg: 'bg-purple-100' },
  MICROSOFT: { name: 'Microsoft Marketplace', color: 'text-cyan-700', bg: 'bg-cyan-100' },
  ARROW: { name: 'Arrow Electronics', color: 'text-orange-700', bg: 'bg-orange-100' },
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
    SUCCESS: { icon: Check, label: 'Success', bg: 'bg-green-100', text: 'text-green-700' },
    PENDING: { icon: Clock, label: 'Pending', bg: 'bg-orange-100', text: 'text-orange-700' },
    FAILED: { icon: X, label: 'Failed', bg: 'bg-red-100', text: 'text-red-700' },
    AVAILABLE: { icon: Clock, label: 'Available', bg: 'bg-blue-100', text: 'text-blue-700' },
  };

  const { icon: Icon, label, bg, text } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

const DistributorBadge = ({ distributor }: { distributor: Distributor }) => {
  const info = distributorInfo[distributor];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${info.bg} ${info.color}`}>
      {info.name}
    </span>
  );
};

const PriceChangeBadge = ({ percentChange }: { percentChange: number }) => {
  const isIncrease = percentChange > 0;
  const isDecrease = percentChange < 0;
  const Icon = isIncrease ? ArrowUp : ArrowDown;

  return (
    <span
      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-medium ${
        isIncrease ? 'bg-red-100 text-red-700' : isDecrease ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
      }`}
    >
      {percentChange !== 0 && <Icon className="h-3 w-3" />}
      {percentChange > 0 ? '+' : ''}
      {percentChange}%
    </span>
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Review Price Updates</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-auto">
          <p className="text-sm text-gray-600 mb-4">
            You are about to update <strong>{selectedItems.length}</strong> product price{selectedItems.length !== 1 ? 's' : ''}:
          </p>

          <div className="border rounded-lg divide-y max-h-64 overflow-auto">
            {selectedItems.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No items selected</p>
            ) : (
              selectedItems.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.productName}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <DistributorBadge distributor={item.distributor} />
                      <span className="text-xs text-gray-500">• {item.productId}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <span className="text-gray-500 line-through">{formatCurrency(item.currentPrice)}</span>
                      <span>→</span>
                      <span className="font-medium">{formatCurrency(item.newPrice)}</span>
                      <PriceChangeBadge percentChange={item.percentChange} />
                    </div>
                  </div>
                  <button onClick={() => onRemoveItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              This action will update prices in your marketplace catalogue. Changes will be reflected immediately after processing.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={selectedItems.length === 0}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Confirm & Update {selectedItems.length} Price{selectedItems.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div>
          <h4 className="text-sm font-semibold text-gray-800">Disti Price Sync</h4>
          <p className="text-xs text-gray-500">Review and sync distributor price updates</p>
        </div>
        <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Sync Now
        </button>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => handleTabChange('available')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'available' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Price Updates Available
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">{availableCount}</span>
          </button>
          <button
            onClick={() => handleTabChange('synced')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'synced' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Synced Prices
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">{syncedPrices.length}</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={distributorFilter}
              onChange={(e) => setDistributorFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Distributors</option>
              <option value="INGRAM">Ingram Micro</option>
              <option value="TD_SYNNEX">TD Synnex</option>
              <option value="MICROSOFT">Microsoft Marketplace</option>
              <option value="ARROW">Arrow Electronics</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          {activeTab === 'synced' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">✅ Success</option>
              <option value="PENDING">⏳ Pending</option>
              <option value="FAILED">❌ Failed</option>
            </select>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search product name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-72 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm text-gray-600">{currentData.length} results</span>
        {activeTab === 'available' && selectedIds.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <button
              onClick={handleOpenReview}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Update Selected Prices
            </button>
          </div>
        )}
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {activeTab === 'available' && (
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredAvailable.length && filteredAvailable.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Distributor</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">New</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {activeTab === 'available' ? 'Detected' : 'Updated'}
            </th>
            {activeTab === 'synced' && (
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={activeTab === 'available' ? 8 : 9} className="py-12 text-center text-gray-500">
                {searchQuery || distributorFilter || statusFilter
                  ? 'No results match your filters'
                  : activeTab === 'available'
                    ? 'No price updates available'
                    : 'No synced prices yet'}
              </td>
            </tr>
          ) : (
            paginatedData.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                {activeTab === 'available' && (
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelection(item.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                <td className="py-3 px-4">
                  <span className="text-sm font-medium text-gray-900">{item.productName}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-gray-500 font-mono">{item.productId}</span>
                </td>
                <td className="py-3 px-4">
                  <DistributorBadge distributor={item.distributor} />
                </td>
                <td className="py-3 px-4">
                  <span className={`text-sm ${activeTab === 'synced' ? 'text-gray-400 line-through' : 'text-gray-500'}`}>
                    {formatCurrency(item.currentPrice)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-medium">{formatCurrency(item.newPrice)}</span>
                </td>
                <td className="py-3 px-4">
                  <PriceChangeBadge percentChange={item.percentChange} />
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-gray-500">
                    {formatDate(activeTab === 'available' ? item.detectedAt : item.updatedAt || item.detectedAt)}
                  </span>
                </td>
                {activeTab === 'synced' && (
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      {item.status === 'FAILED' && item.errorMessage && (
                        <span title={item.errorMessage} className="text-red-500 cursor-help">
                          <AlertTriangle className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-end space-x-4">
          <span className="text-sm text-gray-600">
            {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, currentData.length)} of {currentData.length}
          </span>
          <div className="flex items-center space-x-1">
            <button
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <input
              type="text"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
              className="w-8 text-center py-1 text-sm border border-gray-300 rounded"
            />
            <button
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        selectedItems={pendingReviewItems}
        onRemoveItem={handleRemoveFromReview}
        onConfirm={handleConfirmUpdates}
      />
    </div>
  );
};
