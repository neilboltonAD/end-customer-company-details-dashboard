import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Mail } from 'lucide-react';
import { ActionIcon, Badge, Button, Group, Modal, Select, Stack, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { TopNavbar } from '../components/navigation/TopNavbar';

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
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailBody, setEmailBody] = useState('');
  const [resendTarget, setResendTarget] = useState<(typeof approvalRows)[number] | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="flex">
        <OperationsSidebar activeItem="Reseller: Customer Onboarding" />

        <main className="flex-1 p-6">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <button onClick={() => navigate('/operations/companies')} className="hover:text-teal-600">
              Companies
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Microsoft</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Reseller: Customer Onboarding</span>
          </div>

          <div className="bg-white rounded shadow p-4 mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Reseller: Customer Onboarding</h1>
              <p className="text-sm text-gray-500">Onboard a new customer for Microsoft Indirect Reseller</p>
            </div>
          </div>

          <div className="bg-white rounded shadow p-4 mb-6">
            <Text fw={600} size="sm" mb="md">Microsoft Tenant Details</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <Group justify="flex-end" mt="lg">
              <Button onClick={handleCreate}>Create</Button>
            </Group>
          </div>

          <div className="bg-white rounded shadow p-4">
            <Group justify="space-between" mb="md">
              <Text fw={600} size="sm">Current approvals</Text>
            </Group>
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
        </main>
      </div>

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
              placeholder="Choose a company"
              data={[
                { value: 'Woodgrove Bank', label: 'Woodgrove Bank' },
                { value: 'Contoso Ltd', label: 'Contoso Ltd' },
                { value: 'Fabrikam Inc', label: 'Fabrikam Inc' },
                { value: 'Adventure Works', label: 'Adventure Works' },
              ]}
              value={selectedCompany}
              onChange={setSelectedCompany}
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
            <RichTextEditor.Content className="min-h-[320px] border border-blue-200 rounded-md bg-blue-50/30" />
          </RichTextEditor>
          <Group justify="flex-end">
            <Button onClick={() => setModalOpen(false)}>Close</Button>
            <Button variant="filled">Submit</Button>
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

      <button className="fixed bottom-6 right-6 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700">
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
};
