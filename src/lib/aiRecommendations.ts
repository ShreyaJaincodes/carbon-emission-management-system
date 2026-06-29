import { SEQUESTRATION_FACTORS, LOCATION_DETAILS } from './constants';

export interface AIRecommendation {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export function generateCarbonNeutralityRecommendations(
  carbonGap: number,
  location: 'Barmer' | 'Dhanbad',
  species: string
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];

  if (carbonGap <= 0) {
    return [
      {
        category: 'Achievement',
        title: 'Carbon Neutral Status Achieved',
        description: `Congratulations! Your mine has achieved carbon neutrality with a surplus of ${Math.abs(carbonGap).toFixed(2)} tonnes CO2e. You can earn carbon credits from this achievement.`,
        priority: 'high',
      },
    ];
  }

  const sequestrationFactor = SEQUESTRATION_FACTORS[location][species as keyof typeof SEQUESTRATION_FACTORS[typeof location]];
  const hectaresNeeded = (carbonGap / sequestrationFactor).toFixed(2);

  recommendations.push({
    category: 'Afforestation',
    title: 'Expand Tree Plantation',
    description: `Plant approximately ${hectaresNeeded} more hectares of ${species} trees to offset the carbon gap. This will create a natural carbon sink and support biodiversity.`,
    priority: 'high',
  });

  if (location === 'Barmer') {
    recommendations.push({
      category: 'Renewable Energy',
      title: 'Solar Power Installation (Atmanirbhar Bharat)',
      description: `Invest in solar plants from Indian companies like Adani Solar or Tata Power Solar. Rajasthan has excellent solar potential (${LOCATION_DETAILS.Barmer.solarPotential}). A 1 MW solar plant can offset approximately 1,500 tonnes of CO2 annually.`,
      priority: 'high',
    });
  } else {
    recommendations.push({
      category: 'Renewable Energy',
      title: 'Solar & Renewable Solutions (Atmanirbhar Bharat)',
      description: `Explore solar options from Indian firms like Vikram Solar. Consider using mine-degraded land for solar farms with ${LOCATION_DETAILS.Dhanbad.solarPotential}. This supports dual land use and clean energy generation.`,
      priority: 'high',
    });
  }

  recommendations.push({
    category: 'Electric Vehicles',
    title: 'Switch to Electric Transport',
    description: `Replace diesel-powered transport vehicles with electric alternatives from Indian brands like Tata Motors Electric or Mahindra Electric. EVs can reduce diesel emissions by up to 80% for mine operations.`,
    priority: 'medium',
  });

  if (carbonGap > 500) {
    recommendations.push({
      category: 'Methane Capture',
      title: 'Implement Methane Capture System',
      description: `Install methane capture and utilization systems to convert mine methane into usable energy. This addresses one of the highest-impact greenhouse gases (GWP 28x CO2).`,
      priority: 'high',
    });
  }

  return recommendations;
}

export function generateWasteRecommendations(
  overburden: number,
  location: 'Barmer' | 'Dhanbad'
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];

  if (overburden > 0) {
    recommendations.push({
      category: 'Bioreclamation',
      title: 'Overburden Bioreclamation',
      description: `Use the ${overburden.toFixed(0)} tonnes of overburden for land reclamation. For ${location}, plant ${LOCATION_DETAILS[location].recommendedSpecies}. This creates future carbon sinks and restores the ecosystem.`,
      priority: 'high',
    });
  }

  recommendations.push({
    category: 'Circular Economy',
    title: 'Waste-to-Wealth Integration',
    description: `Partner with local recycling units under the Swachh Bharat Mission. Implement a circular economy model to convert waste into resources, supporting both sustainability and economic growth.`,
    priority: 'medium',
  });

  recommendations.push({
    category: 'Energy Recovery',
    title: 'Waste-to-Energy Systems',
    description: `Maximize energy recovery from organic waste through biogas systems and coal rejects through FBC technology. This reduces waste volume while generating power for mine operations.`,
    priority: 'high',
  });

  return recommendations;
}
