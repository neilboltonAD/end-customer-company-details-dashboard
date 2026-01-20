import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { CatalogLayout } from '../components/layout/CatalogLayout';
import { ActionIcon, Badge, Button, Card, Inline, Stack, Tabs, Text, TextInput, Title, DataTable } from 'components/DesignSystem';
import type { DataTableColumn } from 'components/DesignSystem';

// Sidebar Section Component
const SidebarSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Stack gap={6}>
    <Card style={{ background: 'var(--mantine-color-gray-0)' }}>
      <Text size="xs" fw={800} style={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {title}
      </Text>
    </Card>
    <Stack gap={4}>{children}</Stack>
  </Stack>
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
  <Button
    variant={active ? 'primary' : 'link'}
    onClick={onClick}
    fullWidth
    style={{
      justifyContent: 'space-between',
      paddingLeft: 16 + indent * 12,
      paddingRight: 16,
    }}
    leftIcon={hasArrow ? <span style={{ fontSize: 12 }}>{expanded ? '▼' : '▶'}</span> : undefined}
    rightIcon={!active && !hasArrow && indent === 0 ? <ChevronRight size={16} /> : undefined}
  >
    {label}
  </Button>
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
  <Button
    variant="link"
    onClick={onClick}
    fullWidth
    style={{ justifyContent: 'space-between', paddingLeft: 32, paddingRight: 12 }}
    rightIcon={
      hasChildren ? (
        <span style={{ display: 'inline-flex', transform: expanded ? 'rotate(90deg)' : undefined, transition: 'transform 120ms ease' }}>
          <ChevronRight size={16} />
        </span>
      ) : undefined
    }
  >
    <Text size="sm" c="dimmed">
      {label}
    </Text>
  </Button>
);

// Subcategory Item Component
const SubcategoryItem = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <Button
    variant="link"
    onClick={onClick}
    fullWidth
    style={{ justifyContent: 'flex-start', paddingLeft: 48, paddingRight: 12 }}
  >
    <Text size="sm" c="dimmed">
      {label}
    </Text>
  </Button>
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

// Profile Badge Component
const ProfileBadge = ({ type }: { type: 'Basic' | 'Enriched' | 'Partially Enriched' }) => {
  const color: 'default' | 'success' | 'pending' =
    type === 'Enriched' ? 'success' : type === 'Partially Enriched' ? 'pending' : 'default';

  return (
    <Badge size="sm" variant="outline" color={color}>
      {type}
    </Badge>
  );
};

// Product Images
const ProductImages = {
  laptop: (
    <div style={{ width: 40, height: 40, background: '#0B1B3F', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: '#93C5FD' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
  ),
  lenovo: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-red-6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: 8, fontWeight: 800 }}>Lenovo</span>
    </div>
  ),
  cable: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-pink-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-pink-6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  ),
  phone: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-violet-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-violet-6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    </div>
  ),
  inverter: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-green-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-green-7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  ),
  memory: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-indigo-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-indigo-7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    </div>
  ),
  network: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-orange-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-orange-7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    </div>
  ),
  adobe: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-red-6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>A</span>
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

// Microsoft Marketplace Products
const microsoftMarketplaceProducts = [
  { name: 'Windows Server 2022 Datacenter', vendor: 'Microsoft', profile: 'Enriched' as const, productId: 'MS-WS2022-DC', pricing: 'PayAsYouGo', image: ProductImages.laptop },
  { name: 'Ubuntu Server 22.04 LTS', vendor: 'Canonical', profile: 'Enriched' as const, productId: 'CAN-UBU-2204', pricing: 'Free', image: ProductImages.lenovo },
  { name: 'Dynamics 365 Sales', vendor: 'Microsoft', profile: 'Enriched' as const, productId: 'MS-D365-SALES', pricing: 'Subscription', image: ProductImages.laptop },
  { name: 'Power BI Pro', vendor: 'Microsoft', profile: 'Enriched' as const, productId: 'MS-PBI-PRO', pricing: 'Subscription', image: ProductImages.laptop },
  { name: 'Red Hat Enterprise Linux 9', vendor: 'Red Hat', profile: 'Basic' as const, productId: 'RH-RHEL9', pricing: 'PayAsYouGo', image: ProductImages.lenovo },
  { name: 'SQL Server 2022 Enterprise', vendor: 'Microsoft', profile: 'Enriched' as const, productId: 'MS-SQL2022-ENT', pricing: 'BYOL', image: ProductImages.laptop },
  { name: 'NGINX Plus', vendor: 'F5 Networks', profile: 'Basic' as const, productId: 'F5-NGINX-PLUS', pricing: 'PayAsYouGo', image: ProductImages.cable },
  { name: 'Microsoft 365 E5', vendor: 'Microsoft', profile: 'Enriched' as const, productId: 'MS-M365-E5', pricing: 'Subscription', image: ProductImages.laptop },
  { name: 'Azure Kubernetes Service (AKS)', vendor: 'Microsoft', profile: 'Enriched' as const, productId: 'MS-AKS', pricing: 'PayAsYouGo', image: ProductImages.laptop },
  { name: 'Datadog Monitoring', vendor: 'Datadog', profile: 'Basic' as const, productId: 'DD-MONITOR', pricing: 'Subscription', image: ProductImages.cable },
];

