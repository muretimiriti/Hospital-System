import { EntityId, ISODateString } from './common';

export enum EnrollmentStatus {
  Active = 'active',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

// Core enrollment data structure
export interface Enrollment {
  id: EntityId;
  clientId: EntityId;
  programId: EntityId;
  status: EnrollmentStatus;
  startDate: ISODateString;
  endDate?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Input type for creating a new enrollment
export interface CreateEnrollmentInput {
  clientId?: EntityId;
  programId?: EntityId;
  startDate: ISODateString;
  endDate?: ISODateString;
  status?: EnrollmentStatus;
}

// Input type for updating an enrollment
export interface UpdateEnrollmentInput {
  status?: EnrollmentStatus;
  startDate?: ISODateString;
  endDate?: ISODateString;
}

// Extended enrollment type that includes client and program details
export interface EnrollmentWithDetails {
  id: string;
  program: {
    id: string;
    name: string;
    description: string;
    duration: number;
    cost: number;
    startDate: string;
    endDate: string;
  };
  client?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  status: EnrollmentStatus;
  startDate: string;
  endDate?: string;
} 