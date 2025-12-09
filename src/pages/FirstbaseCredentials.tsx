import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
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
} from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';

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

// Connection status type
type ConnectionStatus = 'connected' | 'disconnected' | 'testing' | 'error';

export const FirstbaseCredentials = () => {
  const navigate = useNavigate();
  
  // Demo toggle state
  const [demoEnabled, setDemoEnabled] = useState(true);
  
  // Load demo state from localStorage on mount
  useEffect(() => {
    setDemoEnabled(getDistiConfig('firstbase'));
  }, []);

  // Handle demo toggle change
  const handleDemoToggle = (enabled: boolean) => {
    setDemoEnabled(enabled);
    setDistiConfig('firstbase', enabled);
  };
  
  // Form state
  const [formData, setFormData] = useState({
    apiKey: '',
    accountId: '',
  });
  
  // UI state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
    }
    if (!formData.accountId.trim()) {
      newErrors.accountId = 'Account ID is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate form completion percentage
  const getCompletionPercentage = () => {
    const fields = ['apiKey', 'accountId'];
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
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnectionStatus('connected');
    setIsTesting(false);
    
    notifications.show({
      title: 'Connection Successful',
      message: 'Successfully connected to Firstbase API.',
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    
    notifications.show({
      title: 'Credentials Saved',
      message: 'Your Firstbase credentials have been saved successfully.',
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
          <Badge color="blue" variant="light" leftSection={<RefreshCw size={12} className="animate-spin" />}>
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
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      
      <Container size="md" py="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs mb="lg" separator="›">
          <Anchor onClick={() => navigate('/home')} c="dimmed" size="sm">
            Home
          </Anchor>
          <Anchor onClick={() => navigate('/settings/vendor-integrations')} c="dimmed" size="sm">
            Vendor Integrations
          </Anchor>
          <Text size="sm" c="dark">Firstbase</Text>
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
                  backgroundColor: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #bae6fd',
                }}
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7 text-cyan-600" fill="currentColor">
                  <path d="M13 3L4 14h7v7l9-11h-7V3z" />
                </svg>
              </Box>
              <Stack gap={4}>
                <Group gap="sm">
                  <Title order={2} fw={600}>Firstbase</Title>
                  <Badge color="green" variant="dot" size="lg">Active</Badge>
                </Group>
                <Text c="dimmed" size="sm">
                  Configure your Firstbase API credentials to enable product catalog access.
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
              color={completionPercentage === 100 ? 'green' : 'cyan'}
            />
          </Box>

          <Divider mb="md" />

          {/* Help info */}
          <Alert 
            icon={<Info size={16} />} 
            color="cyan" 
            variant="light"
            radius="md"
          >
            <Text size="sm">
              Need help finding your credentials? Contact your Firstbase account manager or visit the{' '}
              <Anchor href="https://firstbase.com" target="_blank" inline>
                Firstbase Portal <ExternalLink size={12} style={{ display: 'inline', marginLeft: 2 }} />
              </Anchor>
            </Text>
          </Alert>
        </Paper>

        {/* Credentials Form */}
        <Paper withBorder radius="lg" p="xl" mb="lg" shadow="sm">
          <Group mb="lg">
            <ThemeIcon size="lg" radius="md" variant="light" color="cyan">
              <Key size={18} />
            </ThemeIcon>
            <div>
              <Title order={4}>API Credentials</Title>
              <Text size="sm" c="dimmed">Enter your Firstbase API credentials</Text>
            </div>
          </Group>

          <Stack gap="lg">
            <TextInput
              label={
                <Group gap={4}>
                  <span>Account ID</span>
                  <Tooltip label="Your unique Firstbase account identifier" withArrow>
                    <HelpCircle size={14} className="text-gray-400 cursor-help" />
                  </Tooltip>
                </Group>
              }
              placeholder="Enter your account ID"
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              error={errors.accountId}
              leftSection={<Building2 size={16} />}
              required
              size="md"
              radius="md"
            />

            <TextInput
              label={
                <Group gap={4}>
                  <span>API Key</span>
                  <Tooltip label="Your Firstbase API key" withArrow>
                    <HelpCircle size={14} className="text-gray-400 cursor-help" />
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
          </Stack>
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

        {/* Markup Configuration */}
        <Paper withBorder radius="lg" p="xl" mb="lg" shadow="sm">
          <Group mb="lg">
            <ThemeIcon size="lg" radius="md" variant="light" color="cyan">
              <Hash size={18} />
            </ThemeIcon>
            <div>
              <Title order={4}>Markup Configuration</Title>
              <Text size="sm" c="dimmed">Set the default markup for products imported from Firstbase</Text>
            </div>
          </Group>

          <div className="mb-4">
            <Text size="sm" fw={500} mb={8}>Markup fee for physical products</Text>
            <Group gap="xs">
              <TextInput
                type="number"
                min={0}
                max={100}
                defaultValue="12"
                style={{ width: 80 }}
                styles={{ input: { textAlign: 'center' } }}
              />
              <Text size="sm" c="dimmed" fw={500}>%</Text>
            </Group>
            <Text size="xs" c="dimmed" mt={8}>
              A markup fee applies to all products selected for publishing from this distributor.
            </Text>
          </div>
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
              color="cyan"
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
              color="cyan"
              leftSection={<RefreshCw size={16} className={isTesting ? 'animate-spin' : ''} />}
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
                color="cyan"
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

