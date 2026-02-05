import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Mail, Copy, Send, Pencil, Check, X, Building2, UserPlus, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { ActionIcon, Badge, Button, Group, Loader, Modal, Paper, SegmentedControl, Select, SimpleGrid, Stack, Table, Text, TextInput, Tooltip, Box, Divider, ScrollArea, Alert } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { OperationsLayout } from '../components/layout/OperationsLayout';
import { Card } from 'components/DesignSystem';
import { getPartnerCenterProfile, getIndirectResellers, generateRrrUrl, createGdapRequest, type PartnerProfile, type IndirectReseller, type CreateGdapRequestPayload } from '../api/partnerCenter';
import { getTemplateRoleIds } from '../api/gdapTemplates';
import { GDAP_TEMPLATES, getTemplateById, type GdapTemplate } from '../api/gdapTemplates';

// Marketplace Companies (from Operations > Companies)
// Companies may or may not have a linked Microsoft tenant yet
// - hasTenantLinked: true = already onboarded, don't need RRR/GDAP
// - hasTenantLinked: false = needs onboarding via RRR/GDAP
const marketplaceCompanies = [
  // Companies WITHOUT linked tenants (need onboarding)
  { id: 'mc-1', name: 'demoresellercustomer3', contactName: 'John Smith', email: 'john@demoresellercustomer3.com', createdOn: '11/11/25', hasTenantLinked: false },
  { id: 'mc-2', name: 'demoresellercustomeropportunity', contactName: 'Sarah Johnson', email: 'sarah@opportunity.com', createdOn: '11/11/25', hasTenantLinked: false },
  { id: 'mc-3', name: 'demoresellercustomer2', contactName: 'Mike Wilson', email: 'mike@demoresellercustomer2.com', createdOn: '11/10/25', hasTenantLinked: false },
  { id: 'mc-4', name: 'demoresellercustomer1', contactName: 'Emma Davis', email: 'emma@demoresellercustomer1.com', createdOn: '11/10/25', hasTenantLinked: false },
  { id: 'mc-5', name: 'Demo Reseller', contactName: 'Alex Brown', email: 'alex@demoreseller.com', createdOn: '11/10/25', hasTenantLinked: false },
  { id: 'mc-6', name: 'Demo Reseller Manager', contactName: 'Chris Lee', email: 'chris@demoresellermanager.com', createdOn: '11/10/25', hasTenantLinked: false },
  // Companies WITH linked tenants (already onboarded - show warning)
  { id: 'mc-7', name: 'VodafoneDemo2', contactName: 'Tom Harris', email: 'tom@vodafonedemo2.com', createdOn: '10/23/25', hasTenantLinked: true, linkedDomain: 'vodafonedemo2.onmicrosoft.com' },
  { id: 'mc-8', name: 'VodafoneDemo1', contactName: 'Lisa Chen', email: 'lisa@vodafonedemo1.com', createdOn: '10/23/25', hasTenantLinked: true, linkedDomain: 'vodafonedemo1.onmicrosoft.com' },
  { id: 'mc-9', name: 'Fabrikam Inc', contactName: 'James Miller', email: 'james@fabrikam.com', createdOn: '10/20/25', hasTenantLinked: true, linkedDomain: 'fabrikam.onmicrosoft.com' },
  { id: 'mc-10', name: 'Contoso Ltd', contactName: 'John Doe', email: 'john@contoso.com', createdOn: '10/15/25', hasTenantLinked: true, linkedDomain: 'contoso.onmicrosoft.com' },
  { id: 'mc-11', name: 'Adventure Works', contactName: 'Amy Wilson', email: 'amy@adventureworks.com', createdOn: '10/10/25', hasTenantLinked: true, linkedDomain: 'adventureworks.onmicrosoft.com' },
  { id: 'mc-12', name: 'Appdirect', contactName: 'Bob Martinez', email: 'bob@appdirect.com', createdOn: '10/13/25', hasTenantLinked: true, linkedDomain: 'appdirect.onmicrosoft.com' },
];

// GDAP duration options (ISO 8601 duration format)
const GDAP_DURATION_OPTIONS = [
  { value: 'P30D', label: '30 days' },
  { value: 'P90D', label: '90 days' },
  { value: 'P180D', label: '180 days (6 months)' },
  { value: 'P365D', label: '365 days (1 year)' },
  { value: 'P730D', label: '730 days (2 years) - Maximum' },
];

