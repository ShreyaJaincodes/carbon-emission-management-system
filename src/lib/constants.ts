export const EMISSION_FACTORS = {
  DIESEL_LITRE: 0.00268,
  ELECTRICITY_KWH: 0.00082,
  METHANE_M3: 0.021,
} as const;

export const SEQUESTRATION_FACTORS = {
  Barmer: {
    Khejri: 7,
    Neem: 9,
    Rohida: 6,
  },
  Dhanbad: {
    Sal: 15,
    Teak: 12,
    Bamboo: 25,
  },
} as const;

export const CARBON_CREDIT_RATE_USD = 15;

export const BIOGAS_YIELD_PER_TONNE = 75;
export const ELECTRICITY_PER_M3_BIOGAS = 2;
export const FBC_ELECTRICITY_PER_TONNE = 1000;

export const TREE_SPECIES_BY_LOCATION = {
  Barmer: ['Khejri', 'Neem', 'Rohida'],
  Dhanbad: ['Sal', 'Teak', 'Bamboo'],
} as const;

export const LOCATION_DETAILS = {
  Barmer: {
    fullName: 'Barmer, Rajasthan',
    climate: 'Arid',
    solarPotential: 'High (6.5 kWh/m²/day)',
    recommendedSpecies: 'Prosopis juliflora (Khejri), Acacia nilotica (Babool)',
  },
  Dhanbad: {
    fullName: 'Dhanbad, Jharkhand',
    climate: 'Deciduous Forest',
    solarPotential: 'Moderate (5.0 kWh/m²/day)',
    recommendedSpecies: 'Dalbergia sissoo (Shisham), Azadirachta indica (Neem)',
  },
} as const;
