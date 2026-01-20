import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { HelpCircle } from 'lucide-react';
import { ActionIcon, Button, Card, Inline, Stack, Text, Title } from 'components/DesignSystem';

// Vendor data
const vendors = [
  {
    id: 'google',
    name: 'Google',
    logo: (
      <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: (
      <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
        <path fill="#F25022" d="M1 1h10v10H1z"/>
        <path fill="#00A4EF" d="M1 13h10v10H1z"/>
        <path fill="#7FBA00" d="M13 1h10v10H13z"/>
        <path fill="#FFB900" d="M13 13h10v10H13z"/>
      </svg>
    ),
    path: '/settings/vendor-integrations/microsoft',
  },
  {
    id: 'adobe',
    name: 'Adobe',
    logo: (
      <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
        <path fill="#FF0000" d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425h-3.71zm.893-17.628h5.725L14.859 22H11.19L7.316 11.459l-3.892 10.54H0L9.585 4.996h5.274z"/>
      </svg>
    ),
  },
  {
    id: 'cisco',
    name: 'Cisco',
    logo: (
      <div style={{ height: 32, width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 100 40" style={{ height: 24, width: '100%' }}>
          <g fill="#049fd9">
            <rect x="0" y="8" width="4" height="24" rx="2"/>
            <rect x="12" y="4" width="4" height="32" rx="2"/>
            <rect x="24" y="0" width="4" height="40" rx="2"/>
            <rect x="36" y="4" width="4" height="32" rx="2"/>
            <rect x="48" y="8" width="4" height="24" rx="2"/>
            <rect x="60" y="4" width="4" height="32" rx="2"/>
            <rect x="72" y="0" width="4" height="40" rx="2"/>
            <rect x="84" y="4" width="4" height="32" rx="2"/>
            <rect x="96" y="8" width="4" height="24" rx="2"/>
          </g>
        </svg>
      </div>
    ),
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    logo: (
      <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
        <path fill="#0061FF" d="M6 2L0 6l6 4-6 4 6 4 6-4-6-4 6-4-6-4zm12 0l-6 4 6 4-6 4 6 4 6-4-6-4 6-4-6-4zM6 16l6 4 6-4-6-4-6 4z"/>
      </svg>
    ),
  },
  {
    id: 'zoom',
    name: 'Zoom',
    logo: (
      <div style={{ height: 32, width: 32, background: '#2D8CFF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="white">
          <path d="M4.5 7.5v9h10.5l4.5 3v-12l-4.5 3v-3h-10.5z"/>
        </svg>
      </div>
    ),
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    logo: (
      <div style={{ height: 32, width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--mantine-color-dark-9)', borderRadius: 8, padding: '0 4px' }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: 'white', letterSpacing: -0.2 }}>aws</span>
      </div>
    ),
  },
  {
    id: 'td-synnex',
    name: 'TD SYNNEX',
    logo: (
      <div style={{ height: 40, width: 40, background: 'var(--mantine-color-teal-6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>TD</span>
      </div>
    ),
    path: '/integrations/td-synnex',
  },
  {
    id: 'ingram-micro',
    name: 'Ingram Micro',
    logo: (
      <div style={{ height: 40, width: 40, background: 'var(--mantine-color-gray-2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--mantine-color-gray-3)' }}>
        <span style={{ color: 'var(--mantine-color-gray-7)', fontSize: 8, fontWeight: 800 }}>INGRAM</span>
      </div>
    ),
    path: '/integrations/ingram-micro',
  },
  {
    id: 'firstbase',
    name: 'Firstbase',
    logo: (
      <div style={{ height: 40, width: 40, background: 'var(--mantine-color-cyan-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, color: 'var(--mantine-color-cyan-7)' }} fill="currentColor">
          <path d="M13 3L4 14h7v7l9-11h-7V3z" />
        </svg>
      </div>
    ),
    path: '/integrations/firstbase',
  },
  {
    id: 'microsoft-marketplace',
    name: 'Microsoft Marketplace',
    logo: (
      <div style={{ height: 40, width: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)' }}>
        <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, color: 'white' }} fill="currentColor">
          <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
        </svg>
      </div>
    ),
    path: '/integrations/microsoft-marketplace',
  },
];

// Vendor type
type Vendor = {
  id: string;
  name: string;
  logo: React.ReactNode;
  path?: string;
};

// Vendor Row Component
const VendorRow = ({
  name,
  logo,
  onConfigure,
}: {
  name: string;
  logo: React.ReactNode;
  onConfigure: () => void;
}) => (
  <Card interactive>
    <Inline justify="space-between" align="center" wrap="nowrap">
      <Inline gap="md" align="center" wrap="nowrap">
        <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{logo}</div>
        <Text fw={700}>{name}</Text>
      </Inline>
      <Button onClick={onConfigure}>Configure</Button>
    </Inline>
  </Card>
);

export const VendorIntegrations = () => {
  const navigate = useNavigate();

  const handleConfigure = (vendor: Vendor) => {
    if (vendor.path) {
      navigate(vendor.path);
    } else {
      // For vendors without a dedicated page yet, log to console
      console.log(`Configure ${vendor.id}`);
    }
  };

  const handleContactUs = () => {
    window.open('mailto:support@appdirect.com?subject=Vendor Integration Inquiry', '_blank');
  };

  return (
    <PageLayout title="Vendor Integrations">
      <Stack gap="md" style={{ maxWidth: 900 }}>
        <Title order={2} fw={700}>
          Vendor Integrations
        </Title>

        <Card style={{ background: 'var(--mantine-color-blue-0)', border: '1px solid var(--mantine-color-blue-2)' }}>
          <Inline justify="space-between" align="center" wrap="nowrap">
            <div>
              <Text fw={700}>Need help connecting with these leading software vendors?</Text>
              <Text size="sm" c="dimmed">
                Reach out to us if you want to partner with any of these vendors below. We can help make introductions.
              </Text>
            </div>
            <Button variant="outline" onClick={handleContactUs}>
              Contact Us
            </Button>
          </Inline>
        </Card>

        <Stack gap="sm">
          {(vendors as Vendor[]).map((vendor) => (
            <VendorRow key={vendor.id} name={vendor.name} logo={vendor.logo} onConfigure={() => handleConfigure(vendor)} />
          ))}
        </Stack>
      </Stack>

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
    </PageLayout>
  );
};

