import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  Users,
  Building2,
  Download,
  Settings,
  Puzzle,
  Clock,
  TrendingDown,
  TrendingUp,
  BarChart3,
  ChevronRight,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';

// Quick Link Item Component
const QuickLinkItem = ({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) => (
  <div className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded px-2 -mx-2">
    <div className={`p-2 rounded ${color}`}>
      <Icon className="h-4 w-4 text-white" />
    </div>
    <span className="text-sm text-gray-700">{label}</span>
  </div>
);

// Metric Card Component
const MetricCard = ({
  value,
  label,
  change,
  isPositive,
}: {
  value: string;
  label: string;
  change: string;
  isPositive: boolean;
}) => (
  <div className="text-center">
    <div className="text-3xl font-light text-gray-900">{value}</div>
    <div className="text-xs text-gray-500 mt-1">{label}</div>
    <div className={`flex items-center justify-center text-xs mt-1 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
      {isPositive ? (
        <TrendingUp className="h-3 w-3 mr-1" />
      ) : (
        <TrendingDown className="h-3 w-3 mr-1" />
      )}
      {change}
    </div>
  </div>
);

// Vendor Item Component
const VendorItem = ({
  name,
  url,
  logo,
  buttonText,
}: {
  name: string;
  url: string;
  logo: React.ReactNode;
  buttonText: string;
}) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center space-x-3">
      {logo}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">{name}</span>
          <span className="h-2 w-2 bg-green-500 rounded-full"></span>
        </div>
        <a href="#" className="text-xs text-blue-600 hover:underline">
          {url}
        </a>
      </div>
    </div>
    <button className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50">
      {buttonText}
    </button>
  </div>
);

export const MarketplaceHome = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-normal text-gray-900">Good morning, Neil!</h1>
          <button className="flex items-center text-sm text-gray-600 border border-gray-300 rounded px-3 py-1.5 hover:bg-white">
            View Store
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-4 space-y-6">
            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Quick links</h2>
              <div className="space-y-1">
                <QuickLinkItem icon={Package} label="Create a Product" color="bg-red-500" />
                <QuickLinkItem icon={Layers} label="Create Product Groups" color="bg-red-500" />
                <QuickLinkItem icon={Users} label="Manage Users" color="bg-green-500" />
                <QuickLinkItem icon={Building2} label="Manage Companies" color="bg-green-500" />
                <QuickLinkItem icon={Download} label="Download Reports" color="bg-green-500" />
                <QuickLinkItem icon={Settings} label="Marketplace Settings" color="bg-purple-500" />
                <QuickLinkItem icon={Puzzle} label="Marketplace Functionality" color="bg-green-500" />
                <QuickLinkItem icon={Clock} label="Pending Events" color="bg-pink-500" />
              </div>
            </div>

            {/* Import Products */}
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Import products and start selling
              </h2>
              <div className="divide-y divide-gray-100">
                <VendorItem
                  name="Firstbase"
                  url="firstbase.com"
                  logo={
                    <div className="h-10 w-10 bg-cyan-100 rounded flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-cyan-600" fill="currentColor">
                        <path d="M13 3L4 14h7v7l9-11h-7V3z" />
                      </svg>
                    </div>
                  }
                  buttonText="View Catalog"
                />
                <VendorItem
                  name="TD SYNNEX"
                  url="tdsynnex.com"
                  logo={
                    <div className="h-10 w-10 bg-teal-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">TD</span>
                    </div>
                  }
                  buttonText="Edit Credentials"
                />
                <VendorItem
                  name="Ingram Micro"
                  url="ingrammicro.com"
                  logo={
                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-600 text-[8px] font-bold">INGRAM</span>
                    </div>
                  }
                  buttonText="Edit Credentials"
                />
              </div>
              <a href="#" className="flex items-center text-sm text-blue-600 mt-4 hover:underline">
                Go to Catalog
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>

            {/* Knowledge Center */}
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Knowledge center</h2>
              <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded px-2 -mx-2">
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-4 bg-blue-600 rounded"></div>
                  <span className="text-sm text-gray-700">Training</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-8 space-y-6">
            {/* Marketplace Tasks */}
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Marketplace tasks</h2>
              <div className="flex items-start space-x-4">
                <div className="text-4xl font-light text-gray-900">786</div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Customer Purchases</div>
                  <p className="text-sm text-gray-700">
                    Review customer purchases • There are{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      786 customer purchases
                    </a>{' '}
                    pending your review.
                  </p>
                  <a href="#" className="text-sm text-green-600 font-medium hover:underline mt-1 inline-block">
                    Review Purchases
                  </a>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-gray-900">Performance overview</h2>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <select className="text-sm text-gray-600 border-none bg-transparent cursor-pointer">
                    <option>Trailing Week</option>
                    <option>Trailing Month</option>
                    <option>Trailing Year</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6">
                <MetricCard value="$0" label="Gross Revenue" change="-100%" isPositive={false} />
                <MetricCard value="$0" label="Net Revenue" change="-100%" isPositive={false} />
                <MetricCard value="131" label="Total Orders" change="-10.3%" isPositive={false} />
                <MetricCard value="18" label="Total Signups" change="12.5%" isPositive={true} />
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-gray-900">Revenue</h2>
                <select className="text-sm text-gray-600 border-none bg-transparent cursor-pointer">
                  <option>Trailing Week</option>
                  <option>Trailing Month</option>
                  <option>Trailing Year</option>
                </select>
              </div>
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <BarChart3 className="h-12 w-12 mb-4" />
                <p className="text-base font-medium text-gray-600">There is no data to display here.</p>
                <p className="text-sm text-gray-500">
                  When your marketplace has revenue, it will appear here.
                </p>
              </div>
              <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-100">
                <a href="#" className="flex items-center text-sm text-blue-600 hover:underline">
                  View Invoices
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
                <a href="#" className="flex items-center text-sm text-blue-600 hover:underline">
                  View Payments
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Sign ups and Orders */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900">Sign ups</h2>
                  <select className="text-sm text-gray-600 border-none bg-transparent cursor-pointer">
                    <option>Trailing Week</option>
                  </select>
                </div>
                <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                  Chart placeholder
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900">Orders</h2>
                  <select className="text-sm text-gray-600 border-none bg-transparent cursor-pointer">
                    <option>Trailing Week</option>
                  </select>
                </div>
                <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                  Chart placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700">
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

