-- SUPABASE SCHEMA REBUILD
-- Copy and run this in your Supabase SQL Editor

-- Drop existing if any to start clean
DROP TABLE IF EXISTS followups CASCADE;
DROP TABLE IF EXISTS visits CASCADE;
DROP TABLE IF EXISTS patients CASCADE;

-- TABLE: patients
CREATE TABLE patients (
  id              uuid PRIMARY KEY default gen_random_uuid(),
  name            text NOT NULL,
  age             integer NOT NULL,
  gender          text,
  phone           text UNIQUE NOT NULL, -- Phone is unique search key
  email           text,
  chief_complaint text,
  location        text,
  medical_history text, -- allergies, medications, systemic conditions
  created_at      timestamptz default now()
);

-- TABLE: visits
CREATE TABLE visits (
  id              uuid PRIMARY KEY default gen_random_uuid(),
  patient_id      uuid REFERENCES patients(id) ON DELETE CASCADE,
  visit_date      date NOT NULL DEFAULT CURRENT_DATE,
  doctor          text,
  status          text NOT NULL DEFAULT 'pending', -- 'pending' | 'completed' | 'followup_pending'
  procedures      text[], -- array of procedure names
  procedure_notes text,
  completion_pct  integer DEFAULT 0, -- 0–100
  total_cost      numeric(10,2) DEFAULT 0,
  amount_paid     numeric(10,2) DEFAULT 0,
  payment_status  text DEFAULT 'unpaid', -- 'unpaid' | 'partial' | 'paid'
  chief_complaint text, -- For the specific visit
  created_at      timestamptz default now()
);

-- TABLE: followups
CREATE TABLE followups (
  id              uuid PRIMARY KEY default gen_random_uuid(),
  visit_id        uuid REFERENCES visits(id) ON DELETE CASCADE,
  patient_id      uuid REFERENCES patients(id) ON DELETE CASCADE,
  scheduled_date  date NOT NULL,
  reason          text,
  status          text DEFAULT 'upcoming', -- 'upcoming' | 'completed' | 'missed'
  created_at      timestamptz default now()
);

-- Enable RLS (Optional but recommended)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;

-- Simple policies for public access (In a real app, restrict to authenticated admins)
CREATE POLICY "Public full access patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access visits" ON visits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access followups" ON followups FOR ALL USING (true) WITH CHECK (true);
