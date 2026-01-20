import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Select,
  Button,
  Group,
  Stack,
  Divider,
  Badge,
  Alert,
  Tooltip,
  Anchor,
  Box,
  ThemeIcon,
  Breadcrumbs,
  Progress,
  Switch,
  Tabs,
  Table,
  Loader,
  ActionIcon,
  Checkbox,
  Pagination,
  Modal,
  Code,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Save,
  X,
  Info,
  Key,
  Building2,
  Hash,
  Search,
  Download,
  Eye,
  ShoppingCart,
  Cloud,
  Package,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';

// Helper to get/set distributor config in localStorage
const getDistiConfig = (distiId: string): boolean => {
  const config = localStorage.getItem('configuredDistributors');
  if (!config) return true;
  const parsed = JSON.parse(config);
  return parsed[distiId] !== false;
};

const setDistiConfig = (distiId: string, enabled: boolean) => {
  const config = localStorage.getItem('configuredDistributors');
  const parsed = config ? JSON.parse(config) : {};
  parsed[distiId] = enabled;
  localStorage.setItem('configuredDistributors', JSON.stringify(parsed));
};

// Connection status type
type ConnectionStatus = 'connected' | 'disconnected' | 'testing' | 'error';

// Product type from Microsoft Marketplace Catalog
interface MarketplaceProduct {
  id: string;
  displayName: string;
  publisherDisplayName: string;
  publisherId: string;
  summary: string;
  description?: string;
  productType: string;
  popularity?: number;
  pricingTypes?: string[];
  operatingSystems?: string[];
  imageUrl?: string;
  categories?: string[];
}

