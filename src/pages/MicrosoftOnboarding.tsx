import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { getPartnerCenterHealth, getPartnerCenterStatus } from '../api/partnerCenter';
import { PartnerCenterConnectorModal } from '../components/microsoft/PartnerCenterConnectorModal';
import { Badge, Button, Card, Inline, Stack, Text, Title } from 'components/DesignSystem';

export const MicrosoftOnboarding = () => {
  const navigate = useNavigate();

  const [connectorModalOpen, setConnectorModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const handleAuthorize = () => {
    setConnectorModalOpen(true);
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const status = await getPartnerCenterStatus();
        const health = await getPartnerCenterHealth();
        if (!cancelled) setIsConnected(Boolean(status.ok && health.ok));
      } catch {
        if (!cancelled) setIsConnected(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddResellerAccount = () => {
    // Handle adding a new reseller account
    console.log('Add Reseller Account clicked');
  };

  return (
    <PageLayout title="Microsoft Onboarding" activeItem="Vendor Integrations">
      <Stack gap="md" style={{ maxWidth: 900 }}>
        <Button variant="link" onClick={() => navigate('/settings/vendor-integrations')} leftIcon={<ChevronLeft size={16} />}>
          Back
        </Button>

        <Title order={2} fw={700}>
          Microsoft Onboarding
        </Title>

        <Text size="sm" c="dimmed">
          Use this settings page to configure your marketplace with Microsoft. When you have authorized with Microsoft, and configured the
          countries where you are licensed to sell through the CSP program, you will be able to publish Microsoft products to your marketplace
          and transact with customers. For more information, see{' '}
          <a
            href="https://docs.microsoft.com/partner-center"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--mantine-color-blue-7)', fontWeight: 700, textDecoration: 'none' }}
          >
            Integrate your marketplace with Microsoft <ExternalLink size={14} style={{ verticalAlign: 'middle' }} />
          </a>
          .
        </Text>

        <Card>
          <Stack gap="sm">
            <Text size="xs" fw={800} c="dimmed" style={{ textTransform: 'uppercase' }}>
              Microsoft Authorization
            </Text>

            <Text size="sm" c="dimmed">
              To start the process for onboarding Microsoft products, select “Authorize” below. When you click the button you will be redirected
              to a Microsoft website to authorize the marketplace to connect with Microsoft to transact on your behalf.
            </Text>

            <Inline gap="sm" align="center" wrap="nowrap">
              <Button onClick={handleAuthorize}>Authorize</Button>
              {isConnected && (
                <Badge size="sm" color="success" variant="outline">
                  Connected
                </Badge>
              )}
            </Inline>
          </Stack>
        </Card>

        <Text size="sm" c="dimmed">
          If you have multiple Microsoft reseller tenants you can select the “Add Reseller Account” button below to create a new onboarding form
          for this tenant. This will be used to configure and authorize the marketplace to connect with the additional Microsoft reseller tenant.
          The countries you add to this account should reflect the regions that the new reseller tenant can operate in.
        </Text>

        <Inline>
          <Button variant="danger" onClick={handleAddResellerAccount}>
            Add Reseller Account
          </Button>
        </Inline>
      </Stack>

      <PartnerCenterConnectorModal
        opened={connectorModalOpen}
        onClose={() => setConnectorModalOpen(false)}
        onStatusChange={(s) => setIsConnected(s === 'connected')}
      />
    </PageLayout>
  );
};

