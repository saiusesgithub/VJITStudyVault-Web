-- =====================================================
-- ANALYTICS TABLE - Track file opens (optional)
-- Run this in Supabase SQL Editor if you want custom analytics
-- =====================================================

CREATE TABLE IF NOT EXISTS file_opens (
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
  
  -- When and from where
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Optional: User tracking (if you want to track unique users)
  -- user_fingerprint TEXT,  -- Could be a hash of IP + User Agent
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying popular files
CREATE INDEX idx_file_opens_subject ON file_opens(subject_name, material_type);
CREATE INDEX idx_file_opens_time ON file_opens(opened_at DESC);
CREATE INDEX idx_file_opens_url ON file_opens(url);

-- Enable RLS
ALTER TABLE file_opens ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for tracking)
CREATE POLICY "Allow public insert" ON file_opens FOR INSERT WITH CHECK (true);

-- Only allow reading for authenticated users (if you want to build a dashboard)
-- CREATE POLICY "Allow authenticated read" ON file_opens FOR SELECT USING (auth.role() = 'authenticated');

-- Or allow public read (if you want public analytics)
CREATE POLICY "Allow public read" ON file_opens FOR SELECT USING (true);

-- =====================================================
-- USEFUL QUERIES FOR ANALYTICS
-- =====================================================

-- Most opened files (all time)
-- SELECT 
--   subject_name,
--   material_type,
--   material_name,
--   COUNT(*) as open_count
-- FROM file_opens
-- GROUP BY subject_name, material_type, material_name
-- ORDER BY open_count DESC
-- LIMIT 20;

-- Most popular subjects
-- SELECT 
--   subject_name,
--   COUNT(*) as open_count
-- FROM file_opens
-- GROUP BY subject_name
-- ORDER BY open_count DESC;

-- Opens per day (last 30 days)
-- SELECT 
--   DATE(opened_at) as date,
--   COUNT(*) as opens
-- FROM file_opens
-- WHERE opened_at >= NOW() - INTERVAL '30 days'
-- GROUP BY DATE(opened_at)
-- ORDER BY date DESC;
