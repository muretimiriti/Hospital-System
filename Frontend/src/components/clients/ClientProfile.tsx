import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCalendarAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUserMd,FaExclamationTriangle } from 'react-icons/fa';
import { ClientWithPrograms } from '../../types/client';
import { EnrollmentWithDetails } from '../../types/enrollment';
import { clientService } from '../../services/clientService';
import { enrollmentService } from '../../services/enrollmentService';
import { EnrollmentForm } from '../enrollments/EnrollmentForm';
import { theme } from '../../styles/theme';

interface ClientProfileProps {
  clientId: string;
}

export const ClientProfile: React.FC<ClientProfileProps> = ({ clientId }) => {
  const [client, setClient] = useState<ClientWithPrograms | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);

  // Fetch client and enrollment data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientData, enrollmentData] = await Promise.all([
          clientService.getClientById(clientId),
          enrollmentService.getClientEnrollments(clientId)
        ]);
        setClient(clientData);
        setEnrollments(enrollmentData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch client data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  // Handle enrollment status update
  const handleStatusUpdate = async (enrollmentId: string, newStatus: 'active' | 'completed' | 'cancelled') => {
    try {
      await enrollmentService.updateEnrollment(enrollmentId, { status: newStatus });
      setEnrollments(enrollments.map(enrollment => 
        enrollment.id === enrollmentId 
          ? { ...enrollment, status: newStatus }
          : enrollment
      ));
    } catch (err) {
      setError('Failed to update enrollment status');
      console.error(err);
    }
  };

  // Handle enrollment creation
  const handleEnrollmentCreated = () => {
    setShowEnrollmentForm(false);
    // Refresh enrollment data
    enrollmentService.getClientEnrollments(clientId).then(setEnrollments);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
          style={{ color: theme.colors.primary.main }}
        >
          ⏳
        </motion.div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8"
        style={{ color: theme.colors.error.main }}
      >
        <FaExclamationTriangle className="text-4xl mx-auto mb-4" />
        <p>{error || 'Client not found'}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Client Information */}
      <motion.div
        className="bg-white shadow-lg rounded-lg p-6 mb-8"
        style={{ backgroundColor: theme.colors.background.paper }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaUser className="text-2xl mr-3" style={{ color: theme.colors.primary.main }} />
            <h2 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>
              Client Profile
            </h2>
          </div>
          <motion.button
            onClick={() => setShowEnrollmentForm(!showEnrollmentForm)}
            className="px-4 py-2 rounded text-white flex items-center"
            style={{ backgroundColor: theme.colors.primary.main }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaUserMd className="mr-2" />
            {showEnrollmentForm ? 'Cancel Enrollment' : 'Enroll in Program'}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <FaUser className="mr-3" style={{ color: theme.colors.primary.main }} />
              <div>
                <p className="text-sm" style={{ color: theme.colors.text.secondary }}>Name</p>
                <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                  {client.firstName} {client.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-3" style={{ color: theme.colors.primary.main }} />
              <div>
                <p className="text-sm" style={{ color: theme.colors.text.secondary }}>Date of Birth</p>
                <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                  {new Date(client.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaUser className="mr-3" style={{ color: theme.colors.primary.main }} />
              <div>
                <p className="text-sm" style={{ color: theme.colors.text.secondary }}>Gender</p>
                <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                  {client.gender}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <FaPhone className="mr-3" style={{ color: theme.colors.primary.main }} />
              <div>
                <p className="text-sm" style={{ color: theme.colors.text.secondary }}>Contact</p>
                <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                  {client.contactNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="mr-3" style={{ color: theme.colors.primary.main }} />
              <div>
                <p className="text-sm" style={{ color: theme.colors.text.secondary }}>Email</p>
                <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                  {client.email}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-3" style={{ color: theme.colors.primary.main }} />
              <div>
                <p className="text-sm" style={{ color: theme.colors.text.secondary }}>Address</p>
                <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                  {client.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enrollment Form or Enrolled Programs */}
      <AnimatePresence mode="wait">
        {showEnrollmentForm ? (
          <motion.div
            key="enrollment-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <EnrollmentForm
              clientId={clientId}
              onEnrollmentCreated={handleEnrollmentCreated}
            />
          </motion.div>
        ) : (
          <motion.div
            key="enrollments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white shadow-lg rounded-lg p-6"
            style={{ backgroundColor: theme.colors.background.paper }}
          >
            <div className="flex items-center mb-6">
              <FaUserMd className="text-2xl mr-3" style={{ color: theme.colors.primary.main }} />
              <h3 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
                Enrolled Programs
              </h3>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {enrollments.map((enrollment) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border rounded-lg p-4"
                    style={{ borderColor: theme.colors.primary.light }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold" style={{ color: theme.colors.text.primary }}>
                          {enrollment.program.name}
                        </h4>
                        <p className="mt-1" style={{ color: theme.colors.text.secondary }}>
                          {enrollment.program.description}
                        </p>
                        <p className="text-sm mt-2" style={{ color: theme.colors.text.disabled }}>
                          Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </p>
                        {enrollment.notes && (
                          <p className="text-sm mt-2" style={{ color: theme.colors.text.secondary }}>
                            Notes: {enrollment.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={enrollment.status}
                          onChange={(e) => handleStatusUpdate(enrollment.id, e.target.value as any)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          style={{ borderColor: theme.colors.primary.light }}
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {enrollments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                  style={{ color: theme.colors.text.disabled }}
                >
                  No programs enrolled
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 