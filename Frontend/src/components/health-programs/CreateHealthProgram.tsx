import React, { useState } from 'react';
import { CreateHealthProgramInput } from '../../types/healthProgram';
import { healthProgramService } from '../../services/healthProgramService';

/**
 * Props for the CreateHealthProgram component
 * @property onProgramCreated - Callback function to be called when a program is successfully created
 */
interface CreateHealthProgramProps {
  onProgramCreated: () => void;
}

/**
 * Component for creating new health programs
 * Handles form state, validation, and submission
 */
export const CreateHealthProgram: React.FC<CreateHealthProgramProps> = ({ onProgramCreated }) => {
  // State for form data
  const [formData, setFormData] = useState<CreateHealthProgramInput>({
    name: '',
    description: '',
  });
  // State for error messages
  const [error, setError] = useState<string | null>(null);
  // State for loading status during submission
  const [loading, setLoading] = useState(false);

  /**
   * Handles changes to form input fields
   * Updates the formData state with the new values
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles form submission
   * Creates a new health program and calls the onProgramCreated callback
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await healthProgramService.createProgram(formData);
      setFormData({ name: '', description: '' });
      onProgramCreated();
    } catch (err) {
      setError('Failed to create health program');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Render the create program form
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Health Program</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Program Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter program name"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter program description"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {loading ? 'Creating...' : 'Create Program'}
        </button>
      </form>
    </div>
  );
}; 