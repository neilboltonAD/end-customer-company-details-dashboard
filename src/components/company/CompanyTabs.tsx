import React from 'react';
import { Tabs } from 'components/DesignSystem';

const tabs = [
  'Users',
  'Billing',
  'Activities',
  'Settings',
  'Vendor Information',
  '+ 4 more Tabs',
];

export const CompanyTabs = ({ activeTab }: { activeTab: string }) => (
  <Tabs
    value={activeTab}
    onTabChange={() => {}}
    tabs={tabs.map((t) => ({ id: t, label: t }))}
  />
);