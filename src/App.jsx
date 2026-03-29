import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import PendingRecords from './pages/PendingRecords';
import LeavesRecord from './pages/LeavesRecord';
import SectionManagement from './pages/SectionManagement';
import Calendar from './pages/Calendar';
import RiceIndent from './pages/RiceIndent';
import Schemes from './pages/Schemes';
import Scholarship from './pages/Scholarship';
import BankConfirmations from './pages/BankConfirmations';
import Jayantis from './pages/Jayantis';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pending-records" element={<PendingRecords />} />
          <Route path="/leaves-record" element={<LeavesRecord />} />
          <Route path="/section-management" element={<SectionManagement />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/scholarships" element={<Scholarship />} />
          <Route path="/rice-indent" element={<RiceIndent />} />
          <Route path="/bank-confirmations" element={<BankConfirmations />} />
          <Route path="/jayantis" element={<Jayantis />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
