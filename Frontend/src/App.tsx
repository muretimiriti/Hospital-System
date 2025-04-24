import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HealthPrograms } from './components/health-programs/HealthPrograms';
import Clients from './components/clients/Clients';
import { ClientProfile } from './components/clients/ClientProfile';
import Dashboard from './components/Dashboard';
import AuditLogs from './components/AuditLogs';
import Navigation from './components/common/Navigation';
import { NotificationProvider } from './contexts/NotificationContext';
import { theme } from './styles/theme';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'programs' | 'clients' | 'audit'>('dashboard');
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
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.colors.background.default }}>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
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
            ) : activeTab === 'audit' ? (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AuditLogs />
              </motion.div>
            ) : selectedClientId ? (
              <motion.div
                key="client-profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-center mb-4 md:mb-8">
                  <motion.button
                    onClick={handleBackToList}
                    className="text-blue-500 hover:text-blue-600 flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="md:hidden">Back</span>
                    <span className="hidden md:inline">Back to Client List</span>
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
