// TEST FILE - Run this in browser console to test analytics
// Open your website, then paste this in browser console (F12)

import { trackFileOpen } from './lib/analytics';

// Test tracking
trackFileOpen({
  regulation: 22,
  branch: 'IT',
  year: 2,
  sem: 1,
  subject_name: 'PS',
  material_type: 'Notes',
  material_name: 'Test File',
  url: 'https://example.com',
  unit: 1
});

// Check console for success/error message
// Then check Supabase Table Editor -> file_opens for the entry
