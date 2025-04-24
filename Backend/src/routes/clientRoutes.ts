import express from 'express';
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  searchClients,
} from '../controllers/clientController';
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

// --- Enrollment Routes (Nested under Client) ---
// GET /api/clients/:clientId/enrollments - Handled in enrollmentController/Routes
// POST /api/clients/:clientId/programs/:programId - Handled in enrollmentController/Routes
// DELETE /api/clients/:clientId/programs/:programId - Handled in enrollmentController/Routes

export default router; 