export const TRANSFER_STATUS_COLORS = {
  Pending: 'yellow',
  InProgress: 'blue',
  Completed: 'green',
  Failed: 'red',
  Rejected: 'gray',
  Cancelled: 'gray',
  Expired: 'orange',
} as const;

export const TRANSFER_EXPIRY_DAYS = 30;

export const REJECTION_REASONS = [
  { value: 'no_relationship', label: 'Customer relationship not established' },
  { value: 'duplicate', label: 'Duplicate transfer request' },
  { value: 'incorrect_subscriptions', label: 'Incorrect subscriptions included' },
  { value: 'business_decision', label: 'Business decision' },
  { value: 'other', label: 'Other' },
] as const;

export const PERMISSIONS = {
  VIEW_TRANSFERS: 'company.subscriptions.read',
  MANAGE_TRANSFERS: 'company.subscriptions.write',
  VIEW_MICROSOFT: 'vendor.microsoft.read',
  MANAGE_MICROSOFT: 'vendor.microsoft.write',
} as const;


