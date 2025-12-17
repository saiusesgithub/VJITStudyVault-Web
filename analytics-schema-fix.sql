-- =====================================================
-- FIX ANALYTICS TABLE - Drop and recreate with device tracking
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing table and recreate
DROP TABLE IF EXISTS file_opens CASCADE;

CREATE TABLE file_opens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What was opened
  regulation INTEGER NOT NULL,
  branch TEXT NOT NULL,
  year INTEGER NOT NULL,
  sem INTEGER NOT NULL,
  subject_name TEXT NOT NULL,
  material_type TEXT NOT NULL,
  material_name TEXT NOT NULL,
  url TEXT NOT NULL,
  unit INTEGER,
  
  -- Device & Browser Info
  device_type TEXT,           -- 'mobile', 'tablet', 'desktop'
  browser TEXT,               -- 'Chrome', 'Firefox', 'Safari', etc.
  os TEXT,                    -- 'Windows', 'Android', 'iOS', 'Mac', 'Linux'
  screen_width INTEGER,       -- Screen resolution width
  screen_height INTEGER,      -- Screen resolution height
  
  -- When and from where
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying popular files
CREATE INDEX idx_file_opens_subject ON file_opens(subject_name, material_type);
CREATE INDEX idx_file_opens_time ON file_opens(opened_at DESC);
CREATE INDEX idx_file_opens_url ON file_opens(url);
CREATE INDEX idx_file_opens_device ON file_opens(device_type, os);

-- Enable RLS
ALTER TABLE file_opens ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for tracking) - THIS IS THE KEY
CREATE POLICY "Enable insert for all users" ON file_opens 
  FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to read (for analytics queries)
CREATE POLICY "Enable read for all users" ON file_opens 
  FOR SELECT 
  USING (true);

-- Test the table by inserting a dummy record
INSERT INTO file_opens (regulation, branch, year, sem, subject_name, material_type, material_name, url, device_type, browser, os)
VALUES (22, 'IT', 2, 1, 'PS', 'Notes', 'Test Insert', 'https://example.com', 'desktop', 'Chrome', 'Windows');

-- Verify the insert worked
SELECT * FROM file_opens;
