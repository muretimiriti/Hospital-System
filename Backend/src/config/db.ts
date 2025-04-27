import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Establishes a connection to the MongoDB database
 * @returns {Promise<void>} A promise that resolves when the connection is established
 * @throws {Error} If the connection fails or MONGODB_URI is not defined
 */
const connectDB = async () => {
  try {
    // Get MongoDB connection URI from environment variables
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('Error: MONGODB_URI is not defined in the environment variables');
      process.exit(1);
    }
    
    // Attempt to connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB; 