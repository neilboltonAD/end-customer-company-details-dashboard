import React, { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { ExpandableSection } from '../layout/ExpandableSection';
import { Toggle } from '../form/Toggle';
import { PartnerCenterInsights } from './PartnerCenterInsights';
import { P2PTransfersPanel } from './p2p';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  ConfirmationModal as DSConfirmationModal,
  Grid,
  Inline,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from 'components/DesignSystem';

const initialGdapRelationships = [
  {
    name: 'Default_AppD_AppDirect De_875803572131294',
    dateRange: '06/25/2025 - 12/22/2025',
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
  {
    name: 'Manage Users',
    dateRange: '06/25/2025 - 07/25/2025',
    autoExtend: false,
    active: true,
    roles: ['User administrator'],
  },
  {
    name: 'a0820287-9448-4631-a3e2-f1c6d825b8bc',
    dateRange: '06/25/2025 - 06/25/2027',
    autoExtend: true,
    active: true,
    roles: [
      'Cloud application administrator',
      'License administrator',
      'User administrator',
      'Directory readers',
    ],
  },
];

const initialSpecialQualifications = [
  {
    name: 'Education: Higher Education',
    domain: 'university.edu',
    active: true,
    lastModified: '06/25/2025',
  },
];

const gdapOptions = [
  'Default Marketplace roles',
  'Telstra M365',
  'Telstra Azure',
  'Telstra M365 & Azure'
];

const qualificationOptions = [
  'Education - K12',
  'Government - State Owned',
  'Government Community Cloud',
  'Not for Profit'
];

const ActionButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <Button variant="link" size="xs" onClick={onClick}>
    {children}
  </Button>
);

const GdapOptionsModal = ({
  open,
  onClose,
  onSelectOption
}: {
  open: boolean;
  onClose: () => void;
  onSelectOption: (option: string) => void;
}) => {
  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Choose a GDAP relationship request type"
      size="md"
      actions={[
        { id: 'cancel', label: 'Cancel', variant: 'outline', closeOnClick: true },
      ]}
    >
      <Stack gap="sm">
        {gdapOptions.map((option) => (
          <Card key={option} interactive onClick={() => onSelectOption(option)}>
            <Text fw={700}>{option}</Text>
          </Card>
        ))}
      </Stack>
    </Modal>
  );
};

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  selectedOption
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedOption: string;
}) => {
  return (
    <DSConfirmationModal
      opened={open}
      onClose={onClose}
      title="Confirm GDAP Relationship Request"
      confirmLabel="Send"
      cancelLabel="Cancel"
      confirmVariant="primary"
      onConfirm={onConfirm}
      onCancel={onClose}
      size="md"
    >
      <Text size="sm" c="dimmed">
        You have requested to send your customer a GDAP Relationship request for the <Text span fw={700}>{selectedOption}</Text> roles.
      </Text>
    </DSConfirmationModal>
  );
};

const QualificationOptionsModal = ({
  open,
  onClose,
  onSelectOption
}: {
  open: boolean;
  onClose: () => void;
  onSelectOption: (option: string) => void;
}) => {
  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Choose a Special Qualification type"
      size="md"
      actions={[
        { id: 'cancel', label: 'Cancel', variant: 'outline', closeOnClick: true },
      ]}
    >
      <Stack gap="sm">
        {qualificationOptions.map((option) => (
          <Card key={option} interactive onClick={() => onSelectOption(option)}>
            <Text fw={700}>{option}</Text>
          </Card>
        ))}
      </Stack>
    </Modal>
  );
};

