import { Request, Response } from 'express';
import Client from '../models/Client';
import HealthProgram from '../models/HealthProgram';
import Enrollment from '../models/Enrollment';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get total clients
    const totalClients = await Client.countDocuments();

    // Get enrollments per program
    const enrollmentsPerProgram = await Enrollment.aggregate([
      {
        $lookup: {
          from: 'healthprograms',
          localField: 'program',
          foreignField: '_id',
          as: 'programDetails'
        }
      },
      {
        $unwind: '$programDetails'
      },
      {
        $group: {
          _id: '$program',
          programName: { $first: '$programDetails.name' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          programId: '$_id',
          programName: 1,
          count: 1
        }
      }
    ]);

    // Find most popular program
    const mostPopularProgram = enrollmentsPerProgram.reduce((max, current) => {
      return current.count > max.count ? current : max;
    }, { programId: '', programName: '', count: 0 });

    res.json({
      data: {
        totalClients,
        enrollmentsPerProgram,
        mostPopularProgram
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 