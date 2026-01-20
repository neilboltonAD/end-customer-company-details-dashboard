import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Divider, NavLink, Stack, ThemeIcon, Title } from '@mantine/core'

type SidebarCategoryProps = {
  title: string
  children: React.ReactNode
}

export const SidebarCategory = ({ title, children }: SidebarCategoryProps) => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 48, paddingLeft: 6 }}>
        <Title order={6} fw={700} m={0}>
          {title}
        </Title>
      </div>
      <Divider mb="sm" />
      <Stack gap={2}>{children}</Stack>
    </div>
  )
}

type SidebarItemProps = {
  label: string
  icon?: string
  isActive?: boolean
  onClick?: () => void
  path?: string
  rightSection?: React.ReactNode
}

export const SidebarItem = ({ label, icon, isActive = false, onClick, path, rightSection }: SidebarItemProps) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (path) {
      navigate(path)
    }
  }

  return (
    <NavLink
      label={label}
      active={isActive}
      aria-current={isActive ? 'page' : undefined}
      onClick={handleClick}
      leftSection={
        icon ? (
          <ThemeIcon variant="transparent" size="md" color={isActive ? 'blue' : 'dark'}>
            <i className={icon} style={{ fontSize: 20 }} />
          </ThemeIcon>
        ) : undefined
      }
      rightSection={rightSection}
      styles={{
        root: {
          height: 44,
          paddingLeft: 'var(--mantine-spacing-xs)',
          borderTopLeftRadius: 'var(--mantine-radius-sm)',
          borderBottomLeftRadius: 'var(--mantine-radius-sm)',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      }}
    />
  )
}

type SidebarProps = {
  activeItem?: string
}

export const Sidebar = ({ activeItem = 'General Settings' }: SidebarProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Determine active item based on current path
  const getActiveItem = () => {
    if (location.pathname === '/settings/vendor-integrations') return 'Vendor Integrations'
    if (location.pathname === '/settings/vendor-integrations/microsoft') return 'Vendor Integrations'
    if (location.pathname === '/settings/sync') return 'Sync Settings'
    if (location.pathname === '/settings' || location.pathname === '/settings/general') return 'General Settings'
    return activeItem
  }

  const currentActive = getActiveItem()

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingRight: 12 }}>
      <SidebarCategory title="SETTINGS">
        <SidebarItem 
          label="General Settings" 
          isActive={currentActive === 'General Settings'} 
          path="/settings/general"
          icon="ri-settings-3-line"
        />
        <SidebarItem label="Developers" isActive={currentActive === 'Developers'} />
        <SidebarItem label="Marketplace Functionality" isActive={currentActive === 'Marketplace Functionality'} />
        <SidebarItem label="Roles" isActive={currentActive === 'Roles'} />
        <SidebarItem label="Assisted Sales" isActive={currentActive === 'Assisted Sales'} />
        <SidebarItem label="Security" isActive={currentActive === 'Security'} />
        <SidebarItem label="Product Search" isActive={currentActive === 'Product Search'} />
        <SidebarItem label="Shipping" isActive={currentActive === 'Shipping'} />
        <SidebarItem label="Usage Analytics Accounts" isActive={currentActive === 'Usage Analytics Accounts'} />
        <SidebarItem label="Data Removal" isActive={currentActive === 'Data Removal'} />
      </SidebarCategory>

      <div style={{ marginTop: 18 }} />
      <SidebarCategory title="BILLING SETTINGS">
        <SidebarItem label="Billing Functionality" isActive={currentActive === 'Billing Functionality'} />
        <SidebarItem label="Payment Methods" isActive={currentActive === 'Payment Methods'} />
        <SidebarItem label="Invoice Settings" isActive={currentActive === 'Invoice Settings'} />
        <SidebarItem label="Revenue Shares Settings" isActive={currentActive === 'Revenue Shares Settings'} />
      </SidebarCategory>

      <div style={{ marginTop: 18 }} />
      <SidebarCategory title="CUSTOM UI">
        <SidebarItem label="Extensions" isActive={currentActive === 'Extensions'} />
        <SidebarItem label="FAQs" isActive={currentActive === 'FAQs'} />
        <SidebarItem label="Notifications" isActive={currentActive === 'Notifications'} />
        <SidebarItem label="Custom Attributes" isActive={currentActive === 'Custom Attributes'} />
        <SidebarItem label="Customize Translations" isActive={currentActive === 'Customize Translations'} />
        <SidebarItem label="Navigation Manager" isActive={currentActive === 'Navigation Manager'} />
      </SidebarCategory>

      <div style={{ marginTop: 18 }} />
      <SidebarCategory title="INTEGRATION">
        <SidebarItem label="GraphQL Explorer" isActive={currentActive === 'GraphQL Explorer'} />
        <SidebarItem label="API Clients" isActive={currentActive === 'API Clients'} />
        <SidebarItem label="Migration" isActive={currentActive === 'Migration'} />
        <SidebarItem label="Webhooks" isActive={currentActive === 'Webhooks'} />
        <SidebarItem label="Functions" isActive={currentActive === 'Functions'} />
        <SidebarItem label="Google Transfer Tool" isActive={currentActive === 'Google Transfer Tool'} />
        <SidebarItem 
          label="Sync Settings" 
          isActive={currentActive === 'Sync Settings'} 
          path="/settings/sync"
          icon="ri-refresh-line"
        />
        <SidebarItem 
          label="Vendor Integrations" 
          isActive={currentActive === 'Vendor Integrations'} 
          path="/settings/vendor-integrations"
          icon="ri-plug-line"
        />
      </SidebarCategory>

      <div style={{ marginTop: 18 }} />
      <SidebarCategory title="REPORTS">
        <SidebarItem label="Destinations" isActive={currentActive === 'Destinations'} />
        <SidebarItem label="Advanced Settings" isActive={currentActive === 'Advanced Settings'} />
      </SidebarCategory>

      <div style={{ marginTop: 18 }} />
      <SidebarCategory title="DOCUMENT BUILDER">
        <SidebarItem label="Manage Templates" isActive={currentActive === 'Manage Templates'} />
        <SidebarItem label="Template Settings" isActive={currentActive === 'Template Settings'} />
      </SidebarCategory>
    </div>
  )
}
