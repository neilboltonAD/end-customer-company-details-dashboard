import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, HelpCircle, Search, Copy, MoreVertical, TrendingUp, TrendingDown, Minus, DollarSign, Users, Package, Activity, Edit2, RotateCcw, X } from 'lucide-react';
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

// End Customer Insights Component - Similar to Partner Center Insights but with "Cost" instead of "Revenue"
interface EndCustomerSubscriptionData {
  id: string;
  productName: string;
  displayName: string;
  sku: string;
  seats: number;
  assignedSeats: number;
  activeUsers: number;
  cost: number;
  status: 'active' | 'suspended' | 'expired';
  renewalDate?: string;
  termType: string;
}

const EndCustomerMetricCard: React.FC<{
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  subtitle?: string;
  status?: 'good' | 'warning' | 'poor' | 'neutral';
}> = ({ title, value, trend, icon, subtitle, status = 'neutral' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'poor': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-3 h-3 text-red-600" />;
    return <Minus className="w-3 h-3 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return '';
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={`border rounded-lg p-3 ${getStatusColor()}`}>
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-600">{title}</div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">{value}</span>
            {trend !== undefined && (
              <div className="flex items-center space-x-0.5">
                {getTrendIcon()}
                <span className={`text-xs font-medium ${getTrendColor()}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              </div>
            )}
          </div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

const EndCustomerRevertConfirmModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentName: string;
  originalName: string;
}> = ({ open, onClose, onConfirm, currentName, originalName }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Revert Subscription Name?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to revert the subscription nickname back to the original name?
        </p>
        <div className="bg-gray-50 rounded p-3 mb-4 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Current:</span>
            <span className="font-medium text-gray-800">{currentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Original:</span>
            <span className="font-medium text-gray-800">{originalName}</span>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm rounded bg-orange-500 text-white hover:bg-orange-600"
          >
            Revert
          </button>
        </div>
      </div>
    </div>
  );
};

const EndCustomerSubscriptionRow: React.FC<{
  subscription: EndCustomerSubscriptionData;
  onRename: (id: string, newName: string) => void;
}> = ({ subscription, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subscription.displayName);
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);
  
  const deploymentPercentage = (subscription.assignedSeats / subscription.seats) * 100;
  const usagePercentage = subscription.assignedSeats > 0 ? (subscription.activeUsers / subscription.assignedSeats) * 100 : 0;
  
  const isCustomName = subscription.displayName !== subscription.sku;

  const handleRevertConfirm = () => {
    onRename(subscription.id, subscription.sku);
    setShowRevertConfirm(false);
  };

  const getStatusBadge = () => {
    switch (subscription.status) {
      case 'active':
        return <span className="text-xs font-bold uppercase text-green-700 bg-green-100 rounded px-1.5 py-0.5">Active</span>;
      case 'suspended':
        return <span className="text-xs font-bold uppercase text-yellow-700 bg-yellow-100 rounded px-1.5 py-0.5">Suspended</span>;
      case 'expired':
        return <span className="text-xs font-bold uppercase text-red-700 bg-red-100 rounded px-1.5 py-0.5">Expired</span>;
    }
  };

  const handleSaveName = () => {
    onRename(subscription.id, editName);
    setIsEditing(false);
  };

  const ChangeButton = ({ onClick }: { onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="px-1.5 py-0.5 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
    >
      Change
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-800 text-sm">{subscription.productName}</h4>
              {getStatusBadge()}
            </div>
            
            <div className="flex items-center">
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-xs text-gray-700 border border-blue-300 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="text-xs text-blue-600 hover:underline">Save</button>
                  <button onClick={() => { setIsEditing(false); setEditName(subscription.displayName); }} className="text-xs text-gray-500 hover:underline">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center space-x-1 bg-gray-100 rounded px-2 py-0.5">
                  <span className="text-xs text-gray-500">{isCustomName ? 'Subscription Nickname:' : 'Subscription Name:'}</span>
                  <span className="text-xs text-gray-700 font-medium">{subscription.displayName}</span>
                  <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600 ml-1">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  {isCustomName && (
                    <button 
                      onClick={() => setShowRevertConfirm(true)} 
                      className="text-gray-400 hover:text-orange-600 ml-0.5"
                      title="Revert to original name"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <EndCustomerRevertConfirmModal
              open={showRevertConfirm}
              onClose={() => setShowRevertConfirm(false)}
              onConfirm={handleRevertConfirm}
              currentName={subscription.displayName}
              originalName={subscription.sku}
            />
          </div>
          
          {subscription.renewalDate && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span>Renewal: {subscription.renewalDate}</span>
              <ChangeButton />
            </div>
          )}
          
          <div className="mt-2">
            <span className="text-sm font-bold text-gray-900">${subscription.cost.toLocaleString()}</span>
            <span className="text-xs text-gray-500 ml-1">/mo cost</span>
          </div>
        </div>

        <div className="w-64 space-y-1.5 border-l border-gray-200 pl-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Total Seats</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-semibold text-gray-900">{subscription.seats}</span>
              <ChangeButton />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-14">Assigned</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  deploymentPercentage >= 90 ? 'bg-green-500' : 
                  deploymentPercentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${deploymentPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600 w-20 text-right">{subscription.assignedSeats} ({deploymentPercentage.toFixed(0)}%)</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-14">Active</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  usagePercentage >= 80 ? 'bg-green-500' : 
                  usagePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600 w-20 text-right">{subscription.activeUsers} ({usagePercentage.toFixed(0)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EndCustomerAllSubscriptionsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  subscriptions: EndCustomerSubscriptionData[];
}> = ({ open, onClose, subscriptions }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  if (!open) return null;

  const groupedSubscriptions = subscriptions.reduce((acc, sub) => {
    if (!acc[sub.productName]) {
      acc[sub.productName] = [];
    }
    acc[sub.productName].push(sub);
    return acc;
  }, {} as Record<string, EndCustomerSubscriptionData[]>);

  const getTermTypeColor = (termType: string) => {
    if (termType.includes('Triannual')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (termType.includes('Annual') && termType.includes('Up Front')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (termType.includes('Annual') && termType.includes('Monthly')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (termType.includes('Monthly')) return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getChurnRisk = (sub: EndCustomerSubscriptionData) => {
    const assignmentRate = (sub.assignedSeats / sub.seats) * 100;
    const usageRate = sub.assignedSeats > 0 ? (sub.activeUsers / sub.assignedSeats) * 100 : 0;
    
    if (assignmentRate < 50 || usageRate < 40) return 'high';
    if (assignmentRate < 70 || usageRate < 60) return 'medium';
    return 'low';
  };

  const getChurnRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">⚠ Underutilized</span>;
      case 'medium':
        return <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-200">⚡ Monitor</span>;
      default:
        return null;
    }
  };

  const toggleGroup = (productName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productName)) {
        newSet.delete(productName);
      } else {
        newSet.add(productName);
      }
      return newSet;
    });
  };

  const getGroupTotals = (subs: EndCustomerSubscriptionData[]) => ({
    totalSeats: subs.reduce((sum, s) => sum + s.seats, 0),
    totalAssigned: subs.reduce((sum, s) => sum + s.assignedSeats, 0),
    totalActive: subs.reduce((sum, s) => sum + s.activeUsers, 0),
    totalCost: subs.reduce((sum, s) => sum + s.cost, 0),
    subscriptionCount: subs.length,
    hasChurnRisk: subs.some(s => getChurnRisk(s) !== 'low')
  });

  // Calculate overall totals for cost summary
  const overallTotals = {
    totalSeats: subscriptions.reduce((sum, s) => sum + s.seats, 0),
    totalAssigned: subscriptions.reduce((sum, s) => sum + s.assignedSeats, 0),
    totalActive: subscriptions.reduce((sum, s) => sum + s.activeUsers, 0),
    totalMonthlyCost: subscriptions.reduce((sum, s) => sum + s.cost, 0),
    subscriptionCount: subscriptions.length,
    productCount: Object.keys(groupedSubscriptions).length
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">My Microsoft Subscription Summary</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-3 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Cost Summary Card */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Cost Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-700">${overallTotals.totalMonthlyCost.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Monthly Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{overallTotals.totalSeats}</div>
                <div className="text-xs text-gray-600">Total Seats</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{overallTotals.subscriptionCount}</div>
                <div className="text-xs text-gray-600">Subscriptions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{((overallTotals.totalAssigned / overallTotals.totalSeats) * 100).toFixed(0)}%</div>
                <div className="text-xs text-gray-600">Seats Assigned</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-teal-200 flex items-center justify-between text-xs">
              <span className="text-gray-600">{overallTotals.productCount} product type{overallTotals.productCount > 1 ? 's' : ''} across {overallTotals.subscriptionCount} subscription{overallTotals.subscriptionCount > 1 ? 's' : ''}</span>
              <span className="text-teal-700 font-medium">${(overallTotals.totalMonthlyCost * 12).toLocaleString()}/year estimated</span>
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(groupedSubscriptions).map(([productName, subs]) => {
              const isExpanded = expandedGroups.has(productName);
              const totals = getGroupTotals(subs);
              const assignmentRate = ((totals.totalAssigned / totals.totalSeats) * 100).toFixed(0);
              
              return (
                <div key={productName} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleGroup(productName)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-800">{productName}</span>
                      <span className="text-xs text-gray-500">({subs.length} subscription{subs.length > 1 ? 's' : ''})</span>
                      {totals.hasChurnRisk && (
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-red-50 text-red-600">⚠ Attention needed</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{totals.totalSeats} seats • {assignmentRate}% assigned</div>
                        <div className="text-sm font-semibold text-gray-800">${totals.totalCost.toLocaleString()}/mo cost</div>
                      </div>
                      <svg className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="border-t border-gray-200">
                      {subs.map((sub) => {
                        const assignmentPerc = ((sub.assignedSeats / sub.seats) * 100).toFixed(0);
                        const activePerc = sub.assignedSeats > 0 ? ((sub.activeUsers / sub.assignedSeats) * 100).toFixed(0) : '0';
                        const churnRisk = getChurnRisk(sub);
                        
                        return (
                          <div key={sub.id} className="flex items-center justify-between px-3 py-2 bg-white hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center space-x-3">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded border ${getTermTypeColor(sub.termType)}`}>
                                {sub.termType}
                              </span>
                              {getChurnRiskBadge(churnRisk)}
                              <div>
                                <span className="text-xs text-gray-600">{sub.displayName !== sub.sku ? sub.displayName : sub.id.slice(0, 8)}...</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-6 text-xs">
                              <div className="text-center">
                                <div className="text-gray-500">Seats</div>
                                <div className="font-medium text-gray-800">{sub.seats}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500">Assigned</div>
                                <div className="font-medium text-gray-800">{sub.assignedSeats} ({assignmentPerc}%)</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500">Active</div>
                                <div className="font-medium text-gray-800">{sub.activeUsers} ({activePerc}%)</div>
                              </div>
                              <div className="text-center min-w-[80px]">
                                <div className="text-gray-500">Cost</div>
                                <div className="font-semibold text-gray-800">${sub.cost.toLocaleString()}/mo</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-teal-600 text-white text-sm rounded hover:bg-teal-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// End Customer Insights Component
const EndCustomerInsights: React.FC = () => {
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(true);
  const [officeUsageOpen, setOfficeUsageOpen] = useState(false);
  const [showAllSubscriptionsModal, setShowAllSubscriptionsModal] = useState(false);

  const [subscriptions, setSubscriptions] = useState<EndCustomerSubscriptionData[]>([
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      productName: 'Microsoft 365 Business Premium',
      displayName: 'O365_BUSINESS_PREMIUM',
      sku: 'O365_BUSINESS_PREMIUM',
      seats: 50,
      assignedSeats: 45,
      activeUsers: 38,
      cost: 1100,
      status: 'active' as const,
      renewalDate: '2025-12-31',
      termType: 'Annual Up Front'
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
      productName: 'Microsoft 365 Business Premium',
      displayName: 'M365 BP - Marketing Team',
      sku: 'O365_BUSINESS_PREMIUM',
      seats: 25,
      assignedSeats: 22,
      activeUsers: 18,
      cost: 550,
      status: 'active' as const,
      renewalDate: '2025-12-31',
      termType: 'Annual Billed Monthly'
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
      productName: 'Microsoft 365 E3',
      displayName: 'SPE_E3',
      sku: 'SPE_E3',
      seats: 30,
      assignedSeats: 28,
      activeUsers: 24,
      cost: 1080,
      status: 'active' as const,
      renewalDate: '2026-01-15',
      termType: 'Triannual Up Front'
    },
    {
      id: 'd4e5f6a7-b8c9-0123-defa-456789012345',
      productName: 'Microsoft 365 E3',
      displayName: 'M365 E3 - Exec Team',
      sku: 'SPE_E3',
      seats: 15,
      assignedSeats: 14,
      activeUsers: 12,
      cost: 540,
      status: 'active' as const,
      renewalDate: '2026-01-15',
      termType: 'Annual Billed Monthly'
    }
  ]);

  const handleRenameSubscription = (id: string, newName: string) => {
    setSubscriptions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, displayName: newName } : sub)
    );
  };

  const overview = {
    totalSeats: subscriptions.reduce((sum, s) => sum + s.seats, 0),
    assignedSeats: subscriptions.reduce((sum, s) => sum + s.assignedSeats, 0),
    activeUsers: subscriptions.reduce((sum, s) => sum + s.activeUsers, 0),
    monthlyCost: subscriptions.reduce((sum, s) => sum + s.cost, 0),
    subscriptionCount: subscriptions.length,
    trends: {
      seats: 2.1,
      activeUsers: 5.4,
      cost: 3.2
    }
  };

  const officeUsage = [
    {
      product: 'Microsoft 365 Apps',
      totalUsers: 120,
      activeUsers: 92,
      usagePercentage: 76.7,
      services: [
        { name: 'Exchange', activeUsers: 108, percentage: 90.0 },
        { name: 'SharePoint', activeUsers: 67, percentage: 55.8 },
        { name: 'OneDrive', activeUsers: 89, percentage: 74.2 },
        { name: 'Teams', activeUsers: 105, percentage: 87.5 },
        { name: 'Office Apps', activeUsers: 78, percentage: 65.0 }
      ]
    }
  ];

  // Expandable Section for End Customer Insights
  const InsightsExpandableSection = ({ 
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
    <InsightsExpandableSection 
      title="My Microsoft Insights" 
      open={overviewOpen}
      onToggle={setOverviewOpen}
      className="mb-1"
    >
      {/* Overview Metrics */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Overview</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <EndCustomerMetricCard
            title="Total Seats"
            value={overview.totalSeats}
            trend={overview.trends.seats}
            icon={<Users className="w-4 h-4 text-blue-600" />}
            status="good"
          />
          <EndCustomerMetricCard
            title="Assigned Seats"
            value={overview.assignedSeats}
            subtitle={`${((overview.assignedSeats / overview.totalSeats) * 100).toFixed(0)}% deployed`}
            icon={<Package className="w-4 h-4 text-blue-600" />}
            status="good"
          />
          <EndCustomerMetricCard
            title="Active Users (28d)"
            value={overview.activeUsers}
            trend={overview.trends.activeUsers}
            icon={<Activity className="w-4 h-4 text-blue-600" />}
            status="good"
          />
          <EndCustomerMetricCard
            title="Monthly Cost"
            value={`$${overview.monthlyCost.toLocaleString()}`}
            trend={overview.trends.cost}
            icon={<DollarSign className="w-4 h-4 text-blue-600" />}
            status="neutral"
          />
        </div>
      </div>

      {/* Subscriptions Detail */}
      <InsightsExpandableSection 
        title={
          <div className="flex items-center justify-between w-full">
            <span>My Subscriptions ({subscriptions.length})</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllSubscriptionsModal(true);
              }}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Summarise all my Microsoft subscriptions
            </button>
          </div>
        }
        open={subscriptionsOpen}
        onToggle={setSubscriptionsOpen}
        className="mb-3"
      >
        <div className="space-y-2">
          {subscriptions.map((sub) => (
            <EndCustomerSubscriptionRow 
              key={sub.id} 
              subscription={sub}
              onRename={handleRenameSubscription}
            />
          ))}
        </div>

        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-xs font-medium text-blue-800 mb-1">💡 Cost Optimization Tips</div>
          <ul className="text-xs text-blue-700 space-y-0.5">
            <li className="flex items-start">
              <span className="mr-1">•</span>
              <span>You have <strong>{overview.totalSeats - overview.assignedSeats} unassigned seats</strong> that could be removed to reduce costs.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-1">•</span>
              <span><strong>{((overview.activeUsers / overview.assignedSeats) * 100).toFixed(1)}% of assigned users</strong> are actively using their licenses.</span>
            </li>
          </ul>
        </div>
      </InsightsExpandableSection>

      {/* Office Usage */}
      <InsightsExpandableSection 
        title="Office 365 Usage Analytics"
        open={officeUsageOpen}
        onToggle={setOfficeUsageOpen}
        className="mb-3"
      >
        <div className="space-y-4">
          {officeUsage.map((usage, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">{usage.product}</h4>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{usage.activeUsers}/{usage.totalUsers}</div>
                  <div className="text-xs text-gray-500">{usage.usagePercentage.toFixed(1)}% active</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    usage.usagePercentage >= 80 ? 'bg-green-600' : 
                    usage.usagePercentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${usage.usagePercentage}%` }}
                ></div>
              </div>

              <div className="space-y-2">
                {usage.services.map((service) => (
                  <div key={service.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{service.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">{service.activeUsers} users</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        service.percentage >= 80 ? 'bg-green-100 text-green-700' : 
                        service.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {service.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm font-medium text-yellow-800 mb-2">💡 Usage Recommendations</div>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>SharePoint usage is at 55.8%</strong> - Consider training sessions to improve document collaboration.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Teams has strong adoption (87.5%)</strong> - Your team is getting value from Microsoft 365!</span>
            </li>
          </ul>
        </div>
      </InsightsExpandableSection>

      {/* Data Source Information */}
      <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-gray-600">
            Data from your Microsoft 365 Admin Center. Updated daily.
          </div>
        </div>
      </div>

      {/* All Subscriptions Modal */}
      <EndCustomerAllSubscriptionsModal
        open={showAllSubscriptionsModal}
        onClose={() => setShowAllSubscriptionsModal(false)}
        subscriptions={subscriptions}
      />
    </InsightsExpandableSection>
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

      {/* My Microsoft Insights - End Customer version with "Cost" instead of "Revenue" */}
      <EndCustomerInsights />
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

