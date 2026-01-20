import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { CatalogLayout } from '../components/layout/CatalogLayout';
import { ActionIcon, Badge, Card, DataTable, Inline, NumberInput, Text, Title, Button } from 'components/DesignSystem';

type ProductRowData = {
  name: string;
  productId: string;
  types: string[];
  imageComponent?: React.ReactNode;
};

// Product placeholder images (inline SVG icons)
const ProductImages = {
  rack: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-gray-7)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-gray-3)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 6h14M5 15h14" />
      </svg>
    </div>
  ),
  cable: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-pink-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-pink-6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  ),
  power: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-yellow-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-yellow-7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  ),
  software: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-blue-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-blue-7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
  ),
  monitor: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-gray-1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-gray-6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
  phone: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-grape-0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: 24, height: 24, color: 'var(--mantine-color-grape-7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
  adobe: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-red-6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>Pr</span>
    </div>
  ),
  dimension: (
    <div style={{ width: 40, height: 40, background: 'var(--mantine-color-teal-6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>Dn</span>
    </div>
  ),
};

// Sample product data
const products: ProductRowData[] = [
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
    <CatalogLayout>
      <main>
        <Inline justify="space-between">
          <div>
            <Title order={2} fw={500}>
              Production Catalog
            </Title>
            <Text c="dimmed" size="sm">
              Manage your production catalog products.
            </Text>
          </div>
          <Button variant="secondary" onClick={() => navigate('/products/staging')}>
            Add Staging Product
          </Button>
        </Inline>

        <Card>
          <DataTable
            data={products}
            columns={[
              {
                accessorKey: 'name',
                header: 'Product',
                enableSorting: true,
                cell: (row) => (
                  <Inline gap="sm">
                    <span style={{ display: 'inline-flex', opacity: 0.35 }}>
                      <Star size={18} />
                    </span>
                    <span style={{ width: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      {row.imageComponent || <Star size={18} />}
                    </span>
                    <div>
                      <Text fw={600} size="sm">
                        {row.name}
                      </Text>
                      <Text c="dimmed" size="xs">
                        Product ID: {row.productId}
                      </Text>
                    </div>
                  </Inline>
                ),
              },
              {
                accessorKey: 'types',
                header: 'Type',
                enableSorting: false,
                cell: (row) => (
                  <Inline gap="xs">
                    {row.types.map((t) => (
                      <Badge key={t} color="default" variant="outline">
                        {t}
                      </Badge>
                    ))}
                  </Inline>
                ),
              },
              {
                accessorKey: 'actions',
                header: '',
                enableSorting: false,
                align: 'right',
                cell: () => (
                  <Inline gap="xs" justify="flex-end">
                    <Button variant="link" rightSection={<ChevronDown size={16} />} leftSection={<Settings size={16} />}>
                      Actions
                    </Button>
                  </Inline>
                ),
              },
            ]}
            minWidth={900}
            showSearch
            searchPlaceholder="Search product names and IDs"
            emptyMessage="No products found."
          />

          <Inline justify="flex-end" align="center" mt="md">
            <Text size="sm" c="dimmed">
              1-{productsPerPage} of {totalProducts.toLocaleString()}
            </Text>
            <Inline gap="xs" align="center">
              <Button variant="default" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                <ChevronLeft size={18} />
              </Button>
              <NumberInput
                value={currentPage}
                onChange={(v) => setCurrentPage(Number(v) || 1)}
                min={1}
                step={1}
                clampBehavior="strict"
                w={110}
              />
              <Button variant="default" onClick={() => setCurrentPage(currentPage + 1)}>
                <ChevronRight size={18} />
              </Button>
            </Inline>
          </Inline>
        </Card>
      </main>

      {/* Help Button */}
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

