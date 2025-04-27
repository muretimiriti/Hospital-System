import React, { useState, useEffect } from 'react';
import { CreateHealthProgramInput, HealthProgram } from '../../types/healthProgram';
import { healthProgramService } from '../../services/healthProgramService';

interface CreateHealthProgramProps {
  onProgramCreated: () => void;
  initialData?: HealthProgram;
}

export const CreateHealthProgram: React.FC<CreateHealthProgramProps> = ({ 
  onProgramCreated,
  initialData 
}) => {
  const [formData, setFormData] = useState<CreateHealthProgramInput>({
    name: '',
    description: '',
    duration: 0,
    cost: 0,
    maxParticipants: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      const startDate = initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const endDate = initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '';
      
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        duration: initialData.duration || 0,
        cost: initialData.cost || 0,
        maxParticipants: initialData.maxParticipants || 0,
        startDate: startDate,
        endDate: endDate
      });
    } else {
      // Reset form when not in edit mode
      setFormData({
        name: '',
        description: '',
        duration: 0,
        cost: 0,
        maxParticipants: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'cost' || name === 'maxParticipants' 
        ? Number(value) || 0  // Ensure numeric values are never undefined
        : value || ''  // Ensure string values are never undefined
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.name) errors.push('Program name is required');
    if (!formData.description) errors.push('Description is required');
    if (formData.duration <= 0) errors.push('Duration must be greater than 0');
    if (formData.cost < 0) errors.push('Cost cannot be negative');
    if (formData.maxParticipants <= 0) errors.push('Maximum participants must be greater than 0');
    if (!formData.startDate) errors.push('Start date is required');
    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.push('End date must be after start date');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      setLoading(false);
      return;
    }

    try {
      if (initialData) {
        await healthProgramService.updateProgram(initialData.id, formData);
      } else {
        await healthProgramService.createProgram(formData);
      }
      setFormData({
        name: '',
        description: '',
        duration: 0,
        cost: 0,
        maxParticipants: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
      onProgramCreated();
    } catch (err) {
      setError(`Failed to ${initialData ? 'update' : 'create'} health program`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Edit Health Program' : 'Create New Health Program'}
      </h2>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (weeks)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
              Cost ($)
            </label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
              Max Participants
            </label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {loading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Program' : 'Create Program')}
        </button>
      </form>
    </div>
  );
}; 