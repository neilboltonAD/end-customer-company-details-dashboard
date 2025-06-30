import React from 'react'
export const SecondaryNavbar = () => {
  return (
    <div className="flex items-center border-b border-gray-200 px-4 py-2 bg-white">
      <div className="flex space-x-6">
        <span className="text-sm text-gray-600">Marketplace</span>
        <span className="text-sm text-gray-600">Home</span>
        <span className="text-sm text-gray-600">Operations</span>
        <span className="text-sm text-gray-600">Products</span>
        <span className="text-sm text-gray-600 border-b-2 border-gray-800 pb-2">
          Settings
        </span>
        <span className="text-sm text-gray-600">Reports</span>
        <span className="text-sm text-gray-600">Themes</span>
        <span className="text-sm text-gray-600">Programs</span>
      </div>
    </div>
  )
} 