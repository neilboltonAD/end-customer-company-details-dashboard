import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { CatalogLayout } from '../components/layout/CatalogLayout';
import { ActionIcon, Badge, Card, DataTable, Inline, Menu, NumberInput, Switch, Text, Title, Button, Tooltip } from 'components/DesignSystem';

// Helper to get distributor config from localStorage
const getConfiguredDistributors = (): string[] => {
  const config = localStorage.getItem('configuredDistributors');
  if (!config) {
    // Default: all enabled
    return ['firstbase', 'tdsynnex', 'ingrammicro', 'microsoftmarketplace'];
  }
  const parsed = JSON.parse(config);
  const configured: string[] = [];
  // Check each distributor
  if (parsed.firstbase !== false) configured.push('firstbase');
  if (parsed.tdsynnex !== false) configured.push('tdsynnex');
  if (parsed.ingrammicro !== false) configured.push('ingrammicro');
  if (parsed.microsoftmarketplace !== false) configured.push('microsoftmarketplace');
  return configured;
};

type Distributor = {
  id: string;
  name: string;
  color: string;
};

const distiBadgeColor: Record<Distributor['id'], 'info' | 'success' | 'pending' | 'default'> = {
  firstbase: 'info',
  tdsynnex: 'pending',
  ingrammicro: 'default',
  microsoftmarketplace: 'info',
};

const DISTRIBUTORS: Distributor[] = [
  { id: 'firstbase', name: 'Firstbase', color: 'bg-cyan-500' },
  { id: 'tdsynnex', name: 'TD SYNNEX', color: 'bg-teal-600' },
  { id: 'ingrammicro', name: 'Ingram Micro', color: 'bg-gray-500' },
  { id: 'microsoftmarketplace', name: 'Microsoft Marketplace', color: 'bg-blue-600' },
];

// Add Disti Product Button Component
const AddDistiProductButton = () => {
  const navigate = useNavigate();
  const [configuredIds, setConfiguredIds] = useState<string[]>([]);

  // Check configured distributors on mount and when dropdown is shown
  useEffect(() => {
    setConfiguredIds(getConfiguredDistributors());
  }, []);

  // Listen for storage changes (from demo toggle)
  useEffect(() => {
    const handleStorageChange = () => {
      setConfiguredIds(getConfiguredDistributors());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const configuredDistis = DISTRIBUTORS.filter(d => configuredIds.includes(d.id));

  const handleClick = () => {
    if (configuredDistis.length === 0) {
      setTimeout(() => {
        navigate('/settings/vendor-integrations');
      }, 2000);
    } else if (configuredDistis.length === 1) {
      navigate(`/products/find?distributor=${configuredDistis[0].id}`);
    }
  };

  const handleSelectDisti = (distiId: string) => {
    navigate(`/products/find?distributor=${distiId}`);
  };

  if (configuredDistis.length === 0) {
    return (
      <Tooltip
        label={
          <Inline gap="sm" align="flex-start">
            <AlertCircle size={18} />
            <div>
              <Text fw={600} size="sm">
                No Distributor Configured
              </Text>
              <Text size="sm" c="dimmed">
                You need a Disti connection. Click to open Vendor Integrations.
              </Text>
            </div>
          </Inline>
        }
        position="bottom-end"
        openDelay={100}
      >
        <Button variant="default" onClick={handleClick}>
          Add Disti Product
        </Button>
      </Tooltip>
    );
  }

  if (configuredDistis.length === 1) {
    return (
      <Button variant="default" onClick={handleClick}>
        Add Disti Product
      </Button>
    );
  }

  return (
    <Menu
      trigger={
        <Button variant="default" rightSection={<ChevronDown size={16} />}>
          Add Disti Product
        </Button>
      }
      sections={[
        {
          title: 'Distributors',
          items: configuredDistis.map((d) => ({
            id: d.id,
            label: d.name,
            leftSection: <Badge color={distiBadgeColor[d.id]} variant="outline" />,
            onClick: () => handleSelectDisti(d.id),
          })),
        },
      ]}
      width={260}
      position="bottom-end"
    />
  );
};

// Status Badge Component
const StatusBadge = ({ published }: { published: boolean }) => (
  <Inline gap="xs">
    <Badge color={published ? 'success' : 'default'} variant="outline">
      {published ? 'Published' : 'Not Published'}
    </Badge>
  </Inline>
);

// Product placeholder images (inline SVG icons)
const ProductImages = {
  rack: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-gray-7)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-gray-3)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 6h14M5 15h14" />
      </svg>
    </div>
  ),
  cable: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-pink-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-pink-6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  ),
  power: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-yellow-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-yellow-7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  ),
  monitor: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-gray-1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-gray-6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
  ),
  inverter: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-green-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-green-7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  ),
  phone: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-grape-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-grape-7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    </div>
  ),
  adobe: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-red-6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>Pr</span>
    </div>
  ),
  dimension: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-teal-6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>Dn</span>
    </div>
  ),
  adobeDimension: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-grape-6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>Dn</span>
    </div>
  ),
  indesign: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-pink-6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>Id</span>
    </div>
  ),
};

