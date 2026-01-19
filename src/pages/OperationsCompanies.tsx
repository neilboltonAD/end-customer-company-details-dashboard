import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, HelpCircle, Plus, ArrowLeftRight } from 'lucide-react';
import { Badge } from '@mantine/core';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { P2PTransfersManagementModal } from '../components/company/p2p';

// Operations Sidebar Component
const OperationsSidebar = ({ activeItem }: { activeItem: string }) => {
  const navigate = useNavigate();
  
  const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-1">
      <div className="bg-gray-100 border-y border-gray-200 px-4 py-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );

  const SidebarItem = ({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
        active ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <aside className="w-56 bg-white min-h-[calc(100vh-56px)] border-r border-gray-200">
      <SidebarSection title="OPERATIONS">
        <SidebarItem label="Users" active={activeItem === 'Users'} onClick={() => navigate('/operations')} />
        <SidebarItem label="Companies" active={activeItem === 'Companies'} onClick={() => navigate('/operations/companies')} />
        <SidebarItem label="Pending Companies" active={activeItem === 'Pending Companies'} />
        <SidebarItem label="Leads" active={activeItem === 'Leads'} />
        <SidebarItem label="Quotes" active={activeItem === 'Quotes'} />
      </SidebarSection>

      <SidebarSection title="BILLING">
        <SidebarItem label="Dashboard" active={activeItem === 'Dashboard'} />
        <SidebarItem label="Purchases" active={activeItem === 'Purchases'} />
        <SidebarItem label="Orders" active={activeItem === 'Orders'} />
        <SidebarItem label="Invoices" active={activeItem === 'Invoices'} />
        <SidebarItem label="Payments" active={activeItem === 'Payments'} />
        <SidebarItem label="Metered Usage" active={activeItem === 'Metered Usage'} />
      </SidebarSection>

      <SidebarSection title="EVENTS">
        <SidebarItem label="Event Logs" active={activeItem === 'Event Logs'} />
        <SidebarItem label="App Usage Logs" active={activeItem === 'App Usage Logs'} />
        <SidebarItem label="Admin Logs" active={activeItem === 'Admin Logs'} />
      </SidebarSection>

      <SidebarSection title="ADMIN TASKS">
        <SidebarItem
          label="Microsoft"
          active={activeItem === 'Microsoft'}
          onClick={() => navigate('/operations/microsoft')}
        />
        <SidebarItem
          label="Reseller: PC Insights"
          active={activeItem === 'Reseller: PC Insights'}
          onClick={() => navigate('/operations/microsoft/reseller')}
        />
        <SidebarItem
          label="Reseller: P2P Transfers"
          active={activeItem === 'Reseller: P2P Transfers'}
          onClick={() => navigate('/operations/microsoft/p2p')}
        />
        <SidebarItem
          label="Reseller: Customer Onboarding"
          active={activeItem === 'Reseller: Customer Onboarding'}
          onClick={() => navigate('/operations/microsoft/onboarding')}
        />
      </SidebarSection>
    </aside>
  );
};

// Sample company data
const companies = [
  { name: 'demoresellercustomer3', createdOn: '11/11/25', phone: '', users: 1, access: 'None' },
  { name: 'demoresellercustomeropportunity', createdOn: '11/11/25', phone: '', users: 1, access: 'None' },
  { name: 'demoresellercustomer2', createdOn: '11/10/25', phone: '', users: 1, access: 'Marketplace Access' },
  { name: 'demoresellercustomer1', createdOn: '11/10/25', phone: '', users: 1, access: 'None' },
  { name: 'Demo Reseller', createdOn: '11/10/25', phone: '', users: 1, access: 'Reseller Access' },
  { name: 'Demo Reseller Manager', createdOn: '11/10/25', phone: '', users: 1, access: 'Marketplace Access' },
  { name: 'VodafoneDemo2', createdOn: '10/23/25', phone: '', users: 1, access: 'None' },
  { name: 'VodafoneDemo1', createdOn: '10/23/25', phone: '', users: 1, access: 'None' },
  { name: 'MMDemo3', createdOn: '10/14/25', phone: '', users: 1, access: 'None' },
  { name: 'MMDemo2', createdOn: '10/14/25', phone: '', users: 1, access: 'None' },
  { name: 'MMDemo1', createdOn: '10/14/25', phone: '', users: 1, access: 'None' },
  { name: 'Appdirect', createdOn: '10/13/25', phone: '', users: 1, access: 'None' },
  { name: 'Telus Demo', createdOn: '10/08/25', phone: '', users: 1, access: 'None' },
  { name: 'VodafoneMCADemo2', createdOn: '10/06/25', phone: '', users: 1, access: 'None' },
  { name: 'VodafoneMCADemo2', createdOn: '10/06/25', phone: '', users: 1, access: 'None' },
  { name: 'VodafoneMCADemo', createdOn: '10/06/25', phone: '', users: 1, access: 'None' },
  { name: 'CancomMCADemo3', createdOn: '10/06/25', phone: '', users: 1, access: 'None' },
  { name: 'CancomMCADemo2', createdOn: '10/06/25', phone: '', users: 1, access: 'None' },
  { name: 'CancomMCADemo', createdOn: '10/06/25', phone: '', users: 1, access: 'None' },
  { name: 'SCMCAdemo', createdOn: '09/25/25', phone: '', users: 1, access: 'None' },
];

export const OperationsCompanies = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [p2pModalOpen, setP2pModalOpen] = useState(false);

  // Mock pending transfer count for the badge
  const pendingTransferCount = 3;

  const handleCompanyClick = (companyName: string) => {
    // Navigate to company details with company name as URL param
    navigate(`/operations/companies/${encodeURIComponent(companyName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="flex">
        <OperationsSidebar activeItem="Companies" />

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-normal text-gray-900">Companies</h1>
            <div className="flex items-center space-x-3">
              <button 
                className="px-4 py-2 text-sm border border-blue-300 rounded hover:bg-blue-50 bg-white text-blue-700 flex items-center relative"
                onClick={() => setP2pModalOpen(true)}
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                P2P Transfers
                {pendingTransferCount > 0 && (
                  <span className="ml-2 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {pendingTransferCount}
                  </span>
                )}
              </button>
              <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 bg-white">
                New Lead or Purchase
              </button>
              <button className="px-4 py-2 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Create New Company
              </button>
            </div>
          </div>

          {/* Companies Table */}
          <div className="bg-white rounded shadow">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  Show Filters
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  Download Report
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by company name"
                  className="w-56 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Created on ▼</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Phone</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Users</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Access</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleCompanyClick(company.name)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-3"></span>
                        <span className="text-sm text-teal-700 hover:underline">{company.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{company.createdOn}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{company.phone || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{company.users}</td>
                    <td className="py-3 px-4 text-sm text-teal-600">{company.access}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-end space-x-4">
              <span className="text-sm text-gray-600">1-20 of 66</span>
              <div className="flex items-center space-x-1">
                <button className="p-1 rounded hover:bg-gray-100 disabled:opacity-50" disabled>
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 h-10 w-10 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-teal-700">
        <HelpCircle className="h-5 w-5" />
      </button>

      {/* P2P Transfers Management Modal */}
      <P2PTransfersManagementModal
        open={p2pModalOpen}
        onClose={() => setP2pModalOpen(false)}
      />
    </div>
  );
};


