import { EntityId, ISODateString, EnrollmentStatus } from './common';

// Core enrollment data structure
export interface Enrollment {
  id: EntityId;
  clientId: EntityId;
  programId: EntityId;
  enrollmentDate: ISODateString;
  status: EnrollmentStatus;
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Input type for creating a new enrollment
export interface CreateEnrollmentInput {
  clientId: EntityId;
  programId: EntityId;
  notes?: string;
}

// Input type for updating an enrollment
export interface UpdateEnrollmentInput {
  status?: EnrollmentStatus;
  notes?: string;
}

// Extended enrollment type that includes client and program details
export interface EnrollmentWithDetails extends Enrollment {
  client: {
    id: EntityId;
    firstName: string;
    lastName: string;
  };
  program: {
    id: EntityId;
    name: string;
    description: string;
  };
} 