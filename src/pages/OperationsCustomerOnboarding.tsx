import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Mail, Copy, Send, Pencil, Check, X, Building2, UserPlus, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { ActionIcon, Badge, Button, Group, Modal, Paper, SegmentedControl, Select, SimpleGrid, Stack, Table, Text, TextInput, Tooltip, Box, Divider, ScrollArea, Alert } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { OperationsLayout } from '../components/layout/OperationsLayout';
import { Card } from 'components/DesignSystem';
import { getPartnerCenterProfile, type PartnerProfile } from '../api/partnerCenter';
import { GDAP_TEMPLATES, getTemplateById, type GdapTemplate } from '../api/gdapTemplates';

// Marketplace Companies (from Operations > Companies)
const marketplaceCompanies = [
  { id: 'mc-1', name: 'demoresellercustomer3', domain: 'demoresellercustomer3.onmicrosoft.com', email: 'admin@demoresellercustomer3.com', createdOn: '11/11/25' },
  { id: 'mc-2', name: 'demoresellercustomeropportunity', domain: 'demoresellercustomeropportunity.onmicrosoft.com', email: 'admin@demoresellercustomeropportunity.com', createdOn: '11/11/25' },
  { id: 'mc-3', name: 'demoresellercustomer2', domain: 'demoresellercustomer2.onmicrosoft.com', email: 'admin@demoresellercustomer2.com', createdOn: '11/10/25' },
  { id: 'mc-4', name: 'demoresellercustomer1', domain: 'demoresellercustomer1.onmicrosoft.com', email: 'admin@demoresellercustomer1.com', createdOn: '11/10/25' },
  { id: 'mc-5', name: 'Demo Reseller', domain: 'demoreseller.onmicrosoft.com', email: 'admin@demoreseller.com', createdOn: '11/10/25' },
  { id: 'mc-6', name: 'Demo Reseller Manager', domain: 'demoresellermanager.onmicrosoft.com', email: 'admin@demoresellermanager.com', createdOn: '11/10/25' },
  { id: 'mc-7', name: 'VodafoneDemo2', domain: 'vodafonedemo2.onmicrosoft.com', email: 'admin@vodafonedemo2.com', createdOn: '10/23/25' },
  { id: 'mc-8', name: 'VodafoneDemo1', domain: 'vodafonedemo1.onmicrosoft.com', email: 'admin@vodafonedemo1.com', createdOn: '10/23/25' },
  { id: 'mc-9', name: 'Fabrikam Inc', domain: 'fabrikam.onmicrosoft.com', email: 'admin@fabrikam.com', createdOn: '10/20/25' },
  { id: 'mc-10', name: 'Contoso Ltd', domain: 'contoso.onmicrosoft.com', email: 'john@contoso.com', createdOn: '10/15/25' },
  { id: 'mc-11', name: 'Adventure Works', domain: 'adventureworks.onmicrosoft.com', email: 'admin@adventureworks.com', createdOn: '10/10/25' },
  { id: 'mc-12', name: 'Appdirect', domain: 'appdirect.onmicrosoft.com', email: 'admin@appdirect.com', createdOn: '10/13/25' },
];

const indirectResellers = [
  { value: 'itcloud', label: 'ITCloud.ca' },
  { value: 'northwind', label: 'Northwind Reseller' },
  { value: 'contoso-cloud', label: 'Contoso Cloud Services' },
];

const approvalRows = [
  {
    id: 'approval-1',
    customer: 'IT CLOUD OFFICE 365',
    defaultDomain: 'itcloudacademie.ca',
    step: 'RRR Sent',
    status: 'Pending: Awaiting confirmation of RRR',
    statusColor: 'orange',
  },
  {
    id: 'approval-2',
    customer: 'Contoso Ltd',
    defaultDomain: 'contoso.onmicrosoft.com',
    step: 'GDAP Requested',
    status: 'Pending: Awaiting GDAP approval',
    statusColor: 'orange',
  },
  {
    id: 'approval-3',
    customer: 'Fabrikam Inc',
    defaultDomain: 'fabrikam.onmicrosoft.com',
    step: 'Relationship Approved',
    status: 'Ready to Order',
    statusColor: 'green',
  },
];

