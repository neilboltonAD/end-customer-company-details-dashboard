import React from 'react'
import { SearchIcon, PlusIcon, BellIcon, Settings2Icon } from 'lucide-react'
import { Avatar } from '../misc/Avatar'
export const TopNavbar = () => {
  return (
    <nav className="flex items-center justify-between bg-black text-white p-3">
      <div className="flex items-center space-x-6">
        <div className="h-6 w-6" />
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center bg-blue-600 rounded-sm p-1">
            <span className="text-sm font-medium">Marketplace</span>
          </div>
          <span className="text-sm font-medium">Home</span>
          <span className="text-sm font-medium">Operations</span>
          <span className="text-sm font-medium">Products</span>
          <span className="text-sm font-medium">Settings</span>
          <span className="text-sm font-medium">Reports</span>
          <span className="text-sm font-medium">Themes</span>
          <span className="text-sm font-medium">Programs</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 text-white rounded-sm pl-2 pr-8 py-1 text-sm w-40"
          />
          <SearchIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <button className="flex items-center bg-blue-600 text-white rounded-sm px-3 py-1 text-sm">
          <PlusIcon className="h-4 w-4 mr-1" />
          Create
        </button>
        <BellIcon className="h-5 w-5" />
        <Settings2Icon className="h-5 w-5" />
        <Avatar initials="NB" label="Connectors 2" />
      </div>
    </nav>
  )
} 