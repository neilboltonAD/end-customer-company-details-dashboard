import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, HelpCircle, Search, Copy, MoreVertical, TrendingUp, TrendingDown, Minus, DollarSign, Users, Package, Activity, Edit2, RotateCcw, Plus } from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { VendorInformation } from '../components/company/VendorInformation';
import { Toggle } from '../components/form/Toggle';
import { OperationsLayout } from '../components/layout/OperationsLayout';
import { ExpandableSection } from '../components/layout/ExpandableSection';
import { ActionIcon, Badge, Breadcrumb, Button, Card, ConfirmationModal, DataTable, Inline, Menu, Modal, Progress, SegmentedControl, Stack, Text, TextInput, Title, Tooltip } from 'components/DesignSystem';
import type { DataTableColumn } from 'components/DesignSystem';

// Stat Card Component
const StatCard = ({ value, label }: { value: string | number; label: string }) => (
  <div style={{ textAlign: 'center', padding: '8px 10px' }}>
    <Text size="lg" fw={400}>
      {value}
    </Text>
    <Text size="xs" c="dimmed">
      {label}
    </Text>
  </div>
);

// Tab Component
const Tab = ({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) => (
  <button
    onClick={onClick}
    style={{
      padding: '10px 12px',
      fontSize: 14,
      fontWeight: 600,
      borderBottom: '2px solid',
      borderBottomColor: active ? 'var(--mantine-color-blue-6)' : 'transparent',
      color: active ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-gray-7)',
      background: 'transparent',
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);

// Users Tab Content
const UsersTabContent = () => {
  type UserRow = {
    status: 'Enabled' | 'Disabled';
    name: string;
    role: string;
    email: string;
    apps: number;
  };

  const users: UserRow[] = [
    {
      status: 'Enabled',
      name: 'Neil Bolton',
      role: 'Billing Admin, Company Admin',
      email: 'neil.bolton+demoresellercustomer1@appdirect.com',
      apps: 1,
    },
  ];

  type GroupRow = { name: string; users: number };
  const groups: GroupRow[] = [
    { name: 'Everyone', users: 1 },
    { name: 'Company Admins', users: 1 },
    { name: 'Billing Admins', users: 1 },
  ];

  return (
    <Stack gap="xl" mt="md">
      <div>
        <Title order={4}>Users</Title>
        <Text c="dimmed" size="sm">
          Company users and access
        </Text>
      </div>

      <Card>
        <DataTable<UserRow>
          data={users}
          columns={[
            {
              accessorKey: 'status',
              header: 'Status',
              enableSorting: true,
              cell: (row) => (
                <Inline gap="xs" wrap="nowrap">
                  <Badge color={row.status === 'Enabled' ? 'success' : 'danger'} variant="filled" size="sm">
                    {row.status}
                  </Badge>
                </Inline>
              ),
            },
            {
              accessorKey: 'name',
              header: 'Name',
              enableSorting: true,
              cell: (row) => (
                <div>
                  <Text size="sm">{row.name}</Text>
                  <Text size="xs" c="dimmed">
                    {row.role}
                  </Text>
                </div>
              ),
            },
            { accessorKey: 'email', header: 'Email' },
            { accessorKey: 'apps', header: 'Apps', enableSorting: true, align: 'right' },
          ]}
          showSearch
          searchPlaceholder="Search users"
        />
      </Card>

      <div>
        <Inline gap="xs" wrap="nowrap">
          <Title order={4}>Synced Users</Title>
          <Tooltip label="Synced users will appear here once a sync has run.">
            <ActionIcon size="sm">
              <HelpCircle size={14} />
            </ActionIcon>
          </Tooltip>
        </Inline>
      </div>

      <Card>
        <Text c="dimmed" size="sm" ta="center" py="xl">
          Once a user is synced, the user will be displayed here.
        </Text>
      </Card>

      <div>
        <Title order={4}>Groups</Title>
      </div>

      <Card>
        <DataTable<GroupRow>
          data={groups}
          columns={[
            { accessorKey: 'name', header: 'Name', enableSorting: true },
            { accessorKey: 'users', header: 'Number of Users', enableSorting: true, align: 'right' },
          ]}
          showSearch
          searchPlaceholder="Search groups"
          emptyMessage="No groups"
        />
      </Card>
    </Stack>
  );
};

// Placeholder Tab Content
const PlaceholderTabContent = ({ tabName }: { tabName: string }) => (
  <Card>
    <Text c="dimmed" ta="center" py="xl">
      {tabName} content will appear here.
    </Text>
  </Card>
);

// Reseller Sidebar Component
const ResellerSidebar = ({ activeItem }: { activeItem: string }) => {
  const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 8 }}>
      <div
        style={{
          padding: '8px 12px',
          background: 'var(--mantine-color-gray-0)',
          borderBottom: '1px solid var(--mantine-color-gray-2)',
        }}
      >
        <Text
          size="xs"
          fw={800}
          style={{
            color: 'var(--mantine-color-gray-6)',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Text>
      </div>
      <Stack gap={2} style={{ padding: 8 }}>
        {children}
      </Stack>
    </Card>
  );

  const SidebarItem = ({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) => (
    <Button
      size="sm"
      fullWidth
      variant={active ? 'secondary' : 'link'}
      onClick={onClick}
      style={{ justifyContent: 'flex-start', fontWeight: active ? 800 : 600 }}
    >
      {label}
    </Button>
  );

  return (
    <div
      style={{
        width: 240,
        minHeight: 'calc(100vh - 56px)',
        borderRight: '1px solid var(--mantine-color-gray-2)',
        padding: 12,
        background: 'white',
      }}
    >
      <SidebarSection title="HOME">
        <SidebarItem label="Companies" active={activeItem === 'Companies'} />
        <SidebarItem label="Users" active={activeItem === 'Users'} />
        <SidebarItem label="Leads" active={activeItem === 'Leads'} />
        <SidebarItem label="Quotes" active={activeItem === 'Quotes'} />
        <SidebarItem label="Orders" active={activeItem === 'Orders'} />
        <SidebarItem label="Logs" active={activeItem === 'Logs'} />
      </SidebarSection>
    </div>
  );
};

// Reseller Top Navigation (deprecated)

// Reseller Companies View
const ResellerCompaniesView = ({ onCompanyClick }: { onCompanyClick: (company: string) => void }) => {
  const companies = [
    { name: 'demoresellercustomer1', createdOn: '12/11/25', phone: '', users: 1, access: 'None' },
    { name: 'Demo - Customer 5', createdOn: '03/19/25', phone: '', users: 3, access: 'None' },
    { name: 'Demo Customer - 4', createdOn: '03/19/25', phone: '7147742253', users: 1, access: 'None' },
    { name: 'Demo - Customer 2', createdOn: '02/21/25', phone: '7147742253', users: 2, access: 'None' },
    { name: 'Demo - Customer 1', createdOn: '02/21/25', phone: '7147742253', users: 2, access: 'None' },
  ];

  type CompanyRow = (typeof companies)[number];

  const columns: DataTableColumn<CompanyRow>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      cell: (row) => (
        <Inline gap="sm" wrap="nowrap">
          <span style={{ width: 10, height: 10, borderRadius: 9999, background: 'var(--mantine-color-green-6)' }} />
          <Text size="sm">{row.name}</Text>
        </Inline>
      ),
    },
    { accessorKey: 'createdOn', header: 'Created on', enableSorting: true },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'users', header: 'Users', enableSorting: true, align: 'right' },
    { accessorKey: 'access', header: 'Access' },
  ];

  return (
    <div style={{ flex: 1, padding: 24 }}>
      <Inline justify="space-between" mb="lg">
        <div>
          <Title order={2} fw={500}>
            Companies
          </Title>
          <Text c="dimmed" size="sm">
            Reseller customer list
          </Text>
        </div>
        <Inline gap="sm">
          <Button variant="secondary">New Lead or Purchase</Button>
          <Button leftSection={<Plus size={16} />}>Create New Company</Button>
        </Inline>
      </Inline>

      <Card>
        <DataTable<CompanyRow>
          data={companies}
          columns={columns}
          showSearch
          searchPlaceholder="Search by company name"
          onRowClick={(row) => onCompanyClick((row as CompanyRow).name)}
        />
      </Card>
    </div>
  );
};

