import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
      active
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);

// Product Type Badge Component
const ProductBadge = ({ type }: { type: string }) => {
  const styles: Record<string, string> = {
    'PHYSICAL PRODUCT': 'bg-gray-100 text-gray-600',
    'STACKABLE': 'bg-gray-100 text-gray-600',
    'WEB APP': 'bg-gray-100 text-gray-600',
  };

  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-medium rounded ${
        styles[type] || 'bg-gray-100 text-gray-600'
      }`}
    >
      {type}
    </span>
  );
};

// Product Row Component
const ProductRow = ({
  name,
  productId,
  types,
  image,
}: {
  name: string;
  productId: string;
  types: string[];
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
          <a href="#" className="text-sm text-blue-600 hover:underline font-medium">
            {name}
          </a>
          <div className="text-xs text-gray-500">Product ID: {productId}</div>
        </div>
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center space-x-2">
        {types.map((type, index) => (
          <ProductBadge key={index} type={type} />
        ))}
      </div>
    </td>
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
    productId: '646355',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
    image: '/rack-shelf.png',
  },
  {
    name: '7FT PINK SLIM CAT6 ETHERNET CABLE, SNAGLESS, 100W POE, UTP, LSZH, 28AWG BARE COP',
    productId: '646262',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
    image: '/ethernet-cable.png',
  },
  {
    name: '1.5M C14/C15 PWR CBL 250V',
    productId: '646260',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
  },
  {
    name: 'Dimension for teams - Multiple Platforms - Multi NorthAmerican Language',
    productId: '646250',
    types: ['WEB APP'],
  },
  {
    name: 'Single Monitor Desk Mount',
    productId: '646247',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
  },
  {
    name: 'IT SERIES PURE SINE WAVE POWER INVERTER WITH 12VDC INPUT & 3000W AC OUTPUT',
    productId: '646195',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
  },
  {
    name: 'FANVIL X7C ENTERPRISE VOIP PHONE, 5-INCH COLOR TOUCH SCREEN, 20 SIP LINES, DUAL-',
    productId: '646193',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
  },
  {
    name: 'Premiere Pro for teams - Multiple Platforms - Multi NorthAmerican Language',
    productId: '646191',
    types: ['WEB APP'],
  },
  {
    name: 'TS SERIES PURE SINE WAVE POWER INVERTER WITH 12VDC INPUT & 2000W AC OUTPUT',
    productId: '646007',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
  },
  {
    name: '16GB 1RX8 PC5-5600 ECC UDIMM-A',
    productId: '646005',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
  },
];

export const ProductCatalog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalProducts = 2250;
  const productsPerPage = 10;

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white min-h-[calc(100vh-56px)] border-r border-gray-200">
          <div className="py-4">
            <SidebarSection title="Catalog">
              <SidebarItem label="Production Catalog" active />
              <SidebarItem label="Staging Catalog" />
              <SidebarItem label="Product Uploader" />
            </SidebarSection>

            <SidebarSection title="Import Products">
              <SidebarItem label="Find & Import Distributor Products" />
            </SidebarSection>

            <SidebarSection title="Price Management">
              <SidebarItem label="Price Books" />
              <SidebarItem label="Discounts" />
            </SidebarSection>

            <SidebarSection title="Promotions">
              <SidebarItem label="Promotional Products" />
              <SidebarItem label="Merchandising Options" />
            </SidebarSection>

            <SidebarSection title="Groups">
              <SidebarItem label="Product Groups" />
              <SidebarItem label="Segments" />
            </SidebarSection>

            <SidebarSection title="Product Content">
              <SidebarItem label="Media Sources" />
              <SidebarItem label="Featured Customers" />
            </SidebarSection>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-normal text-gray-900">Production Catalog</h1>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Add Staging Product
            </button>
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
                  className="w-72 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <ProductRow
                    key={index}
                    name={product.name}
                    productId={product.productId}
                    types={product.types}
                    image={product.image}
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
      <button className="fixed bottom-6 right-6 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700">
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

