import React, { useEffect, useState } from 'react';
import { ClientWithPrograms } from '../../types/client';
import { EnrollmentWithDetails } from '../../types/enrollment';
import { clientService } from '../../services/clientService';
import { enrollmentService } from '../../services/enrollmentService';
import { EnrollmentForm } from '../enrollments/EnrollmentForm';

interface ClientProfileProps {
  clientId: string;
}

export const ClientProfile: React.FC<ClientProfileProps> = ({ clientId }) => {
  const [client, setClient] = useState<ClientWithPrograms | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);

  // Fetch client and enrollment data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientData, enrollmentData] = await Promise.all([
          clientService.getClientById(clientId),
          enrollmentService.getClientEnrollments(clientId)
        ]);
        setClient(clientData);
        setEnrollments(enrollmentData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch client data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  // Handle enrollment status update
  const handleStatusUpdate = async (enrollmentId: string, newStatus: 'active' | 'completed' | 'cancelled') => {
    try {
      await enrollmentService.updateEnrollment(enrollmentId, { status: newStatus });
      setEnrollments(enrollments.map(enrollment => 
        enrollment.id === enrollmentId 
          ? { ...enrollment, status: newStatus }
          : enrollment
      ));
    } catch (err) {
      setError('Failed to update enrollment status');
      console.error(err);
    }
  };

  // Handle enrollment creation
  const handleEnrollmentCreated = () => {
    setShowEnrollmentForm(false);
    // Refresh enrollment data
    enrollmentService.getClientEnrollments(clientId).then(setEnrollments);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error || !client) {
    return <div className="text-red-500 text-center">{error || 'Client not found'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Client Information */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Client Profile</h2>
          <button
            onClick={() => setShowEnrollmentForm(!showEnrollmentForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {showEnrollmentForm ? 'Cancel Enrollment' : 'Enroll in Program'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name: {client.firstName} {client.lastName}</p>
            <p className="text-gray-600">DOB: {new Date(client.dateOfBirth).toLocaleDateString()}</p>
            <p className="text-gray-600">Gender: {client.gender}</p>
          </div>
          <div>
            <p className="text-gray-600">Contact: {client.contactNumber}</p>
            <p className="text-gray-600">Email: {client.email}</p>
            <p className="text-gray-600">Address: {client.address}</p>
          </div>
        </div>
      </div>

      {/* Enrollment Form or Enrolled Programs */}
      {showEnrollmentForm ? (
        <EnrollmentForm
          clientId={clientId}
          onEnrollmentCreated={handleEnrollmentCreated}
        />
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Enrolled Programs</h3>
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{enrollment.program.name}</h4>
                    <p className="text-gray-600">{enrollment.program.description}</p>
                    <p className="text-sm text-gray-500">
                      Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </p>
                    {enrollment.notes && (
                      <p className="text-sm text-gray-600 mt-2">Notes: {enrollment.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={enrollment.status}
                      onChange={(e) => handleStatusUpdate(enrollment.id, e.target.value as any)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {enrollments.length === 0 && (
              <p className="text-gray-500 text-center">No programs enrolled</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 