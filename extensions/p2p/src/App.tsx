import React from 'react';
import { Container, Alert, Center, Loader, Stack, Paper, Group, Text, Badge } from '@mantine/core';
import { AlertCircle, Building2, User } from 'lucide-react';
import { useExtensionContext } from './hooks/useExtensionContext';
import { P2PTransfersPanel } from './components/P2PTransfersPanel';
import { DemoBanner } from './components/shared/DemoBanner';

function App() {
  const { company, user, loading, error, isMarketplaceManager } = useExtensionContext();

  if (loading) {
    return (
      <Center py="xl" style={{ minHeight: 300 }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading P2P Transfers Extension...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Alert 
          icon={<AlertCircle size={16} />} 
          title="Error loading extension" 
          color="red"
        >
          {error.message}
        </Alert>
      </Container>
    );
  }

  if (!company) {
    return (
      <Container size="md" py="xl">
        <Alert 
          icon={<AlertCircle size={16} />} 
          title="Company context required" 
          color="yellow"
        >
          This extension must be viewed within a company context.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      {/* Demo Banner */}
      <DemoBanner />

      {/* Context Info Bar */}
      <Paper withBorder p="xs" mb="md" radius="md" bg="gray.0">
        <Group justify="space-between">
          <Group gap="lg">
            <Group gap="xs">
              <Building2 size={14} className="text-gray-500" />
              <Text size="sm" fw={500}>{company.name}</Text>
              <Text size="xs" c="dimmed" ff="monospace">
                {company.microsoftTenantId?.slice(0, 8)}...
              </Text>
            </Group>
            <Group gap="xs">
              <User size={14} className="text-gray-500" />
              <Text size="sm">{user?.firstName} {user?.lastName}</Text>
            </Group>
          </Group>
          <Group gap="xs">
            {isMarketplaceManager && (
              <Badge color="blue" variant="light" size="sm">
                Marketplace Manager
              </Badge>
            )}
          </Group>
        </Group>
      </Paper>

      {/* Main Panel */}
      <P2PTransfersPanel companyId={company.id} />
    </Container>
  );
}

export default App;
