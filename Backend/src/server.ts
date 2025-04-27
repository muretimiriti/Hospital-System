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

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app: Express = express();

// Connect to MongoDB database
connectDB();

// Initialize Middleware
app.use(cors(corsOptions)); // Enable CORS with options
app.use(express.json()); // Allow express to parse JSON body

// Define a simple root route for health check
app.get('/', (req: Request, res: Response) => {
  res.send(`Hospital System API Running. Docs available at /api-docs`);
});

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount Routes
// Note: Base path is /api for all routes below, matching the server URL in swaggerConfig
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/health-programs', auditLogger('program'), healthProgramRoutes); // Health program management
app.use('/api/clients', auditLogger('client'), clientRoutes); // Client management and nested enrollments
app.use('/api/enrollments', auditLogger('enrollment'), enrollmentRoutes); // Direct enrollment management
app.use('/api/analytics', analyticsRoutes); // Analytics and reporting
app.use('/api/audit-logs', auditLogRoutes); // Audit log viewing

// Set port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Only start the server if this file is being run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}, Docs at http://localhost:${PORT}/api-docs`));
}

// Export app for testing purposes
export default app; 