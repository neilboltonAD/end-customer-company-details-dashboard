import React from 'react';
import { Container, Paper, Group, Accordion, Button, Text, Badge, Switch, Divider, Title, Stack, Space } from '@mantine/core';

const microsoftLogo = '/microsoft (1).png';

export const CompanyDetailsMantine = () => {
  return (
    <Container size="xl" py="md">
      <Title order={2} mb="md" c="gray.8">Company Details - Mantine</Title>
      <Paper withBorder radius="md" p="lg" mb="lg" bg="gray.0">
        <Group align="center" gap="lg">
          <img src={microsoftLogo} alt="Microsoft Logo" style={{ width: 64, height: 64, borderRadius: 8 }} />
          <Stack>
            <Text fw={700} fz="lg" c="gray.8">AppDirect Demonstration 5</Text>
            <Space h={4} />
            <Text fz="xs" c="gray.6">408f194e-dc4a-4a2e-ac65-d1d6b0c11a8a</Text>
          </Stack>
        </Group>
      </Paper>
      <Accordion variant="contained" radius="md" defaultValue={["tenant-info"]} multiple>
        <Accordion.Item value="tenant-info">
          <Accordion.Control>
            <Text fw={600} c="gray.7">Customer Tenant Information</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Paper withBorder radius="md" p="md" bg="gray.1">
              <Group justify="space-between" mb="sm">
                <Text fw={500} c="gray.7">Domain</Text>
                <Text c="gray.8">appdirectdemonstration5.onmicrosoft.com</Text>
              </Group>
              <Group justify="space-between" mb="sm">
                <Text fw={500} c="gray.7">Tenant ID</Text>
                <Text c="gray.8">408f194e-dc4a-4a2e-ac65-d1d6b0c11a8a</Text>
              </Group>
              <Divider my="sm" />
              <Group justify="space-between" mb="sm">
                <Text fw={500} c="gray.7">Global Admins</Text>
                <Text c="gray.8">neil.bolton@xyzcompany.com, sarah.johnson@xyzcompany.com</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500} c="gray.7">Billing Admins</Text>
                <Text c="gray.8">finance.admin@xyzcompany.com, billing.team@xyzcompany.com</Text>
              </Group>
            </Paper>
          </Accordion.Panel>
        </Accordion.Item>
        {/* Add more Accordion.Item for other sections, replicating the Microsoft section structure */}
      </Accordion>
    </Container>
  );
}; 