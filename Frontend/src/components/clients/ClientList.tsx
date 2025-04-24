import React, { useEffect, useState } from 'react';
import { Client } from '../../types/client';
import { clientService } from '../../services/clientService';
import { ClientProfile } from './ClientProfile';
import { EnrollmentForm } from '../enrollments/EnrollmentForm';

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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
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
          <ClientProfile clientId={selectedClientId} />
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search form */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Search Clients</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="w-48">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Fields</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="contact">Contact Number</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {clients.length} clients found
          </div>
        </div>
      </div>

      {/* Client list */}
      <div className="grid gap-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">
                  {client.firstName} {client.lastName}
                </h3>
                <p className="text-gray-600 mt-2">
                  DOB: {new Date(client.dateOfBirth).toLocaleDateString()}
                </p>
                <p className="text-gray-600">Gender: {client.gender}</p>
                <p className="text-gray-600">Contact: {client.contactNumber}</p>
                <p className="text-gray-600">Email: {client.email}</p>
                <p className="text-gray-600">Address: {client.address}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Enrolled Programs: {client.enrolledPrograms.length}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onClientSelect(client.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {clients.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No clients found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
}; 