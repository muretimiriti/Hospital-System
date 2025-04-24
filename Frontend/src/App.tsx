import { useState } from 'react';
import { HealthPrograms } from './components/health-programs/HealthPrograms';
import { Clients } from './components/clients/Clients';

function App() {
  const [activeTab, setActiveTab] = useState<'programs' | 'clients'>('programs');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Health Information System</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('programs')}
                className={`px-4 py-2 rounded ${
                  activeTab === 'programs'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Health Programs
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-4 py-2 rounded ${
                  activeTab === 'clients'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Clients
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        {activeTab === 'programs' ? <HealthPrograms /> : <Clients />}
      </main>
    </div>
  );
}

export default App;