// Reseller Company Details View
const ResellerCompanyDetailsView = ({ 
  companyName, 
  onBack 
}: { 
  companyName: string; 
  onBack: () => void;
}) => {
  const [activeTab, setActiveTab] = useState('Users');
  const [moreTabsOpen, setMoreTabsOpen] = useState(false);
  
  const companyId = 'f98547c2-2218-4096-814e-3cc90be4a3a3';
  const allTabs = ['Users', 'Billing', 'Activities', 'Payment Methods', 'Vendor Information', 'Domains'];
  const overflowTabs = ['Settings', 'Association'];

  const users = [
    { status: 'Enabled', name: 'Neil Bolton', email: 'neil.bolton+bezaq-customer@appdirect.com', apps: '' },
    { status: 'Enabled', name: 'Neil Bolton', email: 'neil.bolton+mm@appdirect.com', apps: '' },
  ];

  const groups = [
    { name: 'Everyone', users: 2 },
    { name: 'Company Admins', users: 2 },
    { name: 'Billing Admins', users: 2 },
  ];

  const renderTabContent = () => {
    if (activeTab === 'Users') {
      return (
        <Stack gap="xl" mt="md">
          <div>
            <Title order={4}>Users</Title>
          </div>

          <Card>
            <DataTable
              data={users}
              columns={[
                {
                  accessorKey: 'status',
                  header: 'Status',
                  enableSorting: true,
                  cell: (row: any) => (
                    <Badge color={row.status === 'Enabled' ? 'success' : 'danger'} variant="filled" size="sm">
                      {row.status}
                    </Badge>
                  ),
                },
                { accessorKey: 'name', header: 'Name', enableSorting: true },
                { accessorKey: 'email', header: 'Email' },
                { accessorKey: 'apps', header: 'Apps', enableSorting: true, align: 'right' },
              ]}
              showSearch
              searchPlaceholder="Search users"
            />
          </Card>

          <Inline gap="xs" wrap="nowrap">
            <Title order={4}>Synced Users</Title>
            <HelpCircle size={16} color="var(--mantine-color-gray-5)" />
          </Inline>
          <Card>
            <Text c="dimmed" size="sm" ta="center" py="xl">
              Once a user is synced, the user will be displayed here.
            </Text>
          </Card>

          <Title order={4}>Groups</Title>
          <Card>
            <DataTable
              data={groups}
              columns={[
                { accessorKey: 'name', header: 'Name', enableSorting: true },
                { accessorKey: 'users', header: 'Number of Users', enableSorting: true, align: 'right' },
              ]}
              showSearch
              searchPlaceholder="Search groups"
            />
          </Card>
        </Stack>
      );
    }
    
    if (activeTab === 'Vendor Information') {
      return <VendorInformation />;
    }

    return (
      <Card>
        <Text c="dimmed" ta="center" py="xl">
          {activeTab} content will appear here.
        </Text>
      </Card>
    );
  };

  return (
    <div style={{ flex: 1, padding: 24 }}>
      <Breadcrumb
        mb="md"
        items={[
          { label: 'Companies', onClick: onBack },
          { label: companyName },
        ]}
      />

      <Card>
        <Stack gap="sm">
          <Inline gap="md" wrap="nowrap">
            <div style={{ width: 48, height: 48, background: 'var(--mantine-color-blue-6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 18 }}>🏢</span>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Company <span style={{ marginLeft: 8, color: 'var(--mantine-color-green-7)', fontWeight: 600 }}>Enabled</span>
              </Text>
              <Title order={3}>{companyName}</Title>
            </div>
          </Inline>

          <Inline gap="sm">
            <Button variant="secondary">New Lead or Purchase</Button>
            <Button variant="secondary" rightSection={<ChevronDown size={16} />}>
              Manage Company
            </Button>
          </Inline>

          <div style={{ borderTop: '1px solid var(--mantine-color-gray-3)', paddingTop: 12 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 8,
              }}
            >
              <StatCard value="0" label="Free Trials" />
              <StatCard value="0" label="Expired Free Trials" />
              <StatCard value="0" label="Purchased Products" />
              <StatCard value="0" label="Suspended Products" />
              <StatCard value="0" label="Unpaid Invoices" />
              <StatCard value="$0.00" label="Total Spent" />
            </div>
          </div>
        </Stack>
      </Card>

      <Stack gap="md" mt="md">
        <Card>
          <Stack gap="md">
            <Inline justify="space-between">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  columnGap: 64,
                  rowGap: 16,
                  flex: 1,
                }}
              >
                <div>
                  <Text size="xs" c="dimmed">
                    Company Name
                  </Text>
                  <Text size="sm">{companyName}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    Created
                  </Text>
                  <Text size="sm">02/21/25</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    ID
                  </Text>
                  <Inline gap="xs" wrap="nowrap">
                    <Text size="sm">{companyId}</Text>
                    <Tooltip label="Copy company ID">
                      <ActionIcon
                        aria-label="Copy company ID"
                        onClick={() => navigator.clipboard?.writeText(companyId)}
                      >
                        <Copy size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Inline>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    Website
                  </Text>
                  <a href="#" style={{ fontSize: 14, color: 'var(--mantine-color-blue-7)', textDecoration: 'underline' }}>
                    appdirect.com
                  </a>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    Company's External ID
                  </Text>
                  <Text size="sm" c="dimmed">
                    No value
                  </Text>
                </div>
              </div>
              <div>
                <Button variant="secondary">Edit</Button>
              </div>
            </Inline>

            <div style={{ borderTop: '1px solid var(--mantine-color-gray-3)', paddingTop: 12, textAlign: 'center' }}>
              <Button variant="link" rightSection={<ChevronDown size={16} />}>
                Show more
              </Button>
            </div>
          </Stack>
        </Card>

        <Card>
          <div style={{ borderBottom: '1px solid var(--mantine-color-gray-3)', display: 'flex', alignItems: 'center' }}>
            {allTabs.map((tab) => (
              <Tab key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
            ))}

            {overflowTabs.length > 0 && (
              <div style={{ marginLeft: 'auto' }}>
                <Menu
                  position="bottom-end"
                  opened={moreTabsOpen}
                  onChange={setMoreTabsOpen}
                  trigger={
                    <Button variant="link" rightSection={<ChevronDown size={16} />}>
                      + {overflowTabs.length} more Tab{overflowTabs.length > 1 ? 's' : ''}
                    </Button>
                  }
                  sections={[
                    {
                      items: overflowTabs.map((t) => ({
                        id: t,
                        label: t,
                        onClick: () => {
                          setActiveTab(t);
                          setMoreTabsOpen(false);
                        },
                      })),
                    },
                  ]}
                />
              </div>
            )}
          </div>

          <div style={{ paddingTop: 16 }}>{renderTabContent()}</div>
        </Card>
      </Stack>
    </div>
  );
};

