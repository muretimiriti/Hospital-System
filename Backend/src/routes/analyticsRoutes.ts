import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieve statistics for the dashboard including total clients, enrollments per program, and most popular program
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalClients:
 *                       type: number
 *                     enrollmentsPerProgram:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           programId:
 *                             type: string
 *                           programName:
 *                             type: string
 *                           count:
 *                             type: number
 *                     mostPopularProgram:
 *                       type: object
 *                       properties:
 *                         programId:
 *                           type: string
 *                         programName:
 *                           type: string
 *                         count:
 *                           type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/dashboard', authenticateToken, getDashboardStats);

export default router; 