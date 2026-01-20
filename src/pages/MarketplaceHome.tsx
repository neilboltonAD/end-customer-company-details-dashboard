import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Layers,
  Users,
  Building2,
  Download,
  Settings,
  Puzzle,
  Clock,
  TrendingDown,
  TrendingUp,
  BarChart3,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import { CatalogLayout } from '../components/layout/CatalogLayout';
import { ActionIcon, Badge, Button, Card, Inline, Select, Stack, Text, Title, Tooltip } from 'components/DesignSystem';

function iconBgColor(colorClass: string) {
  switch (colorClass) {
    case 'bg-red-500':
      return 'var(--mantine-color-red-6)';
    case 'bg-green-500':
      return 'var(--mantine-color-green-6)';
    case 'bg-purple-500':
      return 'var(--mantine-color-violet-6)';
    case 'bg-pink-500':
      return 'var(--mantine-color-pink-6)';
    default:
      return 'var(--mantine-color-blue-6)';
  }
}

// Quick Link Item Component
const QuickLinkItem = ({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) => (
  <Card interactive>
    <Inline gap="sm" align="center" wrap="nowrap">
      <div
        style={{
          padding: 8,
          borderRadius: 8,
          background: iconBgColor(color),
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={16} />
      </div>
      <Text size="sm">{label}</Text>
    </Inline>
  </Card>
);

// Metric Card Component
const MetricCard = ({
  value,
  label,
  change,
  isPositive,
}: {
  value: string;
  label: string;
  change: string;
  isPositive: boolean;
}) => (
  <Stack gap={4} align="center">
    <Title order={2} fw={500} m={0}>
      {value}
    </Title>
    <Text size="xs" c="dimmed">
      {label}
    </Text>
    <Inline gap={4} align="center" wrap="nowrap">
      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      <Text size="xs" fw={700} style={{ color: isPositive ? 'var(--mantine-color-green-7)' : 'var(--mantine-color-red-7)' }}>
        {change}
      </Text>
    </Inline>
  </Stack>
);

// Vendor Item Component
const VendorItem = ({
  name,
  url,
  logo,
  buttonText,
  onButtonClick,
  isNew,
}: {
  name: string;
  url: string;
  logo: React.ReactNode;
  buttonText: string;
  onButtonClick?: () => void;
  isNew?: boolean;
}) => (
  <div
    style={
      isNew
        ? {
            paddingLeft: 12,
            borderLeft: '4px solid var(--mantine-color-green-6)',
            background: 'linear-gradient(90deg, var(--mantine-color-green-0), var(--mantine-color-cyan-0))',
            borderRadius: 8,
            paddingRight: 12,
          }
        : undefined
    }
  >
    <Inline justify="space-between" align="center" wrap="nowrap" style={{ paddingTop: 8, paddingBottom: 8 }}>
      <Inline gap="sm" align="center" wrap="nowrap">
        {logo}
        <div>
          <Inline gap="xs" align="center" wrap="nowrap">
            <Text size="sm" fw={700}>
              {name}
            </Text>
            {isNew && (
              <Badge color="success" variant="filled">
                New
              </Badge>
            )}
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: 'var(--mantine-color-green-6)',
                display: 'inline-block',
              }}
            />
          </Inline>
          <Text size="xs" c="dimmed">
            {url}
          </Text>
        </div>
      </Inline>
      <Button size="xs" variant="outline" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </Inline>
  </div>
);

export const MarketplaceHome = () => {
  const navigate = useNavigate();
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(true);
  const [performanceRange, setPerformanceRange] = useState<string | null>('Trailing Week');
  const [revenueRange, setRevenueRange] = useState<string | null>('Trailing Week');

  return (
    <CatalogLayout>
      <main>
        {/* Header */}
        <Inline justify="space-between">
          <div>
            <Title order={2} fw={500}>
              Good morning, Neil!
            </Title>
            <Text c="dimmed" size="sm">
              Marketplace overview and quick actions
            </Text>
          </div>
          <Button variant="secondary" rightSection={<ChevronRight size={16} />}>
            View Store
          </Button>
        </Inline>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
            gap: 24,
            marginTop: 16,
          }}
        >
          {/* Left Column */}
          <Stack gap="lg">
            {/* Quick Links */}
            <Card>
              <Stack gap="sm">
                <Title order={4}>Quick links</Title>
                <Stack gap="xs">
                  <QuickLinkItem icon={Package} label="Create a Product" color="bg-red-500" />
                  <QuickLinkItem icon={Layers} label="Create Product Groups" color="bg-red-500" />
                  <QuickLinkItem icon={Users} label="Manage Users" color="bg-green-500" />
                  <QuickLinkItem icon={Building2} label="Manage Companies" color="bg-green-500" />
                  <QuickLinkItem icon={Download} label="Download Reports" color="bg-green-500" />
                  <QuickLinkItem icon={Settings} label="Marketplace Settings" color="bg-purple-500" />
                  <QuickLinkItem icon={Puzzle} label="Marketplace Functionality" color="bg-green-500" />
                  <QuickLinkItem icon={Clock} label="Pending Events" color="bg-pink-500" />
                </Stack>
              </Stack>
            </Card>

            {/* Import Products */}
            <Card>
              <Title order={4}>Import products and start selling</Title>
              <Stack gap={0}>
                <VendorItem
                  name="Firstbase"
                  url="firstbase.com"
                  logo={
                    <div style={{ height: 40, width: 40, background: 'var(--mantine-color-cyan-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, color: 'var(--mantine-color-cyan-7)' }} fill="currentColor">
                        <path d="M13 3L4 14h7v7l9-11h-7V3z" />
                      </svg>
                    </div>
                  }
                  buttonText="Edit Credentials"
                  onButtonClick={() => navigate('/integrations/firstbase')}
                />
                <VendorItem
                  name="TD SYNNEX"
                  url="tdsynnex.com"
                  logo={
                    <div style={{ height: 40, width: 40, background: 'var(--mantine-color-teal-6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>TD</span>
                    </div>
                  }
                  buttonText="Edit Credentials"
                  onButtonClick={() => navigate('/integrations/td-synnex')}
                />
                <VendorItem
                  name="Ingram Micro"
                  url="ingrammicro.com"
                  logo={
                    <div style={{ height: 40, width: 40, background: 'var(--mantine-color-gray-2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--mantine-color-gray-3)' }}>
                      <span style={{ color: 'var(--mantine-color-gray-7)', fontSize: 8, fontWeight: 800 }}>INGRAM</span>
                    </div>
                  }
                  buttonText="Edit Credentials"
                  onButtonClick={() => navigate('/integrations/ingram-micro')}
                />
                <VendorItem
                  name="Microsoft Marketplace"
                  url="azure.microsoft.com/marketplace"
                  logo={
                    <div style={{ height: 40, width: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)' }}>
                      <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, color: 'white' }} fill="currentColor">
                        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                      </svg>
                    </div>
                  }
                  buttonText="Edit Credentials"
                  onButtonClick={() => navigate('/integrations/microsoft-marketplace')}
                  isNew
                />
              </Stack>
              <Button
                variant="link"
                size="sm"
                rightSection={<ChevronRight size={16} />}
                onClick={() => navigate('/products')}
              >
                Go to Catalog
              </Button>
            </Card>

            {/* Knowledge Center */}
            <Card>
              <Title order={4}>Knowledge center</Title>
              <Inline justify="space-between" align="center" style={{ paddingTop: 8, paddingBottom: 8 }}>
                <Inline gap="sm" align="center" wrap="nowrap">
                  <div style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--mantine-color-blue-6)' }} />
                  <Text size="sm">Training</Text>
                </Inline>
                <ChevronDown size={16} color="var(--mantine-color-gray-5)" />
              </Inline>
            </Card>
          </Stack>

          {/* Right Column */}
          <Stack gap="lg">
            {/* What's New Demo Card */}
            <div
              style={{
                borderRadius: 12,
                padding: 4,
                background: 'linear-gradient(90deg, var(--mantine-color-green-6), var(--mantine-color-cyan-6), var(--mantine-color-blue-6))',
                boxShadow: 'var(--mantine-shadow-sm)',
              }}
            >
              <Card>
                <button
                  onClick={() => setIsDemoGuideOpen(!isDemoGuideOpen)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <Inline gap="sm" align="center" wrap="nowrap">
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'linear-gradient(90deg, var(--mantine-color-green-5), var(--mantine-color-cyan-5))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0,
                      }}
                    >
                      <Package size={18} />
                    </div>
                    <div>
                      <Text fw={800} size="sm">What&apos;s New — Demo Guide</Text>
                      <Text size="xs" c="dimmed">
                        {isDemoGuideOpen ? 'Click any feature below to explore' : 'Click to expand'}
                      </Text>
                    </div>
                  </Inline>

                  <Inline gap="xs" align="center" wrap="nowrap">
                    <Badge color="pending" variant="filled">Demo Mode</Badge>
                    {isDemoGuideOpen ? (
                      <ChevronUp size={18} color="var(--mantine-color-gray-5)" />
                    ) : (
                      <ChevronDown size={18} color="var(--mantine-color-gray-5)" />
                    )}
                  </Inline>
                </button>

                {isDemoGuideOpen && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: 12,
                      marginTop: 16,
                    }}
                  >
                    <Link to="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Card interactive>
                        <Inline gap="sm" align="center" wrap="nowrap">
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--mantine-color-red-0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={16} color="var(--mantine-color-red-7)" />
                          </div>
                          <div>
                            <Text fw={700} size="sm">Product Catalog</Text>
                            <Text size="xs" c="dimmed">Full catalog management</Text>
                          </div>
                        </Inline>
                      </Card>
                    </Link>

                    <Link to="/products/staging" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Card interactive>
                        <Inline gap="sm" align="center" wrap="nowrap">
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--mantine-color-orange-0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Layers size={16} color="var(--mantine-color-orange-7)" />
                          </div>
                          <div>
                            <Text fw={700} size="sm">Staging Catalog</Text>
                            <Text size="xs" c="dimmed">Add products from distributors</Text>
                          </div>
                        </Inline>
                      </Card>
                    </Link>

                    <Link to="/products/find" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Card interactive>
                        <Inline gap="sm" align="center" wrap="nowrap">
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--mantine-color-blue-0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Download size={16} color="var(--mantine-color-blue-7)" />
                          </div>
                          <div>
                            <Text fw={700} size="sm">Find &amp; Import Products</Text>
                            <Text size="xs" c="dimmed">Browse distributor catalogs</Text>
                          </div>
                        </Inline>
                      </Card>
                    </Link>

                    <Link to="/integrations/microsoft-marketplace" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Card interactive style={{ border: '1px solid var(--mantine-color-green-3)', background: 'var(--mantine-color-green-0)' }}>
                        <Inline justify="space-between" align="flex-start" wrap="nowrap">
                          <Inline gap="sm" align="center" wrap="nowrap">
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                              </svg>
                            </div>
                            <div>
                              <Text fw={700} size="sm">Microsoft Marketplace</Text>
                              <Text size="xs" c="dimmed">Live API catalog browser</Text>
                            </div>
                          </Inline>
                          <Badge size="xs" color="success" variant="filled">Featured</Badge>
                        </Inline>
                      </Card>
                    </Link>

                    <Link to="/settings/vendor-integrations" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Card interactive>
                        <Inline gap="sm" align="center" wrap="nowrap">
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--mantine-color-violet-0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Puzzle size={16} color="var(--mantine-color-violet-7)" />
                          </div>
                          <div>
                            <Text fw={700} size="sm">Vendor Integrations</Text>
                            <Text size="xs" c="dimmed">Configure distributor APIs</Text>
                          </div>
                        </Inline>
                      </Card>
                    </Link>

                    <Link to="/products/import-settings" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Card interactive>
                        <Inline gap="sm" align="center" wrap="nowrap">
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--mantine-color-green-0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Settings size={16} color="var(--mantine-color-green-7)" />
                          </div>
                          <div>
                            <Text fw={700} size="sm">Import Settings</Text>
                            <Text size="xs" c="dimmed">Per-distributor markup fees</Text>
                          </div>
                        </Inline>
                      </Card>
                    </Link>

                    <Link to="/operations/companies/demoresellercustomer1" style={{ textDecoration: 'none', color: 'inherit', gridColumn: '1 / span 2' }}>
                      <Card interactive style={{ border: '1px solid var(--mantine-color-green-3)', background: 'var(--mantine-color-green-0)' }}>
                        <Inline justify="space-between" align="center" wrap="nowrap">
                          <Inline gap="sm" align="center" wrap="nowrap">
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--mantine-color-indigo-0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Building2 size={16} color="var(--mantine-color-indigo-7)" />
                            </div>
                            <div>
                              <Text fw={700} size="sm">Company Details → Vendor Information</Text>
                              <Text size="xs" c="dimmed">Operations → Companies → Select company → Vendor Information tab</Text>
                            </div>
                          </Inline>
                          <Badge size="xs" color="success" variant="filled">Operations</Badge>
                        </Inline>
                      </Card>
                    </Link>
                  </div>
                )}
              </Card>
            </div>

            {/* Marketplace Tasks */}
            <Card>
              <Title order={4}>Marketplace tasks</Title>
              <Inline gap="md" align="flex-start" wrap="nowrap">
                <Text fw={400} size="xl">786</Text>
                <Stack gap={6}>
                  <Text size="xs" c="dimmed">Customer Purchases</Text>
                  <Text size="sm" c="dimmed">
                    Review customer purchases • There are{' '}
                    <Text span fw={800} style={{ color: 'var(--mantine-color-blue-7)' }}>
                      786 customer purchases
                    </Text>{' '}
                    pending your review.
                  </Text>
                  <Button variant="link" size="sm">Review Purchases</Button>
                </Stack>
              </Inline>
            </Card>

            {/* Performance Overview */}
            <Card>
              <Inline justify="space-between" align="center" mb="md" wrap="nowrap">
                <Title order={4}>Performance overview</Title>
                <Select
                  borderless
                  data={['Trailing Week', 'Trailing Month', 'Trailing Year']}
                  value={performanceRange}
                  onChange={setPerformanceRange}
                  size="sm"
                />
              </Inline>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 24,
                }}
              >
                <MetricCard value="$0" label="Gross Revenue" change="-100%" isPositive={false} />
                <MetricCard value="$0" label="Net Revenue" change="-100%" isPositive={false} />
                <MetricCard value="131" label="Total Orders" change="-10.3%" isPositive={false} />
                <MetricCard value="18" label="Total Signups" change="12.5%" isPositive={true} />
              </div>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <Inline justify="space-between" align="center" mb="md" wrap="nowrap">
                <Title order={4}>Revenue</Title>
                <Select
                  borderless
                  data={['Trailing Week', 'Trailing Month', 'Trailing Year']}
                  value={revenueRange}
                  onChange={setRevenueRange}
                  size="sm"
                />
              </Inline>
              <Stack gap="xs" align="center" style={{ padding: '48px 0', color: 'var(--mantine-color-gray-6)' }}>
                <BarChart3 size={40} />
                <Text fw={700} size="sm">There is no data to display here.</Text>
                <Text size="sm" c="dimmed">
                  When your marketplace has revenue, it will appear here.
                </Text>
              </Stack>
              <Inline gap="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)', paddingTop: 12 }}>
                <Button variant="link" size="sm" rightSection={<ChevronRight size={16} />}>
                  View Invoices
                </Button>
                <Button variant="link" size="sm" rightSection={<ChevronRight size={16} />}>
                  View Payments
                </Button>
              </Inline>
            </Card>

            {/* Sign ups and Orders */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 24,
              }}
            >
              <Card>
                <Inline justify="space-between" align="center" mb="sm" wrap="nowrap">
                  <Title order={4}>Sign ups</Title>
                  <Select borderless data={['Trailing Week']} value="Trailing Week" size="sm" />
                </Inline>
                <div style={{ height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mantine-color-gray-5)', fontSize: 14 }}>
                  Chart placeholder
                </div>
              </Card>
              <Card>
                <Inline justify="space-between" align="center" mb="sm" wrap="nowrap">
                  <Title order={4}>Orders</Title>
                  <Select borderless data={['Trailing Week']} value="Trailing Week" size="sm" />
                </Inline>
                <div style={{ height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mantine-color-gray-5)', fontSize: 14 }}>
                  Chart placeholder
                </div>
              </Card>
            </div>
          </Stack>
        </div>

      {/* Help Button */}
      <Tooltip label="Help">
        <ActionIcon
          size="lg"
          customFill="var(--mantine-color-blue-6)"
          customBorder="1px solid var(--mantine-color-blue-6)"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            color: 'white',
            boxShadow: 'var(--mantine-shadow-lg)',
          }}
        >
          <HelpCircle size={20} />
        </ActionIcon>
      </Tooltip>
      </main>
    </CatalogLayout>
  );
};

