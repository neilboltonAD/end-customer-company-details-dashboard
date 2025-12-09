import React from 'react'
import { TopNavbar } from '../navigation/TopNavbar'
import { SecondaryNavbar } from '../navigation/SecondaryNavbar'
import { Sidebar } from '../navigation/Sidebar'

type PageLayoutProps = {
  children: React.ReactNode
  title: string
  activeItem?: string
}

export const PageLayout = ({ children, title, activeItem }: PageLayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem={activeItem} />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
