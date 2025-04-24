import express from 'express';
import {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} from '../controllers/healthProgramController';
// import { protect } from '../middleware/authMiddleware'; // TODO: Uncomment when auth is ready

const router = express.Router();

// Route to create a new health program
// POST /api/health-programs
// TODO: Add protect middleware
router.post('/', createProgram);

// Route to get all health programs
// GET /api/health-programs
router.get('/', getAllPrograms);

// Route to get a single health program by ID
// GET /api/health-programs/:id
router.get('/:id', getProgramById);

// Route to update a health program by ID
// PUT /api/health-programs/:id
// TODO: Add protect middleware
router.put('/:id', updateProgram);

// Route to delete a health program by ID
// DELETE /api/health-programs/:id
// TODO: Add protect middleware
router.delete('/:id', deleteProgram);

export default router; 