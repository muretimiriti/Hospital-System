// Common type definitions for the application

// Date handling
export type ISODateString = string;

// ID handling
export type EntityId = string;

// References
export type Reference<T extends string> = T;

// Status enums
export enum EnrollmentStatus {
  Active = 'active',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

// Validation rules
export const VALIDATION_RULES = {
  email: /^\S+@\S+\.\S+$/,
  password: {
    minLength: 6
  },
  phone: {
    // Add phone validation regex if needed
    pattern: /^\+?[\d\s-]{10,}$/
  }
} as const;

// Type guards
export const isEnrollmentStatus = (value: string): value is EnrollmentStatus => {
  return Object.values(EnrollmentStatus).includes(value as EnrollmentStatus);
};

export const isGender = (value: string): value is Gender => {
  return Object.values(Gender).includes(value as Gender);
}; 