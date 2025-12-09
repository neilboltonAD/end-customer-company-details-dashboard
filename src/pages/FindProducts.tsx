import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ChevronDown,
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
  hasArrow = false,
  expanded = false,
  indent = 0,
  onClick,
}: {
  label: string;
  active?: boolean;
  hasArrow?: boolean;
  expanded?: boolean;
  indent?: number;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left py-2 text-sm transition-colors flex items-center justify-between ${
      active
        ? 'bg-teal-700 text-white font-medium'
        : 'text-gray-700 hover:bg-gray-50'
    }`}
    style={{ paddingLeft: `${16 + indent * 12}px`, paddingRight: '16px' }}
  >
    <span className="flex items-center">
      {hasArrow && (
        <span className="mr-1 text-xs">{expanded ? '▼' : '▶'}</span>
      )}
      {label}
    </span>
    {!active && !hasArrow && indent === 0 && (
      <ChevronRight className="h-4 w-4 text-gray-400" />
    )}
  </button>
);

// Category Item Component
const CategoryItem = ({
  label,
  hasChildren = false,
  expanded = false,
  onClick,
}: {
  label: string;
  hasChildren?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left pl-8 pr-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-between"
  >
    <span>{label}</span>
    {hasChildren && (
      <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
    )}
  </button>
);

// Subcategory Item Component
const SubcategoryItem = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left pl-12 pr-4 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
  >
    {label}
  </button>
);

// Product categories data
const productCategories = [
  { id: 'accessories', label: 'Accessories / Cables', hasChildren: true },
  { id: 'appliances', label: 'Appliances', hasChildren: true },
  { id: 'audio-video', label: 'Audio / Video / Output Devices', hasChildren: true },
  { id: 'computer-components', label: 'Computer Components', hasChildren: true },
  { id: 'computers', label: 'Computers / Portables', hasChildren: true },
  { id: 'digital-cameras', label: 'Digital Cameras / Keyboards / Input Device', hasChildren: true },
  { id: 'digital-signage', label: 'Digital Signage', hasChildren: true },
  { id: 'drones', label: 'Drones', hasChildren: true },
  { id: 'gaming', label: 'Gaming', hasChildren: true },
  { id: 'home-audio', label: 'Home Audio', hasChildren: true },
  { id: 'monitor-display', label: 'Monitor / Display / Projector', hasChildren: true },
  { id: 'network-hardware', label: 'Network Hardware', hasChildren: true },
  { id: 'office-machines', label: 'Office Machines & Supplies', hasChildren: true },
  { id: 'photo', label: 'Photo', hasChildren: true },
  { id: 'portable-electronics', label: 'Portable Electronics', hasChildren: true },
  { id: 'power-equipment', label: 'Power Equipment', hasChildren: true },
  { id: 'printers', label: 'Printers', hasChildren: true },
  { id: 'projectors', label: 'Projectors', hasChildren: true },
  { id: 'security', label: 'Security', hasChildren: true },
  { id: 'sony', label: 'Sony', hasChildren: true },
  { id: 'storage-devices', label: 'Storage Devices', hasChildren: true },
  { id: 'tv-video', label: 'TV & Video', hasChildren: true },
  { id: 'ucc-mobility', label: 'UCC/Mobility/Telecom', hasChildren: true, 
    subcategories: [
      '2-Way Radios',
      'Cell Phone Accessory',
      'Cellular Phones',
      'Corded Phones',
      'Cordless Phones',
      'Hardware Others',
      'Hardware UCC/Audio',
      'Hardware UCC/Video',
      'Phone Accessories',
    ]
  },
];

// Distributor Tab Component
const DistributorTab = ({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      active
        ? 'border-teal-600 text-gray-900'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    <span className="h-2.5 w-2.5 bg-green-500 rounded-full"></span>
    <span>{name}</span>
  </button>
);

// Profile Badge Component
const ProfileBadge = ({ type }: { type: 'Basic' | 'Enriched' | 'Partially Enriched' }) => {
  const colors = {
    Basic: 'text-gray-600',
    Enriched: 'text-green-600',
    'Partially Enriched': 'text-yellow-600',
  };

  return (
    <div className="flex items-center space-x-1">
      <span className={`h-4 w-4 rounded-full flex items-center justify-center text-xs ${
        type === 'Basic' ? 'bg-gray-200' : type === 'Enriched' ? 'bg-green-100' : 'bg-yellow-100'
      }`}>
        <span className={colors[type]}>i</span>
      </span>
      <span className={`text-sm ${colors[type]}`}>{type}</span>
    </div>
  );
};

// Product Images
const ProductImages = {
  laptop: (
    <div className="h-10 w-10 bg-blue-900 rounded flex items-center justify-center">
      <svg className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
  ),
  lenovo: (
    <div className="h-10 w-10 bg-red-600 rounded flex items-center justify-center">
      <span className="text-white text-[8px] font-bold">Lenovo</span>
    </div>
  ),
  cable: (
    <div className="h-10 w-10 bg-pink-100 rounded flex items-center justify-center">
      <svg className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  inverter: (
    <div className="h-10 w-10 bg-green-100 rounded flex items-center justify-center">
      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
  network: (
    <div className="h-10 w-10 bg-orange-100 rounded flex items-center justify-center">
      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    </div>
  ),
  adobe: (
    <div className="h-10 w-10 bg-red-600 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">A</span>
    </div>
  ),
};

// Firstbase Products
const firstbaseProducts = [
  { name: 'ThinkPad X1 Carbon 14-inch (Gen 13) Ultra 7 258V 32GB RAM 51...', vendor: 'Lenovo', profile: 'Enriched' as const, partNumber: '21NS0014US', msrp: '$2,105.00', image: ProductImages.laptop },
  { name: 'ThinkPad E14 14-inch (Gen 7) Ultra 7 255H 16GB RAM 512GB SS...', vendor: 'Lenovo', profile: 'Enriched' as const, partNumber: '21SX0039US', msrp: '$1,325.00', image: ProductImages.laptop },
  { name: 'ThinkPad E14 14-inch (Gen 6) Ryzen 7 7735U 16GB RAM 512GB ...', vendor: 'Lenovo', profile: 'Partially Enriched' as const, partNumber: '21M3000PUS', msrp: '$995.00', image: ProductImages.laptop },
  { name: 'ThinkPad T14 14-inch (Gen 6) Ultra 5 255U 16GB RAM 512GB SS...', vendor: 'Lenovo', profile: 'Partially Enriched' as const, partNumber: '21QC001YUS', msrp: '$1,660.00', image: ProductImages.lenovo },
  { name: 'ThinkPad E14 14-inch (Gen 7) Ultra 5 225U 16GB RAM 256GB SS...', vendor: 'Lenovo', profile: 'Enriched' as const, partNumber: '21SX003DUS', msrp: '$1,015.00', image: ProductImages.laptop },
  { name: 'ThinkPad E16 16-inch (Gen 2) Ryzen 5 7535U 16GB RAM 256GB ...', vendor: 'Lenovo', profile: 'Partially Enriched' as const, partNumber: '21M5000GUS', msrp: '$885.00', image: ProductImages.laptop },
  { name: 'ThinkPad E16 16-inch (Gen 2) Ryzen 7 7735U 16GB RAM 512GB...', vendor: 'Lenovo', profile: 'Partially Enriched' as const, partNumber: '21M5000KUS', msrp: '$1,050.00', image: ProductImages.laptop },
  { name: 'ThinkPad T14 14-inch (Gen 6) Ultra 7 255U 16GB RAM 512GB SS...', vendor: 'Lenovo', profile: 'Enriched' as const, partNumber: '21QC0021US', msrp: '$1,785.00', image: ProductImages.laptop },
  { name: 'ThinkPad T14 14-inch (Gen 6) Ultra 7 255U 32GB RAM 512GB SS...', vendor: 'Lenovo', profile: 'Enriched' as const, partNumber: '21QC006RUS', msrp: '$2,040.00', image: ProductImages.laptop },
  { name: 'ThinkPad T14 14-inch (Gen 5) Ryzen 7 Pro 8840U 32GB RAM 512...', vendor: 'Lenovo', profile: 'Enriched' as const, partNumber: '21MC004YUS', msrp: '$1,475.00', image: ProductImages.laptop },
];

// TD SYNNEX Products
const tdSynnexProducts = [
  { name: 'NEW HP ELITEBOOK 840 G11 NOTEBOOK INTEL CORE ULTRA ...', vendor: 'HP Inc.', profile: 'Basic' as const, id: '15154445', availability: '15 items', msrp: '$1,869.00', image: ProductImages.laptop },
  { name: 'FANVIL X7C ENTERPRISE VOIP PHONE, 5-INCH COLOR TOUCH...', vendor: 'Strategic Sourcing', profile: 'Basic' as const, id: '15076071', availability: '156 items', msrp: '$175.00', image: ProductImages.phone },
  { name: 'IT SERIES PURE SINE WAVE POWER INVERTER WITH 12VDC IN...', vendor: 'Havis, Inc.', profile: 'Basic' as const, id: '14986207', availability: '4 items', msrp: '$4,038.00', image: ProductImages.inverter },
  { name: '1.5M C14/C15 PWR CBL 250V', vendor: 'Add-on', profile: 'Basic' as const, id: '14962754', availability: '31 items', msrp: '$51.50', image: ProductImages.cable },
  { name: '7FT PINK SLIM CAT6 ETHERNET CABLE, SNAGLESS, 100W POE...', vendor: 'Startech.com', profile: 'Enriched' as const, id: '14576353', availability: '181 items', msrp: '$8.99', image: ProductImages.cable },
  { name: '50FT PURPLE CAT6A ETHERNET CABLE, SNAGLESS RJ45, 10G...', vendor: 'Startech.com', profile: 'Enriched' as const, id: '14413165', availability: '244 items', msrp: '$43.99', image: ProductImages.cable },
  { name: 'AXIOM 400GBASE-LR4 QSFP-DD FOR MELLANOX', vendor: 'Axiom', profile: 'Enriched' as const, id: '14159943', availability: '10 items', msrp: '$3,466.15', image: ProductImages.network },
  { name: '16GB 1RX8 DDR5-4800 UDIMM', vendor: 'Accortec Incorporated', profile: 'Basic' as const, id: '7497326', availability: '1 items', msrp: '$495.00', image: ProductImages.memory },
  { name: '16GB DDR4-2666 RDIMM 2RX8 1.2V', vendor: 'Strategic Sourcing', profile: 'Partially Enriched' as const, id: '7289213', availability: '8 items', msrp: '$274.00', image: ProductImages.memory },
  { name: 'CAT6 ETHERNET CABLE 6IN(15.2CM)', vendor: 'Rocstor', profile: 'Basic' as const, id: '6808645', availability: '308 items', msrp: '$5.95', image: ProductImages.cable },
];

// Ingram Micro Products
const ingramMicroProducts = [
  { name: 'Acrobat Pro 2024 for Enterprise - Multiple Platforms - Multi North...', vendor: 'Adobe', profile: 'Basic' as const, partNumber: '30006215CC', msrp: '$93.60', image: ProductImages.adobe },
  { name: 'Photoshop - Edition 3 for enterprise - Multiple Platforms (Fallback ...', vendor: 'Adobe', profile: 'Basic' as const, partNumber: '30005695CC', msrp: '$579.96', image: ProductImages.adobe },
  { name: 'Premiere Pro - Edition 3 for enterprise - Multiple Platforms (Fallbac...', vendor: 'Adobe', profile: 'Basic' as const, partNumber: '30005758CC', msrp: '$579.96', image: ProductImages.adobe },
  { name: 'Illustrator - Edition 3 for enterprise - Multiple Platforms (Fallback o...', vendor: 'Adobe', profile: 'Basic' as const, partNumber: '30005632CC', msrp: '$579.96', image: ProductImages.adobe },
  { name: 'InDesign - Edition 3 for enterprise - Multiple Platforms (Fallback of...', vendor: 'Adobe', profile: 'Basic' as const, partNumber: '30005576CC', msrp: '$579.96', image: ProductImages.adobe },
  { name: 'Dreamweaver - Edition 3 for enterprise - Multiple Platforms (Fallba...', vendor: 'Adobe', profile: 'Basic' as const, partNumber: '30005443CC', msrp: '$579.96', image: ProductImages.adobe },
  { name: 'All Apps - Edition 3 for enterprise - Multiple Platforms (Fallback off...', vendor: 'Adobe', profile: 'Basic' as const, partNumber: '30005233CC', msrp: '$1,325.88', image: ProductImages.adobe },
  { name: 'Acrobat Pro for teams - Multiple Platforms (10 Pack. Order quantit...', vendor: 'Adobe', profile: 'Basic' as const, partNumber: '65304520CA01512', msrp: '$259.08', image: ProductImages.adobe },
  { name: 'Acrobat Studio for enterprise - Multiple Platforms (50 Pack. Order ...', vendor: 'Adobe', profile: 'Basic' as const, partNumber: '30013551CA01212', msrp: '$298.08', image: ProductImages.adobe },
  { name: 'Acrobat Studio for teams - Multiple Platforms (25 Pack. Order qua...', vendor: 'Adobe', profile: 'Basic' as const, partNumber: '30013359CA01112', msrp: '$298.68', image: ProductImages.adobe },
];

type Distributor = 'firstbase' | 'tdsynnex' | 'ingrammicro';

export const FindProducts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('distributor') as Distributor || 'firstbase';
  const [activeTab, setActiveTab] = useState<Distributor>(initialTab);
  const [currentPage, setCurrentPage] = useState(1);
  const [findProductsExpanded, setFindProductsExpanded] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('ucc-mobility');

  const getProducts = () => {
    switch (activeTab) {
      case 'firstbase':
        return { products: firstbaseProducts, total: 227, columns: 'firstbase' };
      case 'tdsynnex':
        return { products: tdSynnexProducts, total: 69096, columns: 'tdsynnex' };
      case 'ingrammicro':
        return { products: ingramMicroProducts, total: 624, columns: 'ingrammicro' };
    }
  };

  const { products, total, columns } = getProducts();

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-[calc(100vh-56px)] border-r border-gray-200 overflow-y-auto">
          <SidebarSection title="IMPORT PRODUCTS">
            <SidebarItem 
              label="Find Products" 
              active 
              hasArrow
              expanded={findProductsExpanded}
              onClick={() => setFindProductsExpanded(!findProductsExpanded)}
            />
            
            {/* Expandable Categories */}
            {findProductsExpanded && (
              <div className="bg-gray-50 border-y border-gray-100">
                {productCategories.map((category) => (
                  <div key={category.id}>
                    <CategoryItem
                      label={category.label}
                      hasChildren={category.hasChildren}
                      expanded={expandedCategory === category.id}
                      onClick={() => setExpandedCategory(
                        expandedCategory === category.id ? null : category.id
                      )}
                    />
                    
                    {/* Subcategories */}
                    {expandedCategory === category.id && category.subcategories && (
                      <div className="bg-white border-t border-gray-100">
                        <div className="pl-8 pr-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                          Categories
                        </div>
                        {category.subcategories.map((sub) => (
                          <SubcategoryItem
                            key={sub}
                            label={sub}
                            onClick={() => {/* Filter by subcategory */}}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <SidebarItem label="Product Imports" />
            <SidebarItem label="Settings" />
          </SidebarSection>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Back Link */}
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-sm text-teal-700 hover:text-teal-800 mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Product Imports</span>
          </button>

          {/* Header */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Find Products</h1>
          <p className="text-sm text-gray-600 mb-6">
            Connect with distributor accounts, import and configure more product catalogs.
          </p>

          {/* Distributor Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 mb-6">
            <DistributorTab
              name="Firstbase"
              active={activeTab === 'firstbase'}
              onClick={() => setActiveTab('firstbase')}
            />
            <DistributorTab
              name="TD SYNNEX"
              active={activeTab === 'tdsynnex'}
              onClick={() => setActiveTab('tdsynnex')}
            />
            <DistributorTab
              name="Ingram Micro"
              active={activeTab === 'ingrammicro'}
              onClick={() => setActiveTab('ingrammicro')}
            />
          </div>

        {/* Info Banner (for TD SYNNEX and Ingram Micro) */}
        {(activeTab === 'tdsynnex' || activeTab === 'ingrammicro') && (
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-sm text-gray-700">
              Browse the Distributor catalog and select products to import to marketplace catalog with a 15% default markup. Click{' '}
              <a href="#" className="text-teal-700 font-medium hover:underline">here</a>{' '}
              to change the Markup percentage.
            </p>
          </div>
        )}

        {/* Product Table */}
        <div className="bg-white rounded-lg shadow">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Show Filters
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center">
                Import
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-72 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 w-8">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                {columns === 'tdsynnex' ? (
                  <>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                  </>
                ) : (
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
                )}
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">MSRP</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      {product.image || (
                        <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                          <Star className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-900 font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">by {product.vendor}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <ProfileBadge type={product.profile} />
                  </td>
                  {columns === 'tdsynnex' ? (
                    <>
                      <td className="py-3 px-4 text-sm text-gray-600">{(product as any).id}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{(product as any).availability}</td>
                    </>
                  ) : (
                    <td className="py-3 px-4 text-sm text-gray-600">{(product as any).partNumber}</td>
                  )}
                  <td className="py-3 px-4 text-sm text-gray-900">{product.msrp}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 flex items-center justify-end space-x-4">
            <span className="text-sm text-gray-600">
              1-10 of {total.toLocaleString()}
            </span>
            <div className="flex items-center space-x-1">
              <button
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage === 1}
              >
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

