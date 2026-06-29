import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Leaf, Recycle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Mine, EmissionData, WasteData } from '../../types';

interface PublicDashboardProps {
  onBack: () => void;
}

export function PublicDashboard({ onBack }: PublicDashboardProps) {
  const [mines, setMines] = useState<Mine[]>([]);
  const [selectedMine, setSelectedMine] = useState<string>('');
  const [mineData, setMineData] = useState<{
    mine: Mine | null;
    emissions: EmissionData | null;
    waste: WasteData | null;
  }>({ mine: null, emissions: null, waste: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMines();
  }, []);

  const fetchMines = async () => {
    const { data, error } = await supabase.from('mines').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setMines(data as Mine[]);
    }
  };

  const handleMineSelect = async (mineId: string) => {
    setSelectedMine(mineId);
    setLoading(true);

    try {
      const { data: mine } = await supabase.from('mines').select('*').eq('id', mineId).single();

      const { data: emissions } = await supabase
        .from('emissions')
        .select('*')
        .eq('mine_id', mineId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: waste } = await supabase
        .from('waste_management')
        .select('*')
        .eq('mine_id', mineId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setMineData({
        mine: mine as Mine,
        emissions: emissions as EmissionData | null,
        waste: waste as WasteData | null,
      });
    } catch (error) {
      console.error('Error fetching mine data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Public Information Portal</h1>
          <p className="text-gray-600 mb-6">Access transparency data for coal mines</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Mine to View</label>
            <select
              value={selectedMine}
              onChange={(e) => handleMineSelect(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            >
              <option value="">Choose a mine...</option>
              {mines.map((mine) => (
                <option key={mine.id} value={mine.id}>
                  {mine.name} - {mine.location === 'Barmer' ? 'Barmer, Rajasthan' : 'Dhanbad, Jharkhand'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Loading mine data...</p>
          </div>
        )}

        {!loading && mineData.mine && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Public Data for {mineData.mine.name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Location</p>
                  <p className="text-lg font-bold text-gray-900">
                    {mineData.mine.location === 'Barmer' ? 'Barmer, Rajasthan' : 'Dhanbad, Jharkhand'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Mine Type</p>
                  <p className="text-lg font-bold text-gray-900">{mineData.mine.mine_type}</p>
                </div>
              </div>

              {mineData.emissions ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-bold text-gray-900">Carbon Footprint</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Total Emissions</p>
                      <p className="text-2xl font-bold text-gray-900">{mineData.emissions.total_emissions.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">tCO2e</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Total Sequestration</p>
                      <p className="text-2xl font-bold text-gray-900">{mineData.emissions.total_sequestration.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">tCO2e (via Afforestation)</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Carbon Credits</p>
                      <p className="text-2xl font-bold text-gray-900">{mineData.emissions.carbon_credits.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Generated</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-600">No emission data available</p>
                </div>
              )}
            </div>

            {mineData.waste && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Recycle className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Waste Management</h3>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl mb-6">
                  <h4 className="font-bold text-gray-900 mb-4">Inorganic Waste Management (Annual)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Metal Waste</p>
                      <p className="text-xl font-bold text-gray-900">{mineData.waste.metal_waste.toFixed(2)} Tonnes</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Plastic Waste</p>
                      <p className="text-xl font-bold text-gray-900">{mineData.waste.plastic_waste.toFixed(2)} Tonnes</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Glass Waste</p>
                      <p className="text-xl font-bold text-gray-900">{mineData.waste.glass_waste.toFixed(2)} Tonnes</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
                    <Leaf className="w-5 h-5 text-emerald-600 mb-2" />
                    <p className="text-sm text-gray-600">Organic Waste to Energy</p>
                    <p className="text-2xl font-bold text-gray-900">{mineData.waste.electricity_from_organic.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">kWh/year generated</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                    <Leaf className="w-5 h-5 text-orange-600 mb-2" />
                    <p className="text-sm text-gray-600">Coal Rejects to Energy</p>
                    <p className="text-2xl font-bold text-gray-900">{mineData.waste.electricity_from_rejects.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">kWh/year generated via FBC</p>
                  </div>
                </div>
              </div>
            )}

            {!mineData.emissions && !mineData.waste && (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <p className="text-gray-600 text-lg">No data available for this mine yet.</p>
              </div>
            )}

            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-3">Transparency Commitment</h3>
              <p className="text-emerald-100 leading-relaxed">
                This data is publicly available as part of EcoNovo's commitment to transparency in the Indian coal sector.
                All mines registered on this platform contribute to India's journey towards carbon neutrality and support
                initiatives like Atmanirbhar Bharat and Swachh Bharat Mission.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
