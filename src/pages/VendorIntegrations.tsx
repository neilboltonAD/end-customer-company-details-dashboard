import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { HelpCircle } from 'lucide-react';

// Vendor data
const vendors = [
  {
    id: 'google',
    name: 'Google',
    logo: (
      <svg viewBox="0 0 24 24" className="h-8 w-8">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: (
      <svg viewBox="0 0 24 24" className="h-8 w-8">
        <path fill="#F25022" d="M1 1h10v10H1z"/>
        <path fill="#00A4EF" d="M1 13h10v10H1z"/>
        <path fill="#7FBA00" d="M13 1h10v10H13z"/>
        <path fill="#FFB900" d="M13 13h10v10H13z"/>
      </svg>
    ),
    path: '/settings/vendor-integrations/microsoft',
  },
  {
    id: 'adobe',
    name: 'Adobe',
    logo: (
      <svg viewBox="0 0 24 24" className="h-8 w-8">
        <path fill="#FF0000" d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425h-3.71zm.893-17.628h5.725L14.859 22H11.19L7.316 11.459l-3.892 10.54H0L9.585 4.996h5.274z"/>
      </svg>
    ),
  },
  {
    id: 'cisco',
    name: 'Cisco',
    logo: (
      <div className="h-8 w-12 flex items-center justify-center">
        <svg viewBox="0 0 100 40" className="h-6 w-full">
          <g fill="#049fd9">
            <rect x="0" y="8" width="4" height="24" rx="2"/>
            <rect x="12" y="4" width="4" height="32" rx="2"/>
            <rect x="24" y="0" width="4" height="40" rx="2"/>
            <rect x="36" y="4" width="4" height="32" rx="2"/>
            <rect x="48" y="8" width="4" height="24" rx="2"/>
            <rect x="60" y="4" width="4" height="32" rx="2"/>
            <rect x="72" y="0" width="4" height="40" rx="2"/>
            <rect x="84" y="4" width="4" height="32" rx="2"/>
            <rect x="96" y="8" width="4" height="24" rx="2"/>
          </g>
        </svg>
      </div>
    ),
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    logo: (
      <svg viewBox="0 0 24 24" className="h-8 w-8">
        <path fill="#0061FF" d="M6 2L0 6l6 4-6 4 6 4 6-4-6-4 6-4-6-4zm12 0l-6 4 6 4-6 4 6 4 6-4-6-4 6-4-6-4zM6 16l6 4 6-4-6-4-6 4z"/>
      </svg>
    ),
  },
  {
    id: 'zoom',
    name: 'Zoom',
    logo: (
      <div className="h-8 w-8 bg-[#2D8CFF] rounded flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white">
          <path d="M4.5 7.5v9h10.5l4.5 3v-12l-4.5 3v-3h-10.5z"/>
        </svg>
      </div>
    ),
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    logo: (
      <div className="h-8 w-12 flex items-center justify-center bg-gray-900 rounded px-1">
        <span className="text-[10px] font-bold text-white tracking-tight">aws</span>
      </div>
    ),
  },
  {
    id: 'td-synnex',
    name: 'TD SYNNEX',
    logo: (
      <div className="h-10 w-10 bg-teal-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">TD</span>
      </div>
    ),
    path: '/integrations/td-synnex',
  },
  {
    id: 'ingram-micro',
    name: 'Ingram Micro',
    logo: (
      <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center border border-gray-300">
        <span className="text-gray-600 text-[8px] font-bold">INGRAM</span>
      </div>
    ),
    path: '/integrations/ingram-micro',
  },
  {
    id: 'firstbase',
    name: 'Firstbase',
    logo: (
      <div className="h-10 w-10 bg-cyan-100 rounded flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-cyan-600" fill="currentColor">
          <path d="M13 3L4 14h7v7l9-11h-7V3z" />
        </svg>
      </div>
    ),
    path: '/integrations/firstbase',
  },
];

// Vendor type
type Vendor = {
  id: string;
  name: string;
  logo: React.ReactNode;
  path?: string;
};

// Vendor Row Component
const VendorRow = ({
  name,
  logo,
  onConfigure,
}: {
  name: string;
  logo: React.ReactNode;
  onConfigure: () => void;
}) => (
  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 flex items-center justify-center">
        {logo}
      </div>
      <span className="text-base font-medium text-gray-900">{name}</span>
    </div>
    <button
      onClick={onConfigure}
      className="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded hover:bg-teal-800 transition-colors"
    >
      Configure
    </button>
  </div>
);

export const VendorIntegrations = () => {
  const navigate = useNavigate();

  const handleConfigure = (vendor: Vendor) => {
    if (vendor.path) {
      navigate(vendor.path);
    } else {
      // For vendors without a dedicated page yet, log to console
      console.log(`Configure ${vendor.id}`);
    }
  };

  const handleContactUs = () => {
    window.open('mailto:support@appdirect.com?subject=Vendor Integration Inquiry', '_blank');
  };

  return (
    <PageLayout title="Vendor Integrations">
      <div className="max-w-4xl">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Vendor Integrations</h1>

        {/* Help Banner */}
        <div className="bg-teal-700 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="text-white">
            <p className="font-medium">Need help connecting with these leading software vendors?</p>
            <p className="text-sm text-teal-100 mt-1">
              Reach out to us if you want to partner with any of these vendors below. We can help make introductions.
            </p>
          </div>
          <button
            onClick={handleContactUs}
            className="px-4 py-2 bg-white text-teal-700 font-medium rounded hover:bg-teal-50 transition-colors whitespace-nowrap ml-4"
          >
            Contact Us
          </button>
        </div>

        {/* Vendor List */}
        <div className="space-y-3">
          {(vendors as Vendor[]).map((vendor) => (
            <VendorRow
              key={vendor.id}
              name={vendor.name}
              logo={vendor.logo}
              onConfigure={() => handleConfigure(vendor)}
            />
          ))}
        </div>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 h-10 w-10 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-teal-700">
        <HelpCircle className="h-5 w-5" />
      </button>
    </PageLayout>
  );
};

