import React from 'react';
import { AppShell, Stack } from '@mantine/core';
import { TopNavbar } from '../navigation/TopNavbar';
import { OperationsSidebar } from '../navigation/OperationsSidebar';
import { AppDirectBrandingColors } from '../../styles/appdirectBrandingColors';

export function OperationsLayout({ children }: { children: React.ReactNode }) {
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
        <OperationsSidebar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Stack gap="xl">{children}</Stack>
      </AppShell.Main>
    </AppShell>
  );
}

