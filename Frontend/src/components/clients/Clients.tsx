// Import required dependencies from React
import React, { useState } from 'react';
import { ClientList } from './ClientList';
import { CreateClient } from './CreateClient';

interface ClientsProps {
  onClientSelect: (clientId: string) => void;
}

export const Clients: React.FC<ClientsProps> = ({ onClientSelect }) => {
  // Toggle between list and create form views
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Handle successful client creation
  const handleClientCreated = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Client Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {showCreateForm ? 'Cancel' : 'Register New Client'}
        </button>
      </div>

      {/* Toggle between create form and client list */}
      {showCreateForm ? (
        <CreateClient onClientCreated={handleClientCreated} />
      ) : (
        <ClientList onClientSelect={onClientSelect} />
      )}
    </div>
  );
}; 