export const OperationsCustomerOnboarding = () => {
  const navigate = useNavigate();
  
  // Partner Center profile state (for real RRR/GDAP links)
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  // Form state
  const [clientType, setClientType] = useState<'new' | 'existing'>('new');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [domain, setDomain] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [reseller, setReseller] = useState<string | null>('itcloud');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>('t-appdirect-marketplace');

  // Get selected GDAP template
  const selectedTemplate = useMemo(() => {
    if (!selectedTemplateId) return null;
    return getTemplateById(selectedTemplateId) || null;
  }, [selectedTemplateId]);
  
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [resendTarget, setResendTarget] = useState<(typeof approvalRows)[number] | null>(null);

  // Fetch partner profile on mount (for real MPN ID and RRR URL)
  useEffect(() => {
    let cancelled = false;
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError(null);
        const response = await getPartnerCenterProfile();
        if (!cancelled) {
          if (response.ok && response.profile) {
            setPartnerProfile(response.profile);
          } else {
            setProfileError(response.error || 'Failed to load partner profile');
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setProfileError(err?.message || 'Failed to connect to Partner Center');
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };
    fetchProfile();
    return () => { cancelled = true; };
  }, []);

  // Get selected company data
  const selectedCompany = useMemo(() => {
    if (clientType !== 'existing' || !selectedCompanyId) return null;
    return marketplaceCompanies.find(c => c.id === selectedCompanyId) || null;
  }, [clientType, selectedCompanyId]);

  // Auto-fill when company is selected
  const handleCompanySelect = (companyId: string | null) => {
    setSelectedCompanyId(companyId);
    if (companyId) {
      const company = marketplaceCompanies.find(c => c.id === companyId);
      if (company) {
        setDomain(company.domain);
        setEmail(company.email);
        setContactName(''); // User should fill this
      }
    }
  };

  // Clear form when switching client type
  const handleClientTypeChange = (value: string) => {
    setClientType(value as 'new' | 'existing');
    if (value === 'new') {
      setSelectedCompanyId(null);
      setDomain('');
      setContactName('');
      setEmail('');
    }
  };

  // Get reseller name for display
  const resellerName = useMemo(() => {
    const r = indirectResellers.find(ir => ir.value === reseller);
    return r?.label || 'Your Reseller';
  }, [reseller]);

  // Generate email template with real Partner Center URLs
  const emailTemplate = useMemo(() => {
    const displayDomain = domain || 'customer-domain.com';
    const displayName = contactName || 'Valued Customer';
    
    // Use real RRR URL from Partner Center profile if available
    const rrrUrl = partnerProfile?.rrrUrl 
      || `https://admin.microsoft.com/Adminportal/Home#/partners/invitation/reseller?partnerId=${partnerProfile?.mpnId || 'PARTNER_ID'}&msppId=0&DAP=true`;
    
    // GDAP approval URL - customer will see pending GDAP requests here
    const gdapUrl = `https://admin.microsoft.com/AdminPortal/Home#/partners/granularadminrelationships`;

    // Show MPN ID in the email if available (for transparency)
    const mpnNote = partnerProfile?.mpnId 
      ? `<p style="font-size: 12px; color: #666;">(Partner MPN ID: ${partnerProfile.mpnId})</p>`
      : '';

    // Show GDAP template info if selected
    const gdapTemplateInfo = selectedTemplate
      ? `<p style="font-size: 12px; color: #666; margin-top: 8px;">
          <strong>GDAP Template:</strong> ${selectedTemplate.name}<br/>
          <strong>Roles requested:</strong> ${selectedTemplate.roles.join(', ')}
        </p>`
      : '';

    return `
      <p>Hello ${displayName},</p>
      <p><strong>${resellerName}</strong> is requesting to become the Microsoft 365 cloud solutions provider for <strong>${displayDomain}</strong>.</p>
      <p>To complete the onboarding process, please approve the following two requests:</p>
      <p><strong>Step 1: Approve the Reseller Relationship Request (RRR)</strong><br/>
      This establishes ${resellerName} as your Microsoft partner.<br/>
      <a href="${rrrUrl}" style="color: #228be6;">Click here to approve the Reseller Relationship →</a></p>
      <p><strong>Step 2: Approve the GDAP Request${selectedTemplate ? ` (${selectedTemplate.name})` : ''}</strong><br/>
      This grants ${resellerName} the necessary admin access to manage your Microsoft 365 services.<br/>
      <a href="${gdapUrl}" style="color: #228be6;">Click here to approve GDAP access →</a></p>
      <p>If you have any questions, simply reply to this email and our team will be happy to help.</p>
      <p>Best regards,<br/><strong>${resellerName} Team</strong></p>
      ${mpnNote}
      ${gdapTemplateInfo}
    `.trim();
  }, [domain, contactName, resellerName, partnerProfile, selectedTemplate]);

  // Email editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: emailTemplate,
    editable: isEditing,
    onUpdate: ({ editor }) => {
      // Content updates are handled by the editor
    },
  });

  // Update editor content when template changes (only if not editing)
  React.useEffect(() => {
    if (editor && !isEditing) {
      editor.commands.setContent(emailTemplate);
    }
  }, [editor, emailTemplate, isEditing]);

  // Update editor editable state
  React.useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [editor, isEditing]);

  // Copy email to clipboard
  const handleCopyEmail = async () => {
    const html = editor?.getHTML() || emailTemplate;
    try {
      await navigator.clipboard.writeText(html);
      setCopiedToClipboard(true);
      notifications.show({
        title: 'Copied!',
        message: 'Email content copied to clipboard',
        color: 'green',
        icon: <Check size={16} />,
      });
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch {
      notifications.show({
        title: 'Copy failed',
        message: 'Could not copy to clipboard',
        color: 'red',
      });
    }
  };

  // Send email (opens mailto or simulates send)
  const handleSendEmail = () => {
    if (!email) {
      notifications.show({
        title: 'Missing email',
        message: 'Please enter a recipient email address',
        color: 'orange',
      });
      return;
    }
    
    const subject = `Action required: Approve RRR + GDAP for ${domain || 'your organization'}`;
    const body = editor?.getText() || '';
    
    // Open mailto link
    const mailtoUrl = `mailto:${email}${ccEmail ? `?cc=${ccEmail}` : ''}${ccEmail ? '&' : '?'}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    
    notifications.show({
      title: 'Email client opened',
      message: `Opening email to ${email}`,
      color: 'blue',
      icon: <Send size={16} />,
    });
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    if (clientType === 'existing' && !selectedCompanyId) return false;
    if (!domain || !email || !reseller) return false;
    return true;
  }, [clientType, selectedCompanyId, domain, email, reseller]);

  return (
    <OperationsLayout>
      <Stack component="main" gap="lg">
        {/* Breadcrumb */}
        <Group gap="xs">
          <Button variant="subtle" color="blue" onClick={() => navigate('/operations/companies')} px={0} size="sm">
            Companies
          </Button>
          <Text size="sm" c="dimmed">/</Text>
          <Text size="sm">Microsoft</Text>
          <Text size="sm" c="dimmed">/</Text>
          <Text size="sm" fw={500}>Reseller: Customer Onboarding</Text>
        </Group>

        {/* Header */}
        <Card>
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Text fw={700} size="lg">Reseller: Customer Onboarding</Text>
              <Text size="sm" c="dimmed">
                Send an onboarding email with RRR + GDAP approval links to your customer
              </Text>
            </Stack>
            {/* Partner Center Status */}
            <Group gap="xs">
              {profileLoading ? (
                <Badge color="gray" variant="light" leftSection={<Loader2 size={12} className="animate-spin" />}>
                  Loading Partner Center...
                </Badge>
              ) : partnerProfile?.mpnId ? (
                <Tooltip label={`MPN ID: ${partnerProfile.mpnId}`}>
                  <Badge color="green" variant="light" leftSection={<Check size={12} />}>
                    Partner Center Connected
                  </Badge>
                </Tooltip>
              ) : (
                <Tooltip label={profileError || 'Partner Center not connected. RRR links will use placeholder.'}>
                  <Badge color="orange" variant="light" leftSection={<AlertCircle size={12} />}>
                    Partner Center: Limited
                  </Badge>
                </Tooltip>
              )}
            </Group>
          </Group>
        </Card>

        {/* Partner Center Warning */}
        {!profileLoading && !partnerProfile?.mpnId && (
          <Alert 
            icon={<AlertCircle size={16} />} 
            color="orange" 
            variant="light"
            title="Partner Center not connected"
          >
            <Text size="sm">
              Connect to Partner Center to generate real RRR links with your MPN ID. 
              Without this, customers will see a placeholder partner ID.{' '}
              <Text 
                component="a" 
                href="/operations/microsoft" 
                c="blue" 
                td="underline"
                style={{ cursor: 'pointer' }}
              >
                Go to Microsoft Settings →
              </Text>
            </Text>
          </Alert>
        )}

        {/* Two-Column Layout */}
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" style={{ alignItems: 'stretch' }}>
          {/* LEFT: Form */}
          <Card>
            <Stack gap="lg">
              <Text fw={600} size="sm">Customer Details</Text>
              
              {/* Client Type Selection */}
              <Box>
                <Text size="sm" fw={500} mb={8}>Client</Text>
                <SegmentedControl
                  value={clientType}
                  onChange={handleClientTypeChange}
                  data={[
                    { value: 'new', label: (
                      <Group gap={6} wrap="nowrap">
                        <UserPlus size={14} />
                        <span>New Customer</span>
                      </Group>
                    )},
                    { value: 'existing', label: (
                      <Group gap={6} wrap="nowrap">
                        <Building2 size={14} />
                        <span>Existing Customer</span>
                      </Group>
                    )},
                  ]}
                  fullWidth
                />
              </Box>

              {/* Company Selection (for existing customers) */}
              {clientType === 'existing' && (
                <Select
                  label="Select Company"
                  description="Search your Marketplace companies"
                  placeholder="Search by company name..."
                  searchable
                  clearable
                  data={marketplaceCompanies.map(c => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  value={selectedCompanyId}
                  onChange={handleCompanySelect}
                  nothingFoundMessage="No companies found"
                  leftSection={<Building2 size={16} />}
                />
              )}

              <Divider />

              {/* Contact Details */}
              <Text fw={600} size="sm">Microsoft Tenant Details</Text>
              
              <TextInput
                label="Default Domain"
                placeholder="contoso.onmicrosoft.com"
                value={domain}
                onChange={(e) => setDomain(e.currentTarget.value)}
                required
              />
              
              <TextInput
                label="Contact Name"
                placeholder="John Smith"
                value={contactName}
                onChange={(e) => setContactName(e.currentTarget.value)}
              />
              
              <TextInput
                label="Email Address"
                placeholder="admin@contoso.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
                type="email"
              />
              
              <TextInput
                label="CC"
                placeholder="ops@itcloud.ca (optional)"
                value={ccEmail}
                onChange={(e) => setCcEmail(e.currentTarget.value)}
                type="email"
              />

              <Divider />

              {/* Reseller Selection */}
              <Select
                label="Indirect Reseller"
                description="The reseller onboarding this customer"
                placeholder="Select reseller"
                data={indirectResellers}
                value={reseller}
                onChange={setReseller}
                required
              />

              <Divider />

              {/* GDAP Template Selection */}
              <Select
                label="GDAP Role Template"
                description="Admin roles that will be requested for this customer"
                placeholder="Select a role template"
                data={GDAP_TEMPLATES.map((t) => ({
                  value: t.id,
                  label: t.name,
                }))}
                value={selectedTemplateId}
                onChange={setSelectedTemplateId}
                clearable
              />

              {/* Show selected template details */}
              {selectedTemplate && (
                <Paper p="sm" radius="sm" withBorder bg="blue.0">
                  <Stack gap={4}>
                    <Text size="xs" fw={600} c="blue.7">{selectedTemplate.name}</Text>
                    {selectedTemplate.description && (
                      <Text size="xs" c="dimmed">{selectedTemplate.description}</Text>
                    )}
                    <Group gap={4} mt={4}>
                      {selectedTemplate.roles.slice(0, 4).map((role) => (
                        <Badge key={role} size="xs" variant="light" color="blue">
                          {role}
                        </Badge>
                      ))}
                      {selectedTemplate.roles.length > 4 && (
                        <Badge size="xs" variant="light" color="gray">
                          +{selectedTemplate.roles.length - 4} more
                        </Badge>
                      )}
                    </Group>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Card>

          {/* RIGHT: Live Email Preview */}
          <Card style={{ display: 'flex', flexDirection: 'column' }}>
            <Stack gap="md" style={{ flex: 1, minHeight: 0 }}>
              <Group justify="space-between" align="center">
                <Text fw={600} size="sm">📧 Email Preview</Text>
                <Group gap="xs">
                  {isEditing ? (
                    <>
                      <Button
                        size="xs"
                        variant="light"
                        color="gray"
                        leftSection={<X size={14} />}
                        onClick={() => {
                          setIsEditing(false);
                          editor?.commands.setContent(emailTemplate);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        color="green"
                        leftSection={<Check size={14} />}
                        onClick={() => setIsEditing(false)}
                      >
                        Done
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="xs"
                      variant="subtle"
                      leftSection={<Pencil size={14} />}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  )}
                </Group>
              </Group>

              {/* Email Header */}
              <Paper p="sm" radius="sm" withBorder bg="gray.0">
                <Stack gap={4}>
                  <Group gap="xs">
                    <Text size="xs" c="dimmed" w={40}>To:</Text>
                    <Text size="sm" fw={500}>{email || 'recipient@example.com'}</Text>
                  </Group>
                  {ccEmail && (
                    <Group gap="xs">
                      <Text size="xs" c="dimmed" w={40}>CC:</Text>
                      <Text size="sm">{ccEmail}</Text>
                    </Group>
                  )}
                  <Group gap="xs">
                    <Text size="xs" c="dimmed" w={40}>Subject:</Text>
                    <Text size="sm" fw={500}>
                      Action required: Approve RRR + GDAP for {domain || 'your organization'}
                    </Text>
                  </Group>
                </Stack>
              </Paper>

              {/* Email Body */}
              <Box style={{ flex: 1, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
                {isEditing ? (
                  <RichTextEditor editor={editor} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <RichTextEditor.Toolbar sticky stickyOffset={0}>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                      </RichTextEditor.ControlsGroup>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                      </RichTextEditor.ControlsGroup>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                      </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content
                      style={{
                        flex: 1,
                        minHeight: 200,
                        border: '1px solid var(--mantine-color-blue-2)',
                        borderRadius: 8,
                      }}
                    />
                  </RichTextEditor>
                ) : (
                  <ScrollArea style={{ flex: 1 }}>
                    <Paper p="md" radius="sm" withBorder style={{ minHeight: '100%' }}>
                      <div
                        dangerouslySetInnerHTML={{ __html: editor?.getHTML() || emailTemplate }}
                        style={{ fontSize: 14, lineHeight: 1.6 }}
                      />
                    </Paper>
                  </ScrollArea>
                )}
              </Box>

              {/* Action Buttons */}
              <Group justify="flex-end" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Button
                  variant="light"
                  leftSection={copiedToClipboard ? <Check size={16} /> : <Copy size={16} />}
                  color={copiedToClipboard ? 'green' : 'gray'}
                  onClick={handleCopyEmail}
                >
                  {copiedToClipboard ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
                <Button
                  leftSection={<Send size={16} />}
                  disabled={!isFormValid}
                  onClick={handleSendEmail}
                >
                  Send Email
                </Button>
              </Group>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Current Approvals */}
        <Card>
          <Group justify="space-between" mb="md">
            <Stack gap={2}>
              <Text fw={600} size="sm">Current Approvals</Text>
              <Text size="xs" c="dimmed">Track the status of pending customer onboarding requests</Text>
            </Stack>
          </Group>
          <div style={{ overflowX: 'auto' }}>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Client</Table.Th>
                  <Table.Th>Default Domain</Table.Th>
                  <Table.Th>Step</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {approvalRows.map((row) => (
                  <Table.Tr key={row.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>{row.customer}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">{row.defaultDomain}</Text>
                    </Table.Td>
                    <Table.Td>{row.step}</Table.Td>
                    <Table.Td>
                      <Badge color={row.statusColor} variant="light" size="sm">
                        {row.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label="Resend email">
                        <ActionIcon variant="light" color="blue" onClick={() => setResendTarget(row)}>
                          <Mail size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </Card>
      </Stack>

      {/* Resend Confirmation Modal */}
      <Modal
        opened={Boolean(resendTarget)}
        onClose={() => setResendTarget(null)}
        title="Resend Onboarding Email"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to resend the onboarding email to this customer?
          </Text>
          {resendTarget && (
            <Paper p="sm" radius="sm" withBorder bg="gray.0">
              <Group gap="xs">
                <Building2 size={16} />
                <Text size="sm" fw={500}>{resendTarget.customer}</Text>
              </Group>
              <Text size="xs" c="dimmed" mt={4}>{resendTarget.defaultDomain}</Text>
            </Paper>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setResendTarget(null)}>
              Cancel
            </Button>
            <Button
              leftSection={<Send size={14} />}
              onClick={() => {
                if (resendTarget) {
                  notifications.show({
                    title: 'Email sent',
                    message: `Onboarding email resent to ${resendTarget.customer}`,
                    color: 'green',
                    icon: <Check size={16} />,
                  });
                }
                setResendTarget(null);
              }}
            >
              Resend Email
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Help Button */}
      <div style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <ActionIcon
          size="lg"
          radius="xl"
          variant="filled"
          color="blue"
          aria-label="Help"
        >
          <HelpCircle size={18} />
        </ActionIcon>
      </div>
    </OperationsLayout>
  );
};
