import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Divider, NavLink, Stack, ThemeIcon, Title } from '@mantine/core';

type NavItem = {
  label: string;
  path: string;
  icon?: string;
  indent?: number;
};

const ITEMS: { title: string; items: NavItem[] }[] = [
  {
    title: 'MARKETPLACE',
    items: [
      { label: 'Home', path: '/home', icon: 'ri-home-4-line' },
      { label: 'Product Catalog', path: '/products', icon: 'ri-layout-grid-line' },
      { label: 'Staging Catalog', path: '/products/staging', icon: 'ri-inbox-archive-line', indent: 12 },
      { label: 'Find & Import Products', path: '/products/find', icon: 'ri-search-2-line', indent: 12 },
      { label: 'Network Products', path: '/products/network', icon: 'ri-share-line', indent: 12 },
      { label: 'Import Settings', path: '/products/import-settings', icon: 'ri-settings-3-line', indent: 12 },
      { label: 'Price Sync', path: '/products/price-sync', icon: 'ri-refresh-line', indent: 12 },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      { label: 'Vendor Integrations', path: '/settings/vendor-integrations', icon: 'ri-plug-line' },
      { label: 'Operations', path: '/operations/companies', icon: 'ri-building-2-line' },
    ],
  },
];

export function CatalogSidebar({ title = 'Marketplace' }: { title?: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    const p = location.pathname;
    return p === path || (path !== '/' && p.startsWith(path));
  };

  return (
    <nav aria-label="Marketplace navigation" style={{ height: '100%', overflowY: 'auto', paddingRight: 12 }}>
      <Stack gap="sm">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 66, paddingLeft: 6 }}>
          <ThemeIcon variant="transparent" size="lg" color="dark">
            <i className="ri-store-2-line" style={{ fontSize: 28 }} />
          </ThemeIcon>
          <Title order={5} fw={700} m={0}>
            {title}
          </Title>
        </div>
        <Divider />

        {ITEMS.map((sec) => (
          <div key={sec.title}>
            <Title order={6} fw={700} tt="uppercase" c="dimmed" px="xs" mb="xs">
              {sec.title}
            </Title>
            <Stack gap={2}>
              {sec.items.map((it) => (
                <NavLink
                  key={it.path}
                  label={it.label}
                  active={isActive(it.path)}
                  onClick={() => navigate(it.path)}
                  leftSection={
                    it.icon ? (
                      <ThemeIcon variant="transparent" size="md" color={isActive(it.path) ? 'blue' : 'dark'}>
                        <i className={it.icon} style={{ fontSize: 20 }} />
                      </ThemeIcon>
                    ) : undefined
                  }
                  styles={{
                    root: {
                      height: 44,
                      paddingLeft: `calc(var(--mantine-spacing-xs) + ${it.indent || 0}px)`,
                      borderTopLeftRadius: 'var(--mantine-radius-sm)',
                      borderBottomLeftRadius: 'var(--mantine-radius-sm)',
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                  }}
                />
              ))}
            </Stack>
          </div>
        ))}
      </Stack>
    </nav>
  );
}

