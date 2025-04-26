import React, { useState, useEffect } from 'react';
import { HealthProgram } from '../../types/healthProgram';
import { healthProgramService } from '../../services/healthProgramService';
import { enrollmentService, CreateEnrollmentInput } from '../../services/enrollmentService';
import { useNotification } from '../../contexts/NotificationContext';

interface EnrollClientProps {
  clientId: string;
  onEnrollmentComplete?: () => void;
}

export const EnrollClient: React.FC<EnrollClientProps> = ({ clientId, onEnrollmentComplete }) => {
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchAvailablePrograms();
  }, []);

  const fetchAvailablePrograms = async () => {
    try {
      setLoading(true);
      const response = await healthProgramService.getAllPrograms();
      // Filter programs that are not full
      const availablePrograms = response.data.filter(
        program => program.currentParticipants < program.maxParticipants
      );
      setPrograms(availablePrograms);
    } catch (error) {
      showNotification({ message: 'Failed to fetch available programs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedProgramId) {
      showNotification({ message: 'Please select a program', type: 'error' });
      return;
    }

    try {
      const enrollment: CreateEnrollmentInput = {
        clientId,
        programId: selectedProgramId,
        startDate: new Date().toISOString(),
      };
      await enrollmentService.createEnrollment(enrollment);
      showNotification({ message: 'Successfully enrolled in program', type: 'success' });
      onEnrollmentComplete?.();
    } catch (error) {
      showNotification({ message: 'Failed to enroll in program', type: 'error' });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading programs...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Enroll in Health Program</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Program
          </label>
          <select
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name} - ${program.cost} ({program.duration} weeks)
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleEnroll}
          disabled={!selectedProgramId}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
}; 