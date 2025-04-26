import { API_CONFIG, getAuthHeader } from '../config/api';
import { ApiResponse } from '../types/common';
import { Enrollment, CreateEnrollmentInput, UpdateEnrollmentInput, EnrollmentWithDetails } from '../types/enrollment';

const API_URL = 'http://localhost:3000/api';

export interface Enrollment {
  id: string;
  clientId: string;
  programId: string;
  status: 'active' | 'completed' | 'cancelled';
  enrollmentDate: string;
  completionDate?: string;
}

export interface CreateEnrollmentInput {
  clientId: string;
  programId: string;
  startDate: string;
}

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
  async getClientEnrollments(clientId: string): Promise<ApiResponse<Enrollment[]>> {
    const response = await fetch(`${API_CONFIG.baseUrl}/enrollments/client/${clientId}`, {
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
    });
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
  async createEnrollment(enrollment: CreateEnrollmentInput): Promise<ApiResponse<Enrollment>> {
    const response = await fetch(`${API_CONFIG.baseUrl}/enrollments`, {
      method: 'POST',
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
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
  },

  // Update enrollment status
  async updateEnrollmentStatus(id: string, status: Enrollment['status']): Promise<ApiResponse<Enrollment>> {
    const response = await fetch(`${API_CONFIG.baseUrl}/enrollments/${id}/status`, {
      method: 'PATCH',
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update enrollment status');
    }
    return response.json();
  },

  // Cancel enrollment
  async cancelEnrollment(id: string): Promise<void> {
    const response = await fetch(`${API_CONFIG.baseUrl}/enrollments/${id}`, {
      method: 'DELETE',
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to cancel enrollment');
    }
  },
}; 