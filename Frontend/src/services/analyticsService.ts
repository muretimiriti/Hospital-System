import { ApiResponse } from '../types/common';


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
    const response = await fetch('http://localhost:3000/api/analytics/dashboard', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}; 