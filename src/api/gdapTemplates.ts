/**
 * Shared GDAP Templates and Role Definitions
 * 
 * This module contains the role templates used across the application:
 * - GDAP Management page
 * - Customer Onboarding page
 */

// Azure AD Role Definition IDs
// See: https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/permissions-reference
export const GDAP_ROLE_IDS = {
  // Directory
  'Directory readers': '88d8e3e3-8f55-4a1e-953a-9b9898b8876b',
  'Directory writers': '9360feb5-f418-4baa-8175-e2a00bac4301',
  'Global reader': 'f2ef992c-3afb-46b9-b7cf-a126ee74c451',
  
  // User management
  'User administrator': 'fe930be7-5e62-47db-91af-98c3a49a38b1',
  'Helpdesk administrator': '729827e3-9c14-49f7-bb1b-9608f156bbb8',
  'License administrator': '4d6ac14f-3453-41d0-bef9-a3e0c569773a',
  'Service support administrator': 'f023fd81-a637-4b56-95fd-791ac0226033',
  
  // Application
  'Application administrator': '9b895d92-2cd3-44c7-9d02-a6ac2d5ea5c3',
  'Cloud application administrator': '158c047a-c907-4556-b7ef-446551a6b5f7',
  
  // Privileged
  'Privileged role administrator': 'e8611ab8-c189-46e8-94e1-60213ab1f814',
  'Privileged authentication administrator': '7be44c8a-adaf-4e2a-84d6-ab2649e08a13',
  
  // Teams
  'Teams administrator': '69091246-20e8-4a56-aa4d-066075b2a7a8',
  'Teams communications administrator': 'baf37b3a-610e-45da-9e62-d9d1e5e8914b',
  
  // Security
  'Security reader': '5d6b6bb7-de71-4623-b4af-96380a352509',
  'Security administrator': '194ae4cb-b126-40b2-bd5b-6091b380977d',
  
  // Exchange
  'Exchange administrator': '29232cdf-9323-42fd-ade2-1d097af3e4de',
  
  // SharePoint
  'SharePoint administrator': 'f28a1f50-f6e7-4571-818b-6a12f2af6b6c',
  
  // Intune
  'Intune administrator': '3a2c62db-5318-420d-8d74-23affee5d9d5',
} as const;

export type RoleName = keyof typeof GDAP_ROLE_IDS;

// All available role options (for MultiSelect)
export const ROLE_OPTIONS: RoleName[] = [
  'Directory readers',
  'Directory writers',
  'Global reader',
  'User administrator',
  'Helpdesk administrator',
  'License administrator',
  'Service support administrator',
  'Application administrator',
  'Cloud application administrator',
  'Privileged role administrator',
  'Privileged authentication administrator',
  'Teams administrator',
  'Teams communications administrator',
  'Security reader',
  'Security administrator',
  'Exchange administrator',
  'SharePoint administrator',
  'Intune administrator',
];

// Template category options
export const TEMPLATE_CATEGORIES = ['Teams', 'Support', 'User Management', 'Baseline Read', 'Security'] as const;

export type GdapTemplate = {
  id: string;
  name: string;
  description?: string;
  recommendedFor?: string[];
  roles: RoleName[];
};

/**
 * Default GDAP role templates.
 * These are used in both GDAP Management and Customer Onboarding.
 * 
 * Note: "Default GDAP" (DAP) is only available for customers WITHOUT an existing tenant,
 * so it's not included here. Use AppDirect Marketplace as the standard default.
 */
export const GDAP_TEMPLATES: GdapTemplate[] = [
  {
    id: 't-appdirect-marketplace',
    name: 'AppDirect Marketplace',
    description: 'Standard template for marketplace operations: cloud apps, licensing, users, and directory read.',
    recommendedFor: ['User Management', 'Support'],
    roles: ['Cloud application administrator', 'License administrator', 'User administrator', 'Directory readers'],
  },
  {
    id: 't-teams',
    name: 'Teams Administration',
    description: 'Microsoft Teams admin tasks + baseline support.',
    recommendedFor: ['Teams'],
    roles: ['Teams administrator', 'Teams communications administrator', 'Helpdesk administrator', 'Directory readers'],
  },
  {
    id: 't-user-management',
    name: 'User Management',
    description: 'Create/manage users and assign licenses.',
    recommendedFor: ['User Management'],
    roles: ['User administrator', 'License administrator', 'Directory readers'],
  },
  {
    id: 't-helpdesk',
    name: 'Helpdesk Only',
    description: 'Minimal access for password resets and basic user support.',
    recommendedFor: ['Support'],
    roles: ['Helpdesk administrator', 'Directory readers'],
  },
  {
    id: 't-security',
    name: 'Security Operations',
    description: 'Security monitoring and administration access.',
    recommendedFor: ['Security'],
    roles: ['Security administrator', 'Security reader', 'Global reader', 'Directory readers'],
  },
  {
    id: 't-exchange',
    name: 'Exchange Administration',
    description: 'Exchange Online administration and mail flow management.',
    recommendedFor: ['Support'],
    roles: ['Exchange administrator', 'Helpdesk administrator', 'Directory readers'],
  },
  {
    id: 't-intune',
    name: 'Intune Device Management',
    description: 'Microsoft Intune device and endpoint management.',
    recommendedFor: ['Support'],
    roles: ['Intune administrator', 'Directory readers'],
  },
];

/**
 * Convert role display names to Azure AD role definition IDs.
 * Used when creating GDAP relationship requests via the Graph API.
 */
export function roleNamesToIds(roleNames: RoleName[]): string[] {
  return roleNames
    .map((name) => GDAP_ROLE_IDS[name])
    .filter((id): id is string => !!id);
}

/**
 * Get a template by ID.
 */
export function getTemplateById(id: string): GdapTemplate | undefined {
  return GDAP_TEMPLATES.find((t) => t.id === id);
}

/**
 * Get role IDs for a template.
 */
export function getTemplateRoleIds(templateId: string): string[] {
  const template = getTemplateById(templateId);
  if (!template) return [];
  return roleNamesToIds(template.roles);
}
