import { HealthProgram, CreateHealthProgramInput, UpdateHealthProgramInput } from '../types/healthProgram';

/**
 * Base URL for the API endpoints
 * This should be updated to match your backend API URL
 */
const API_URL = 'http://localhost:3000/api';

/**
 * Service for handling all health program related operations
 * Provides methods for CRUD operations on health programs
 */
export const healthProgramService = {
  /**
   * Fetches all health programs from the API
   * @returns Promise containing an array of health programs
   * @throws Error if the API request fails
   */
  async getAllPrograms(): Promise<HealthProgram[]> {
    const response = await fetch(`${API_URL}/health-programs`);
    if (!response.ok) {
      throw new Error('Failed to fetch health programs');
    }
    return response.json();
  },

  /**
   * Fetches a single health program by its ID
   * @param id - The unique identifier of the health program
   * @returns Promise containing the health program data
   * @throws Error if the API request fails
   */
  async getProgramById(id: string): Promise<HealthProgram> {
    const response = await fetch(`${API_URL}/health-programs/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch health program');
    }
    return response.json();
  },

  /**
   * Creates a new health program
   * @param program - The health program data to create
   * @returns Promise containing the created health program
   * @throws Error if the API request fails
   */
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

  /**
   * Updates an existing health program
   * @param id - The unique identifier of the health program to update
   * @param program - The updated health program data
   * @returns Promise containing the updated health program
   * @throws Error if the API request fails
   */
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

  /**
   * Deletes a health program
   * @param id - The unique identifier of the health program to delete
   * @throws Error if the API request fails
   */
  async deleteProgram(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/health-programs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete health program');
    }
  },
}; 