import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ComponentLibrary } from './pages/ComponentLibrary';
import CompanyDetails from './pages/CompanyDetails';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/settings" element={<ComponentLibrary />} />
        <Route path="/company-details" element={<CompanyDetails />} />
        <Route path="*" element={<Navigate to="/company-details" replace />} />
      </Routes>
    </Router>
  );
} 