import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ComponentLibrary } from './pages/ComponentLibrary';
import CompanyDetails from './pages/CompanyDetails';
import { MarketplaceHome } from './pages/MarketplaceHome';
import { ProductCatalog } from './pages/ProductCatalog';
import { IngramMicroCredentials } from './pages/IngramMicroCredentials';
import { TDSynnexCredentials } from './pages/TDSynnexCredentials';
import { VendorIntegrations } from './pages/VendorIntegrations';
import { MicrosoftOnboarding } from './pages/MicrosoftOnboarding';
import { GeneralSettings } from './pages/GeneralSettings';
import { StagingCatalog } from './pages/StagingCatalog';
import { FindProducts } from './pages/FindProducts';
import { FirstbaseCredentials } from './pages/FirstbaseCredentials';
import { NetworkProducts } from './pages/NetworkProducts';
import { ImportSettings } from './pages/ImportSettings';
import { MicrosoftMarketplaceCredentials } from './pages/MicrosoftMarketplaceCredentials';
import { OperationsUsers } from './pages/OperationsUsers';
import { OperationsCompanies } from './pages/OperationsCompanies';
import { OperationsCompanyDetails } from './pages/OperationsCompanyDetails';
import { OperationsMicrosoft } from './pages/OperationsMicrosoft';
import { OperationsP2PTransfers } from './pages/OperationsP2PTransfers';
import { PriceSyncTool } from './pages/PriceSyncTool';

export function App() {
  return (
    <MantineProvider>
      <Notifications position="bottom-right" />
      <Router>
        <Routes>
          <Route path="/home" element={<MarketplaceHome />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/products/staging" element={<StagingCatalog />} />
          <Route path="/products/find" element={<FindProducts />} />
          <Route path="/products/network" element={<NetworkProducts />} />
          <Route path="/products/import-settings" element={<ImportSettings />} />
          <Route path="/products/price-sync" element={<PriceSyncTool />} />
          <Route path="/settings" element={<GeneralSettings />} />
          <Route path="/settings/general" element={<GeneralSettings />} />
          <Route path="/settings/sync" element={<ComponentLibrary />} />
          <Route path="/company-details" element={<CompanyDetails />} />
          <Route path="/operations" element={<OperationsUsers />} />
          <Route path="/operations/companies" element={<OperationsCompanies />} />
          <Route path="/operations/companies/:companyName" element={<OperationsCompanyDetails />} />
          <Route path="/operations/microsoft" element={<Navigate to="/operations/microsoft/reseller" replace />} />
          <Route path="/operations/microsoft/reseller" element={<OperationsMicrosoft />} />
          <Route path="/operations/microsoft/p2p" element={<OperationsP2PTransfers />} />
          <Route path="/integrations/ingram-micro" element={<IngramMicroCredentials />} />
          <Route path="/integrations/td-synnex" element={<TDSynnexCredentials />} />
          <Route path="/integrations/firstbase" element={<FirstbaseCredentials />} />
          <Route path="/integrations/microsoft-marketplace" element={<MicrosoftMarketplaceCredentials />} />
          <Route path="/settings/vendor-integrations" element={<VendorIntegrations />} />
          <Route path="/settings/vendor-integrations/microsoft" element={<MicrosoftOnboarding />} />
          <Route path="/reports" element={<MarketplaceHome />} />
          <Route path="/themes" element={<MarketplaceHome />} />
          <Route path="/programs" element={<MarketplaceHome />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}
