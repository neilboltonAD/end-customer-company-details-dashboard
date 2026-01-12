// P2P Transfer Types and Interfaces

export type TransferStatus = 
  | 'Pending'      // Waiting for partner action
  | 'InProgress'   // Being processed by Microsoft
  | 'Completed'    // Successfully transferred
  | 'Failed'       // Transfer failed
  | 'Rejected'     // Partner rejected the transfer
  | 'Cancelled'    // Initiator cancelled the transfer
  | 'Expired';     // 30-day window passed

export type TransferDirection = 'Incoming' | 'Outgoing';

export type BillingCycle = 'Monthly' | 'Annual' | 'Triennial';

export type TermDuration = 'P1M' | 'P1Y' | 'P3Y';

export interface PartnerInfo {
  tenantId: string;
  name: string;
  mpnId?: string;
}

export interface TransferLineItem {
  id: string;
  subscriptionId: string;
  offerId: string;
  productName: string;
  sku: string;
  quantity: number;
  billingCycle: BillingCycle;
  termDuration: TermDuration;
  monthlyValue: number;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Failed';
  transferEligible: boolean;
  eligibilityReason?: string;
}

export interface TransferRequest {
  id: string;
  status: TransferStatus;
  direction: TransferDirection;
  sourcePartner: PartnerInfo;
  targetPartner: PartnerInfo;
  customerTenantId: string;
  customerName: string;
  lineItems: TransferLineItem[];
  totalMonthlyValue: number;
  createdDate: string;
  lastModifiedDate: string;
  expirationDate: string;
  completedDate?: string;
  rejectionReason?: string;
  cancellationReason?: string;
}

export interface TransferAuditLogEntry {
  id: string;
  transferId: string;
  timestamp: string;
  action: string;
  user: string;
  details?: string;
}

export interface EligibleSubscription {
  id: string;
  subscriptionId: string;
  productName: string;
  sku: string;
  quantity: number;
  billingCycle: BillingCycle;
  termDuration: TermDuration;
  monthlyValue: number;
  renewalDate: string;
  transferEligible: boolean;
  eligibilityReason?: string;
}

export interface TransferSummary {
  incomingPending: number;
  outgoingPending: number;
  completedLast90Days: number;
  failedLast90Days: number;
}

// Status badge color mapping
export const statusColors: Record<TransferStatus, { bg: string; text: string; border: string }> = {
  Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  InProgress: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  Completed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  Failed: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  Rejected: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  Cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  Expired: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
};

// Status icons
export const statusIcons: Record<TransferStatus, string> = {
  Pending: '🟡',
  InProgress: '🔵',
  Completed: '🟢',
  Failed: '🔴',
  Rejected: '⚫',
  Cancelled: '⚫',
  Expired: '🟠',
};

