import mongoose from 'mongoose';
import { config } from 'dotenv';
import { beforeAll, afterEach, afterAll } from '@jest/globals';

// Load environment variables
config();

// Connect to test database before running tests
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-test';
  await mongoose.connect(mongoUri);
});

// Clear database after each test
afterEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
}); 