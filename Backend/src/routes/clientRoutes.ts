import express from 'express';
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  searchClients,
} from '../controllers/clientController';
import enrollmentRoutes from './enrollmentRoutes'; // Import enrollment routes
// import { protect } from '../middleware/authMiddleware'; // TODO: Uncomment when auth is ready

const router = express.Router();

// --- Client Routes ---

// Special route for search MUST come before /:id route
// GET /api/clients/search?q=<query>
router.get('/search', searchClients);

// Route to create a new client
// POST /api/clients
// TODO: Add protect middleware
router.post('/', createClient);

// Route to get all clients
// GET /api/clients
router.get('/', getAllClients);

// Route to get a single client by ID
// GET /api/clients/:id
router.get('/:id', getClientById);

// Route to update a client by ID
// PUT /api/clients/:id
// TODO: Add protect middleware
router.put('/:id', updateClient);

// Route to delete a client by ID
// DELETE /api/clients/:id
// TODO: Add protect middleware
router.delete('/:id', deleteClient);

// --- Re-route to Enrollment Router for nested routes ---
// Use enrollmentRoutes for paths like /api/clients/:clientId/enrollments
router.use('/:clientId/enrollments', enrollmentRoutes);

export default router; 