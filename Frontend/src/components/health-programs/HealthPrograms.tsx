import React, { useState } from 'react';
import { HealthProgramList } from './HealthProgramList';
import { CreateHealthProgram } from './CreateHealthProgram';

/**
 * Main component for health program management
 * Handles the switching between list view and create form
 * Manages the state of which view is currently displayed
 */
export const HealthPrograms: React.FC = () => {
  // State to control whether the create form is shown
  const [showCreateForm, setShowCreateForm] = useState(false);

  /**
   * Callback function called when a new program is created
   * Switches back to the list view
   */
  const handleProgramCreated = () => {
    setShowCreateForm(false);
  };

  // Render the main health programs management interface
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

      {/* Conditionally render either the create form or the program list */}
      {showCreateForm ? (
        <CreateHealthProgram onProgramCreated={handleProgramCreated} />
      ) : (
        <HealthProgramList />
      )}
    </div>
  );
}; 