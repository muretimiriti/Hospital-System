import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hospital System API',
      version: '1.0.0',
      description: 'API documentation for the Basic Health Information System',
      contact: {
        name: 'API Support',
        // url: 'http://www.example.com/support',
        // email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: 'Development server',
      },
      // Add other servers like production if needed
    ],
    components: {
      securitySchemes: {
        bearerAuth: { // Name for the security scheme
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional: Specifies the format of the bearer token
          description: 'Enter JWT Bearer token in the format: Bearer {token}'
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply bearerAuth globally to all operations
      },
    ],
  },
  // Path to the API docs files (e.g., route files with JSDoc comments)
  apis: [path.resolve(__dirname, '../routes/*.ts')],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec; 