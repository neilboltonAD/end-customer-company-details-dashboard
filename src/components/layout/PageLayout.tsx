import React from 'react'
import { TopNavbar } from '../navigation/TopNavbar'
import { SecondaryNavbar } from '../navigation/SecondaryNavbar'
import { Sidebar } from '../navigation/Sidebar'
type PageLayoutProps = {
  children: React.ReactNode
  title: string
}
export const PageLayout = ({ children, title }: PageLayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopNavbar />
      <SecondaryNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-xl font-medium text-gray-800 mb-6">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 