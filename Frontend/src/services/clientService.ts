import { API_CONFIG, getAuthHeader } from '../config/api';
import { ApiResponse, Gender } from '../types/common';
import { Client, CreateClientInput, UpdateClientInput, ClientWithPrograms } from '../types/client';

const API_URL = 'http://localhost:3000/api'; // Update this with your actual API URL

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  gender: Gender;
  contactNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  gender: Gender;
  contactNumber: string;
}

export const clientService = {
  // Create a new client
  async createClient(client: CreateClientInput): Promise<ApiResponse<Client>> {
    const response = await fetch(`${API_CONFIG.baseUrl}/clients`, {
      method: 'POST',
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
      body: JSON.stringify(client),
    });
    if (!response.ok) {
      throw new Error('Failed to create client');
    }
    return response.json();
  },

  // Get all clients
  async getAllClients(): Promise<ApiResponse<Client[]>> {
    const response = await fetch(`${API_CONFIG.baseUrl}/clients`, {
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    return response.json();
  },

  // Get a single client by ID
  async getClientById(id: string): Promise<ApiResponse<Client>> {
    const response = await fetch(`${API_CONFIG.baseUrl}/clients/${id}`, {
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch client');
    }
    return response.json();
  },

  // Update a client
  async updateClient(id: string, client: Partial<CreateClientInput>): Promise<ApiResponse<Client>> {
    const response = await fetch(`${API_CONFIG.baseUrl}/clients/${id}`, {
      method: 'PUT',
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
      body: JSON.stringify(client),
    });
    if (!response.ok) {
      throw new Error('Failed to update client');
    }
    return response.json();
  },

  // Delete a client
  async deleteClient(id: string): Promise<void> {
    const response = await fetch(`${API_CONFIG.baseUrl}/clients/${id}`, {
      method: 'DELETE',
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
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