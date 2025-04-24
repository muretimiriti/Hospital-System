import express from 'express';
import {
  createEnrollment,
  getAllEnrollments,
  getClientEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} from '../controllers/enrollmentController';
// import { protect } from '../middleware/authMiddleware'; // TODO: Uncomment when auth is ready

const router = express.Router({ mergeParams: true }); // Enable merging params from parent routers (like client router)

// --- Enrollment Routes ---

// Route to create a new enrollment
// POST /api/enrollments
// TODO: Add protect middleware
router.post('/', createEnrollment);

// Route to get all enrollments (or filter)
// GET /api/enrollments
router.get('/', getAllEnrollments);

// --- Routes specific to a client ---
// Mounted via client routes: /api/clients/:clientId/enrollments

// Route to get all enrollments for a specific client
// GET /api/clients/:clientId/enrollments
router.get('/', getClientEnrollments); // Note: Path is '/' because base path is set in clientRoutes

// --- Routes specific to an enrollment ID ---

// Route to get a single enrollment by ID
// GET /api/enrollments/:id
router.get('/:id', getEnrollmentById);

// Route to update an enrollment by ID
// PUT /api/enrollments/:id
// TODO: Add protect middleware
router.put('/:id', updateEnrollment);

// Route to delete an enrollment by ID
// DELETE /api/enrollments/:id
// TODO: Add protect middleware
router.delete('/:id', deleteEnrollment);

export default router; 