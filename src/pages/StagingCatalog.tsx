import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';

// Helper to get distributor config from localStorage
const getConfiguredDistributors = (): string[] => {
  const config = localStorage.getItem('configuredDistributors');
  if (!config) {
    // Default: all enabled
    return ['firstbase', 'tdsynnex', 'ingrammicro'];
  }
  const parsed = JSON.parse(config);
  const configured: string[] = [];
  // Check each distributor
  if (parsed.firstbase !== false) configured.push('firstbase');
  if (parsed.tdsynnex !== false) configured.push('tdsynnex');
  if (parsed.ingrammicro !== false) configured.push('ingrammicro');
  return configured;
};

type Distributor = {
  id: string;
  name: string;
  color: string;
};

const DISTRIBUTORS: Distributor[] = [
  { id: 'firstbase', name: 'Firstbase', color: 'bg-cyan-500' },
  { id: 'tdsynnex', name: 'TD SYNNEX', color: 'bg-teal-600' },
  { id: 'ingrammicro', name: 'Ingram Micro', color: 'bg-gray-500' },
];

// Add Disti Product Button Component
const AddDistiProductButton = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [configuredIds, setConfiguredIds] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check configured distributors on mount and when dropdown is shown
  useEffect(() => {
    setConfiguredIds(getConfiguredDistributors());
  }, [showDropdown]);

  const configuredDistis = DISTRIBUTORS.filter(d => configuredIds.includes(d.id));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = () => {
    if (configuredDistis.length === 0) {
      setShowTooltip(true);
      setTimeout(() => {
        navigate('/settings/vendor-integrations');
      }, 2000);
    } else if (configuredDistis.length === 1) {
      navigate(`/products/find?distributor=${configuredDistis[0].id}`);
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const handleSelectDisti = (distiId: string) => {
    setShowDropdown(false);
    navigate(`/products/find?distributor=${distiId}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleClick}
        onMouseEnter={() => configuredDistis.length === 0 && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center"
      >
        Add Disti Product
        {configuredDistis.length > 1 && <ChevronDown className="h-4 w-4 ml-1" />}
      </button>

      {/* Tooltip for no configured distributors */}
      {showTooltip && configuredDistis.length === 0 && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-sm rounded-lg shadow-lg p-3 z-50">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">No Distributor Configured</p>
              <p className="text-gray-300 mt-1">
                You need a Disti connection.{' '}
                <span className="text-teal-400 cursor-pointer hover:underline">
                  Click here to configure one
                </span>
              </p>
            </div>
          </div>
          <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-900"></div>
        </div>
      )}

      {/* Dropdown for multiple configured distributors */}
      {showDropdown && configuredDistis.length > 1 && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {configuredDistis.map((disti) => (
              <button
                key={disti.id}
                onClick={() => handleSelectDisti(disti.id)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <span className={`h-2 w-2 rounded-full ${disti.color}`}></span>
                <span>{disti.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
  adobeDimension: (
    <div className="h-10 w-10 bg-purple-600 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">Dn</span>
    </div>
  ),
  indesign: (
    <div className="h-10 w-10 bg-pink-600 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">Id</span>
    </div>
  ),
};

// Product Row Component
const ProductRow = ({
  name,
  vendor,
  productId,
  isStaging,
  published,
  profile,
  imageComponent,
}: {
  name: string;
  vendor: string;
  productId: string;
  isStaging?: boolean;
  published: boolean;
  profile: string;
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
    imageComponent: ProductImages.rack,
  },
  {
    name: '7FT PINK SLIM CAT6 ETHERNET CABLE, SNAGLESS, 100W POE, UTP, LSZH, 28AWG BARE COP',
    vendor: 'DISTI',
    productId: '646262',
    published: true,
    profile: '22%',
    imageComponent: ProductImages.cable,
  },
  {
    name: '1.5M C14/C15 PWR CBL 250V',
    vendor: 'DISTI',
    productId: '646260',
    published: true,
    profile: '18%',
    imageComponent: ProductImages.power,
  },
  {
    name: 'Dimension for teams - Multiple Platforms - Multi NorthAmerican Language',
    vendor: 'DISTI',
    productId: '646250',
    published: true,
    profile: '18%',
    imageComponent: ProductImages.dimension,
  },
  {
    name: 'Adobe Dimension for enterprise - Multiple Platforms - Multi NorthAmerican Language',
    vendor: 'DISTI',
    productId: '646248',
    isStaging: true,
    published: false,
    profile: '18%',
    imageComponent: ProductImages.adobeDimension,
  },
  {
    name: 'Single Monitor Desk Mount',
    vendor: 'DISTI',
    productId: '646247',
    published: true,
    profile: '22%',
    imageComponent: ProductImages.monitor,
  },
  {
    name: 'IT SERIES PURE SINE WAVE POWER INVERTER WITH 12VDC INPUT & 3000W AC OUTPUT',
    vendor: 'DISTI',
    productId: '646195',
    published: true,
    profile: '18%',
    imageComponent: ProductImages.inverter,
  },
  {
    name: 'FANVIL X7C ENTERPRISE VOIP PHONE, 5-INCH COLOR TOUCH SCREEN, 20 SIP LINES, DUAL-',
    vendor: 'DISTI',
    productId: '646193',
    published: true,
    profile: '18%',
    imageComponent: ProductImages.phone,
  },
  {
    name: 'Premiere Pro for teams - Multiple Platforms - Multi NorthAmerican Language',
    vendor: 'DISTI',
    productId: '646191',
    published: true,
    profile: '18%',
    imageComponent: ProductImages.adobe,
  },
  {
    name: 'InDesign Server for enterprise - Multiple Platforms (PREMIUM ONLINE) - Multi NorthAmerican Language',
    vendor: 'DISTI',
    productId: '646189',
    isStaging: true,
    published: false,
    profile: '18%',
    imageComponent: ProductImages.indesign,
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
              <AddDistiProductButton />
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
      <button className="fixed bottom-6 right-6 h-10 w-10 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-teal-700">
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

