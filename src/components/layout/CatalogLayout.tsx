import React from 'react';
import { AppShell, Stack } from '@mantine/core';
import { TopNavbar } from '../navigation/TopNavbar';
import { CatalogSidebar } from '../navigation/CatalogSidebar';
import { AppDirectBrandingColors } from '../../styles/appdirectBrandingColors';

export function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      header={{ height: 68 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: false } }}
      padding="lg"
    >
      <AppShell.Header style={{ background: AppDirectBrandingColors.Navy }}>
        <TopNavbar embedded />
      </AppShell.Header>
      <AppShell.Navbar pt={0} pb="md" pl="md" pr={0}>
        <CatalogSidebar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Stack gap="xl">{children}</Stack>
      </AppShell.Main>
    </AppShell>
  );
}

