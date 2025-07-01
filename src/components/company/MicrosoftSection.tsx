import React, { useState } from 'react';
import { ExpandableSection } from '../layout/ExpandableSection';
import { Toggle } from '../form/Toggle';

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
    className="ml-2 px-3 py-1 text-xs rounded border border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
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

  // Sync modal state
  const [showGdapSyncModal, setShowGdapSyncModal] = useState(false);
  const [showSpecialQualificationsSyncModal, setShowSpecialQualificationsSyncModal] = useState(false);

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
    
    // Keep the GDAP section open and close the modal
    setGdapSectionOpen(true);
    setShowConfirmation(false);
    setSelectedOption('');
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
    // Create a new pending special qualification
    const newQualification = {
      name: selectedQualification,
      domain: selectedDomain,
      active: false, // This will show as pending instead of active
      lastModified: new Date().toLocaleDateString('en-GB'),
    };

    // Add the new qualification to the list
    setSpecialQualifications((prev) => [...prev, newQualification]);
    
    // Keep the Special Qualifications section open and close the modal
    setSpecialQualificationsSectionOpen(true);
    setShowQualificationConfirmation(false);
    setSelectedQualification('');
    setSelectedDomain('');
  };

  // Sync handlers
  const handleGdapSync = () => {
    setShowGdapSyncModal(true);
  };

  const handleGdapSyncConfirm = () => {
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
    
    // Keep the GDAP section open and close the modal
    setGdapSectionOpen(true);
    setShowGdapSyncModal(false);
  };

  const handleSpecialQualificationsSync = () => {
    setShowSpecialQualificationsSyncModal(true);
  };

  const handleSpecialQualificationsSyncConfirm = () => {
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
    
    // Keep the Special Qualifications section open and close the modal
    setSpecialQualificationsSectionOpen(true);
    setShowSpecialQualificationsSyncModal(false);
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

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Microsoft</h3>
      {/* Section 1: Customer Tenant Information */}
      <ExpandableSection title="Customer Tenant Information" defaultOpen={true}>
        <div className="mb-4 py-2">
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold text-gray-700">appdirectdemonstration5.onmicrosoft.com</div>
            <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-2 py-1">Active</span>
          </div>
          <div className="text-xs text-gray-500 mb-2">Tenant UUID: 408f194e-dc4a-4a2e-ac65-d1d6b0c11a8a</div>
          <div className="flex justify-end">
            <button className="px-3 py-1 text-xs rounded border border-red-300 bg-red-50 text-red-700 hover:bg-red-100">Unlink Tenant</button>
          </div>
        </div>
        <div className="mb-4 py-2">
          <div className="font-semibold text-gray-700 mb-1">Microsoft Customer Agreement</div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Last Agreement Date: 25/06/2025</span>
            <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-2 py-1">Active</span>
          </div>
        </div>
      </ExpandableSection>
      {/* Section 2: GDAP */}
      <ExpandableSection
        open={gdapSectionOpen}
        onToggle={setGdapSectionOpen}
        title={
          <div className="flex items-center w-full justify-between">
            <span>GDAP Relationships</span>
            <div className="flex items-center">
              <ActionButton onClick={handleGdapNew}>New</ActionButton>
              <ActionButton onClick={handleGdapSync}>Sync</ActionButton>
            </div>
          </div>
        }
      >
        {gdapRelationships.map((rel, idx) => (
          <ExpandableSection
            key={rel.name}
            title={
              <div className="flex items-center justify-between w-full">
                <span>{rel.name}</span>
                {rel.active ? (
                  <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-2 py-1 ml-2">Active</span>
                ) : (
                  <span className="text-xs font-bold uppercase text-yellow-700 bg-yellow-100 rounded px-2 py-1 ml-2">Pending</span>
                )}
              </div>
            }
            defaultOpen={false}
            className="mb-3 ml-4 border border-gray-200 bg-gray-50"
          >
            {rel.name.startsWith('Default_') ? (
              <div className="text-xs text-gray-600 mb-2">This is a Default GDAP relationship and assigned when the tenant was created.</div>
            ) : !rel.active ? (
              <div className="text-xs text-gray-600 mb-2">This GDAP relationship request has been sent to the customer and is awaiting approval.</div>
            ) : (
              <div className="text-xs text-gray-600 mb-2">This GDAP relationship was explicitly requested by &lt;partner&gt; and accepted by the customer.</div>
            )}
            <div className="text-xs text-gray-500 mb-2">
              {!rel.active ? (
                'Request sent to customer - awaiting approval'
              ) : rel.autoExtend ? (
                `Relationship is valid from ${rel.dateRange.split(' - ')[0]} to ${rel.dateRange.split(' - ')[1]}`
              ) : (
                `Relationship is valid from ${rel.dateRange.split(' - ')[0]} to ${rel.dateRange.split(' - ')[1]} and will NOT renew`
              )}
            </div>
            {rel.active && (
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1"></div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-700 mr-2">Renew every 180 days</span>
                  <Toggle enabled={rel.autoExtend} onChange={(val) => handleAutoExtendToggle(idx, val)} size="sm" />
                </div>
              </div>
            )}
            <ul className="text-xs text-gray-700 space-y-1">
              {rel.roles.map((role) => (
                <li key={role} className="flex items-center py-2">
                  <span className="mr-2 text-green-400">✔</span> {role}
                </li>
              ))}
            </ul>
          </ExpandableSection>
        ))}
      </ExpandableSection>
      {/* Section 3: Special Qualifications */}
      <ExpandableSection
        open={specialQualificationsSectionOpen}
        onToggle={setSpecialQualificationsSectionOpen}
        title={
          <div className="flex items-center w-full justify-between">
            <span>Special Qualifications</span>
            <div className="flex items-center">
              <ActionButton onClick={handleQualificationNew}>New</ActionButton>
              <ActionButton onClick={handleSpecialQualificationsSync}>Sync</ActionButton>
            </div>
          </div>
        }
      >
        {specialQualifications.map((qual, idx) => (
          <div key={`${qual.name}-${qual.domain}-${idx}`} className="mb-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <div className="font-semibold text-gray-700">{qual.name}</div>
              {qual.active ? (
                <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-2 py-1">Active</span>
              ) : (
                <span className="text-xs font-bold uppercase text-yellow-700 bg-yellow-100 rounded px-2 py-1">Pending</span>
              )}
            </div>
            {!qual.active && (
              <div className="text-xs text-gray-600 mb-1">Domain: {qual.domain}</div>
            )}
            <div className="text-xs text-gray-500">
              {!qual.active ? (
                'Request sent to Microsoft - awaiting approval'
              ) : (
                `Last modified on ${qual.lastModified}`
              )}
            </div>
          </div>
        ))}
      </ExpandableSection>
      {/* Section 4: Azure */}
      <ExpandableSection title="Azure">
        <div className="mb-4 py-2">
          <div className="font-semibold text-gray-700 mb-1">Microsoft Purchase Permissions</div>
          <div className="bg-gray-50 border border-gray-200 rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs">Azure Reservations</div>
              <div className="text-xs text-gray-500">Enabling this setting allows customers to purchase Azure Reservations. Please follow the guidelines before you enable this feature for your customer.</div>
            </div>
            <div className="flex items-center">
              <Toggle enabled={azureReservations} onChange={setAzureReservations} size="sm" />
              <span className={`text-xs ml-2 ${azureReservations ? 'text-green-700' : 'text-gray-400 opacity-60'}`}>{azureReservations ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
        <div className="mb-4 py-2">
          <div className="font-semibold text-gray-700 mb-1">Microsoft Cost Management</div>
          <div className="bg-gray-50 border border-gray-200 rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs">Azure Subscription Usage</div>
              <div className="text-xs text-gray-500">Enabling this setting updates the customer's billing policy to allow users with the proper role and access to the subscription, visibility into their consumption and the associated retail pay-as-you-go rates in the Azure portal.</div>
            </div>
            <div className="flex items-center">
              <Toggle enabled={azureUsage} onChange={setAzureUsage} size="sm" />
              <span className={`text-xs ml-2 ${azureUsage ? 'text-green-700' : 'text-gray-400 opacity-60'}`}>{azureUsage ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
      </ExpandableSection>

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
    </div>
  );
};

// Make this a module for TypeScript isolatedModules
export {};