import { Response } from 'express';
import mongoose from 'mongoose';

// Function to handle common Mongoose errors and send appropriate responses
export const handleMongooseError = (error: any, res: Response) => {
  // Duplicate key error (e.g., unique field constraint violation)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    return res.status(409).json({ // 409 Conflict
      message: `Duplicate field value entered: ${field} must be unique. Value: ${value}`,
      field,
    });
  }

  // Validation Error (e.g., required field missing, type mismatch)
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((el: any) => ({
      field: el.path,
      message: el.message,
    }));
    return res.status(400).json({ // 400 Bad Request
      message: 'Validation failed',
      errors,
    });
  }

  // Cast Error (e.g., invalid ObjectId format)
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ // 400 Bad Request
      message: `Invalid ${error.path}: ${error.value}. Expected type ${error.kind}.`,
      field: error.path,
    });
  }

  // General Server Error
  console.error('Unhandled Mongoose Error:', error);
  res.status(500).json({ message: 'Server error processing request' });
}; 