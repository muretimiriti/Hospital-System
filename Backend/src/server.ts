import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig'; // Import Swagger config
import corsOptions from './config/cors'; // Import CORS config

// Import routes
import healthProgramRoutes from './routes/healthProgramRoutes';
import clientRoutes from './routes/clientRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import authRoutes from './routes/authRoutes'; // Import auth routes
import analyticsRoutes from './routes/analyticsRoutes'; // Import analytics routes
import auditLogRoutes from './routes/auditLogRoutes'; // Import audit log routes

// Import middleware
import { auditLogger } from './middleware/auditLogger';

dotenv.config();

const app: Express = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors(corsOptions)); // Enable CORS with options
app.use(express.json()); // Allow express to parse JSON body

// Define a simple root route
app.get('/', (req: Request, res: Response) => {
  res.send(`Hospital System API Running. Docs available at /api-docs`);
});

// Serve Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount Routes
// Note: Base path is /api for all routes below, matching the server URL in swaggerConfig
app.use('/api/auth', authRoutes);
app.use('/api/health-programs', auditLogger('program'), healthProgramRoutes);
app.use('/api/clients', auditLogger('client'), clientRoutes); // Handles /api/clients and /api/clients/:clientId/enrollments
app.use('/api/enrollments', auditLogger('enrollment'), enrollmentRoutes); // Handles direct enrollment routes like /api/enrollments/:id
app.use('/api/analytics', analyticsRoutes); // Add analytics routes
app.use('/api/audit-logs', auditLogRoutes); // Add audit log routes

const PORT = process.env.PORT || 5000;

// Only start the server if this file is being run directly
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}, Docs at http://localhost:${PORT}/api-docs`));
}

export default app; // Export for potential testing 