import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, HelpCircle, Search, Copy } from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { VendorInformation } from '../components/company/VendorInformation';

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

export const OperationsCompanyDetails = () => {
  const navigate = useNavigate();
  const { companyName } = useParams();
  const decodedCompanyName = decodeURIComponent(companyName || 'demoresellercustomer1');
  
  const [activeTab, setActiveTab] = useState('Users');
  const [moreTabsOpen, setMoreTabsOpen] = useState(false);
  const [visibleTabCount, setVisibleTabCount] = useState(9); // Show all by default
  const tabsContainerRef = useRef<HTMLDivElement>(null);

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
      <TopNavbar />

      <div className="flex">
        <OperationsSidebar activeItem="Companies" />

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
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 h-10 w-10 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-teal-700">
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

