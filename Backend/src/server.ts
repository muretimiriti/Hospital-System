import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

// Import routes
import healthProgramRoutes from './routes/healthProgramRoutes';
import clientRoutes from './routes/clientRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
// TODO: Import auth routes

dotenv.config();

const app: Express = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Allow express to parse JSON body

// Define a simple root route
app.get('/', (req: Request, res: Response) => {
  res.send('Hospital System API Running');
});

// Mount Routes
app.use('/api/health-programs', healthProgramRoutes);
app.use('/api/clients', clientRoutes); // Handles /api/clients and /api/clients/:clientId/enrollments
app.use('/api/enrollments', enrollmentRoutes); // Handles direct enrollment routes like /api/enrollments/:id
// TODO: Add auth routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app; // Export for potential testing 