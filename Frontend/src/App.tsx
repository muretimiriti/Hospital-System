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

/**
 * ProtectedRoute Component
 * A wrapper component that checks for authentication token
 * Redirects to login if no token is found
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

/**
 * PublicRoute Component
 * A wrapper component for public routes (login/register)
 * Redirects to dashboard if user is already authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

/**
 * AppRoutes Component
 * Defines all application routes and their protection status
 * Uses React Router for navigation
 */
const AppRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Public routes */}
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
      
      {/* Protected routes */}
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
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

/**
 * Main App Component
 * Sets up the application structure with routing and global providers
 * Includes navigation, main content area, and footer
 */
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
