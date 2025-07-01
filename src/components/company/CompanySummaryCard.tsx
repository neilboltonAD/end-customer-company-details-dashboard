import React from 'react';

export const CompanySummaryCard = () => (
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
        </div>
      </div>
    </div>
    <div className="flex mt-6 divide-x divide-gray-200 bg-gray-50 rounded-b shadow-inner">
      {[
        { label: 'Free Trials', value: 0 },
        { label: 'Expired Free Trials', value: 0 },
        { label: 'Purchased Products', value: 0 },
        { label: 'Suspended Products', value: 0 },
        { label: 'Unpaid Invoices', value: 0 },
        { label: 'Total Spent', value: '$0.00' },
      ].map((item, idx) => (
        <div key={item.label} className="flex-1 text-center py-4">
          <div className="text-xl font-bold text-gray-700">{item.value}</div>
          <div className="text-xs text-gray-500 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  </div>
); 