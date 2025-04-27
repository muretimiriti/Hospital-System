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
      const errorData = await response.json();
      if (response.status === 409) {
        throw new Error(`A program with the name "${program.name}" already exists`);
      }
      throw new Error(errorData.message || 'Failed to create health program');
    }
    
    return response.json();
  },

  // Update an existing health program
  async updateProgram(id: string, program: UpdateHealthProgramInput): Promise<ApiResponse<HealthProgram>> {
    // First, get the current program to check if we're updating the name
    const currentProgram = await this.getProgramById(id);
    
    // If we're updating the name, check if it's different from the current name
    if (program.name && program.name !== currentProgram.data.name) {
      // Check if the new name already exists
      const response = await fetch(`${API_CONFIG.baseUrl}/health-programs?name=${encodeURIComponent(program.name)}`, {
        headers: {
          ...API_CONFIG.headers,
          ...getAuthHeader(),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          throw new Error(`A program with the name "${program.name}" already exists`);
        }
      }
    }
    
    // Proceed with the update
    const updateResponse = await fetch(`${API_CONFIG.baseUrl}/health-programs/${id}`, {
      method: 'PUT',
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
      body: JSON.stringify(program),
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(errorData.message || 'Failed to update health program');
    }
    
    return updateResponse.json();
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