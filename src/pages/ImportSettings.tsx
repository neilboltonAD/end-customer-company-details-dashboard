import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';

// Sidebar Section Component
const SidebarSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-1">
    <div className="bg-gray-100 border-y border-gray-200 px-4 py-2">
      <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
        {title}
      </h3>
    </div>
    <div className="py-1">{children}</div>
  </div>
);

// Sidebar Item Component
const SidebarItem = ({
  label,
  active = false,
  hasArrow = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  hasArrow?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center ${
      active
        ? 'bg-teal-700 text-white font-medium'
        : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    {hasArrow && <span className="mr-1 text-xs">▶</span>}
    {label}
  </button>
);

// Distributor settings type
interface DistributorSettings {
  id: string;
  name: string;
  markupPercentage: number;
}

const defaultDistributorSettings: DistributorSettings[] = [
  { id: 'firstbase', name: 'Firstbase', markupPercentage: 12 },
  { id: 'tdsynnex', name: 'TD SYNNEX', markupPercentage: 15 },
  { id: 'ingrammicro', name: 'Ingram Micro', markupPercentage: 18 },
  { id: 'microsoftmarketplace', name: 'Microsoft Marketplace', markupPercentage: 20 },
];

export const ImportSettings = () => {
  const navigate = useNavigate();
  const [selectedDistributor, setSelectedDistributor] = useState('tdsynnex');
  const [distributorSettings, setDistributorSettings] = useState<DistributorSettings[]>(
    defaultDistributorSettings
  );
  const [hasChanges, setHasChanges] = useState(false);

  const currentSettings = distributorSettings.find(d => d.id === selectedDistributor);

  const handleMarkupChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setDistributorSettings(prev =>
      prev.map(d =>
        d.id === selectedDistributor
          ? { ...d, markupPercentage: Math.min(100, Math.max(0, numValue)) }
          : d
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setHasChanges(false);
    alert(`Settings saved for ${currentSettings?.name}!\nMarkup: ${currentSettings?.markupPercentage}%`);
  };

  const handleReset = () => {
    const defaultSetting = defaultDistributorSettings.find(d => d.id === selectedDistributor);
    if (defaultSetting) {
      setDistributorSettings(prev =>
        prev.map(d =>
          d.id === selectedDistributor
            ? { ...d, markupPercentage: defaultSetting.markupPercentage }
            : d
        )
      );
      setHasChanges(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white min-h-[calc(100vh-56px)] border-r border-gray-200">
          <SidebarSection title="IMPORT PRODUCTS">
            <SidebarItem
              label="Find Products"
              hasArrow
              onClick={() => navigate('/products/find')}
            />
            <SidebarItem label="Product Imports" />
            <SidebarItem label="Settings" active />
          </SidebarSection>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
          <p className="text-sm text-gray-600 mb-8">
            Select a distributor to view or edit settings. Changes will apply to future imports for the distributor and company.
          </p>

          {/* Distributor Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> Distributor
            </label>
            <select
              value={selectedDistributor}
              onChange={(e) => {
                setSelectedDistributor(e.target.value);
                setHasChanges(false);
              }}
              className="w-80 px-3 py-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {distributorSettings.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.name}
                </option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 mb-8" />

          {/* Markup Fee Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Markup Fee</h2>
            <p className="text-sm text-gray-600 mb-6">
              A markup fee applies to the products selected for publishing.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Markup fee for physical products
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={currentSettings?.markupPercentage || 0}
                  onChange={(e) => handleMarkupChange(e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-l text-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r text-gray-600">
                  %
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-teal-600 text-white text-sm font-medium rounded hover:bg-teal-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleReset}
                disabled={!hasChanges}
                className="px-6 py-2 bg-gray-200 text-gray-600 text-sm font-medium rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Quick View of All Distributor Markups */}
          <hr className="border-gray-200 mb-8" />
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">All Distributor Markups</h2>
            <p className="text-sm text-gray-600 mb-4">
              Quick overview of markup percentages for all configured distributors.
            </p>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distributor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Markup %
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {distributorSettings.map((dist) => {
                    const defaultMarkup = defaultDistributorSettings.find(d => d.id === dist.id)?.markupPercentage;
                    const isModified = dist.markupPercentage !== defaultMarkup;
                    
                    return (
                      <tr 
                        key={dist.id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedDistributor === dist.id ? 'bg-teal-50' : ''
                        }`}
                        onClick={() => {
                          setSelectedDistributor(dist.id);
                          setHasChanges(false);
                        }}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {dist.name}
                          {selectedDistributor === dist.id && (
                            <span className="ml-2 text-xs text-teal-600">(selected)</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {dist.markupPercentage}%
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {isModified ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Modified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Default
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

