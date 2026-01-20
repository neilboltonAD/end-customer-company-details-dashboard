import React from 'react';
import { HelpCircle } from 'lucide-react';
import { OperationsLayout } from '../components/layout/OperationsLayout';
import { Group } from '@mantine/core';
import { ActionIcon, Button, Card, DataTable, Stack, Text, Title } from 'components/DesignSystem';

// Sample user data
type UserRow = { name: string; createdOn: string; company: string; email: string };
const users = [
  { name: 'Neil Bolton', createdOn: '11/11/25', company: 'demoresellercustomer3', email: 'neil.bolton+demoresellercustomer3@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '11/11/25', company: 'demoresellercustomeropportunity', email: 'neil.bolton+demoresellercustomeropportunity@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '11/10/25', company: 'demoresellercustomer2', email: 'neil.bolton+demoresellercustomer2@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '11/10/25', company: 'demoresellercustomer1', email: 'neil.bolton+demoresellercustomer1@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '11/10/25', company: 'Demo Reseller', email: 'neil.bolton+demoreseller@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '11/10/25', company: 'Demo Reseller Manager', email: 'neil.bolton+demoresellermanager@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/23/25', company: 'VodafoneDemo2', email: 'neil.bolton+vodafonedemo2@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/23/25', company: 'VodafoneDemo1', email: 'neil.bolton+vodafonedemo1@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/14/25', company: 'MMDemo3', email: 'neil.bolton+mmdemo3@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/14/25', company: 'MMDemo2', email: 'neil.bolton+mmdemo2@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/14/25', company: 'MMDemo1', email: 'neil.bolton+mmdemo1@appdirect.com' },
  { name: 'Suresh MM', createdOn: '10/13/25', company: 'Appdirect', email: 'suresh.jambhalkar+mm@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/08/25', company: 'Telus Demo', email: 'neil.bolton+telusmcademo@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/06/25', company: 'VodafoneMCADemo2', email: 'neil.bolton+vodafonemcademo2@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/06/25', company: 'VodafoneMCADemo2', email: 'neil.bolton+vodafonemcademo1@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/06/25', company: 'VodafoneMCADemo', email: 'neil.bolton+vodafonemcademo@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/06/25', company: 'CancomMCADemo3', email: 'neil.bolton+cancommcademo3@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/06/25', company: 'CancomMCADemo2', email: 'neil.bolton+cancomdemo2@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/06/25', company: 'CancomMCADemo', email: 'neil.bolton+cancommcademo@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '09/25/25', company: 'SCMCAdemo', email: 'bezaqdemo+scmcademo@gmail.com' },
];

export const OperationsUsers = () => {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      cell: (row: UserRow) => (
        <Group gap="sm" wrap="nowrap">
          <span style={{ width: 8, height: 8, borderRadius: 9999, background: '#22c55e' }} />
          <Text size="sm">{row.name}</Text>
        </Group>
      ),
    },
    { accessorKey: 'createdOn', header: 'Created on', enableSorting: true },
    { accessorKey: 'company', header: 'Company', enableSorting: true },
    { accessorKey: 'email', header: 'Email' },
  ];

  return (
    <OperationsLayout>
      <main>
        <Group justify="space-between">
          <div>
            <Title order={2} fw={500}>
              Users
            </Title>
            <Text c="dimmed" size="sm">
              Marketplace users and invitations
            </Text>
          </div>
          <Button variant="secondary">New Lead or Purchase</Button>
        </Group>

        <Card>
          <Stack gap="xs">
            <Text size="sm">There are 10 pending user invitations to the marketplace.</Text>
            <Group>
              <Button variant="secondary">Manage Invitations</Button>
            </Group>
          </Stack>
        </Card>

        <Card>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={4}>Users</Title>
            </Group>
            <DataTable<UserRow> data={users} columns={columns} showSearch searchPlaceholder="Search users" />
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
    </OperationsLayout>
  );
};


