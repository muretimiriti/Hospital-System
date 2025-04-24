import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { generateToken } from '../utils/jwtUtils';
import { handleMongooseError } from '../utils/errorHandler';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    // Create new user (password hashing is handled by middleware in User model)
    const user = new User({ email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: token,
    });
  } catch (error: any) {
    handleMongooseError(error, res);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email, explicitly selecting password
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      // Generate token
      const token = generateToken(user._id.toString());

      res.status(200).json({
        _id: user._id,
        email: user.email,
        token: token,
      });
    } else {
      // Use a generic message for security
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  // req.user is populated by the protect middleware
  if (!req.user) {
    // This should ideally not happen if protect middleware is used correctly
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Return user data (without password)
  res.status(200).json({
    _id: req.user._id,
    email: req.user.email,
    createdAt: req.user.createdAt,
  });
}; 