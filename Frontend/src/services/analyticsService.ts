import { ApiResponse } from '../types/common';
import { API_CONFIG, getAuthHeader } from '../config/api';


interface DashboardStats {
  totalClients: number;
  totalPrograms: number;
  totalEnrollments: number;
  enrollmentsPerProgram: Array<{
    programId: string;
    programName: string;
    count: number;
  }>;
  mostPopularProgram: {
    programId: string;
    programName: string;
    count: number;
  };
  enrollmentTrend: Array<{
    date: string;
    count: number;
  }>;
  genderDistribution: Array<{
    gender: string;
    count: number;
  }>;
}

export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_CONFIG.baseUrl}/analytics/dashboard`, {
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
    });

    if (response.status === 403) {
      // Token might be expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch dashboard stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}; 