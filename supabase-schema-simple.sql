-- =====================================================
-- VJIT STUDY VAULT - SIMPLE DATABASE SCHEMA
-- Single table approach - frontend filters dynamically
-- =====================================================

-- Drop existing tables
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS material_types CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;

-- =====================================================
-- ONE TABLE TO RULE THEM ALL
-- =====================================================
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Subject Info
  regulation INTEGER NOT NULL,        -- 22, 25
  branch TEXT NOT NULL,                -- IT, CSE, DS, ECE
  year INTEGER NOT NULL,               -- 1, 2, 3, 4
  sem INTEGER NOT NULL,                -- 1, 2
  subject_name TEXT NOT NULL,          -- "Probability and Statistics"
  credits INTEGER NOT NULL,            -- 3, 4
  
  -- Material Info
  material_type TEXT NOT NULL,         -- "Notes", "PYQs", "Question Bank", etc.
  material_name TEXT NOT NULL,         -- "Unit 1 Notes", "Mid-1 Paper", etc.
  url TEXT NOT NULL,                   -- Drive or YouTube URL
  
  -- Optional Fields
  unit INTEGER,                        -- For Notes/YouTube: 1, 2, 3, 4, 5
  year_optional TEXT,                  -- For PYQs: "2024", "2023"
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast filtering
CREATE INDEX idx_materials_subject_lookup ON materials(regulation, branch, year, sem);
CREATE INDEX idx_materials_subject_materials ON materials(regulation, branch, year, sem, subject_name, material_type);
CREATE INDEX idx_materials_unit ON materials(subject_name, material_type, unit);

-- Enable RLS
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read" ON materials FOR SELECT USING (true);

-- =====================================================
-- EXAMPLE DATA
-- =====================================================

-- Probability and Statistics - Notes with units
INSERT INTO materials (regulation, branch, year, sem, subject_name, credits, material_type, material_name, url, unit) VALUES
  (22, 'IT', 2, 1, 'Probability and Statistics', 4, 'Notes', 'Unit 1 Notes', 'https://drive.google.com/file/d/12mKSFC5opEUJYMqPt7BgCYmDaBMMZBJ2/view', 1),
  (22, 'IT', 2, 1, 'Probability and Statistics', 4, 'Notes', 'Unit 1 Notes (v2)', 'https://drive.google.com/file/d/1GBoXmHonqUjbe_sHK4G55_axz5--k3Mq/view', 1),
  (22, 'IT', 2, 1, 'Probability and Statistics', 4, 'Notes', 'Unit 2 Notes', 'https://drive.google.com/file/d/1qI1nEkzck1P55s4Q6r9dNeDhfhL0lRR5/view', 2);

-- Same subject, different branches (same data, different branch)
INSERT INTO materials (regulation, branch, year, sem, subject_name, credits, material_type, material_name, url, unit) VALUES
  (22, 'CSE', 2, 1, 'Probability and Statistics', 4, 'Notes', 'Unit 1 Notes', 'https://drive.google.com/file/d/12mKSFC5opEUJYMqPt7BgCYmDaBMMZBJ2/view', 1),
  (22, 'DS', 2, 1, 'Probability and Statistics', 4, 'Notes', 'Unit 1 Notes', 'https://drive.google.com/file/d/12mKSFC5opEUJYMqPt7BgCYmDaBMMZBJ2/view', 1);

-- Question Bank (no unit)
INSERT INTO materials (regulation, branch, year, sem, subject_name, credits, material_type, material_name, url) VALUES
  (22, 'IT', 2, 1, 'Probability and Statistics', 4, 'Question Bank', 'Question Bank', 'https://drive.google.com/file/d/1PjJbV2jt3CvIgmCadRZh8sjOan_UhpVy/view');

-- YouTube Playlist (no unit - opens directly)
INSERT INTO materials (regulation, branch, year, sem, subject_name, credits, material_type, material_name, url) VALUES
  (22, 'IT', 2, 1, 'Probability and Statistics', 4, 'YouTube Videos', 'Complete Playlist', 'https://youtube.com/playlist?list=PLcejZ7Xxx9YNJH5X_1y-X2_vdihH4MjWF');

-- PYQs with years
INSERT INTO materials (regulation, branch, year, sem, subject_name, credits, material_type, material_name, url, year_optional) VALUES
  (22, 'IT', 2, 1, 'Data Structures', 3, 'PYQs', 'Mid-1 Paper', 'https://drive.google.com/file/d/xxxxx/view', '2024'),
  (22, 'IT', 2, 1, 'Data Structures', 3, 'PYQs', 'Mid-1 Paper', 'https://drive.google.com/file/d/xxxxx/view', '2023');

-- =====================================================
-- HELPER QUERIES FOR FRONTEND
-- =====================================================

-- Get unique subjects for a selection
-- SELECT DISTINCT subject_name, credits 
-- FROM materials 
-- WHERE regulation = 22 AND branch = 'IT' AND year = 2 AND sem = 1
-- ORDER BY subject_name;

-- Get available material types for a subject
-- SELECT DISTINCT material_type 
-- FROM materials 
-- WHERE regulation = 22 AND branch = 'IT' AND year = 2 AND sem = 1 AND subject_name = 'Probability and Statistics'
-- ORDER BY material_type;

-- Get available units for Notes/YouTube
-- SELECT DISTINCT unit 
-- FROM materials 
-- WHERE subject_name = 'Probability and Statistics' AND material_type = 'Notes' AND unit IS NOT NULL
-- ORDER BY unit;

-- Get available years for PYQs
-- SELECT DISTINCT year_optional 
-- FROM materials 
-- WHERE subject_name = 'Data Structures' AND material_type = 'PYQs' AND year_optional IS NOT NULL
-- ORDER BY year_optional DESC;

-- Get all materials for a specific combo
-- SELECT * FROM materials 
-- WHERE subject_name = 'Probability and Statistics' 
--   AND material_type = 'Notes' 
--   AND unit = 1
-- ORDER BY material_name;
