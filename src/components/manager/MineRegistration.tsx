import { useState } from 'react';
import { Factory, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Mine } from '../../types';

interface MineRegistrationProps {
  onBack: () => void;
  onSuccess: (mine: Mine) => void;
}

export function MineRegistration({ onBack, onSuccess }: MineRegistrationProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    managerName: '',
    managerEmail: '',
    managerContact: '',
    mineName: '',
    location: '' as 'Barmer' | 'Dhanbad' | '',
    mineType: '' as 'Opencast' | 'Underground' | '',
    annualProduction: '',
    totalEmployees: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('mines')
        .insert({
          name: formData.mineName,
          location: formData.location as 'Barmer' | 'Dhanbad',
          mine_type: formData.mineType as 'Opencast' | 'Underground',
          annual_production: parseFloat(formData.annualProduction),
          total_employees: parseInt(formData.totalEmployees),
          manager_name: formData.managerName,
          manager_email: formData.managerEmail,
          manager_contact: formData.managerContact,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onSuccess(data as Mine);
      }
    } catch (error) {
      console.error('Error registering mine:', error);
      alert('Failed to register mine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mine Registration</h1>
              <p className="text-gray-600">Register your mine to start tracking</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Manager Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manager Name</label>
                  <input
                    type="text"
                    required
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
                  <input
                    type="email"
                    required
                    value={formData.managerEmail}
                    onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="manager@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.managerContact}
                    onChange={(e) => setFormData({ ...formData, managerContact: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mine Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name of Mine</label>
                  <input
                    type="text"
                    required
                    value={formData.mineName}
                    onChange={(e) => setFormData({ ...formData, mineName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Enter mine name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value as 'Barmer' | 'Dhanbad' })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Location</option>
                    <option value="Barmer">Barmer, Rajasthan</option>
                    <option value="Dhanbad">Dhanbad, Jharkhand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mine Type</label>
                  <select
                    required
                    value={formData.mineType}
                    onChange={(e) => setFormData({ ...formData, mineType: e.target.value as 'Opencast' | 'Underground' })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Type</option>
                    <option value="Opencast">Opencast</option>
                    <option value="Underground">Underground</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Coal Production (Tonnes)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.annualProduction}
                    onChange={(e) => setFormData({ ...formData, annualProduction: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Employees</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.totalEmployees}
                    onChange={(e) => setFormData({ ...formData, totalEmployees: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'Registering...' : 'Submit Details'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
