import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { Button, Group, Modal, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { disconnectPartnerCenter, getPartnerCenterConnectUrl, getPartnerCenterHealth } from '../api/partnerCenter';
import {
  clearPartnerCenterConnectorConfig,
  loadPartnerCenterConnectorConfig,
  savePartnerCenterConnectorConfig,
} from '../utils/partnerCenterConnectorConfig';
import {
  clearPartnerCenterSessionAuth,
} from '../auth/msalPartnerCenter';

export const MicrosoftOnboarding = () => {
  const navigate = useNavigate();

  const [hasSavedConfig, setHasSavedConfig] = useState<boolean>(Boolean(loadPartnerCenterConnectorConfig()));

  const [authorizeOpen, setAuthorizeOpen] = useState(false);
  const [tenantId, setTenantId] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestOk, setLastTestOk] = useState<boolean | null>(null);
  const [testOutput, setTestOutput] = useState<string>('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleAuthorize = () => {
    setAuthorizeOpen(true);
  };

  // When opening the modal, populate fields from saved config (if present).
  useEffect(() => {
    if (!authorizeOpen) return;
    const cfg = loadPartnerCenterConnectorConfig();
    setTenantId(cfg?.tenantId || '');
    setClientId(cfg?.clientId || '');
    setClientSecret(cfg?.clientSecret || '');
  }, [authorizeOpen]);

  const handleAddResellerAccount = () => {
    // Handle adding a new reseller account
    console.log('Add Reseller Account clicked');
  };

  return (
    <PageLayout title="Microsoft Onboarding" activeItem="Vendor Integrations">
      <div className="max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/settings/vendor-integrations')}
          className="flex items-center text-sm text-teal-700 hover:text-teal-800 mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Microsoft Onboarding</h1>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Use this settings page to configure your marketplace with Microsoft. When you have authorized with Microsoft, and configured the
          countries where you are licensed to sell through the CSP program, you will be able to publish Microsoft products to your marketplace
          and transact with customers. For more information, see{' '}
          <a 
            href="https://docs.microsoft.com/partner-center" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-teal-700 hover:text-teal-800 hover:underline"
          >
            Integrate your marketplace with Microsoft
          </a>
          .
        </p>

        {/* Microsoft Authorization Card */}
        <div className="border border-gray-200 rounded mb-8">
          {/* Card Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              MICROSOFT AUTHORIZATION
            </h2>
          </div>

          {/* Card Content */}
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              To start the process for onboarding Microsoft products, select "Authorize" below. When you click the button you will be redirected
              to a Microsoft website to authorize the marketplace to connect with Microsoft to transact on your behalf.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAuthorize}
                className="px-4 py-2 bg-teal-700 text-white text-sm font-medium rounded hover:bg-teal-800 transition-colors"
              >
                Authorize
              </button>
              {hasSavedConfig && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
                  Connector configured
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Add Reseller Account Section */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          If you have multiple Microsoft reseller tenants you can select the "Add Reseller Account" button below to create a new onboarding form
          for this tenant. This will be used to configure and authorize the marketplace to connect with the additional Microsoft reseller tenant. The
          countries you add to this account should reflect the regions that the new reseller tenant can operate in.
        </p>

        <button
          onClick={handleAddResellerAccount}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
        >
          Add Reseller Account
        </button>
      </div>

      <Modal
        opened={authorizeOpen}
        onClose={() => setAuthorizeOpen(false)}
        title="Microsoft Partner Center Connector Credentials"
        size="lg"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Enter the Entra app credentials used to connect to Microsoft Partner Center. You can test the credentials before saving.
          </Text>

          <Text size="xs" c="dimmed">
            Note: In this demo, credentials are saved in your browser (localStorage). In production, these should be stored server-side and never
            exposed to the client.
          </Text>

          <div className="border border-gray-200 rounded p-3 bg-gray-50">
            <Group justify="space-between" align="center">
              <div>
                <Text size="sm" fw={600}>Connect to Microsoft (App+User + MFA)</Text>
                <Text size="xs" c="dimmed">
                  This opens Microsoft sign-in and connects your configured web application to Partner Center.
                </Text>
              </div>
              <Group>
                <Button
                  variant="light"
                  onClick={async () => {
                    if (isSigningIn) return;
                    setIsSigningIn(true);
                    try {
                      // Local dev server handles OAuth connect.
                      window.location.href = getPartnerCenterConnectUrl();
                    } catch (e: any) {
                      const msg = e?.message || 'Unable to sign in.';
                      notifications.show({ title: 'Sign-in failed', message: msg, color: 'red' });
                    } finally {
                      setIsSigningIn(false);
                    }
                  }}
                  disabled={isSigningIn}
                >
                  Connect
                </Button>
                <Button
                  variant="default"
                  onClick={async () => {
                    try {
                      await disconnectPartnerCenter();
                    } catch {
                      // ignore; still clear local session markers
                    } finally {
                      clearPartnerCenterSessionAuth();
                      notifications.show({
                        title: 'Disconnected',
                        message: 'Connector session cleared.',
                        color: 'gray',
                      });
                    }
                  }}
                  disabled={false}
                >
                  Disconnect
                </Button>
              </Group>
            </Group>
          </div>

          <TextInput
            label="Tenant ID"
            placeholder="00000000-0000-0000-0000-000000000000"
            value={tenantId}
            onChange={(e) => setTenantId(e.currentTarget.value)}
          />
          <TextInput
            label="Client ID (Application ID)"
            placeholder="00000000-0000-0000-0000-000000000000"
            value={clientId}
            onChange={(e) => setClientId(e.currentTarget.value)}
          />
          <PasswordInput
            label="Client Secret (Value)"
            placeholder="paste secret value"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.currentTarget.value)}
          />

          {lastTestOk !== null && (
            <Text size="sm" c={lastTestOk ? 'green' : 'red'}>
              {lastTestOk ? 'Connection test succeeded.' : 'Connection test failed. Check credentials and Partner Center permissions.'}
            </Text>
          )}

          {testOutput && (
            <div className="border border-gray-200 rounded bg-gray-50 p-3">
              <Text size="xs" fw={600} mb={6}>
                Test output (first 10 customers)
              </Text>
              <pre className="text-xs text-gray-800 whitespace-pre-wrap max-h-56 overflow-auto">
                {testOutput}
              </pre>
            </div>
          )}

          <Group justify="space-between">
            <Button
              variant="default"
              onClick={() => {
                clearPartnerCenterConnectorConfig();
                notifications.show({ title: 'Cleared', message: 'Saved connector credentials cleared (demo).', color: 'gray' });
                setLastTestOk(null);
                setHasSavedConfig(false);
              }}
            >
              Clear saved
            </Button>

            <Group>
              <Button
                variant="light"
                loading={isTesting}
                onClick={async () => {
                  setIsTesting(true);
                  setLastTestOk(null);
                  setTestOutput('');
                  try {
                    const res = await getPartnerCenterHealth();
                    setLastTestOk(Boolean(res.ok));
                    // Always show verbose output so failures are diagnosable.
                    setTestOutput(JSON.stringify(res, null, 2));
                    notifications.show({
                      title: res.ok ? 'Test succeeded' : 'Test failed',
                      message: res.ok
                        ? 'Partner Center connector is healthy.'
                        : res.error ||
                          `Partner Center test failed${res.partnerCenter?.status ? ` (HTTP ${res.partnerCenter.status})` : ''}.`,
                      color: res.ok ? 'green' : 'red',
                    });
                  } catch (e: any) {
                    setLastTestOk(false);
                    setTestOutput(e?.message || 'Failed to run connector test.');
                    notifications.show({
                      title: 'Test error',
                      message: e?.message || 'Failed to run connector test.',
                      color: 'red',
                    });
                  } finally {
                    setIsTesting(false);
                  }
                }}
                disabled={false}
              >
                Test
              </Button>
              <Button
                onClick={() => {
                  savePartnerCenterConnectorConfig({
                    tenantId: tenantId.trim(),
                    clientId: clientId.trim(),
                    clientSecret: clientSecret,
                  });
                  notifications.show({ title: 'Saved', message: 'Connector credentials saved (demo).', color: 'blue' });
                  setHasSavedConfig(true);
                  setAuthorizeOpen(false);
                }}
                disabled={!tenantId.trim() || !clientId.trim() || !clientSecret}
              >
                Save
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>
    </PageLayout>
  );
};

