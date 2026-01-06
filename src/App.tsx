
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AssetManagement from './pages/AssetManagement';
import Department from './pages/Departments';
import Block from './pages/Blocks';
import Users from './pages/Users';
import Settings from './pages/Settings';
import AccountSettings from './pages/AccountSettings';
import { ThemeProvider } from './component/theme-provider';


const App = () => {

  
  return (
    <ThemeProvider >

     <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/assets" element={<AssetManagement />} />
        <Route path="/departments" element={<Department />} />
        <Route path="/blocks" element={<Block />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/account-settings" element={<AccountSettings />} />
      </Routes>
    </Router>
    </ThemeProvider>

  );
};

export default App;