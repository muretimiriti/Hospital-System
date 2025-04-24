/**
 * Interface representing a health program in the system
 * @property id - Unique identifier for the program
 * @property name - Name of the health program (e.g., TB, Malaria, HIV)
 * @property description - Detailed description of the program
 * @property createdAt - Timestamp when the program was created
 * @property updatedAt - Timestamp when the program was last updated
 */
export interface HealthProgram {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for creating a new health program
 * @property name - Name of the health program
 * @property description - Detailed description of the program
 */
export interface CreateHealthProgramInput {
  name: string;
  description: string;
}

/**
 * Interface for updating an existing health program
 * All fields are optional as we may want to update only specific fields
 * @property name - New name for the program (optional)
 * @property description - New description for the program (optional)
 */
export interface UpdateHealthProgramInput {
  name?: string;
  description?: string;
} 