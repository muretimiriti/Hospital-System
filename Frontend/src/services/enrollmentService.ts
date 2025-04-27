import { Enrollment, CreateEnrollmentInput, UpdateEnrollmentInput, EnrollmentWithDetails } from '../types/enrollment';

const API_URL = 'http://localhost:5000/api';

export const enrollmentService = {
  // Fetch all enrollments with client and program details
  async getAllEnrollments(): Promise<EnrollmentWithDetails[]> {
    const response = await fetch(`${API_URL}/enrollments`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch enrollments');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  // Fetch enrollments for a specific client
  async getClientEnrollments(clientId: string): Promise<EnrollmentWithDetails[]> {
    const response = await fetch(`${API_URL}/clients/${clientId}/enrollments`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch client enrollments');
    }
    return response.json();
  },

  // Fetch enrollments for a specific program
  async getProgramEnrollments(programId: string): Promise<EnrollmentWithDetails[]> {
    const response = await fetch(`${API_URL}/programs/${programId}/enrollments`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch program enrollments');
    }
    return response.json();
  },

  // Create a new enrollment
  async createEnrollment(enrollment: CreateEnrollmentInput): Promise<Enrollment> {
    const response = await fetch(`${API_URL}/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(enrollment),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create enrollment');
    }
    return response.json();
  },

  // Update an existing enrollment
  async updateEnrollment(id: string, enrollment: UpdateEnrollmentInput): Promise<Enrollment> {
    const response = await fetch(`${API_URL}/enrollments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(enrollment),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update enrollment');
    }
    return response.json();
  },

  // Delete an enrollment
  async deleteEnrollment(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/enrollments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete enrollment');
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