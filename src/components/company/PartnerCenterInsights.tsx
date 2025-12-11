import React, { useState } from 'react';
import { ExpandableSection } from '../layout/ExpandableSection';
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Package, Activity, Calendar, X, Edit2, RotateCcw } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  subtitle?: string;
  status?: 'good' | 'warning' | 'poor' | 'neutral';
}

// Compact horizontal metric card
const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, trendLabel, icon, subtitle, status = 'neutral' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'poor': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-3 h-3 text-red-600" />;
    return <Minus className="w-3 h-3 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return '';
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={`border rounded-lg p-3 ${getStatusColor()}`}>
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-600">{title}</div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">{value}</span>
            {trend !== undefined && (
              <div className="flex items-center space-x-0.5">
                {getTrendIcon()}
                <span className={`text-xs font-medium ${getTrendColor()}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              </div>
            )}
          </div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

interface SubscriptionData {
  id: string;
  productName: string;
  displayName: string;
  sku: string;
  seats: number;
  assignedSeats: number;
  activeUsers: number;
  revenue: number;
  status: 'active' | 'suspended' | 'expired';
  renewalDate?: string;
  termType: string;
}

// Revert Confirmation Modal
const RevertConfirmModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentName: string;
  originalName: string;
}> = ({ open, onClose, onConfirm, currentName, originalName }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Revert Subscription Name?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to revert the subscription nickname back to the original name?
        </p>
        <div className="bg-gray-50 rounded p-3 mb-4 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Current:</span>
            <span className="font-medium text-gray-800">{currentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Original:</span>
            <span className="font-medium text-gray-800">{originalName}</span>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm rounded bg-orange-500 text-white hover:bg-orange-600"
          >
            Revert
          </button>
        </div>
      </div>
    </div>
  );
};

// Compact subscription row
const SubscriptionRow: React.FC<{
  subscription: SubscriptionData;
  onRename: (id: string, newName: string) => void;
}> = ({ subscription, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subscription.displayName);
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);
  
  const deploymentPercentage = (subscription.assignedSeats / subscription.seats) * 100;
  const usagePercentage = subscription.assignedSeats > 0 ? (subscription.activeUsers / subscription.assignedSeats) * 100 : 0;
  
  // Check if name has been customized from the default SKU
  const isCustomName = subscription.displayName !== subscription.sku;

  const handleRevertConfirm = () => {
    onRename(subscription.id, subscription.sku);
    setShowRevertConfirm(false);
  };

  const getStatusBadge = () => {
    switch (subscription.status) {
      case 'active':
        return <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-1.5 py-0.5">Active</span>;
      case 'suspended':
        return <span className="text-xs font-bold uppercase text-yellow-700 bg-yellow-100 rounded px-1.5 py-0.5">Suspended</span>;
      case 'expired':
        return <span className="text-xs font-bold uppercase text-red-700 bg-red-100 rounded px-1.5 py-0.5">Expired</span>;
    }
  };

  const handleSaveName = () => {
    onRename(subscription.id, editName);
    setIsEditing(false);
  };

  const ChangeButton = ({ onClick }: { onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="px-1.5 py-0.5 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
    >
      Change
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        {/* Left side - Product info */}
        <div className="flex-1 min-w-0 pr-4">
          {/* Product name and editable subscription name */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-800 text-sm">{subscription.productName}</h4>
              {getStatusBadge()}
            </div>
            
            {/* Editable Subscription Name/Nickname */}
            <div className="flex items-center">
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-xs text-gray-700 border border-blue-300 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="text-xs text-blue-600 hover:underline">Save</button>
                  <button onClick={() => { setIsEditing(false); setEditName(subscription.displayName); }} className="text-xs text-gray-500 hover:underline">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center space-x-1 bg-gray-100 rounded px-2 py-0.5">
                  <span className="text-xs text-gray-500">{isCustomName ? 'Subscription Nickname:' : 'Subscription Name:'}</span>
                  <span className="text-xs text-gray-700 font-medium">{subscription.displayName}</span>
                  <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600 ml-1">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  {isCustomName && (
                    <button 
                      onClick={() => setShowRevertConfirm(true)} 
                      className="text-gray-400 hover:text-orange-600 ml-0.5"
                      title="Revert to original name"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Revert Confirmation Modal */}
            <RevertConfirmModal
              open={showRevertConfirm}
              onClose={() => setShowRevertConfirm(false)}
              onConfirm={handleRevertConfirm}
              currentName={subscription.displayName}
              originalName={subscription.sku}
            />
          </div>
          
          {/* Renewal with Change button */}
          {subscription.renewalDate && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span>Renewal: {subscription.renewalDate}</span>
              <ChangeButton />
            </div>
          )}
          
          {/* Revenue */}
          <div className="mt-2">
            <span className="text-sm font-bold text-gray-900">${subscription.revenue.toLocaleString()}</span>
            <span className="text-xs text-gray-500 ml-1">/mo</span>
          </div>
        </div>

        {/* Right side - Metrics as compact list with progress bars */}
        <div className="w-64 space-y-1.5 border-l border-gray-200 pl-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Total Seats</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-semibold text-gray-900">{subscription.seats}</span>
              <ChangeButton />
            </div>
          </div>
          
          {/* Assigned with progress bar */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-14">Assigned</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  deploymentPercentage >= 90 ? 'bg-green-500' : 
                  deploymentPercentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${deploymentPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600 w-20 text-right">{subscription.assignedSeats} ({deploymentPercentage.toFixed(0)}%)</span>
          </div>
          
          {/* Active Users with progress bar */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-14">Active</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  usagePercentage >= 80 ? 'bg-green-500' : 
                  usagePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600 w-20 text-right">{subscription.activeUsers} ({usagePercentage.toFixed(0)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Grouped Subscriptions Modal - Groups by Offer/Edition
const AllSubscriptionsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  subscriptions: SubscriptionData[];
}> = ({ open, onClose, subscriptions }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  if (!open) return null;

  // Group subscriptions by productName (Offer/Edition)
  const groupedSubscriptions = subscriptions.reduce((acc, sub) => {
    if (!acc[sub.productName]) {
      acc[sub.productName] = [];
    }
    acc[sub.productName].push(sub);
    return acc;
  }, {} as Record<string, SubscriptionData[]>);

  const getTermTypeColor = (termType: string) => {
    if (termType.includes('Triannual')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (termType.includes('Annual') && termType.includes('Up Front')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (termType.includes('Annual') && termType.includes('Monthly')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (termType.includes('Monthly')) return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Calculate churn risk based on usage/assignment
  const getChurnRisk = (sub: SubscriptionData) => {
    const assignmentRate = (sub.assignedSeats / sub.seats) * 100;
    const usageRate = sub.assignedSeats > 0 ? (sub.activeUsers / sub.assignedSeats) * 100 : 0;
    
    if (assignmentRate < 50 || usageRate < 40) return 'high';
    if (assignmentRate < 70 || usageRate < 60) return 'medium';
    return 'low';
  };

  const getChurnRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">⚠ High Churn Risk</span>;
      case 'medium':
        return <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-200">⚡ Monitor</span>;
      default:
        return null;
    }
  };

  const toggleGroup = (productName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productName)) {
        newSet.delete(productName);
      } else {
        newSet.add(productName);
      }
      return newSet;
    });
  };

  // Calculate group totals
  const getGroupTotals = (subs: SubscriptionData[]) => ({
    totalSeats: subs.reduce((sum, s) => sum + s.seats, 0),
    totalAssigned: subs.reduce((sum, s) => sum + s.assignedSeats, 0),
    totalActive: subs.reduce((sum, s) => sum + s.activeUsers, 0),
    totalRevenue: subs.reduce((sum, s) => sum + s.revenue, 0),
    subscriptionCount: subs.length,
    hasChurnRisk: subs.some(s => getChurnRisk(s) !== 'low')
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Microsoft Subscription Summary</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-3 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="space-y-2">
            {Object.entries(groupedSubscriptions).map(([productName, subs]) => {
              const isExpanded = expandedGroups.has(productName);
              const totals = getGroupTotals(subs);
              const assignmentRate = ((totals.totalAssigned / totals.totalSeats) * 100).toFixed(0);
              
              return (
                <div key={productName} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(productName)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-800">{productName}</span>
                      <span className="text-xs text-gray-500">({subs.length} subscription{subs.length > 1 ? 's' : ''})</span>
                      {totals.hasChurnRisk && (
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-red-50 text-red-600">⚠ Attention needed</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{totals.totalSeats} seats • {assignmentRate}% assigned</div>
                        <div className="text-sm font-semibold text-gray-800">${totals.totalRevenue.toLocaleString()}/mo</div>
                      </div>
                      <svg className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {/* Expanded Subscriptions */}
                  {isExpanded && (
                    <div className="border-t border-gray-200">
                      {subs.map((sub, idx) => {
                        const churnRisk = getChurnRisk(sub);
                        const assignRate = ((sub.assignedSeats / sub.seats) * 100).toFixed(0);
                        const usageRate = sub.assignedSeats > 0 ? ((sub.activeUsers / sub.assignedSeats) * 100).toFixed(0) : '0';
                        
                        return (
                          <div 
                            key={sub.id} 
                            className={`px-3 py-2 ${idx > 0 ? 'border-t border-gray-100' : ''} ${churnRisk === 'high' ? 'bg-red-50' : churnRisk === 'medium' ? 'bg-yellow-50' : 'bg-white'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${getTermTypeColor(sub.termType)}`}>
                                    {sub.termType}
                                  </span>
                                  {getChurnRiskBadge(churnRisk)}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {sub.displayName !== sub.sku && (
                                    <span className="font-medium text-gray-800">{sub.displayName} • </span>
                                  )}
                                  <span className="font-mono text-gray-400">{sub.id.substring(0, 8)}...</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-6 text-right">
                                <div>
                                  <div className="text-xs text-gray-500">Seats</div>
                                  <div className="text-sm font-semibold text-gray-800">{sub.seats}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Assigned</div>
                                  <div className={`text-sm font-semibold ${parseInt(assignRate) < 70 ? 'text-orange-600' : 'text-gray-800'}`}>
                                    {sub.assignedSeats} ({assignRate}%)
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Active</div>
                                  <div className={`text-sm font-semibold ${parseInt(usageRate) < 60 ? 'text-red-600' : 'text-gray-800'}`}>
                                    {sub.activeUsers} ({usageRate}%)
                                  </div>
                                </div>
                                <div className="w-20">
                                  <div className="text-xs text-gray-500">Revenue</div>
                                  <div className="text-sm font-semibold text-gray-800">${sub.revenue.toLocaleString()}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Summary Footer */}
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-blue-800">
                Total: {subscriptions.length} subscriptions across {Object.keys(groupedSubscriptions).length} products
              </div>
              <div className="text-sm font-bold text-blue-900">
                ${subscriptions.reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}/mo
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end p-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface OfficeUsageData {
  product: string;
  totalUsers: number;
  activeUsers: number;
  usagePercentage: number;
  services: {
    name: string;
    activeUsers: number;
    percentage: number;
  }[];
}

const OfficeUsageCard: React.FC<{ data: OfficeUsageData }> = ({ data }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800">{data.product}</h4>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{data.activeUsers}/{data.totalUsers}</div>
          <div className="text-xs text-gray-500">{data.usagePercentage.toFixed(1)}% active</div>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className={`h-3 rounded-full transition-all duration-300 ${
            data.usagePercentage >= 80 ? 'bg-green-600' : 
            data.usagePercentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
          }`}
          style={{ width: `${data.usagePercentage}%` }}
        ></div>
      </div>

      <div className="space-y-2">
        {data.services.map((service) => (
          <div key={service.name} className="flex items-center justify-between text-sm">
            <span className="text-gray-700">{service.name}</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">{service.activeUsers} users</span>
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                service.percentage >= 80 ? 'bg-green-100 text-green-700' : 
                service.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {service.percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PartnerCenterInsights: React.FC = () => {
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(true);
  const [officeUsageOpen, setOfficeUsageOpen] = useState(true);
  const [revenueOpen, setRevenueOpen] = useState(false);
  const [showAllSubscriptionsModal, setShowAllSubscriptionsModal] = useState(false);

  // Subscription data with editable display names - each subscription has ONE term type
  // displayName defaults to SKU, can be renamed to a custom "Subscription Nickname"
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      productName: 'Microsoft 365 Business Premium',
      displayName: 'O365_BUSINESS_PREMIUM',
      sku: 'O365_BUSINESS_PREMIUM',
      seats: 90,
      assignedSeats: 85,
      activeUsers: 72,
      revenue: 1800,
      status: 'active' as const,
      renewalDate: '2025-12-31',
      termType: 'Annual Up Front'
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
      productName: 'Microsoft 365 Business Premium',
      displayName: 'M365 BP - Monthly Team',
      sku: 'O365_BUSINESS_PREMIUM',
      seats: 45,
      assignedSeats: 42,
      activeUsers: 38,
      revenue: 900,
      status: 'active' as const,
      renewalDate: '2025-12-31',
      termType: 'Annual Billed Monthly'
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
      productName: 'Microsoft 365 Business Premium',
      displayName: 'M365 BP - Contractors',
      sku: 'O365_BUSINESS_PREMIUM',
      seats: 15,
      assignedSeats: 15,
      activeUsers: 12,
      revenue: 300,
      status: 'active' as const,
      renewalDate: '2025-12-31',
      termType: 'Monthly Billed Monthly'
    },
    {
      id: 'd4e5f6a7-b8c9-0123-defa-456789012345',
      productName: 'Microsoft 365 E3',
      displayName: 'SPE_E3',
      sku: 'SPE_E3',
      seats: 50,
      assignedSeats: 48,
      activeUsers: 42,
      revenue: 1800,
      status: 'active' as const,
      renewalDate: '2026-01-15',
      termType: 'Triannual Up Front'
    },
    {
      id: 'e5f6a7b8-c9d0-1234-efab-567890123456',
      productName: 'Microsoft 365 E3',
      displayName: 'M365 E3 - Sales Team',
      sku: 'SPE_E3',
      seats: 30,
      assignedSeats: 28,
      activeUsers: 25,
      revenue: 1080,
      status: 'active' as const,
      renewalDate: '2026-01-15',
      termType: 'Annual Up Front'
    },
    {
      id: 'f6a7b8c9-d0e1-2345-fabc-678901234567',
      productName: 'Microsoft 365 E3',
      displayName: 'M365 E3 - New Hires',
      sku: 'SPE_E3',
      seats: 20,
      assignedSeats: 19,
      activeUsers: 15,
      revenue: 720,
      status: 'active' as const,
      renewalDate: '2026-01-15',
      termType: 'Annual Billed Monthly'
    },
    {
      id: 'a7b8c9d0-e1f2-3456-abcd-789012345678',
      productName: 'Microsoft 365 E5',
      displayName: 'SPE_E5',
      sku: 'SPE_E5',
      seats: 40,
      assignedSeats: 38,
      activeUsers: 32,
      revenue: 2320,
      status: 'active' as const,
      renewalDate: '2025-11-30',
      termType: 'Annual Up Front'
    },
    {
      id: 'b8c9d0e1-f2a3-4567-bcde-890123456789',
      productName: 'Microsoft 365 E5',
      displayName: 'M365 E5 - Executives',
      sku: 'SPE_E5',
      seats: 10,
      assignedSeats: 7,
      activeUsers: 6,
      revenue: 580,
      status: 'active' as const,
      renewalDate: '2025-11-30',
      termType: 'Monthly Billed Monthly'
    },
    {
      id: 'c9d0e1f2-a3b4-5678-cdef-901234567890',
      productName: 'Office 365 E1',
      displayName: 'STANDARDPACK',
      sku: 'STANDARDPACK',
      seats: 25,
      assignedSeats: 18,
      activeUsers: 15,
      revenue: 200,
      status: 'active' as const,
      renewalDate: '2026-02-28',
      termType: 'Annual Billed Monthly'
    },
    {
      id: 'd0e1f2a3-b4c5-6789-defa-012345678901',
      productName: 'Office 365 E1',
      displayName: 'O365 E1 - Temps',
      sku: 'STANDARDPACK',
      seats: 25,
      assignedSeats: 12,
      activeUsers: 12,
      revenue: 200,
      status: 'active' as const,
      renewalDate: '2026-02-28',
      termType: 'Monthly Billed Monthly'
    }
  ]);

  const handleRenameSubscription = (id: string, newName: string) => {
    setSubscriptions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, displayName: newName } : sub)
    );
  };

  // Calculate overview from subscriptions
  const overview = {
    totalSeats: subscriptions.reduce((sum, s) => sum + s.seats, 0),
    assignedSeats: subscriptions.reduce((sum, s) => sum + s.assignedSeats, 0),
    activeUsers: subscriptions.reduce((sum, s) => sum + s.activeUsers, 0),
    monthlyRevenue: subscriptions.reduce((sum, s) => sum + s.revenue, 0),
    subscriptionCount: subscriptions.length,
    trends: {
      seats: 5.2,
      activeUsers: -2.3,
      revenue: 8.7
    }
  };

  const officeUsage = [
    {
      product: 'Microsoft 365 Apps',
      totalUsers: 312,
      activeUsers: 245,
      usagePercentage: 78.5,
      services: [
        { name: 'Exchange', activeUsers: 298, percentage: 95.5 },
        { name: 'SharePoint', activeUsers: 187, percentage: 59.9 },
        { name: 'OneDrive', activeUsers: 234, percentage: 75.0 },
        { name: 'Teams', activeUsers: 267, percentage: 85.6 },
        { name: 'Office Apps', activeUsers: 198, percentage: 63.5 }
      ]
    },
    {
      product: 'Power Platform',
      totalUsers: 145,
      activeUsers: 67,
      usagePercentage: 46.2,
      services: [
        { name: 'Power BI', activeUsers: 45, percentage: 31.0 },
        { name: 'Power Apps', activeUsers: 28, percentage: 19.3 },
        { name: 'Power Automate', activeUsers: 34, percentage: 23.4 }
      ]
    }
  ];

  const revenueBreakdown = {
    byProduct: [
      { name: 'Microsoft 365 E3', revenue: 3600, percentage: 28.9 },
      { name: 'Microsoft 365 Business Premium', revenue: 3000, percentage: 24.1 },
      { name: 'Microsoft 365 E5', revenue: 2900, percentage: 23.3 },
      { name: 'Azure Subscriptions', revenue: 1550, percentage: 12.4 },
      { name: 'Office 365 E1', revenue: 400, percentage: 3.2 },
      { name: 'Other Products', revenue: 1000, percentage: 8.0 }
    ],
    total: overview.monthlyRevenue,
    growth: 8.7
  };

  return (
    <ExpandableSection 
      title="Partner Center Insights" 
      open={overviewOpen}
      onToggle={setOverviewOpen}
      className="mb-3"
      helpContent="Partner Center Insights provides comprehensive analytics and metrics from Microsoft Partner Center about your customer's Microsoft 365 usage, deployment, and revenue. These insights help you understand customer engagement, optimize license allocation, and identify upsell opportunities. Data is refreshed daily and includes historical trends for performance tracking."
    >
      {/* Overview Metrics - Compact horizontal layout */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Overview</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <MetricCard
            title="Total Seats"
            value={overview.totalSeats}
            trend={overview.trends.seats}
            icon={<Users className="w-4 h-4 text-blue-600" />}
            status="good"
          />
          <MetricCard
            title="Assigned Seats"
            value={overview.assignedSeats}
            subtitle={`${((overview.assignedSeats / overview.totalSeats) * 100).toFixed(0)}% deployed`}
            icon={<Package className="w-4 h-4 text-blue-600" />}
            status="good"
          />
          <MetricCard
            title="Active Users (28d)"
            value={overview.activeUsers}
            trend={overview.trends.activeUsers}
            icon={<Activity className="w-4 h-4 text-blue-600" />}
            status="warning"
          />
          <MetricCard
            title="Monthly Revenue"
            value={`$${overview.monthlyRevenue.toLocaleString()}`}
            trend={overview.trends.revenue}
            icon={<DollarSign className="w-4 h-4 text-blue-600" />}
            status="good"
          />
        </div>
      </div>

      {/* Subscriptions Detail */}
      <ExpandableSection 
        title={
          <div className="flex items-center justify-between w-full">
            <span>Subscriptions ({subscriptions.length})</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllSubscriptionsModal(true);
              }}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Summarise all my Microsoft subscriptions
            </button>
          </div>
        }
        open={subscriptionsOpen}
        onToggle={setSubscriptionsOpen}
        className="mb-3"
      >
        <div className="space-y-2">
          {subscriptions.map((sub) => (
            <SubscriptionRow 
              key={sub.id} 
              subscription={sub}
              onRename={handleRenameSubscription}
            />
          ))}
        </div>

        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-xs font-medium text-blue-800 mb-1">💡 Utilization Insights</div>
          <ul className="text-xs text-blue-700 space-y-0.5">
            <li className="flex items-start">
              <span className="mr-1">•</span>
              <span>You have <strong>{overview.totalSeats - overview.assignedSeats} unassigned seats</strong> across all subscriptions.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-1">•</span>
              <span>Only <strong>{((overview.activeUsers / overview.assignedSeats) * 100).toFixed(1)}% of assigned users</strong> are actively using their licenses.</span>
            </li>
          </ul>
        </div>
      </ExpandableSection>

      {/* Office Usage */}
      <ExpandableSection 
        title="Office 365 Usage Analytics"
        open={officeUsageOpen}
        onToggle={setOfficeUsageOpen}
        className="mb-3"
      >
        <div className="space-y-4">
          {officeUsage.map((usage, index) => (
            <OfficeUsageCard key={index} data={usage} />
          ))}
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm font-medium text-yellow-800 mb-2">💡 Service Usage Recommendations</div>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>SharePoint usage is at 59.9%</strong> - Consider training sessions on document collaboration.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Teams has strong adoption (85.6%)</strong> - Leverage this success to promote other tools.</span>
            </li>
          </ul>
        </div>
      </ExpandableSection>

      {/* Revenue Breakdown */}
      <ExpandableSection 
        title="Revenue Analytics"
        open={revenueOpen}
        onToggle={setRevenueOpen}
        className="mb-3"
      >
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-semibold text-gray-700 text-sm">Monthly Recurring Revenue</h5>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">${revenueBreakdown.total.toLocaleString()}</div>
              <div className="flex items-center justify-end space-x-1 text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-medium">+{revenueBreakdown.growth}% MoM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {revenueBreakdown.byProduct.map((product) => (
            <div key={product.name} className="border border-gray-200 rounded-lg p-2 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{product.name}</span>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900">${product.revenue.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 ml-1">({product.percentage.toFixed(0)}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${product.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </ExpandableSection>

      {/* Data Source Information */}
      <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-gray-600">
            Data from Microsoft Partner Center Insights API. Updated daily.
            <a href="https://learn.microsoft.com/en-us/partner-center/insights/insights-programmatic-prerequisites" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-blue-600 hover:text-blue-800 ml-1">
              Learn more →
            </a>
          </div>
        </div>
      </div>

      {/* All Subscriptions Modal */}
      <AllSubscriptionsModal
        open={showAllSubscriptionsModal}
        onClose={() => setShowAllSubscriptionsModal(false)}
        subscriptions={subscriptions}
      />
    </ExpandableSection>
  );
};

export default PartnerCenterInsights;
