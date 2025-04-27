import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { HealthProgram } from '../../types/healthProgram';
import { healthProgramService } from '../../services/healthProgramService';
import { CreateHealthProgram } from './CreateHealthProgram';

export const HealthProgramList: React.FC = () => {
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<HealthProgram | null>(null);

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

  const handleEdit = (program: HealthProgram) => {
    setEditingProgram(program);
  };

  const handleUpdate = async (updatedProgram: HealthProgram) => {
    try {
      await healthProgramService.updateProgram(updatedProgram.id, updatedProgram);
      setPrograms(programs.map(p => p.id === updatedProgram.id ? updatedProgram : p));
      setEditingProgram(null);
    } catch (err) {
      setError('Failed to update health program');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Health Programs</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          {showCreateForm ? 'Cancel' : 'Add New Program'}
        </button>
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <CreateHealthProgram onProgramCreated={() => {
            setShowCreateForm(false);
            fetchPrograms();
          }} />
        </motion.div>
      )}

      <div className="grid gap-4">
        {programs.map((program) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{program.name}</h3>
                <p className="text-gray-600 mt-2">{program.description}</p>
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
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(program)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(program.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {editingProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Program</h2>
              <button
                onClick={() => setEditingProgram(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
            <CreateHealthProgram
              initialData={editingProgram}
              onProgramCreated={() => {
                setEditingProgram(null);
                fetchPrograms();
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}; 