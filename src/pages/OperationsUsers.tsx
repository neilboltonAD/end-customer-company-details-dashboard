import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, HelpCircle, Download } from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';

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
        <SidebarItem label="Microsoft" active={activeItem === 'Microsoft'} />
      </SidebarSection>
    </aside>
  );
};

// Sample user data
const users = [
  { name: 'Neil Bolton', createdOn: '11/11/25', company: 'demoresellercustomer3', email: 'neil.bolton+demoresellercustomer3@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '11/11/25', company: 'demoresellercustomeropportunity', email: 'neil.bolton+demoresellercustomeropportunity@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '11/10/25', company: 'demoresellercustomer2', email: 'neil.bolton+demoresellercustomer2@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '11/10/25', company: 'demoresellercustomer1', email: 'neil.bolton+demoresellercustomer1@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '11/10/25', company: 'Demo Reseller', email: 'neil.bolton+demoreseller@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '11/10/25', company: 'Demo Reseller Manager', email: 'neil.bolton+demoresellermanager@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/23/25', company: 'VodafoneDemo2', email: 'neil.bolton+vodafonedemo2@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/23/25', company: 'VodafoneDemo1', email: 'neil.bolton+vodafonedemo1@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/14/25', company: 'MMDemo3', email: 'neil.bolton+mmdemo3@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/14/25', company: 'MMDemo2', email: 'neil.bolton+mmdemo2@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/14/25', company: 'MMDemo1', email: 'neil.bolton+mmdemo1@appdirect.com' },
  { name: 'Suresh MM', createdOn: '10/13/25', company: 'Appdirect', email: 'suresh.jambhalkar+mm@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/08/25', company: 'Telus Demo', email: 'neil.bolton+telusmcademo@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/06/25', company: 'VodafoneMCADemo2', email: 'neil.bolton+vodafonemcademo2@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/06/25', company: 'VodafoneMCADemo2', email: 'neil.bolton+vodafonemcademo1@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/06/25', company: 'VodafoneMCADemo', email: 'neil.bolton+vodafonemcademo@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/06/25', company: 'CancomMCADemo3', email: 'neil.bolton+cancommcademo3@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/06/25', company: 'CancomMCADemo2', email: 'neil.bolton+cancomdemo2@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '10/06/25', company: 'CancomMCADemo', email: 'neil.bolton+cancommcademo@appdirect.com' },
  { name: 'Neil Bolton', createdOn: '09/25/25', company: 'SCMCAdemo', email: 'bezaqdemo+scmcademo@gmail.com' },
];

export const OperationsUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="flex">
        <OperationsSidebar activeItem="Users" />

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-normal text-gray-900">Users</h1>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 bg-white">
              New Lead or Purchase
            </button>
          </div>

          {/* Pending Invitations Banner */}
          <div className="bg-white rounded shadow p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">There are 10 pending user invitations to the marketplace.</p>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Manage Invitations
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded shadow">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  Show Filters
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  Download CSV
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-48 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Company</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-3"></span>
                        <span className="text-sm text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user.createdOn}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user.company}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-end space-x-4">
              <span className="text-sm text-gray-600">1-20 of 96</span>
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
    </div>
  );
};

