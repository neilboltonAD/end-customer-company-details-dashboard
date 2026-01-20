import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Settings } from 'lucide-react';
import { Group } from '@mantine/core';
import { P2PTransfersPanel } from '../components/company/p2p';
import { OperationsLayout } from '../components/layout/OperationsLayout';
import { ActionIcon, Button, Card, Inline, Modal, SegmentedControl, Stack, Switch, Text, Title } from 'components/DesignSystem';

export const OperationsP2PTransfers = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [transferMode, setTransferMode] = useState<'Direct' | 'Indirect'>('Direct');
  const [companyCreationEnabled, setCompanyCreationEnabled] = useState(true);

  return (
    <OperationsLayout>
      <main>
        <Inline gap="xs" align="center">
          <Button variant="link" onClick={() => navigate('/operations/companies')}>
            Companies
          </Button>
          <Text size="sm" c="dimmed">/</Text>
          <Text size="sm">Microsoft</Text>
          <Text size="sm" c="dimmed">/</Text>
          <Text size="sm">Reseller: P2P Transfers</Text>
        </Inline>

        <Card>
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={2} fw={600}>
                Reseller: P2P Transfers
              </Title>
              <Text c="dimmed" size="sm">
                Marketplace-wide subscription transfers
              </Text>
            </div>
            <Button variant="secondary" leftSection={<Settings size={16} />} onClick={() => setSettingsOpen(true)}>
              Settings
            </Button>
          </Group>
        </Card>

          <P2PTransfersPanel allowOutbound={transferMode === 'Direct'} />
      </main>

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
