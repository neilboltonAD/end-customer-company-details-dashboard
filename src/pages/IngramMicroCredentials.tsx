import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Switch,
  Collapse,
  Progress,
  Loader,
} from '@mantine/core';

// Helper to get/set distributor config in localStorage
const getDistiConfig = (distiId: string): boolean => {
  const config = localStorage.getItem('configuredDistributors');
  if (!config) return true; // Default to enabled
  const parsed = JSON.parse(config);
  return parsed[distiId] !== false;
};

const setDistiConfig = (distiId: string, enabled: boolean) => {
  const config = localStorage.getItem('configuredDistributors');
  const parsed = config ? JSON.parse(config) : {};
  parsed[distiId] = enabled;
  localStorage.setItem('configuredDistributors', JSON.stringify(parsed));
};
import { notifications } from '@mantine/notifications';
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  X,
  Info,
  Lock,
  Key,
  Globe,
  Building2,
  FileText,
  Hash,
} from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';

// Connection status type
type ConnectionStatus = 'connected' | 'disconnected' | 'testing' | 'error';

export const IngramMicroCredentials = () => {
  const navigate = useNavigate();
  
  // Demo toggle state
  const [demoEnabled, setDemoEnabled] = useState(true);
  
  // Load demo state from localStorage on mount
  useEffect(() => {
    setDemoEnabled(getDistiConfig('ingrammicro'));
  }, []);

  // Handle demo toggle change
  const handleDemoToggle = (enabled: boolean) => {
    setDemoEnabled(enabled);
    setDistiConfig('ingrammicro', enabled);
  };
  
  // Form state
  const [formData, setFormData] = useState({
    customerNumber: '',
    apiKey: '',
    apiSecret: '',
    country: 'US',
    environment: 'production',
    sandboxMode: false,
  });
  
  // UI state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Country options
  const countryOptions = [
    { value: 'US', label: '🇺🇸 United States' },
    { value: 'CA', label: '🇨🇦 Canada' },
    { value: 'GB', label: '🇬🇧 United Kingdom' },
    { value: 'DE', label: '🇩🇪 Germany' },
    { value: 'FR', label: '🇫🇷 France' },
    { value: 'AU', label: '🇦🇺 Australia' },
    { value: 'MX', label: '🇲🇽 Mexico' },
    { value: 'BR', label: '🇧🇷 Brazil' },
  ];

  // Environment options
  const environmentOptions = [
    { value: 'production', label: 'Production' },
    { value: 'sandbox', label: 'Sandbox (Testing)' },
  ];

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerNumber.trim()) {
      newErrors.customerNumber = 'Customer number is required';
    }
    
    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
    }
    
    if (!formData.apiSecret.trim()) {
      newErrors.apiSecret = 'API Secret is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate form completion percentage
  const getCompletionPercentage = () => {
    const fields = ['customerNumber', 'apiKey', 'apiSecret'];
    const filled = fields.filter(f => formData[f as keyof typeof formData]).length;
    return Math.round((filled / fields.length) * 100);
  };

  // Test connection
  const handleTestConnection = async () => {
    if (!validateForm()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please fill in all required fields before testing the connection.',
        color: 'red',
        icon: <AlertCircle size={16} />,
      });
      return;
    }

    setIsTesting(true);
    setConnectionStatus('testing');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success (in real app, this would be an actual API call)
    setConnectionStatus('connected');
    setIsTesting(false);
    
    notifications.show({
      title: 'Connection Successful',
      message: 'Successfully connected to Ingram Micro API.',
      color: 'green',
      icon: <CheckCircle2 size={16} />,
    });
  };

  // Save credentials
  const handleSave = async () => {
    if (!validateForm()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please fill in all required fields.',
        color: 'red',
        icon: <AlertCircle size={16} />,
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    
    notifications.show({
      title: 'Credentials Saved',
      message: 'Your Ingram Micro credentials have been saved successfully.',
      color: 'green',
      icon: <CheckCircle2 size={16} />,
    });
  };

  // Handle cancel - go back to previous page
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

  const completionPercentage = getCompletionPercentage();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--mantine-color-gray-0)' }}>
      <TopNavbar />
      
      <Container size="md" py="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs mb="lg" separator="›">
          <Anchor onClick={() => navigate('/home')} c="dimmed" size="sm">
            Home
          </Anchor>
          <Anchor onClick={() => navigate('/home')} c="dimmed" size="sm">
            Import Products
          </Anchor>
          <Text size="sm" c="dark">Ingram Micro</Text>
        </Breadcrumbs>

        {/* Back button */}
        <Button
          variant="subtle"
          color="gray"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
          mb="lg"
          px={0}
        >
          Back
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
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e5e7eb',
                }}
              >
                <Text fw={700} size="xs" c="gray.6">INGRAM</Text>
              </Box>
              <Stack gap={4}>
                <Group gap="sm">
                  <Title order={2} fw={600}>Ingram Micro</Title>
                  <Badge color="green" variant="dot" size="lg">Active</Badge>
                </Group>
                <Text c="dimmed" size="sm">
                  Configure your Ingram Micro API credentials to enable product import and synchronization.
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
              Need help finding your credentials? Visit the{' '}
              <Anchor href="https://developer.ingrammicro.com" target="_blank" inline>
                Ingram Micro Developer Portal <ExternalLink size={12} style={{ display: 'inline', marginLeft: 2 }} />
              </Anchor>
              {' '}to access your API keys and documentation.
            </Text>
          </Alert>
        </Paper>

        {/* Credentials Form */}
        <Paper withBorder radius="lg" p="xl" mb="lg" shadow="sm">
          <Group mb="lg">
            <ThemeIcon size="lg" radius="md" variant="light" color="blue">
              <Key size={18} />
            </ThemeIcon>
            <div>
              <Title order={4}>API Credentials</Title>
              <Text size="sm" c="dimmed">Enter your Ingram Micro API credentials</Text>
            </div>
          </Group>

          <Stack gap="lg">
            {/* Customer Number */}
            <TextInput
              label={
                <Group gap={4}>
                  <span>Customer Number</span>
                  <Tooltip label="Your unique Ingram Micro customer identifier" withArrow>
                    <HelpCircle size={14} style={{ color: 'var(--mantine-color-gray-5)', cursor: 'help' }} />
                  </Tooltip>
                </Group>
              }
              placeholder="Enter your customer number"
              value={formData.customerNumber}
              onChange={(e) => setFormData({ ...formData, customerNumber: e.target.value })}
              error={errors.customerNumber}
              leftSection={<Building2 size={16} />}
              required
              size="md"
              radius="md"
            />

            {/* API Key */}
            <TextInput
              label={
                <Group gap={4}>
                  <span>API Key (Client ID)</span>
                  <Tooltip label="Your public API key from the developer portal" withArrow>
                    <HelpCircle size={14} style={{ color: 'var(--mantine-color-gray-5)', cursor: 'help' }} />
                  </Tooltip>
                </Group>
              }
              placeholder="Enter your API key"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              error={errors.apiKey}
              leftSection={<Key size={16} />}
              required
              size="md"
              radius="md"
            />

            {/* API Secret */}
            <PasswordInput
              label={
                <Group gap={4}>
                  <span>API Secret (Client Secret)</span>
                  <Tooltip label="Your private API secret - keep this secure" withArrow>
                    <HelpCircle size={14} style={{ color: 'var(--mantine-color-gray-5)', cursor: 'help' }} />
                  </Tooltip>
                </Group>
              }
              placeholder="Enter your API secret"
              value={formData.apiSecret}
              onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
              error={errors.apiSecret}
              leftSection={<Lock size={16} />}
              required
              size="md"
              radius="md"
              visibilityToggleIcon={({ reveal }) =>
                reveal ? <EyeOff size={16} /> : <Eye size={16} />
              }
            />

            {/* Country */}
            <Select
              label={
                <Group gap={4}>
                  <span>Country / Region</span>
                  <Tooltip label="Select your Ingram Micro regional endpoint" withArrow>
                    <HelpCircle size={14} style={{ color: 'var(--mantine-color-gray-5)', cursor: 'help' }} />
                  </Tooltip>
                </Group>
              }
              placeholder="Select your country"
              data={countryOptions}
              value={formData.country}
              onChange={(value) => setFormData({ ...formData, country: value || 'US' })}
              leftSection={<Globe size={16} />}
              size="md"
              radius="md"
              searchable
            />
          </Stack>
        </Paper>

        {/* Advanced Settings */}
        <Paper withBorder radius="lg" p="xl" mb="lg" shadow="sm">
          <Group justify="space-between" mb={showAdvanced ? 'lg' : 0}>
            <Group>
              <ThemeIcon size="lg" radius="md" variant="light" color="gray">
                <FileText size={18} />
              </ThemeIcon>
              <div>
                <Title order={4}>Advanced Settings</Title>
                <Text size="sm" c="dimmed">Optional configuration options</Text>
              </div>
            </Group>
            <Button 
              variant="subtle" 
              color="gray"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'}
            </Button>
          </Group>

          <Collapse in={showAdvanced}>
            <Stack gap="lg">
              {/* Environment */}
              <Select
                label="Environment"
                description="Choose between production and sandbox environments for testing"
                data={environmentOptions}
                value={formData.environment}
                onChange={(value) => setFormData({ ...formData, environment: value || 'production' })}
                size="md"
                radius="md"
              />

              {/* Sandbox Mode Toggle */}
              <Switch
                label="Enable Sandbox Mode"
                description="Use sandbox endpoints for testing without affecting production data"
                checked={formData.sandboxMode}
                onChange={(e) => setFormData({ ...formData, sandboxMode: e.currentTarget.checked })}
                size="md"
              />
            </Stack>
          </Collapse>
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
            We never store your credentials in plain text.
          </Text>
        </Alert>

        {/* Markup Configuration */}
        <Paper withBorder radius="lg" p="xl" mb="lg" shadow="sm">
          <Group mb="lg">
            <ThemeIcon size="lg" radius="md" variant="light" color="blue">
              <Hash size={18} />
            </ThemeIcon>
            <div>
              <Title order={4}>Markup Configuration</Title>
              <Text size="sm" c="dimmed">Set the default markup for products imported from Ingram Micro</Text>
            </div>
          </Group>

          <Box mb="md">
            <Text size="sm" fw={500} mb={8}>Markup fee for physical products</Text>
            <Group gap="xs">
              <TextInput
                type="number"
                min={0}
                max={100}
                defaultValue="18"
                style={{ width: 80 }}
                styles={{ input: { textAlign: 'center' } }}
              />
              <Text size="sm" c="dimmed" fw={500}>%</Text>
            </Group>
            <Text size="xs" c="dimmed" mt={8}>
              A markup fee applies to all products selected for publishing from this distributor.
            </Text>
          </Box>
        </Paper>

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
      </Container>
    </div>
  );
};

