import React, { useState } from 'react';
import { HealthProgramList } from './HealthProgramList';
import { CreateHealthProgram } from './CreateHealthProgram';

export const HealthPrograms: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleProgramCreated = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Health Programs Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {showCreateForm ? 'Cancel' : 'Create New Program'}
        </button>
      </div>

      {showCreateForm ? (
        <CreateHealthProgram onProgramCreated={handleProgramCreated} />
      ) : (
        <HealthProgramList />
      )}
    </div>
  );
}; 