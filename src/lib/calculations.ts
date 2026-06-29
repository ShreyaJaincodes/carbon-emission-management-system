import {
  EMISSION_FACTORS,
  SEQUESTRATION_FACTORS,
  CARBON_CREDIT_RATE_USD,
  BIOGAS_YIELD_PER_TONNE,
  ELECTRICITY_PER_M3_BIOGAS,
  FBC_ELECTRICITY_PER_TONNE,
} from './constants';

export interface EmissionInputs {
  diesel: number;
  electricity: number;
  methane: number;
  hectares: number;
  species: string;
  treeAge: number;
  location: 'Barmer' | 'Dhanbad';
  employees: number;
}

export interface EmissionResults {
  totalEmissions: number;
  totalSequestration: number;
  carbonGap: number;
  perCapitaEmissions: number;
  carbonCredits: number;
  creditValue: number;
}

export function calculateEmissions(inputs: EmissionInputs): EmissionResults {
  const dieselEmissions = inputs.diesel * EMISSION_FACTORS.DIESEL_LITRE;
  const electricityEmissions = inputs.electricity * EMISSION_FACTORS.ELECTRICITY_KWH;
  const methaneEmissions = inputs.methane * EMISSION_FACTORS.METHANE_M3;

  const totalEmissions = dieselEmissions + electricityEmissions + methaneEmissions;
  const perCapitaEmissions = totalEmissions / inputs.employees;

  const sequestrationFactor = SEQUESTRATION_FACTORS[inputs.location][inputs.species as keyof typeof SEQUESTRATION_FACTORS[typeof inputs.location]];
  const ageMultiplier = Math.min(inputs.treeAge / 20, 1);
  const totalSequestration = inputs.hectares * sequestrationFactor * ageMultiplier;

  const carbonGap = totalEmissions - totalSequestration;
  const carbonCredits = carbonGap < 0 ? Math.abs(carbonGap) : 0;
  const creditValue = carbonCredits * CARBON_CREDIT_RATE_USD;

  return {
    totalEmissions,
    totalSequestration,
    carbonGap,
    perCapitaEmissions,
    carbonCredits,
    creditValue,
  };
}

export interface WasteInputs {
  overburden?: number;
  organicWaste?: number;
  metalWaste?: number;
  plasticWaste?: number;
  glassWaste?: number;
  coalRejects?: number;
}

export interface WasteResults {
  biogasProduction?: number;
  electricityFromOrganic?: number;
  emissionReduction?: number;
  electricityFromRejects?: number;
}

export function calculateWaste(inputs: WasteInputs): WasteResults {
  const results: WasteResults = {};

  if (inputs.organicWaste) {
    results.biogasProduction = inputs.organicWaste * BIOGAS_YIELD_PER_TONNE;
    results.electricityFromOrganic = results.biogasProduction * ELECTRICITY_PER_M3_BIOGAS;
    results.emissionReduction = results.electricityFromOrganic * EMISSION_FACTORS.ELECTRICITY_KWH;
  }

  if (inputs.coalRejects) {
    results.electricityFromRejects = inputs.coalRejects * FBC_ELECTRICITY_PER_TONNE;
  }

  return results;
}
