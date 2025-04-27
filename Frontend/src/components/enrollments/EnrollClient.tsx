import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaCalendarAlt, FaCheck, FaSearch } from 'react-icons/fa';
import { HealthProgram } from '../../types/healthProgram';
import { EnrollmentStatus, CreateEnrollmentInput } from '../../types/enrollment';
import { Client } from '../../types/client';
import { EnrollmentWithDetails } from '../../types/enrollment';
import { enrollmentService } from '../../services/enrollmentService';
import { useParams } from 'react-router-dom';

interface EnrollClientProps {
  onEnrollmentComplete: () => void;
  onCancel: () => void;
}

export const EnrollClient: React.FC<EnrollClientProps> = ({
  onEnrollmentComplete,
  onCancel
}) => {
  const { clientId } = useParams<{ clientId: string }>();
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>(clientId || '');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [showClientSelect, setShowClientSelect] = useState(!clientId);
  const [selectedStatus, setSelectedStatus] = useState<EnrollmentStatus>(EnrollmentStatus.Active);
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);

  useEffect(() => {
    fetchPrograms();
    fetchClients();
    if (clientId) {
      fetchClientEnrollments(clientId);
    }
  }, [clientId]);

  useEffect(() => {
    console.log('Selected client state:', selectedClient);
  }, [selectedClient]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health-programs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }

      const data = await response.json();
      setPrograms(data.data);
    } catch (err: any) {
      console.error('Error fetching programs:', err);
      setError(err.message || 'Failed to load programs');
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clients', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data = await response.json();
      setClients(data.data);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'Failed to load clients');
    }
  };

  const fetchClientEnrollments = async (clientId: string) => {
    try {
      const enrollments = await enrollmentService.getClientEnrollments(clientId);
      setEnrollments(enrollments);
    } catch (err: any) {
      console.error('Error fetching client enrollments:', err);
      setError(err.message || 'Failed to load client enrollments');
    }
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedPrograms(prev => {
      if (prev.includes(programId)) {
        return prev.filter(id => id !== programId);
      }
      return [...prev, programId];
    });
  };

  const validateDates = () => {
    if (endDate && new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!validateDates()) {
      setLoading(false);
      return;
    }

    try {
      const enrollmentData: CreateEnrollmentInput = {
        clientId: selectedClient,
        programId: selectedPrograms[0],
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        status: selectedStatus
      };

      await enrollmentService.createEnrollment(enrollmentData);
      setSuccess('Successfully enrolled in program');
      
      if (selectedClient) {
        fetchClientEnrollments(selectedClient);
      }
      
      setTimeout(() => {
        onEnrollmentComplete();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to enroll in program');
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    console.log('Selected client:', clientId);
    setSelectedClient(clientId);
    setShowClientSelect(false);
    fetchClientEnrollments(clientId);
  };

  const filteredClients = clients.filter(client => 
    clientSearchQuery === '' ||
    client.firstName.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.lastName.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  if (showClientSelect) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaUserPlus className="mr-3" />
            Select Client
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={clientSearchQuery}
              onChange={(e) => setClientSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {client.firstName} {client.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.contactNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleClientSelect(client.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaUserPlus className="mr-3" />
          Enroll Client in Programs
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Programs
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {programs.map((program) => (
              <div key={program.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`program-${program.id}`}
                  checked={selectedPrograms.includes(program.id)}
                  onChange={() => handleProgramSelect(program.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`program-${program.id}`} className="ml-2 block text-sm text-gray-900">
                  {program.name} - {program.description}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as EnrollmentStatus)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={EnrollmentStatus.Active}>Active</option>
            <option value={EnrollmentStatus.Completed}>Completed</option>
            <option value={EnrollmentStatus.Cancelled}>Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date (Optional)
          </label>
          <div className="relative">
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {success}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setShowClientSelect(true)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Change Client
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
          >
            {loading ? (
              'Enrolling...'
            ) : (
              <>
                <FaCheck className="mr-2" />
                Enroll Client
              </>
            )}
          </button>
        </div>
      </form>

      {/* Enrollments Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Current Enrollments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {enrollment.client ? `${enrollment.client.firstName} ${enrollment.client.lastName}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {enrollment.program ? enrollment.program.name : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      enrollment.status === EnrollmentStatus.Active ? 'bg-green-100 text-green-800' :
                      enrollment.status === EnrollmentStatus.Completed ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(enrollment.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {enrollment.endDate ? new Date(enrollment.endDate).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}; 