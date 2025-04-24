import { EntityId, ISODateString } from './common';

export interface HealthProgram {
  id: EntityId;
  name: string;
  description: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateHealthProgramInput {
  name: string;
  description: string;
}

export interface UpdateHealthProgramInput {
  name?: string;
  description?: string;
}

// Extended type for program with enrollment details
export interface HealthProgramWithEnrollments extends HealthProgram {
  enrollments: Array<{
    id: EntityId;
    clientId: EntityId;
    status: string;
    enrollmentDate: ISODateString;
  }>;
} 