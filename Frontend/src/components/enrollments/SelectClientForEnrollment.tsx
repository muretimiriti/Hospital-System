import React, { useState, useEffect } from 'react';
import { clientService } from '../../services/clientService';
import { useNotification } from '../../contexts/NotificationContext';
import { EnrollClient } from './EnrollClient';

export const SelectClientForEnrollment: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getAllClients();
      setClients(response.data);
    } catch (error) {
      showNotification({ message: 'Failed to fetch clients', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleEnrollmentComplete = () => {
    setSelectedClientId(null);
    fetchClients(); // Refresh the client list after enrollment
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading clients...</div>;
  }

  if (selectedClientId) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Enroll Client in Program</h2>
          <button
            onClick={() => setSelectedClientId(null)}
            className="text-blue-500 hover:text-blue-600"
          >
            Back to Client Selection
          </button>
        </div>
        <EnrollClient clientId={selectedClientId} onEnrollmentComplete={handleEnrollmentComplete} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Select Client to Enroll</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {client.firstName} {client.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleClientSelect(client.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Enroll
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 