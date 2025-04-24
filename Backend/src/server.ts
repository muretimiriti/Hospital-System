import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

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

// TODO: Add other routes (programs, clients, enrollments, auth)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app; // Export for potential testing 