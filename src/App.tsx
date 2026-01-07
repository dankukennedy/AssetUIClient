
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AssetManagement from './pages/AssetManagement';
import Department from './pages/Departments';
import Block from './pages/Blocks';
import Users from './pages/AuthUsers';
import Settings from './pages/Settings';
import AccountSettings from './pages/AccountSettings';
import { ThemeProvider } from './component/theme-provider';
import ArchivesPage from './pages/Archives';
import Transfers from './pages/Transfers';
import Decommission from './pages/Decommission';
import Disposal from './pages/Disposals';
import AllocationManagement from './pages/Allocation';
import Reports from './pages/Reports';
import { ToastProvider } from './context/ToastContext';
import AssetUsersPage from './pages/AssetUsers';
import AuthUsersPage from './pages/AuthUsers';
import ContactUs from './pages/ContactUs';
import About from './pages/About';
import UserManual from './pages/UserManual';
import AuditPage from './pages/Audit';



const App = () => {

  
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<AssetManagement />} />
            <Route path="/departments" element={<Department />} />
            <Route path="/blocks" element={<Block />} />
            <Route path="/assetUsers" element={<AssetUsersPage />} />
            <Route path="/authUsers" element={<AuthUsersPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/decommission" element={<Decommission />} />
            <Route path="/disposal" element={<Disposal />} />
            <Route path="/allocation" element={<AllocationManagement />} />
            <Route path="/allocation" element={<AllocationManagement />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<About />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/manual" element={<UserManual />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/allocations" element={<AllocationManagement />} />
            <Route path="/archives" element={<ArchivesPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;