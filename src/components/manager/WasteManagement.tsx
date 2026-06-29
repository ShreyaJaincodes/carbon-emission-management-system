import { useState } from 'react';
import { ArrowLeft, Mountain, Leaf, Trash2, Flame, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { calculateWaste } from '../../lib/calculations';
import { generateWasteRecommendations } from '../../lib/aiRecommendations';
import { EMISSION_FACTORS } from '../../lib/constants';
import type { Mine } from '../../types';

interface WasteManagementProps {
  mine: Mine;
  onBack: () => void;
}

export function WasteManagement({ mine, onBack }: WasteManagementProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    overburden: '',
    organicWaste: '',
    metalWaste: '',
    plasticWaste: '',
    glassWaste: '',
    coalRejects: '',
  });
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const wasteResults = calculateWaste({
        overburden: parseFloat(formData.overburden) || 0,
        organicWaste: parseFloat(formData.organicWaste) || 0,
        metalWaste: parseFloat(formData.metalWaste) || 0,
        plasticWaste: parseFloat(formData.plasticWaste) || 0,
        glassWaste: parseFloat(formData.glassWaste) || 0,
        coalRejects: parseFloat(formData.coalRejects) || 0,
      });

      const recommendations = generateWasteRecommendations(
        parseFloat(formData.overburden) || 0,
        mine.location
      );

      const { error } = await supabase.from('waste_management').insert({
        mine_id: mine.id,
        overburden: parseFloat(formData.overburden) || 0,
        organic_waste: parseFloat(formData.organicWaste) || 0,
        metal_waste: parseFloat(formData.metalWaste) || 0,
        plastic_waste: parseFloat(formData.plasticWaste) || 0,
        glass_waste: parseFloat(formData.glassWaste) || 0,
        coal_rejects: parseFloat(formData.coalRejects) || 0,
        biogas_production: wasteResults.biogasProduction || 0,
        electricity_from_organic: wasteResults.electricityFromOrganic || 0,
        electricity_from_rejects: wasteResults.electricityFromRejects || 0,
      });

      if (error) throw error;

      setResults({
        ...wasteResults,
        recommendations,
        inputs: {
          overburden: parseFloat(formData.overburden) || 0,
          organic: parseFloat(formData.organicWaste) || 0,
          metal: parseFloat(formData.metalWaste) || 0,
          plastic: parseFloat(formData.plasticWaste) || 0,
          glass: parseFloat(formData.glassWaste) || 0,
          rejects: parseFloat(formData.coalRejects) || 0,
        }
      });
    } catch (error) {
      console.error('Error calculating waste:', error);
      alert('Failed to calculate waste management. Please try again.');
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
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Waste Management Analysis</h1>
          <p className="text-gray-600 mb-8">Track and manage all waste streams with waste-to-energy solutions</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Mountain className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-bold text-gray-900">1. Overburden Management</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Overburden Produced (Tonnes)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.overburden}
                  onChange={(e) => setFormData({ ...formData, overburden: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Leaf className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">2. Organic Waste to Energy</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Organic Waste (Tonnes)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.organicWaste}
                  onChange={(e) => setFormData({ ...formData, organicWaste: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">3. Inorganic Waste Tracking</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Metal Waste (Tonnes)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.metalWaste}
                    onChange={(e) => setFormData({ ...formData, metalWaste: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plastic Waste (Tonnes)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.plasticWaste}
                    onChange={(e) => setFormData({ ...formData, plasticWaste: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Glass Waste (Tonnes)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.glassWaste}
                    onChange={(e) => setFormData({ ...formData, glassWaste: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900">4. Coal Rejects to Energy (FBC)</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Coal Rejects (Tonnes)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.coalRejects}
                  onChange={(e) => setFormData({ ...formData, coalRejects: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'Analyzing...' : 'Analyze Waste Management'}
            </button>
          </form>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.inputs.overburden > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Overburden Analysis</h3>
                  <p className="text-3xl font-bold text-amber-600 mb-2">{results.inputs.overburden.toFixed(2)} Tonnes</p>
                  <p className="text-sm text-gray-600">Annual overburden for bioreclamation</p>
                </div>
              )}

              {results.biogasProduction && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Organic Waste to Energy</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Biogas Production</p>
                      <p className="text-2xl font-bold text-emerald-600">{results.biogasProduction.toFixed(2)} m³</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Electricity Generated</p>
                      <p className="text-2xl font-bold text-emerald-600">{results.electricityFromOrganic?.toFixed(2)} kWh</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CO2 Reduction</p>
                      <p className="text-xl font-bold text-emerald-600">{results.emissionReduction?.toFixed(2)} tCO2e</p>
                    </div>
                  </div>
                </div>
              )}

              {(results.inputs.metal > 0 || results.inputs.plastic > 0 || results.inputs.glass > 0) && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Inorganic Waste Logged</h3>
                  <div className="space-y-2">
                    {results.inputs.metal > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Metal Waste:</span>
                        <span className="font-bold text-gray-900">{results.inputs.metal.toFixed(2)} Tonnes</span>
                      </div>
                    )}
                    {results.inputs.plastic > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Plastic Waste:</span>
                        <span className="font-bold text-gray-900">{results.inputs.plastic.toFixed(2)} Tonnes</span>
                      </div>
                    )}
                    {results.inputs.glass > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Glass Waste:</span>
                        <span className="font-bold text-gray-900">{results.inputs.glass.toFixed(2)} Tonnes</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {results.electricityFromRejects && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Coal Rejects to Energy (FBC)</h3>
                  <p className="text-3xl font-bold text-orange-600 mb-2">{results.electricityFromRejects.toFixed(2)} kWh</p>
                  <p className="text-sm text-gray-600">Annual electricity generation potential</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8" />
                <h2 className="text-2xl font-bold">AI Waste Management Recommendations</h2>
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
                        <p className="text-xs text-emerald-100 uppercase font-semibold mb-1">{rec.category}</p>
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
