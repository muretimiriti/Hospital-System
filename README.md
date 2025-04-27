# Hospital System

A comprehensive hospital management system with client management, health programs, and enrollment tracking.

## Recent Updates and Improvements

### 1. Enhanced Enrollment Management
- **Advanced Search Functionality**
  - Case-insensitive search across multiple fields
  - Search by client name, program details, and status
  - Improved search accuracy with proper string handling

- **Robust Filtering System**
  - Status filtering (Active, Completed, Cancelled)
  - Program filtering with improved ID handling
  - Date range filtering with proper time boundaries
  - Combined filter support

- **Improved Data Handling**
  - Better error handling and user feedback
  - Type-safe data processing
  - Null/undefined handling
  - Array validation

### 2. User Interface Enhancements
- **Loading States**
  - Added loading spinners
  - Clear loading indicators
  - Smooth transitions

- **Empty State Handling**
  - Improved "No results" messages
  - Better user guidance
  - Clear feedback for search results

### 3. Technical Improvements
- **Code Quality**
  - Enhanced type safety
  - Better error handling
  - Improved code organization
  - Added comprehensive comments

- **Performance**
  - Optimized data fetching
  - Improved filter performance
  - Better state management

## Features

- User Authentication and Authorization
- Client Management
- Health Program Management
- Enrollment Tracking
- Secure API Endpoints
- Input Validation
- Rate Limiting
- CORS Protection
- Comprehensive Testing

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Express Validator
- Jest for Testing
- Supertest for API Testing

### Frontend
- React
- TypeScript
- Material-UI
- React Router
- Axios

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd hospital-system
```

2. Install dependencies:
```bash
cd Backend
npm install
```

3. Create a `.env` file in the Backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

## API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: `{ "_id": "user_id", "email": "user@example.com", "token": "jwt_token" }`

#### Login User
- **POST** `/api/auth/login`
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: `{ "_id": "user_id", "email": "user@example.com", "token": "jwt_token" }`

#### Get User Profile
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**: `{ "_id": "user_id", "email": "user@example.com", "createdAt": "timestamp" }`

### Client Endpoints

#### Create Client
- **POST** `/api/clients`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**: `{ "name": "John Doe", "email": "john@example.com", "phone": "+1234567890" }`

#### Get All Clients
- **GET** `/api/clients`
- **Headers**: `Authorization: Bearer jwt_token`

#### Get Client by ID
- **GET** `/api/clients/:id`
- **Headers**: `Authorization: Bearer jwt_token`

### Health Program Endpoints

#### Create Program
- **POST** `/api/programs`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**: `{ "name": "Weight Loss", "description": "12-week program", "duration": 12 }`

#### Get All Programs
- **GET** `/api/programs`
- **Headers**: `Authorization: Bearer jwt_token`

### Enrollment Endpoints

#### Create Enrollment
- **POST** `/api/enrollments`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**: `{ "clientId": "client_id", "programId": "program_id", "startDate": "2024-03-20" }`

#### Get All Enrollments
- **GET** `/api/enrollments`
- **Headers**: `Authorization: Bearer jwt_token`
- **Query Parameters**:
  - `status`: Filter by enrollment status
  - `program`: Filter by program ID
  - `startDate`: Filter by start date
  - `endDate`: Filter by end date

## Testing

### Backend Tests

Run the test suite:
```bash
cd Backend
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Frontend Tests

Run the test suite:
```bash
cd Frontend
npm test
```

## Deployment

### Backend Deployment

1. Build the TypeScript code:
```bash
cd Backend
npm run build
```

2. Set up environment variables on your hosting platform:
- PORT
- MONGODB_URI
- JWT_SECRET
- FRONTEND_URL

3. Deploy to your preferred hosting platform (e.g., Heroku, AWS, DigitalOcean)

### Frontend Deployment

1. Build the React application:
```bash
cd Frontend
npm run build
```

2. Deploy the `build` directory to your preferred hosting platform

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS protection
- Secure HTTP headers
- Audit logging for sensitive operations

## Future Improvements

1. **Performance Optimization**
   - Implement pagination for large datasets
   - Add caching for frequently accessed data
   - Optimize search algorithms

2. **Additional Features**
   - Export functionality for enrollment data
   - Advanced reporting capabilities
   - Batch operations for enrollments

3. **User Experience**
   - Add more interactive filters
   - Implement real-time search
   - Add keyboard shortcuts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 