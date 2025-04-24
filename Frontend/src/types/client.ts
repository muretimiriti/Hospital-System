// Core client data structure
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  email: string;
  address: string;
  enrolledPrograms: string[]; // Array of program IDs
  createdAt: string;
  updatedAt: string;
}

// Input type for creating a new client
export interface CreateClientInput {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  email: string;
  address: string;
}

// Input type for updating an existing client
export interface UpdateClientInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  contactNumber?: string;
  email?: string;
  address?: string;
}

// Extended client type that includes program details
export interface ClientWithPrograms extends Client {
  programDetails: {
    id: string;
    name: string;
    description: string;
  }[];
} 