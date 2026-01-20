import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { DistiPriceSyncPanel } from '../components/company/DistiPriceSyncPanel';
import { ActionIcon, Button, Card, Stack, Text, Title } from 'components/DesignSystem';

// Sidebar Section Component
const SidebarSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Stack gap="xs" style={{ marginBottom: 24 }}>
    <Text size="xs" fw={800} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: 0.6, paddingLeft: 16, paddingRight: 16 }}>
      {title}
    </Text>
    <Stack gap={2}>{children}</Stack>
  </Stack>
);

// Sidebar Item Component
const SidebarItem = ({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <Button
    variant={active ? 'primary' : 'link'}
    fullWidth
    onClick={onClick}
    style={{ justifyContent: 'flex-start', paddingLeft: 16 }}
  >
    {label}
  </Button>
);

export const PriceSyncTool = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--mantine-color-gray-0)' }}>
      <TopNavbar />

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{ width: 224, background: 'white', minHeight: 'calc(100vh - 56px)', borderRight: '1px solid var(--mantine-color-gray-2)' }}>
          <div style={{ paddingTop: 16, paddingBottom: 16 }}>
            <SidebarSection title="Catalog">
              <SidebarItem label="Production Catalog" onClick={() => navigate('/products')} />
              <SidebarItem label="Staging Catalog" onClick={() => navigate('/products/staging')} />
              <SidebarItem label="Product Uploader" />
            </SidebarSection>

            <SidebarSection title="Import Products">
              <SidebarItem label="Find & Import Distributor Products" onClick={() => navigate('/products/find')} />
            </SidebarSection>

            <SidebarSection title="Price Management">
              <SidebarItem label="Price Books" />
              <SidebarItem label="Discounts" />
              <SidebarItem label="Disti Price Sync" active />
            </SidebarSection>

            <SidebarSection title="Promotions">
              <SidebarItem label="Promotional Products" />
              <SidebarItem label="Merchandising Options" />
            </SidebarSection>

            <SidebarSection title="Groups">
              <SidebarItem label="Product Groups" />
              <SidebarItem label="Segments" />
            </SidebarSection>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: 24 }}>
          <Card>
            <Stack gap={2}>
              <Title order={2} fw={500}>
                Disti Price Sync
              </Title>
              <Text size="sm" c="dimmed">
                Review and sync distributor pricing across the marketplace
              </Text>
            </Stack>
          </Card>

          <DistiPriceSyncPanel />
        </main>
      </div>

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
    </div>
  );
};
