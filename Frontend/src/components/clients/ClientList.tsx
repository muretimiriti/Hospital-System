import React, { useEffect, useState } from 'react';
import { Client } from '../../types/client';
import { clientService } from '../../services/clientService';
import { ClientProfile } from './ClientProfile';
import { EnrollmentForm } from '../enrollments/EnrollmentForm';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaSearch, FaTrash } from 'react-icons/fa';

interface ClientListProps {
  onClientSelect: (clientId: string) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ onClientSelect }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'name' | 'email' | 'contact'>('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch clients when search query changes
  useEffect(() => {
    if (debouncedQuery) {
      handleSearch();
    } else {
      fetchClients();
    }
  }, [debouncedQuery, searchType]);

  // Fetch all clients from the API
  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAllClients();
      setClients(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle client search
  const handleSearch = async () => {
    if (!debouncedQuery.trim()) {
      fetchClients();
      return;
    }

    try {
      setLoading(true);
      const results = await clientService.searchClients(debouncedQuery);
      setClients(results);
      setError(null);
    } catch (err) {
      setError('Failed to search clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle client deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.deleteClient(id);
        setClients(clients.filter(client => client.id !== id));
        if (selectedClientId === id) {
          setSelectedClientId(null);
        }
      } catch (err) {
        setError('Failed to delete client');
        console.error(err);
      }
    }
  };

  // Handle enrollment creation
  const handleEnrollmentCreated = () => {
    setShowEnrollmentForm(false);
    if (selectedClientId) {
      // Refresh client data to show new enrollment
      fetchClients();
    }
  };

  const filteredClients = clients.filter(client => 
    searchQuery === '' ||
    client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Show client profile if a client is selected
  if (selectedClientId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setSelectedClientId(null)}
            className="text-blue-500 hover:text-blue-600"
          >
            ← Back to Client List
          </button>
          <button
            onClick={() => setShowEnrollmentForm(!showEnrollmentForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {showEnrollmentForm ? 'Cancel Enrollment' : 'Enroll in Program'}
          </button>
        </div>

        {showEnrollmentForm ? (
          <EnrollmentForm
            clientId={selectedClientId}
            onEnrollmentCreated={handleEnrollmentCreated}
          />
        ) : (
          <ClientProfile onBack={() => setSelectedClientId(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaUser className="mr-3" />
          Clients
        </h1>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </motion.div>

      {/* Clients Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {client.enrolledPrograms?.length || 0} Programs
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onClientSelect(client.id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}; 