import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaAddressCard, FaCalendarAlt, FaVenusMars, FaPlus, FaTrash } from 'react-icons/fa';
import { Client } from '../../types/client';
import { HealthProgram } from '../../types/healthProgram';
import { EnrollmentWithDetails, EnrollmentStatus } from '../../types/enrollment';

interface ClientProfileProps {
  clientId: string;
  onBack: () => void;
}

export const ClientProfile: React.FC<ClientProfileProps> = ({ clientId, onBack }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  useEffect(() => {
    fetchClientData();
    fetchPrograms();
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client data');
      }

      const data = await response.json();
      setClient(data.data);
      setEnrollments(data.data.enrollments || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load client data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health-programs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }

      const data = await response.json();
      setPrograms(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load programs');
    }
  };

  const handleEnroll = async () => {
    if (!selectedProgram) return;

    try {
      const response = await fetch('http://localhost:5000/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          clientId,
          programId: selectedProgram,
          status: EnrollmentStatus.Active,
          startDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to enroll client in program');
      }

      // Refresh client data to show new enrollment
      fetchClientData();
      setShowEnrollModal(false);
      setSelectedProgram('');
    } catch (err: any) {
      setError(err.message || 'Failed to enroll client in program');
    }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to unenroll client from program');
      }

      // Refresh client data to show updated enrollments
      fetchClientData();
    } catch (err: any) {
      setError(err.message || 'Failed to unenroll client from program');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Client Profile</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="text-blue-500 hover:text-blue-600"
        >
          Back to List
        </motion.button>
      </div>

      {/* Client Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUser className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{client.firstName} {client.lastName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{client.contactNumber}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaAddressCard className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{client.address}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{new Date(client.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaVenusMars className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{client.gender}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Enrollments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Program Enrollments</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowEnrollModal(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <FaPlus className="mr-2" />
            Enroll in Program
          </motion.button>
        </div>

        {enrollments.length === 0 ? (
          <p className="text-gray-500">No program enrollments</p>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <div>
                  <h3 className="font-medium">{enrollment.program.name}</h3>
                  <p className="text-sm text-gray-500">{enrollment.program.description}</p>
                  <p className="text-xs text-gray-400">
                    Status: <span className="capitalize">{enrollment.status}</span>
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUnenroll(enrollment.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Enroll in Program</h2>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="program" className="block text-sm font-medium text-gray-700">
                  Select Program
                </label>
                <select
                  id="program"
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={!selectedProgram}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !selectedProgram
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  Enroll
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}; 