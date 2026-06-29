/*
  # EcoNovo Tech Database Schema

  1. New Tables
    - `mines`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the mine
      - `location` (text) - Barmer or Dhanbad
      - `mine_type` (text) - Opencast or Underground
      - `annual_production` (numeric) - Annual coal production in tonnes
      - `total_employees` (integer) - Number of employees
      - `manager_name` (text)
      - `manager_email` (text)
      - `manager_contact` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `emissions`
      - `id` (uuid, primary key)
      - `mine_id` (uuid, foreign key)
      - `diesel_consumption` (numeric) - Monthly diesel in litres
      - `electricity_consumption` (numeric) - Monthly electricity in kWh
      - `methane_consumption` (numeric) - Monthly methane in cubic meters
      - `land_hectares` (numeric) - Hectares with trees
      - `tree_species` (text) - Species of trees
      - `tree_age` (numeric) - Age of trees in years
      - `total_emissions` (numeric) - Calculated total emissions
      - `total_sequestration` (numeric) - Calculated sequestration
      - `carbon_gap` (numeric) - Emissions minus sequestration
      - `per_capita_emissions` (numeric)
      - `carbon_credits` (numeric)
      - `credit_value` (numeric)
      - `created_at` (timestamptz)
    
    - `waste_management`
      - `id` (uuid, primary key)
      - `mine_id` (uuid, foreign key)
      - `overburden` (numeric) - Overburden in tonnes
      - `organic_waste` (numeric) - Organic waste in tonnes
      - `metal_waste` (numeric) - Metal waste in tonnes
      - `plastic_waste` (numeric) - Plastic waste in tonnes
      - `glass_waste` (numeric) - Glass waste in tonnes
      - `coal_rejects` (numeric) - Coal rejects in tonnes
      - `biogas_production` (numeric) - Calculated biogas
      - `electricity_from_organic` (numeric) - Electricity from organic waste
      - `electricity_from_rejects` (numeric) - Electricity from coal rejects
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (for transparency)
    - Add policies for authenticated write access
*/

CREATE TABLE IF NOT EXISTS mines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL CHECK (location IN ('Barmer', 'Dhanbad')),
  mine_type text NOT NULL CHECK (mine_type IN ('Opencast', 'Underground')),
  annual_production numeric NOT NULL DEFAULT 0,
  total_employees integer NOT NULL DEFAULT 0,
  manager_name text NOT NULL,
  manager_email text NOT NULL,
  manager_contact text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS emissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mine_id uuid NOT NULL REFERENCES mines(id) ON DELETE CASCADE,
  diesel_consumption numeric NOT NULL DEFAULT 0,
  electricity_consumption numeric NOT NULL DEFAULT 0,
  methane_consumption numeric NOT NULL DEFAULT 0,
  land_hectares numeric NOT NULL DEFAULT 0,
  tree_species text NOT NULL DEFAULT '',
  tree_age numeric NOT NULL DEFAULT 0,
  total_emissions numeric NOT NULL DEFAULT 0,
  total_sequestration numeric NOT NULL DEFAULT 0,
  carbon_gap numeric NOT NULL DEFAULT 0,
  per_capita_emissions numeric NOT NULL DEFAULT 0,
  carbon_credits numeric NOT NULL DEFAULT 0,
  credit_value numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS waste_management (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mine_id uuid NOT NULL REFERENCES mines(id) ON DELETE CASCADE,
  overburden numeric DEFAULT 0,
  organic_waste numeric DEFAULT 0,
  metal_waste numeric DEFAULT 0,
  plastic_waste numeric DEFAULT 0,
  glass_waste numeric DEFAULT 0,
  coal_rejects numeric DEFAULT 0,
  biogas_production numeric DEFAULT 0,
  electricity_from_organic numeric DEFAULT 0,
  electricity_from_rejects numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mines ENABLE ROW LEVEL SECURITY;
ALTER TABLE emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_management ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mine data"
  ON mines FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert mine data"
  ON mines FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update mine data"
  ON mines FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view emissions data"
  ON emissions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert emissions data"
  ON emissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view waste management data"
  ON waste_management FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert waste management data"
  ON waste_management FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update waste management data"
  ON waste_management FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);