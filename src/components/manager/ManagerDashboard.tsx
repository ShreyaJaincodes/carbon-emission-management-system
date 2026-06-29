import { Calculator, Trash2, ArrowLeft } from 'lucide-react';
import type { Mine } from '../../types';

interface ManagerDashboardProps {
  mine: Mine;
  onSelectCalculator: (type: 'emission' | 'waste') => void;
  onLogout: () => void;
}

export function ManagerDashboard({ mine, onSelectCalculator, onLogout }: ManagerDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Logout
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Manager</h1>
          <h2 className="text-2xl text-emerald-600 font-semibold mb-6">{mine.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
              <p className="text-gray-600 font-medium">Location</p>
              <p className="text-lg font-bold text-gray-900">{mine.location === 'Barmer' ? 'Barmer, Rajasthan' : 'Dhanbad, Jharkhand'}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <p className="text-gray-600 font-medium">Mine Type</p>
              <p className="text-lg font-bold text-gray-900">{mine.mine_type}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
              <p className="text-gray-600 font-medium">Total Employees</p>
              <p className="text-lg font-bold text-gray-900">{mine.total_employees.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => onSelectCalculator('emission')}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-gray-200 text-left"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-6">
              <Calculator className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Carbon Emission Calculator</h3>
            <p className="text-gray-600 leading-relaxed">
              Calculate total carbon emissions, sequestration, and receive AI-powered recommendations for carbon neutrality.
            </p>
          </button>

          <button
            onClick={() => onSelectCalculator('waste')}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-gray-200 text-left"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Waste Management</h3>
            <p className="text-gray-600 leading-relaxed">
              Track and manage overburden, organic waste, inorganic waste, and coal rejects with waste-to-energy solutions.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
