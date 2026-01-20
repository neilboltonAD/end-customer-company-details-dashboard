import React from 'react';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { SecondaryNavbar } from '../components/navigation/SecondaryNavbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { CompanySummaryCard } from '../components/company/CompanySummaryCard';
import { CompanyTabs } from '../components/company/CompanyTabs';
import { VendorInformation } from '../components/company/VendorInformation';

export default function CompanyDetails() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--mantine-color-gray-0)' }}>
      <TopNavbar />
      <SecondaryNavbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
          <CompanySummaryCard />
          <CompanyTabs activeTab="Vendor Information" />
          <VendorInformation />
        </div>
      </div>
    </div>
  );
} 