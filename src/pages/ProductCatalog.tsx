import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  imageComponent,
}: {
  name: string;
  productId: string;
  types: string[];
  imageComponent?: React.ReactNode;
}) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50">
    <td className="py-3 px-4">
      <div className="flex items-center space-x-3">
        <button className="text-gray-300 hover:text-yellow-400">
          <Star className="h-5 w-5" />
        </button>
        {imageComponent || (
          <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
            <Star className="h-5 w-5 text-gray-300" />
          </div>
        )}
        <div>
          <a href="#" className="text-sm text-teal-700 hover:underline font-medium">
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

// Product placeholder images (inline SVG icons)
const ProductImages = {
  rack: (
    <div className="h-10 w-10 bg-gray-700 rounded flex items-center justify-center">
      <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 6h14M5 15h14" />
      </svg>
    </div>
  ),
  cable: (
    <div className="h-10 w-10 bg-pink-100 rounded flex items-center justify-center">
      <svg className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  ),
  power: (
    <div className="h-10 w-10 bg-yellow-100 rounded flex items-center justify-center">
      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  ),
  software: (
    <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center">
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
  ),
  monitor: (
    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
      <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
  ),
  inverter: (
    <div className="h-10 w-10 bg-green-100 rounded flex items-center justify-center">
      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  ),
  phone: (
    <div className="h-10 w-10 bg-purple-100 rounded flex items-center justify-center">
      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    </div>
  ),
  memory: (
    <div className="h-10 w-10 bg-indigo-100 rounded flex items-center justify-center">
      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    </div>
  ),
  adobe: (
    <div className="h-10 w-10 bg-red-600 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">Pr</span>
    </div>
  ),
  dimension: (
    <div className="h-10 w-10 bg-teal-600 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">Dn</span>
    </div>
  ),
};

// Sample product data
const products = [
  {
    name: '2U 19IN 2 POST NETWORK RACK SHELF',
    productId: '646355',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
    imageComponent: ProductImages.rack,
  },
  {
    name: '7FT PINK SLIM CAT6 ETHERNET CABLE, SNAGLESS, 100W POE, UTP, LSZH, 28AWG BARE COP',
    productId: '646262',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
    imageComponent: ProductImages.cable,
  },
  {
    name: '1.5M C14/C15 PWR CBL 250V',
    productId: '646260',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
    imageComponent: ProductImages.power,
  },
  {
    name: 'Dimension for teams - Multiple Platforms - Multi NorthAmerican Language',
    productId: '646250',
    types: ['WEB APP'],
    imageComponent: ProductImages.dimension,
  },
  {
    name: 'Single Monitor Desk Mount',
    productId: '646247',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
    imageComponent: ProductImages.monitor,
  },
  {
    name: 'IT SERIES PURE SINE WAVE POWER INVERTER WITH 12VDC INPUT & 3000W AC OUTPUT',
    productId: '646195',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
    imageComponent: ProductImages.inverter,
  },
  {
    name: 'FANVIL X7C ENTERPRISE VOIP PHONE, 5-INCH COLOR TOUCH SCREEN, 20 SIP LINES, DUAL-',
    productId: '646193',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
    imageComponent: ProductImages.phone,
  },
  {
    name: 'Premiere Pro for teams - Multiple Platforms - Multi NorthAmerican Language',
    productId: '646191',
    types: ['WEB APP'],
    imageComponent: ProductImages.adobe,
  },
  {
    name: 'TS SERIES PURE SINE WAVE POWER INVERTER WITH 12VDC INPUT & 2000W AC OUTPUT',
    productId: '646007',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
    imageComponent: ProductImages.inverter,
  },
  {
    name: '16GB 1RX8 PC5-5600 ECC UDIMM-A',
    productId: '646005',
    types: ['PHYSICAL PRODUCT', 'STACKABLE'],
    imageComponent: ProductImages.memory,
  },
];

export const ProductCatalog = () => {
  const navigate = useNavigate();
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
              <SidebarItem label="Staging Catalog" onClick={() => navigate('/products/staging')} />
              <SidebarItem label="Product Uploader" />
            </SidebarSection>

            <SidebarSection title="Import Products">
              <SidebarItem label="Find & Import Distributor Products" onClick={() => navigate('/products/find')} />
            </SidebarSection>

            <SidebarSection title="Price Management">
              <SidebarItem label="Disti Price Sync" onClick={() => navigate('/products/price-sync')} />
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
            <button 
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              onClick={() => navigate('/products/staging')}
            >
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
                    imageComponent={product.imageComponent}
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

