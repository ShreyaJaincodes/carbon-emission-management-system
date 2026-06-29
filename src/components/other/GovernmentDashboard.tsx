import { useState, useEffect } from 'react';
import { ArrowLeft, Building, TrendingUp, Leaf } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GovernmentDashboardProps {
  onBack: () => void;
}

export function GovernmentDashboard({ onBack }: GovernmentDashboardProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [districtData, setDistrictData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDistrictSelect = async (district: string) => {
    setSelectedDistrict(district);
    setLoading(true);

    try {
      const { data: mines } = await supabase.from('mines').select('*').eq('location', district);

      if (!mines || mines.length === 0) {
        setDistrictData({ mines: [], totalEmissions: 0, totalSequestration: 0, totalCredits: 0 });
        setLoading(false);
        return;
      }

      const mineIds = mines.map((m) => m.id);

      const { data: emissions } = await supabase.from('emissions').select('*').in('mine_id', mineIds);

      const mineDetails = await Promise.all(
        mines.map(async (mine) => {
          const mineEmissions = emissions?.filter((e) => e.mine_id === mine.id);
          const latestEmission = mineEmissions?.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];

          return {
            ...mine,
            emission: latestEmission || null,
          };
        })
      );

      const totalEmissions = mineDetails.reduce((sum, m) => sum + (m.emission?.total_emissions || 0), 0);
      const totalSequestration = mineDetails.reduce((sum, m) => sum + (m.emission?.total_sequestration || 0), 0);
      const totalCredits = mineDetails.reduce((sum, m) => sum + (m.emission?.carbon_credits || 0), 0);

      setDistrictData({
        mines: mineDetails,
        totalEmissions,
        totalSequestration,
        totalCredits,
      });
    } catch (error) {
      console.error('Error fetching district data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Government Official Portal</h1>
          <p className="text-gray-600 mb-6">Monitor district-wide sustainability metrics</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictSelect(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            >
              <option value="">Choose a district...</option>
              <option value="Barmer">Barmer, Rajasthan</option>
              <option value="Dhanbad">Dhanbad, Jharkhand</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Loading district data...</p>
          </div>
        )}

        {!loading && districtData && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">
                District Report: {selectedDistrict === 'Barmer' ? 'Barmer, Rajasthan' : 'Dhanbad, Jharkhand'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <TrendingUp className="w-8 h-8 mb-3" />
                  <p className="text-emerald-100 text-sm mb-1">Total Emissions</p>
                  <p className="text-3xl font-bold">{districtData.totalEmissions.toFixed(2)} tCO2e</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <Leaf className="w-8 h-8 mb-3" />
                  <p className="text-emerald-100 text-sm mb-1">Total Sequestration</p>
                  <p className="text-3xl font-bold">{districtData.totalSequestration.toFixed(2)} tCO2e</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <Building className="w-8 h-8 mb-3" />
                  <p className="text-emerald-100 text-sm mb-1">Total Carbon Credits</p>
                  <p className="text-3xl font-bold">{districtData.totalCredits.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {districtData.mines.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <p className="text-gray-600 text-lg">No mines registered in this district yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {districtData.mines.map((mine: any) => (
                  <div key={mine.id} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{mine.name}</h3>
                        <p className="text-gray-600">{mine.mine_type} Mine</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Employees</p>
                        <p className="text-lg font-bold text-gray-900">{mine.total_employees.toLocaleString()}</p>
                      </div>
                    </div>

                    {mine.emission ? (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="bg-red-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600">Emissions</p>
                          <p className="text-lg font-bold text-gray-900">{mine.emission.total_emissions.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">tCO2e</p>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600">Sequestration</p>
                          <p className="text-lg font-bold text-gray-900">{mine.emission.total_sequestration.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">tCO2e</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600">Carbon Credits</p>
                          <p className="text-lg font-bold text-gray-900">{mine.emission.carbon_credits.toFixed(2)}</p>
                        </div>
                        <div
                          className={`${
                            mine.emission.carbon_gap > 0 ? 'bg-amber-50' : 'bg-emerald-50'
                          } p-3 rounded-lg`}
                        >
                          <p className="text-xs text-gray-600">Carbon Gap</p>
                          <p className="text-lg font-bold text-gray-900">{Math.abs(mine.emission.carbon_gap).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{mine.emission.carbon_gap > 0 ? 'Deficit' : 'Surplus'}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No emission data available</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
