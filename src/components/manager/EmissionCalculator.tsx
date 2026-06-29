import { useState } from 'react';
import { ArrowLeft, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { calculateEmissions } from '../../lib/calculations';
import { generateCarbonNeutralityRecommendations } from '../../lib/aiRecommendations';
import { TREE_SPECIES_BY_LOCATION } from '../../lib/constants';
import type { Mine } from '../../types';

interface EmissionCalculatorProps {
  mine: Mine;
  onBack: () => void;
}

export function EmissionCalculator({ mine, onBack }: EmissionCalculatorProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    diesel: '',
    electricity: '',
    methane: '',
    hectares: '',
    species: '',
    treeAge: '',
  });
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const calculatedResults = calculateEmissions({
        diesel: parseFloat(formData.diesel),
        electricity: parseFloat(formData.electricity),
        methane: parseFloat(formData.methane),
        hectares: parseFloat(formData.hectares),
        species: formData.species,
        treeAge: parseFloat(formData.treeAge),
        location: mine.location,
        employees: mine.total_employees,
      });

      const recommendations = generateCarbonNeutralityRecommendations(
        calculatedResults.carbonGap,
        mine.location,
        formData.species
      );

      const { error } = await supabase.from('emissions').insert({
        mine_id: mine.id,
        diesel_consumption: parseFloat(formData.diesel),
        electricity_consumption: parseFloat(formData.electricity),
        methane_consumption: parseFloat(formData.methane),
        land_hectares: parseFloat(formData.hectares),
        tree_species: formData.species,
        tree_age: parseFloat(formData.treeAge),
        total_emissions: calculatedResults.totalEmissions,
        total_sequestration: calculatedResults.totalSequestration,
        carbon_gap: calculatedResults.carbonGap,
        per_capita_emissions: calculatedResults.perCapitaEmissions,
        carbon_credits: calculatedResults.carbonCredits,
        credit_value: calculatedResults.creditValue,
      });

      if (error) throw error;

      setResults({ ...calculatedResults, recommendations });
    } catch (error) {
      console.error('Error calculating emissions:', error);
      alert('Failed to calculate emissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const treeSpecies = TREE_SPECIES_BY_LOCATION[mine.location];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carbon Footprint Analysis</h1>
          <p className="text-gray-600 mb-8">Calculate emissions, sequestration, and carbon neutrality pathways</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Consumption Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diesel Consumption (Litres)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.diesel}
                    onChange={(e) => setFormData({ ...formData, diesel: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Electricity Consumption (kWh)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.electricity}
                    onChange={(e) => setFormData({ ...formData, electricity: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Methane Emissions (m³)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.methane}
                    onChange={(e) => setFormData({ ...formData, methane: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Existing Carbon Sinks (Afforestation)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Land with Trees (Hectares)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.hectares}
                    onChange={(e) => setFormData({ ...formData, hectares: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dominant Tree Species</label>
                  <select
                    required
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Species</option>
                    {treeSpecies.map((species) => (
                      <option key={species} value={species}>
                        {species}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Average Tree Age (Years)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={formData.treeAge}
                    onChange={(e) => setFormData({ ...formData, treeAge: e.target.value })}
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
              {loading ? 'Calculating...' : 'Calculate Carbon Footprint'}
            </button>
          </form>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Carbon Footprint Analysis Report</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Total Emissions</p>
                  <p className="text-2xl font-bold text-gray-900">{results.totalEmissions.toFixed(2)} tCO2e</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Total Sequestration</p>
                  <p className="text-2xl font-bold text-gray-900">{results.totalSequestration.toFixed(2)} tCO2e</p>
                </div>
                <div className={`bg-gradient-to-br ${results.carbonGap > 0 ? 'from-amber-50 to-amber-100' : 'from-emerald-50 to-emerald-100'} p-4 rounded-lg`}>
                  <p className="text-sm text-gray-600 font-medium">Net Carbon Gap</p>
                  <div className="flex items-center gap-2">
                    {results.carbonGap > 0 ? <TrendingUp className="w-5 h-5 text-amber-600" /> : <TrendingDown className="w-5 h-5 text-emerald-600" />}
                    <p className="text-2xl font-bold text-gray-900">{Math.abs(results.carbonGap).toFixed(2)} tCO2e</p>
                  </div>
                  <p className="text-xs text-gray-500">{results.carbonGap > 0 ? 'Deficit' : 'Surplus'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Per Capita Emissions</p>
                  <p className="text-lg font-bold text-gray-900">{results.perCapitaEmissions.toFixed(4)} tCO2e/employee</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Carbon Credits Earned</p>
                  <p className="text-lg font-bold text-gray-900">{results.carbonCredits.toFixed(2)} credits</p>
                  <p className="text-sm text-emerald-600">${results.creditValue.toFixed(2)} USD</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8" />
                <h2 className="text-2xl font-bold">AI Recommendations for Carbon Neutrality</h2>
              </div>

              <div className="space-y-4">
                {results.recommendations.map((rec: any, index: number) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <div className="flex items-start gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        rec.priority === 'high' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{rec.title}</h3>
                        <p className="text-emerald-100 leading-relaxed">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