type StagingRowData = {
  name: string;
  vendor: string;
  productId: string;
  isStaging?: boolean;
  published: boolean;
  profile: string;
  imageComponent?: React.ReactNode;
};

// Sample product data
const products: StagingRowData[] = [
  {
    name: '2U 19IN 2 POST NETWORK RACK SHELF',
    vendor: 'DISTI',
    productId: '646355',
    published: true,
    profile: '22%',
    imageComponent: ProductImages.rack,
  },
  {
    name: '7FT PINK SLIM CAT6 ETHERNET CABLE, SNAGLESS, 100W POE, UTP, LSZH, 28AWG BARE COP',
    vendor: 'DISTI',
    productId: '646262',
    published: true,
    profile: '22%',
    imageComponent: ProductImages.cable,
  },
  {
    name: '1.5M C14/C15 PWR CBL 250V',
    vendor: 'DISTI',
    productId: '646260',
    published: true,
    profile: '18%',
    imageComponent: ProductImages.power,
  },
  {
    name: 'Dimension for teams - Multiple Platforms - Multi NorthAmerican Language',
    vendor: 'DISTI',
    productId: '646250',
    published: true,
    profile: '18%',
    imageComponent: ProductImages.dimension,
  },
  {
    name: 'Adobe Dimension for enterprise - Multiple Platforms - Multi NorthAmerican Language',
    vendor: 'DISTI',
    productId: '646248',
    isStaging: true,
    published: false,
    profile: '18%',
    imageComponent: ProductImages.adobeDimension,
  },
  {
    name: 'Single Monitor Desk Mount',
    vendor: 'DISTI',
    productId: '646247',
    published: true,
    profile: '22%',
    imageComponent: ProductImages.monitor,
  },
  {
    name: 'IT SERIES PURE SINE WAVE POWER INVERTER WITH 12VDC INPUT & 3000W AC OUTPUT',
    vendor: 'DISTI',
    productId: '646195',
    published: true,
    profile: '18%',
    imageComponent: ProductImages.inverter,
  },
  {
    name: 'FANVIL X7C ENTERPRISE VOIP PHONE, 5-INCH COLOR TOUCH SCREEN, 20 SIP LINES, DUAL-',
    vendor: 'DISTI',
    productId: '646193',
    published: true,
    profile: '18%',
    imageComponent: ProductImages.phone,
  },
  {
    name: 'Premiere Pro for teams - Multiple Platforms - Multi NorthAmerican Language',
    vendor: 'DISTI',
    productId: '646191',
    published: true,
    profile: '18%',
    imageComponent: ProductImages.adobe,
  },
  {
    name: 'InDesign Server for enterprise - Multiple Platforms (PREMIUM ONLINE) - Multi NorthAmerican Language',
    vendor: 'DISTI',
    productId: '646189',
    isStaging: true,
    published: false,
    profile: '18%',
    imageComponent: ProductImages.indesign,
  },
];

// Helper to set all distributors enabled/disabled
const setAllDistisConfig = (enabled: boolean) => {
  const config = {
    firstbase: enabled,
    tdsynnex: enabled,
    ingrammicro: enabled,
    microsoftmarketplace: enabled,
  };
  localStorage.setItem('configuredDistributors', JSON.stringify(config));
};

// Check if all distis are enabled
const areAllDistisEnabled = (): boolean => {
  const config = localStorage.getItem('configuredDistributors');
  if (!config) return true;
  const parsed = JSON.parse(config);
  return parsed.firstbase !== false && parsed.tdsynnex !== false && parsed.ingrammicro !== false && parsed.microsoftmarketplace !== false;
};

