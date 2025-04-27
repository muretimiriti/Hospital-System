import { Client, CreateClientInput, UpdateClientInput, ClientWithPrograms } from '../types/client';

const API_URL = 'http://localhost:5000/api'; // Update this with your actual API URL

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

  // Get client details with enrolled programs
  async getClientWithPrograms(clientId: string): Promise<Client> {
    const response = await fetch(`${API_URL}/clients/${clientId}/programs`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch client details');
    }
    const { data } = await response.json();
    console.log('Raw client data:', data);
    console.log('Enrolled programs:', data.enrolledPrograms);
    
    // Transform the data to match the expected structure
    const transformedData = {
      ...data,
      enrolledPrograms: (data.enrolledPrograms || []).map((enrollment: any) => {
        console.log('Processing enrollment:', enrollment);
        console.log('Program data:', enrollment.program);
        return {
          id: enrollment.id || enrollment._id,
          program: enrollment.program ? {
            id: enrollment.program._id || enrollment.program.id,
            name: enrollment.program.name || 'Unknown Program',
            description: enrollment.program.description || 'No description available',
            duration: enrollment.program.duration || 0,
            cost: enrollment.program.cost || 0,
            startDate: enrollment.program.startDate || '',
            endDate: enrollment.program.endDate || ''
          } : {
            id: '',
            name: 'Unknown Program',
            description: 'No description available',
            duration: 0,
            cost: 0,
            startDate: '',
            endDate: ''
          },
          status: enrollment.status || 'active',
          startDate: enrollment.startDate || '',
          endDate: enrollment.endDate || ''
        };
      })
    };
    console.log('Transformed data:', transformedData);
    return transformedData;
  },
}; 