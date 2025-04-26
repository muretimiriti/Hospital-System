import { EntityId, ISODateString } from './common';

export interface HealthProgram {
  id: EntityId;
  name: string;
  description: string;
  duration: number;
  cost: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: ISODateString;
  endDate: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateHealthProgramInput {
  name: string;
  description: string;
  duration: number;
  cost: number;
  maxParticipants: number;
  startDate: ISODateString;
  endDate: ISODateString;
}

export interface UpdateHealthProgramInput {
  name?: string;
  description?: string;
  duration?: number;
  cost?: number;
  maxParticipants?: number;
  startDate?: ISODateString;
  endDate?: ISODateString;
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