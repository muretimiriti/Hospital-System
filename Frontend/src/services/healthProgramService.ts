import { HealthProgram, CreateHealthProgramInput, UpdateHealthProgramInput } from '../types/healthProgram';

const API_URL = 'http://localhost:3000/api'; // Update this with your actual API URL

export const healthProgramService = {
  // Get all health programs
  async getAllPrograms(): Promise<HealthProgram[]> {
    const response = await fetch(`${API_URL}/health-programs`);
    if (!response.ok) {
      throw new Error('Failed to fetch health programs');
    }
    return response.json();
  },

  // Get a single health program by ID
  async getProgramById(id: string): Promise<HealthProgram> {
    const response = await fetch(`${API_URL}/health-programs/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch health program');
    }
    return response.json();
  },

  // Create a new health program
  async createProgram(program: CreateHealthProgramInput): Promise<HealthProgram> {
    const response = await fetch(`${API_URL}/health-programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(program),
    });
    if (!response.ok) {
      throw new Error('Failed to create health program');
    }
    return response.json();
  },

  // Update an existing health program
  async updateProgram(id: string, program: UpdateHealthProgramInput): Promise<HealthProgram> {
    const response = await fetch(`${API_URL}/health-programs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(program),
    });
    if (!response.ok) {
      throw new Error('Failed to update health program');
    }
    return response.json();
  },

  // Delete a health program
  async deleteProgram(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/health-programs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete health program');
    }
  },
}; 