// Sample products data (simulating API response)
const sampleMarketplaceProducts: MarketplaceProduct[] = [
  {
    id: 'microsoft-azure-vm-windows-server',
    displayName: 'Windows Server 2022 Datacenter',
    publisherDisplayName: 'Microsoft',
    publisherId: 'microsoft',
    summary: 'Windows Server is the platform for building an infrastructure of connected applications, networks, and web services.',
    productType: 'VirtualMachine',
    popularity: 95,
    pricingTypes: ['PayAsYouGo', 'BYOL'],
    operatingSystems: ['Windows'],
    categories: ['Compute', 'Operating Systems'],
  },
  {
    id: 'canonical-ubuntu-server',
    displayName: 'Ubuntu Server 22.04 LTS',
    publisherDisplayName: 'Canonical',
    publisherId: 'canonical',
    summary: 'Ubuntu Server is the world\'s most popular Linux for cloud environments.',
    productType: 'VirtualMachine',
    popularity: 92,
    pricingTypes: ['Free', 'PayAsYouGo'],
    operatingSystems: ['Linux'],
    categories: ['Compute', 'Operating Systems'],
  },
  {
    id: 'microsoft-dynamics-365-sales',
    displayName: 'Dynamics 365 Sales',
    publisherDisplayName: 'Microsoft',
    publisherId: 'microsoft',
    summary: 'Empower sellers with insights to personalize relationships, predict customer needs, and close sales faster.',
    productType: 'DynamicsCE',
    popularity: 88,
    pricingTypes: ['Subscription'],
    categories: ['Business Applications', 'CRM'],
  },
  {
    id: 'microsoft-power-bi-pro',
    displayName: 'Power BI Pro',
    publisherDisplayName: 'Microsoft',
    publisherId: 'microsoft',
    summary: 'Self-service and enterprise business intelligence that\'s scalable and easy to use.',
    productType: 'Power BI',
    popularity: 90,
    pricingTypes: ['Subscription'],
    categories: ['Analytics', 'Business Intelligence'],
  },
  {
    id: 'redhat-enterprise-linux',
    displayName: 'Red Hat Enterprise Linux 9',
    publisherDisplayName: 'Red Hat',
    publisherId: 'redhat',
    summary: 'The world\'s leading enterprise Linux platform, certified on hundreds of clouds.',
    productType: 'VirtualMachine',
    popularity: 85,
    pricingTypes: ['PayAsYouGo', 'BYOL'],
    operatingSystems: ['Linux'],
    categories: ['Compute', 'Operating Systems'],
  },
  {
    id: 'microsoft-sql-server-2022',
    displayName: 'SQL Server 2022 Enterprise',
    publisherDisplayName: 'Microsoft',
    publisherId: 'microsoft',
    summary: 'Mission-critical intelligent database platform with industry-leading performance.',
    productType: 'VirtualMachine',
    popularity: 87,
    pricingTypes: ['PayAsYouGo', 'BYOL'],
    operatingSystems: ['Windows', 'Linux'],
    categories: ['Databases', 'Data Platform'],
  },
  {
    id: 'nginx-plus',
    displayName: 'NGINX Plus',
    publisherDisplayName: 'F5 Networks',
    publisherId: 'f5-networks',
    summary: 'High-performance load balancer, web server, and content cache.',
    productType: 'VirtualMachine',
    popularity: 78,
    pricingTypes: ['PayAsYouGo'],
    operatingSystems: ['Linux'],
    categories: ['Networking', 'Security'],
  },
  {
    id: 'microsoft-365-e5',
    displayName: 'Microsoft 365 E5',
    publisherDisplayName: 'Microsoft',
    publisherId: 'microsoft',
    summary: 'The most complete productivity and security solution for enterprises.',
    productType: 'Office365',
    popularity: 93,
    pricingTypes: ['Subscription'],
    categories: ['Productivity', 'Security'],
  },
  {
    id: 'azure-kubernetes-service',
    displayName: 'Azure Kubernetes Service (AKS)',
    publisherDisplayName: 'Microsoft',
    publisherId: 'microsoft',
    summary: 'Highly available, secure, and fully managed Kubernetes service.',
    productType: 'ContainerApps',
    popularity: 89,
    pricingTypes: ['PayAsYouGo'],
    categories: ['Containers', 'Compute'],
  },
  {
    id: 'datadog-monitoring',
    displayName: 'Datadog',
    publisherDisplayName: 'Datadog',
    publisherId: 'datadog',
    summary: 'Cloud-scale monitoring and security platform for cloud applications.',
    productType: 'SaaS',
    popularity: 82,
    pricingTypes: ['Subscription', 'PayAsYouGo'],
    categories: ['Monitoring', 'DevOps'],
  },
  {
    id: 'splunk-enterprise',
    displayName: 'Splunk Enterprise',
    publisherDisplayName: 'Splunk',
    publisherId: 'splunk',
    summary: 'Turn machine data into answers with the leading platform for Operational Intelligence.',
    productType: 'SaaS',
    popularity: 80,
    pricingTypes: ['BYOL', 'Subscription'],
    categories: ['Analytics', 'Security'],
  },
  {
    id: 'palo-alto-vm-series',
    displayName: 'Palo Alto Networks VM-Series',
    publisherDisplayName: 'Palo Alto Networks',
    publisherId: 'paloaltonetworks',
    summary: 'Next-Generation Firewall for securing cloud environments.',
    productType: 'VirtualMachine',
    popularity: 76,
    pricingTypes: ['BYOL', 'PayAsYouGo'],
    operatingSystems: ['Linux'],
    categories: ['Security', 'Networking'],
  },
];

// Product type options
const productTypeOptions = [
  { value: '', label: 'All Product Types' },
  { value: 'VirtualMachine', label: 'Virtual Machine' },
  { value: 'SaaS', label: 'SaaS' },
  { value: 'ContainerApps', label: 'Container Apps' },
  { value: 'DynamicsCE', label: 'Dynamics 365 CE' },
  { value: 'Office365', label: 'Office 365' },
  { value: 'Power BI', label: 'Power BI' },
  { value: 'AzureApplication', label: 'Azure Application' },
  { value: 'ManagedServices', label: 'Managed Services' },
];

// Publisher options
const publisherOptions = [
  { value: '', label: 'All Publishers' },
  { value: 'microsoft', label: 'Microsoft' },
  { value: 'canonical', label: 'Canonical' },
  { value: 'redhat', label: 'Red Hat' },
  { value: 'f5-networks', label: 'F5 Networks' },
  { value: 'datadog', label: 'Datadog' },
  { value: 'splunk', label: 'Splunk' },
  { value: 'paloaltonetworks', label: 'Palo Alto Networks' },
];

