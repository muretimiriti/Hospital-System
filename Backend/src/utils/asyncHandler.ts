import { Request, Response, NextFunction } from 'express';

// Define a type for async handlers to improve type safety
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// Wrapper function to catch errors from async route handlers
const asyncHandler = (fn: AsyncHandler) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next); // Pass errors to Express error handler
};

export default asyncHandler; 