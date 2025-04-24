import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHospital, FaUserMd, FaUsers, FaChartBar, FaHistory, FaBars, FaTimes } from 'react-icons/fa';
import { theme } from '../../styles/theme';

interface NavigationProps {
  activeTab: 'dashboard' | 'programs' | 'clients' | 'audit';
  onTabChange: (tab: 'dashboard' | 'programs' | 'clients' | 'audit') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
    { id: 'programs', label: 'Health Programs', icon: FaUserMd },
    { id: 'clients', label: 'Clients', icon: FaUsers },
    { id: 'audit', label: 'Audit Logs', icon: FaHistory }
  ] as const;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center py-4">
          <div className="flex items-center">
            <FaHospital className="text-3xl mr-3" style={{ color: theme.colors.primary.main }} />
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>
              Health Information System
            </h1>
          </div>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-4 py-2 rounded flex items-center ${
                  activeTab === item.id
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: activeTab === item.id ? theme.colors.primary.main : 'transparent',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="mr-2" />
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center py-4">
          <div className="flex items-center">
            <FaHospital className="text-2xl mr-2" style={{ color: theme.colors.primary.main }} />
            <h1 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
              Health System
            </h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="py-2 space-y-1">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 rounded flex items-center ${
                      activeTab === item.id
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: activeTab === item.id ? theme.colors.primary.main : 'transparent',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="mr-2" />
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation; 