import express from 'express';
import {
  createEnrollment,
  getAllEnrollments,
  getClientEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} from '../controllers/enrollmentController';
import { protect } from '../middleware/authMiddleware'; // Ensure this path is correct
import asyncHandler from '../utils/asyncHandler'; // Import the wrapper

const router = express.Router({ mergeParams: true }); // Enable merging params from parent routers (like client router)

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Client enrollment in health programs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EnrollmentInput:
 *       type: object
 *       required:
 *         - clientId
 *         - programId
 *       properties:
 *         clientId:
 *           type: string
 *           description: ID of the client being enrolled
 *         programId:
 *           type: string
 *           description: ID of the program to enroll in
 *         notes:
 *           type: string
 *           description: Optional notes about the enrollment
 *       example:
 *         clientId: "60d0fe4f5311236168a109cb"
 *         programId: "60d0fe4f5311236168a109ca"
 *         notes: "Initial assessment completed."
 *     EnrollmentOutput:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         client:
 *           oneOf: # Can be ObjectId string or populated Client object
 *             - type: string
 *             - $ref: '#/components/schemas/ClientOutput'
 *         program:
 *           oneOf: # Can be ObjectId string or populated Program object
 *             - type: string
 *             - $ref: '#/components/schemas/HealthProgram'
 *         enrollmentDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [active, completed, cancelled]
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "61e0c1b4e1f5a1e9f8f4a1a1"
 *         client: "60d0fe4f5311236168a109cb"
 *         program: "60d0fe4f5311236168a109ca"
 *         enrollmentDate: "2023-01-10T14:30:00.000Z"
 *         status: "active"
 *         notes: "Initial assessment completed."
 *         createdAt: "2023-01-10T14:30:00.000Z"
 *         updatedAt: "2023-01-10T14:30:00.000Z"
 *   parameters:
 *     enrollmentIdParam:
 *       in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: The enrollment ID
 */

// --- Enrollment Routes ---

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Create a new enrollment
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnrollmentInput'
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnrollmentOutput'
 *       400:
 *         description: Invalid input (IDs, etc.) or validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Client or Program not found
 *       409:
 *         description: Client already enrolled in this program
 *       500:
 *         description: Server error
 */
// Route to create a new enrollment
// POST /api/enrollments
router.post('/', protect, asyncHandler(createEnrollment)); // Apply wrapper

/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Retrieve a list of all enrollments (admin/overview)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     # TODO: Add parameters for filtering (clientId, programId, status)
 *     responses:
 *       200:
 *         description: A list of enrollments with populated client/program info.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EnrollmentOutput'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
// Route to get all enrollments (or filter)
// GET /api/enrollments
// Protect viewing all enrollments
router.get('/', protect, asyncHandler(getAllEnrollments)); // Apply wrapper

// --- Routes specific to a client ---
// Mounted via client routes: /api/clients/:clientId/enrollments

/**
 * @swagger
 * /clients/{clientId}/enrollments:
 *   get:
 *     summary: Get all enrollments for a specific client
 *     tags: [Enrollments, Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: string
 *         required: true
 *         description: The client ID
 *     responses:
 *       200:
 *         description: A list of enrollments for the specified client.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EnrollmentOutput' # Output includes populated program
 *       400:
 *         description: Invalid Client ID format
 *       401:
 *         description: Not authorized
 *       404:
 *         description: No enrollments found for this client (or client not found)
 *       500:
 *         description: Server error
 */
// Route to get all enrollments for a specific client
// GET /api/clients/:clientId/enrollments
router.get('/', protect, asyncHandler(getClientEnrollments)); // Apply wrapper

// --- Routes specific to an enrollment ID ---

/**
 * @swagger
 * /enrollments/{id}:
 *   get:
 *     summary: Get a specific enrollment by ID
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/enrollmentIdParam'
 *     responses:
 *       200:
 *         description: Enrollment data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnrollmentOutput'
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
// Route to get a single enrollment by ID
// GET /api/enrollments/:id
// Protect viewing specific enrollment details
router.get('/:id', protect, asyncHandler(getEnrollmentById)); // Apply wrapper

/**
 * @swagger
 * /enrollments/{id}:
 *   put:
 *     summary: Update an enrollment's status or notes by ID
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/enrollmentIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, completed, cancelled]
 *               notes:
 *                 type: string
 *           example:
 *             status: "completed"
 *             notes: "Client successfully completed the program."
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnrollmentOutput'
 *       400:
 *         description: Invalid input, validation error, or invalid ID format
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
// Route to update an enrollment by ID
// PUT /api/enrollments/:id
router.put('/:id', protect, asyncHandler(updateEnrollment)); // Apply wrapper

/**
 * @swagger
 * /enrollments/{id}:
 *   delete:
 *     summary: Delete an enrollment by ID
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/enrollmentIdParam'
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Enrollment deleted successfully"
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
// Route to delete an enrollment by ID
// DELETE /api/enrollments/:id
router.delete('/:id', protect, asyncHandler(deleteEnrollment)); // Apply wrapper

export default router; 