import express from 'express';
import {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} from '../controllers/healthProgramController';
import { protect } from '../middleware/authMiddleware'; // Ensure this path is correct

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HealthPrograms
 *   description: Health program management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthProgram:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the health program
 *         name:
 *           type: string
 *           description: Name of the health program
 *           unique: true
 *         description:
 *           type: string
 *           description: Description of the health program
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the program was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the program was last updated
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         name: "Tuberculosis (TB) Prevention"
 *         description: "Program focused on preventing the spread of TB."
 *         createdAt: "2023-01-01T12:00:00.000Z"
 *         updatedAt: "2023-01-01T12:00:00.000Z"
 */

/**
 * @swagger
 * /health-programs:
 *   post:
 *     summary: Create a new health program
 *     tags: [HealthPrograms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             name: "Malaria Control Initiative"
 *             description: "Efforts to control malaria transmission."
 *     responses:
 *       201:
 *         description: Health program created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthProgram'
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Not authorized
 *       409:
 *         description: Program with this name already exists
 *       500:
 *         description: Server error
 */
router.post('/', protect, createProgram); // Apply protect middleware

/**
 * @swagger
 * /health-programs:
 *   get:
 *     summary: Retrieve a list of all health programs
 *     tags: [HealthPrograms]
 *     responses:
 *       200:
 *         description: A list of health programs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HealthProgram'
 *       500:
 *         description: Server error
 */
router.get('/', getAllPrograms);

/**
 * @swagger
 * /health-programs/{id}:
 *   get:
 *     summary: Get a specific health program by ID
 *     tags: [HealthPrograms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The health program ID
 *     responses:
 *       200:
 *         description: Health program data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthProgram'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Health program not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getProgramById);

/**
 * @swagger
 * /health-programs/{id}:
 *   put:
 *     summary: Update a health program by ID
 *     tags: [HealthPrograms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The health program ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             name: "Updated Malaria Control"
 *             description: "Updated description of malaria control efforts."
 *     responses:
 *       200:
 *         description: Health program updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthProgram'
 *       400:
 *         description: Invalid input, validation error, or invalid ID format
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Health program not found
 *       409:
 *         description: Program with this name already exists (if name changed)
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, updateProgram); // Apply protect middleware

/**
 * @swagger
 * /health-programs/{id}:
 *   delete:
 *     summary: Delete a health program by ID
 *     tags: [HealthPrograms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The health program ID
 *     responses:
 *       200:
 *         description: Health program deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Program deleted successfully"
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Health program not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, deleteProgram); // Apply protect middleware

export default router; 