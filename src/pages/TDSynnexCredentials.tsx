import React, { useState } from 'react';
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
  Progress,
} from '@mantine/core';
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
  Mail,
  Hash,
  Globe,
} from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';

// Connection status type
type ConnectionStatus = 'connected' | 'disconnected' | 'testing' | 'error';

export const TDSynnexCredentials = () => {
  const navigate = useNavigate();
  
  // Form state - matching the fields from the screenshot
  const [formData, setFormData] = useState({
    accountNumber: '609928',
    email: 'synnex_testing@appsmart.com',
    password: '',
    distributorMarket: 'US',
  });
  
  // UI state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Distributor Market options
  const marketOptions = [
    { value: 'US', label: '🇺🇸 United States' },
    { value: 'CA', label: '🇨🇦 Canada' },
    { value: 'GB', label: '🇬🇧 United Kingdom' },
    { value: 'DE', label: '🇩🇪 Germany' },
    { value: 'FR', label: '🇫🇷 France' },
    { value: 'AU', label: '🇦🇺 Australia' },
    { value: 'MX', label: '🇲🇽 Mexico' },
    { value: 'JP', label: '🇯🇵 Japan' },
  ];

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Account number must be numeric';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate form completion percentage
  const getCompletionPercentage = () => {
    const fields = ['accountNumber', 'email', 'password'];
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
    
    // Simulate success
    setConnectionStatus('connected');
    setIsTesting(false);
    
    notifications.show({
      title: 'Connection Successful',
      message: 'Successfully connected to TD SYNNEX API.',
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
      message: 'Your TD SYNNEX credentials have been updated successfully.',
      color: 'green',
      icon: <CheckCircle2 size={16} />,
    });
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/home');
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
          <Anchor onClick={() => navigate('/home')} c="dimmed" size="sm">
            Import Products
          </Anchor>
          <Text size="sm" c="dark">TD SYNNEX</Text>
        </Breadcrumbs>

        {/* Back button */}
        <Button
          variant="subtle"
          color="gray"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate('/home')}
          mb="lg"
          px={0}
        >
          Back to Home
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
                  backgroundColor: '#0d9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #0f766e',
                }}
              >
                <Text fw={700} size="xs" c="white">TD</Text>
              </Box>
              <Stack gap={4}>
                <Group gap="sm">
                  <Title order={2} fw={600}>TD SYNNEX</Title>
                  <Badge color="green" variant="dot" size="lg">Active</Badge>
                </Group>
                <Text c="dimmed" size="sm">
                  Update or reset your credentials associated with the Distributor account.
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
              Need help with your TD SYNNEX account? Visit the{' '}
              <Anchor href="https://www.tdsynnex.com" target="_blank" inline>
                TD SYNNEX Partner Portal <ExternalLink size={12} style={{ display: 'inline', marginLeft: 2 }} />
              </Anchor>
              {' '}for account management and support.
            </Text>
          </Alert>
        </Paper>

        {/* Main Form - Connect your account */}
        <Paper withBorder radius="lg" p="xl" mb="lg" shadow="sm">
          <Group mb="xs">
            <ThemeIcon size="lg" radius="md" variant="light" color="teal">
              <Shield size={18} />
            </ThemeIcon>
            <div>
              <Title order={3}>Connect your account</Title>
            </div>
          </Group>
          
          <Text c="dimmed" size="sm" mb="xl">
            Reset Credentials! Update/Reset your credentials associated with the Distributor account.
          </Text>

          <Stack gap="lg">
            {/* Account Number */}
            <TextInput
              label={
                <Group gap={4}>
                  <Text component="span" c="red" size="sm">*</Text>
                  <span>Account number</span>
                  <Tooltip label="Your unique TD SYNNEX account identifier" withArrow>
                    <HelpCircle size={14} className="text-gray-400 cursor-help" />
                  </Tooltip>
                </Group>
              }
              description="Enter a numeric TD SYNNEX Account number."
              placeholder="Enter your account number"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              error={errors.accountNumber}
              leftSection={<Hash size={16} />}
              size="md"
              radius="md"
            />

            {/* Email */}
            <TextInput
              label={
                <Group gap={4}>
                  <Text component="span" c="red" size="sm">*</Text>
                  <span>Email</span>
                  <Tooltip label="The email address associated with your TD SYNNEX account" withArrow>
                    <HelpCircle size={14} className="text-gray-400 cursor-help" />
                  </Tooltip>
                </Group>
              }
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              leftSection={<Mail size={16} />}
              size="md"
              radius="md"
            />

            {/* Password */}
            <PasswordInput
              label={
                <Group gap={4}>
                  <Text component="span" c="red" size="sm">*</Text>
                  <span>Password</span>
                  <Tooltip label="Your TD SYNNEX account password" withArrow>
                    <HelpCircle size={14} className="text-gray-400 cursor-help" />
                  </Tooltip>
                </Group>
              }
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              leftSection={<Lock size={16} />}
              size="md"
              radius="md"
              visibilityToggleIcon={({ reveal }) =>
                reveal ? <EyeOff size={16} /> : <Eye size={16} />
              }
            />

            {/* Distributor Market */}
            <Select
              label={
                <Group gap={4}>
                  <Text component="span" c="red" size="sm">*</Text>
                  <span>Distributor market</span>
                  <Tooltip label="The regional market for your TD SYNNEX account" withArrow>
                    <HelpCircle size={14} className="text-gray-400 cursor-help" />
                  </Tooltip>
                </Group>
              }
              placeholder="Select your market"
              data={marketOptions}
              value={formData.distributorMarket}
              onChange={(value) => setFormData({ ...formData, distributorMarket: value || 'US' })}
              leftSection={<Globe size={16} />}
              size="md"
              radius="md"
              searchable
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
            All credentials are encrypted using AES-256 encryption at rest and TLS 1.3 in transit. 
            We follow industry best practices to ensure your data remains protected.
          </Text>
        </Alert>

        {/* Action Buttons */}
        <Paper withBorder radius="lg" p="lg" shadow="sm">
          <Group justify="space-between">
            <Button
              variant="outline"
              color="teal"
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
                color="teal"
                leftSection={<Save size={16} />}
                onClick={handleSave}
                loading={isSaving}
                disabled={isTesting}
              >
                Proceed
              </Button>
            </Group>
          </Group>
        </Paper>
      </Container>
    </div>
  );
};

