import cors from 'cors';

/**
 * CORS (Cross-Origin Resource Sharing) configuration options
 * Defines which origins are allowed to access the API and what methods/headers are permitted
 */
const corsOptions: cors.CorsOptions = {
  // List of allowed origins (frontend URLs)
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Add your frontend URLs
  
  // HTTP methods allowed in CORS requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
  // Headers allowed in CORS requests
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  // Allow credentials (cookies, authorization headers) to be included in requests
  credentials: true,
};

export default corsOptions; 