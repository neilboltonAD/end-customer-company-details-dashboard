import React, { useState } from 'react';
import { MicrosoftSection } from './MicrosoftSection';
import { CompanyDetailsAdobe } from './CompanyDetailsAdobe';
import { ExpandableSection } from '../layout/ExpandableSection';

const GoogleSection = () => (
  <div className="mb-8">
    <div className="text-lg font-bold text-gray-800 mb-2">Google</div>
    <ExpandableSection 
      title="Google" 
      sectionId="vendor-google"
      helpContent="Google Workspace integration provides access to user management, email services, and collaboration tools. This section displays your current Google Workspace configuration and connection status."
    >
      {/* Placeholder for Google content */}
      <div className="text-gray-500 text-sm">No Google data available.</div>
    </ExpandableSection>
  </div>
);

export const VendorInformation = () => {
  const [selectedVendor, setSelectedVendor] = useState('Microsoft');

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="vendor-select" className="block text-sm font-medium text-gray-700 mb-1">Select Vendor</label>
        <select
          id="vendor-select"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedVendor}
          onChange={e => setSelectedVendor(e.target.value)}
        >
          <option>Microsoft</option>
          <option>Adobe</option>
          <option>Google</option>
        </select>
      </div>
      {selectedVendor === 'Microsoft' && <MicrosoftSection />}
      {selectedVendor === 'Adobe' && <CompanyDetailsAdobe />}
      {selectedVendor === 'Google' && <GoogleSection />}
    </div>
  );
}; 