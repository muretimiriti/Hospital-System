import React, { useState, useEffect } from 'react';
import { CreateEnrollmentInput } from '../../types/enrollment';
import { HealthProgram } from '../../types/healthProgram';
import { enrollmentService } from '../../services/enrollmentService';
import { healthProgramService } from '../../services/healthProgramService';

interface EnrollmentFormProps {
  clientId: string;
  onEnrollmentCreated: () => void;
}

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ clientId, onEnrollmentCreated }) => {
  const [formData, setFormData] = useState<CreateEnrollmentInput>({
    clientId,
    programId: '',
    notes: '',
  });
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<HealthProgram | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch available programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await healthProgramService.getAllPrograms();
        setPrograms(data);
      } catch (err) {
        setError('Failed to fetch programs');
        console.error(err);
      }
    };

    fetchPrograms();
  }, []);

  // Update selected program when programId changes
  useEffect(() => {
    const program = programs.find(p => p.id === formData.programId);
    setSelectedProgram(program || null);
  }, [formData.programId, programs]);

  // Filter programs based on search term
  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle program selection
  const handleProgramSelect = (program: HealthProgram) => {
    setFormData(prev => ({
      ...prev,
      programId: program.id,
    }));
  };

  // Validate form data
  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.programId) {
      errors.push('Please select a program');
    }
    
    if (formData.notes && formData.notes.length > 500) {
      errors.push('Notes cannot exceed 500 characters');
    }
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form data
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await enrollmentService.createEnrollment(formData);
      setFormData({
        clientId,
        programId: '',
        notes: '',
      });
      setValidationErrors([]);
      onEnrollmentCreated();
    } catch (err) {
      setError('Failed to create enrollment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Enroll in Program</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Program Selection Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Programs
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search programs by name or description..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Program List */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <h3 className="font-medium">Available Programs</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredPrograms.map((program) => (
                  <div
                    key={program.id}
                    onClick={() => handleProgramSelect(program)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                      formData.programId === program.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <h4 className="font-medium">{program.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{program.description}</p>
                  </div>
                ))}
                {filteredPrograms.length === 0 && (
                  <div className="p-3 text-gray-500 text-center">
                    No programs found matching your search
                  </div>
                )}
              </div>
            </div>

            {/* Selected Program Details */}
            <div className="border rounded-lg">
              <div className="bg-gray-50 p-3 border-b">
                <h3 className="font-medium">Selected Program</h3>
              </div>
              <div className="p-4">
                {selectedProgram ? (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{selectedProgram.name}</h4>
                    <p className="text-gray-600 mb-4">{selectedProgram.description}</p>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(selectedProgram.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    Select a program to view details
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add any additional notes about the enrollment"
          />
          <p className="mt-1 text-sm text-gray-500">
            {(formData.notes || '').length}/500 characters
          </p>
        </div>

        {/* Error Messages */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
            <ul className="list-disc list-inside text-red-600">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => onEnrollmentCreated()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Enrolling...' : 'Enroll in Program'}
          </button>
        </div>
      </form>
    </div>
  );
}; 