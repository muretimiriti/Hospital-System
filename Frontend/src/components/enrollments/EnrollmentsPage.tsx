import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaFilter, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import EnrollClient from './EnrollClient';
import { EnrollmentWithDetails } from '../../types/enrollment';
import { Client } from '../../types/client';
import { HealthProgram } from '../../types/healthProgram';
import { enrollmentService } from '../../services/enrollmentService';

export const EnrollmentsPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showClientSelectModal, setShowClientSelectModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    program: 'all',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enrollmentsRes, clientsRes, programsRes] = await Promise.all([
        fetch('http://localhost:5000/api/enrollments', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/clients', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/health-programs', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (!enrollmentsRes.ok || !clientsRes.ok || !programsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [enrollmentsData, clientsData, programsData] = await Promise.all([
        enrollmentsRes.json(),
        clientsRes.json(),
        programsRes.json()
      ]);

      setEnrollments(enrollmentsData.data || []);
      setClients(clientsData.data || []);
      setPrograms(programsData.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      setEnrollments([]);
      setClients([]);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredEnrollments = enrollments?.filter(enrollment => {
    if (!enrollment) return false;
    
    const matchesSearch = searchQuery === '' || 
      enrollment.client?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.client?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.program?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filters.status === 'all' || enrollment.status === filters.status;
    const matchesProgram = filters.program === 'all' || enrollment.program?.id === filters.program;
    const matchesDateRange = (!filters.startDate || new Date(enrollment.startDate) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(enrollment.startDate) <= new Date(filters.endDate));

    return matchesSearch && matchesStatus && matchesProgram && matchesDateRange;
  }) || [];

  const filteredClients = clients.filter(client => 
    clientSearchQuery === '' ||
    client.firstName.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.lastName.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    setShowClientSelectModal(false);
    setShowEnrollModal(true);
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
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaUserPlus className="mr-3" />
          Client Enrollments
        </h1>
        <button
          onClick={() => setShowClientSelectModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          New Enrollment
        </button>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or program..."
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
            <select
              name="program"
              value={filters.program}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option key="all" value="all">All Programs</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enrollments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEnrollments.map((enrollment) => (
                <motion.tr
                  key={enrollment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {enrollment.client?.firstName} {enrollment.client?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{enrollment.program.name}</div>
                    <div className="text-sm text-gray-500">{enrollment.program.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${enrollment.status === 'active' ? 'bg-green-100 text-green-800' :
                        enrollment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'}`}>
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(enrollment.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {enrollment.endDate ? new Date(enrollment.endDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedClient(enrollment.client.id);
                        setShowEnrollModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        // Handle unenrollment
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Unenroll
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Client Selection Modal */}
      {showClientSelectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Select Client</h2>
              <button
                onClick={() => setShowClientSelectModal(false)}
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
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {client.firstName} {client.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.contactNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleClientSelect(client.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Select
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enroll Client Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <EnrollClient
            onEnrollmentComplete={() => {
              setShowEnrollModal(false);
              fetchData();
            }}
            onCancel={() => setShowEnrollModal(false)}
          />
        </div>
      )}
    </div>
  );
}; 