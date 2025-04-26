import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/analyticsService';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { motion } from 'framer-motion';
import { FaUsers, FaUserMd, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

interface DashboardStats {
  totalClients: number;
  totalPrograms: number;
  totalEnrollments: number;
  enrollmentsPerProgram: Array<{
    programId: string;
    programName: string;
    count: number;
  }>;
  mostPopularProgram: {
    programId: string;
    programName: string;
    count: number;
  };
  enrollmentTrend: Array<{
    date: string;
    count: number;
  }>;
  genderDistribution: Array<{
    gender: string;
    count: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await getDashboardStats();
        setStats(response.data);
        setError(null);
      } catch (err: any) {
        if (err.message === 'Failed to fetch dashboard stats' && err.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to load dashboard statistics');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

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

  if (!stats) {
    return null;
  }

  return (
    <div className="p-6">
      <motion.h1 
        className="text-3xl font-bold mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard Overview
      </motion.h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <FaUsers className="text-2xl text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Clients</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalClients}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FaUserMd className="text-2xl text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Programs</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalPrograms}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <FaChartLine className="text-2xl text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Enrollments</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalEnrollments}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <FaCalendarAlt className="text-2xl text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Most Popular Program</h3>
              <p className="text-xl font-bold text-yellow-600">{stats.mostPopularProgram.programName}</p>
              <p className="text-sm text-gray-500">{stats.mostPopularProgram.count} enrollments</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrollments per Program Chart */}
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Enrollments per Program</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.enrollmentsPerProgram}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="programName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Enrollments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Gender Distribution Chart */}
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Gender Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.genderDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${entry.gender}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Enrollment Trend Chart */}
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Enrollment Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.enrollmentTrend}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="Enrollments" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 