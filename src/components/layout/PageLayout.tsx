import React from 'react'
import { AppShell, Stack } from '@mantine/core'
import { TopNavbar } from '../navigation/TopNavbar'
import { Sidebar } from '../navigation/Sidebar'
import { AppDirectBrandingColors } from '../../styles/appdirectBrandingColors'

type PageLayoutProps = {
  children: React.ReactNode
  title: string
  activeItem?: string
}

export const PageLayout = ({ children, title, activeItem }: PageLayoutProps) => {
  return (
    <AppShell
      header={{ height: 68 }}
      navbar={{ width: 256, breakpoint: 'sm', collapsed: { mobile: false } }}
      padding="lg"
    >
      <AppShell.Header style={{ background: AppDirectBrandingColors.Navy }}>
        <TopNavbar embedded />
      </AppShell.Header>
      <AppShell.Navbar pt={0} pb="md" pl="md" pr={0}>
        <Sidebar activeItem={activeItem} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Stack gap="xl">
          {children}
        </Stack>
      </AppShell.Main>
    </AppShell>
  )
}
