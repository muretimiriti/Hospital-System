import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUserMd, FaNotesMedical, FaCheck } from 'react-icons/fa';
import { CreateEnrollmentInput } from '../../types/enrollment';
import { HealthProgram } from '../../types/healthProgram';
import { enrollmentService } from '../../services/enrollmentService';
import { healthProgramService } from '../../services/healthProgramService';
import { theme } from '../../styles/theme';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white shadow-lg rounded-lg p-6"
      style={{ backgroundColor: theme.colors.background.paper }}
    >
      <div className="flex items-center mb-6">
        <FaUserMd className="text-2xl mr-3" style={{ color: theme.colors.primary.main }} />
        <h2 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>
          Enroll in Program
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Program Selection Section */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search programs by name or description..."
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              style={{ borderColor: theme.colors.primary.light }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Program List */}
            <motion.div
              className="border rounded-lg overflow-hidden"
              style={{ borderColor: theme.colors.primary.light }}
            >
              <div className="p-3 border-b" style={{ backgroundColor: theme.colors.primary.light }}>
                <h3 className="font-medium text-white">Available Programs</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {filteredPrograms.map((program) => (
                    <motion.div
                      key={program.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={() => handleProgramSelect(program)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        formData.programId === program.id ? 'bg-blue-50 border-l-4' : ''
                      }`}
                      style={{
                        borderLeftColor: formData.programId === program.id ? theme.colors.primary.main : 'transparent',
                      }}
                    >
                      <h4 className="font-medium" style={{ color: theme.colors.text.primary }}>
                        {program.name}
                      </h4>
                      <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                        {program.description}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredPrograms.length === 0 && (
                  <div className="p-3 text-center" style={{ color: theme.colors.text.disabled }}>
                    No programs found matching your search
                  </div>
                )}
              </div>
            </motion.div>

            {/* Selected Program Details */}
            <motion.div
              className="border rounded-lg"
              style={{ borderColor: theme.colors.primary.light }}
            >
              <div className="p-3 border-b" style={{ backgroundColor: theme.colors.primary.light }}>
                <h3 className="font-medium text-white">Selected Program</h3>
              </div>
              <div className="p-4">
                <AnimatePresence mode="wait">
                  {selectedProgram ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <h4 className="font-semibold text-lg mb-2" style={{ color: theme.colors.text.primary }}>
                        {selectedProgram.name}
                      </h4>
                      <p className="mb-4" style={{ color: theme.colors.text.secondary }}>
                        {selectedProgram.description}
                      </p>
                      <div className="text-sm" style={{ color: theme.colors.text.disabled }}>
                        Created: {new Date(selectedProgram.createdAt).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-4"
                      style={{ color: theme.colors.text.disabled }}
                    >
                      Select a program to view details
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <div className="flex items-center mb-2">
            <FaNotesMedical className="mr-2" style={{ color: theme.colors.primary.main }} />
            <label htmlFor="notes" className="block text-sm font-medium" style={{ color: theme.colors.text.primary }}>
              Notes (Optional)
            </label>
          </div>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            style={{ borderColor: theme.colors.primary.light }}
            placeholder="Add any additional notes about the enrollment"
          />
          <p className="mt-1 text-sm" style={{ color: theme.colors.text.secondary }}>
            {(formData.notes || '').length}/500 characters
          </p>
        </div>

        {/* Error Messages */}
        <AnimatePresence>
          {validationErrors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
              style={{ borderColor: theme.colors.error.light }}
            >
              <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
              <ul className="list-disc list-inside text-red-600">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
              style={{ borderColor: theme.colors.error.light }}
            >
              <p className="text-red-600">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <motion.button
            type="button"
            onClick={() => onEnrollmentCreated()}
            className="px-4 py-2 border rounded-md"
            style={{
              borderColor: theme.colors.primary.light,
              color: theme.colors.text.primary,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded text-white flex items-center"
            style={{
              backgroundColor: loading ? theme.colors.primary.light : theme.colors.primary.main,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Enrolling...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Enroll in Program
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}; 