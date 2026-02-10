import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Divider, NavLink, Stack, ThemeIcon, Title } from '@mantine/core';

type NavItem = {
  label: string;
  path?: string;
  icon?: string;
  indent?: number;
};

const SECTION: { title: string; icon?: string; items: NavItem[] }[] = [
  {
    title: 'OPERATIONS',
    icon: 'ri-settings-3-line',
    items: [
      { label: 'Users', path: '/operations', icon: 'ri-user-line' },
      { label: 'Companies', path: '/operations/companies', icon: 'ri-building-2-line' },
      { label: 'Microsoft', path: '/operations/microsoft', icon: 'ri-microsoft-line', indent: 12 },
      { label: 'Reseller: PC Insights', path: '/operations/microsoft/reseller', icon: 'ri-line-chart-line', indent: 24 },
      { label: 'Reseller: P2P Transfers', path: '/operations/microsoft/p2p', icon: 'ri-arrow-left-right-line', indent: 24 },
      { label: 'Reseller: Customer Onboarding', path: '/operations/microsoft/onboarding', icon: 'ri-user-add-line', indent: 24 },
      { label: 'GDAP: Management', path: '/operations/microsoft/onboarding/gdap', icon: 'ri-shield-keyhole-line', indent: 36 },
      { label: 'Azure Marketplace Catalog', path: '/integrations/azure-marketplace-catalog', icon: 'ri-store-2-line', indent: 24 },
    ],
  },
];

export function OperationsSidebar({ title = 'Operations' }: { title?: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path?: string) => {
    if (!path) return false;
    const p = location.pathname;
    return p === path || (path !== '/' && p.startsWith(path));
  };

  return (
    <nav aria-label="Operations navigation" style={{ height: '100%', overflowY: 'auto', paddingRight: 12 }}>
      <Stack gap="sm">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 66, paddingLeft: 6 }}>
          <ThemeIcon variant="transparent" size="lg" color="dark">
            <i className="ri-group-line" style={{ fontSize: 28 }} />
          </ThemeIcon>
          <Title order={5} fw={700} m={0}>
            {title}
          </Title>
        </div>
        <Divider />

        {SECTION.map((sec) => (
          <div key={sec.title}>
            {sec.title && (
              <Title order={6} fw={700} tt="uppercase" c="dimmed" px="xs" mb="xs">
                {sec.title}
              </Title>
            )}
            <Stack gap={2}>
              {sec.items.map((it) => (
                <NavLink
                  key={it.label}
                  label={it.label}
                  active={isActive(it.path)}
                  onClick={() => it.path && navigate(it.path)}
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

