-- VJIT Study Vault - Simplified Supabase Schema
-- Only Subjects and Materials are stored in database
-- Regulations, Branches, Years, Semesters remain hardcoded in the app

-- Run this SQL in your Supabase SQL Editor

-- =====================================================
-- 1. SUBJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  regulation TEXT NOT NULL,      -- e.g., 'R22', 'R25'
  branch TEXT NOT NULL,           -- e.g., 'IT', 'CSE', 'ECE'
  year TEXT NOT NULL,             -- e.g., '1st Year', '2nd Year'
  semester TEXT NOT NULL,         -- e.g., 'Sem 1', 'Sem 2'
  name TEXT NOT NULL,             -- Subject name
  code TEXT,                      -- Subject code (optional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subjects_lookup 
ON subjects(regulation, branch, year, semester);

-- =====================================================
-- 2. MATERIAL TYPES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS material_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  has_subcategory BOOLEAN DEFAULT FALSE,
  icon TEXT NOT NULL,             -- Icon name (e.g., 'FileText', 'Clock')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default material types
INSERT INTO material_types (name, has_subcategory, icon) VALUES 
  ('Notes', FALSE, 'FileText'),
  ('Question Bank', FALSE, 'HelpCircle'),
  ('PYQs', TRUE, 'Clock'),
  ('Important Questions', FALSE, 'Star'),
  ('Syllabus', FALSE, 'List'),
  ('Lab Manual', FALSE, 'FlaskConical'),
  ('Textbook', FALSE, 'BookOpen'),
  ('PPTs', FALSE, 'Presentation')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 3. MATERIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  material_type_id UUID NOT NULL REFERENCES material_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  drive_url TEXT NOT NULL,
  year_optional TEXT,             -- For PYQs: '2024', '2023', etc.
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_materials_subject 
ON materials(subject_id, material_type_id);

CREATE INDEX IF NOT EXISTS idx_materials_year 
ON materials(subject_id, material_type_id, year_optional);

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON subjects FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON material_types FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON materials FOR SELECT USING (true);

-- =====================================================
-- EXAMPLE DATA (for testing)
-- =====================================================

-- Example: Add subjects for IT, R22, 1st Year, Sem 1
INSERT INTO subjects (regulation, branch, year, semester, name, code) VALUES 
  ('R22', 'IT', '1st Year', 'Sem 1', 'Programming for Problem Solving', 'CS101'),
  ('R22', 'IT', '1st Year', 'Sem 1', 'Engineering Mathematics-I', 'MA101'),
  ('R22', 'IT', '1st Year', 'Sem 1', 'Engineering Physics', 'PH101'),
  ('R22', 'IT', '1st Year', 'Sem 1', 'Engineering Chemistry', 'CH101'),
  ('R22', 'IT', '1st Year', 'Sem 1', 'English', 'EN101')
ON CONFLICT DO NOTHING;

-- To add materials, first get the subject_id and material_type_id:
-- SELECT id FROM subjects WHERE name = 'Programming for Problem Solving';
-- SELECT id FROM material_types WHERE name = 'Notes';

-- Example: Add materials (replace UUIDs with actual values)
/*
INSERT INTO materials (subject_id, material_type_id, name, drive_url, description) VALUES 
  ('subject-uuid-here', 'notes-type-uuid', 'Unit 1 - Introduction', 'https://drive.google.com/file/d/YOUR_FILE_ID/view', 'Basics of programming'),
  ('subject-uuid-here', 'pyqs-type-uuid', 'Mid Term Paper', 'https://drive.google.com/file/d/YOUR_FILE_ID/view', 'MT-1 2024', '2024');
*/

-- =====================================================
-- HELPER QUERIES (run these to get IDs for inserting data)
-- =====================================================

-- Get all subjects for a specific combination:
-- SELECT * FROM subjects WHERE regulation = 'R22' AND branch = 'IT' AND year = '1st Year' AND semester = 'Sem 1';

-- Get material type IDs:
-- SELECT id, name FROM material_types;

-- Check what materials exist for a subject:
-- SELECT m.*, mt.name as material_type FROM materials m 
-- JOIN material_types mt ON m.material_type_id = mt.id 
-- WHERE m.subject_id = 'your-subject-uuid';
