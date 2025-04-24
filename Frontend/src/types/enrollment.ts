// Core enrollment data structure
export interface Enrollment {
  id: string;
  clientId: string;
  programId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Input type for creating a new enrollment
export interface CreateEnrollmentInput {
  clientId: string;
  programId: string;
  notes?: string;
}

// Input type for updating an enrollment
export interface UpdateEnrollmentInput {
  status?: 'active' | 'completed' | 'cancelled';
  notes?: string;
}

// Extended enrollment type that includes client and program details
export interface EnrollmentWithDetails extends Enrollment {
  client: {
    id: string;
    firstName: string;
    lastName: string;
  };
  program: {
    id: string;
    name: string;
    description: string;
  };
} 