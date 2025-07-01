import React from 'react';

const tabs = [
  'Users',
  'Billing',
  'Activities',
  'Settings',
  'Vendor Information',
  '+ 4 more Tabs',
];

export const CompanyTabs = ({ activeTab }: { activeTab: string }) => (
  <ul className="flex border-b border-gray-300 bg-white rounded-t">
    {tabs.map((tab) => (
      <li key={tab} className="block pr-2">
        <a
          className={
            tab === activeTab
              ? 'block text-sm relative top-[1px] font-medium text-gray-700 bg-white border border-gray-300 border-b-white rounded-t px-3 py-2'
              : 'block text-sm relative top-[1px] text-gray-500 px-3 py-2'
          }
          href="#"
        >
          {tab}
        </a>
      </li>
    ))}
  </ul>
); 