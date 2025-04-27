import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaSearch, FaClock, FaDollarSign, FaCalendar } from 'react-icons/fa';
import { Client } from '../../types/client';
import { EnrollmentWithDetails } from '../../types/enrollment';
import EnrollClient from '../enrollments/EnrollClient';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import { formatDate } from '../../utils/dateUtils';

export const ClientProfile: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  console.log('ClientProfile rendered with clientId from URL:', clientId);

  const [client, setClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showClientSelectModal, setShowClientSelectModal] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  useEffect(() => {
    if (clientId) {
      console.log('Fetching data for client:', clientId);
      fetchClientData();
      fetchClients();
    } else {
      console.error('No client ID in URL params');
    }
  }, [clientId]);

  useEffect(() => {
    if (clientSearchQuery.trim() === '') {
      setFilteredClients([]);
      return;
    }

    const filtered = clients.filter(client => 
      client.firstName.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      client.lastName.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(clientSearchQuery.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [clientSearchQuery, clients]);

  const fetchClientData = async () => {
    if (!clientId) return;
    
    try {
      console.log('Fetching client data for ID:', clientId);
      const data = await clientService.getClientWithPrograms(clientId);
      console.log('Fetched client data:', data);
      setClient(data);
      setEnrollments(data.enrolledPrograms || []);
    } catch (err: any) {
      console.error('Error fetching client data:', err);
      setError(err.message || 'Failed to load client data');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clients', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data = await response.json();
      setClients(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load clients');
    }
  };

  const handleEnrollmentCreated = async () => {
    setShowEnrollModal(false);
    await fetchClientData();
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
      await fetchClientData();
    } catch (err: any) {
      setError(err.message || 'Failed to unenroll client from program');
    }
  };

  const handleClientSelect = (clientId: string) => {
    console.log('Selected client ID:', clientId); // Debug log
    setShowClientSelectModal(false);
    setShowEnrollModal(true);
  };

  const handleEnrollClick = () => {
    console.log('Opening enrollment modal for client:', clientId);
    setShowEnrollModal(true);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/clients');
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
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Client Profile</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBack}
            className="text-blue-500 hover:text-blue-600"
          >
            Back to List
          </motion.button>
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-semibold">{`${client.firstName} ${client.lastName}`}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-semibold">{client.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-semibold">{client.contactNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Address</p>
              <p className="font-semibold">{client.address}</p>
            </div>
            <div>
              <p className="text-gray-600">Date of Birth</p>
              <p className="font-semibold">{formatDate(client.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-gray-600">Gender</p>
              <p className="font-semibold">{client.gender}</p>
            </div>
          </div>
        </div>

        {/* Enrolled Programs */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Enrolled Programs</h2>
            <button
              onClick={handleEnrollClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Enroll in Program
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enrollment) => (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-50 rounded-lg p-4 shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{enrollment.program?.name || 'Unknown Program'}</h3>
                <p className="text-gray-600 mb-2">{enrollment.program?.description || 'No description available'}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-blue-500" />
                    <span>{enrollment.program?.duration || 0} weeks</span>
                  </div>
                  <div className="flex items-center">
                    <FaDollarSign className="mr-2 text-green-500" />
                    <span>${enrollment.program?.cost || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-purple-500" />
                    <span>{formatDate(enrollment.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-red-500" />
                    <span>{formatDate(enrollment.endDate)}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded text-sm ${
                    enrollment.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : enrollment.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {enrollment.status}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUnenroll(enrollment.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Client Selection Modal */}
      {showClientSelectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Select Client</h2>
              <button
                onClick={() => setShowClientSelectModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  placeholder="Search clients..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {client.firstName} {client.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.contactNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleClientSelect(client.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Select
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enroll Client Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <EnrollClient
            onEnrollmentComplete={handleEnrollmentCreated}
            onCancel={() => setShowEnrollModal(false)}
          />
        </div>
      )}
    </div>
  );
}; 