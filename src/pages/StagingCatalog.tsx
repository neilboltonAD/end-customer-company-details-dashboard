import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';

// Sidebar Section Component
const SidebarSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-1">
    <div className="bg-gray-100 border-y border-gray-200 px-4 py-2">
      <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
        {title}
      </h3>
    </div>
    <div className="py-1">{children}</div>
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
      active
        ? 'bg-teal-700 text-white font-medium'
        : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

// Status Badge Component
const StatusBadge = ({ published }: { published: boolean }) => (
  <div className="flex items-center space-x-2">
    <span
      className={`h-2.5 w-2.5 rounded-full ${
        published ? 'bg-green-500' : 'bg-gray-400'
      }`}
    ></span>
    <span className={`text-sm ${published ? 'text-gray-700' : 'text-gray-500'}`}>
      {published ? 'Published' : 'Not Published'}
    </span>
  </div>
);

// Product Row Component
const ProductRow = ({
  name,
  vendor,
  productId,
  isStaging,
  published,
  profile,
  image,
}: {
  name: string;
  vendor: string;
  productId: string;
  isStaging?: boolean;
  published: boolean;
  profile: string;
  image?: string;
}) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50">
    <td className="py-3 px-4">
      <div className="flex items-center space-x-3">
        <button className="text-gray-300 hover:text-yellow-400">
          <Star className="h-5 w-5" />
        </button>
        {image ? (
          <img src={image} alt={name} className="h-10 w-10 object-contain" />
        ) : (
          <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
            <Star className="h-5 w-5 text-gray-300" />
          </div>
        )}
        <div>
          <a href="#" className="text-sm text-teal-700 hover:underline font-medium">
            {name}
          </a>
          <div className="text-xs text-gray-500">{vendor}</div>
          <div className="text-xs text-gray-500">
            {isStaging ? 'Staging ID' : 'Product ID'}: {productId}
          </div>
        </div>
      </div>
    </td>
    <td className="py-3 px-4">
      <StatusBadge published={published} />
    </td>
    <td className="py-3 px-4 text-sm text-gray-600">{profile}</td>
    <td className="py-3 px-4 text-right">
      <button className="text-gray-400 hover:text-gray-600">
        <Settings className="h-4 w-4 inline" />
        <ChevronDown className="h-4 w-4 inline" />
      </button>
    </td>
  </tr>
);

// Sample product data
const products = [
  {
    name: '2U 19IN 2 POST NETWORK RACK SHELF',
    vendor: 'DISTI',
    productId: '646355',
    published: true,
    profile: '22%',
  },
  {
    name: '7FT PINK SLIM CAT6 ETHERNET CABLE, SNAGLESS, 100W POE, UTP, LSZH, 28AWG BARE COP',
    vendor: 'DISTI',
    productId: '646262',
    published: true,
    profile: '22%',
  },
  {
    name: '1.5M C14/C15 PWR CBL 250V',
    vendor: 'DISTI',
    productId: '646260',
    published: true,
    profile: '18%',
  },
  {
    name: 'Dimension for teams - Multiple Platforms - Multi NorthAmerican Language',
    vendor: 'DISTI',
    productId: '646250',
    published: true,
    profile: '18%',
  },
  {
    name: 'Adobe Dimension for enterprise - Multiple Platforms - Multi NorthAmerican Language',
    vendor: 'DISTI',
    productId: '646248',
    isStaging: true,
    published: false,
    profile: '18%',
  },
  {
    name: 'Single Monitor Desk Mount',
    vendor: 'DISTI',
    productId: '646247',
    published: true,
    profile: '22%',
  },
  {
    name: 'IT SERIES PURE SINE WAVE POWER INVERTER WITH 12VDC INPUT & 3000W AC OUTPUT',
    vendor: 'DISTI',
    productId: '646195',
    published: true,
    profile: '18%',
  },
  {
    name: 'FANVIL X7C ENTERPRISE VOIP PHONE, 5-INCH COLOR TOUCH SCREEN, 20 SIP LINES, DUAL-',
    vendor: 'DISTI',
    productId: '646193',
    published: true,
    profile: '18%',
  },
  {
    name: 'Premiere Pro for teams - Multiple Platforms - Multi NorthAmerican Language',
    vendor: 'DISTI',
    productId: '646191',
    published: true,
    profile: '18%',
  },
  {
    name: 'InDesign Server for enterprise - Multiple Platforms (PREMIUM ONLINE) - Multi NorthAmerican Language',
    vendor: 'DISTI',
    productId: '646189',
    isStaging: true,
    published: false,
    profile: '18%',
  },
];

export const StagingCatalog = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const totalProducts = 4278;
  const productsPerPage = 10;

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white min-h-[calc(100vh-56px)] border-r border-gray-200">
          <SidebarSection title="CATALOG">
            <SidebarItem 
              label="Production Catalog" 
              onClick={() => navigate('/products')}
            />
            <SidebarItem label="Staging Catalog" active />
            <SidebarItem label="Product Uploader" />
          </SidebarSection>

          <SidebarSection title="IMPORT PRODUCTS">
            <SidebarItem label="Find & Import Distributor Products" />
          </SidebarSection>

          <SidebarSection title="PRICE MANAGEMENT">
            <SidebarItem label="Price Books" />
            <SidebarItem label="Discounts" />
          </SidebarSection>

          <SidebarSection title="PROMOTIONS">
            <SidebarItem label="Promotional Products" />
            <SidebarItem label="Merchandising Options" />
          </SidebarSection>

          <SidebarSection title="GROUPS">
            <SidebarItem label="Product Groups" />
            <SidebarItem label="Segments" />
          </SidebarSection>

          <SidebarSection title="PRODUCT CONTENT">
            <SidebarItem label="Media Sources" />
            <SidebarItem label="Featured Customers" />
          </SidebarSection>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-normal text-gray-900">Staging Catalog</h1>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Create Product
              </button>
              <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Add Network Product
              </button>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-lg shadow">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Show Filters
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search product names and IDs"
                  className="w-72 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <ProductRow
                    key={index}
                    name={product.name}
                    vendor={product.vendor}
                    productId={product.productId}
                    isStaging={product.isStaging}
                    published={product.published}
                    profile={product.profile}
                  />
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-end space-x-4">
              <span className="text-sm text-gray-600">
                1-{productsPerPage} of {totalProducts.toLocaleString()}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
                  className="w-8 text-center py-1 text-sm border border-gray-300 rounded"
                />
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
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

