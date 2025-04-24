import { Client, CreateClientInput, UpdateClientInput, ClientWithPrograms } from '../types/client';

const API_URL = 'http://localhost:3000/api'; // Update this with your actual API URL

export const clientService = {
  // Fetch all registered clients
  async getAllClients(): Promise<Client[]> {
    const response = await fetch(`${API_URL}/clients`);
    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    return response.json();
  },

  // Fetch a single client with their enrolled program details
  async getClientById(id: string): Promise<ClientWithPrograms> {
    const response = await fetch(`${API_URL}/clients/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch client');
    }
    return response.json();
  },

  // Register a new client in the system
  async createClient(client: CreateClientInput): Promise<Client> {
    const response = await fetch(`${API_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });
    if (!response.ok) {
      throw new Error('Failed to create client');
    }
    return response.json();
  },

  // Update an existing client's information
  async updateClient(id: string, client: UpdateClientInput): Promise<Client> {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });
    if (!response.ok) {
      throw new Error('Failed to update client');
    }
    return response.json();
  },

  // Remove a client from the system
  async deleteClient(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete client');
    }
  },

  // Enroll a client in a health program
  async enrollClientInProgram(clientId: string, programId: string): Promise<Client> {
    const response = await fetch(`${API_URL}/clients/${clientId}/programs/${programId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to enroll client in program');
    }
    return response.json();
  },

  // Remove a client from a health program
  async removeClientFromProgram(clientId: string, programId: string): Promise<Client> {
    const response = await fetch(`${API_URL}/clients/${clientId}/programs/${programId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to remove client from program');
    }
    return response.json();
  },

  // Search clients by name, email, or other criteria
  async searchClients(query: string): Promise<Client[]> {
    const response = await fetch(`${API_URL}/clients/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search clients');
    }
    return response.json();
  },
}; 