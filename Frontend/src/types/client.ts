import { EntityId, ISODateString, Gender } from './common';
import { EnrollmentWithDetails } from './enrollment';

// Core client data structure
export interface Client {
  id: EntityId;
  firstName: string;
  lastName: string;
  dateOfBirth: ISODateString;
  gender: Gender;
  contactNumber: string;
  email: string;
  address: string;
  enrolledPrograms: EnrollmentWithDetails[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Input type for creating a new client
export interface CreateClientInput {
  firstName: string;
  lastName: string;
  dateOfBirth: ISODateString;
  gender: Gender;
  contactNumber: string;
  email: string;
  address: string;
}

// Input type for updating an existing client
export interface UpdateClientInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: ISODateString;
  gender?: Gender;
  contactNumber?: string;
  email?: string;
  address?: string;
}

// Extended client type that includes program details
export interface ClientWithPrograms extends Client {
  programDetails: Array<{
    id: EntityId;
    name: string;
    description: string;
  }>;
} 