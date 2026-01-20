import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Plus, ArrowLeftRight } from 'lucide-react';
import { Group } from '@mantine/core';
import { P2PTransfersManagementModal } from '../components/company/p2p';
import { OperationsLayout } from '../components/layout/OperationsLayout';
import { ActionIcon, Button, Card, DataTable, Stack, Text, Title } from 'components/DesignSystem';
import type { DataTableColumn } from 'components/DesignSystem';
// Sample company data
const companies = [
  { name: 'demoresellercustomer3', createdOn: '11/11/25', phone: '', users: 1, access: 'None' },
  { name: 'demoresellercustomeropportunity', createdOn: '11/11/25', phone: '', users: 1, access: 'None' },
  { name: 'demoresellercustomer2', createdOn: '11/10/25', phone: '', users: 1, access: 'Marketplace Access' },
  { name: 'demoresellercustomer1', createdOn: '11/10/25', phone: '', users: 1, access: 'None' },
  { name: 'Demo Reseller', createdOn: '11/10/25', phone: '', users: 1, access: 'Reseller Access' },
  { name: 'Demo Reseller Manager', createdOn: '11/10/25', phone: '', users: 1, access: 'Marketplace Access' },
  { name: 'VodafoneDemo2', createdOn: '10/23/25', phone: '', users: 1, access: 'None' },
  { name: 'VodafoneDemo1', createdOn: '10/23/25', phone: '', users: 1, access: 'None' },
  { name: 'MMDemo3', createdOn: '10/14/25', phone: '', users: 1, access: 'None' },
  { name: 'MMDemo2', createdOn: '10/14/25', phone: '', users: 1, access: 'None' },
  { name: 'MMDemo1', createdOn: '10/14/25', phone: '', users: 1, access: 'None' },
  { name: 'Appdirect', createdOn: '10/13/25', phone: '', users: 1, access: 'None' },
  { name: 'Telus Demo', createdOn: '10/08/25', phone: '', users: 1, access: 'None' },
  { name: 'VodafoneMCADemo2', createdOn: '10/06/25', phone: '', users: 1, access: 'None' },
  { name: 'VodafoneMCADemo2', createdOn: '10/06/25', phone: '', users: 1, access: 'None' },
  { name: 'VodafoneMCADemo', createdOn: '10/06/25', phone: '', users: 1, access: 'None' },
  { name: 'CancomMCADemo3', createdOn: '10/06/25', phone: '', users: 1, access: 'None' },
  { name: 'CancomMCADemo2', createdOn: '10/06/25', phone: '', users: 1, access: 'None' },
  { name: 'CancomMCADemo', createdOn: '10/06/25', phone: '', users: 1, access: 'None' },
  { name: 'SCMCAdemo', createdOn: '09/25/25', phone: '', users: 1, access: 'None' },
];

export const OperationsCompanies = () => {
  const navigate = useNavigate();
  const [p2pModalOpen, setP2pModalOpen] = useState(false);

  // Mock pending transfer count for the badge
  const pendingTransferCount = 3;

  const handleCompanyClick = (companyName: string) => {
    // Navigate to company details with company name as URL param
    navigate(`/operations/companies/${encodeURIComponent(companyName)}`);
  };

  type CompanyRow = (typeof companies)[number];

  const columns = useMemo(
    (): DataTableColumn<CompanyRow>[] => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        cell: (row: CompanyRow) => (
          <Group gap="sm" wrap="nowrap">
            <span style={{ width: 8, height: 8, borderRadius: 9999, background: '#22c55e' }} />
            <Text size="sm">{row.name}</Text>
          </Group>
        ),
      },
      { accessorKey: 'createdOn', header: 'Created on', enableSorting: true },
      { accessorKey: 'phone', header: 'Phone' },
      { accessorKey: 'users', header: 'Users', enableSorting: true, align: 'right' },
      { accessorKey: 'access', header: 'Access' },
    ],
    []
  );

  return (
    <OperationsLayout>
      <main>
        <Group justify="space-between">
          <div>
            <Title order={2} fw={500}>
              Companies
            </Title>
            <Text c="dimmed" size="sm">
              Marketplace companies and access
            </Text>
          </div>
          <Group>
            <Button
              variant="secondary"
              leftSection={<ArrowLeftRight size={16} />}
              onClick={() => setP2pModalOpen(true)}
            >
              P2P Transfers {pendingTransferCount > 0 ? `(${pendingTransferCount})` : ''}
            </Button>
            <Button variant="secondary">New Lead or Purchase</Button>
            <Button leftSection={<Plus size={16} />}>Create New Company</Button>
          </Group>
        </Group>

        <Card>
          <Stack gap="md">
            <DataTable
              data={companies}
              columns={columns}
              showSearch
              searchPlaceholder="Search companies"
              onRowClick={(row: any) => handleCompanyClick(row.name)}
            />
          </Stack>
        </Card>
      </main>

      {/* Help Button */}
      <div style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <ActionIcon
          aria-label="Help"
          customFill="var(--mantine-color-blue-6)"
          customBorder="1px solid var(--mantine-color-blue-7)"
          style={{ color: 'white', boxShadow: 'var(--mantine-shadow-lg)' }}
        >
          <HelpCircle size={18} />
        </ActionIcon>
      </div>

      {/* P2P Transfers Management Modal */}
      <P2PTransfersManagementModal open={p2pModalOpen} onClose={() => setP2pModalOpen(false)} />
    </OperationsLayout>
  );
};