// End Customer Insights Component - Similar to Partner Center Insights but with "Cost" instead of "Revenue"
interface EndCustomerSubscriptionData {
  id: string;
  productName: string;
  displayName: string;
  sku: string;
  seats: number;
  assignedSeats: number;
  activeUsers: number;
  cost: number;
  status: 'active' | 'suspended' | 'expired';
  renewalDate?: string;
  termType: string;
}

const EndCustomerMetricCard: React.FC<{
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  subtitle?: string;
  status?: 'good' | 'warning' | 'poor' | 'neutral';
}> = ({ title, value, trend, icon, subtitle, status = 'neutral' }) => {
  const getStatusStyle = (): React.CSSProperties => {
    switch (status) {
      case 'good':
        return { border: '1px solid var(--mantine-color-green-2)', background: 'var(--mantine-color-green-0)' };
      case 'warning':
        return { border: '1px solid var(--mantine-color-yellow-2)', background: 'var(--mantine-color-yellow-0)' };
      case 'poor':
        return { border: '1px solid var(--mantine-color-red-2)', background: 'var(--mantine-color-red-0)' };
      default:
        return { border: '1px solid var(--mantine-color-gray-2)', background: 'white' };
    }
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp size={14} color="var(--mantine-color-green-6)" />;
    if (trend < 0) return <TrendingDown size={14} color="var(--mantine-color-red-6)" />;
    return <Minus size={14} color="var(--mantine-color-gray-6)" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return '';
    if (trend > 0) return 'var(--mantine-color-green-6)';
    if (trend < 0) return 'var(--mantine-color-red-6)';
    return 'var(--mantine-color-gray-6)';
  };

  return (
    <Card style={getStatusStyle()}>
      <Inline gap="sm" align="center" wrap="nowrap">
        <div style={{ padding: 8, background: 'var(--mantine-color-blue-1)', borderRadius: 10, flexShrink: 0 }}>
          {icon}
        </div>

        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Text size="xs" c="dimmed">
            {title}
          </Text>

          <Inline gap="sm" align="baseline" wrap="nowrap">
            <Title order={4} fw={900} style={{ margin: 0 }}>
              {value}
            </Title>
            {trend !== undefined && (
              <Inline gap={4} align="center" wrap="nowrap">
                {getTrendIcon()}
                <Text size="xs" fw={800} style={{ color: getTrendColor() }}>
                  {trend > 0 ? '+' : ''}
                  {trend}%
                </Text>
              </Inline>
            )}
          </Inline>

          {subtitle && (
            <Text size="xs" c="dimmed">
              {subtitle}
            </Text>
          )}
        </Stack>
      </Inline>
    </Card>
  );
};

const EndCustomerRevertConfirmModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentName: string;
  originalName: string;
}> = ({ open, onClose, onConfirm, currentName, originalName }) => {
  return (
    <ConfirmationModal
      opened={open}
      onClose={onClose}
      title="Revert subscription name?"
      size="sm"
      confirmLabel="Revert"
      cancelLabel="Cancel"
      confirmVariant="danger"
      onConfirm={onConfirm}
      onCancel={onClose}
    >
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          Are you sure you want to revert the subscription nickname back to the original name?
        </Text>
        <Card>
          <Stack gap={6}>
            <Inline justify="space-between" wrap="nowrap">
              <Text size="sm" c="dimmed">Current</Text>
              <Text size="sm" fw={700}>{currentName}</Text>
            </Inline>
            <Inline justify="space-between" wrap="nowrap">
              <Text size="sm" c="dimmed">Original</Text>
              <Text size="sm" fw={700}>{originalName}</Text>
            </Inline>
          </Stack>
        </Card>
      </Stack>
    </ConfirmationModal>
  );
};

const EndCustomerSubscriptionRow: React.FC<{
  subscription: EndCustomerSubscriptionData;
  onRename: (id: string, newName: string) => void;
}> = ({ subscription, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subscription.displayName);
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);
  
  const deploymentPercentage = (subscription.assignedSeats / subscription.seats) * 100;
  const usagePercentage = subscription.assignedSeats > 0 ? (subscription.activeUsers / subscription.assignedSeats) * 100 : 0;
  
  const isCustomName = subscription.displayName !== subscription.sku;

  const handleRevertConfirm = () => {
    onRename(subscription.id, subscription.sku);
    setShowRevertConfirm(false);
  };

  const getStatusBadge = () => {
    switch (subscription.status) {
      case 'active':
        return <Badge size="xs" color="success" variant="outline">Active</Badge>;
      case 'suspended':
        return <Badge size="xs" color="pending" variant="outline">Suspended</Badge>;
      case 'expired':
        return <Badge size="xs" color="danger" variant="outline">Expired</Badge>;
    }
  };

  const handleSaveName = () => {
    onRename(subscription.id, editName);
    setIsEditing(false);
  };

  const ChangeButton = ({ onClick }: { onClick?: () => void }) => (
    <Button variant="link" size="xs" onClick={onClick}>
      Change
    </Button>
  );

  return (
    <Card>
      <Inline justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={6} style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
          <Inline gap="sm" align="center" wrap="wrap">
            <Text fw={800} size="sm">{subscription.productName}</Text>
            {getStatusBadge()}
          </Inline>

          {isEditing ? (
            <Inline gap="xs" align="flex-end" wrap="wrap">
              <TextInput
                label={isCustomName ? 'Subscription Nickname' : 'Subscription Name'}
                value={editName}
                onChange={(e) => setEditName(e.currentTarget.value)}
                autoFocus
                style={{ minWidth: 260 }}
              />
              <Button size="sm" onClick={handleSaveName}>Save</Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => { setIsEditing(false); setEditName(subscription.displayName); }}
              >
                Cancel
              </Button>
            </Inline>
          ) : (
            <Inline gap="xs" align="center" wrap="wrap">
              <Text size="xs" c="dimmed">
                {isCustomName ? 'Subscription Nickname:' : 'Subscription Name:'}
              </Text>
              <Text size="xs" fw={700}>{subscription.displayName}</Text>
              <Tooltip label="Rename">
                <ActionIcon onClick={() => setIsEditing(true)}>
                  <Edit2 size={14} />
                </ActionIcon>
              </Tooltip>
              {isCustomName && (
                <Tooltip label="Revert to original name">
                  <ActionIcon onClick={() => setShowRevertConfirm(true)}>
                    <RotateCcw size={14} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Inline>
          )}

          <EndCustomerRevertConfirmModal
            open={showRevertConfirm}
            onClose={() => setShowRevertConfirm(false)}
            onConfirm={handleRevertConfirm}
            currentName={subscription.displayName}
            originalName={subscription.sku}
          />

          {subscription.renewalDate && (
            <Inline gap="xs" align="center" wrap="wrap">
              <Text size="xs" c="dimmed">Renewal: {subscription.renewalDate}</Text>
              <ChangeButton />
            </Inline>
          )}

          <Inline gap={6} align="baseline" wrap="nowrap">
            <Text size="sm" fw={900}>${subscription.cost.toLocaleString()}</Text>
            <Text size="xs" c="dimmed">/mo cost</Text>
          </Inline>
        </Stack>

        <div
          style={{
            width: 320,
            borderLeft: '1px solid var(--mantine-color-gray-2)',
            paddingLeft: 16,
          }}
        >
          <Stack gap={10}>
            <Inline justify="space-between" align="center" wrap="nowrap">
              <Text size="xs" c="dimmed">Total Seats</Text>
              <Inline gap="xs" align="center" wrap="nowrap">
                <Text size="sm" fw={800}>{subscription.seats}</Text>
                <ChangeButton />
              </Inline>
            </Inline>

            <div>
              <Inline justify="space-between" align="center" wrap="nowrap">
                <Text size="xs" c="dimmed">Assigned</Text>
                <Text size="xs" c="dimmed">
                  {subscription.assignedSeats} ({deploymentPercentage.toFixed(0)}%)
                </Text>
              </Inline>
              <Progress value={deploymentPercentage} mt={6} />
            </div>

            <div>
              <Inline justify="space-between" align="center" wrap="nowrap">
                <Text size="xs" c="dimmed">Active</Text>
                <Text size="xs" c="dimmed">
                  {subscription.activeUsers} ({usagePercentage.toFixed(0)}%)
                </Text>
              </Inline>
              <Progress value={usagePercentage} mt={6} />
            </div>
          </Stack>
        </div>
      </Inline>
    </Card>
  );
};

const EndCustomerAllSubscriptionsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  subscriptions: EndCustomerSubscriptionData[];
}> = ({ open, onClose, subscriptions }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const groupedSubscriptions = subscriptions.reduce((acc, sub) => {
    if (!acc[sub.productName]) {
      acc[sub.productName] = [];
    }
    acc[sub.productName].push(sub);
    return acc;
  }, {} as Record<string, EndCustomerSubscriptionData[]>);

  const getChurnRisk = (sub: EndCustomerSubscriptionData) => {
    const assignmentRate = (sub.assignedSeats / sub.seats) * 100;
    const usageRate = sub.assignedSeats > 0 ? (sub.activeUsers / sub.assignedSeats) * 100 : 0;
    
    if (assignmentRate < 50 || usageRate < 40) return 'high';
    if (assignmentRate < 70 || usageRate < 60) return 'medium';
    return 'low';
  };

  const getChurnRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge size="xs" color="danger" variant="outline">⚠ Underutilized</Badge>;
      case 'medium':
        return <Badge size="xs" color="pending" variant="outline">⚡ Monitor</Badge>;
      default:
        return null;
    }
  };

  const toggleGroup = (productName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productName)) {
        newSet.delete(productName);
      } else {
        newSet.add(productName);
      }
      return newSet;
    });
  };

  const getGroupTotals = (subs: EndCustomerSubscriptionData[]) => ({
    totalSeats: subs.reduce((sum, s) => sum + s.seats, 0),
    totalAssigned: subs.reduce((sum, s) => sum + s.assignedSeats, 0),
    totalActive: subs.reduce((sum, s) => sum + s.activeUsers, 0),
    totalCost: subs.reduce((sum, s) => sum + s.cost, 0),
    subscriptionCount: subs.length,
    hasChurnRisk: subs.some(s => getChurnRisk(s) !== 'low')
  });

  // Calculate overall totals for cost summary
  const overallTotals = {
    totalSeats: subscriptions.reduce((sum, s) => sum + s.seats, 0),
    totalAssigned: subscriptions.reduce((sum, s) => sum + s.assignedSeats, 0),
    totalActive: subscriptions.reduce((sum, s) => sum + s.activeUsers, 0),
    totalMonthlyCost: subscriptions.reduce((sum, s) => sum + s.cost, 0),
    subscriptionCount: subscriptions.length,
    productCount: Object.keys(groupedSubscriptions).length
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="My Microsoft Subscription Summary"
      size="xl"
      actions={[
        { id: 'close', label: 'Close', variant: 'primary', onClick: onClose, closeOnClick: true },
      ]}
    >
      <Stack gap="md">
        <Card style={{ background: 'var(--mantine-color-blue-0)', border: '1px solid var(--mantine-color-blue-2)' }}>
          <Stack gap="sm">
            <Text fw={800} size="sm" style={{ color: 'var(--mantine-color-blue-9)' }}>
              Cost Summary
            </Text>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 12,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={900} style={{ color: 'var(--mantine-color-blue-7)' }}>
                  ${overallTotals.totalMonthlyCost.toLocaleString()}
                </Text>
                <Text size="xs" c="dimmed">Monthly Cost</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={900}>{overallTotals.subscriptionCount}</Text>
                <Text size="xs" c="dimmed">Subscriptions</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={900}>{overallTotals.totalSeats}</Text>
                <Text size="xs" c="dimmed">Total Seats</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={900}>{((overallTotals.totalAssigned / overallTotals.totalSeats) * 100).toFixed(0)}%</Text>
                <Text size="xs" c="dimmed">Seats Assigned</Text>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--mantine-color-blue-2)', paddingTop: 10 }}>
              <Text size="xs" c="dimmed" ta="center">
                You have <Text span fw={700}>{overallTotals.productCount} product type{overallTotals.productCount > 1 ? 's' : ''}</Text> across{' '}
                <Text span fw={700}>{overallTotals.subscriptionCount} subscription{overallTotals.subscriptionCount > 1 ? 's' : ''}</Text> that cost an estimated{' '}
                <Text span fw={800} style={{ color: 'var(--mantine-color-blue-7)' }}>
                  ${(overallTotals.totalMonthlyCost * 12).toLocaleString()} annually
                </Text>
              </Text>
            </div>
          </Stack>
        </Card>

        <Stack gap="xs">
          {Object.entries(groupedSubscriptions).map(([productName, subs]) => {
            const isExpanded = expandedGroups.has(productName);
            const totals = getGroupTotals(subs);
            const assignmentRate = ((totals.totalAssigned / totals.totalSeats) * 100).toFixed(0);

            return (
              <Card key={productName} style={{ padding: 0, overflow: 'hidden' }}>
                <button
                  onClick={() => toggleGroup(productName)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: 'var(--mantine-color-gray-0)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Inline gap="sm" align="center" wrap="nowrap">
                    <Text fw={800} size="sm">{productName}</Text>
                    <Text size="xs" c="dimmed">({subs.length} subscription{subs.length > 1 ? 's' : ''})</Text>
                    {totals.hasChurnRisk && (
                      <Badge size="xs" color="danger" variant="outline">⚠ Attention needed</Badge>
                    )}
                  </Inline>

                  <Inline gap="md" align="center" wrap="nowrap">
                    <div style={{ textAlign: 'right' }}>
                      <Text size="xs" c="dimmed">{totals.totalSeats} seats • {assignmentRate}% assigned</Text>
                      <Text size="sm" fw={800}>${totals.totalCost.toLocaleString()}/mo cost</Text>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      style={{
                        color: 'var(--mantine-color-gray-6)',
                        transform: isExpanded ? 'rotate(180deg)' : undefined,
                        transition: 'transform 120ms ease',
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Inline>
                </button>

                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                    {subs.map((sub, idx) => {
                      const assignmentPerc = ((sub.assignedSeats / sub.seats) * 100).toFixed(0);
                      const activePerc = sub.assignedSeats > 0 ? ((sub.activeUsers / sub.assignedSeats) * 100).toFixed(0) : '0';
                      const churnRisk = getChurnRisk(sub);

                      return (
                        <div
                          key={sub.id}
                          style={{
                            padding: '10px 12px',
                            borderTop: idx > 0 ? '1px solid var(--mantine-color-gray-1)' : undefined,
                            background: 'white',
                          }}
                        >
                          <Inline justify="space-between" align="center" wrap="nowrap">
                            <Inline gap="xs" align="center" wrap="nowrap">
                              <Badge size="xs" variant="outline" color="default">
                                {sub.termType}
                              </Badge>
                              {getChurnRiskBadge(churnRisk)}
                              <Text size="xs" c="dimmed">
                                {sub.displayName !== sub.sku ? sub.displayName : `${sub.id.slice(0, 8)}...`}
                              </Text>
                            </Inline>

                            <Inline gap="xl" align="center" wrap="nowrap" style={{ textAlign: 'right' }}>
                              <div>
                                <Text size="xs" c="dimmed">Seats</Text>
                                <Text size="xs" fw={700}>{sub.seats}</Text>
                              </div>
                              <div>
                                <Text size="xs" c="dimmed">Assigned</Text>
                                <Text size="xs" fw={700}>{sub.assignedSeats} ({assignmentPerc}%)</Text>
                              </div>
                              <div>
                                <Text size="xs" c="dimmed">Active</Text>
                                <Text size="xs" fw={700}>{sub.activeUsers} ({activePerc}%)</Text>
                              </div>
                              <div style={{ minWidth: 90 }}>
                                <Text size="xs" c="dimmed">Cost</Text>
                                <Text size="xs" fw={800}>${sub.cost.toLocaleString()}/mo</Text>
                              </div>
                            </Inline>
                          </Inline>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </Modal>
  );
};

// End Customer Insights Component
const EndCustomerInsights: React.FC = () => {
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(true);
  const [officeUsageOpen, setOfficeUsageOpen] = useState(false);
  const [showAllSubscriptionsModal, setShowAllSubscriptionsModal] = useState(false);

  const [subscriptions, setSubscriptions] = useState<EndCustomerSubscriptionData[]>([
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      productName: 'Microsoft 365 Business Premium',
      displayName: 'O365_BUSINESS_PREMIUM',
      sku: 'O365_BUSINESS_PREMIUM',
      seats: 50,
      assignedSeats: 45,
      activeUsers: 38,
      cost: 1100,
      status: 'active' as const,
      renewalDate: '2025-12-31',
      termType: 'Annual Up Front'
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
      productName: 'Microsoft 365 Business Premium',
      displayName: 'M365 BP - Marketing Team',
      sku: 'O365_BUSINESS_PREMIUM',
      seats: 25,
      assignedSeats: 22,
      activeUsers: 18,
      cost: 550,
      status: 'active' as const,
      renewalDate: '2025-12-31',
      termType: 'Annual Billed Monthly'
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
      productName: 'Microsoft 365 E3',
      displayName: 'SPE_E3',
      sku: 'SPE_E3',
      seats: 30,
      assignedSeats: 28,
      activeUsers: 24,
      cost: 1080,
      status: 'active' as const,
      renewalDate: '2026-01-15',
      termType: 'Triannual Up Front'
    },
    {
      id: 'd4e5f6a7-b8c9-0123-defa-456789012345',
      productName: 'Microsoft 365 E3',
      displayName: 'M365 E3 - Exec Team',
      sku: 'SPE_E3',
      seats: 15,
      assignedSeats: 14,
      activeUsers: 12,
      cost: 540,
      status: 'active' as const,
      renewalDate: '2026-01-15',
      termType: 'Annual Billed Monthly'
    }
  ]);

  const handleRenameSubscription = (id: string, newName: string) => {
    setSubscriptions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, displayName: newName } : sub)
    );
  };

  const overview = {
    totalSeats: subscriptions.reduce((sum, s) => sum + s.seats, 0),
    assignedSeats: subscriptions.reduce((sum, s) => sum + s.assignedSeats, 0),
    activeUsers: subscriptions.reduce((sum, s) => sum + s.activeUsers, 0),
    monthlyCost: subscriptions.reduce((sum, s) => sum + s.cost, 0),
    subscriptionCount: subscriptions.length,
    trends: {
      seats: 2.1,
      activeUsers: 5.4,
      cost: 3.2
    }
  };

  const officeUsage = [
    {
      product: 'Microsoft 365 Apps',
      totalUsers: 120,
      activeUsers: 92,
      usagePercentage: 76.7,
      services: [
        { name: 'Exchange', activeUsers: 108, percentage: 90.0 },
        { name: 'SharePoint', activeUsers: 67, percentage: 55.8 },
        { name: 'OneDrive', activeUsers: 89, percentage: 74.2 },
        { name: 'Teams', activeUsers: 105, percentage: 87.5 },
        { name: 'Office Apps', activeUsers: 78, percentage: 65.0 }
      ]
    }
  ];

  return (
    <ExpandableSection
      title="My Microsoft Insights" 
      open={overviewOpen}
      onToggle={setOverviewOpen}
    >
      {/* Overview Metrics */}
      <Stack gap="sm" style={{ marginBottom: 12 }}>
        <Text fw={800} size="sm">Overview</Text>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 8,
          }}
        >
          <EndCustomerMetricCard
            title="Total Seats"
            value={overview.totalSeats}
            trend={overview.trends.seats}
            icon={<Users size={16} color="var(--mantine-color-blue-6)" />}
            status="good"
          />
          <EndCustomerMetricCard
            title="Assigned Seats"
            value={overview.assignedSeats}
            subtitle={`${((overview.assignedSeats / overview.totalSeats) * 100).toFixed(0)}% deployed`}
            icon={<Package size={16} color="var(--mantine-color-blue-6)" />}
            status="good"
          />
          <EndCustomerMetricCard
            title="Active Users (28d)"
            value={overview.activeUsers}
            trend={overview.trends.activeUsers}
            icon={<Activity size={16} color="var(--mantine-color-blue-6)" />}
            status="good"
          />
          <EndCustomerMetricCard
            title="Monthly Cost"
            value={`$${overview.monthlyCost.toLocaleString()}`}
            trend={overview.trends.cost}
            icon={<DollarSign size={16} color="var(--mantine-color-blue-6)" />}
            status="neutral"
          />
        </div>
      </Stack>

      {/* Subscriptions Detail */}
      <ExpandableSection
        title={
          <Inline justify="space-between" align="center" wrap="nowrap" style={{ width: '100%' }}>
            <Text fw={800} size="sm">
              My Subscriptions ({subscriptions.length})
            </Text>
            <Button
              size="xs"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllSubscriptionsModal(true);
              }}
            >
              Summarise all my Microsoft subscriptions
            </Button>
          </Inline>
        }
        open={subscriptionsOpen}
        onToggle={setSubscriptionsOpen}
      >
        <Stack gap="xs">
          {subscriptions.map((sub) => (
            <EndCustomerSubscriptionRow 
              key={sub.id} 
              subscription={sub}
              onRename={handleRenameSubscription}
            />
          ))}
        </Stack>

        <Card style={{ background: 'var(--mantine-color-blue-0)', border: '1px solid var(--mantine-color-blue-2)' }}>
          <Stack gap={6}>
            <Text size="xs" fw={800} style={{ color: 'var(--mantine-color-blue-8)' }}>
              💡 Cost Optimization Tips
            </Text>
            <Stack gap={4}>
              <Text size="xs" style={{ color: 'var(--mantine-color-blue-8)' }}>
                - You have <Text span fw={800}>{overview.totalSeats - overview.assignedSeats} unassigned seats</Text> that could be removed to reduce costs.
              </Text>
              <Text size="xs" style={{ color: 'var(--mantine-color-blue-8)' }}>
                - <Text span fw={800}>{((overview.activeUsers / overview.assignedSeats) * 100).toFixed(1)}% of assigned users</Text> are actively using their licenses.
              </Text>
            </Stack>
          </Stack>
        </Card>
      </ExpandableSection>

      {/* Office Usage */}
      <ExpandableSection
        title="Office 365 Usage Analytics"
        open={officeUsageOpen}
        onToggle={setOfficeUsageOpen}
      >
        <Stack gap="md">
          {officeUsage.map((usage, index) => (
            <Card key={index}>
              <Inline justify="space-between" align="flex-start" mb="sm" wrap="nowrap">
                <Text fw={800}>{usage.product}</Text>
                <div style={{ textAlign: 'right' }}>
                  <Text fw={900} size="lg">
                    {usage.activeUsers}/{usage.totalUsers}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {usage.usagePercentage.toFixed(1)}% active
                  </Text>
                </div>
              </Inline>

              <Progress value={usage.usagePercentage} mb="sm" />

              <Stack gap="xs">
                {usage.services.map((service) => (
                  <Inline key={service.name} justify="space-between" align="center" wrap="nowrap">
                    <Text size="sm">{service.name}</Text>
                    <Inline gap="xs" align="center" wrap="nowrap">
                      <Text size="sm" c="dimmed">{service.activeUsers} users</Text>
                      <Badge
                        size="xs"
                        variant="outline"
                        color={service.percentage >= 80 ? 'success' : service.percentage >= 60 ? 'pending' : 'danger'}
                      >
                        {service.percentage.toFixed(0)}%
                      </Badge>
                    </Inline>
                  </Inline>
                ))}
              </Stack>
            </Card>
          ))}
        </Stack>

        <Card style={{ background: 'var(--mantine-color-yellow-0)', border: '1px solid var(--mantine-color-yellow-2)' }}>
          <Stack gap={6}>
            <Text fw={800} size="sm" style={{ color: 'var(--mantine-color-yellow-9)' }}>
              💡 Usage Recommendations
            </Text>
            <Stack gap={4}>
              <Text size="xs" style={{ color: 'var(--mantine-color-yellow-9)' }}>
                - <Text span fw={800}>SharePoint usage is at 55.8%</Text> - Consider training sessions to improve document collaboration.
              </Text>
              <Text size="xs" style={{ color: 'var(--mantine-color-yellow-9)' }}>
                - <Text span fw={800}>Teams has strong adoption (87.5%)</Text> - Your team is getting value from Microsoft 365!
              </Text>
            </Stack>
          </Stack>
        </Card>
      </ExpandableSection>

      {/* Data Source Information */}
      <Card style={{ background: 'var(--mantine-color-gray-0)', border: '1px solid var(--mantine-color-gray-2)' }}>
        <Inline gap="xs" align="flex-start" wrap="nowrap">
          <svg width="12" height="12" style={{ color: 'var(--mantine-color-blue-6)', marginTop: 3, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <Text size="xs" c="dimmed">
            Data from your Microsoft 365 Admin Center. Updated daily.
          </Text>
        </Inline>
      </Card>

      {/* All Subscriptions Modal */}
      <EndCustomerAllSubscriptionsModal
        open={showAllSubscriptionsModal}
        onClose={() => setShowAllSubscriptionsModal(false)}
        subscriptions={subscriptions}
      />
    </ExpandableSection>
  );
};

// End Customer Sidebar Component
const EndCustomerSidebar = ({
  activeItem,
  onSelect,
}: {
  activeItem: string;
  onSelect?: (item: string) => void;
}) => {
  const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 8 }}>
      <div
        style={{
          padding: '8px 12px',
          background: 'var(--mantine-color-gray-0)',
          borderBottom: '1px solid var(--mantine-color-gray-2)',
        }}
      >
        <Text
          size="xs"
          fw={800}
          style={{
            color: 'var(--mantine-color-gray-6)',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Text>
      </div>
      <Stack gap={2} style={{ padding: 8 }}>
        {children}
      </Stack>
    </Card>
  );

  const SidebarItem = ({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) => (
    <Button
      size="sm"
      fullWidth
      variant={active ? 'secondary' : 'link'}
      onClick={onClick}
      style={{ justifyContent: 'flex-start', fontWeight: active ? 800 : 600 }}
    >
      {label}
    </Button>
  );

  return (
    <div
      style={{
        width: 240,
        minHeight: 'calc(100vh - 56px)',
        borderRight: '1px solid var(--mantine-color-gray-2)',
        padding: 12,
        background: 'white',
      }}
    >
      <SidebarSection title="COMPANY SETTINGS">
        <SidebarItem label="Company Settings" active={activeItem === 'Company Settings'} />
        <SidebarItem label="Single Sign-On" active={activeItem === 'Single Sign-On'} />
      </SidebarSection>

      <SidebarSection title="VENDOR INFORMATION">
        <SidebarItem
          label="Adobe"
          active={activeItem === 'Adobe'}
          onClick={() => onSelect?.('Adobe')}
        />
        <SidebarItem
          label="Microsoft"
          active={activeItem === 'Microsoft'}
          onClick={() => onSelect?.('Microsoft')}
        />
      </SidebarSection>
    </div>
  );
};

// End Customer Microsoft View Component
const EndCustomerMicrosoftView = () => {
  const [gdapPermissions, setGdapPermissions] = useState([
    {
      id: '261225c9-b98f-4555-b4ac-e8bde6152b42',
      name: 'GDAP Permission',
      dateRange: '11/11/2025 - 11/11/2027',
      autoExtend: true,
      active: true,
      roles: [
        'Cloud application administrator',
        'License administrator',
        'User administrator',
        'Directory readers',
      ],
    },
    {
      id: 'Default_AppD_demoreseller_437846696580155',
      name: 'GDAP Permission',
      dateRange: '11/10/2025 - 05/09/2026',
      autoExtend: true,
      active: true,
      roles: [
        'Privileged authentication administrator',
        'Privileged role administrator',
        'User administrator',
        'Helpdesk administrator',
        'License administrator',
        'Application administrator',
        'Cloud application administrator',
        'Service support administrator',
        'Directory writers',
        'Directory readers',
        'Global reader',
      ],
    },
  ]);

  const [expandedGdap, setExpandedGdap] = useState<string | null>(null);
  const [gdapSectionOpen, setGdapSectionOpen] = useState(false);
  const [adminSectionOpen, setAdminSectionOpen] = useState(true);

  const handleAutoExtendToggle = (idx: number, value: boolean) => {
    setGdapPermissions((prev) =>
      prev.map((rel, i) =>
        i === idx ? { ...rel, autoExtend: value } : rel
      )
    );
  };

  const microsoftLogo = '/microsoft (1).png';

  return (
    <div style={{ flex: 1, padding: 24 }}>
      <Title order={3} style={{ marginBottom: 8 }}>
        Microsoft
      </Title>
      
      {/* My Microsoft Tenant Information Card - Same structure as Reseller view */}
      <Card style={{ background: 'var(--mantine-color-gray-0)', border: '1px solid var(--mantine-color-gray-2)', marginBottom: 8 }}>
        <Inline justify="space-between" align="center" mb="sm" wrap="nowrap">
          <Text size="sm" fw={800}>My Microsoft Tenant Information</Text>
        </Inline>
        
        {/* Tenant Domain Details - inline, not collapsible */}
        <Card style={{ background: 'white', border: '1px solid var(--mantine-color-gray-2)', marginBottom: 8 }}>
          <Inline justify="space-between" align="center" wrap="nowrap">
            <Inline gap="sm" align="center" wrap="nowrap">
              <img src={microsoftLogo} alt="Microsoft Logo" style={{ width: 40, height: 40, borderRadius: 10 }} />
              <Stack gap={4}>
                <Text size="sm" fw={800}>demoresellercustomer13799.onmicrosoft.com</Text>
                <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
                  8e97f6e7-f67b-445f-9e85-393c7daff321
                </Text>
              </Stack>
            </Inline>
            <Badge size="sm" color="success" variant="outline">Active</Badge>
          </Inline>
        </Card>

        {/* Administration Information Subsection */}
        <ExpandableSection
          title="Administration Information"
          open={adminSectionOpen}
          onToggle={setAdminSectionOpen}
        >
          <Stack gap="sm">
            <div>
              <Text size="xs" fw={800} style={{ color: 'var(--mantine-color-gray-7)' }}>Global Admin User(s)</Text>
              <Stack gap={4} mt={6}>
                <Text size="xs">- admin@demoresellercustomer13799.onmicrosoft.com</Text>
                <Text size="xs">- neil.bolton@demoresellercustomer13799.onmicrosoft.com</Text>
              </Stack>
            </div>
          
            <div>
              <Text size="xs" fw={800} style={{ color: 'var(--mantine-color-gray-7)' }}>Billing Admin User(s)</Text>
              <Stack gap={4} mt={6}>
                <Text size="xs">- billing@demoresellercustomer13799.onmicrosoft.com</Text>
              </Stack>
            </div>

            <div>
              <Text size="xs" fw={800} style={{ color: 'var(--mantine-color-gray-7)' }}>Microsoft Customer Agreement Status</Text>
              <Inline justify="space-between" align="center" mt={6} wrap="nowrap">
                <Text size="xs" c="dimmed">Last Agreement Date: 11/10/2025</Text>
                <Badge size="xs" color="success" variant="outline">Active</Badge>
              </Inline>
            </div>
          </Stack>
        </ExpandableSection>

        {/* GDAP Relationships Subsection */}
        <ExpandableSection
          title="GDAP Relationships"
          open={gdapSectionOpen}
          onToggle={setGdapSectionOpen}
        >
          {gdapPermissions.map((permission, idx) => {
            const isExpanded = expandedGdap === permission.id;
            
            return (
              <Card
                key={permission.id}
                style={{
                  background: 'var(--mantine-color-gray-0)',
                  border: '1px solid var(--mantine-color-gray-2)',
                  marginBottom: 8,
                  marginLeft: 8,
                  padding: 0,
                  overflow: 'hidden',
                }}
              >
                <button
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    textAlign: 'left',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandedGdap(isExpanded ? null : permission.id)}
                >
                  <Inline gap="sm" align="center" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                    <Text size="xs" style={{ fontFamily: 'monospace', color: 'var(--mantine-color-gray-7)' }}>
                      {permission.id}
                    </Text>
                    {permission.active ? (
                      <Badge size="xs" color="success" variant="outline">Active</Badge>
                    ) : (
                      <Badge size="xs" color="pending" variant="outline">Pending</Badge>
                    )}
                  </Inline>
                  <span style={{ marginLeft: 6, display: 'inline-flex', color: 'var(--mantine-color-gray-6)' }}>
                    {isExpanded ? (
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                    ) : (
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    )}
                  </span>
                </button>
                
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--mantine-color-gray-2)', padding: '10px 12px' }}>
                    <Stack gap="xs">
                      <Text size="xs" c="dimmed">GDAP relationship granted by your Reseller.</Text>
                      <Text size="xs" c="dimmed">Valid: {permission.dateRange}</Text>
                      <Inline justify="flex-end" align="center" wrap="nowrap">
                        <Text size="xs" c="dimmed">Auto-renew</Text>
                        <Toggle enabled={permission.autoExtend} onChange={(val) => handleAutoExtendToggle(idx, val)} size="sm" />
                      </Inline>
                      <Stack gap={4}>
                        {permission.roles.map((role) => (
                          <Text key={role} size="xs">
                            - {role}
                          </Text>
                        ))}
                      </Stack>
                    </Stack>
                  </div>
                )}
              </Card>
            );
          })}
        </ExpandableSection>

        {/* Special Qualifications - Empty State */}
        <ExpandableSection title="Special Qualification Status">
          <Card style={{ background: 'var(--mantine-color-gray-0)', border: '1px dashed var(--mantine-color-gray-3)' }}>
            <Stack gap={6} align="center">
              <Text size="xs" fw={800} style={{ color: 'var(--mantine-color-gray-7)' }}>
                No Special Qualifications set
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                Customers can only purchase special segment offers if they meet Microsoft eligibility.
              </Text>
            </Stack>
          </Card>
        </ExpandableSection>
      </Card>

      {/* My Microsoft Insights - End Customer version with "Cost" instead of "Revenue" */}
      <EndCustomerInsights />
    </div>
  );
};

