import { Enrollment, CreateEnrollmentInput, UpdateEnrollmentInput, EnrollmentWithDetails } from '../types/enrollment';

const API_URL = 'http://localhost:3000/api';

export const enrollmentService = {
  // Fetch all enrollments with client and program details
  async getAllEnrollments(): Promise<EnrollmentWithDetails[]> {
    const response = await fetch(`${API_URL}/enrollments`);
    if (!response.ok) {
      throw new Error('Failed to fetch enrollments');
    }
    return response.json();
  },

  // Fetch enrollments for a specific client
  async getClientEnrollments(clientId: string): Promise<EnrollmentWithDetails[]> {
    const response = await fetch(`${API_URL}/clients/${clientId}/enrollments`);
    if (!response.ok) {
      throw new Error('Failed to fetch client enrollments');
    }
    return response.json();
  },

  // Fetch enrollments for a specific program
  async getProgramEnrollments(programId: string): Promise<EnrollmentWithDetails[]> {
    const response = await fetch(`${API_URL}/programs/${programId}/enrollments`);
    if (!response.ok) {
      throw new Error('Failed to fetch program enrollments');
    }
    return response.json();
  },

  // Create a new enrollment
  async createEnrollment(enrollment: CreateEnrollmentInput): Promise<Enrollment> {
    const response = await fetch(`${API_URL}/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrollment),
    });
    if (!response.ok) {
      throw new Error('Failed to create enrollment');
    }
    return response.json();
  },

  // Update an existing enrollment
  async updateEnrollment(id: string, enrollment: UpdateEnrollmentInput): Promise<Enrollment> {
    const response = await fetch(`${API_URL}/enrollments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrollment),
    });
    if (!response.ok) {
      throw new Error('Failed to update enrollment');
    }
    return response.json();
  },

  // Delete an enrollment
  async deleteEnrollment(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/enrollments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete enrollment');
    }
  },

  // Validate enrollment data
  validateEnrollment(enrollment: CreateEnrollmentInput): string[] {
    const errors: string[] = [];
    
    if (!enrollment.clientId) {
      errors.push('Client ID is required');
    }
    if (!enrollment.programId) {
      errors.push('Program ID is required');
    }
    
    return errors;
  }
}; 