import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import User, { IUser } from '../models/User';

// Extend the Express Request interface to include the user property
// This avoids TypeScript errors when assigning to req.user
declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }

      // Get user from the token ID (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        // User belonging to the token no longer exists
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
}; 