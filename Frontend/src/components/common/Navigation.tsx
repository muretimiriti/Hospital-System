import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHospital, FaUserMd, FaUsers, FaChartBar, FaHistory, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar, path: '/dashboard' },
    { id: 'programs', label: 'Health Programs', icon: FaUserMd, path: '/programs' },
    { id: 'clients', label: 'Clients', icon: FaUsers, path: '/clients' },
    { id: 'audit', label: 'Audit Logs', icon: FaHistory, path: '/audit' }
  ] as const;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Don't render navigation if user is not logged in
  if (!token) {
    return null;
  }

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
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`px-4 py-2 rounded flex items-center ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: isActive(item.path) ? theme.colors.primary.main : 'transparent',
                }}
              >
                <item.icon className="mr-2" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded flex items-center text-gray-700 hover:bg-gray-100"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
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
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full px-4 py-2 rounded flex items-center ${
                      isActive(item.path)
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: isActive(item.path) ? theme.colors.primary.main : 'transparent',
                    }}
                  >
                    <item.icon className="mr-2" />
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded flex items-center text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation; 