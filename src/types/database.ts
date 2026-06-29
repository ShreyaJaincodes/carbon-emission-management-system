export interface Database {
  public: {
    Tables: {
      mines: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          location: 'Barmer' | 'Dhanbad';
          mine_type: 'Opencast' | 'Underground';
          annual_production: number;
          total_employees: number;
          manager_name: string;
          manager_email: string;
          manager_contact: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: 'Barmer' | 'Dhanbad';
          mine_type?: 'Opencast' | 'Underground';
          annual_production?: number;
          total_employees?: number;
          manager_name?: string;
          manager_email?: string;
          manager_contact?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      emissions: {
        Row: {
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
        };
        Insert: {
          id?: string;
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
          created_at?: string;
        };
        Update: {
          id?: string;
          mine_id?: string;
          diesel_consumption?: number;
          electricity_consumption?: number;
          methane_consumption?: number;
          land_hectares?: number;
          tree_species?: string;
          tree_age?: number;
          total_emissions?: number;
          total_sequestration?: number;
          carbon_gap?: number;
          per_capita_emissions?: number;
          carbon_credits?: number;
          credit_value?: number;
          created_at?: string;
        };
      };
      waste_management: {
        Row: {
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
        };
        Insert: {
          id?: string;
          mine_id: string;
          overburden?: number;
          organic_waste?: number;
          metal_waste?: number;
          plastic_waste?: number;
          glass_waste?: number;
          coal_rejects?: number;
          biogas_production?: number;
          electricity_from_organic?: number;
          electricity_from_rejects?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          mine_id?: string;
          overburden?: number;
          organic_waste?: number;
          metal_waste?: number;
          plastic_waste?: number;
          glass_waste?: number;
          coal_rejects?: number;
          biogas_production?: number;
          electricity_from_organic?: number;
          electricity_from_rejects?: number;
          created_at?: string;
        };
      };
    };
  };
}
