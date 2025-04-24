import { ApiResponse } from '../types/common';


interface DashboardStats {
  totalClients: number;
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
}

export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  try {
    const response = await fetch('http://localhost:3000/api/analytics/dashboard', {
      headers: {
        'Content-Type': 'application/json',
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