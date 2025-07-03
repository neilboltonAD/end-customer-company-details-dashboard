import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ComponentLibrary } from './pages/ComponentLibrary';
import CompanyDetails from './pages/CompanyDetails';

export function App() {
  return (
    <MantineProvider>
      <Notifications position="bottom-right" />
      <Router>
        <Routes>
          <Route path="/settings" element={<ComponentLibrary />} />
          <Route path="/company-details" element={<CompanyDetails />} />
          <Route path="*" element={<Navigate to="/company-details" replace />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
} 