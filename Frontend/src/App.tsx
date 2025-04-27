import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { HealthPrograms } from './components/health-programs/HealthPrograms';
import Clients from './components/clients/Clients';
import { ClientProfile } from './components/clients/ClientProfile';
import Dashboard from './components/Dashboard';
import AuditLogs from './components/AuditLogs';
import Navigation from './components/common/Navigation';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { NotificationProvider } from './contexts/NotificationContext';
import { theme } from './styles/theme';
import { EnrollmentsPage } from './components/enrollments/EnrollmentsPage';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Public Route component (for login/register)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// AppRoutes component to handle routing
const AppRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/programs" element={
        <ProtectedRoute>
          <HealthPrograms />
        </ProtectedRoute>
      } />
      <Route path="/audit" element={
        <ProtectedRoute>
          <AuditLogs />
        </ProtectedRoute>
      } />
      <Route path="/enrollments" element={
        <ProtectedRoute>
          <EnrollmentsPage />
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute>
          <Clients onClientSelect={(clientId) => navigate(`/clients/${clientId}`)} />
        </ProtectedRoute>
      } />
      <Route path="/clients/:clientId" element={
        <ProtectedRoute>
          <ClientProfile />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <NotificationProvider>
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.colors.background.default }}>
          <Navigation />
          <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
            <AppRoutes />
          </main>
          <footer className="bg-white shadow-inner mt-auto">
            <div className="container mx-auto px-4 py-4">
              <p className="text-center text-sm" style={{ color: theme.colors.text.secondary }}>
                © {new Date().getFullYear()} Health Information System. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </NotificationProvider>
    </Router>
  );
}

export default App;
