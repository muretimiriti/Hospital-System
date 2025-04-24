import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation middleware
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Auth validation rules
export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  validate,
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

// Client validation rules
export const clientValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-]{10,}$/)
    .withMessage('Please enter a valid phone number'),
  validate,
];

// Health Program validation rules
export const healthProgramValidation = [
  body('name')
    .notEmpty()
    .withMessage('Program name is required')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim(),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive number'),
  validate,
];

// Enrollment validation rules
export const enrollmentValidation = [
  body('clientId')
    .isMongoId()
    .withMessage('Invalid client ID'),
  body('programId')
    .isMongoId()
    .withMessage('Invalid program ID'),
  body('startDate')
    .isISO8601()
    .withMessage('Invalid start date'),
  validate,
]; 