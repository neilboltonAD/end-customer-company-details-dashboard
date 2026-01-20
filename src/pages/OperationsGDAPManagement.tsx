import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Info, Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import {
  ActionIcon,
  Badge,
  Button,
  Collapse,
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
import { Toggle } from '../components/form/Toggle';
import { getPartnerCenterConnectGdapUrl, getPartnerCenterCustomers, getPartnerCenterGdapRelationships } from '../api/partnerCenter';
import { OperationsLayout } from '../components/layout/OperationsLayout';
import { Card } from 'components/DesignSystem';

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
  const [templatesExpanded, setTemplatesExpanded] = useState(true);
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
    <OperationsLayout>
      <main>
        <Group gap="xs" mb="sm">
          <Button variant="subtle" color="blue" onClick={() => navigate('/operations/microsoft/onboarding')} px={0}>
            Reseller: Customer Onboarding
          </Button>
          <Text size="sm" c="dimmed">/</Text>
          <Text size="sm">GDAP: Management</Text>
        </Group>

          <Card>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text fw={700} size="lg">
                  GDAP: Management
                </Text>
                <Text size="sm" c="dimmed">
                  Marketplace-wide GDAP relationship review and management
                </Text>
              </Stack>
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
            </Group>
          </Card>

          {/* Overview (keep expiring/expired at top under header) */}
          <Card>
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
              <Text mt="sm" size="sm">
                <Text span fw={700}>
                  Selected Company:
                </Text>{' '}
                {selectedCompany.name}{' '}
                <Text span size="sm" c="dimmed">
                  ({selectedCompany.defaultDomain})
                </Text>
              </Text>
            )}
            {companiesError && (
              <Text mt="sm" size="sm" style={{ color: 'var(--mantine-color-red-7)' }}>
                {companiesError}
              </Text>
            )}
          </Card>

          {/* Expiring / expired */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
              marginBottom: 16,
            }}
          >
            <Card interactive onClick={() => setExpiringModalOpen(true)}>
              <Text fw={700} size="sm">
                Expiring soon
              </Text>
              <Text size="xs" c="dimmed">
                Relationships expiring within {EXPIRING_SOON_DAYS} days
              </Text>
              <Text fw={800} size="xl" mt={6}>
                {expiringSoon.length}
              </Text>
            </Card>
            <Card interactive onClick={() => setExpiredModalOpen(true)}>
              <Text fw={700} size="sm">
                Expired
              </Text>
              <Text size="xs" c="dimmed">
                Relationships requiring renewal / new request
              </Text>
              <Text fw={800} size="xl" mt={6}>
                {expired.length}
              </Text>
            </Card>
          </div>

          {/* Relationships */}
          <Card style={!selectedCompany ? { opacity: 0.6 } : undefined}>
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
                      <Button
                        key={s}
                        size="xs"
                        variant={statusFilter === s ? 'filled' : 'outline'}
                        color={statusFilter === s ? 'teal' : 'gray'}
                        onClick={() => setStatusFilter(s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </Group>
                )}
              </Group>
            </Group>

            {selectedCompany && relationshipsLoading && (
              <Card style={{ border: '1px dashed var(--mantine-color-gray-3)', background: 'var(--mantine-color-gray-0)' }}>
                <Text size="sm" c="dimmed" ta="center">
                  Loading GDAP relationships…
                </Text>
              </Card>
            )}
            {selectedCompany && !relationshipsLoading && relationshipsError && (
              <Card style={{ border: '1px solid var(--mantine-color-red-2)', background: 'var(--mantine-color-red-0)' }}>
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <div style={{ minWidth: 0 }}>
                    <Text fw={800} size="sm" style={{ color: 'var(--mantine-color-red-8)' }}>
                      Unable to load GDAP relationships
                    </Text>
                    <Text size="sm" style={{ color: 'var(--mantine-color-red-8)' }}>
                      {relationshipsError}
                    </Text>
                  </div>
                <Button
                  variant="light"
                  onClick={() => {
                    window.location.href = getPartnerCenterConnectGdapUrl(window.location.href);
                  }}
                >
                  Connect GDAP
                </Button>
                </Group>
              </Card>
            )}
            {selectedCompany && !relationshipsLoading && !relationshipsError && filteredCompanyRelationships.length === 0 && (
              <Card style={{ border: '1px dashed var(--mantine-color-gray-3)', background: 'var(--mantine-color-gray-0)' }}>
                <Text size="sm" c="dimmed" ta="center">
                  No GDAP relationships found for this company.
                </Text>
              </Card>
            )}

            {selectedCompany &&
              filteredCompanyRelationships.map((rel) => {
                const isExpanded = expandedRelId === rel.id;
                const validLabel = `${rel.validFrom} – ${rel.validTo}`;
                const badgeColor = rel.status === 'Active' ? 'green' : rel.status === 'Pending' ? 'yellow' : 'red';

                return (
                  <Card key={rel.id} style={{ background: 'var(--mantine-color-gray-0)' }}>
                    <Group justify="space-between" px="sm" py="xs">
                      <button
                        style={{ flex: 1, textAlign: 'left', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                        onClick={() => setExpandedRelId(isExpanded ? null : rel.id)}
                      >
                        <div style={{ minWidth: 0 }}>
                          <Text fw={700} size="sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {rel.displayName}
                          </Text>
                          <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {rel.id}
                          </Text>
                        </div>
                        <Badge color={badgeColor} variant="light" ml="sm">
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
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </ActionIcon>
                      </Group>
                    </Group>

                    {isExpanded && (
                      <div style={{ padding: '0 12px 12px' }}>
                        <Text size="xs" c="dimmed">
                          {rel.description}
                        </Text>
                        <Text size="xs" c="dimmed" mt={4}>
                          Valid: {validLabel}
                        </Text>
                        <Group justify="flex-end" py="xs">
                          <Text size="xs" c="dimmed">
                            Auto-renew
                          </Text>
                          <Toggle enabled={rel.autoRenew} onChange={(val) => handleAutoRenewToggle(rel.id, val)} size="sm" />
                        </Group>
                        <ul style={{ fontSize: 12, color: 'var(--mantine-color-gray-7)', margin: 0, paddingLeft: 18 }}>
                          {rel.roles.map((role) => (
                            <li key={role} style={{ marginBottom: 2 }}>
                              <span style={{ marginRight: 6, color: 'var(--mantine-color-green-6)' }}>✔</span> {role}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                );
              })}
          </Card>

          {/* Templates (collapsible) */}
          <Card>
            <Group justify="space-between" mb="sm" align="center">
              <Group gap="xs" align="center">
                <ActionIcon
                  variant="subtle"
                  onClick={() => setTemplatesExpanded((v) => !v)}
                  aria-label={templatesExpanded ? 'Collapse templates' : 'Expand templates'}
                >
                  {templatesExpanded ? (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </ActionIcon>
                <Text fw={600} size="sm">
                  GDAP request templates
                </Text>
              </Group>
              <Button size="xs" leftSection={<Plus size={14} />} onClick={openCreateTemplate}>
                New template
              </Button>
            </Group>

            <Collapse in={templatesExpanded}>
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
            </Collapse>
          </Card>

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

      <div style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <ActionIcon size="lg" radius="xl" variant="filled" color="blue" aria-label="Help">
          <HelpCircle size={18} />
        </ActionIcon>
      </div>
    </OperationsLayout>
  );
};