const DomainInputModal = ({
  open,
  onClose,
  onConfirm,
  selectedQualification
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (domain: string) => void;
  selectedQualification: string;
}) => {
  const [domain, setDomain] = React.useState('');

  const handleSubmit = () => {
    if (domain.trim()) {
      onConfirm(domain.trim());
      setDomain('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Enter your organization domain URL"
      size="md"
      actions={[
        { id: 'cancel', label: 'Cancel', variant: 'outline', closeOnClick: true },
        {
          id: 'confirm',
          label: 'Request Qualification',
          variant: 'primary',
          onClick: handleSubmit,
          disabled: !domain.trim(),
        },
      ]}
    >
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          Qualification: <Text span fw={700}>{selectedQualification}</Text>
        </Text>
        <TextInput
          value={domain}
          onChange={(e) => setDomain(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g www.besthighschool.edu"
          autoFocus
        />
      </Stack>
    </Modal>
  );
};

const QualificationConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  selectedQualification,
  domain
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedQualification: string;
  domain: string;
}) => {
  return (
    <DSConfirmationModal
      opened={open}
      onClose={onClose}
      title="Confirm Special Qualification Request"
      confirmLabel="Confirm"
      cancelLabel="Cancel"
      confirmVariant="primary"
      onConfirm={onConfirm}
      onCancel={onClose}
      size="md"
    >
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          You want to submit a request to Microsoft for this qualification. This can take a few days to complete; the status will move from Pending to Active once completed.
        </Text>
        <Card>
          <Stack gap={6}>
            <Inline justify="space-between">
              <Text size="sm" c="dimmed">Qualification</Text>
              <Text size="sm" fw={700}>{selectedQualification}</Text>
            </Inline>
            <Inline justify="space-between">
              <Text size="sm" c="dimmed">Domain</Text>
              <Text size="sm" fw={700}>{domain}</Text>
            </Inline>
          </Stack>
        </Card>
      </Stack>
    </DSConfirmationModal>
  );
};

const UnlinkWarningModal = ({
  open,
  onClose,
  onConfirm,
  confirmation,
  onConfirmationChange
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmation: string;
  onConfirmationChange: (value: string) => void;
}) => {
  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="High Risk Action"
      size="md"
      actions={[
        { id: 'cancel', label: 'Cancel', variant: 'outline', closeOnClick: true },
        {
          id: 'unlink',
          label: 'Unlink',
          variant: 'danger',
          onClick: onConfirm,
          disabled: confirmation !== 'CONFIRM',
        },
      ]}
    >
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          By entering <Text span fw={700}>CONFIRM</Text> and pressing Unlink, you understand there must NOT be any subscriptions linked.
        </Text>
        <TextInput
          value={confirmation}
          onChange={(e) => onConfirmationChange(e.currentTarget.value)}
          placeholder="Type 'CONFIRM' to proceed"
          autoFocus
        />
      </Stack>
    </Modal>
  );
};

const CreateTenantModal = ({
  open,
  onClose,
  onConfirm
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (tenantData: any) => void;
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    domain: '',
    email: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    city: '',
    state: '',
    country: 'US',
    postalCode: '',
    phoneNumber: '',
    culture: 'en-US',
    language: 'en'
  });

  const handleSubmit = () => {
    if (formData.companyName && formData.domain && formData.email && formData.firstName && 
        formData.lastName && formData.addressLine1 && formData.city && formData.state && 
        formData.country && formData.postalCode) {
      onConfirm(formData);
      setFormData({
        companyName: '',
        domain: '',
        email: '',
        firstName: '',
        lastName: '',
        addressLine1: '',
        city: '',
        state: '',
        country: 'US',
        postalCode: '',
        phoneNumber: '',
        culture: 'en-US',
        language: 'en'
      });
    }
  };

  const isValid = !!(
    formData.companyName &&
    formData.domain &&
    formData.email &&
    formData.firstName &&
    formData.lastName &&
    formData.addressLine1 &&
    formData.city &&
    formData.state &&
    formData.country &&
    formData.postalCode
  );

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Create New Tenant"
      size="xl"
      actions={[
        { id: 'cancel', label: 'Cancel', variant: 'outline', closeOnClick: true },
        { id: 'create', label: 'Create Tenant', variant: 'primary', onClick: handleSubmit, disabled: !isValid },
      ]}
    >
      <Grid cols={{ base: 1, sm: 2 }} spacing="md">
        <TextInput
          label="Company Name"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.currentTarget.value })}
          required
        />
        <TextInput
          label="Domain"
          value={formData.domain}
          onChange={(e) => setFormData({ ...formData, domain: e.currentTarget.value })}
          placeholder="company.onmicrosoft.com"
          required
        />
        <TextInput
          label="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.currentTarget.value })}
          required
        />
        <TextInput
          label="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.currentTarget.value })}
          required
        />
        <TextInput
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.currentTarget.value })}
          required
        />
        <TextInput
          label="Address Line 1"
          value={formData.addressLine1}
          onChange={(e) => setFormData({ ...formData, addressLine1: e.currentTarget.value })}
          required
        />
        <TextInput
          label="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.currentTarget.value })}
          required
        />
        <TextInput
          label="State/Province"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.currentTarget.value })}
          required
        />
        <Select
          label="Country"
          value={formData.country}
          onChange={(v) => setFormData({ ...formData, country: v || 'US' })}
          data={[
            { value: 'US', label: 'United States' },
            { value: 'CA', label: 'Canada' },
            { value: 'GB', label: 'United Kingdom' },
            { value: 'AU', label: 'Australia' },
          ]}
        />
        <TextInput
          label="Postal Code"
          value={formData.postalCode}
          onChange={(e) => setFormData({ ...formData, postalCode: e.currentTarget.value })}
          required
        />
        <TextInput
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.currentTarget.value })}
          showOptional
        />
      </Grid>
    </Modal>
  );
};

const LinkTenantModal = ({
  open,
  onClose,
  onConfirm
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (domain: string) => void;
}) => {
  const [domain, setDomain] = useState('');

  const handleSubmit = () => {
    if (domain.trim()) {
      onConfirm(domain.trim());
      setDomain('');
    }
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Link Existing Tenant"
      size="md"
      actions={[
        { id: 'cancel', label: 'Cancel', variant: 'outline', closeOnClick: true },
        { id: 'link', label: 'Link Tenant', variant: 'primary', onClick: handleSubmit, disabled: !domain.trim() },
      ]}
    >
      <Stack gap="sm">
        <TextInput
          label="Customer Microsoft Tenant Domain"
          value={domain}
          onChange={(e) => setDomain(e.currentTarget.value)}
          placeholder="company.onmicrosoft.com"
          autoFocus
        />
      </Stack>
    </Modal>
  );
};

const SyncModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) => {
  return (
    <Modal
      opened={open}
      onClose={onClose}
      title={title}
      size="md"
      actions={[
        {
          id: 'ack',
          label: 'Acknowledge',
          variant: 'primary',
          onClick: onConfirm,
          closeOnClick: true,
        },
      ]}
    >
      <Text size="sm" c="dimmed">
        {message}
      </Text>
    </Modal>
  );
};

