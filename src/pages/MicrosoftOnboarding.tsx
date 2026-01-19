import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { getPartnerCenterHealth, getPartnerCenterStatus } from '../api/partnerCenter';
import { PartnerCenterConnectorModal } from '../components/microsoft/PartnerCenterConnectorModal';

export const MicrosoftOnboarding = () => {
  const navigate = useNavigate();

  const [connectorModalOpen, setConnectorModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const handleAuthorize = () => {
    setConnectorModalOpen(true);
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const status = await getPartnerCenterStatus();
        const health = await getPartnerCenterHealth();
        if (!cancelled) setIsConnected(Boolean(status.ok && health.ok));
      } catch {
        if (!cancelled) setIsConnected(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddResellerAccount = () => {
    // Handle adding a new reseller account
    console.log('Add Reseller Account clicked');
  };

  return (
    <PageLayout title="Microsoft Onboarding" activeItem="Vendor Integrations">
      <div className="max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/settings/vendor-integrations')}
          className="flex items-center text-sm text-teal-700 hover:text-teal-800 mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Microsoft Onboarding</h1>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Use this settings page to configure your marketplace with Microsoft. When you have authorized with Microsoft, and configured the
          countries where you are licensed to sell through the CSP program, you will be able to publish Microsoft products to your marketplace
          and transact with customers. For more information, see{' '}
          <a 
            href="https://docs.microsoft.com/partner-center" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-teal-700 hover:text-teal-800 hover:underline"
          >
            Integrate your marketplace with Microsoft
          </a>
          .
        </p>

        {/* Microsoft Authorization Card */}
        <div className="border border-gray-200 rounded mb-8">
          {/* Card Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              MICROSOFT AUTHORIZATION
            </h2>
          </div>

          {/* Card Content */}
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              To start the process for onboarding Microsoft products, select "Authorize" below. When you click the button you will be redirected
              to a Microsoft website to authorize the marketplace to connect with Microsoft to transact on your behalf.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAuthorize}
                className="px-4 py-2 bg-teal-700 text-white text-sm font-medium rounded hover:bg-teal-800 transition-colors"
              >
                Authorize
              </button>
              {isConnected && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
                  Connected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Add Reseller Account Section */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          If you have multiple Microsoft reseller tenants you can select the "Add Reseller Account" button below to create a new onboarding form
          for this tenant. This will be used to configure and authorize the marketplace to connect with the additional Microsoft reseller tenant. The
          countries you add to this account should reflect the regions that the new reseller tenant can operate in.
        </p>

        <button
          onClick={handleAddResellerAccount}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
        >
          Add Reseller Account
        </button>
      </div>

      <PartnerCenterConnectorModal
        opened={connectorModalOpen}
        onClose={() => setConnectorModalOpen(false)}
        onStatusChange={(s) => setIsConnected(s === 'connected')}
      />
    </PageLayout>
  );
};

