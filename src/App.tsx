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
          <Route path="/settings" element={<GeneralSettings />} />
          <Route path="/settings/general" element={<GeneralSettings />} />
          <Route path="/settings/sync" element={<ComponentLibrary />} />
          <Route path="/company-details" element={<CompanyDetails />} />
          <Route path="/integrations/ingram-micro" element={<IngramMicroCredentials />} />
          <Route path="/integrations/td-synnex" element={<TDSynnexCredentials />} />
          <Route path="/settings/vendor-integrations" element={<VendorIntegrations />} />
          <Route path="/settings/vendor-integrations/microsoft" element={<MicrosoftOnboarding />} />
          {/* Placeholder routes for other navigation items */}
          <Route path="/operations" element={<MarketplaceHome />} />
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