const McaAttestationModal = ({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { firstName: string; lastName: string; email: string; phone: string }) => void;
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const isStep1Valid = formData.firstName && formData.lastName && formData.email && formData.phone;

  const handleShareAgreement = () => {
    onSubmit(formData);
    // Reset form
    setFormData({ firstName: '', lastName: '', email: '', phone: '' });
  };

  const handleClose = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '' });
    onClose();
  };

  return (
    <Modal
      opened={open}
      onClose={handleClose}
      title="Accept Microsoft Customer Agreement"
      size="lg"
      actions={[
        { id: 'cancel', label: 'Cancel', variant: 'outline', onClick: handleClose, closeOnClick: true },
      ]}
    >
      <Stack gap="md">
        <div>
          <Title order={3} fw={700} m={0}>
            Generate Microsoft Customer Agreement
          </Title>
          <Text size="sm" c="dimmed">
            The customer needs to accept the Microsoft Customer Agreement.
          </Text>
        </div>

        <Card>
          <Stack gap="sm">
            <Text fw={700}>Step 1: Customer information</Text>
            <Text size="sm" c="dimmed">
              Enter your primary contact information to generate the agreement.
            </Text>

            <Grid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.currentTarget.value })}
                required
              />
              <TextInput
                label="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.currentTarget.value })}
                required
              />
              <TextInput
                label="Email address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.currentTarget.value })}
                required
              />
              <TextInput
                label="Phone number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.currentTarget.value })}
                required
              />
            </Grid>
          </Stack>
        </Card>

        <Card>
          <Inline justify="space-between" align="center" wrap="nowrap">
            <div>
              <Text fw={700}>Step 2: Send the agreement to customer</Text>
              <Text size="sm" c="dimmed">
                The Microsoft Customer Agreement has been generated and is ready to share. You can now send the acceptance request to your customer.
              </Text>
            </div>
            <Button onClick={handleShareAgreement} disabled={!isStep1Valid}>
              Share Agreement
            </Button>
          </Inline>
        </Card>
      </Stack>
    </Modal>
  );
};

