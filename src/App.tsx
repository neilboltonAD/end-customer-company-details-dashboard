import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ComponentLibrary } from './pages/ComponentLibrary';
import CompanyDetails from './pages/CompanyDetails';
import { MarketplaceHome } from './pages/MarketplaceHome';
import { ProductCatalog } from './pages/ProductCatalog';

export function App() {
  return (
    <MantineProvider>
      <Notifications position="bottom-right" />
      <Router>
        <Routes>
          <Route path="/home" element={<MarketplaceHome />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/settings" element={<ComponentLibrary />} />
          <Route path="/company-details" element={<CompanyDetails />} />
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
