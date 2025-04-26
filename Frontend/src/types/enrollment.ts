import { EntityId, ISODateString } from './common';

export interface Enrollment {
  id: EntityId;
  clientId: EntityId;
  programId: EntityId;
  status: 'active' | 'completed' | 'cancelled';
  enrollmentDate: ISODateString;
  completionDate?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateEnrollmentInput {
  clientId: EntityId;
  programId: EntityId;
  startDate: ISODateString;
}

export interface UpdateEnrollmentInput {
  status?: Enrollment['status'];
  completionDate?: ISODateString;
}

export interface EnrollmentWithDetails extends Enrollment {
  program: {
    id: EntityId;
    name: string;
    description: string;
    duration: number;
    cost: number;
  };
  client: {
    id: EntityId;
    firstName: string;
    lastName: string;
    email: string;
  };
} 