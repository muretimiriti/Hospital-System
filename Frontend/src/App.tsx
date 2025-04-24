import { HealthPrograms } from './components/health-programs/HealthPrograms';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Health Information System</h1>
        </div>
      </nav>
      <main>
        <HealthPrograms />
      </main>
    </div>
  );
}

export default App;
