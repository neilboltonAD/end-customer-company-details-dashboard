// Extension context types - data received from AppDirect host

export interface ExtensionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

export interface ExtensionCompany {
  id: string;
  name: string;
  externalId?: string;
  microsoftTenantId?: string;
  mpnId?: string;
}

export interface ExtensionMarketplace {
  id: string;
  name: string;
  baseUrl: string;
  apiUrl: string;
}

export interface ExtensionSettings {
  enableNotifications: boolean;
  transferExpiryDays: number;
}

export interface ExtensionContext {
  user: ExtensionUser | null;
  company: ExtensionCompany | null;
  marketplace: ExtensionMarketplace | null;
  settings: ExtensionSettings;
  loading: boolean;
  error: Error | null;
  sessionToken: string | null;
}

// P2P Transfer types

export type TransferDirection = 'Incoming' | 'Outgoing';

export type TransferStatus = 
  | 'Pending' 
  | 'InProgress' 
  | 'Completed' 
  | 'Failed' 
  | 'Rejected' 
  | 'Cancelled' 
  | 'Expired';

export type BillingCycle = 'Monthly' | 'Annual' | 'Triennial';

export interface Partner {
  id: string;
  name: string;
  tenantId: string;
  mpnId?: string;
}

export interface TransferLineItem {
  id: string;
  subscriptionId: string;
  offerId: string;
  productName: string;
  skuName: string;
  quantity: number;
  billingCycle: BillingCycle;
  termDuration: string;
  monthlyValue: number;
  status: 'Pending' | 'Transferred' | 'Failed';
}

export interface TransferRequest {
  id: string;
  direction: TransferDirection;
  status: TransferStatus;
  sourcePartner: Partner;
  targetPartner: Partner;
  customerTenantId: string;
  customerName: string;
  lineItems: TransferLineItem[];
  totalMonthlyValue: number;
  createdDate: string;
  lastModifiedDate: string;
  expirationDate: string;
  completedDate?: string;
  rejectionReason?: string;
}

export interface Subscription {
  id: string;
  microsoftSubscriptionId: string;
  offerId: string;
  productName: string;
  skuName: string;
  quantity: number;
  billingCycle: BillingCycle;
  termDuration: string;
  monthlyValue: number;
  status: string;
  isTransferable: boolean;
  ineligibilityReason?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userName: string;
  details: string;
}

export interface TransferSummary {
  incomingPending: number;
  outgoingPending: number;
  completedLast90Days: number;
  failedLast90Days: number;
}

// API input types

export interface CreateTransferInput {
  targetPartnerTenantId: string;
  targetPartnerMpnId?: string;
  subscriptionIds: string[];
}

export interface RejectTransferInput {
  reason: string;
}