type Distributor = 'firstbase' | 'tdsynnex' | 'ingrammicro' | 'microsoftmarketplace';

export const FindProducts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('distributor') as Distributor || 'firstbase';
  const [activeTab, setActiveTab] = useState<Distributor>(initialTab);
  const [currentPage, setCurrentPage] = useState(1);
  const [findProductsExpanded, setFindProductsExpanded] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('ucc-mobility');
  const [query, setQuery] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const getProducts = () => {
    switch (activeTab) {
      case 'firstbase':
        return { products: firstbaseProducts, total: 227, columns: 'firstbase' };
      case 'tdsynnex':
        return { products: tdSynnexProducts, total: 69096, columns: 'tdsynnex' };
      case 'ingrammicro':
        return { products: ingramMicroProducts, total: 624, columns: 'ingrammicro' };
      case 'microsoftmarketplace':
        return { products: microsoftMarketplaceProducts, total: 15420, columns: 'microsoftmarketplace' };
    }
  };

  const { products, total, columns } = getProducts();
  const tableData = products.map((p, i) => ({ ...p, __rowId: `${activeTab}-${i}` }));

  const toggleRow = (id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visibleRowIds = tableData.map((r) => r.__rowId as string);
  const allSelected = visibleRowIds.length > 0 && visibleRowIds.every((id) => selectedRowIds.has(id));
  const toggleAll = () => {
    setSelectedRowIds(() => (allSelected ? new Set() : new Set(visibleRowIds)));
  };

  const baseColumns: DataTableColumn<any>[] = [
    {
      accessorKey: '__select',
      header: (
        <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
      ) as any,
      enableSorting: false,
      align: 'center',
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedRowIds.has(row.__rowId)}
          onChange={() => toggleRow(row.__rowId)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Product',
      enableSorting: true,
      cell: (row) => (
        <Inline gap="sm" align="center" wrap="nowrap">
          {row.image || (
            <div
              style={{
                width: 40,
                height: 40,
                background: 'var(--mantine-color-gray-1)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Star size={18} style={{ color: 'var(--mantine-color-gray-4)' }} />
            </div>
          )}
          <div>
            <Text fw={700} size="sm">
              {row.name}
            </Text>
            <Text size="xs" c="dimmed">
              by {row.vendor}
            </Text>
          </div>
        </Inline>
      ),
    },
    {
      accessorKey: 'profile',
      header: 'Profile',
      enableSorting: true,
      cell: (row) => <ProfileBadge type={row.profile} />,
    },
  ];

  const distributorColumns: DataTableColumn<any>[] =
    columns === 'tdsynnex'
      ? [
          { accessorKey: 'id', header: 'ID', enableSorting: true },
          { accessorKey: 'availability', header: 'Availability', enableSorting: true },
        ]
      : columns === 'microsoftmarketplace'
      ? [
          { accessorKey: 'productId', header: 'Product ID', enableSorting: true },
          {
            accessorKey: 'pricing',
            header: 'Pricing',
            enableSorting: true,
            cell: (row) => {
              const pricing = row.pricing as string;
              const badgeColor: 'default' | 'success' | 'info' | 'pending' =
                pricing === 'Free'
                  ? 'success'
                  : pricing === 'Subscription'
                  ? 'info'
                  : pricing === 'PayAsYouGo'
                  ? 'pending'
                  : 'default';
              return (
                <Badge size="sm" color={badgeColor} variant="outline">
                  {pricing}
                </Badge>
              );
            },
          },
        ]
      : [{ accessorKey: 'partNumber', header: 'Part Number', enableSorting: true }];

  const msrpColumn: DataTableColumn<any>[] =
    columns === 'microsoftmarketplace' ? [] : [{ accessorKey: 'msrp', header: 'MSRP', enableSorting: true }];

  const tableColumns: DataTableColumn<any>[] = [...baseColumns, ...distributorColumns, ...msrpColumn];

  return (
    <CatalogLayout>
      <main>
        <Inline gap="lg" align="flex-start" wrap="nowrap">
          <div style={{ width: 320, flexShrink: 0 }}>
            <Card>
              <SidebarSection title="Import Products">
                <SidebarItem
                  label="Find Products"
                  active
                  hasArrow
                  expanded={findProductsExpanded}
                  onClick={() => setFindProductsExpanded(!findProductsExpanded)}
                />

                {findProductsExpanded && (
                  <Card style={{ background: 'var(--mantine-color-gray-0)' }}>
                    <Stack gap={4}>
                      {productCategories.map((category) => (
                        <div key={category.id}>
                          <CategoryItem
                            label={category.label}
                            hasChildren={category.hasChildren}
                            expanded={expandedCategory === category.id}
                            onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                          />

                          {expandedCategory === category.id && category.subcategories && (
                            <Card>
                              <Stack gap={6}>
                                <Text size="xs" fw={800} c="dimmed" style={{ textTransform: 'uppercase' }}>
                                  Categories
                                </Text>
                                <Stack gap={2}>
                                  {category.subcategories.map((sub) => (
                                    <SubcategoryItem key={sub} label={sub} onClick={() => {}} />
                                  ))}
                                </Stack>
                              </Stack>
                            </Card>
                          )}
                        </div>
                      ))}
                    </Stack>
                  </Card>
                )}

                <SidebarItem label="Product Imports" onClick={() => navigate('/products')} />
                <SidebarItem label="Settings" onClick={() => navigate('/products/import-settings')} />
              </SidebarSection>
            </Card>
          </div>

          <div style={{ flex: 1 }}>
            <Button variant="link" onClick={() => navigate('/products')} leftIcon={<ChevronLeft size={16} />}>
              Product Imports
            </Button>

            <Title order={2} fw={700}>
              Find Products
            </Title>
            <Text size="sm" c="dimmed">
              Connect with distributor accounts, import and configure more product catalogs.
            </Text>

            <Card>
              <Tabs
                value={activeTab}
                onTabChange={(v) => setActiveTab((v as Distributor) || 'firstbase')}
                tabs={[
                  { id: 'firstbase', label: 'Firstbase' },
                  { id: 'tdsynnex', label: 'TD SYNNEX' },
                  { id: 'ingrammicro', label: 'Ingram Micro' },
                  { id: 'microsoftmarketplace', label: 'Microsoft Marketplace' },
                ]}
              />
            </Card>

            {(activeTab === 'tdsynnex' || activeTab === 'ingrammicro' || activeTab === 'microsoftmarketplace') && (
              <Card style={{ border: '1px solid var(--mantine-color-blue-2)', background: 'var(--mantine-color-blue-0)' }}>
                <Text size="sm">
                  Browse the Distributor catalog and select products to import to marketplace catalog with a 15% default markup. Click{' '}
                  <Text span fw={700} style={{ color: 'var(--mantine-color-blue-7)' }}>
                    here
                  </Text>{' '}
                  to change the Markup percentage.
                </Text>
              </Card>
            )}

            <Card>
              <Inline justify="space-between" align="center" wrap="nowrap">
                <Inline gap="sm" align="center" wrap="nowrap">
                  <Button variant="outline" size="sm">
                    Show Filters
                  </Button>
                  <Button variant="primary" size="sm" rightIcon={<ChevronRight size={16} />}>
                    Import
                  </Button>
                  <Button variant="outline" size="sm" onClick={toggleAll} disabled={tableData.length === 0}>
                    {allSelected ? 'Clear selection' : 'Select all'}
                  </Button>
                </Inline>

                <TextInput
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.currentTarget.value)}
                  leftIcon={<Search size={14} />}
                  style={{ width: 320 }}
                />
              </Inline>

              <DataTable
                data={tableData.filter((row) => {
                  const q = query.trim().toLowerCase();
                  if (!q) return true;
                  const r = row as any;
                  return (
                    String(r.name).toLowerCase().includes(q) ||
                    String(r.vendor).toLowerCase().includes(q) ||
                    String(r.profile).toLowerCase().includes(q) ||
                    String(r.partNumber || '').toLowerCase().includes(q) ||
                    String(r.productId || '').toLowerCase().includes(q) ||
                    String(r.id || '').toLowerCase().includes(q)
                  );
                })}
                columns={tableColumns}
                showSearch={false}
                getRowId={(row) => row.__rowId}
                minWidth={900}
                emptyMessage="No products found"
              />

              <Inline justify="flex-end" align="center" wrap="nowrap">
                <Text size="sm" c="dimmed">
                  1-10 of {total.toLocaleString()}
                </Text>
                <Inline gap="xs" align="center" wrap="nowrap">
                  <ActionIcon
                    aria-label="Previous page"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={18} />
                  </ActionIcon>
                  <ActionIcon aria-label="Next page" onClick={() => setCurrentPage((p) => p + 1)}>
                    <ChevronRight size={18} />
                  </ActionIcon>
                </Inline>
              </Inline>
            </Card>
          </div>
        </Inline>
      </main>

      <div style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <ActionIcon
          aria-label="Help"
          customFill="var(--mantine-color-blue-6)"
          customBorder="1px solid var(--mantine-color-blue-7)"
          style={{ color: 'white', boxShadow: 'var(--mantine-shadow-lg)' }}
        >
          <HelpCircle size={18} />
        </ActionIcon>
      </div>
    </CatalogLayout>
  );
};

