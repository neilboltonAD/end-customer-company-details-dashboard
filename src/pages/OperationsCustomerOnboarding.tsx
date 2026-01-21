import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Mail } from 'lucide-react';
import { ActionIcon, Badge, Button, Group, Modal, Select, SimpleGrid, Stack, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { OperationsLayout } from '../components/layout/OperationsLayout';
import { getPartnerCenterCustomers } from '../api/partnerCenter';
import { openEmailPreviewWindow } from '../lib/client/emailPreview';
import { Card } from 'components/DesignSystem';

type Company = {
  id: string;
  tenantId: string;
  name: string;
  defaultDomain: string;
};

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
  {
    id: 'approval-4',
    customer: 'Adventure Works',
    defaultDomain: 'adventureworks.onmicrosoft.com',
    step: 'Action Needed',
    status: 'Pending: Awaiting confirmation of RRR',
    statusColor: 'orange',
  },
];

export const OperationsCustomerOnboarding = () => {
  const navigate = useNavigate();
  const [defaultDomain, setDefaultDomain] = useState('');
  const [contactName, setContactName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [ccAddress, setCcAddress] = useState('');
  const [companyType, setCompanyType] = useState<'new' | 'existing'>('new');
  const [reseller, setReseller] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailBody, setEmailBody] = useState('');
  const [resendTarget, setResendTarget] = useState<(typeof approvalRows)[number] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        setCompaniesLoading(true);
        setCompaniesError(null);
        const c = await getPartnerCenterCustomers(200);
        if (!c.ok) throw new Error(c.error || 'Failed to load companies.');
        const mapped: Company[] = (c.customers || [])
          .map((x: any) => ({
            id: String(x.id || x.tenantId || ''),
            tenantId: String(x.tenantId || x.id || ''),
            name: String(x.companyName || x.defaultDomain || x.id || 'Unknown'),
            defaultDomain: String(x.defaultDomain || ''),
          }))
          .filter((x: Company) => x.id && x.tenantId);
        if (!cancelled) setCompanies(mapped);
      } catch (e: any) {
        if (!cancelled) setCompaniesError(e?.message || 'Failed to load companies.');
      } finally {
        if (!cancelled) setCompaniesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const template = useMemo(() => {
    const domain = defaultDomain || '[customer-domain]';
    const recipient = emailAddress || '[customer-email]';
    const name = contactName || '[contact-name]';
    const resellerName = reseller || 'your indirect reseller';
    const rrrUrl = `https://itcloud.ca/rrr-request?domain=${encodeURIComponent(domain)}`;
    const gdapUrl = `https://itcloud.ca/gdap-request?domain=${encodeURIComponent(domain)}`;

    return `
      <p>Hello ${name},</p>
      <p><em>${recipient}</em></p>
      <p><strong>${resellerName}</strong> is requesting to become the Microsoft 365 cloud solutions provider for <strong>${domain}</strong>.</p>
      <p><strong>Step 1:</strong> Approve the Reseller Relationship Request (RRR)<br />
        <a href="${rrrUrl}" target="_blank" rel="noreferrer">${rrrUrl}</a>
      </p>
      <p><strong>Step 2:</strong> Approve the GDAP request<br />
        <a href="${gdapUrl}" target="_blank" rel="noreferrer">${gdapUrl}</a>
      </p>
      <p>If you have any questions, reply to this email and our team will help.</p>
      <p>Thanks,<br />ITCloud.ca Team</p>
    `.trim();
  }, [defaultDomain, emailAddress]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: emailBody,
    onUpdate: ({ editor }) => {
      setEmailBody(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (emailBody && editor.getHTML() !== emailBody) {
      editor.commands.setContent(emailBody);
    }
    if (!emailBody) {
      editor.commands.setContent(template);
    }
  }, [editor, emailBody, template]);

  const handleCreate = () => {
    setEmailBody(template);
    setModalOpen(true);
  };

  const handlePreviewEmail = () => {
    const domain = defaultDomain || '[customer-domain]';
    const subject = `Action required: approve RRR + GDAP for ${domain}`;
    const ok = openEmailPreviewWindow({
      to: emailAddress || '[customer-email]',
      cc: ccAddress || undefined,
      subject,
      html: editor?.getHTML() || emailBody || template,
    });
    if (!ok) {
      notifications.show({
        title: 'Popup blocked',
        message: 'Please allow popups for this site to open the email preview.',
        color: 'orange',
      });
      return;
    }
    notifications.show({
      title: 'Preview opened',
      message: 'A new tab/window was opened with the email preview (no email was sent).',
      color: 'blue',
    });
  };

  return (
    <OperationsLayout>
      <Stack component="main" gap="xl">
        <Group gap="xs" mb="sm">
          <Button variant="subtle" color="blue" onClick={() => navigate('/operations/companies')} px={0}>
            Companies
          </Button>
          <Text size="sm" c="dimmed">/</Text>
          <Text size="sm">Microsoft</Text>
          <Text size="sm" c="dimmed">/</Text>
          <Text size="sm">Reseller: Customer Onboarding</Text>
        </Group>

          <Card>
            <Stack gap={2}>
              <Text fw={700} size="lg">
                Reseller: Customer Onboarding
              </Text>
              <Text size="sm" c="dimmed">
                Onboard a new customer for Microsoft Indirect Reseller
              </Text>
            </Stack>
          </Card>

          <Card>
            <Text fw={600} size="sm" mb="md">Microsoft Tenant Details</Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
              <TextInput
                label="Default Domain"
                placeholder="myclient123.com"
                value={defaultDomain}
                onChange={(event) => setDefaultDomain(event.currentTarget.value)}
              />
              <TextInput
                label="Name"
                placeholder="Jane Doe"
                value={contactName}
                onChange={(event) => setContactName(event.currentTarget.value)}
              />
              <TextInput
                label="Email Address"
                placeholder="admin@myclient123.com"
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.currentTarget.value)}
              />
              <TextInput
                label="CC"
                placeholder="ops@itcloud.ca"
                value={ccAddress}
                onChange={(event) => setCcAddress(event.currentTarget.value)}
              />
              <Select
                label="Client"
                data={[
                  { value: 'new', label: 'New Company' },
                  { value: 'existing', label: 'Existing Company' },
                ]}
                value={companyType}
                onChange={(value) => setCompanyType((value as 'new' | 'existing') || 'new')}
              />
              <Select
                label="Indirect Reseller"
                placeholder="None"
                data={[
                  { value: 'None', label: 'None' },
                  { value: 'ITCloud.ca', label: 'ITCloud.ca' },
                  { value: 'Northwind Reseller', label: 'Northwind Reseller' },
                  { value: 'Contoso Cloud Services', label: 'Contoso Cloud Services' },
                ]}
                value={reseller || 'None'}
                onChange={(value) => setReseller(value === 'None' ? null : value || null)}
              />
            </SimpleGrid>

            <Group justify="flex-end" mt="lg">
              <Button onClick={handleCreate}>Create</Button>
            </Group>
          </Card>

          <Card>
            <Group justify="space-between" mb="md">
              <Text fw={600} size="sm">Current approvals</Text>
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
                      <Table.Td>{row.customer}</Table.Td>
                      <Table.Td>{row.defaultDomain}</Table.Td>
                      <Table.Td>{row.step}</Table.Td>
                      <Table.Td>
                        <Badge color={row.statusColor} variant="light">
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

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Send email to recipient(s)"
        size="lg"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            The email below is editable. ITCloud.ca branding and the RRR + GDAP links are included by default.
          </Text>
          <Text size="sm" fw={600}>
            Editable email content
          </Text>
          {companyType === 'existing' && (
            <Select
              label="Select Company"
              searchable
              clearable
              placeholder={companiesLoading ? 'Loading companies…' : 'Search by company name or domain'}
              data={companies.map((c) => ({ value: c.id, label: `${c.name} (${c.defaultDomain})` }))}
              value={selectedCompanyId}
              onChange={setSelectedCompanyId}
              nothingFoundMessage={companiesError || 'No companies found'}
            />
          )}
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Strikethrough />
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
                minHeight: 320,
                border: '1px solid var(--mantine-color-blue-2)',
                borderRadius: 8,
                background: 'var(--mantine-color-blue-0)',
              }}
            />
          </RichTextEditor>
          <Group justify="flex-end">
            <Button onClick={() => setModalOpen(false)}>Close</Button>
            <Button variant="filled" onClick={handlePreviewEmail}>
              Submit
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={Boolean(resendTarget)}
        onClose={() => setResendTarget(null)}
        title="Resend email confirmation"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to resend the Reseller Relationship Email to the customer?
          </Text>
          {resendTarget && (
            <Text size="sm" c="dimmed">
              {resendTarget.customer} • {resendTarget.defaultDomain}
            </Text>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setResendTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (resendTarget) {
                  notifications.show({
                    title: 'Email sent',
                    message: `Reseller Relationship Email sent to ${resendTarget.customer}.`,
                    color: 'blue',
                  });
                }
                setResendTarget(null);
              }}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>

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
