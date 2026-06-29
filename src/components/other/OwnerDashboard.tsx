import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Zap, Leaf } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Mine, EmissionData, WasteData } from '../../types';

interface OwnerDashboardProps {
  onBack: () => void;
}

export function OwnerDashboard({ onBack }: OwnerDashboardProps) {
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
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mine Owner Portal</h1>
          <p className="text-gray-600 mb-6">View comprehensive analytics for your mines</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Mine</label>
            <select
              value={selectedMine}
              onChange={(e) => handleMineSelect(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            >
              <option value="">Choose a mine...</option>
              {mines.map((mine) => (
                <option key={mine.id} value={mine.id}>
                  {mine.name} - {mine.location}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{mineData.mine.name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Annual Production</p>
                  <p className="text-lg font-bold text-gray-900">{mineData.mine.annual_production.toLocaleString()} T</p>
                </div>
                <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Employees</p>
                  <p className="text-lg font-bold text-gray-900">{mineData.mine.total_employees.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {mineData.emissions && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Carbon Footprint Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    icon={<TrendingUp className="w-6 h-6" />}
                    label="Total Emissions"
                    value={`${mineData.emissions.total_emissions.toFixed(2)} tCO2e`}
                    color="red"
                  />
                  <MetricCard
                    icon={<Leaf className="w-6 h-6" />}
                    label="Total Sequestration"
                    value={`${mineData.emissions.total_sequestration.toFixed(2)} tCO2e`}
                    color="emerald"
                  />
                  <MetricCard
                    icon={<DollarSign className="w-6 h-6" />}
                    label="Carbon Credits"
                    value={mineData.emissions.carbon_credits.toFixed(2)}
                    color="green"
                    subtitle={`$${mineData.emissions.credit_value.toFixed(2)} USD`}
                  />
                  <MetricCard
                    icon={<TrendingUp className="w-6 h-6" />}
                    label="Carbon Gap"
                    value={`${Math.abs(mineData.emissions.carbon_gap).toFixed(2)} tCO2e`}
                    color={mineData.emissions.carbon_gap > 0 ? 'amber' : 'emerald'}
                    subtitle={mineData.emissions.carbon_gap > 0 ? 'Deficit' : 'Surplus'}
                  />
                </div>
              </div>
            )}

            {mineData.waste && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Waste Management Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-6 h-6 text-emerald-600" />
                      <h4 className="font-bold text-gray-900">Organic Waste to Energy</h4>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">
                      {mineData.waste.electricity_from_organic.toFixed(2)} kWh/year
                    </p>
                    <p className="text-sm text-gray-600 mt-1">From {mineData.waste.biogas_production.toFixed(2)} m³ biogas</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-6 h-6 text-orange-600" />
                      <h4 className="font-bold text-gray-900">Coal Rejects to Energy</h4>
                    </div>
                    <p className="text-3xl font-bold text-orange-600">
                      {mineData.waste.electricity_from_rejects.toFixed(2)} kWh/year
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Via FBC technology</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Overburden</p>
                    <p className="text-lg font-bold text-gray-900">{mineData.waste.overburden.toFixed(2)} T</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Metal Waste</p>
                    <p className="text-lg font-bold text-gray-900">{mineData.waste.metal_waste.toFixed(2)} T</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Plastic Waste</p>
                    <p className="text-lg font-bold text-gray-900">{mineData.waste.plastic_waste.toFixed(2)} T</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Glass Waste</p>
                    <p className="text-lg font-bold text-gray-900">{mineData.waste.glass_waste.toFixed(2)} T</p>
                  </div>
                </div>
              </div>
            )}

            {!mineData.emissions && !mineData.waste && (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <p className="text-gray-600 text-lg">No data available yet. Manager needs to submit emission and waste data.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color, subtitle }: any) {
  const colorClasses = {
    red: 'from-red-50 to-red-100 text-red-600',
    emerald: 'from-emerald-50 to-emerald-100 text-emerald-600',
    green: 'from-green-50 to-green-100 text-green-600',
    amber: 'from-amber-50 to-amber-100 text-amber-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} p-4 rounded-lg`}>
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p className="text-xs text-gray-600 font-medium">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
}
