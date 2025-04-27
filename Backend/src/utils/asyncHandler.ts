import { Request, Response, NextFunction } from 'express';

/**
 * Type definition for async route handlers
 * Represents a function that handles Express requests and returns a Promise
 */
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wrapper function for async route handlers that catches errors and passes them to Express error handler
 * @param {AsyncHandler} fn - The async route handler function to wrap
 * @returns {Function} Express middleware function that handles errors
 * 
 * @example
 * // Instead of:
 * router.get('/', async (req, res, next) => {
 *   try {
 *     // ... async code ...
 *   } catch (error) {
 *     next(error);
 *   }
 * });
 * 
 * // You can write:
 * router.get('/', asyncHandler(async (req, res) => {
 *   // ... async code ...
 * }));
 */
const asyncHandler = (fn: AsyncHandler) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next); // Pass errors to Express error handler
};

export default asyncHandler; 