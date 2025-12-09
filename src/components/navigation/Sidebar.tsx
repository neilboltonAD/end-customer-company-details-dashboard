import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

type SidebarCategoryProps = {
  title: string
  children: React.ReactNode
}

export const SidebarCategory = ({ title, children }: SidebarCategoryProps) => {
  return (
    <div className="mb-1">
      <div className="bg-gray-100 border-y border-gray-200 px-4 py-2">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="py-1">{children}</div>
    </div>
  )
}

type SidebarItemProps = {
  label: string
  isActive?: boolean
  onClick?: () => void
  path?: string
}

export const SidebarItem = ({ label, isActive = false, onClick, path }: SidebarItemProps) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (path) {
      navigate(path)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
        isActive 
          ? 'bg-teal-700 text-white font-medium' 
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}

type SidebarProps = {
  activeItem?: string
}

export const Sidebar = ({ activeItem = 'General Settings' }: SidebarProps) => {
  const location = useLocation()
  
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
    <div className="w-64 border-r border-gray-200 h-full bg-white overflow-y-auto">
      <SidebarCategory title="SETTINGS">
        <SidebarItem 
          label="General Settings" 
          isActive={currentActive === 'General Settings'} 
          path="/settings/general"
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

      <SidebarCategory title="BILLING SETTINGS">
        <SidebarItem label="Billing Functionality" isActive={currentActive === 'Billing Functionality'} />
        <SidebarItem label="Payment Methods" isActive={currentActive === 'Payment Methods'} />
        <SidebarItem label="Invoice Settings" isActive={currentActive === 'Invoice Settings'} />
        <SidebarItem label="Revenue Shares Settings" isActive={currentActive === 'Revenue Shares Settings'} />
      </SidebarCategory>

      <SidebarCategory title="CUSTOM UI">
        <SidebarItem label="Extensions" isActive={currentActive === 'Extensions'} />
        <SidebarItem label="FAQs" isActive={currentActive === 'FAQs'} />
        <SidebarItem label="Notifications" isActive={currentActive === 'Notifications'} />
        <SidebarItem label="Custom Attributes" isActive={currentActive === 'Custom Attributes'} />
        <SidebarItem label="Customize Translations" isActive={currentActive === 'Customize Translations'} />
        <SidebarItem label="Navigation Manager" isActive={currentActive === 'Navigation Manager'} />
      </SidebarCategory>

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
        />
        <SidebarItem 
          label="Vendor Integrations" 
          isActive={currentActive === 'Vendor Integrations'} 
          path="/settings/vendor-integrations"
        />
      </SidebarCategory>

      <SidebarCategory title="REPORTS">
        <SidebarItem label="Destinations" isActive={currentActive === 'Destinations'} />
        <SidebarItem label="Advanced Settings" isActive={currentActive === 'Advanced Settings'} />
      </SidebarCategory>

      <SidebarCategory title="DOCUMENT BUILDER">
        <SidebarItem label="Manage Templates" isActive={currentActive === 'Manage Templates'} />
        <SidebarItem label="Template Settings" isActive={currentActive === 'Template Settings'} />
      </SidebarCategory>
    </div>
  )
}
