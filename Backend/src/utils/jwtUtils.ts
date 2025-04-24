import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: Secret | undefined = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}
if (!JWT_EXPIRES_IN) {
  console.warn('Warning: JWT_EXPIRES_IN is not defined. Using default: 1d');
}

// Generates a JWT token for a given user ID
export const generateToken = (userId: string): string => {
  // Use the default '1d' directly to satisfy types.
  // Add runtime validation if JWT_EXPIRES_IN needs to be used dynamically.
  const options: SignOptions = {
    expiresIn: '1d', // Directly use a known valid type
  };
  
  // Log if the environment variable was set but isn't being used here for type safety
  if (process.env.JWT_EXPIRES_IN && process.env.JWT_EXPIRES_IN !== '1d') {
    console.warn(`Warning: Using default '1d' for JWT expiry. Configured JWT_EXPIRES_IN ('${process.env.JWT_EXPIRES_IN}') ignored due to type constraints.`);
  }

  return jwt.sign({ id: userId }, JWT_SECRET!, options);
};

// Verifies a JWT token and returns the decoded payload (or null)
export const verifyToken = (token: string): { id: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as { id: string; iat: number; exp: number };
    return { id: decoded.id };
  } catch (error) {
    return null; // Token is invalid or expired
  }
}; 