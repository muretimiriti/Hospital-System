import React, { useEffect, useState } from 'react';
import { Client } from '../../types/client';
import { clientService } from '../../services/clientService';

export const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

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
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchClients();
      return;
    }

    try {
      setLoading(true);
      const results = await clientService.searchClients(searchQuery);
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
      } catch (err) {
        setError('Failed to delete client');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search form */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>
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
                  onClick={() => handleDelete(client.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 