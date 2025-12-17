-- VJIT Study Vault - Updated Database Schema
-- Run this SQL in your Supabase SQL Editor

-- =====================================================
-- 1. DROP EXISTING TABLES (if restructuring)
-- =====================================================
-- OPTION A: Start fresh (recommended for testing)
-- Uncomment these lines to drop and recreate everything:
/*
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS material_types CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
*/

-- OPTION B: Keep existing data and migrate
-- If you have existing data, run this migration instead:
/*
-- Add missing columns to existing subjects table
DO $$ 
BEGIN
  -- Add sem column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='subjects' AND column_name='sem') THEN
    ALTER TABLE subjects ADD COLUMN sem INTEGER;
  END IF;
  
  -- Add credits column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='subjects' AND column_name='credits') THEN
    ALTER TABLE subjects ADD COLUMN credits INTEGER DEFAULT 3;
  END IF;
  
  -- Change regulation to INTEGER if it's TEXT
  -- (This is more complex - better to drop and recreate)
END $$;
*/

-- =====================================================
-- 2. SUBJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  regulation INTEGER NOT NULL,    -- e.g., 22, 25
  branch TEXT NOT NULL,            -- e.g., 'IT', 'CSE', 'DS'
  year INTEGER NOT NULL,           -- e.g., 1, 2, 3, 4
  sem INTEGER NOT NULL,            -- e.g., 1, 2
  name TEXT NOT NULL,              -- Subject name
  credits INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(regulation, branch, year, sem, name)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subjects_lookup 
ON subjects(regulation, branch, year, sem);

-- =====================================================
-- 3. MATERIAL TYPES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS material_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  has_units BOOLEAN DEFAULT FALSE,  -- TRUE for Notes and YouTube Videos
  icon TEXT NOT NULL,                -- Lucide icon name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default material types
INSERT INTO material_types (name, has_units, icon) VALUES 
  ('Notes', TRUE, 'FileText'),
  ('Question Bank', FALSE, 'HelpCircle'),
  ('PYQs', FALSE, 'Clock'),
  ('Important Questions', FALSE, 'Star'),
  ('Syllabus', FALSE, 'List'),
  ('Lab Manual', FALSE, 'FlaskConical'),
  ('Textbook', FALSE, 'BookOpen'),
  ('PPTs', FALSE, 'Presentation'),
  ('YouTube Videos', TRUE, 'Youtube')
ON CONFLICT (name) DO UPDATE SET 
  has_units = EXCLUDED.has_units,
  icon = EXCLUDED.icon;

-- =====================================================
-- 4. MATERIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  material_type_id UUID NOT NULL REFERENCES material_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,                 -- Drive URL or YouTube URL
  unit INTEGER,                      -- For Notes/YouTube: 1, 2, 3, etc.
  year_optional TEXT,                -- For PYQs: '2024', '2023', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_materials_subject 
ON materials(subject_id, material_type_id);

CREATE INDEX IF NOT EXISTS idx_materials_unit 
ON materials(subject_id, material_type_id, unit);

CREATE INDEX IF NOT EXISTS idx_materials_year 
ON materials(subject_id, material_type_id, year_optional);

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subjects' AND policyname = 'Allow public read') THEN
    CREATE POLICY "Allow public read" ON subjects FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'material_types' AND policyname = 'Allow public read') THEN
    CREATE POLICY "Allow public read" ON material_types FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'materials' AND policyname = 'Allow public read') THEN
    CREATE POLICY "Allow public read" ON materials FOR SELECT USING (true);
  END IF;
END $$;

-- =====================================================
-- EXAMPLE DATA (for testing)
-- =====================================================

-- Example 1: Add a subject
INSERT INTO subjects (regulation, branch, year, sem, name, credits) VALUES 
  (22, 'IT', 2, 1, 'Probability and Statistics', 3),
  (22, 'CSE', 1, 1, 'Programming for Problem Solving', 4),
  (22, 'DS', 2, 1, 'Data Structures', 4)
ON CONFLICT DO NOTHING;

-- Example 2: Get IDs for inserting materials
-- SELECT id, name FROM subjects WHERE regulation = 22 AND branch = 'IT' LIMIT 5;
-- SELECT id, name, has_units FROM material_types;

-- Example 3: Add Notes with units
/*
-- Replace 'subject-uuid' and 'notes-type-uuid' with actual UUIDs
INSERT INTO materials (subject_id, material_type_id, name, url, unit) VALUES 
  ('subject-uuid', 'notes-type-uuid', 'Introduction to Probability', 'https://drive.google.com/file/d/xxx', 1),
  ('subject-uuid', 'notes-type-uuid', 'Probability Basics - Detailed', 'https://drive.google.com/file/d/xxx', 1),
  ('subject-uuid', 'notes-type-uuid', 'Random Variables', 'https://drive.google.com/file/d/xxx', 2),
  ('subject-uuid', 'notes-type-uuid', 'Distributions', 'https://drive.google.com/file/d/xxx', 3);
*/

-- Example 4: Add YouTube Videos with units
/*
INSERT INTO materials (subject_id, material_type_id, name, url, unit) VALUES 
  ('subject-uuid', 'youtube-type-uuid', 'Probability Lecture 1', 'https://youtube.com/watch?v=xxx', 1),
  ('subject-uuid', 'youtube-type-uuid', 'Probability Lecture 2', 'https://youtube.com/watch?v=xxx', 1),
  ('subject-uuid', 'youtube-type-uuid', 'Random Variables Explained', 'https://youtube.com/watch?v=xxx', 2);
*/

-- Example 5: Add PYQs with years (no units)
/*
INSERT INTO materials (subject_id, material_type_id, name, url, year_optional) VALUES 
  ('subject-uuid', 'pyqs-type-uuid', 'Mid Term 1 Paper', 'https://drive.google.com/file/d/xxx', '2024'),
  ('subject-uuid', 'pyqs-type-uuid', 'Mid Term 1 Paper', 'https://drive.google.com/file/d/xxx', '2023');
*/

-- Example 6: Add materials without units or years
/*
INSERT INTO materials (subject_id, material_type_id, name, url) VALUES 
  ('subject-uuid', 'qb-type-uuid', 'Question Bank', 'https://drive.google.com/file/d/xxx'),
  ('subject-uuid', 'imp-type-uuid', 'Important Questions', 'https://drive.google.com/file/d/xxx');
*/

-- =====================================================
-- HELPER QUERIES
-- =====================================================

-- Get all subjects for a specific combination:
-- SELECT * FROM subjects WHERE regulation = 22 AND branch = 'IT' AND year = 2 AND sem = 1;

-- Get material type IDs and check which have units:
-- SELECT id, name, has_units, icon FROM material_types ORDER BY name;

-- Check available units for Notes in a subject:
-- SELECT DISTINCT unit FROM materials 
-- WHERE subject_id = 'your-subject-uuid' 
--   AND material_type_id = 'notes-type-uuid' 
--   AND unit IS NOT NULL 
-- ORDER BY unit;

-- Get all materials for a specific unit:
-- SELECT * FROM materials 
-- WHERE subject_id = 'subject-uuid' 
--   AND material_type_id = 'notes-type-uuid' 
--   AND unit = 1;

-- Check what materials exist for a subject:
-- SELECT m.name, mt.name as type, m.unit, m.year_optional, m.url 
-- FROM materials m 
-- JOIN material_types mt ON m.material_type_id = mt.id 
-- WHERE m.subject_id = 'your-subject-uuid'
-- ORDER BY mt.name, m.unit, m.name;
