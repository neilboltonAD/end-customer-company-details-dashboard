import React from 'react'
type SidebarCategoryProps = {
  title: string
  children: React.ReactNode
}
export const SidebarCategory = ({ title, children }: SidebarCategoryProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-gray-500 px-4 py-2">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  )
}
type SidebarItemProps = {
  label: string
  isActive?: boolean
}
export const SidebarItem = ({ label, isActive = false }: SidebarItemProps) => {
  return (
    <div
      className={`px-4 py-2 text-sm ${isActive ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      {label}
    </div>
  )
}
export const Sidebar = () => {
  return (
    <div className="w-64 border-r border-gray-200 h-full bg-white">
      <SidebarCategory title="SETTINGS">
        <SidebarItem label="General Settings" />
        <SidebarItem label="Developers" />
        <SidebarItem label="Marketplace Functionality" />
        <SidebarItem label="Roles" />
        <SidebarItem label="Assisted Sales" />
        <SidebarItem label="Security" />
        <SidebarItem label="Product Search" />
        <SidebarItem label="Shipping" />
        <SidebarItem label="Usage Analytics Accounts" />
        <SidebarItem label="Data Removal" />
      </SidebarCategory>
      <SidebarCategory title="BILLING SETTINGS">
        <SidebarItem label="Billing Functionality" />
        <SidebarItem label="Payment Methods" />
        <SidebarItem label="Invoice Settings" />
        <SidebarItem label="Revenue Shares Settings" />
      </SidebarCategory>
      <SidebarCategory title="CUSTOM UI">
        <SidebarItem label="Extensions" />
        <SidebarItem label="FAQs" />
        <SidebarItem label="Notifications" />
        <SidebarItem label="Custom Attributes" />
        <SidebarItem label="Customize Translations" />
        <SidebarItem label="Navigation Manager" />
      </SidebarCategory>
      <SidebarCategory title="INTEGRATION">
        <SidebarItem label="GraphQL Explorer" />
        <SidebarItem label="API Clients" />
        <SidebarItem label="Migration" />
        <SidebarItem label="Webhooks" />
        <SidebarItem label="Functions" />
        <SidebarItem label="Google Transfer Tool" />
        <SidebarItem label="Vendor Integrations" />
      </SidebarCategory>
      <SidebarCategory title="DATA SYNC">
        <SidebarItem label="Sync Settings" isActive={true} />
      </SidebarCategory>
      <SidebarCategory title="REPORTS">
        <SidebarItem label="Destinations" />
        <SidebarItem label="Advanced Settings" />
      </SidebarCategory>
      <SidebarCategory title="DOCUMENT BUILDER">
        <SidebarItem label="Manage Templates" />
        <SidebarItem label="Template Settings" />
      </SidebarCategory>
    </div>
  )
} 