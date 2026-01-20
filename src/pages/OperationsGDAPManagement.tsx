import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Info, Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Group,
  Modal,
  MultiSelect,
  Select,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { Toggle } from '../components/form/Toggle';
import { getPartnerCenterConnectGdapUrl, getPartnerCenterCustomers, getPartnerCenterGdapRelationships } from '../api/partnerCenter';

type Company = {
  id: string;
  tenantId: string;
  name: string;
  defaultDomain: string;
  contactName?: string;
  contactEmail?: string;
};

type RelationshipStatus = 'Active' | 'Pending' | 'Expired';

type GdapRelationship = {
  id: string;
  companyId: string;
  displayName: string;
  description: string;
  validFrom: string; // YYYY-MM-DD
  validTo: string; // YYYY-MM-DD
  autoRenew: boolean;
  status: RelationshipStatus;
  roles: string[];
};

type GdapTemplate = {
  id: string;
  name: string;
  description?: string;
  recommendedFor?: string[];
  roles: string[];
};

const EXPIRING_SOON_DAYS = 30;

const OperationsSidebar = ({ activeItem }: { activeItem: string }) => {
  const navigate = useNavigate();

  const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-1">
      <div className="bg-gray-100 border-y border-gray-200 px-4 py-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );

  const SidebarItem = ({
    label,
    active,
    onClick,
    className = '',
  }: {
    label: string;
    active?: boolean;
    onClick?: () => void;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm transition-colors ${className} ${
        active ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <aside className="w-56 bg-white min-h-[calc(100vh-56px)] border-r border-gray-200">
      <SidebarSection title="OPERATIONS">
        <SidebarItem label="Users" active={activeItem === 'Users'} onClick={() => navigate('/operations')} />
        <SidebarItem label="Companies" active={activeItem === 'Companies'} onClick={() => navigate('/operations/companies')} />
        <SidebarItem label="Pending Companies" active={activeItem === 'Pending Companies'} />
        <SidebarItem label="Leads" active={activeItem === 'Leads'} />
        <SidebarItem label="Quotes" active={activeItem === 'Quotes'} />
      </SidebarSection>

      <SidebarSection title="BILLING">
        <SidebarItem label="Dashboard" active={activeItem === 'Dashboard'} />
        <SidebarItem label="Purchases" active={activeItem === 'Purchases'} />
        <SidebarItem label="Orders" active={activeItem === 'Orders'} />
        <SidebarItem label="Invoices" active={activeItem === 'Invoices'} />
        <SidebarItem label="Payments" active={activeItem === 'Payments'} />
        <SidebarItem label="Metered Usage" active={activeItem === 'Metered Usage'} />
      </SidebarSection>

      <SidebarSection title="EVENTS">
        <SidebarItem label="Event Logs" active={activeItem === 'Event Logs'} />
        <SidebarItem label="App Usage Logs" active={activeItem === 'App Usage Logs'} />
        <SidebarItem label="Admin Logs" active={activeItem === 'Admin Logs'} />
      </SidebarSection>

      <SidebarSection title="ADMIN TASKS">
        <SidebarItem label="Microsoft" active={activeItem === 'Microsoft'} onClick={() => navigate('/operations/microsoft')} />
        <SidebarItem
          label="Reseller: PC Insights"
          active={activeItem === 'Reseller: PC Insights'}
          className="pl-8"
          onClick={() => navigate('/operations/microsoft/reseller')}
        />
        <SidebarItem
          label="Reseller: P2P Transfers"
          active={activeItem === 'Reseller: P2P Transfers'}
          className="pl-8"
          onClick={() => navigate('/operations/microsoft/p2p')}
        />
        <SidebarItem
          label="Reseller: Customer Onboarding"
          active={activeItem === 'Reseller: Customer Onboarding'}
          className="pl-8"
          onClick={() => navigate('/operations/microsoft/onboarding')}
        />
        <SidebarItem
          label="GDAP: Management"
          active={activeItem === 'GDAP: Management'}
          className="pl-12"
          onClick={() => navigate('/operations/microsoft/onboarding/gdap')}
        />
      </SidebarSection>
    </aside>
  );
};

const roleOptions = [
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
];

const templateCategories = ['Teams', 'Support', 'User Management', 'Baseline Read', 'Security'];

function ymdFromIso(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function mapGraphStatusToRelationshipStatus(s?: string): RelationshipStatus {
  const v = String(s || '').toLowerCase();
  if (v === 'active') return 'Active';
  if (v === 'pending') return 'Pending';
  if (v === 'expired') return 'Expired';
  return 'Pending';
}

const initialTemplates: GdapTemplate[] = [
  {
    id: 't-default',
    name: 'Default GDAP',
    description:
      'Common baseline GDAP role set used for broad operational coverage (time-bound, least-privileged).',
    recommendedFor: ['Baseline Read', 'Support', 'User Management'],
    roles: [
      'Privileged authentication administrator',
      'Privileged role administrator',
      'User administrator',
      'Helpdesk administrator',
      'License administrator',
      'Application administrator',
      'Cloud application administrator',
      'Service support administrator',
      'Directory writers',
      'Directory readers',
      'Global reader',
    ],
  },
  {
    id: 't-appdirect-marketplace',
    name: 'AppDirect Marketplace',
    description:
      'AppDirect marketplace operations template: cloud apps, licensing, users, and directory read.',
    recommendedFor: ['User Management', 'Support'],
    roles: ['Cloud application administrator', 'License administrator', 'User administrator', 'Directory readers'],
  },
  {
    id: 't-1',
    name: 'Teams',
    description: 'Common Teams admin tasks + baseline support.',
    recommendedFor: ['Teams'],
    roles: ['Teams administrator', 'Helpdesk administrator', 'Directory readers'],
  },
  {
    id: 't-2',
    name: 'User Management',
    description: 'Create/manage users and assign licenses.',
    recommendedFor: ['User Management'],
    roles: ['User administrator', 'License administrator'],
  },
];

const daysUntil = (dateStr: string) => {
  const ms = new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};

export const OperationsGDAPManagement = () => {
  const navigate = useNavigate();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);

  const [relationships, setRelationships] = useState<GdapRelationship[]>([]);
  const [relationshipsLoading, setRelationshipsLoading] = useState(false);
  const [relationshipsError, setRelationshipsError] = useState<string | null>(null);
  const [expandedRelId, setExpandedRelId] = useState<string | null>(null);

  const [expiringModalOpen, setExpiringModalOpen] = useState(false);
  const [expiredModalOpen, setExpiredModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Expired'>('All');

  const [templates, setTemplates] = useState<GdapTemplate[]>(initialTemplates);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateRecommendedFor, setTemplateRecommendedFor] = useState<string[]>([]);
  const [templateRoles, setTemplateRoles] = useState<string[]>([]);

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [newRequestName, setNewRequestName] = useState('');
  const [newRequestTemplateId, setNewRequestTemplateId] = useState<string | null>(null);
  const [newRequestRoles, setNewRequestRoles] = useState<string[]>([]);
  const [newRequestAutoRenew, setNewRequestAutoRenew] = useState(true);
  const [newRequestRecipientName, setNewRequestRecipientName] = useState('');
  const [newRequestRecipientEmail, setNewRequestRecipientEmail] = useState('');
  const [newRequestRequestUrl, setNewRequestRequestUrl] = useState('');
  const [newRequestEmailSubject, setNewRequestEmailSubject] = useState('');
  const [newRequestEmailBody, setNewRequestEmailBody] = useState('');

  const buildEmailTemplate = (opts: {
    companyName: string;
    recipientName?: string;
    relationshipName: string;
    requestUrl?: string;
  }) => {
    const greeting = opts.recipientName?.trim() ? `Hi ${opts.recipientName.trim()},` : 'Hi,';
    const urlLine = opts.requestUrl?.trim()
      ? `GDAP request link: ${opts.requestUrl.trim()}`
      : 'GDAP request link: <paste link here>';

    const subject = `Action required: Approve GDAP relationship request for ${opts.companyName}`;

    const body = [
      greeting,
      '',
      `We’re requesting a GDAP (Granular Delegated Admin Privileges) relationship to support your Microsoft tenant: ${opts.companyName}.`,
      '',
      `Relationship name: ${opts.relationshipName}`,
      urlLine,
      '',
      'Please open the link above and approve the request.',
      '',
      'If you have any questions, reply to this email and we’ll help.',
      '',
      'Thanks,',
      '<Your name>',
      '<Your company>',
    ].join('\n');

    return { subject, body };
  };

  const selectedCompany = useMemo(
    () => companies.find((c) => c.id === selectedCompanyId) || null,
    [companies, selectedCompanyId]
  );

  const companyRelationships = useMemo(() => {
    if (!selectedCompanyId) return [];
    return relationships.filter((r) => r.companyId === selectedCompanyId);
  }, [relationships, selectedCompanyId]);

  const expiringSoon = useMemo(() => {
    const threshold = EXPIRING_SOON_DAYS;
    return relationships
      .map((r) => ({ r, days: daysUntil(r.validTo) }))
      .filter(({ r, days }) => r.status !== 'Expired' && days >= 0 && days <= threshold)
      .sort((a, b) => a.days - b.days);
  }, [relationships]);

  const expired = useMemo(() => {
    return relationships
      .map((r) => ({ r, days: daysUntil(r.validTo) }))
      .filter(({ r, days }) => r.status === 'Expired' || days < 0)
      .sort((a, b) => a.days - b.days);
  }, [relationships]);

  const openCreateTemplate = () => {
    setEditingTemplateId(null);
    setTemplateName('');
    setTemplateDescription('');
    setTemplateRecommendedFor([]);
    setTemplateRoles([]);
    setTemplateModalOpen(true);
  };

  const openEditTemplate = (t: GdapTemplate) => {
    setEditingTemplateId(t.id);
    setTemplateName(t.name);
    setTemplateDescription(t.description || '');
    setTemplateRecommendedFor(t.recommendedFor || []);
    setTemplateRoles(t.roles);
    setTemplateModalOpen(true);
  };

  const saveTemplate = () => {
    const name = templateName.trim();
    if (!name) return;

    if (editingTemplateId) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplateId
            ? {
                ...t,
                name,
                description: templateDescription.trim() || undefined,
                recommendedFor: templateRecommendedFor.length ? templateRecommendedFor : undefined,
                roles: templateRoles,
              }
            : t
        )
      );
      notifications.show({ title: 'Template saved', message: `Updated template "${name}".`, color: 'blue' });
    } else {
      const id = `t-${Math.random().toString(16).slice(2)}`;
      setTemplates((prev) => [
        {
          id,
          name,
          description: templateDescription.trim() || undefined,
          recommendedFor: templateRecommendedFor.length ? templateRecommendedFor : undefined,
          roles: templateRoles,
        },
        ...prev,
      ]);
      notifications.show({ title: 'Template created', message: `Created template "${name}".`, color: 'blue' });
    }
    setTemplateModalOpen(false);
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    notifications.show({ title: 'Template deleted', message: 'Template removed.', color: 'gray' });
  };

  const handleSync = () => {
    // Refresh companies and (if selected) relationships.
    void (async () => {
      try {
        setCompaniesLoading(true);
        setCompaniesError(null);
        const c = await getPartnerCenterCustomers(200);
        if (!c.ok) throw new Error(c.error || 'Failed to load customers.');
        const mapped: Company[] = (c.customers || [])
          .map((x) => ({
            id: String(x.id || x.tenantId || ''),
            tenantId: String(x.tenantId || x.id || ''),
            name: String(x.companyName || x.defaultDomain || x.id || 'Unknown'),
            defaultDomain: String(x.defaultDomain || ''),
            contactName: x.contactName || undefined,
            contactEmail: x.contactEmail || undefined,
          }))
          .filter((x) => x.id && x.tenantId);
        setCompanies(mapped);

        if (selectedCompanyId) {
          const sel = mapped.find((m) => m.id === selectedCompanyId);
          if (sel) {
            setRelationshipsLoading(true);
            setRelationshipsError(null);
            const r = await getPartnerCenterGdapRelationships(sel.tenantId);
            if (!r.ok) throw new Error(r.error || 'Failed to load GDAP relationships.');
            const mappedRels: GdapRelationship[] = (r.relationships || []).map((gr) => ({
              id: String(gr.id || ''),
              companyId: sel.id,
              displayName: String(gr.displayName || gr.id || 'GDAP Relationship'),
              description: '',
              validFrom: ymdFromIso(gr.createdDateTime) || '',
              validTo: ymdFromIso(gr.endDateTime) || '',
              autoRenew: Boolean(gr.autoExtendDuration && String(gr.autoExtendDuration).toUpperCase() !== 'P0D'),
              status: mapGraphStatusToRelationshipStatus(gr.status),
              roles: Array.isArray(gr.roles) ? gr.roles.filter(Boolean) : [],
            }));
            setRelationships(mappedRels);
          }
        }

        notifications.show({ title: 'Synced', message: 'Partner Center + GDAP data refreshed.', color: 'green' });
      } catch (e: any) {
        notifications.show({ title: 'Sync failed', message: e?.message || 'Failed to sync.', color: 'red' });
      } finally {
        setCompaniesLoading(false);
        setRelationshipsLoading(false);
      }
    })();
  };

  useEffect(() => {
    // Initial load of companies
    void (async () => {
      try {
        setCompaniesLoading(true);
        setCompaniesError(null);
        const c = await getPartnerCenterCustomers(200);
        if (!c.ok) throw new Error(c.error || 'Failed to load customers.');
        const mapped: Company[] = (c.customers || [])
          .map((x) => ({
            id: String(x.id || x.tenantId || ''),
            tenantId: String(x.tenantId || x.id || ''),
            name: String(x.companyName || x.defaultDomain || x.id || 'Unknown'),
            defaultDomain: String(x.defaultDomain || ''),
            contactName: x.contactName || undefined,
            contactEmail: x.contactEmail || undefined,
          }))
          .filter((x) => x.id && x.tenantId);
        setCompanies(mapped);
      } catch (e: any) {
        setCompaniesError(e?.message || 'Failed to load companies.');
      } finally {
        setCompaniesLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    // Load relationships when company changes
    void (async () => {
      if (!selectedCompany) {
        setRelationships([]);
        setRelationshipsError(null);
        return;
      }
      try {
        setRelationshipsLoading(true);
        setRelationshipsError(null);
        const r = await getPartnerCenterGdapRelationships(selectedCompany.tenantId);
        if (!r.ok) throw new Error(r.error || 'Failed to load GDAP relationships.');
        const mappedRels: GdapRelationship[] = (r.relationships || []).map((gr) => ({
          id: String(gr.id || ''),
          companyId: selectedCompany.id,
          displayName: String(gr.displayName || gr.id || 'GDAP Relationship'),
          description: '',
          validFrom: ymdFromIso(gr.createdDateTime) || '',
          validTo: ymdFromIso(gr.endDateTime) || '',
          autoRenew: Boolean(gr.autoExtendDuration && String(gr.autoExtendDuration).toUpperCase() !== 'P0D'),
          status: mapGraphStatusToRelationshipStatus(gr.status),
          roles: Array.isArray(gr.roles) ? gr.roles.filter(Boolean) : [],
        }));
        setRelationships(mappedRels);
      } catch (e: any) {
        setRelationships([]);
        setRelationshipsError(e?.message || 'Failed to load GDAP relationships.');
      } finally {
        setRelationshipsLoading(false);
      }
    })();
  }, [selectedCompanyId, selectedCompany?.tenantId]);

  const openRename = (relId: string) => {
    const rel = relationships.find((r) => r.id === relId);
    if (!rel) return;
    setRenameTargetId(relId);
    setRenameValue(rel.displayName);
    setRenameModalOpen(true);
  };

  const submitRename = () => {
    const newName = renameValue.trim();
    if (!renameTargetId || !newName) return;
    setRelationships((prev) => prev.map((r) => (r.id === renameTargetId ? { ...r, displayName: newName } : r)));
    notifications.show({ title: 'Renamed', message: `Renamed to "${newName}".`, color: 'blue' });
    setRenameModalOpen(false);
    setRenameTargetId(null);
  };

  const handleAutoRenewToggle = (relId: string, enabled: boolean) => {
    setRelationships((prev) => prev.map((r) => (r.id === relId ? { ...r, autoRenew: enabled } : r)));
  };

  const openNewRequest = () => {
    if (!selectedCompany) return;
    setNewRequestName(`New GDAP for ${selectedCompany.name}`);
    setNewRequestTemplateId(templates[0]?.id ?? null);
    setNewRequestRoles(templates[0]?.roles ?? []);
    setNewRequestAutoRenew(true);
    setNewRequestRecipientName(selectedCompany.contactName || '');
    setNewRequestRecipientEmail(selectedCompany.contactEmail || '');
    setNewRequestRequestUrl('');
    const t = buildEmailTemplate({
      companyName: selectedCompany.name,
      recipientName: selectedCompany.contactName,
      relationshipName: `New GDAP for ${selectedCompany.name}`,
      requestUrl: '',
    });
    setNewRequestEmailSubject(t.subject);
    setNewRequestEmailBody(t.body);
    setNewRequestOpen(true);
  };

  const openNewRequestForRelationship = (rel: GdapRelationship, mode: 'renew' | 'new') => {
    setSelectedCompanyId(rel.companyId);
    const company = companies.find((c) => c.id === rel.companyId);
    const prefix = mode === 'renew' ? 'Renew' : 'New';
    const relName = `${prefix}: ${rel.displayName}${company ? ` (${company.name})` : ''}`;
    setNewRequestName(relName);
    setNewRequestTemplateId(null);
    setNewRequestRoles(rel.roles);
    setNewRequestAutoRenew(true);
    setNewRequestRecipientName(company?.contactName || '');
    setNewRequestRecipientEmail(company?.contactEmail || '');
    setNewRequestRequestUrl('');
    const t = buildEmailTemplate({
      companyName: company?.name || 'Selected company',
      recipientName: company?.contactName,
      relationshipName: relName,
      requestUrl: '',
    });
    setNewRequestEmailSubject(t.subject);
    setNewRequestEmailBody(t.body);
    setNewRequestOpen(true);
  };

  const onSelectNewRequestTemplate = (templateId: string | null) => {
    setNewRequestTemplateId(templateId);
    const t = templates.find((x) => x.id === templateId);
    setNewRequestRoles(t?.roles ?? []);
  };

  const submitNewRequest = () => {
    if (!selectedCompany) return;
    const name = newRequestName.trim();
    if (!name || newRequestRoles.length === 0) return;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const validFrom = `${yyyy}-${mm}-${dd}`;
    const validTo = `${yyyy + 1}-${mm}-${dd}`;

    const newRel: GdapRelationship = {
      id: `gdap-${Math.random().toString(16).slice(2)}`,
      companyId: selectedCompany.id,
      displayName: name,
      description: 'GDAP relationship request created (demo).',
      validFrom,
      validTo,
      autoRenew: newRequestAutoRenew,
      status: 'Pending',
      roles: newRequestRoles,
    };

    setRelationships((prev) => [newRel, ...prev]);
    notifications.show({
      title: 'Request created',
      message: `GDAP request created for ${selectedCompany.name}.`,
      color: 'blue',
    });
    setNewRequestOpen(false);
    setExpandedRelId(newRel.id);
  };

  const filteredCompanyRelationships = useMemo(() => {
    const base = companyRelationships;
    if (statusFilter === 'All') return base;
    return base.filter((r) => r.status === statusFilter);
  }, [companyRelationships, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="flex">
        <OperationsSidebar activeItem="GDAP: Management" />

        <main className="flex-1 p-6">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <button onClick={() => navigate('/operations/microsoft/onboarding')} className="hover:text-teal-600">
              Reseller: Customer Onboarding
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900">GDAP: Management</span>
          </div>

          <div className="bg-white rounded shadow p-4 mb-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">GDAP: Management</h1>
                <p className="text-sm text-gray-500">Marketplace-wide GDAP relationship review and management</p>
              </div>
              <Group gap="xs">
                <Button size="sm" variant="light" leftSection={<Plus size={16} />} onClick={openNewRequest} disabled={!selectedCompany}>
                  New
                </Button>
                <Button size="sm" variant="light" leftSection={<RefreshCw size={16} />} onClick={handleSync}>
                  Sync
                </Button>
                <Tooltip label="Role guidance">
                  <ActionIcon variant="light" onClick={() => window.open('https://learn.microsoft.com/en-us/partner-center/customers/gdap-least-privileged-roles-by-task', '_blank')}>
                    <Info size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </div>
          </div>

          {/* Overview (keep expiring/expired at top under header) */}
          <div className="bg-white rounded shadow p-4 mb-4">
            <Text fw={600} size="sm" mb={6}>
              Overview
            </Text>
            <Text size="xs" c="dimmed" mb="sm">
              Select a company to view relationships and create new GDAP requests.
            </Text>
            <Select
              searchable
              clearable
              label="Company"
              placeholder={companiesLoading ? 'Loading companies…' : 'Select a company'}
              data={companies.map((c) => ({ value: c.id, label: `${c.name} (${c.defaultDomain})` }))}
              value={selectedCompanyId}
              onChange={setSelectedCompanyId}
              nothingFoundMessage={companiesError || 'No companies found'}
            />

            {selectedCompany && (
              <div className="mt-3 text-sm text-gray-700">
                <span className="font-semibold">Selected Company:</span> {selectedCompany.name}{' '}
                <span className="text-gray-400">({selectedCompany.defaultDomain})</span>
              </div>
            )}
            {companiesError && (
              <div className="mt-3 text-sm text-red-600">
                {companiesError}
              </div>
            )}
          </div>

          {/* Expiring / expired */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <button
              className="bg-white rounded shadow p-4 text-left hover:shadow-md transition-shadow"
              onClick={() => setExpiringModalOpen(true)}
            >
              <Text fw={700} size="sm">
                Expiring soon
              </Text>
              <Text size="xs" c="dimmed">
                Relationships expiring within {EXPIRING_SOON_DAYS} days
              </Text>
              <Text fw={800} size="xl" mt={6}>
                {expiringSoon.length}
              </Text>
            </button>
            <button
              className="bg-white rounded shadow p-4 text-left hover:shadow-md transition-shadow"
              onClick={() => setExpiredModalOpen(true)}
            >
              <Text fw={700} size="sm">
                Expired
              </Text>
              <Text size="xs" c="dimmed">
                Relationships requiring renewal / new request
              </Text>
              <Text fw={800} size="xl" mt={6}>
                {expired.length}
              </Text>
            </button>
          </div>

          {/* Templates */}
          <div className="bg-white rounded shadow p-4 mb-4">
            <Group justify="space-between" mb="sm">
              <Text fw={600} size="sm">
                GDAP request templates
              </Text>
              <Button size="xs" leftSection={<Plus size={14} />} onClick={openCreateTemplate}>
                New template
              </Button>
            </Group>

            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Recommended for</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Roles</Table.Th>
                  <Table.Th style={{ width: 120 }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {templates.map((t) => (
                  <Table.Tr key={t.id}>
                    <Table.Td>{t.name}</Table.Td>
                    <Table.Td>
                      {t.recommendedFor && t.recommendedFor.length > 0 ? (
                        <Group gap={6}>
                          {t.recommendedFor.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="light" color="teal">
                              {tag}
                            </Badge>
                          ))}
                        </Group>
                      ) : (
                        <Text size="xs" c="dimmed">
                          —
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {t.description || '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {t.roles.join(', ')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Edit">
                          <ActionIcon variant="light" onClick={() => openEditTemplate(t)}>
                            <Pencil size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete">
                          <ActionIcon variant="light" color="red" onClick={() => deleteTemplate(t.id)}>
                            <Trash2 size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>

          {/* Relationships */}
          <div className={`bg-white rounded shadow p-4 ${!selectedCompany ? 'opacity-60' : ''}`}>
            <Group justify="space-between" mb="sm">
              <div>
                <Text fw={600} size="sm">
                  GDAP Relationships
                </Text>
                <Text size="xs" c="dimmed">
                  {selectedCompany ? `Managing relationships for ${selectedCompany.name}` : 'Select a company to manage relationships'}
                </Text>
              </div>
              <Group gap="xs" align="center">
                <Badge variant="light" color={selectedCompany ? 'teal' : 'gray'}>
                  {selectedCompany ? 'Company selected' : 'No company selected'}
                </Badge>
                {selectedCompany && (
                  <Group gap="xs">
                    {(['All', 'Active', 'Pending', 'Expired'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          statusFilter === s
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </Group>
                )}
              </Group>
            </Group>

            {selectedCompany && relationshipsLoading && (
              <div className="border border-dashed border-gray-300 rounded p-5 text-center text-sm text-gray-600">
                Loading GDAP relationships…
              </div>
            )}
            {selectedCompany && !relationshipsLoading && relationshipsError && (
              <div className="border border-red-200 bg-red-50 rounded p-5 text-sm text-red-700 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">Unable to load GDAP relationships</div>
                  <div className="text-sm">{relationshipsError}</div>
                </div>
                <Button
                  variant="light"
                  onClick={() => {
                    window.location.href = getPartnerCenterConnectGdapUrl(window.location.href);
                  }}
                >
                  Connect GDAP
                </Button>
              </div>
            )}
            {selectedCompany && !relationshipsLoading && !relationshipsError && filteredCompanyRelationships.length === 0 && (
              <div className="border border-dashed border-gray-300 rounded p-5 text-center text-sm text-gray-600">
                No GDAP relationships found for this company.
              </div>
            )}

            {selectedCompany &&
              filteredCompanyRelationships.map((rel) => {
                const isExpanded = expandedRelId === rel.id;
                const validLabel = `${rel.validFrom} – ${rel.validTo}`;
                const badgeColor = rel.status === 'Active' ? 'green' : rel.status === 'Pending' ? 'yellow' : 'red';

                return (
                  <div key={rel.id} className="border border-gray-200 rounded-lg bg-gray-50 mb-2">
                    <div className="flex items-center justify-between px-3 py-2">
                      <button
                        className="flex-1 text-left flex items-center gap-2"
                        onClick={() => setExpandedRelId(isExpanded ? null : rel.id)}
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">{rel.displayName}</div>
                          <div className="text-xs text-gray-500 truncate">{rel.id}</div>
                        </div>
                        <Badge color={badgeColor} variant="light" className="ml-2">
                          {rel.status.toUpperCase()}
                        </Badge>
                      </button>
                      <Group gap="xs">
                        <Tooltip label="Rename">
                          <ActionIcon variant="light" onClick={() => openRename(rel.id)}>
                            <Pencil size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <ActionIcon variant="subtle" onClick={() => setExpandedRelId(isExpanded ? null : rel.id)}>
                          {isExpanded ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </ActionIcon>
                      </Group>
                    </div>

                    {isExpanded && (
                      <div className="px-3 pb-3">
                        <div className="text-xs text-gray-600">{rel.description}</div>
                        <div className="text-xs text-gray-500 mt-1">Valid: {validLabel}</div>
                        <div className="flex items-center justify-end py-2">
                          <span className="text-xs text-gray-700 mr-2">Auto-renew</span>
                          <Toggle enabled={rel.autoRenew} onChange={(val) => handleAutoRenewToggle(rel.id, val)} size="sm" />
                        </div>
                        <ul className="text-xs text-gray-700 space-y-0.5">
                          {rel.roles.map((role) => (
                            <li key={role} className="flex items-center">
                              <span className="mr-1.5 text-green-400">✔</span> {role}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Modals */}
          <Modal opened={templateModalOpen} onClose={() => setTemplateModalOpen(false)} title={editingTemplateId ? 'Edit template' : 'New template'} centered>
            <Stack gap="md">
              <TextInput label="Template name" placeholder="Teams" value={templateName} onChange={(e) => setTemplateName(e.currentTarget.value)} />
              <TextInput
                label="Description"
                placeholder="Short description of what this template is for"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.currentTarget.value)}
              />
              <MultiSelect
                label="Recommended for"
                placeholder="Select categories"
                data={templateCategories}
                value={templateRecommendedFor}
                onChange={setTemplateRecommendedFor}
              />
              <MultiSelect
                label="Roles"
                placeholder="Select roles"
                data={roleOptions}
                value={templateRoles}
                onChange={setTemplateRoles}
                searchable
                nothingFoundMessage="No roles found"
              />
              <Group justify="flex-end">
                <Button variant="default" onClick={() => setTemplateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveTemplate} disabled={!templateName.trim()}>
                  Save
                </Button>
              </Group>
            </Stack>
          </Modal>

          <Modal opened={renameModalOpen} onClose={() => setRenameModalOpen(false)} title="Rename GDAP relationship" centered>
            <Stack gap="md">
              <TextInput
                label="Relationship name"
                value={renameValue}
                onChange={(e) => setRenameValue(e.currentTarget.value)}
                placeholder="Enter a new name"
              />
              <Group justify="flex-end">
                <Button variant="default" onClick={() => setRenameModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitRename} disabled={!renameValue.trim()}>
                  Save
                </Button>
              </Group>
            </Stack>
          </Modal>

          <Modal opened={newRequestOpen} onClose={() => setNewRequestOpen(false)} title="New GDAP relationship request" size="lg" centered>
            <Stack gap="md">
              <Text size="sm" c="dimmed">
                Create a GDAP relationship request for the selected company. Choose a template to pre-fill roles, then review before submitting.
              </Text>

              <TextInput
                label="Relationship name"
                value={newRequestName}
                onChange={(e) => setNewRequestName(e.currentTarget.value)}
                placeholder="e.g., Teams Operations"
              />

              <Select
                label="Template"
                placeholder="Select a template"
                data={templates.map((t) => ({ value: t.id, label: t.name }))}
                value={newRequestTemplateId}
                onChange={onSelectNewRequestTemplate}
                clearable
              />

              <MultiSelect
                label="Roles"
                placeholder="Select roles"
                data={roleOptions}
                value={newRequestRoles}
                onChange={setNewRequestRoles}
                searchable
                nothingFoundMessage="No roles found"
              />

              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={600}>
                    Auto-renew
                  </Text>
                  <Text size="xs" c="dimmed">
                    Automatically renew this relationship before expiry.
                  </Text>
                </div>
                <Toggle enabled={newRequestAutoRenew} onChange={setNewRequestAutoRenew} size="md" />
              </Group>

              <Text fw={600} size="sm">
                Customer email
              </Text>
              <Text size="xs" c="dimmed">
                Select a company first. If we can’t detect a contact name/email, enter it manually, then copy the template to send to the customer.
              </Text>

              <Group grow>
                <TextInput
                  label="Recipient name"
                  placeholder="e.g., Jane Doe"
                  value={newRequestRecipientName}
                  onChange={(e) => setNewRequestRecipientName(e.currentTarget.value)}
                />
                <TextInput
                  label="Recipient email"
                  placeholder="e.g., jane@contoso.com"
                  value={newRequestRecipientEmail}
                  onChange={(e) => setNewRequestRecipientEmail(e.currentTarget.value)}
                />
              </Group>

              <TextInput
                label="GDAP request link (optional)"
                placeholder="Paste the approval link here once generated"
                value={newRequestRequestUrl}
                onChange={(e) => setNewRequestRequestUrl(e.currentTarget.value)}
              />

              <Group justify="space-between" align="flex-end">
                <div style={{ flex: 1 }}>
                  <TextInput
                    label="Email subject"
                    value={newRequestEmailSubject}
                    onChange={(e) => setNewRequestEmailSubject(e.currentTarget.value)}
                  />
                </div>
                <Button
                  variant="light"
                  onClick={() => {
                    if (!selectedCompany) return;
                    const t = buildEmailTemplate({
                      companyName: selectedCompany.name,
                      recipientName: newRequestRecipientName,
                      relationshipName: newRequestName.trim() || `New GDAP for ${selectedCompany.name}`,
                      requestUrl: newRequestRequestUrl,
                    });
                    setNewRequestEmailSubject(t.subject);
                    setNewRequestEmailBody(t.body);
                    notifications.show({ title: 'Template regenerated', message: 'Email subject/body updated.', color: 'gray' });
                  }}
                >
                  Regenerate
                </Button>
                <CopyButton value={`Subject: ${newRequestEmailSubject}\n\n${newRequestEmailBody}`}>
                  {({ copied, copy }) => (
                    <Button
                      onClick={() => {
                        copy();
                        notifications.show({ title: copied ? 'Copied' : 'Copied', message: 'Email copied to clipboard.', color: 'green' });
                      }}
                    >
                      {copied ? 'Copied' : 'Copy email'}
                    </Button>
                  )}
                </CopyButton>
              </Group>

              <Textarea
                label="Email body"
                autosize
                minRows={8}
                value={newRequestEmailBody}
                onChange={(e) => setNewRequestEmailBody(e.currentTarget.value)}
              />

              <Group justify="flex-end">
                <Button variant="default" onClick={() => setNewRequestOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitNewRequest} disabled={!newRequestName.trim() || newRequestRoles.length === 0}>
                  Submit request
                </Button>
              </Group>
            </Stack>
          </Modal>

          <Modal opened={expiringModalOpen} onClose={() => setExpiringModalOpen(false)} title="Expiring soon" size="lg" centered>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Company</Table.Th>
                  <Table.Th>Relationship</Table.Th>
                  <Table.Th>Expires</Table.Th>
                  <Table.Th>Days</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {expiringSoon.map(({ r, days }) => {
                  const c = companies.find((x) => x.id === r.companyId);
                  return (
                    <Table.Tr key={`${r.companyId}-${r.id}`}>
                      <Table.Td>{c?.name || r.companyId}</Table.Td>
                      <Table.Td>{r.displayName}</Table.Td>
                      <Table.Td>{r.validTo}</Table.Td>
                      <Table.Td>
                        <Badge color="yellow" variant="light">
                          {days}d
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Button
                            size="xs"
                            variant="light"
                            onClick={() => {
                              setSelectedCompanyId(r.companyId);
                              setExpandedRelId(r.id);
                              setExpiringModalOpen(false);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => {
                              setExpiringModalOpen(false);
                              openNewRequestForRelationship(r, 'renew');
                            }}
                          >
                            Renew
                          </Button>
                          <Button
                            size="xs"
                            variant="light"
                            onClick={() => {
                              setExpiringModalOpen(false);
                              openNewRequestForRelationship(r, 'new');
                            }}
                          >
                            New request
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Modal>

          <Modal opened={expiredModalOpen} onClose={() => setExpiredModalOpen(false)} title="Expired" size="lg" centered>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Company</Table.Th>
                  <Table.Th>Relationship</Table.Th>
                  <Table.Th>Expired</Table.Th>
                  <Table.Th>Days</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {expired.map(({ r, days }) => {
                  const c = companies.find((x) => x.id === r.companyId);
                  return (
                    <Table.Tr key={`${r.companyId}-${r.id}`}>
                      <Table.Td>{c?.name || r.companyId}</Table.Td>
                      <Table.Td>{r.displayName}</Table.Td>
                      <Table.Td>{r.validTo}</Table.Td>
                      <Table.Td>
                        <Badge color="red" variant="light">
                          {days}d
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Button
                            size="xs"
                            variant="light"
                            onClick={() => {
                              setSelectedCompanyId(r.companyId);
                              setExpandedRelId(r.id);
                              setExpiredModalOpen(false);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="xs"
                            color="red"
                            onClick={() => {
                              setExpiredModalOpen(false);
                              openNewRequestForRelationship(r, 'renew');
                            }}
                          >
                            Renew
                          </Button>
                          <Button
                            size="xs"
                            variant="light"
                            onClick={() => {
                              setExpiredModalOpen(false);
                              openNewRequestForRelationship(r, 'new');
                            }}
                          >
                            New request
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Modal>
        </main>
      </div>

      <button className="fixed bottom-6 right-6 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700">
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

