/*
  # Flight Booking System Database Schema

  1. New Tables
    - `flights`
      - `id` (uuid, primary key)
      - `flight_number` (text, unique)
      - `airline` (text)
      - `departure_city` (text)
      - `arrival_city` (text)
      - `base_price` (numeric)
      - `departure_time` (text)
      - `arrival_time` (text)
      - `created_at` (timestamptz)

    - `bookings`
      - `id` (uuid, primary key)
      - `pnr` (text, unique)
      - `flight_id` (uuid, foreign key)
      - `passenger_name` (text)
      - `price_paid` (numeric)
      - `booking_date` (timestamptz)
      - `created_at` (timestamptz)

    - `wallet`
      - `id` (uuid, primary key)
      - `user_id` (text)
      - `balance` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `price_tracking`
      - `id` (uuid, primary key)
      - `flight_id` (uuid, foreign key)
      - `attempt_count` (integer)
      - `first_attempt_at` (timestamptz)
      - `current_price` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS flights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_number text UNIQUE NOT NULL,
  airline text NOT NULL,
  departure_city text NOT NULL,
  arrival_city text NOT NULL,
  base_price numeric NOT NULL,
  departure_time text NOT NULL,
  arrival_time text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pnr text UNIQUE NOT NULL,
  flight_id uuid REFERENCES flights(id) NOT NULL,
  passenger_name text NOT NULL,
  price_paid numeric NOT NULL,
  booking_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wallet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  balance numeric DEFAULT 50000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS price_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_id uuid REFERENCES flights(id) NOT NULL,
  attempt_count integer DEFAULT 0,
  first_attempt_at timestamptz DEFAULT now(),
  current_price numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(flight_id)
);

ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to flights"
  ON flights FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to bookings"
  ON bookings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to wallet"
  ON wallet FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public update to wallet"
  ON wallet FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public insert to wallet"
  ON wallet FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to price_tracking"
  ON price_tracking FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to price_tracking"
  ON price_tracking FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to price_tracking"
  ON price_tracking FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

INSERT INTO flights (flight_number, airline, departure_city, arrival_city, base_price, departure_time, arrival_time) VALUES
  ('AI101', 'Air India', 'Mumbai', 'Delhi', 2500, '06:00', '08:30'),
  ('6E202', 'IndiGo', 'Delhi', 'Bangalore', 2800, '09:15', '12:00'),
  ('SG303', 'SpiceJet', 'Bangalore', 'Mumbai', 2200, '14:30', '16:45'),
  ('UK404', 'Vistara', 'Chennai', 'Kolkata', 2600, '07:45', '10:15'),
  ('AI505', 'Air India', 'Hyderabad', 'Pune', 2300, '11:00', '12:30'),
  ('6E606', 'IndiGo', 'Kolkata', 'Chennai', 2900, '16:00', '18:30'),
  ('SG707', 'SpiceJet', 'Pune', 'Delhi', 2700, '05:30', '08:00'),
  ('UK808', 'Vistara', 'Delhi', 'Hyderabad', 2400, '13:45', '16:00'),
  ('AI909', 'Air India', 'Mumbai', 'Kolkata', 3000, '10:30', '13:15'),
  ('6E010', 'IndiGo', 'Bangalore', 'Pune', 2100, '18:00', '19:30'),
  ('SG111', 'SpiceJet', 'Chennai', 'Mumbai', 2800, '08:30', '11:00'),
  ('UK212', 'Vistara', 'Delhi', 'Chennai', 2900, '12:00', '14:45'),
  ('AI313', 'Air India', 'Kolkata', 'Bangalore', 2700, '15:30', '18:00'),
  ('6E414', 'IndiGo', 'Pune', 'Hyderabad', 2200, '06:45', '08:15'),
  ('SG515', 'SpiceJet', 'Hyderabad', 'Delhi', 2600, '19:00', '21:30'),
  ('UK616', 'Vistara', 'Mumbai', 'Chennai', 2500, '07:00', '09:30'),
  ('AI717', 'Air India', 'Bangalore', 'Kolkata', 2800, '11:30', '14:00'),
  ('6E818', 'IndiGo', 'Delhi', 'Pune', 2400, '17:00', '19:30'),
  ('SG919', 'SpiceJet', 'Chennai', 'Hyderabad', 2100, '09:00', '10:30'),
  ('UK020', 'Vistara', 'Kolkata', 'Mumbai', 2900, '14:00', '16:45');

INSERT INTO wallet (user_id, balance) VALUES ('default_user', 50000);