export const MicrosoftMarketplaceCredentials = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromVendorIntegrations = location.state?.from === 'vendor-integrations';
  
  // Demo toggle state
  const [demoEnabled, setDemoEnabled] = useState(true);
  
  // Load demo state from localStorage on mount
  useEffect(() => {
    setDemoEnabled(getDistiConfig('microsoftmarketplace'));
  }, []);

  // Handle demo toggle change
  const handleDemoToggle = (enabled: boolean) => {
    setDemoEnabled(enabled);
    setDistiConfig('microsoftmarketplace', enabled);
  };
  
  // Form state
  const [formData, setFormData] = useState({
    tenantId: '',
    clientId: '',
    clientSecret: '',
    subscriptionId: '',
    apiKey: '',
  });
  
  // UI state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('credentials');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Catalog browser state
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<MarketplaceProduct[]>(sampleMarketplaceProducts);
  const [filteredProducts, setFilteredProducts] = useState<MarketplaceProduct[]>(sampleMarketplaceProducts);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productTypeFilter, setProductTypeFilter] = useState('');
  const [publisherFilter, setPublisherFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const productsPerPage = 5;

  // Markup state
  const [markupPercentage, setMarkupPercentage] = useState('20');

  // Filter products when search or filters change
  useEffect(() => {
    let filtered = products;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.displayName.toLowerCase().includes(query) ||
        p.publisherDisplayName.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.productType.toLowerCase().includes(query)
      );
    }
    
    if (productTypeFilter) {
      filtered = filtered.filter(p => p.productType === productTypeFilter);
    }
    
    if (publisherFilter) {
      filtered = filtered.filter(p => p.publisherId === publisherFilter);
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, productTypeFilter, publisherFilter, products]);

  // Paginated products
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.apiKey.trim() && !formData.tenantId.trim()) {
      newErrors.apiKey = 'Either API Key or Azure AD credentials are required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate form completion percentage
  const getCompletionPercentage = () => {
    const fields = ['tenantId', 'clientId', 'apiKey'];
    const filled = fields.filter(f => formData[f as keyof typeof formData]).length;
    return Math.round((filled / fields.length) * 100);
  };

  // Test connection
  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnectionStatus('testing');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnectionStatus('connected');
    setIsTesting(false);
    
    notifications.show({
      title: 'Connection Successful',
      message: 'Successfully connected to Microsoft Marketplace Catalog API.',
      color: 'green',
      icon: <CheckCircle2 size={16} />,
    });
  };

  // Search catalog (simulate API call)
  const handleSearchCatalog = async () => {
    setIsLoading(true);
    
    // Simulate API call to Microsoft Marketplace Catalog
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    
    notifications.show({
      title: 'Catalog Updated',
      message: `Found ${filteredProducts.length} products matching your criteria.`,
      color: 'blue',
      icon: <Search size={16} />,
    });
  };

  // Import selected products
  const handleImportProducts = async () => {
    if (selectedProducts.length === 0) {
      notifications.show({
        title: 'No Products Selected',
        message: 'Please select at least one product to import.',
        color: 'yellow',
        icon: <AlertCircle size={16} />,
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);

    notifications.show({
      title: 'Products Imported',
      message: `Successfully imported ${selectedProducts.length} products to staging catalog.`,
      color: 'green',
      icon: <CheckCircle2 size={16} />,
    });

    setSelectedProducts([]);
  };

  // Save credentials
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    
    notifications.show({
      title: 'Credentials Saved',
      message: 'Your Microsoft Marketplace credentials have been saved successfully.',
      color: 'green',
      icon: <CheckCircle2 size={16} />,
    });
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(-1);
  };

  // Get status badge
  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <Badge color="green" variant="light" leftSection={<CheckCircle2 size={12} />}>
            Connected
          </Badge>
        );
      case 'testing':
        return (
          <Badge color="blue" variant="light" leftSection={<Loader size={12} />}>
            Testing...
          </Badge>
        );
      case 'error':
        return (
          <Badge color="red" variant="light" leftSection={<AlertCircle size={12} />}>
            Connection Failed
          </Badge>
        );
      default:
        return (
          <Badge color="gray" variant="light">
            Not Connected
          </Badge>
        );
    }
  };

  // Get product type badge color
  const getProductTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      'VirtualMachine': 'blue',
      'SaaS': 'green',
      'ContainerApps': 'cyan',
      'DynamicsCE': 'violet',
      'Office365': 'orange',
      'Power BI': 'yellow',
    };
    return colors[type] || 'gray';
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--mantine-color-gray-0)' }}>
      <TopNavbar />
      
      <Container size="lg" py="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs mb="lg" separator="›">
          <Anchor onClick={() => navigate('/home')} c="dimmed" size="sm">
            Home
          </Anchor>
          <Anchor onClick={() => navigate('/settings/vendor-integrations')} c="dimmed" size="sm">
            Vendor Integrations
          </Anchor>
          <Text size="sm" c="dark">Microsoft Marketplace</Text>
        </Breadcrumbs>

        {/* Back button */}
        <Button
          variant="subtle"
          color="gray"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate(fromVendorIntegrations ? '/settings/vendor-integrations' : '/home')}
          mb="lg"
          px={0}
        >
          Back to {fromVendorIntegrations ? 'Vendor Integrations' : 'Home'}
        </Button>

        {/* Header */}
        <Paper withBorder radius="lg" p="xl" mb="lg" shadow="sm">
          <Group justify="space-between" align="flex-start" mb="md">
            <Group>
              <Box
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cloud size={28} color="white" />
              </Box>
              <Stack gap={4}>
                <Group gap="sm">
                  <Title order={2} fw={600}>Microsoft Marketplace</Title>
                  <Badge color="blue" variant="dot" size="lg">Azure</Badge>
                </Group>
                <Text c="dimmed" size="sm">
                  Connect to Azure Marketplace Catalog API to discover and import commercial products.
                </Text>
              </Stack>
            </Group>
            {getStatusBadge()}
          </Group>

          {/* Completion progress */}
          <Box mb="md">
            <Group justify="space-between" mb={4}>
              <Text size="xs" c="dimmed">Setup Progress</Text>
              <Text size="xs" c="dimmed">{completionPercentage}%</Text>
            </Group>
            <Progress 
              value={completionPercentage} 
              size="sm" 
              radius="xl"
              color={completionPercentage === 100 ? 'green' : 'blue'}
            />
          </Box>

          <Divider mb="md" />

          {/* Help info */}
          <Alert 
            icon={<Info size={16} />} 
            color="blue" 
            variant="light"
            radius="md"
          >
            <Text size="sm">
              Access the Microsoft Marketplace Catalog using Discovery APIs. Learn more at the{' '}
              <Anchor href="https://learn.microsoft.com/en-us/rest/api/marketplacecatalog/" target="_blank" inline>
                official documentation <ExternalLink size={12} style={{ display: 'inline', marginLeft: 2 }} />
              </Anchor>
            </Text>
          </Alert>
        </Paper>

        {/* Tabs for Credentials and Catalog Browser */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List mb="lg">
            <Tabs.Tab value="credentials" leftSection={<Key size={16} />}>
              API Credentials
            </Tabs.Tab>
            <Tabs.Tab value="catalog" leftSection={<Package size={16} />}>
              Browse Catalog
            </Tabs.Tab>
          </Tabs.List>

          {/* Credentials Tab */}
          <Tabs.Panel value="credentials">
            {/* Azure AD Credentials */}
            <Paper withBorder radius="lg" p="xl" mb="lg" shadow="sm">
              <Group mb="lg">
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <Shield size={18} />
                </ThemeIcon>
                <div>
                  <Title order={4}>Azure Resource Manager Authentication</Title>
                  <Text size="sm" c="dimmed">For authenticated access to private plans and preview products</Text>
                </div>
              </Group>

              <Stack gap="lg">
                <TextInput
                  label={
                    <Group gap={4}>
                      <span>Tenant ID (Directory ID)</span>
                      <Tooltip label="Your Azure AD tenant identifier" withArrow>
                        <HelpCircle size={14} style={{ color: 'var(--mantine-color-gray-5)', cursor: 'help' }} />
                      </Tooltip>
                    </Group>
                  }
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={formData.tenantId}
                  onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                  leftSection={<Building2 size={16} />}
                  size="md"
                  radius="md"
                />

                <TextInput
                  label={
                    <Group gap={4}>
                      <span>Client ID (Application ID)</span>
                      <Tooltip label="Your registered application's client ID" withArrow>
                        <HelpCircle size={14} style={{ color: 'var(--mantine-color-gray-5)', cursor: 'help' }} />
                      </Tooltip>
                    </Group>
                  }
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  leftSection={<Key size={16} />}
                  size="md"
                  radius="md"
                />

                <PasswordInput
                  label={
                    <Group gap={4}>
                      <span>Client Secret</span>
                      <Tooltip label="Your application's client secret" withArrow>
                        <HelpCircle size={14} style={{ color: 'var(--mantine-color-gray-5)', cursor: 'help' }} />
                      </Tooltip>
                    </Group>
                  }
                  placeholder="Enter your client secret"
                  value={formData.clientSecret}
                  onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
                  size="md"
                  radius="md"
                />

                <TextInput
                  label="Subscription ID (Optional)"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={formData.subscriptionId}
                  onChange={(e) => setFormData({ ...formData, subscriptionId: e.target.value })}
                  size="md"
                  radius="md"
                />
              </Stack>
            </Paper>

            {/* API Key Authentication */}
            <Paper withBorder radius="lg" p="xl" mb="lg" shadow="sm">
              <Group mb="lg">
                <ThemeIcon size="lg" radius="md" variant="light" color="violet">
                  <Key size={18} />
                </ThemeIcon>
                <div>
                  <Title order={4}>Public API Key Authentication</Title>
                  <Text size="sm" c="dimmed">For public product data access (simpler setup)</Text>
                </div>
              </Group>

              <TextInput
                label={
                  <Group gap={4}>
                    <span>API Key</span>
                    <Tooltip label="Self-serve onboarded API key for public endpoints" withArrow>
                      <HelpCircle size={14} style={{ color: 'var(--mantine-color-gray-5)', cursor: 'help' }} />
                    </Tooltip>
                  </Group>
                }
                placeholder="Enter your Marketplace Catalog API key"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                error={errors.apiKey}
                leftSection={<Key size={16} />}
                size="md"
                radius="md"
              />
            </Paper>

            {/* Markup Configuration */}
            <Paper withBorder radius="lg" p="xl" mb="lg" shadow="sm">
              <Group mb="lg">
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <Hash size={18} />
                </ThemeIcon>
                <div>
                  <Title order={4}>Markup Configuration</Title>
                  <Text size="sm" c="dimmed">Set the default markup for products imported from Microsoft Marketplace</Text>
                </div>
              </Group>

              <Box mb="md">
                <Text size="sm" fw={500} mb={8}>Markup fee for cloud products</Text>
                <Group gap="xs">
                  <TextInput
                    type="number"
                    min={0}
                    max={100}
                    value={markupPercentage}
                    onChange={(e) => setMarkupPercentage(e.target.value)}
                    style={{ width: 80 }}
                    styles={{ input: { textAlign: 'center' } }}
                  />
                  <Text size="sm" c="dimmed" fw={500}>%</Text>
                </Group>
                <Text size="xs" c="dimmed" mt={8}>
                  A markup fee applies to all products selected for publishing from Microsoft Marketplace.
                </Text>
              </Box>
            </Paper>

            {/* Security Notice */}
            <Alert 
              icon={<Shield size={16} />} 
              color="green" 
              variant="light"
              radius="lg"
              mb="lg"
            >
              <Text size="sm" fw={500} mb={4}>Your credentials are secure</Text>
              <Text size="sm" c="dimmed">
                All API credentials are encrypted at rest and in transit using industry-standard encryption.
              </Text>
            </Alert>

            {/* Demo Toggle */}
            <Paper withBorder radius="lg" p="lg" mb="lg" shadow="sm" bg="yellow.0">
              <Group justify="space-between" align="center">
                <div>
                  <Group gap="xs">
                    <Badge color="yellow" variant="filled" size="sm">DEMO</Badge>
                    <Text size="sm" fw={500}>Demo Mode: Connection Enabled</Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={4}>
                    Toggle off to simulate this distributor not being configured (for testing "Add Disti Product" button)
                  </Text>
                </div>
                <Switch
                  checked={demoEnabled}
                  onChange={(e) => handleDemoToggle(e.currentTarget.checked)}
                  color="blue"
                  size="md"
                  onLabel="ON"
                  offLabel="OFF"
                />
              </Group>
            </Paper>

            {/* Action Buttons */}
            <Paper withBorder radius="lg" p="lg" shadow="sm">
              <Group justify="space-between">
                <Button
                  variant="outline"
                  color="blue"
                  leftSection={isTesting ? <Loader size={16} /> : <RefreshCw size={16} />}
                  onClick={handleTestConnection}
                  loading={isTesting}
                  disabled={isSaving}
                >
                  Test Connection
                </Button>

                <Group>
                  <Button
                    variant="subtle"
                    color="gray"
                    leftSection={<X size={16} />}
                    onClick={handleCancel}
                    disabled={isTesting || isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="blue"
                    leftSection={<Save size={16} />}
                    onClick={handleSave}
                    loading={isSaving}
                    disabled={isTesting}
                  >
                    Save Credentials
                  </Button>
                </Group>
              </Group>
            </Paper>
          </Tabs.Panel>

          {/* Catalog Browser Tab */}
          <Tabs.Panel value="catalog">
            {/* Search and Filters */}
            <Paper withBorder radius="lg" p="lg" mb="lg" shadow="sm">
              <Group mb="md">
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <Search size={18} />
                </ThemeIcon>
                <div>
                  <Title order={4}>Discovery APIs - Product Search</Title>
                  <Text size="sm" c="dimmed">
                    Search across Microsoft Commercial and Marketplace Commercial products
                  </Text>
                </div>
              </Group>

              <Group mb="md" grow>
                <TextInput
                  placeholder="Search products by name, publisher, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftSection={<Search size={16} />}
                  rightSection={
                    searchQuery && (
                      <ActionIcon variant="subtle" onClick={() => setSearchQuery('')}>
                        <X size={14} />
                      </ActionIcon>
                    )
                  }
                />
              </Group>

              <Group mb="md">
                <Select
                  placeholder="Product Type"
                  data={productTypeOptions}
                  value={productTypeFilter}
                  onChange={(v) => setProductTypeFilter(v || '')}
                  leftSection={<Filter size={16} />}
                  clearable
                  style={{ width: 200 }}
                />
                <Select
                  placeholder="Publisher"
                  data={publisherOptions}
                  value={publisherFilter}
                  onChange={(v) => setPublisherFilter(v || '')}
                  leftSection={<Building2 size={16} />}
                  clearable
                  style={{ width: 200 }}
                />
                <Button
                  variant="filled"
                  color="blue"
                  leftSection={<Search size={16} />}
                  onClick={handleSearchCatalog}
                  loading={isLoading}
                >
                  Search Catalog
                </Button>
              </Group>

              <Alert icon={<Info size={16} />} color="blue" variant="light" radius="md">
                <Text size="sm">
                  <strong>OData Query Support:</strong> The Discovery APIs support OData standards including{' '}
                  <Code>$filter</Code>, <Code>$select</Code>, <Code>$expand</Code>, and <Code>$orderby</Code>{' '}
                  for advanced filtering and sorting.
                </Text>
              </Alert>
            </Paper>

            {/* Product Results */}
            <Paper withBorder radius="lg" shadow="sm" style={{ overflow: 'hidden' }}>
              <Box p="md" style={{ borderBottom: '1px solid #e9ecef' }}>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    {filteredProducts.length} products found
                    {selectedProducts.length > 0 && ` • ${selectedProducts.length} selected`}
                  </Text>
                  <Button
                    color="green"
                    size="sm"
                    leftSection={<ShoppingCart size={16} />}
                    onClick={handleImportProducts}
                    disabled={selectedProducts.length === 0}
                    loading={isLoading}
                  >
                    Import Selected ({selectedProducts.length})
                  </Button>
                </Group>
              </Box>

              {isLoading ? (
                <Box p="xl" style={{ textAlign: 'center' }}>
                  <Loader size="lg" />
                  <Text size="sm" c="dimmed" mt="md">Querying Microsoft Marketplace Catalog API...</Text>
                </Box>
              ) : (
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ width: 40 }}>
                        <Checkbox
                          checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                          indeterminate={selectedProducts.length > 0 && selectedProducts.length < paginatedProducts.length}
                          onChange={(e) => {
                            if (e.currentTarget.checked) {
                              setSelectedProducts(paginatedProducts.map(p => p.id));
                            } else {
                              setSelectedProducts([]);
                            }
                          }}
                        />
                      </Table.Th>
                      <Table.Th>Product</Table.Th>
                      <Table.Th>Publisher</Table.Th>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Pricing</Table.Th>
                      <Table.Th style={{ width: 100 }}>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedProducts.map((product) => (
                      <Table.Tr key={product.id}>
                        <Table.Td>
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => {
                              if (e.currentTarget.checked) {
                                setSelectedProducts([...selectedProducts, product.id]);
                              } else {
                                setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                              }
                            }}
                          />
                        </Table.Td>
                        <Table.Td>
                          <Group gap="sm">
                            <Box
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 8,
                                background: `linear-gradient(135deg, ${getProductTypeBadgeColor(product.productType) === 'blue' ? '#0078d4' : '#6366f1'} 0%, ${getProductTypeBadgeColor(product.productType) === 'blue' ? '#106ebe' : '#818cf8'} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Package size={20} color="white" />
                            </Box>
                            <div>
                              <Text size="sm" fw={500}>{product.displayName}</Text>
                              <Text size="xs" c="dimmed" lineClamp={1} style={{ maxWidth: 300 }}>
                                {product.summary}
                              </Text>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{product.publisherDisplayName}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getProductTypeBadgeColor(product.productType)} variant="light" size="sm">
                            {product.productType}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            {product.pricingTypes?.slice(0, 2).map((type) => (
                              <Badge key={type} color="gray" variant="outline" size="xs">
                                {type}
                              </Badge>
                            ))}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            <Tooltip label="View Details">
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setDetailsModalOpen(true);
                                }}
                              >
                                <Eye size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Import Product">
                              <ActionIcon
                                variant="subtle"
                                color="green"
                                onClick={() => {
                                  if (!selectedProducts.includes(product.id)) {
                                    setSelectedProducts([...selectedProducts, product.id]);
                                  }
                                }}
                              >
                                <Download size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box p="md" style={{ borderTop: '1px solid #e9ecef' }}>
                  <Group justify="center">
                    <Pagination
                      value={currentPage}
                      onChange={setCurrentPage}
                      total={totalPages}
                      color="blue"
                    />
                  </Group>
                </Box>
              )}
            </Paper>

            {/* Supported Product Families */}
            <Paper withBorder radius="lg" p="lg" mt="lg" shadow="sm">
              <Title order={5} mb="md">Supported Product Families</Title>
              <Group gap="xs">
                {['SaaS', 'VirtualMachine', 'AzureApplication', 'DynamicsCE', 'DynamicsBC', 'ContainerApps', 
                  'Container', 'ConsultingServices', 'ManagedServices', 'Power BI', 'Office365', 'AADApps'].map((family) => (
                  <Badge key={family} color="blue" variant="light" size="sm">
                    {family}
                  </Badge>
                ))}
              </Group>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Container>

      {/* Product Details Modal */}
      <Modal
        opened={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={
          <Group>
            <Cloud size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
            <Text fw={600}>Product Details</Text>
          </Group>
        }
        size="lg"
      >
        {selectedProduct && (
          <Stack gap="md">
            <Group>
              <Box
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Package size={28} color="white" />
              </Box>
              <div>
                <Title order={4}>{selectedProduct.displayName}</Title>
                <Text size="sm" c="dimmed">by {selectedProduct.publisherDisplayName}</Text>
              </div>
            </Group>

            <Divider />

            <div>
              <Text size="sm" fw={500} mb={4}>Summary</Text>
              <Text size="sm" c="dimmed">{selectedProduct.summary}</Text>
            </div>

            <Group>
              <div>
                <Text size="sm" fw={500} mb={4}>Product Type</Text>
                <Badge color={getProductTypeBadgeColor(selectedProduct.productType)} variant="light">
                  {selectedProduct.productType}
                </Badge>
              </div>
              <div>
                <Text size="sm" fw={500} mb={4}>Pricing Options</Text>
                <Group gap={4}>
                  {selectedProduct.pricingTypes?.map((type) => (
                    <Badge key={type} color="gray" variant="outline" size="sm">
                      {type}
                    </Badge>
                  ))}
                </Group>
              </div>
            </Group>

            {selectedProduct.categories && (
              <div>
                <Text size="sm" fw={500} mb={4}>Categories</Text>
                <Group gap={4}>
                  {selectedProduct.categories.map((cat) => (
                    <Badge key={cat} color="blue" variant="light" size="sm">
                      {cat}
                    </Badge>
                  ))}
                </Group>
              </div>
            )}

            <Alert icon={<Info size={16} />} color="blue" variant="light">
              <Text size="sm">
                Product ID: <Code>{selectedProduct.id}</Code>
              </Text>
            </Alert>

            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>
                Close
              </Button>
              <Button
                color="green"
                leftSection={<ShoppingCart size={16} />}
                onClick={() => {
                  if (!selectedProducts.includes(selectedProduct.id)) {
                    setSelectedProducts([...selectedProducts, selectedProduct.id]);
                  }
                  setDetailsModalOpen(false);
                  notifications.show({
                    title: 'Product Added',
                    message: `${selectedProduct.displayName} added to import queue.`,
                    color: 'green',
                  });
                }}
              >
                Add to Import
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  );
};

