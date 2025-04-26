import React, { useEffect, useState } from 'react';
import { HealthProgram } from '../../types/healthProgram';
import { healthProgramService } from '../../services/healthProgramService';
import { ApiResponse } from '../../types/common';

export const HealthProgramList: React.FC = () => {
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await healthProgramService.getAllPrograms();
      setPrograms(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch health programs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      setError('Invalid program ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await healthProgramService.deleteProgram(id);
        setPrograms(programs.filter(program => program.id !== id));
      } catch (err) {
        setError('Failed to delete health program');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Health Programs</h2>
      <div className="grid gap-4">
        {programs.map((program) => (
          <div
            key={program.id}
            className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{program.name}</h3>
                <p className="text-gray-600 mt-2">{program.description}</p>
                <div className="mt-2 space-y-1">
                  <p key={`${program.id}-duration`} className="text-sm text-gray-500">
                    Duration: {program.duration} weeks
                  </p>
                  <p key={`${program.id}-cost`} className="text-sm text-gray-500">
                    Cost: ${program.cost}
                  </p>
                  <p key={`${program.id}-participants`} className="text-sm text-gray-500">
                    Participants: {program.currentParticipants}/{program.maxParticipants}
                  </p>
                  <p key={`${program.id}-startDate`} className="text-sm text-gray-500">
                    Start Date: {new Date(program.startDate).toLocaleDateString()}
                  </p>
                  <p key={`${program.id}-endDate`} className="text-sm text-gray-500">
                    End Date: {new Date(program.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDelete(program.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 