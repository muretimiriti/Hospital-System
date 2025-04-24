import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { theme } from '../../styles/theme';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: FaCheck,
          bgColor: theme.colors.success.light,
          textColor: theme.colors.success.dark,
          borderColor: theme.colors.success.main,
        };
      case 'error':
        return {
          icon: FaExclamationTriangle,
          bgColor: theme.colors.error.light,
          textColor: theme.colors.error.dark,
          borderColor: theme.colors.error.main,
        };
      case 'info':
        return {
          icon: FaInfoCircle,
          bgColor: theme.colors.primary.light,
          textColor: theme.colors.primary.dark,
          borderColor: theme.colors.primary.main,
        };
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50"
        >
          <div
            className="flex items-center p-4 rounded-lg shadow-lg"
            style={{
              backgroundColor: styles.bgColor,
              color: styles.textColor,
              borderLeft: `4px solid ${styles.borderColor}`,
            }}
          >
            <Icon className="h-5 w-5 mr-3" />
            <p className="text-sm font-medium">{message}</p>
            <button
              onClick={onClose}
              className="ml-4 text-current hover:opacity-75"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 