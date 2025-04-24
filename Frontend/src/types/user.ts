import { EntityId, ISODateString } from './common';

export interface User {
  id: EntityId;
  email: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateUserInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
} 