// Fallback resellers for demo mode (when Partner Center is not connected)
const fallbackResellers = [
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

  // Indirect resellers from Partner Center
  const [indirectResellers, setIndirectResellers] = useState<IndirectReseller[]>([]);
  const [resellersLoading, setResellersLoading] = useState(true);
  
  // Form state
  const [clientType, setClientType] = useState<'new' | 'existing'>('new');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [domain, setDomain] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [reseller, setReseller] = useState<string | null>('itcloud');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>('t-appdirect-marketplace');
  const [gdapDuration, setGdapDuration] = useState<string>('P730D'); // Default to max 730 days (2 years)

  // GDAP request state
  const [gdapApprovalUrl, setGdapApprovalUrl] = useState<string | null>(null);
  const [isCreatingGdap, setIsCreatingGdap] = useState(false);

  // Warning state for already-linked tenants
  const [showLinkedWarning, setShowLinkedWarning] = useState(false);

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

  // Fetch indirect resellers from Partner Center
  useEffect(() => {
    let cancelled = false;
    const fetchResellers = async () => {
      try {
        setResellersLoading(true);
        const response = await getIndirectResellers();
        if (!cancelled && response.ok && response.resellers.length > 0) {
          // Filter to only show active resellers
          const activeResellers = response.resellers.filter(r => r.state === 'Active');
          setIndirectResellers(activeResellers);
        }
      } catch (err) {
        // Silently fail - fallback resellers will be shown
        console.warn('Failed to fetch indirect resellers:', err);
      } finally {
        if (!cancelled) {
          setResellersLoading(false);
        }
      }
    };
    fetchResellers();
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
    setShowLinkedWarning(false);
    setGdapApprovalUrl(null); // Reset GDAP when company changes
    
    if (companyId) {
      const company = marketplaceCompanies.find(c => c.id === companyId);
      if (company) {
        // Auto-fill from Company data
        setContactName(company.contactName || '');
        setEmail(company.email);
        setDomain(''); // Customer will provide their Microsoft domain
        
        // Show warning if tenant is already linked
        if (company.hasTenantLinked) {
          setShowLinkedWarning(true);
          setDomain(company.linkedDomain || '');
        }
      }
    }
  };

  // Clear form when switching client type
  const handleClientTypeChange = (value: string) => {
    setClientType(value as 'new' | 'existing');
    setShowLinkedWarning(false);
    setGdapApprovalUrl(null); // Reset GDAP when switching client type
    
    if (value === 'new') {
      setSelectedCompanyId(null);
      setDomain('');
      setContactName('');
      setEmail('');
    }
  };

  // Prepare reseller dropdown data (use real resellers if available, otherwise fallback)
  const resellerDropdownData = useMemo(() => {
    if (indirectResellers.length > 0) {
      return indirectResellers.map(r => ({
        value: r.id,
        label: r.name || r.id,
      }));
    }
    return fallbackResellers;
  }, [indirectResellers]);

  // Get selected reseller object (for tenantId and display name)
  const selectedReseller = useMemo(() => {
    if (!reseller) return null;
    return indirectResellers.find(r => r.id === reseller) || null;
  }, [reseller, indirectResellers]);

  // Get reseller name for display
  const resellerName = useMemo(() => {
    if (selectedReseller?.name) return selectedReseller.name;
    const fallback = fallbackResellers.find(r => r.value === reseller);
    return fallback?.label || 'Your Reseller';
  }, [reseller, selectedReseller]);

  // Generate email template with real Partner Center URLs
  const emailTemplate = useMemo(() => {
    const displayDomain = domain || 'customer-domain.com';
    const displayName = contactName || 'Valued Customer';
    
    // Generate RRR URL using the correct format based on reseller type
    // For Indirect Resellers: includes reseller's tenant ID
    // For Direct Partners: standard format with partner's MPN ID
    const rrrUrl = partnerProfile?.mpnId
      ? generateRrrUrl({
          partnerMpnId: partnerProfile.mpnId,
          resellerTenantId: selectedReseller?.tenantId,
          isIndirectReseller: !!selectedReseller?.tenantId,
        })
      : 'https://admin.microsoft.com/Adminportal/Home#/partners/invitation/reseller?partnerId=PARTNER_ID&msppId=0&DAP=true';
    
    // GDAP approval URL - use specific URL if created, otherwise show placeholder
    // The actual URL is created when "Send Email" is clicked
    const gdapUrl = gdapApprovalUrl 
      || '[GDAP link will be generated when you click Send Email]';

    // Get human-friendly duration
    const durationOption = GDAP_DURATION_OPTIONS.find(d => d.value === gdapDuration);
    const durationText = durationOption?.label?.replace(' - Maximum', '') || '730 days';
    
    // Get roles list for display (limit to 4 for brevity)
    const rolesList = selectedTemplate?.roles.slice(0, 4).map(role => 
      `<li style="margin: 4px 0; color: #495057;">${role}</li>`
    ).join('') || '';
    const moreRoles = selectedTemplate && selectedTemplate.roles.length > 4 
      ? `<li style="margin: 4px 0; color: #868e96; font-style: italic;">+ ${selectedTemplate.roles.length - 4} more permissions</li>` 
      : '';

    return `
      <p style="font-size: 16px; color: #212529; margin-bottom: 16px;">Hello ${displayName},</p>
      
      <p style="font-size: 15px; color: #495057; margin-bottom: 24px;">
        You have <strong>2 quick actions</strong> to complete your Microsoft 365 setup with <strong>${resellerName}</strong>:
      </p>

      <div style="border-left: 4px solid #228be6; padding-left: 16px; margin-bottom: 24px;">
        <p style="font-size: 12px; color: #868e96; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px;">
          ☐ Action 1 of 2
        </p>
        <p style="font-size: 16px; font-weight: 600; color: #212529; margin: 0 0 8px 0;">
          Approve Reseller Relationship
        </p>
        <p style="font-size: 14px; color: #495057; margin: 0 0 12px 0;">
          This makes <strong>${resellerName}</strong> your official Microsoft partner for <strong>${displayDomain}</strong>.<br/>
          <span style="color: #868e96;">Takes about 30 seconds.</span>
        </p>
        <a href="${rrrUrl}" style="display: inline-block; background: #228be6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">
          ▶ &nbsp;Approve Relationship
        </a>
      </div>

      <div style="border-left: 4px solid #40c057; padding-left: 16px; margin-bottom: 24px;">
        <p style="font-size: 12px; color: #868e96; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px;">
          ☐ Action 2 of 2
        </p>
        <p style="font-size: 16px; font-weight: 600; color: #212529; margin: 0 0 8px 0;">
          Approve Admin Access (GDAP)
        </p>
        <p style="font-size: 14px; color: #495057; margin: 0 0 8px 0;">
          This lets <strong>${resellerName}</strong> help manage your Microsoft 365 services.<br/>
          <span style="color: #868e96;">Valid for ${durationText}. You can revoke anytime.</span>
        </p>
        ${selectedTemplate ? `
        <p style="font-size: 13px; color: #495057; margin: 0 0 12px 0;">
          <strong>Permissions requested:</strong>
          <ul style="margin: 8px 0 0 0; padding-left: 20px;">
            ${rolesList}
            ${moreRoles}
          </ul>
        </p>
        ` : ''}
        <a href="${gdapUrl}" style="display: inline-block; background: #40c057; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">
          ▶ &nbsp;Approve Admin Access
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #dee2e6; margin: 24px 0;" />

      <p style="font-size: 14px; color: #495057; margin-bottom: 16px;">
        Questions? Just hit reply — we're here to help!
      </p>

      <p style="font-size: 14px; color: #212529; margin: 0;">
        — <strong>The ${resellerName} Team</strong>
      </p>
      
      ${partnerProfile?.mpnId ? `
      <p style="font-size: 11px; color: #adb5bd; margin-top: 16px;">
        Partner MPN ID: ${partnerProfile.mpnId}
      </p>
      ` : ''}
    `.trim();
  }, [domain, contactName, resellerName, partnerProfile, selectedTemplate, selectedReseller, gdapDuration, gdapApprovalUrl]);

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

  // Create GDAP relationship request via Graph API
  // This creates a request with specific roles - no customer tenant ID needed
  // Microsoft returns an invitation URL that any customer can use to approve
  const createGdapRelationship = async (): Promise<string | null> => {
    if (!selectedTemplateId || !selectedTemplate) {
      notifications.show({
        title: 'No GDAP template selected',
        message: 'Please select a GDAP role template',
        color: 'orange',
      });
      return null;
    }

    setIsCreatingGdap(true);
    try {
      const roleIds = getTemplateRoleIds(selectedTemplateId);
      if (roleIds.length === 0) {
        notifications.show({
          title: 'No roles in template',
          message: 'The selected GDAP template has no valid roles',
          color: 'red',
        });
        return null;
      }

      // Create GDAP WITHOUT customer tenant ID
      // Microsoft will generate an invitation URL that includes these specific roles
      const payload: CreateGdapRequestPayload = {
        customerTenantId: '', // Empty = invitation link for any customer
        displayName: `${resellerName} - ${selectedTemplate.name} - ${domain || 'Customer'}`,
        duration: gdapDuration,
        roles: roleIds,
        autoExtendDuration: 'P180D',
      };

      const response = await createGdapRequest(payload);
      
      if (response.ok && response.relationship) {
        setGdapApprovalUrl(response.relationship.customerApprovalUrl);
        return response.relationship.customerApprovalUrl;
      } else {
        throw new Error(response.error || 'Failed to create GDAP relationship');
      }
    } catch (err: any) {
      console.error('GDAP creation error:', err);
      notifications.show({
        title: 'GDAP request failed',
        message: err?.message || 'Failed to create GDAP relationship. Check Partner Center connection.',
        color: 'red',
      });
      return null;
    } finally {
      setIsCreatingGdap(false);
    }
  };

  // Send email with RRR + GDAP links
  // 1. Create GDAP relationship first (to get URL with specific roles)
  // 2. Then open mailto with both links
  const handleSendEmail = async () => {
    if (!email) {
      notifications.show({
        title: 'Missing email',
        message: 'Please enter a recipient email address',
        color: 'orange',
      });
      return;
    }

    if (!domain) {
      notifications.show({
        title: 'Missing domain',
        message: 'Please enter the customer\'s Microsoft domain',
        color: 'orange',
      });
      return;
    }

    // Create GDAP relationship first (if not already created)
    let approvalUrl = gdapApprovalUrl;
    if (!approvalUrl) {
      approvalUrl = await createGdapRelationship();
      if (!approvalUrl) {
        // GDAP creation failed - don't send email without valid GDAP link
        return;
      }
    }
    
    const subject = `Action required: Approve RRR + GDAP for ${domain}`;
    const body = editor?.getText() || '';
    
    // Open mailto link
    const mailtoUrl = `mailto:${email}${ccEmail ? `?cc=${ccEmail}` : ''}${ccEmail ? '&' : '?'}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    
    notifications.show({
      title: 'Email client opened',
      message: `Opening email to ${email}`,
      color: 'green',
      icon: <Send size={16} />,
    });
  };

  // Check if form is valid (and not trying to send to already-linked tenant)
  const isFormValid = useMemo(() => {
    if (clientType === 'existing' && !selectedCompanyId) return false;
    if (!domain || !email || !reseller) return false;
    if (showLinkedWarning) return false; // Can't send to already-linked tenant
    return true;
  }, [clientType, selectedCompanyId, domain, email, reseller, showLinkedWarning]);

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
              
              {/* Existing Company Selection */}
              <Box>
                <Text size="sm" fw={500} mb={8}>Does this customer have an existing Marketplace Company?</Text>
                <SegmentedControl
                  value={clientType === 'existing' ? 'yes' : 'no'}
                  onChange={(value) => handleClientTypeChange(value === 'yes' ? 'existing' : 'new')}
                  data={[
                    { value: 'no', label: 'No' },
                    { value: 'yes', label: 'Yes' },
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
              
              {/* Warning for already-linked tenants */}
              {showLinkedWarning && (
                <Alert 
                  icon={<AlertCircle size={16} />} 
                  color="orange" 
                  variant="light"
                  title="Tenant already linked"
                >
                  <Text size="sm">
                    This company already has a Microsoft tenant linked ({selectedCompany?.linkedDomain}). 
                    They don't need a new RRR or GDAP approval. If you need to modify their GDAP permissions, 
                    use the <Text component="span" fw={600}>GDAP: Management</Text> feature instead.
                  </Text>
                </Alert>
              )}

              <TextInput
                label="Microsoft Domain"
                description="The customer's Microsoft 365 domain (e.g., contoso.onmicrosoft.com)"
                placeholder="contoso.onmicrosoft.com"
                value={domain}
                onChange={(e) => setDomain(e.currentTarget.value)}
                required
                disabled={showLinkedWarning}
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
                placeholder={resellersLoading ? 'Loading resellers...' : 'Select reseller'}
                data={resellerDropdownData}
                value={reseller}
                onChange={setReseller}
                required
                disabled={resellersLoading}
                rightSection={resellersLoading ? <Loader size="xs" /> : undefined}
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
                onChange={(value) => {
                  setSelectedTemplateId(value);
                  setGdapApprovalUrl(null); // Reset GDAP when template changes
                }}
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

              {/* GDAP Duration */}
              <Select
                label="GDAP Duration"
                description="How long the GDAP relationship will last"
                data={GDAP_DURATION_OPTIONS}
                value={gdapDuration}
                onChange={(value) => {
                  setGdapDuration(value || 'P730D');
                  setGdapApprovalUrl(null); // Reset GDAP when duration changes
                }}
              />
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
                  leftSection={isCreatingGdap ? <Loader size={16} /> : <Send size={16} />}
                  disabled={!isFormValid || isCreatingGdap}
                  onClick={handleSendEmail}
                  color={gdapApprovalUrl ? 'green' : undefined}
                >
                  {isCreatingGdap ? 'Creating GDAP...' : gdapApprovalUrl ? 'Send Email ✓' : 'Send Email'}
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
