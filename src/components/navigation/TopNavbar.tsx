import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SearchIcon, PlusIcon, BellIcon, Settings2Icon } from 'lucide-react'
import { Avatar } from '../misc/Avatar'

const NavLink = ({ to, children, active, isNew }: { to: string; children: React.ReactNode; active?: boolean; isNew?: boolean }) => (
  <Link
    to={to}
    className={`text-sm font-medium px-1 py-1 relative ${
      active ? 'text-white' : 'text-gray-300 hover:text-white'
    }`}
  >
    <span className="flex items-center gap-1.5">
      {children}
      {isNew && (
        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 rounded-full uppercase tracking-wide animate-pulse">
          New
        </span>
      )}
    </span>
    {active && (
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 -mb-3"></span>
    )}
  </Link>
)

export const TopNavbar = () => {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <nav className="flex items-center justify-between bg-gray-900 text-white px-4 py-3">
      <div className="flex items-center space-x-6">
        {/* App Grid Icon */}
        <div className="grid grid-cols-3 gap-0.5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-1 w-1 bg-gray-400 rounded-sm"></div>
          ))}
        </div>

        <div className="flex items-center space-x-5">
          {/* Marketplace Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <div className="flex items-center justify-center bg-blue-600 rounded p-1.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Marketplace</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <NavLink to="/home" active={currentPath === '/home'}>
              Home
            </NavLink>
            <NavLink to="/operations" active={currentPath === '/operations'}>
              Operations
            </NavLink>
            <NavLink to="/products" active={currentPath === '/products' || currentPath.startsWith('/products/')} isNew>
              Products
            </NavLink>
            <NavLink to="/settings" active={currentPath === '/settings' || currentPath.startsWith('/settings/')} isNew>
              Settings
            </NavLink>
            <NavLink to="/reports" active={currentPath === '/reports'}>
              Reports
            </NavLink>
            <NavLink to="/themes" active={currentPath === '/themes'}>
              Themes
            </NavLink>
            <NavLink to="/programs" active={currentPath === '/programs'}>
              Programs
            </NavLink>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 text-white rounded pl-3 pr-10 py-1.5 text-sm w-44 placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-gray-600"
          />
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Create Button */}
        <button className="flex items-center bg-blue-600 text-white rounded px-4 py-1.5 text-sm font-medium hover:bg-blue-700">
          Create
          <PlusIcon className="h-4 w-4 ml-1.5" />
        </button>

        {/* Notifications */}
        <button className="relative p-1.5 hover:bg-gray-800 rounded">
          <BellIcon className="h-5 w-5 text-gray-300" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full text-[10px] font-medium flex items-center justify-center">
            9
          </span>
        </button>

        {/* Settings */}
        <button className="p-1.5 hover:bg-gray-800 rounded">
          <Settings2Icon className="h-5 w-5 text-gray-300" />
        </button>

        {/* Avatar */}
        <Avatar initials="NB" />
      </div>
    </nav>
  )
}