export const StagingCatalog = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [allDistisEnabled, setAllDistisEnabled] = useState(true);
  const totalProducts = 4278;
  const productsPerPage = 10;

  // Load demo state on mount
  useEffect(() => {
    setAllDistisEnabled(areAllDistisEnabled());
  }, []);

  // Handle demo toggle
  const handleDemoToggleAll = () => {
    const newState = !allDistisEnabled;
    setAllDistisEnabled(newState);
    setAllDistisConfig(newState);
    // Force re-render of AddDistiProductButton by updating its state
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <CatalogLayout>
      <main>
        <Inline justify="space-between">
          <div>
            <Title order={2} fw={500}>
              Staging Catalog
            </Title>
            <Text c="dimmed" size="sm">
              Add, review, and publish products from distributors and the network catalog.
            </Text>
          </div>
          <Inline gap="sm">
            <Button variant="default">Create Product</Button>
            <Button variant="secondary" onClick={() => navigate('/products/network')}>
              Add Network Product
            </Button>
            {/* TODO: Convert AddDistiProductButton UI to DS (dropdown + tooltip) */}
            <AddDistiProductButton />
          </Inline>
        </Inline>

          {/* Demo Toggle Panel */}
        <Card>
          <Inline justify="space-between" align="center">
            <Inline gap="sm" align="center">
              <Badge color="pending" variant="outline">
                Demo
              </Badge>
              <div>
                <Text fw={600} size="sm">
                  Demo Mode: All Disti Connections
                </Text>
                <Text c="dimmed" size="xs">
                  Toggle off to simulate no distributors configured.
                </Text>
              </div>
            </Inline>
            <Switch checked={allDistisEnabled} onChange={handleDemoToggleAll} />
          </Inline>
        </Card>

          {/* Product Table */}
        <Card>
          <DataTable
            data={products}
            columns={[
              {
                accessorKey: 'name',
                header: 'Application',
                enableSorting: true,
                cell: (row) => (
                  <Inline gap="sm">
                    <span style={{ display: 'inline-flex', opacity: 0.35 }}>
                      <Star size={18} />
                    </span>
                    <span style={{ width: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      {row.imageComponent || <Star size={18} />}
                    </span>
                    <div>
                      <Text fw={600} size="sm">
                        {row.name}
                      </Text>
                      <Text c="dimmed" size="xs">
                        {row.vendor}
                      </Text>
                      <Text c="dimmed" size="xs">
                        {(row.isStaging ? 'Staging ID' : 'Product ID') + ': ' + row.productId}
                      </Text>
                    </div>
                  </Inline>
                ),
              },
              {
                accessorKey: 'published',
                header: 'Status',
                enableSorting: true,
                cell: (row) => <StatusBadge published={row.published} />,
              },
              {
                accessorKey: 'profile',
                header: 'Profile',
                enableSorting: true,
                cell: (row) => (
                  <Text size="sm" c="dimmed">
                    {row.profile}
                  </Text>
                ),
              },
              {
                accessorKey: 'actions',
                header: '',
                enableSorting: false,
                align: 'right',
                cell: () => (
                  <Inline gap="xs" justify="flex-end">
                    <Button variant="link" rightSection={<ChevronDown size={16} />} leftSection={<Settings size={16} />}>
                      Actions
                    </Button>
                  </Inline>
                ),
              },
            ]}
            minWidth={980}
            showSearch
            searchPlaceholder="Search product names and IDs"
            emptyMessage="No products found."
          />

          <Inline justify="flex-end" align="center" mt="md">
            <Text size="sm" c="dimmed">
              1-{productsPerPage} of {totalProducts.toLocaleString()}
            </Text>
            <Inline gap="xs" align="center">
              <Button variant="default" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                <ChevronLeft size={18} />
              </Button>
              <NumberInput
                value={currentPage}
                onChange={(v) => setCurrentPage(Number(v) || 1)}
                min={1}
                step={1}
                clampBehavior="strict"
                w={110}
              />
              <Button variant="default" onClick={() => setCurrentPage(currentPage + 1)}>
                <ChevronRight size={18} />
              </Button>
            </Inline>
          </Inline>
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
    </CatalogLayout>
  );
};

