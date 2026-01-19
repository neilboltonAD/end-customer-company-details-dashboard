import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Settings } from 'lucide-react';
import { Button, Group, Modal, SegmentedControl, Stack, Switch, Text } from '@mantine/core';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { P2PTransfersPanel } from '../components/company/p2p';

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
      </SidebarSection>
    </aside>
  );
};

export const OperationsP2PTransfers = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [transferMode, setTransferMode] = useState<'Direct' | 'Indirect'>('Direct');
  const [companyCreationEnabled, setCompanyCreationEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="flex">
        <OperationsSidebar activeItem="Reseller: P2P Transfers" />

        <main className="flex-1 p-6">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <button onClick={() => navigate('/operations/companies')} className="hover:text-teal-600">
              Companies
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Microsoft</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Reseller: P2P Transfers</span>
          </div>

          <div className="bg-white rounded shadow p-4 mb-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Reseller: P2P Transfers</h1>
                <p className="text-sm text-gray-500">Marketplace-wide subscription transfers</p>
              </div>
              <Button
                variant="light"
                leftSection={<Settings size={16} />}
                onClick={() => setSettingsOpen(true)}
              >
                Settings
              </Button>
            </div>
          </div>

          <P2PTransfersPanel allowOutbound={transferMode === 'Direct'} />
        </main>
      </div>

      <Modal
        opened={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="P2P Transfer Settings"
        centered
      >
        <Stack gap="md">
          <div>
            <Text size="sm" fw={600} mb={6}>
              Transfer Mode
            </Text>
            <SegmentedControl
              fullWidth
              value={transferMode}
              onChange={(value) => setTransferMode(value as 'Direct' | 'Indirect')}
              data={[
                { label: 'Direct', value: 'Direct' },
                { label: 'Indirect', value: 'Indirect' },
              ]}
            />
            <Text size="xs" c="dimmed" mt={6}>
              Indirect mode disables outbound transfers. Direct mode supports inbound and outbound.
            </Text>
          </div>

          <Group justify="space-between">
            <div>
              <Text size="sm" fw={600}>
                Enable Company Creation
              </Text>
              <Text size="xs" c="dimmed">
                Allow creating a new company during transfer setup.
              </Text>
            </div>
            <Switch
              checked={companyCreationEnabled}
              onChange={(event) => setCompanyCreationEnabled(event.currentTarget.checked)}
            />
          </Group>
        </Stack>
      </Modal>

      <button className="fixed bottom-6 right-6 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700">
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
};
