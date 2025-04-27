import express from 'express';
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  searchClients,
  getClientWithPrograms,
} from '../controllers/clientController';
import enrollmentRoutes from './enrollmentRoutes'; // Import enrollment routes
import { protect } from '../middleware/authMiddleware'; // Ensure this path is correct
import asyncHandler from '../utils/asyncHandler'; // Create this utility file

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client registration and management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ClientInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *         - gender
 *         - contactNumber
 *         - email
 *         - address
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         contactNumber:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         address:
 *           type: string
 *       example:
 *         firstName: "Jane"
 *         lastName: "Doe"
 *         dateOfBirth: "1990-05-15"
 *         gender: "female"
 *         contactNumber: "+1234567890"
 *         email: "jane.doe@example.com"
 *         address: "123 Health St, Wellness City"
 *     ClientOutput:
 *       allOf:
 *         - $ref: '#/components/schemas/ClientInput'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *             enrolledPrograms:
 *               type: array
 *               items:
 *                 type: string # Typically ObjectIds, represented as strings
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *     ClientProfile:
 *       allOf:
 *         - $ref: '#/components/schemas/ClientOutput'
 *         - type: object
 *           properties:
 *             enrolledPrograms: # Override with populated details
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EnrollmentOutput'
 *       example:
 *         _id: "60d0fe4f5311236168a109cb"
 *         firstName: "Jane"
 *         lastName: "Doe"
 *         dateOfBirth: "1990-05-15"
 *         gender: "female"
 *         contactNumber: "+1234567890"
 *         email: "jane.doe@example.com"
 *         address: "123 Health St, Wellness City"
 *         enrolledPrograms: [] # Example - will be populated
 *         createdAt: "2023-01-02T10:00:00.000Z"
 *         updatedAt: "2023-01-02T10:00:00.000Z"
 *   parameters:
 *     clientIdParam:
 *       in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: The client ID
 */

/**
 * @swagger
 * /clients/search:
 *   get:
 *     summary: Search for clients by name, email, or contact number
 *     tags: [Clients]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query string
 *     responses:
 *       200:
 *         description: A list of matching clients.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClientOutput'
 *       400:
 *         description: Search query parameter 'q' is required
 *       500:
 *         description: Server error
 */
router.get('/search', asyncHandler(searchClients));

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Register a new client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInput'
 *     responses:
 *       201:
 *         description: Client registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientOutput'
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Not authorized
 *       409:
 *         description: Client with this email already exists
 *       500:
 *         description: Server error
 */
router.post('/', protect, asyncHandler(createClient));

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Retrieve a list of all clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: A list of clients.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClientOutput'
 *       500:
 *         description: Server error
 */
router.get('/', asyncHandler(getClients));

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Get a specific client's profile by ID, including populated enrollments
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/clientIdParam'
 *     responses:
 *       200:
 *         description: Client profile data with enrollments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientProfile'
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, asyncHandler(getClientById));

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Update a client's information by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/clientIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInput'
 *     responses:
 *       200:
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientOutput'
 *       400:
 *         description: Invalid input, validation error, or invalid ID format
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Client not found
 *       409:
 *         description: Client with this email already exists (if email changed)
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, asyncHandler(updateClient));

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Delete a client by ID (also deletes associated enrollments)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/clientIdParam'
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Client and associated enrollments deleted successfully"
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, asyncHandler(deleteClient));

// --- Re-route to Enrollment Router for nested routes ---
// Use enrollmentRoutes for paths like /api/clients/:clientId/enrollments
// The protection for these nested routes will be handled within enrollmentRoutes if needed
router.use('/:clientId/enrollments', enrollmentRoutes);

// Get client details with enrolled programs
router.get('/:clientId/programs', protect, asyncHandler(getClientWithPrograms));

export default router; 