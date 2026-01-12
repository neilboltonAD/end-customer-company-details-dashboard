import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SearchIcon, PlusIcon, BellIcon, Settings2Icon, ArrowDownLeft, ArrowUpRight, Clock, X, ExternalLink } from 'lucide-react'
import { Avatar } from '../misc/Avatar'
import { mockTransferRequests, formatDate, getDaysUntilExpiration, formatCurrency } from '../company/p2p/mockData'

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
  const navigate = useNavigate()
  const currentPath = location.pathname
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get pending P2P transfers for notifications
  const pendingIncoming = mockTransferRequests.filter(t => t.direction === 'Incoming' && t.status === 'Pending')
  const pendingOutgoing = mockTransferRequests.filter(t => t.direction === 'Outgoing' && t.status === 'Pending')
  const totalPending = pendingIncoming.length + pendingOutgoing.length

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleViewAll = () => {
    setNotificationsOpen(false)
    navigate('/operations/companies')
  }

  const handleTransferClick = (customerName: string) => {
    setNotificationsOpen(false)
    navigate(`/operations/companies/${encodeURIComponent(customerName)}`)
  }

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
            <NavLink to="/operations" active={currentPath === '/operations' || currentPath.startsWith('/operations/')} isNew>
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
        <div className="relative" ref={dropdownRef}>
          <button 
            className={`relative p-1.5 rounded transition-colors ${notificationsOpen ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <BellIcon className={`h-5 w-5 ${notificationsOpen ? 'text-white' : 'text-gray-300'}`} />
            {totalPending > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full text-[10px] font-medium flex items-center justify-center">
                {totalPending}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">Notifications</span>
                  {totalPending > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                      {totalPending}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* P2P Transfer Notifications */}
              <div className="max-h-96 overflow-y-auto">
                {/* Incoming Transfers Section */}
                {pendingIncoming.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                      <div className="flex items-center gap-2">
                        <ArrowDownLeft className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-800 uppercase">
                          Incoming P2P Transfers
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                          {pendingIncoming.length}
                        </span>
                      </div>
                    </div>
                    {pendingIncoming.map((transfer) => {
                      const daysRemaining = getDaysUntilExpiration(transfer.expirationDate)
                      const isUrgent = daysRemaining <= 7

                      return (
                        <div 
                          key={transfer.id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${isUrgent ? 'bg-orange-50' : ''}`}
                          onClick={() => handleTransferClick(transfer.customerName)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  Transfer from {transfer.sourcePartner.name}
                                </span>
                                {isUrgent && (
                                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-500 text-white rounded">
                                    URGENT
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                {transfer.lineItems.length} subscription{transfer.lineItems.length !== 1 ? 's' : ''} • ~{formatCurrency(transfer.totalMonthlyValue)}/mo
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span className={isUrgent ? 'text-orange-600 font-medium' : ''}>
                                  Expires {formatDate(transfer.expirationDate)} ({daysRemaining} days)
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                Pending
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Outgoing Transfers Section */}
                {pendingOutgoing.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-teal-50 border-b border-teal-100">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4 text-teal-600" />
                        <span className="text-xs font-semibold text-teal-800 uppercase">
                          Outgoing P2P Transfers
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-bold bg-teal-600 text-white rounded-full">
                          {pendingOutgoing.length}
                        </span>
                      </div>
                    </div>
                    {pendingOutgoing.map((transfer) => (
                      <div 
                        key={transfer.id}
                        className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleTransferClick(transfer.customerName)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              Transfer to {transfer.targetPartner.name}
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              {transfer.lineItems.length} subscription{transfer.lineItems.length !== 1 ? 's' : ''} • ~{formatCurrency(transfer.totalMonthlyValue)}/mo
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Awaiting partner response</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                              Awaiting
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No notifications */}
                {totalPending === 0 && (
                  <div className="px-4 py-8 text-center">
                    <BellIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No pending notifications</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <button 
                  onClick={handleViewAll}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <span>View all P2P Transfers</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

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
