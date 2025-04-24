import { Request, Response } from 'express';
import Client from '../models/Client';
import HealthProgram from '../models/HealthProgram';
import Enrollment from '../models/Enrollment';
import mongoose from 'mongoose';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get total clients
    const totalClients = await Client.countDocuments();

    // Get total programs
    const totalPrograms = await HealthProgram.countDocuments();

    // Get total enrollments
    const totalEnrollments = await Enrollment.countDocuments();

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

    // Get enrollment trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const enrollmentTrend = await Enrollment.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    // Get gender distribution
    const genderDistribution = await Client.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          gender: '$_id',
          count: 1
        }
      }
    ]);

    res.json({
      data: {
        totalClients,
        totalPrograms,
        totalEnrollments,
        enrollmentsPerProgram,
        mostPopularProgram,
        enrollmentTrend,
        genderDistribution
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