export type UserRole = 'manager' | 'owner' | 'government' | 'user';

export interface Mine {
  id: string;
  name: string;
  location: 'Barmer' | 'Dhanbad';
  mine_type: 'Opencast' | 'Underground';
  annual_production: number;
  total_employees: number;
  manager_name: string;
  manager_email: string;
  manager_contact: string;
  created_at: string;
  updated_at: string;
}

export interface EmissionData {
  id: string;
  mine_id: string;
  diesel_consumption: number;
  electricity_consumption: number;
  methane_consumption: number;
  land_hectares: number;
  tree_species: string;
  tree_age: number;
  total_emissions: number;
  total_sequestration: number;
  carbon_gap: number;
  per_capita_emissions: number;
  carbon_credits: number;
  credit_value: number;
  created_at: string;
}

export interface WasteData {
  id: string;
  mine_id: string;
  overburden: number;
  organic_waste: number;
  metal_waste: number;
  plastic_waste: number;
  glass_waste: number;
  coal_rejects: number;
  biogas_production: number;
  electricity_from_organic: number;
  electricity_from_rejects: number;
  created_at: string;
}
