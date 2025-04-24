import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHospital, FaUserMd, FaUsers, FaChartBar } from 'react-icons/fa';
import { HealthPrograms } from './components/health-programs/HealthPrograms';
import { Clients } from './components/clients/Clients';
import { ClientProfile } from './components/clients/ClientProfile';
import Dashboard from './components/Dashboard';
import { NotificationProvider } from './contexts/NotificationContext';
import { theme } from './styles/theme';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'programs' | 'clients'>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  // Handle back to client list
  const handleBackToList = () => {
    setSelectedClientId(null);
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.default }}>
        {/* Navigation */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FaHospital className="text-3xl mr-3" style={{ color: theme.colors.primary.main }} />
                <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>
                  Health Information System
                </h1>
              </div>
              <div className="flex space-x-4">
                <motion.button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setSelectedClientId(null);
                  }}
                  className={`px-4 py-2 rounded flex items-center ${
                    activeTab === 'dashboard'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: activeTab === 'dashboard' ? theme.colors.primary.main : 'transparent',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaChartBar className="mr-2" />
                  Dashboard
                </motion.button>
                <motion.button
                  onClick={() => {
                    setActiveTab('programs');
                    setSelectedClientId(null);
                  }}
                  className={`px-4 py-2 rounded flex items-center ${
                    activeTab === 'programs'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: activeTab === 'programs' ? theme.colors.primary.main : 'transparent',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaUserMd className="mr-2" />
                  Health Programs
                </motion.button>
                <motion.button
                  onClick={() => {
                    setActiveTab('clients');
                    setSelectedClientId(null);
                  }}
                  className={`px-4 py-2 rounded flex items-center ${
                    activeTab === 'clients'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: activeTab === 'clients' ? theme.colors.primary.main : 'transparent',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaUsers className="mr-2" />
                  Clients
                </motion.button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Dashboard />
              </motion.div>
            ) : activeTab === 'programs' ? (
              <motion.div
                key="programs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HealthPrograms />
              </motion.div>
            ) : selectedClientId ? (
              <motion.div
                key="client-profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <motion.button
                    onClick={handleBackToList}
                    className="text-blue-500 hover:text-blue-600 flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaUsers className="mr-2" />
                    Back to Client List
                  </motion.button>
                </div>
                <ClientProfile clientId={selectedClientId} />
              </motion.div>
            ) : (
              <motion.div
                key="clients"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Clients onClientSelect={handleClientSelect} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-inner mt-auto">
          <div className="container mx-auto px-4 py-4">
            <p className="text-center text-sm" style={{ color: theme.colors.text.secondary }}>
              © {new Date().getFullYear()} Health Information System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </NotificationProvider>
  );
}

export default App;
