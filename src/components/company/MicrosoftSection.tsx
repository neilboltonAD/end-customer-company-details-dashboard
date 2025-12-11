import React, { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { ExpandableSection } from '../layout/ExpandableSection';
import { Toggle } from '../form/Toggle';
import { PartnerCenterInsights } from './PartnerCenterInsights';

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
  <button
    className="px-2 py-1 text-xs rounded border border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-center font-medium"
    type="button"
    onClick={onClick}
  >
    {children}
  </button>
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Choose a GDAP Relationship request type:</h2>
        <div className="space-y-3 mb-6">
          {gdapOptions.map((option) => (
            <button
              key={option}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
              onClick={() => onSelectOption(option)}
            >
              <div className="font-medium text-gray-800">{option}</div>
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm GDAP Relationship Request</h2>
        <p className="mb-6 text-gray-700">
          You have requested to send your customer a GDAP Relationship request for the <strong>{selectedOption}</strong> roles.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            onClick={onConfirm}
          >
            Send
          </button>
        </div>
      </div>
    </div>
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Choose a Special Qualification type:</h2>
        <div className="space-y-3 mb-6">
          {qualificationOptions.map((option) => (
            <button
              key={option}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
              onClick={() => onSelectOption(option)}
            >
              <div className="font-medium text-gray-800">{option}</div>
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Enter your organization domain URL</h2>
        <div className="mb-6">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g www.besthighschool.edu"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!domain.trim()}
          >
            Request Qualification
          </button>
        </div>
      </div>
    </div>
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Special Qualification Request</h2>
        <p className="mb-6 text-gray-700">
          You want to submit a request to Microsoft for this qualification, and you should be aware that this take a few days to be completed by Microsoft. <br/><br/>The status of this request will move from Pending to Active once completed - please keep checking back for updates.
        </p>
        <div className="bg-gray-50 p-3 rounded mb-6">
          <div className="text-sm font-medium text-gray-800 mb-1">Qualification:</div>
          <div className="text-sm text-gray-700">{selectedQualification}</div>
          <div className="text-sm font-medium text-gray-800 mb-1 mt-2">Domain:</div>
          <div className="text-sm text-gray-700">{domain}</div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4 text-red-800">⚠️ High Risk Action</h2>
        <p className="mb-4 text-gray-700">
          This is a High Risk Action. By entering 'CONFIRM' in the text box and pressing the 'Unlink' button you understand that there must NOT be any subscriptions linked.
        </p>
        <div className="mb-6">
          <input
            type="text"
            value={confirmation}
            onChange={(e) => onConfirmationChange(e.target.value)}
            placeholder="Type 'CONFIRM' to proceed"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            autoFocus
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={confirmation !== 'CONFIRM'}
          >
            Unlink
          </button>
        </div>
      </div>
    </div>
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Create New Tenant</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain *</label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({...formData, domain: e.target.value})}
              placeholder="company.onmicrosoft.com"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State/Province *</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!formData.companyName || !formData.domain || !formData.email || !formData.firstName || 
                     !formData.lastName || !formData.addressLine1 || !formData.city || !formData.state || 
                     !formData.country || !formData.postalCode}
          >
            Create Tenant
          </button>
        </div>
      </div>
    </div>
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Link Existing Tenant</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Microsoft Tenant Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="company.onmicrosoft.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!domain.trim()}
          >
            Link Tenant
          </button>
        </div>
      </div>
    </div>
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            onClick={onConfirm}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-green-700 font-medium">
            The correct permissions to manage the customers Azure subscription are correct and present!
          </div>
          <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-2 py-1">Active</span>
        </div>
      );
    }

    if (hasPendingAzureGdap) {
      return (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Azure GDAP relationship requested
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 text-xs rounded border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            >
              Requested
            </button>
            <button
              className="text-xs font-bold uppercase rounded px-2 py-1 cursor-pointer text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
              onClick={handleToggleAzureStatus}
            >
              Pending
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-red-700">
          The correct permissions are not present - would you like to request these?
        </div>
        <button
          className="px-3 py-1 text-xs rounded border border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          onClick={handleRequestAzureGdap}
        >
          Request Telstra Azure GDAP
        </button>
      </div>
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
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Microsoft</h3>
      
      {isTenantLinked ? (
        <>
          {/* Section 1: Customer Tenant Information - Always visible, not collapsible */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-800">Customer Tenant Information</h4>
            </div>
            
            {/* Tenant Domain Details - inline, not collapsible */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={microsoftLogo} alt="Microsoft Logo" className="w-10 h-10 mr-3 rounded" />
                  <div className="space-y-0.5">
                    <div>
                      <span className="text-xs text-gray-500">Tenant Name: </span>
                      <span className="text-sm font-semibold text-gray-800">AppDirect Demonstration 5</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Tenant UUID: </span>
                      <span className="text-xs text-gray-600 font-mono">{tenantData.tenantId}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-1.5 py-0.5">Active</span>
                  <button 
                    className="px-2 py-1 text-xs rounded border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                    onClick={handleUnlinkTenant}
                  >
                    Unlink Tenant
                  </button>
                </div>
              </div>
            </div>

            {/* Partner Center Insights - moved above Administration Information */}
            <PartnerCenterInsights />

            {/* Admin Subsection */}
            <ExpandableSection 
              title="Administration Information" 
              open={adminSectionOpen}
              onToggle={setAdminSectionOpen}
              className="mb-1"
              helpContent="Administration Information displays the users with administrative privileges in your Microsoft 365 tenant. This includes Global Administrators who have full control, Billing Administrators who manage subscriptions, and the status of your Microsoft Customer Agreement which governs your relationship with Microsoft."
            >
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-700 mb-1">Global Admin User(s)</div>
                <ul className="text-xs text-gray-700 space-y-1">
                  {tenantData.globalAdmins.map((admin, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-1.5 text-green-400">•</span>
                      {admin}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-700 mb-1">Billing Admin User(s)</div>
                <ul className="text-xs text-gray-700 space-y-1">
                  {tenantData.billingAdmins.map((admin, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-1.5 text-green-400">•</span>
                      {admin}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Microsoft Customer Agreement Status</div>
                <div className="flex items-center justify-between text-xs text-gray-700">
                  <span className="flex items-center">
                    <span className="mr-1.5 text-green-400">•</span>
                    Last Agreement Date: {tenantData.agreementDate}
                  </span>
                  <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-1.5 py-0.5">Active</span>
                </div>
              </div>
            </ExpandableSection>

            {/* GDAP Relationships Subsection */}
            <ExpandableSection
              title={
                <div className="flex items-center w-full">
                  <span className="flex-1">GDAP Relationships</span>
                  <div className="flex items-center space-x-1">
                    <ActionButton onClick={handleGdapNew}>New</ActionButton>
                    <ActionButton onClick={handleGdapSync}>Sync</ActionButton>
                  </div>
                </div>
              }
              open={gdapSectionOpen}
              onToggle={setGdapSectionOpen}
              className="mb-1"
              helpContent="GDAP (Granular Delegated Admin Privileges) Relationships define the specific permissions your organization has to manage your customer's Microsoft 365 environment. These relationships specify which administrative roles you can perform, such as user management, license assignment, and security settings. Each relationship has a defined scope and expiration date."
            >
              {gdapRelationships.map((rel, idx) => (
                <ExpandableSection
                  key={rel.name}
                  title={
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs">{rel.name}</span>
                      {rel.active ? (
                        <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-1.5 py-0.5 ml-1">Active</span>
                      ) : (
                        <span className="text-xs font-bold uppercase text-yellow-700 bg-yellow-100 rounded px-1.5 py-0.5 ml-1">Pending</span>
                      )}
                    </div>
                  }
                  defaultOpen={false}
                  className="mb-1 ml-2 border border-gray-200 bg-gray-50"
                >
                  <div className="space-y-1">
                    {rel.name.startsWith('Default_') ? (
                      <div className="text-xs text-gray-600">Default GDAP relationship assigned when tenant was created.</div>
                    ) : !rel.active ? (
                      <div className="text-xs text-gray-600">GDAP request sent to customer, awaiting approval.</div>
                    ) : (
                      <div className="text-xs text-gray-600">GDAP relationship requested and accepted by customer.</div>
                    )}
                    <div className="text-xs text-gray-500">
                      {!rel.active ? (
                        'Awaiting approval'
                      ) : rel.autoExtend ? (
                        `Valid: ${rel.dateRange}`
                      ) : (
                        `Valid: ${rel.dateRange} (no renewal)`
                      )}
                    </div>
                    {rel.active && (
                      <div className="flex items-center justify-end py-0.5">
                        <span className="text-xs text-gray-700 mr-1">Auto-renew</span>
                        <Toggle enabled={rel.autoExtend} onChange={(val) => handleAutoExtendToggle(idx, val)} size="sm" />
                      </div>
                    )}
                    <ul className="text-xs text-gray-700 space-y-0.5">
                      {rel.roles.map((role) => (
                        <li key={role} className="flex items-center">
                          <span className="mr-1.5 text-green-400">✔</span> {role}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ExpandableSection>
              ))}
            </ExpandableSection>

            {/* Special Qualifications Subsection */}
            <ExpandableSection
              title={
                <div className="flex items-center w-full">
                  <span className="flex-1">Special Qualification Status</span>
                  <div className="flex items-center space-x-1">
                    <ActionButton onClick={handleQualificationNew}>New</ActionButton>
                    <ActionButton onClick={handleSpecialQualificationsSync}>Sync</ActionButton>
                  </div>
                </div>
              }
              open={specialQualificationsSectionOpen}
              onToggle={setSpecialQualificationsSectionOpen}
              className="mb-1"
              helpContent="Special Qualification Status shows your organization's eligibility for specific Microsoft programs and benefits. These qualifications can include government contracts, educational status, nonprofit status, or other specialized programs that provide additional benefits, discounts, or access to specific Microsoft services and features."
            >
              <div className="space-y-1">
                {specialQualifications.map((qual, idx) => (
                  <div key={`${qual.name}-${qual.domain}-${idx}`} className="flex items-center justify-between py-0.5">
                    <div>
                      <span className="text-xs font-semibold text-gray-700">{qual.name}</span>
                      {!qual.active && <span className="text-xs text-gray-500 ml-2">({qual.domain})</span>}
                      <span className="text-xs text-gray-500 ml-2">
                        {!qual.active ? '- Awaiting approval' : `- ${qual.lastModified}`}
                      </span>
                    </div>
                    {qual.active ? (
                      <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-1.5 py-0.5">Active</span>
                    ) : (
                      <span className="text-xs font-bold uppercase text-yellow-700 bg-yellow-100 rounded px-1.5 py-0.5">Pending</span>
                    )}
                  </div>
                ))}
              </div>
            </ExpandableSection>

            {/* Azure Subsection */}
            <ExpandableSection 
              title="Azure Settings" 
              sectionId="microsoft-azure-settings"
              className="mb-1"
              helpContent="Azure Settings configure permissions and access levels for Azure services, including reservations, cost management, and subscription usage. These settings determine what Azure resources your organization can manage and purchase."
            >
              <div className="space-y-1.5">
                <div className="bg-gray-50 border border-gray-200 rounded p-2 flex items-center justify-between">
                  <div className="flex-1 mr-2">
                    <div className="font-semibold text-xs">Azure Reservations</div>
                    <div className="text-xs text-gray-500">Allow customers to purchase Azure Reservations</div>
                  </div>
                  <div className="flex items-center">
                    <Toggle enabled={azureReservations} onChange={setAzureReservations} size="sm" />
                    <span className={`text-xs ml-1.5 w-6 ${azureReservations ? 'text-green-700' : 'text-gray-400'}`}>{azureReservations ? 'On' : 'Off'}</span>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-2 flex items-center justify-between">
                  <div className="flex-1 mr-2">
                    <div className="font-semibold text-xs">Azure Subscription Usage</div>
                    <div className="text-xs text-gray-500">Show consumption in Azure portal</div>
                  </div>
                  <div className="flex items-center">
                    <Toggle enabled={azureUsage} onChange={setAzureUsage} size="sm" />
                    <span className={`text-xs ml-1.5 w-6 ${azureUsage ? 'text-green-700' : 'text-gray-400'}`}>{azureUsage ? 'On' : 'Off'}</span>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-2">
                  <div className="font-semibold text-xs mb-1">Azure Management Permissions</div>
                  <AzureManagementPermissions />
                </div>
              </div>
            </ExpandableSection>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-lg font-semibold text-gray-700 mb-4">No tenant linked</div>
          <div className="flex justify-center space-x-4">
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={handleCreateNewTenant}
            >
              Create New Tenant
            </button>
            <button
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
              onClick={handleLinkTenant}
            >
              Link Tenant
            </button>
          </div>
        </div>
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
    </div>
  );
};

// Make this a module for TypeScript isolatedModules
export {};