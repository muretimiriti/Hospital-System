import { HealthProgram, CreateHealthProgramInput, UpdateHealthProgramInput } from '../types/healthProgram';
import { ApiResponse } from '../types/common';
import { API_CONFIG, getAuthHeader } from '../config/api';

export const healthProgramService = {
  // Get all health programs
  async getAllPrograms(): Promise<ApiResponse<HealthProgram[]>> {
    const response = await fetch(`${API_CONFIG.baseUrl}/health-programs`, {
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch health programs');
    }
    return response.json();
  },

  // Get a single health program by ID
  async getProgramById(id: string): Promise<ApiResponse<HealthProgram>> {
    const response = await fetch(`${API_CONFIG.baseUrl}/health-programs/${id}`, {
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch health program');
    }
    return response.json();
  },

  // Create a new health program
  async createProgram(program: CreateHealthProgramInput): Promise<ApiResponse<HealthProgram>> {
    const response = await fetch(`${API_CONFIG.baseUrl}/health-programs`, {
      method: 'POST',
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
      body: JSON.stringify(program),
    });
    if (!response.ok) {
      throw new Error('Failed to create health program');
    }
    return response.json();
  },

  // Update an existing health program
  async updateProgram(id: string, program: UpdateHealthProgramInput): Promise<ApiResponse<HealthProgram>> {
    const response = await fetch(`${API_CONFIG.baseUrl}/health-programs/${id}`, {
      method: 'PUT',
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
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
    const response = await fetch(`${API_CONFIG.baseUrl}/health-programs/${id}`, {
      method: 'DELETE',
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete health program');
    }
  },
}; 