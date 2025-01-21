import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import UserDashboard from './components/UserDashboard';
import OfficerDashboard from './components/OfficerDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