export const OperationsCompanyDetails = () => {
  const navigate = useNavigate();
  const { companyName } = useParams();
  const decodedCompanyName = decodeURIComponent(companyName || 'demoresellercustomer1');
  
  const [activeTab, setActiveTab] = useState('Users');
  const [moreTabsOpen, setMoreTabsOpen] = useState(false);
  const [visibleTabCount, setVisibleTabCount] = useState(9); // Show all by default
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  // Demo toggle state - 'mm' (Marketplace Manager), 'reseller', or 'endcustomer'
  type ViewMode = 'mm' | 'reseller' | 'endcustomer';
  const [viewMode, setViewMode] = useState<ViewMode>('mm');
  const [endCustomerActiveItem, setEndCustomerActiveItem] = useState('Microsoft');
  const [resellerSelectedCompany, setResellerSelectedCompany] = useState<string | null>(null);

  const allTabs = ['Users', 'Billing', 'Activities', 'Settings', 'Reseller Companies', 'Payment Methods', 'Vendor Information', 'Domains', 'Association'];
  
  const companyId = '7c7cd39e-e239-43c5-b099-0888671761af';

  // Calculate how many tabs can fit
  useEffect(() => {
    const calculateVisibleTabs = () => {
      if (!tabsContainerRef.current) return;
      
      const containerWidth = tabsContainerRef.current.offsetWidth;
      const TAB_WIDTH = 140; // Approximate width per tab
      const DROPDOWN_WIDTH = 120; // Width for dropdown button
      const PADDING = 20;
      
      // Calculate how many tabs can fit
      const availableWidth = containerWidth - PADDING;
      let maxTabs = Math.floor(availableWidth / TAB_WIDTH);
      
      // If all tabs fit, show them all
      if (maxTabs >= allTabs.length) {
        setVisibleTabCount(allTabs.length);
      } else {
        // Reserve space for dropdown, show fewer tabs
        maxTabs = Math.floor((availableWidth - DROPDOWN_WIDTH) / TAB_WIDTH);
        setVisibleTabCount(Math.max(3, maxTabs)); // Show at least 3 tabs
      }
    };

    calculateVisibleTabs();
    
    const resizeObserver = new ResizeObserver(calculateVisibleTabs);
    if (tabsContainerRef.current) {
      resizeObserver.observe(tabsContainerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);

  const visibleTabs = allTabs.slice(0, visibleTabCount);
  const overflowTabs = allTabs.slice(visibleTabCount);
  const hasOverflow = overflowTabs.length > 0;

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setMoreTabsOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Users':
        return <UsersTabContent />;
      case 'Vendor Information':
        return <VendorInformation />;
      default:
        return <PlaceholderTabContent tabName={activeTab} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--mantine-color-gray-0)' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <Card style={{ borderRadius: 0, background: 'var(--mantine-color-yellow-0)', borderBottom: '1px solid var(--mantine-color-yellow-2)' }}>
          <Inline justify="space-between" align="center" wrap="wrap">
            <Inline gap="sm" align="center" wrap="wrap">
              <Badge color="pending" variant="filled">DEMO</Badge>
              <Text size="sm" fw={700} c="dimmed">View Mode:</Text>
              <SegmentedControl
                size="xs"
                value={viewMode}
                onChange={(val) => setViewMode(val as typeof viewMode)}
                data={[
                  { label: 'Marketplace Manager', value: 'mm' },
                  { label: 'Reseller', value: 'reseller' },
                  { label: 'End Customer', value: 'endcustomer' },
                ]}
              />
            </Inline>
            <Text size="xs" c="dimmed">
              {viewMode === 'mm' && 'Viewing as Marketplace Manager (manage all customers)'}
              {viewMode === 'reseller' && 'Viewing as Reseller (manage end customers)'}
              {viewMode === 'endcustomer' && 'Viewing as End Customer (self-service portal)'}
            </Text>
          </Inline>
        </Card>
      </div>

      {viewMode === 'mm' ? (
        <OperationsLayout>
          <main>
          {/* Breadcrumb */}
          <Breadcrumb
            mb="md"
            items={[
              { label: 'Companies', onClick: () => navigate('/operations/companies') },
              { label: decodedCompanyName },
            ]}
          />

          {/* Company Header */}
          <Card>
            <Stack gap="sm">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: 'var(--mantine-color-teal-6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: 18 }}>🏢</span>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Company <span style={{ marginLeft: 8, color: 'var(--mantine-color-green-7)', fontWeight: 600 }}>Enabled</span>
                  </Text>
                  <Title order={3}>{decodedCompanyName}</Title>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button variant="secondary">New Lead or Purchase</Button>
                <Button variant="secondary" rightSection={<ChevronDown size={16} />}>
                  Manage Company
                </Button>
              </div>

              <div style={{ borderTop: '1px solid var(--mantine-color-gray-3)', paddingTop: 12 }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: 8,
                  }}
                >
                  <StatCard value="0" label="Free Trials" />
                  <StatCard value="0" label="Expired Free Trials" />
                  <StatCard value="2" label="Purchased Products" />
                  <StatCard value="0" label="Suspended Products" />
                  <StatCard value="0" label="Unpaid Invoices" />
                  <StatCard value="$95.06" label="Total Spent" />
                </div>
              </div>
            </Stack>
          </Card>

          {/* Company Info Card */}
          <Card>
            <Stack gap="md">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    columnGap: 64,
                    rowGap: 16,
                    flex: 1,
                  }}
                >
                  <div>
                    <Text size="xs" c="dimmed">
                      Company Name
                    </Text>
                    <Text size="sm">{decodedCompanyName}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Created
                    </Text>
                    <Text size="sm">11/10/25</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      ID
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text size="sm">{companyId}</Text>
                      <Tooltip label="Copy company ID">
                        <ActionIcon
                          aria-label="Copy company ID"
                          onClick={() => navigator.clipboard?.writeText(companyId)}
                        >
                          <Copy size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </div>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Website
                    </Text>
                    <a href="#" style={{ fontSize: 14, color: 'var(--mantine-color-blue-7)', textDecoration: 'underline' }}>
                      appdirect.com
                    </a>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Company's External ID
                    </Text>
                    <Text size="sm" c="dimmed">
                      No value
                    </Text>
                  </div>
                  <div />
                  <div>
                    <Text size="xs" c="dimmed">
                      Mailing address
                    </Text>
                    <a href="#" style={{ fontSize: 14, color: 'var(--mantine-color-blue-7)', textDecoration: 'underline' }}>
                      neil.bolton+{decodedCompanyName}@appdirect.com
                    </a>
                  </div>
                  <div />
                  <div>
                    <Text size="xs" c="dimmed">
                      MPN ID
                    </Text>
                    <Text size="sm" c="dimmed">
                      No value
                    </Text>
                  </div>
                </div>
                <div>
                  <Button variant="secondary">Edit</Button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--mantine-color-gray-3)', paddingTop: 12, textAlign: 'center' }}>
                <Button variant="link" rightSection={<ChevronDown size={16} />}>
                  Show more
                </Button>
              </div>
            </Stack>
          </Card>

          {/* Tabs */}
          <Card>
            <div ref={tabsContainerRef} style={{ borderBottom: '1px solid var(--mantine-color-gray-3)', display: 'flex', alignItems: 'center' }}>
              {visibleTabs.map((tab) => (
                <Tab 
                  key={tab} 
                  label={tab} 
                  active={activeTab === tab} 
                  onClick={() => handleTabClick(tab)} 
                />
              ))}
              
              {/* More Tabs Dropdown - only show if there are overflow tabs */}
              {hasOverflow && (
                <div style={{ marginLeft: 'auto' }}>
                  <Menu
                    position="bottom-end"
                    opened={moreTabsOpen}
                    onChange={setMoreTabsOpen}
                    trigger={
                      <Button
                        variant="link"
                        rightSection={<ChevronDown size={16} />}
                      >
                        + {overflowTabs.length} more Tab{overflowTabs.length > 1 ? 's' : ''}
                      </Button>
                    }
                    sections={[
                      {
                        items: overflowTabs.map((tab) => ({
                          id: tab,
                          label: tab,
                          onClick: () => handleTabClick(tab),
                        })),
                      },
                    ]}
                  />
                </div>
              )}
            </div>

            {/* Tab Content */}
            <div style={{ paddingTop: 16 }}>
              {renderTabContent()}
            </div>
          </Card>
          </main>
        </OperationsLayout>
      ) : (
        <>
          <TopNavbar />

          <div style={{ display: 'flex' }}>
            {viewMode === 'endcustomer' ? (
              <EndCustomerSidebar activeItem={endCustomerActiveItem} onSelect={setEndCustomerActiveItem} />
            ) : (
              <ResellerSidebar activeItem="Companies" />
            )}

            {viewMode === 'endcustomer' ? (
              endCustomerActiveItem === 'Microsoft' ? (
                <EndCustomerMicrosoftView />
              ) : (
                <PlaceholderTabContent tabName={endCustomerActiveItem} />
              )
            ) : resellerSelectedCompany ? (
              <ResellerCompanyDetailsView companyName={resellerSelectedCompany} onBack={() => setResellerSelectedCompany(null)} />
            ) : (
              <ResellerCompaniesView onCompanyClick={(company) => setResellerSelectedCompany(company)} />
            )}
          </div>
        </>
      )}

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
    </div>
  );
};

