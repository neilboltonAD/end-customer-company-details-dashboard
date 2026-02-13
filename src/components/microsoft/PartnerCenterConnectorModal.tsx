import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Divider, Group, Modal, Paper, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  disconnectPartnerCenter,
  getPartnerCenterConnectUrl,
  getPartnerCenterHealth,
  getPartnerCenterStatus,
  getAzureStatus,
  getAzureHealth,
  type PartnerCenterHealth,
  type PartnerCenterStatus,
  type AzureStatus,
  type AzureHealth,
} from '../../api/partnerCenter';

export type PartnerCenterConnectorModalProps = {
  opened: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
  /**
   * Called whenever we refresh and compute the overall status used by top-level indicators.
   */
  onStatusChange?: (status: 'unknown' | 'connected' | 'disconnected') => void;
};

export function PartnerCenterConnectorModal(props: PartnerCenterConnectorModalProps) {
  const { opened, onClose, onOpenSettings, onStatusChange } = props;

  const [connectorStatus, setConnectorStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [isSyncingConnector, setIsSyncingConnector] = useState(false);
  const [connectorStatusJson, setConnectorStatusJson] = useState<PartnerCenterStatus | null>(null);
  const [connectorHealthJson, setConnectorHealthJson] = useState<PartnerCenterHealth | null>(null);
  const [connectorLastError, setConnectorLastError] = useState<string | null>(null);

  // Azure connector state
  const [azureStatus, setAzureStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [azureStatusJson, setAzureStatusJson] = useState<AzureStatus | null>(null);
  const [azureHealthJson, setAzureHealthJson] = useState<AzureHealth | null>(null);

  const statusBadgeColor = useMemo(() => {
    if (connectorStatus === 'connected') return 'green';
    if (connectorStatus === 'disconnected') return 'red';
    return 'gray';
  }, [connectorStatus]);

  const azureBadgeColor = useMemo(() => {
    if (azureStatus === 'connected') return 'green';
    if (azureStatus === 'disconnected') return 'red';
    return 'gray';
  }, [azureStatus]);

  const refresh = useCallback(async (opts?: { showToast?: boolean }) => {
    setIsSyncingConnector(true);
    setConnectorLastError(null);
    try {
      // Fetch Partner Center status
      const status = await getPartnerCenterStatus();
      const health = await getPartnerCenterHealth();
      setConnectorStatusJson(status);
      setConnectorHealthJson(health);
      const computed: 'connected' | 'disconnected' = status.ok && health.ok ? 'connected' : 'disconnected';
      setConnectorStatus(computed);
      onStatusChange?.(computed);

      // Fetch Azure status
      try {
        const azStatus = await getAzureStatus();
        const azHealth = await getAzureHealth();
        setAzureStatusJson(azStatus);
        setAzureHealthJson(azHealth);
        const azComputed: 'connected' | 'disconnected' = azStatus.ok && azHealth.ok ? 'connected' : 'disconnected';
        setAzureStatus(azComputed);
      } catch (azErr: any) {
        console.error('Azure status check failed:', azErr);
        setAzureStatus('disconnected');
        setAzureStatusJson(null);
        setAzureHealthJson(null);
      }

      if (opts?.showToast) {
        notifications.show({
          title: computed === 'connected' ? 'Connector connected' : 'Connector not connected',
          message:
            computed === 'connected'
              ? 'Partner Center connector is healthy.'
              : health.error || status.error || 'Partner Center health check failed.',
          color: computed === 'connected' ? 'green' : 'red',
        });
      }
    } catch (e: any) {
      setConnectorStatus('disconnected');
      setAzureStatus('disconnected');
      onStatusChange?.('disconnected');
      setConnectorLastError(e?.message || 'Failed to reach connector endpoints.');
      if (opts?.showToast) {
        notifications.show({
          title: 'Connector error',
          message: e?.message || 'Failed to reach connector endpoints.',
          color: 'red',
        });
      }
    } finally {
      setIsSyncingConnector(false);
    }
  }, [onStatusChange]);

  // When the modal is opened, refresh immediately.
  useEffect(() => {
    if (!opened) return;
    refresh();
  }, [opened, refresh]);

  return (
    <Modal opened={opened} onClose={onClose} title="Partner Center Connector" size="lg" centered>
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Text fw={600}>Live status</Text>
            <Badge variant="light" color={statusBadgeColor}>
              {connectorStatus === 'connected'
                ? 'Connected'
                : connectorStatus === 'disconnected'
                  ? 'Not connected'
                  : 'Unknown'}
            </Badge>
          </Group>
          <Group gap="xs">
            <Button variant="light" onClick={() => refresh({ showToast: true })} loading={isSyncingConnector}>
              Check now
            </Button>
            {onOpenSettings && (
              <Button variant="default" onClick={onOpenSettings}>
                Open settings
              </Button>
            )}
          </Group>
        </Group>

        {connectorLastError && (
          <Text c="red" size="sm">
            {connectorLastError}
          </Text>
        )}

        <Group justify="flex-end" gap="xs">
          <Button
            variant="light"
            onClick={() => {
              window.location.href = getPartnerCenterConnectUrl();
            }}
          >
            Connect
          </Button>
          <Button
            variant="light"
            color="red"
            onClick={async () => {
              try {
                await disconnectPartnerCenter();
              } catch (e: any) {
                notifications.show({
                  title: 'Disconnect failed',
                  message: e?.message || 'Failed to disconnect.',
                  color: 'red',
                });
              } finally {
                await refresh({ showToast: true });
              }
            }}
          >
            Disconnect
          </Button>
        </Group>

        {/* Partner Center Section */}
        <Title order={5} c="dimmed">Partner Center</Title>
        
        <Paper withBorder radius="sm" p="sm" style={{ background: 'var(--mantine-color-gray-0)' }}>
          <Text size="xs" fw={600} mb={6}>
            /api/partner-center/status
          </Text>
          <pre style={{ fontSize: 12, color: 'var(--mantine-color-gray-8)', whiteSpace: 'pre-wrap', maxHeight: 180, overflow: 'auto', margin: 0 }}>
            {connectorStatusJson ? JSON.stringify(connectorStatusJson, null, 2) : '—'}
          </pre>
        </Paper>

        <Paper withBorder radius="sm" p="sm" style={{ background: 'var(--mantine-color-gray-0)' }}>
          <Text size="xs" fw={600} mb={6}>
            /api/partner-center/health
          </Text>
          <pre style={{ fontSize: 12, color: 'var(--mantine-color-gray-8)', whiteSpace: 'pre-wrap', maxHeight: 180, overflow: 'auto', margin: 0 }}>
            {connectorHealthJson ? JSON.stringify(connectorHealthJson, null, 2) : '—'}
          </pre>
        </Paper>

        <Divider my="sm" />

        {/* Azure Section */}
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Title order={5} c="dimmed">Azure Management</Title>
            <Badge variant="light" color={azureBadgeColor} size="sm">
              {azureStatus === 'connected'
                ? 'Connected'
                : azureStatus === 'disconnected'
                  ? 'Not connected'
                  : 'Unknown'}
            </Badge>
          </Group>
        </Group>

        <Paper withBorder radius="sm" p="sm" style={{ background: 'var(--mantine-color-gray-0)' }}>
          <Text size="xs" fw={600} mb={6}>
            /api/azure/status
          </Text>
          <pre style={{ fontSize: 12, color: 'var(--mantine-color-gray-8)', whiteSpace: 'pre-wrap', maxHeight: 180, overflow: 'auto', margin: 0 }}>
            {azureStatusJson ? JSON.stringify(azureStatusJson, null, 2) : '—'}
          </pre>
        </Paper>

        <Paper withBorder radius="sm" p="sm" style={{ background: 'var(--mantine-color-gray-0)' }}>
          <Text size="xs" fw={600} mb={6}>
            /api/azure/health
          </Text>
          <pre style={{ fontSize: 12, color: 'var(--mantine-color-gray-8)', whiteSpace: 'pre-wrap', maxHeight: 180, overflow: 'auto', margin: 0 }}>
            {azureHealthJson ? JSON.stringify(azureHealthJson, null, 2) : '—'}
          </pre>
        </Paper>
      </Stack>
    </Modal>
  );
}

