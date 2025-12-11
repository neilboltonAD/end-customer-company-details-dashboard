import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, HelpCircle, Search, Copy, MoreVertical } from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { VendorInformation } from '../components/company/VendorInformation';
import { Toggle } from '../components/form/Toggle';

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

// Stat Card Component
const StatCard = ({ value, label }: { value: string | number; label: string }) => (
  <div className="text-center px-4 py-3 border-r border-gray-200 last:border-r-0">
    <div className="text-xl font-light text-gray-900">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

// Tab Component
const Tab = ({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
      active 
        ? 'border-teal-600 text-teal-600' 
        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
    }`}
  >
    {label}
  </button>
);

// Users Tab Content
const UsersTabContent = () => {
  const users = [
    { status: 'Enabled', name: 'Neil Bolton', role: 'Billing Admin, Company Admin', email: 'neil.bolton+demoresellercustomer1@appdirect.com', apps: 1 }
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Users</h3>
      
      <div className="bg-white rounded shadow">
        <div className="p-4 border-b border-gray-200 flex justify-end">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-48 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Name</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Email</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Apps</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-900">{user.status}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{user.apps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Synced Users Section */}
      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4 flex items-center">
        Synced Users
        <span className="ml-2 h-5 w-5 bg-gray-300 rounded-full flex items-center justify-center text-xs text-white">?</span>
      </h3>
      
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Name</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Email</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Apps</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="py-12 text-center">
                <div className="flex flex-col items-center text-gray-400">
                  <div className="text-4xl mb-2">☰</div>
                  <p className="text-sm">Once a user is synced, the user will be displayed here.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Groups Section */}
      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Groups</h3>
      
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Name</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Number of Users</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 text-sm text-gray-900">Everyone</td>
              <td className="py-3 px-4 text-sm text-gray-600">1</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 text-sm text-gray-900">Company Admins</td>
              <td className="py-3 px-4 text-sm text-gray-600">1</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 text-sm text-gray-900">Billing Admins</td>
              <td className="py-3 px-4 text-sm text-gray-600">1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Placeholder Tab Content
const PlaceholderTabContent = ({ tabName }: { tabName: string }) => (
  <div className="mt-6 bg-white rounded shadow p-8 text-center text-gray-500">
    <p>{tabName} content will appear here.</p>
  </div>
);

// Reseller Sidebar Component
const ResellerSidebar = ({ activeItem }: { activeItem: string }) => {
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
    <aside className="w-56 bg-white min-h-[calc(100vh-100px)] border-r border-gray-200">
      <SidebarSection title="HOME">
        <SidebarItem label="Companies" active={activeItem === 'Companies'} />
        <SidebarItem label="Users" active={activeItem === 'Users'} />
        <SidebarItem label="Leads" active={activeItem === 'Leads'} />
        <SidebarItem label="Quotes" active={activeItem === 'Quotes'} />
        <SidebarItem label="Orders" active={activeItem === 'Orders'} />
        <SidebarItem label="Logs" active={activeItem === 'Logs'} />
      </SidebarSection>
    </aside>
  );
};

// Reseller Top Navigation
const ResellerTopNav = () => (
  <div className="bg-white border-b border-gray-200">
    <div className="flex items-center px-4">
      <span className="text-gray-600 text-sm py-3 pr-4 border-r border-gray-200">Reseller</span>
      <nav className="flex items-center ml-4 space-x-6">
        <a href="#" className="text-sm text-gray-600 py-3 hover:text-gray-900">Dashboard</a>
        <a href="#" className="text-sm text-gray-900 py-3 border-b-2 border-gray-800 font-medium">Home</a>
        <a href="#" className="text-sm text-gray-600 py-3 hover:text-gray-900">Settings</a>
      </nav>
    </div>
  </div>
);

// Reseller Companies View
const ResellerCompaniesView = ({ onCompanyClick }: { onCompanyClick: (company: string) => void }) => {
  const companies = [
    { name: 'demoresellercustomer1', createdOn: '12/11/25', phone: '', users: 1, access: 'None' },
    { name: 'Demo - Customer 5', createdOn: '03/19/25', phone: '', users: 3, access: 'None' },
    { name: 'Demo Customer - 4', createdOn: '03/19/25', phone: '7147742253', users: 1, access: 'None' },
    { name: 'Demo - Customer 2', createdOn: '02/21/25', phone: '7147742253', users: 2, access: 'None' },
    { name: 'Demo - Customer 1', createdOn: '02/21/25', phone: '7147742253', users: 2, access: 'None' },
  ];

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-light text-gray-900">Companies</h1>
          <button className="ml-2 text-gray-400 hover:text-gray-600">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 bg-white">
            New Lead or Purchase
          </button>
          <button className="px-4 py-2 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center">
            <span className="mr-1">+</span> Create New Company
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded shadow">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Show Filters
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center">
              <span className="mr-1">↓</span> Download CSV
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by company name"
              className="w-64 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Created on <ChevronDown className="inline h-3 w-3" />
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Phone</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Users</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Access</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, idx) => (
              <tr 
                key={idx} 
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => onCompanyClick(company.name)}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <span className="h-2.5 w-2.5 bg-green-500 rounded-full mr-3"></span>
                    <span className="text-sm text-gray-900">{company.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{company.createdOn}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{company.phone}</td>
                <td className="py-3 px-4 text-sm text-gray-600 text-center">{company.users}</td>
                <td className="py-3 px-4 text-sm text-gray-600 text-center">{company.access}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reseller Company Details View
const ResellerCompanyDetailsView = ({ 
  companyName, 
  onBack 
}: { 
  companyName: string; 
  onBack: () => void;
}) => {
  const [activeTab, setActiveTab] = useState('Users');
  const [moreTabsOpen, setMoreTabsOpen] = useState(false);
  
  const companyId = 'f98547c2-2218-4096-814e-3cc90be4a3a3';
  const allTabs = ['Users', 'Billing', 'Activities', 'Payment Methods', 'Vendor Information', 'Domains'];
  const overflowTabs = ['Settings', 'Association'];

  const users = [
    { status: 'Enabled', name: 'Neil Bolton', email: 'neil.bolton+bezaq-customer@appdirect.com', apps: '' },
    { status: 'Enabled', name: 'Neil Bolton', email: 'neil.bolton+mm@appdirect.com', apps: '' },
  ];

  const groups = [
    { name: 'Everyone', users: 2 },
    { name: 'Company Admins', users: 2 },
    { name: 'Billing Admins', users: 2 },
  ];

  const renderTabContent = () => {
    if (activeTab === 'Users') {
      return (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Users</h3>
          <div className="bg-white rounded shadow mb-6">
            <div className="p-4 border-b border-gray-200 flex justify-end">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-48 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Apps</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="h-2.5 w-2.5 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm text-gray-700">{user.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{user.name}</td>
                    <td className="py-3 px-4 text-sm text-teal-600">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-right">{user.apps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            Synced Users
            <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
          </h3>
          <div className="bg-white rounded shadow mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Apps</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="text-gray-400 mb-2">
                      <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">Once a user is synced, the user will be displayed here.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">Groups</h3>
          <div className="bg-white rounded shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Number of Users</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">{group.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{group.users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'Vendor Information') {
      return <VendorInformation />;
    }

    return (
      <div className="mt-6 bg-white rounded shadow p-8 text-center text-gray-500">
        <p>{activeTab} content will appear here.</p>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={onBack} className="text-teal-600 hover:underline">
          Companies
        </button>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-900">{companyName}</span>
      </div>

      {/* Company Header */}
      <div className="bg-white rounded shadow mb-4">
        <div className="p-4 flex items-center">
          <div className="h-12 w-12 bg-teal-600 rounded flex items-center justify-center mr-4">
            <span className="text-white text-lg">🏢</span>
          </div>
          <div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Company</span>
              <span className="ml-2 flex items-center text-green-600 text-sm">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                Enabled
              </span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">{companyName}</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-4 flex items-center space-x-2">
          <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 bg-white">
            New Lead or Purchase
          </button>
          <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 bg-white flex items-center">
            Manage Company
            <ChevronDown className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="border-t border-gray-200 flex">
          <div className="text-center px-4 py-3 border-r border-gray-200 flex-1">
            <div className="text-xl font-light text-gray-900">0</div>
            <div className="text-xs text-gray-500">Free Trials</div>
          </div>
          <div className="text-center px-4 py-3 border-r border-gray-200 flex-1">
            <div className="text-xl font-light text-gray-900">0</div>
            <div className="text-xs text-gray-500">Expired Free Trials</div>
          </div>
          <div className="text-center px-4 py-3 border-r border-gray-200 flex-1">
            <div className="text-xl font-light text-gray-900">0</div>
            <div className="text-xs text-gray-500">Purchased Products</div>
          </div>
          <div className="text-center px-4 py-3 border-r border-gray-200 flex-1">
            <div className="text-xl font-light text-gray-900">0</div>
            <div className="text-xs text-gray-500">Suspended Products</div>
          </div>
          <div className="text-center px-4 py-3 border-r border-gray-200 flex-1">
            <div className="text-xl font-light text-gray-900">0</div>
            <div className="text-xs text-gray-500">Unpaid Invoices</div>
          </div>
          <div className="text-center px-4 py-3 flex-1">
            <div className="text-xl font-light text-gray-900">$0.00</div>
            <div className="text-xs text-gray-500">Total Spent</div>
          </div>
        </div>
      </div>

      {/* Company Info Card */}
      <div className="bg-white rounded shadow mb-4 p-4">
        <div className="flex justify-between">
          <div className="grid grid-cols-2 gap-x-16 gap-y-4 flex-1">
            <div>
              <div className="text-xs text-gray-500">Company Name</div>
              <div className="text-sm text-gray-900">{companyName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Created</div>
              <div className="text-sm text-gray-900">02/21/25</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">ID</div>
              <div className="text-sm text-gray-900 flex items-center">
                {companyId}
                <button className="ml-2 text-gray-400 hover:text-gray-600">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Website</div>
              <a href="#" className="text-sm text-teal-600 hover:underline">appdirect.com</a>
            </div>
            <div>
              <div className="text-xs text-gray-500">Company's External ID</div>
              <div className="text-sm text-gray-500">No value</div>
            </div>
          </div>
        </div>
        
        {/* Show More */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center bg-gradient-to-t from-teal-50 to-transparent -mx-4 -mb-4 px-4 pb-2 rounded-b">
          <button className="text-teal-600 hover:underline text-sm flex items-center justify-center mx-auto">
            Show more
            <ChevronDown className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded shadow">
        <div className="border-b border-gray-200 flex items-center">
          {allTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-teal-600 text-teal-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
          
          {/* More Tabs Dropdown */}
          <div className="relative ml-auto">
            <button 
              onClick={() => setMoreTabsOpen(!moreTabsOpen)}
              className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900 flex items-center"
            >
              + {overflowTabs.length} more Tabs
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            
            {moreTabsOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded shadow-lg border border-gray-200 z-10">
                {overflowTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setMoreTabsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// End Customer Sidebar Component
const EndCustomerSidebar = ({ activeItem }: { activeItem: string }) => {
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
      <SidebarSection title="COMPANY SETTINGS">
        <SidebarItem label="Company Settings" active={activeItem === 'Company Settings'} />
        <SidebarItem label="Single Sign-On" active={activeItem === 'Single Sign-On'} />
      </SidebarSection>

      <SidebarSection title="VENDOR INFORMATION">
        <SidebarItem label="Adobe" active={activeItem === 'Adobe'} />
        <SidebarItem label="Microsoft" active={activeItem === 'Microsoft'} />
      </SidebarSection>
    </aside>
  );
};

// End Customer Microsoft View Component
const EndCustomerMicrosoftView = () => {
  const [gdapPermissions, setGdapPermissions] = useState([
    {
      id: '261225c9-b98f-4555-b4ac-e8bde6152b42',
      name: 'GDAP Permission',
      dateRange: '11/11/2025 - 11/11/2027',
      autoExtend: true,
      active: true,
      roles: [
        'Cloud application administrator',
        'License administrator',
        'User administrator',
        'Directory readers',
      ],
    },
    {
      id: 'Default_AppD_demoreseller_437846696580155',
      name: 'GDAP Permission',
      dateRange: '11/10/2025 - 05/09/2026',
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
  ]);

  const [expandedGdap, setExpandedGdap] = useState<string | null>(null);
  const [gdapSectionOpen, setGdapSectionOpen] = useState(false);
  const [adminSectionOpen, setAdminSectionOpen] = useState(true);

  const handleAutoExtendToggle = (idx: number, value: boolean) => {
    setGdapPermissions((prev) =>
      prev.map((rel, i) =>
        i === idx ? { ...rel, autoExtend: value } : rel
      )
    );
  };

  const microsoftLogo = '/microsoft (1).png';

  // Expandable Section Component (inline for End Customer view)
  const ExpandableSection = ({ 
    title, 
    children, 
    open, 
    onToggle,
    className = ''
  }: { 
    title: React.ReactNode; 
    children: React.ReactNode; 
    open?: boolean;
    onToggle?: (open: boolean) => void;
    className?: string;
  }) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = open !== undefined ? open : internalOpen;
    const handleToggle = () => {
      if (onToggle) {
        onToggle(!isOpen);
      } else {
        setInternalOpen(!internalOpen);
      }
    };

    return (
      <div className={`border border-gray-300 rounded-lg bg-white mb-1 shadow-sm ${className}`}>
        <button
          className="w-full flex items-center justify-between px-3 py-2 text-left focus:outline-none hover:bg-gray-50 rounded-t-lg transition-colors"
          onClick={handleToggle}
        >
          <div className="flex-1 font-semibold text-gray-800 text-sm flex items-center">
            {title}
          </div>
          <span className="ml-1">
            {isOpen ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            )}
          </span>
        </button>
        {isOpen && <div className="px-3 pb-3 pt-2">{children}</div>}
      </div>
    );
  };

  return (
    <div className="flex-1 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Microsoft</h3>
      
      {/* My Microsoft Tenant Information Card - Same structure as Reseller view */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-800">My Microsoft Tenant Information</h4>
        </div>
        
        {/* Tenant Domain Details - inline, not collapsible */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={microsoftLogo} alt="Microsoft Logo" className="w-10 h-10 mr-3 rounded" />
              <div className="space-y-1">
                <div>
                  <span className="text-xs text-gray-500">Tenant Name: </span>
                  <span className="text-sm font-semibold text-gray-800">demoresellercustomer13799.onmicrosoft.com</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Tenant UUID: </span>
                  <span className="text-xs text-gray-600 font-mono">8e97f6e7-f67b-445f-9e85-393c7daff321</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-1.5 py-0.5">Active</span>
            </div>
          </div>
        </div>

        {/* Administration Information Subsection */}
        <ExpandableSection
          title="Administration Information"
          open={adminSectionOpen}
          onToggle={setAdminSectionOpen}
        >
          <div className="mb-3">
            <div className="text-xs font-semibold text-gray-700 mb-1">Global Admin User(s)</div>
            <ul className="text-xs text-gray-700 space-y-1">
              <li className="flex items-center">
                <span className="mr-1.5 text-green-400">•</span>
                admin@demoresellercustomer13799.onmicrosoft.com
              </li>
              <li className="flex items-center">
                <span className="mr-1.5 text-green-400">•</span>
                neil.bolton@demoresellercustomer13799.onmicrosoft.com
              </li>
            </ul>
          </div>
          
          <div className="mb-3">
            <div className="text-xs font-semibold text-gray-700 mb-1">Billing Admin User(s)</div>
            <ul className="text-xs text-gray-700 space-y-1">
              <li className="flex items-center">
                <span className="mr-1.5 text-green-400">•</span>
                billing@demoresellercustomer13799.onmicrosoft.com
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1">Microsoft Customer Agreement Status</div>
            <div className="flex items-center justify-between text-xs text-gray-700">
              <span className="flex items-center">
                <span className="mr-1.5 text-green-400">•</span>
                Last Agreement Date: 11/10/2025
              </span>
              <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-1.5 py-0.5">Active</span>
            </div>
          </div>
        </ExpandableSection>

        {/* GDAP Relationships Subsection */}
        <ExpandableSection
          title="GDAP Relationships"
          open={gdapSectionOpen}
          onToggle={setGdapSectionOpen}
        >
          {gdapPermissions.map((permission, idx) => {
            const isExpanded = expandedGdap === permission.id;
            
            return (
              <div 
                key={permission.id} 
                className="border border-gray-200 rounded-lg bg-gray-50 mb-2 ml-2"
              >
                <button
                  className="w-full flex items-center justify-between px-3 py-2 text-left focus:outline-none hover:bg-gray-100 rounded-t-lg transition-colors"
                  onClick={() => setExpandedGdap(isExpanded ? null : permission.id)}
                >
                  <div className="flex-1 flex items-center">
                    <span className="text-xs text-gray-800">{permission.id}</span>
                    {permission.active ? (
                      <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-1.5 py-0.5 ml-2">Active</span>
                    ) : (
                      <span className="text-xs font-bold uppercase text-yellow-700 bg-yellow-100 rounded px-1.5 py-0.5 ml-2">Pending</span>
                    )}
                  </div>
                  <span className="ml-1">
                    {isExpanded ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    )}
                  </span>
                </button>
                
                {isExpanded && (
                  <div className="px-3 pb-3 pt-2">
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600">GDAP relationship granted by your Reseller.</div>
                      <div className="text-xs text-gray-500">
                        Valid: {permission.dateRange}
                      </div>
                      <div className="flex items-center justify-end py-0.5">
                        <span className="text-xs text-gray-700 mr-1">Auto-renew</span>
                        <Toggle enabled={permission.autoExtend} onChange={(val) => handleAutoExtendToggle(idx, val)} size="sm" />
                      </div>
                      <ul className="text-xs text-gray-700 space-y-0.5">
                        {permission.roles.map((role) => (
                          <li key={role} className="flex items-center">
                            <span className="mr-1.5 text-green-400">✔</span> {role}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </ExpandableSection>

        {/* Special Qualifications - Empty State */}
        <ExpandableSection title="Special Qualification Status">
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-5 text-center">
            <p className="text-xs font-semibold text-gray-700 mb-2">No Special Qualifications set</p>
            <p className="text-xs text-gray-500">
              Customers can only purchase special segment offers if they meet Microsoft eligibility.
            </p>
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
};

export const OperationsCompanyDetails = () => {
  const navigate = useNavigate();
  const { companyName } = useParams();
  const decodedCompanyName = decodeURIComponent(companyName || 'demoresellercustomer1');
  
  const [activeTab, setActiveTab] = useState('Users');
  const [moreTabsOpen, setMoreTabsOpen] = useState(false);
  const [visibleTabCount, setVisibleTabCount] = useState(9); // Show all by default
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  // Demo toggle state - 'mm' (Marketplace Manager), 'reseller', or 'endcustomer'
  type ViewMode = 'mm' | 'reseller' | 'endcustomer';
  const [viewMode, setViewMode] = useState<ViewMode>('mm');
  const [endCustomerActiveItem, setEndCustomerActiveItem] = useState('Microsoft');
  const [resellerSelectedCompany, setResellerSelectedCompany] = useState<string | null>(null);

  const allTabs = ['Users', 'Billing', 'Activities', 'Settings', 'Reseller Companies', 'Payment Methods', 'Vendor Information', 'Domains', 'Association'];
  
  const companyId = '7c7cd39e-e239-43c5-b099-0888671761af';

  // Calculate how many tabs can fit
  useEffect(() => {
    const calculateVisibleTabs = () => {
      if (!tabsContainerRef.current) return;
      
      const containerWidth = tabsContainerRef.current.offsetWidth;
      const TAB_WIDTH = 140; // Approximate width per tab
      const DROPDOWN_WIDTH = 120; // Width for dropdown button
      const PADDING = 20;
      
      // Calculate how many tabs can fit
      const availableWidth = containerWidth - PADDING;
      let maxTabs = Math.floor(availableWidth / TAB_WIDTH);
      
      // If all tabs fit, show them all
      if (maxTabs >= allTabs.length) {
        setVisibleTabCount(allTabs.length);
      } else {
        // Reserve space for dropdown, show fewer tabs
        maxTabs = Math.floor((availableWidth - DROPDOWN_WIDTH) / TAB_WIDTH);
        setVisibleTabCount(Math.max(3, maxTabs)); // Show at least 3 tabs
      }
    };

    calculateVisibleTabs();
    
    const resizeObserver = new ResizeObserver(calculateVisibleTabs);
    if (tabsContainerRef.current) {
      resizeObserver.observe(tabsContainerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);

  const visibleTabs = allTabs.slice(0, visibleTabCount);
  const overflowTabs = allTabs.slice(visibleTabCount);
  const hasOverflow = overflowTabs.length > 0;

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setMoreTabsOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Users':
        return <UsersTabContent />;
      case 'Vendor Information':
        return <VendorInformation />;
      default:
        return <PlaceholderTabContent tabName={activeTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo Toggle Panel - Always at very top */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-2">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 text-xs font-medium bg-yellow-400 text-yellow-900 rounded">DEMO</span>
            <span className="text-sm font-medium text-gray-700">View Mode:</span>
            <div className="flex items-center bg-gray-200 rounded-full p-0.5">
              <button
                onClick={() => setViewMode('mm')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                  viewMode === 'mm' 
                    ? 'bg-teal-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Marketplace Manager
              </button>
              <button
                onClick={() => setViewMode('reseller')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                  viewMode === 'reseller' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Reseller
              </button>
              <button
                onClick={() => setViewMode('endcustomer')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                  viewMode === 'endcustomer' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                End Customer
              </button>
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {viewMode === 'mm' && 'Viewing as Marketplace Manager (manage all customers)'}
            {viewMode === 'reseller' && 'Viewing as Reseller (manage end customers)'}
            {viewMode === 'endcustomer' && 'Viewing as End Customer (self-service portal)'}
          </span>
        </div>
      </div>

      {viewMode === 'reseller' ? <ResellerTopNav /> : <TopNavbar />}

      <div className="flex">
        {viewMode === 'endcustomer' ? (
          <EndCustomerSidebar activeItem={endCustomerActiveItem} />
        ) : viewMode === 'reseller' ? (
          <ResellerSidebar activeItem="Companies" />
        ) : (
          <OperationsSidebar activeItem="Companies" />
        )}

        {viewMode === 'endcustomer' ? (
          <EndCustomerMicrosoftView />
        ) : viewMode === 'reseller' ? (
          resellerSelectedCompany ? (
            <ResellerCompanyDetailsView 
              companyName={resellerSelectedCompany} 
              onBack={() => setResellerSelectedCompany(null)} 
            />
          ) : (
            <ResellerCompaniesView onCompanyClick={(company) => setResellerSelectedCompany(company)} />
          )
        ) : (
        <main className="flex-1 p-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <button 
              onClick={() => navigate('/operations/companies')}
              className="hover:text-teal-600"
            >
              Companies
            </button>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900">{decodedCompanyName}</span>
          </div>

          {/* Company Header */}
          <div className="bg-white rounded shadow mb-4">
            <div className="p-4 flex items-center">
              <div className="h-12 w-12 bg-teal-600 rounded flex items-center justify-center mr-4">
                <span className="text-white text-lg">🏢</span>
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Company</span>
                  <span className="ml-2 flex items-center text-green-600 text-sm">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                    Enabled
                  </span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">{decodedCompanyName}</h1>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-4 flex items-center space-x-2">
              <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 bg-white">
                New Lead or Purchase
              </button>
              <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 bg-white flex items-center">
                Manage Company
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Stats Row */}
            <div className="border-t border-gray-200 flex">
              <StatCard value="0" label="Free Trials" />
              <StatCard value="0" label="Expired Free Trials" />
              <StatCard value="2" label="Purchased Products" />
              <StatCard value="0" label="Suspended Products" />
              <StatCard value="0" label="Unpaid Invoices" />
              <StatCard value="$95.06" label="Total Spent" />
            </div>
          </div>

          {/* Company Info Card */}
          <div className="bg-white rounded shadow mb-4 p-4">
            <div className="flex justify-between">
              <div className="grid grid-cols-2 gap-x-16 gap-y-4 flex-1">
                <div>
                  <div className="text-xs text-gray-500">Company Name</div>
                  <div className="text-sm text-gray-900">{decodedCompanyName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Created</div>
                  <div className="text-sm text-gray-900">11/10/25</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">ID</div>
                  <div className="text-sm text-gray-900 flex items-center">
                    {companyId}
                    <button className="ml-2 text-gray-400 hover:text-gray-600">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Website</div>
                  <a href="#" className="text-sm text-teal-600 hover:underline">appdirect.com</a>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Company's External ID</div>
                  <div className="text-sm text-gray-500">No value</div>
                </div>
                <div></div>
                <div>
                  <div className="text-xs text-gray-500">Mailing address</div>
                  <a href="#" className="text-sm text-teal-600 hover:underline">
                    neil.bolton+{decodedCompanyName}@appdirect.com
                  </a>
                </div>
                <div></div>
                <div>
                  <div className="text-xs text-gray-500">MPN ID</div>
                  <div className="text-sm text-gray-500">No value</div>
                </div>
              </div>
              <div>
                <button className="text-teal-600 hover:underline text-sm">Edit</button>
              </div>
            </div>
            
            {/* Show More */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <button className="text-teal-600 hover:underline text-sm flex items-center justify-center mx-auto">
                Show more
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded shadow">
            <div ref={tabsContainerRef} className="border-b border-gray-200 flex items-center">
              {visibleTabs.map((tab) => (
                <Tab 
                  key={tab} 
                  label={tab} 
                  active={activeTab === tab} 
                  onClick={() => handleTabClick(tab)} 
                />
              ))}
              
              {/* More Tabs Dropdown - only show if there are overflow tabs */}
              {hasOverflow && (
                <div className="relative ml-auto">
                  <button 
                    onClick={() => setMoreTabsOpen(!moreTabsOpen)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                      overflowTabs.includes(activeTab)
                        ? 'border-teal-600 text-teal-600' 
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    + {overflowTabs.length} more Tab{overflowTabs.length > 1 ? 's' : ''}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  
                  {moreTabsOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded shadow-lg border border-gray-200 z-10">
                      {overflowTabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => handleTabClick(tab)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            activeTab === tab ? 'bg-teal-600 text-white' : 'text-gray-700'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {renderTabContent()}
            </div>
          </div>
        </main>
        )}
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 h-10 w-10 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-teal-700">
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

