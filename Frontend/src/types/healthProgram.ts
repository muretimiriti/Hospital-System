export interface HealthProgram {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHealthProgramInput {
  name: string;
  description: string;
}

export interface UpdateHealthProgramInput {
  name?: string;
  description?: string;
} 