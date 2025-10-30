import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const CompanySummaryCard = () => {
  // Mock data from Partner Center Insights
  const insights = {
    totalSeats: 350,
    activeUsers: 245,
    subscriptions: 8,
    monthlyRevenue: 12450,
    totalSpent: 149400, // Annual calculation
    unpaidInvoices: 0,
    trends: {
      seats: 5.2,
      activeUsers: -2.3,
      revenue: 8.7
    }
  };

  const usagePercentage = ((insights.activeUsers / insights.totalSeats) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-t shadow mb-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-20 h-20 border border-gray-300 rounded mr-4 bg-white text-gray-400 text-5xl">
            {/* Company Icon Placeholder */}
            <span>🏢</span>
          </div>
          <div>
            <div className="flex items-center text-lg font-semibold text-gray-700">
              Company
              <span className="ml-3 text-sm flex items-center text-green-700 font-medium">
                <span className="w-3 h-3 bg-green-400 border border-green-700 rounded-full mr-2"></span>
                Enabled
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mt-1 mb-0">AppDirect Demonstration 5</h1>
            <div className="flex items-center space-x-3 mt-2">
              <div className="text-xs text-gray-600">
                <span className="font-medium">{insights.subscriptions}</span> Active Subscriptions
              </div>
              <div className="text-xs text-gray-600">•</div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">{usagePercentage}%</span> License Utilization
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex mt-6 divide-x divide-gray-200 bg-gray-50 rounded-b shadow-inner">
        {[
          { 
            label: 'Total Seats', 
            value: insights.totalSeats,
            trend: insights.trends.seats,
            info: 'Microsoft 365 licenses'
          },
          { 
            label: 'Active Users (28d)', 
            value: insights.activeUsers,
            trend: insights.trends.activeUsers,
            info: 'Users actively using licenses'
          },
          { 
            label: 'Monthly Revenue', 
            value: `$${insights.monthlyRevenue.toLocaleString()}`,
            trend: insights.trends.revenue,
            info: 'Recurring monthly revenue'
          },
          { 
            label: 'Total Spent (12m)', 
            value: `$${insights.totalSpent.toLocaleString()}`,
            info: 'Last 12 months'
          },
          { 
            label: 'Active Subscriptions', 
            value: insights.subscriptions,
            info: 'Microsoft products'
          },
          { 
            label: 'Unpaid Invoices', 
            value: insights.unpaidInvoices,
            info: 'Outstanding invoices'
          },
        ].map((item) => (
          <div key={item.label} className="flex-1 text-center py-4 group relative">
            <div className="flex items-center justify-center space-x-1">
              <div className={`text-xl font-bold ${
                item.label === 'Active Users (28d)' && insights.trends.activeUsers < 0 ? 'text-yellow-600' :
                item.label === 'Unpaid Invoices' && insights.unpaidInvoices > 0 ? 'text-red-600' :
                'text-gray-700'
              }`}>
                {item.value}
              </div>
              {item.trend !== undefined && (
                <div className="flex items-center">
                  {item.trend > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : item.trend < 0 ? (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  ) : null}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">{item.label}</div>
            {item.trend !== undefined && (
              <div className={`text-xs font-medium mt-0.5 ${
                item.trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.trend > 0 ? '+' : ''}{item.trend}%
              </div>
            )}
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {item.info}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 