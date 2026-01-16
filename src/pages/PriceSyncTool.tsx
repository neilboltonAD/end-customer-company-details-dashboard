import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { DistiPriceSyncPanel } from '../components/company/DistiPriceSyncPanel';

// Sidebar Section Component
const SidebarSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
      {title}
    </h3>
    <div className="space-y-0.5">{children}</div>
  </div>
);

// Sidebar Item Component
const SidebarItem = ({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
      active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);

export const PriceSyncTool = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white min-h-[calc(100vh-56px)] border-r border-gray-200">
          <div className="py-4">
            <SidebarSection title="Catalog">
              <SidebarItem label="Production Catalog" onClick={() => navigate('/products')} />
              <SidebarItem label="Staging Catalog" onClick={() => navigate('/products/staging')} />
              <SidebarItem label="Product Uploader" />
            </SidebarSection>

            <SidebarSection title="Import Products">
              <SidebarItem label="Find & Import Distributor Products" onClick={() => navigate('/products/find')} />
            </SidebarSection>

            <SidebarSection title="Price Management">
              <SidebarItem label="Price Books" />
              <SidebarItem label="Discounts" />
              <SidebarItem label="Disti Price Sync" active />
            </SidebarSection>

            <SidebarSection title="Promotions">
              <SidebarItem label="Promotional Products" />
              <SidebarItem label="Merchandising Options" />
            </SidebarSection>

            <SidebarSection title="Groups">
              <SidebarItem label="Product Groups" />
              <SidebarItem label="Segments" />
            </SidebarSection>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-normal text-gray-900">Disti Price Sync</h1>
              <p className="text-sm text-gray-500 mt-1">
                Review and sync distributor pricing across the marketplace
              </p>
            </div>
          </div>

          <DistiPriceSyncPanel />
        </main>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700">
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
};
