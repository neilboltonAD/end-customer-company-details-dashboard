import React, { useState } from 'react';
import { MicrosoftSection } from './MicrosoftSection';
import { CompanyDetailsAdobe } from './CompanyDetailsAdobe';
import { ExpandableSection } from '../layout/ExpandableSection';
import { Card, Select, Stack, Text, Title } from 'components/DesignSystem';

const GoogleSection = () => (
  <Stack gap="xs">
    <Title order={4}>Google</Title>
    <ExpandableSection 
      title="Google" 
      sectionId="vendor-google"
      helpContent="Google Workspace integration provides access to user management, email services, and collaboration tools. This section displays your current Google Workspace configuration and connection status."
    >
      {/* Placeholder for Google content */}
      <Text c="dimmed" size="sm">
        No Google data available.
      </Text>
    </ExpandableSection>
  </Stack>
);

export const VendorInformation = () => {
  const [selectedVendor, setSelectedVendor] = useState('Microsoft');

  return (
    <Stack gap="md">
      <Card>
        <Select
          label="Select Vendor"
          data={[
            { value: 'Microsoft', label: 'Microsoft' },
            { value: 'Adobe', label: 'Adobe' },
            { value: 'Google', label: 'Google' },
          ]}
          value={selectedVendor}
          onChange={(v) => setSelectedVendor(v || 'Microsoft')}
        />
      </Card>
      {selectedVendor === 'Microsoft' && <MicrosoftSection />}
      {selectedVendor === 'Adobe' && <CompanyDetailsAdobe />}
      {selectedVendor === 'Google' && <GoogleSection />}
    </Stack>
  );
}; 