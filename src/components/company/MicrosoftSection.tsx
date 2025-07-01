import React from 'react';
import { ExpandableSection } from '../layout/ExpandableSection';
import { Toggle } from '../form/Toggle';

const gdapRelationships = [
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

const ActionButton = ({ children }: { children: React.ReactNode }) => (
  <button
    className="ml-2 px-3 py-1 text-xs rounded border border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
    type="button"
  >
    {children}
  </button>
);

export const MicrosoftSection = () => (
  <div className="mb-8">
    <h3 className="text-lg font-bold text-gray-800 mb-2">Microsoft</h3>
    {/* Section 1: Customer Tenant Information */}
    <ExpandableSection title="Customer Tenant Information" defaultOpen={true}>
      <div className="mb-4 py-2">
        <div className="flex items-center justify-between mb-1">
          <div className="font-semibold text-gray-700">appdirectdemonstration5.onmicrosoft.com</div>
          <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-2 py-1">Active</span>
        </div>
        <div className="text-xs text-gray-500 mb-2">408f194e-dc4a-4a2e-ac65-d1d6b0c11a8a</div>
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
      title={
        <div className="flex items-center w-full justify-between">
          <span>GDAP Relationships</span>
          <div className="flex items-center">
            <ActionButton>New</ActionButton>
            <ActionButton>Sync</ActionButton>
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
              {rel.active && (
                <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-2 py-1 ml-2">Active</span>
              )}
            </div>
          }
          defaultOpen={false}
          className="mb-3 border-gray-200 border-b-0"
        >
          {rel.name.startsWith('Default_') ? (
            <div className="text-xs text-gray-600 mb-2">This is a Default GDAP relationship and assigned when the tenant was created.</div>
          ) : (
            <div className="text-xs text-gray-600 mb-2">This GDAP relationship was explicitly requested by &lt;partner&gt; and accepted by the customer.</div>
          )}
          <div className="text-xs text-gray-500 mb-2">
            {rel.autoExtend 
              ? `Relationship is valid from ${rel.dateRange.split(' - ')[0]} to ${rel.dateRange.split(' - ')[1]}`
              : `Relationship is valid from ${rel.dateRange.split(' - ')[0]} to ${rel.dateRange.split(' - ')[1]} and will NOT renew`
            }
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1"></div>
            <div className="flex items-center">
              <span className="text-xs text-gray-700 mr-2">Renew every 180 days</span>
              <Toggle enabled={rel.autoExtend} onChange={() => {}} size="sm" />
            </div>
          </div>
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
      title={
        <div className="flex items-center w-full justify-between">
          <span>Special Qualifications</span>
          <div className="flex items-center">
            <ActionButton>New</ActionButton>
            <ActionButton>Sync</ActionButton>
          </div>
        </div>
      }
    >
      <div className="flex items-center justify-between mb-1 py-2">
        <div className="font-semibold text-gray-700">Education</div>
        <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-2 py-1">Active</span>
      </div>
      <div className="text-xs text-gray-500 mb-3">Last modified on 06/25/2025</div>
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
            <Toggle enabled={true} onChange={() => {}} size="sm" />
            <span className="text-xs text-green-700 ml-2">Enabled</span>
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
            <Toggle enabled={false} onChange={() => {}} size="sm" />
            <span className="text-xs text-gray-400 opacity-60 ml-2">Disabled</span>
          </div>
        </div>
      </div>
    </ExpandableSection>
  </div>
); 