export const MicrosoftSection = () => {
  const [gdapRelationships, setGdapRelationships] = useState(initialGdapRelationships);
  const [specialQualifications, setSpecialQualifications] = useState(initialSpecialQualifications);
  const [azureReservations, setAzureReservations] = useState(true);
  const [azureUsage, setAzureUsage] = useState(false);

  // Tenant state
  const [isTenantLinked, setIsTenantLinked] = useState(true);
  const [tenantData, setTenantData] = useState({
    domain: 'appdirectdemonstration5.onmicrosoft.com',
    tenantId: '408f194e-dc4a-4a2e-ac65-d1d6b0c11a8a',
    globalAdmins: ['neil.bolton@xyzcompany.com', 'sarah.johnson@xyzcompany.com'],
    billingAdmins: ['finance.admin@xyzcompany.com', 'billing.team@xyzcompany.com'],
    agreementDate: '25/06/2025'
  });

  // GDAP dialog state
  const [showGdapOptions, setShowGdapOptions] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  // Special Qualifications dialog state
  const [showQualificationOptions, setShowQualificationOptions] = useState(false);
  const [showDomainInput, setShowDomainInput] = useState(false);
  const [showQualificationConfirmation, setShowQualificationConfirmation] = useState(false);
  const [selectedQualification, setSelectedQualification] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');

  // Section open/close state
  const [gdapSectionOpen, setGdapSectionOpen] = useState(false);
  const [specialQualificationsSectionOpen, setSpecialQualificationsSectionOpen] = useState(false);
  const [adminSectionOpen, setAdminSectionOpen] = useState(true);

  // Sync modal state
  const [showGdapSyncModal, setShowGdapSyncModal] = useState(false);
  const [showSpecialQualificationsSyncModal, setShowSpecialQualificationsSyncModal] = useState(false);

  // Tenant management modal state
  const [showUnlinkWarning, setShowUnlinkWarning] = useState(false);
  const [unlinkConfirmation, setUnlinkConfirmation] = useState('');
  const [showCreateTenantModal, setShowCreateTenantModal] = useState(false);
  const [showLinkTenantModal, setShowLinkTenantModal] = useState(false);

  // MCA Authorization state
  const [mcaStatus, setMcaStatus] = useState<'valid' | 'invalid' | 'pending'>('valid');
  const [showMcaModal, setShowMcaModal] = useState(false);

  // Toggle MCA status for demo purposes
  const toggleMcaStatus = () => {
    setMcaStatus((prev) => {
      if (prev === 'valid') return 'invalid';
      if (prev === 'invalid') return 'pending';
      if (prev === 'pending') return 'valid';
      return 'valid';
    });
  };


  const handleAutoExtendToggle = (idx: number, value: boolean) => {
    setGdapRelationships((prev) =>
      prev.map((rel, i) =>
        i === idx ? { ...rel, autoExtend: value } : rel
      )
    );
  };

  const handleGdapNew = () => {
    setShowGdapOptions(true);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowGdapOptions(false);
    setShowConfirmation(true);
  };

  const handleSendRequest = () => {
    // Show waiting notification
    notifications.show({
      id: 'gdap-request-waiting',
      title: 'Waiting',
      message: 'Waiting for GDAP relationship request to be completed...',
      color: 'yellow',
      autoClose: 3000,
    });

    // Simulate async request
    setTimeout(() => {
      // Close waiting notification
      notifications.hide('gdap-request-waiting');
      
      // Create a new pending GDAP relationship
      const newGdapRelationship = {
        name: selectedOption,
        dateRange: 'Pending - Pending',
        autoExtend: true,
        active: false, // This will show as pending instead of active
        roles: getRolesForOption(selectedOption),
      };

      // Add the new relationship to the list
      setGdapRelationships((prev) => [...prev, newGdapRelationship]);
      
      // Show success notification
      notifications.show({
        title: 'Completed!',
        message: `GDAP relationship request for "${selectedOption}" has been sent successfully. The request is now pending customer approval.`,
        color: 'green',
        autoClose: 5000,
      });
      
      // Keep the GDAP section open and close the modal
      setGdapSectionOpen(true);
      setShowConfirmation(false);
      setSelectedOption('');
    }, 2000);
  };

  // Special Qualifications handlers
  const handleQualificationNew = () => {
    setShowQualificationOptions(true);
  };

  const handleQualificationOptionSelect = (option: string) => {
    setSelectedQualification(option);
    setShowQualificationOptions(false);
    setShowDomainInput(true);
  };

  const handleDomainSubmit = (domain: string) => {
    setSelectedDomain(domain);
    setShowDomainInput(false);
    setShowQualificationConfirmation(true);
  };

  const handleQualificationConfirm = () => {
    // Show waiting notification
    notifications.show({
      id: 'qualification-request-waiting',
      title: 'Waiting',
      message: 'Waiting for special qualification request to be completed...',
      color: 'yellow',
      autoClose: 3000,
    });

    // Simulate async request
    setTimeout(() => {
      // Close waiting notification
      notifications.hide('qualification-request-waiting');
      
      // Create a new pending special qualification
      const newQualification = {
        name: selectedQualification,
        domain: selectedDomain,
        active: false, // This will show as pending instead of active
        lastModified: new Date().toLocaleDateString('en-GB'),
      };

      // Add the new qualification to the list
      setSpecialQualifications((prev) => [...prev, newQualification]);
      
      // Show success notification
      notifications.show({
        title: 'Completed!',
        message: `Special qualification request for "${selectedQualification}" has been submitted successfully. The request is now pending Microsoft approval.`,
        color: 'green',
        autoClose: 5000,
      });
      
      // Keep the Special Qualifications section open and close the modal
      setSpecialQualificationsSectionOpen(true);
      setShowQualificationConfirmation(false);
      setSelectedQualification('');
      setSelectedDomain('');
    }, 2000);
  };

  // Sync handlers
  const handleGdapSync = () => {
    setShowGdapSyncModal(true);
  };

  const handleGdapSyncConfirm = () => {
    // Show waiting notification
    notifications.show({
      id: 'gdap-sync-waiting',
      title: 'Waiting',
      message: 'Now syncing GDAP relationships from Microsoft Partner Centre...',
      color: 'yellow',
      autoClose: 3000,
    });

    // Simulate async sync
    setTimeout(() => {
      // Close waiting notification
      notifications.hide('gdap-sync-waiting');
      
      // Create a new dummy GDAP relationship
      const newGdapRelationship = {
        name: `Synced_GDAP_${Date.now()}`,
        dateRange: '06/25/2025 - 12/25/2025',
        autoExtend: true,
        active: true,
        roles: ['User administrator', 'License administrator'],
      };

      // Add the new relationship to the list
      setGdapRelationships((prev) => [...prev, newGdapRelationship]);
      
      // Show success notification
      notifications.show({
        title: 'Completed!',
        message: 'GDAP relationships have been successfully synced from Microsoft Partner Centre. New relationships have been added to your list.',
        color: 'green',
        autoClose: 5000,
      });
      
      // Keep the GDAP section open and close the modal
      setGdapSectionOpen(true);
      setShowGdapSyncModal(false);
    }, 2000);
  };

  const handleSpecialQualificationsSync = () => {
    setShowSpecialQualificationsSyncModal(true);
  };

  const handleSpecialQualificationsSyncConfirm = () => {
    // Show waiting notification
    notifications.show({
      id: 'qualifications-sync-waiting',
      title: 'Waiting',
      message: 'Now syncing Special Qualification statuses from Microsoft...',
      color: 'yellow',
      autoClose: 3000,
    });

    // Simulate async sync
    setTimeout(() => {
      // Close waiting notification
      notifications.hide('qualifications-sync-waiting');
      
      // Find a qualification option that's not already present
      const existingQualifications = specialQualifications.map(q => q.name);
      const availableOptions = qualificationOptions.filter(option => 
        !existingQualifications.some(existing => existing.includes(option.split(' - ')[0]))
      );
      
      // If no new options available, use a default one
      const newQualificationType = availableOptions.length > 0 
        ? availableOptions[0] 
        : 'Education - K12';

      // Create a new dummy special qualification
      const newQualification = {
        name: newQualificationType,
        domain: 'synced-domain.edu',
        active: true,
        lastModified: new Date().toLocaleDateString('en-GB'),
      };

      // Add the new qualification to the list
      setSpecialQualifications((prev) => [...prev, newQualification]);
      
      // Show success notification
      notifications.show({
        title: 'Completed!',
        message: 'Special Qualification statuses have been successfully synced from Microsoft. Updated qualification information is now available.',
        color: 'green',
        autoClose: 5000,
      });
      
      // Keep the Special Qualifications section open and close the modal
      setSpecialQualificationsSectionOpen(true);
      setShowSpecialQualificationsSyncModal(false);
    }, 2000);
  };

  // Tenant management handlers
  const handleUnlinkTenant = () => {
    setShowUnlinkWarning(true);
  };

  const handleUnlinkConfirm = () => {
    if (unlinkConfirmation === 'CONFIRM') {
      setIsTenantLinked(false);
      setShowUnlinkWarning(false);
      setUnlinkConfirmation('');
    }
  };

  const handleCreateNewTenant = () => {
    setShowCreateTenantModal(true);
  };

  const handleLinkTenant = () => {
    setShowLinkTenantModal(true);
  };

  const handleCreateTenantConfirm = (formData: any) => {
    // Generate dummy tenant data based on form input
    const newTenantData = {
      domain: formData.domain,
      tenantId: `tenant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      globalAdmins: [`${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@${formData.domain}`, 'admin@' + formData.domain],
      billingAdmins: [`billing.${formData.firstName.toLowerCase()}@${formData.domain}`, 'finance@' + formData.domain],
      agreementDate: new Date().toLocaleDateString('en-GB')
    };
    
    setTenantData(newTenantData);
    setIsTenantLinked(true);
    setShowCreateTenantModal(false);
  };

  const handleLinkTenantConfirm = (domain: string) => {
    // Generate dummy tenant data for linked tenant
    const newTenantData = {
      domain: domain,
      tenantId: `linked-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      globalAdmins: ['admin@' + domain, 'global.admin@' + domain],
      billingAdmins: ['billing@' + domain, 'finance@' + domain],
      agreementDate: new Date().toLocaleDateString('en-GB')
    };
    
    setTenantData(newTenantData);
    setIsTenantLinked(true);
    setShowLinkTenantModal(false);
  };


  // Azure Management Permissions component
  const AzureManagementPermissions = () => {
    // Check if Telstra Azure GDAP relationship exists and is active
    const telstraAzureGdap = gdapRelationships.find(rel => 
      rel.name === 'Telstra Azure'
    );
    const hasActiveAzureGdap = telstraAzureGdap && telstraAzureGdap.active;
    const hasPendingAzureGdap = telstraAzureGdap && !telstraAzureGdap.active;

    const handleRequestAzureGdap = () => {
      // Create a new pending Telstra Azure GDAP relationship
      const newAzureGdap = {
        name: 'Telstra Azure',
        dateRange: 'Pending - Pending',
        autoExtend: true,
        active: false, // This will show as pending
        roles: [
          'Cloud application administrator',
          'Application administrator',
        ],
      };

      // Add the new relationship to the GDAP list
      setGdapRelationships(prev => [...prev, newAzureGdap]);
      
      // Keep the GDAP section open to show the new relationship
      setGdapSectionOpen(true);
    };

    const handleToggleAzureStatus = () => {
      if (hasPendingAzureGdap) {
        // Update the GDAP relationship to active
        setGdapRelationships(prev => 
          prev.map(rel => 
            rel.name === 'Telstra Azure'
              ? { ...rel, active: true, dateRange: '06/25/2025 - 12/25/2025' }
              : rel
          )
        );
      }
    };

    if (hasActiveAzureGdap) {
      return (
        <Inline justify="space-between" align="center" wrap="nowrap">
          <Text size="sm" fw={700} style={{ color: 'var(--mantine-color-green-7)' }}>
            The correct permissions to manage the customers Azure subscription are correct and present!
          </Text>
          <Badge size="sm" color="success" variant="outline">
            Active
          </Badge>
        </Inline>
      );
    }

    if (hasPendingAzureGdap) {
      return (
        <Inline justify="space-between" align="center" wrap="nowrap">
          <Text size="sm" c="dimmed">
            Azure GDAP relationship requested
          </Text>
          <Inline gap="xs" align="center" wrap="nowrap">
            <Button variant="disabled" size="xs">
              Requested
            </Button>
            <Button variant="outline" size="xs" onClick={handleToggleAzureStatus}>
              Pending
            </Button>
          </Inline>
        </Inline>
      );
    }

    return (
      <Inline justify="space-between" align="center" wrap="nowrap">
        <Text size="sm" style={{ color: 'var(--mantine-color-red-7)' }}>
          The correct permissions are not present - would you like to request these?
        </Text>
        <Button variant="outline" size="xs" onClick={handleRequestAzureGdap}>
          Request Telstra Azure GDAP
        </Button>
      </Inline>
    );
  };

  // Helper function to get roles based on the selected option
  const getRolesForOption = (option: string) => {
    switch (option) {
      case 'Default Marketplace roles':
        return [
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
        ];
      case 'Telstra M365':
        return [
          'User administrator',
          'License administrator',
          'Helpdesk administrator',
        ];
      case 'Telstra Azure':
        return [
          'Cloud application administrator',
          'Application administrator',
        ];
      case 'Telstra M365 & Azure':
        return [
          'User administrator',
          'License administrator',
          'Helpdesk administrator',
          'Cloud application administrator',
          'Application administrator',
        ];
      default:
        return ['User administrator'];
    }
  };

  const microsoftLogo = '/microsoft (1).png';

  return (
    <div style={{ marginBottom: 32 }}>
      <Title order={4} fw={700} mb="xs">
        Microsoft
      </Title>
      
      {isTenantLinked ? (
        <>
          {/* Section 1: Customer Tenant Information - Always visible, not collapsible */}
          <Card style={{ background: 'var(--mantine-color-gray-0)', border: '1px solid var(--mantine-color-gray-3)' }}>
            <Inline justify="space-between" align="center" mb="sm">
              <Text fw={700} size="sm">
                Customer Tenant Information
              </Text>
            </Inline>
            
            {/* Customer Tenant Information & Administration Information - Side by side */}
            <Inline gap="sm" align="stretch" wrap="nowrap">
              {/* Customer Tenant Information */}
              <Card style={{ flex: 1 }}>
              <Inline gap="sm" align="flex-start" wrap="nowrap">
                <img
                  src={microsoftLogo}
                  alt="Microsoft Logo"
                  style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  {/* Tenant Name Row */}
                  <Inline justify="space-between" align="center" wrap="nowrap" style={{ paddingBottom: 6, borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                    <Inline gap="sm" align="baseline" wrap="nowrap">
                      <Text size="xs" c="dimmed" style={{ width: 90 }}>
                        Tenant Name
                      </Text>
                      <Text fw={700} size="sm">
                        AppDirect Demonstration 5
                      </Text>
                    </Inline>
                    <Inline gap="xs" align="center" wrap="nowrap">
                      <Badge size="sm" color="success" variant="outline">
                        Active
                      </Badge>
                      <Button variant="danger" size="xs" onClick={handleUnlinkTenant}>
                        Unlink Tenant
                      </Button>
                    </Inline>
                  </Inline>
                  
                  {/* Tenant UUID Row */}
                  <Inline gap="sm" align="baseline" wrap="nowrap" style={{ paddingTop: 6, paddingBottom: 6, borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                    <Text size="xs" c="dimmed" style={{ width: 90 }}>
                      Tenant UUID
                    </Text>
                    <Text size="xs" style={{ fontFamily: 'monospace', color: 'var(--mantine-color-gray-7)' }}>
                      {tenantData.tenantId}
                    </Text>
                  </Inline>
                  
                  {/* MCA Status Row */}
                  <Inline justify="space-between" align="center" wrap="nowrap" style={{ paddingTop: 6 }}>
                    <Inline gap="sm" align="baseline" wrap="nowrap">
                      <Text size="xs" c="dimmed" style={{ width: 90 }}>
                        MCA Status
                      </Text>
                      <Text size="xs" c="dimmed">
                        {mcaStatus === 'valid' && `Signed ${tenantData.agreementDate}`}
                        {mcaStatus === 'pending' && 'Awaiting acceptance'}
                        {mcaStatus === 'invalid' && 'Agreement required'}
                      </Text>
                    </Inline>
                    <Inline gap="xs" align="center" wrap="nowrap">
                      <ActionIcon
                        aria-label="Demo: cycle MCA statuses"
                        onClick={toggleMcaStatus}
                        customFill="var(--mantine-color-gray-0)"
                        customBorder="1px solid var(--mantine-color-gray-3)"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </ActionIcon>
                      {mcaStatus === 'valid' && (
                        <>
                          <Badge size="sm" color="success" variant="outline">
                            Valid
                          </Badge>
                          <Button variant="outline" size="xs" onClick={() => setShowMcaModal(true)}>
                            Reattest
                          </Button>
                        </>
                      )}
                      {mcaStatus === 'pending' && (
                        <>
                          <Badge size="sm" color="pending" variant="outline">
                            Pending
                          </Badge>
                          <Button variant="outline" size="xs" onClick={() => setMcaStatus('invalid')}>
                            Cancel
                          </Button>
                        </>
                      )}
                      {mcaStatus === 'invalid' && (
                        <>
                          <Badge size="sm" color="danger" variant="outline">
                            Required
                          </Badge>
                          <Button variant="outline" size="xs" onClick={() => setShowMcaModal(true)}>
                            Request
                          </Button>
                        </>
                      )}
                    </Inline>
                  </Inline>
                </div>
              </Inline>
              </Card>

              {/* Administration Information - Right side */}
              <div style={{ flex: 1 }}>
                <ExpandableSection 
                  title="Administration Information" 
                  open={adminSectionOpen}
                  onToggle={setAdminSectionOpen}
                  helpContent="Administration Information displays the users with administrative privileges in your Microsoft 365 tenant. This includes Global Administrators who have full control and Billing Administrators who manage subscriptions."
                >
                  <Stack gap="sm">
                  <div>
                    <Text size="xs" fw={700}>
                      Global Admin User(s)
                    </Text>
                    <ul style={{ fontSize: 12, color: 'var(--mantine-color-gray-7)', margin: '6px 0 0', paddingLeft: 18 }}>
                      {tenantData.globalAdmins.map((admin, index) => (
                        <li key={index} style={{ marginBottom: 4 }}>
                          <span style={{ marginRight: 6, color: 'var(--mantine-color-green-6)' }}>•</span>
                          {admin}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Text size="xs" fw={700}>
                      Billing Admin User(s)
                    </Text>
                    <ul style={{ fontSize: 12, color: 'var(--mantine-color-gray-7)', margin: '6px 0 0', paddingLeft: 18 }}>
                      {tenantData.billingAdmins.map((admin, index) => (
                        <li key={index} style={{ marginBottom: 4 }}>
                          <span style={{ marginRight: 6, color: 'var(--mantine-color-green-6)' }}>•</span>
                          {admin}
                        </li>
                      ))}
                    </ul>
                  </div>
                  </Stack>
                </ExpandableSection>
              </div>
            </Inline>

            {/* Partner Center Insights */}
            <PartnerCenterInsights />

            {/* P2P Subscription Transfers */}
            <P2PTransfersPanel />

            {/* GDAP Relationships Subsection */}
            <ExpandableSection
              title={
                <Inline justify="space-between" align="center" wrap="nowrap" style={{ width: '100%' }}>
                  <Text fw={800} size="sm">GDAP Relationships</Text>
                  <Inline gap="xs" align="center" wrap="nowrap">
                    <ActionButton onClick={handleGdapNew}>New</ActionButton>
                    <ActionButton onClick={handleGdapSync}>Sync</ActionButton>
                  </Inline>
                </Inline>
              }
              open={gdapSectionOpen}
              onToggle={setGdapSectionOpen}
              helpContent="GDAP (Granular Delegated Admin Privileges) Relationships define the specific permissions your organization has to manage your customer's Microsoft 365 environment. These relationships specify which administrative roles you can perform, such as user management, license assignment, and security settings. Each relationship has a defined scope and expiration date."
            >
              {gdapRelationships.map((rel, idx) => (
                <ExpandableSection
                  key={rel.name}
                  title={
                    <Inline justify="space-between" align="center" wrap="nowrap" style={{ width: '100%' }}>
                      <Text size="xs" fw={700}>{rel.name}</Text>
                      {rel.active ? (
                        <Badge size="xs" color="success" variant="outline">Active</Badge>
                      ) : (
                        <Badge size="xs" color="pending" variant="outline">Pending</Badge>
                      )}
                    </Inline>
                  }
                  defaultOpen={false}
                >
                  <Stack gap={6}>
                    {rel.name.startsWith('Default_') ? (
                      <Text size="xs" c="dimmed">Default GDAP relationship assigned when tenant was created.</Text>
                    ) : !rel.active ? (
                      <Text size="xs" c="dimmed">GDAP request sent to customer, awaiting approval.</Text>
                    ) : (
                      <Text size="xs" c="dimmed">GDAP relationship requested and accepted by customer.</Text>
                    )}
                    <Text size="xs" c="dimmed">
                      {!rel.active ? (
                        'Awaiting approval'
                      ) : rel.autoExtend ? (
                        `Valid: ${rel.dateRange}`
                      ) : (
                        `Valid: ${rel.dateRange} (no renewal)`
                      )}
                    </Text>
                    {rel.active && (
                      <Inline justify="flex-end" align="center" wrap="nowrap">
                        <Text size="xs" c="dimmed" mr={6}>Auto-renew</Text>
                        <Toggle enabled={rel.autoExtend} onChange={(val) => handleAutoExtendToggle(idx, val)} size="sm" />
                      </Inline>
                    )}
                    <ul style={{ fontSize: 12, color: 'var(--mantine-color-gray-7)', margin: 0, paddingLeft: 18 }}>
                      {rel.roles.map((role) => (
                        <li key={role} style={{ marginBottom: 2 }}>
                          <span style={{ marginRight: 6, color: 'var(--mantine-color-green-6)' }}>✔</span> {role}
                        </li>
                      ))}
                    </ul>
                  </Stack>
                </ExpandableSection>
              ))}
            </ExpandableSection>

            {/* Special Qualifications Subsection */}
            <ExpandableSection
              title={
                <Inline justify="space-between" align="center" wrap="nowrap" style={{ width: '100%' }}>
                  <Text fw={800} size="sm">Special Qualification Status</Text>
                  <Inline gap="xs" align="center" wrap="nowrap">
                    <ActionButton onClick={handleQualificationNew}>New</ActionButton>
                    <ActionButton onClick={handleSpecialQualificationsSync}>Sync</ActionButton>
                  </Inline>
                </Inline>
              }
              open={specialQualificationsSectionOpen}
              onToggle={setSpecialQualificationsSectionOpen}
              helpContent="Special Qualification Status shows your organization's eligibility for specific Microsoft programs and benefits. These qualifications can include government contracts, educational status, nonprofit status, or other specialized programs that provide additional benefits, discounts, or access to specific Microsoft services and features."
            >
              <Stack gap={6}>
                {specialQualifications.map((qual, idx) => (
                  <Inline key={`${qual.name}-${qual.domain}-${idx}`} justify="space-between" align="center" wrap="nowrap">
                    <div>
                      <Text span size="xs" fw={700}>{qual.name}</Text>
                      {!qual.active && (
                        <Text span size="xs" c="dimmed" ml={8}>
                          ({qual.domain})
                        </Text>
                      )}
                      <Text span size="xs" c="dimmed" ml={8}>
                        {!qual.active ? '- Awaiting approval' : `- ${qual.lastModified}`}
                      </Text>
                    </div>
                    {qual.active ? (
                      <Badge size="xs" color="success" variant="outline">Active</Badge>
                    ) : (
                      <Badge size="xs" color="pending" variant="outline">Pending</Badge>
                    )}
                  </Inline>
                ))}
              </Stack>
            </ExpandableSection>

            {/* Azure Subsection */}
            <ExpandableSection 
              title="Azure Settings" 
              sectionId="microsoft-azure-settings"
              helpContent="Azure Settings configure permissions and access levels for Azure services, including reservations, cost management, and subscription usage. These settings determine what Azure resources your organization can manage and purchase."
            >
              <Stack gap="sm">
                <Card style={{ background: 'var(--mantine-color-gray-0)', border: '1px solid var(--mantine-color-gray-2)' }}>
                  <Inline justify="space-between" align="center" wrap="nowrap">
                    <div style={{ flex: 1, marginRight: 8 }}>
                      <Text size="xs" fw={700}>Azure Reservations</Text>
                      <Text size="xs" c="dimmed">Allow customers to purchase Azure Reservations</Text>
                    </div>
                    <Inline gap="xs" align="center" wrap="nowrap">
                    <Toggle enabled={azureReservations} onChange={setAzureReservations} size="sm" />
                    <Text size="xs" fw={700} style={{ width: 24, color: azureReservations ? 'var(--mantine-color-green-7)' : 'var(--mantine-color-gray-5)' }}>
                      {azureReservations ? 'On' : 'Off'}
                    </Text>
                    </Inline>
                  </Inline>
                </Card>
                <Card style={{ background: 'var(--mantine-color-gray-0)', border: '1px solid var(--mantine-color-gray-2)' }}>
                  <Inline justify="space-between" align="center" wrap="nowrap">
                    <div style={{ flex: 1, marginRight: 8 }}>
                      <Text size="xs" fw={700}>Azure Subscription Usage</Text>
                      <Text size="xs" c="dimmed">Show consumption in Azure portal</Text>
                    </div>
                    <Inline gap="xs" align="center" wrap="nowrap">
                    <Toggle enabled={azureUsage} onChange={setAzureUsage} size="sm" />
                    <Text size="xs" fw={700} style={{ width: 24, color: azureUsage ? 'var(--mantine-color-green-7)' : 'var(--mantine-color-gray-5)' }}>
                      {azureUsage ? 'On' : 'Off'}
                    </Text>
                    </Inline>
                  </Inline>
                </Card>
                <Card style={{ background: 'var(--mantine-color-gray-0)', border: '1px solid var(--mantine-color-gray-2)' }}>
                  <Text size="xs" fw={700} mb={6}>Azure Management Permissions</Text>
                  <AzureManagementPermissions />
                </Card>
              </Stack>
            </ExpandableSection>
          </Card>
        </>
      ) : (
        <Card style={{ background: 'var(--mantine-color-gray-0)', border: '1px solid var(--mantine-color-gray-2)' }}>
          <Stack align="center" gap="sm">
            <Text fw={700} size="lg">
              No tenant linked
            </Text>
            <Inline gap="sm" justify="center">
              <Button onClick={handleCreateNewTenant}>Create New Tenant</Button>
              <Button variant="outline" onClick={handleLinkTenant}>
                Link Tenant
              </Button>
            </Inline>
          </Stack>
        </Card>
      )}

      {/* GDAP Options Modal */}
      <GdapOptionsModal
        open={showGdapOptions}
        onClose={() => setShowGdapOptions(false)}
        onSelectOption={handleOptionSelect}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleSendRequest}
        selectedOption={selectedOption}
      />

      {/* Special Qualifications Options Modal */}
      <QualificationOptionsModal
        open={showQualificationOptions}
        onClose={() => setShowQualificationOptions(false)}
        onSelectOption={handleQualificationOptionSelect}
      />

      {/* Domain Input Modal */}
      <DomainInputModal
        open={showDomainInput}
        onClose={() => setShowDomainInput(false)}
        onConfirm={handleDomainSubmit}
        selectedQualification={selectedQualification}
      />

      {/* Qualification Confirmation Modal */}
      <QualificationConfirmationModal
        open={showQualificationConfirmation}
        onClose={() => setShowQualificationConfirmation(false)}
        onConfirm={handleQualificationConfirm}
        selectedQualification={selectedQualification}
        domain={selectedDomain}
      />

      {/* GDAP Sync Modal */}
      <SyncModal
        open={showGdapSyncModal}
        onClose={() => setShowGdapSyncModal(false)}
        onConfirm={handleGdapSyncConfirm}
        title="Syncing GDAP Relationships"
        message="Now syncing GDAP relationships from Microsoft Partner Centre"
      />

      {/* Special Qualifications Sync Modal */}
      <SyncModal
        open={showSpecialQualificationsSyncModal}
        onClose={() => setShowSpecialQualificationsSyncModal(false)}
        onConfirm={handleSpecialQualificationsSyncConfirm}
        title="Syncing Special Qualifications"
        message="Now syncing Special Qualification statuses from Microsoft"
      />

      {/* Tenant Management Modals */}
      <UnlinkWarningModal
        open={showUnlinkWarning}
        onClose={() => setShowUnlinkWarning(false)}
        onConfirm={handleUnlinkConfirm}
        confirmation={unlinkConfirmation}
        onConfirmationChange={setUnlinkConfirmation}
      />

      <CreateTenantModal
        open={showCreateTenantModal}
        onClose={() => setShowCreateTenantModal(false)}
        onConfirm={handleCreateTenantConfirm}
      />

      <LinkTenantModal
        open={showLinkTenantModal}
        onClose={() => setShowLinkTenantModal(false)}
        onConfirm={handleLinkTenantConfirm}
      />

      {/* MCA Attestation Modal */}
      <McaAttestationModal
        open={showMcaModal}
        onClose={() => setShowMcaModal(false)}
        onSubmit={(data) => {
          console.log('MCA Attestation submitted:', data);
          // Set status to pending after sharing agreement
          setMcaStatus('pending');
          setShowMcaModal(false);
          notifications.show({
            title: 'Agreement Sent',
            message: `Microsoft Customer Agreement request has been sent to ${data.email}`,
            color: 'blue',
            autoClose: 5000,
          });
        }}
      />
    </div>
  );
};

// Make this a module for TypeScript isolatedModules
export {};