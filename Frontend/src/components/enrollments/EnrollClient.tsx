import React, { useState, useEffect } from 'react';
import { HealthProgram } from '../../types/healthProgram';
import { healthProgramService } from '../../services/healthProgramService';
import { enrollmentService, Enrollment } from '../../services/enrollmentService';
import { useNotification } from '../../contexts/NotificationContext';

interface EnrollClientProps {
  clientId: string;
  onEnrollmentComplete?: () => void;
}

export const EnrollClient: React.FC<EnrollClientProps> = ({ clientId, onEnrollmentComplete }) => {
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [currentEnrollments, setCurrentEnrollments] = useState<Enrollment[]>([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchAvailablePrograms();
    fetchCurrentEnrollments();
  }, [clientId]);

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

  const fetchCurrentEnrollments = async () => {
    try {
      const response = await enrollmentService.getClientEnrollments(clientId);
      setCurrentEnrollments(response.data);
    } catch (error) {
      showNotification({ message: 'Failed to fetch current enrollments', type: 'error' });
    }
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedProgramIds(prev => {
      if (prev.includes(programId)) {
        return prev.filter(id => id !== programId);
      }
      return [...prev, programId];
    });
  };

  const handleEnroll = async () => {
    if (selectedProgramIds.length === 0) {
      showNotification({ message: 'Please select at least one program', type: 'error' });
      return;
    }

    setEnrolling(true);
    try {
      // Enroll in all selected programs
      await Promise.all(
        selectedProgramIds.map(programId =>
          enrollmentService.createEnrollment({
            clientId,
            programId,
            startDate: new Date().toISOString(),
          })
        )
      );
      showNotification({ message: 'Successfully enrolled in selected programs', type: 'success' });
      // Refresh enrollments and available programs
      await Promise.all([
        fetchCurrentEnrollments(),
        fetchAvailablePrograms()
      ]);
      setSelectedProgramIds([]);
      onEnrollmentComplete?.();
    } catch (error) {
      showNotification({ message: 'Failed to enroll in programs', type: 'error' });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading programs...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Enroll in Health Programs</h3>
      
      {/* Current Enrollments */}
      {currentEnrollments.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-2">Current Enrollments</h4>
          <div className="space-y-2">
            {currentEnrollments.map(enrollment => (
              <div key={enrollment.id} className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">
                  Program ID: {enrollment.programId} - Status: {enrollment.status}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Enrolled on: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Programs */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Available Programs</h4>
        <div className="space-y-2">
          {programs.map((program) => (
            <div
              key={program.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedProgramIds.includes(program.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleProgramSelect(program.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium">{program.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">
                      Duration: {program.duration} weeks
                    </p>
                    <p className="text-sm text-gray-500">
                      Cost: ${program.cost}
                    </p>
                    <p className="text-sm text-gray-500">
                      Participants: {program.currentParticipants}/{program.maxParticipants}
                    </p>
                    <p className="text-sm text-gray-500">
                      Start Date: {new Date(program.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      End Date: {new Date(program.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProgramIds.includes(program.id)}
                    onChange={() => handleProgramSelect(program.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleEnroll}
          disabled={enrolling || selectedProgramIds.length === 0}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {enrolling ? 'Enrolling...' : `Enroll in ${selectedProgramIds.length} Program(s)`}
        </button>
      </div>
    </div>
  );
}; 