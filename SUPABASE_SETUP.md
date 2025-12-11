# Supabase Setup Guide for VJIT Study Vault

## Overview
This project uses Supabase to store and fetch:
- **Subjects** (based on regulation, branch, year, semester)
- **Material Types** (Notes, PYQs, etc.)
- **Materials** (PDFs with Google Drive links)

All other data (regulations, branches, years, semesters) are hardcoded in the frontend.

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Fill in project details and wait for setup to complete
4. Note your **Project URL** and **Anon Key** from Settings → API

---

## Step 2: Run the Database Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the contents of `supabase-schema.sql` from this project
4. Paste and click "Run"

This will create 3 tables:
- `subjects` - All subjects for different regulations/branches/years/semesters
- `material_types` - Types of materials (Notes, PYQs, etc.)
- `materials` - Individual PDFs with Drive links

---

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## Step 4: Add Data to Supabase

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to **Table Editor** in your Supabase dashboard
2. Select the `subjects` table
3. Click "Insert row" and add subjects with:
   - `regulation`: R22, R25, etc.
   - `branch`: IT, CSE, ECE, etc.
   - `year`: 1st Year, 2nd Year, etc.
   - `semester`: Sem 1, Sem 2
   - `name`: Subject name
   - `code`: Subject code (optional)

4. Select the `materials` table
5. Click "Insert row" and add materials with:
   - `subject_id`: UUID of the subject (copy from subjects table)
   - `material_type_id`: UUID of material type (copy from material_types table)
   - `name`: PDF name (e.g., "Unit 1 Notes")
   - `drive_url`: Google Drive link
   - `description`: Optional description
   - `year_optional`: For PYQs, add year like "2024"

### Option B: Using SQL (For bulk inserts)

Run this in SQL Editor:

```sql
-- Get IDs first
SELECT id, name FROM material_types;
-- Note down the IDs you need

-- Insert subjects (replace with your actual values)
INSERT INTO subjects (regulation, branch, year, semester, name, code) VALUES 
  ('R22', 'IT', '1st Year', 'Sem 1', 'Programming for Problem Solving', 'CS101'),
  ('R22', 'IT', '1st Year', 'Sem 1', 'Engineering Mathematics-I', 'MA101'),
  ('R22', 'CSE', '2nd Year', 'Sem 1', 'Data Structures', 'CS201');

-- Get subject IDs
SELECT id, name FROM subjects;
-- Note down the IDs

-- Insert materials (replace UUIDs with actual IDs from above)
INSERT INTO materials (subject_id, material_type_id, name, drive_url, description) VALUES 
  ('subject-uuid-here', 'notes-type-uuid', 'Unit 1 - Introduction', 'https://drive.google.com/file/d/YOUR_FILE_ID/view', 'Basic concepts'),
  ('subject-uuid-here', 'pyqs-type-uuid', 'Mid Term 1 Paper', 'https://drive.google.com/file/d/YOUR_FILE_ID/view', 'Previous year paper', '2024');
```

---

## Step 5: Getting Google Drive Links

1. Upload PDF to Google Drive
2. Right-click → Share → Change to "Anyone with the link"
3. Copy the link (format: `https://drive.google.com/file/d/FILE_ID/view`)
4. Use this link in the `drive_url` field

---

## Database Schema Details

### `subjects` Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Auto-generated |
| regulation | TEXT | R22, R25, etc. |
| branch | TEXT | IT, CSE, ECE, etc. |
| year | TEXT | 1st Year, 2nd Year, etc. |
| semester | TEXT | Sem 1, Sem 2 |
| name | TEXT | Subject name |
| code | TEXT | Subject code (optional) |

### `material_types` Table (Pre-populated)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Auto-generated |
| name | TEXT | Notes, PYQs, etc. |
| has_subcategory | BOOLEAN | TRUE for PYQs (year selection) |
| icon | TEXT | Icon name for UI |

### `materials` Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Auto-generated |
| subject_id | UUID | References subjects table |
| material_type_id | UUID | References material_types table |
| name | TEXT | PDF name/title |
| drive_url | TEXT | Google Drive link |
| description | TEXT | Optional description |
| year_optional | TEXT | For PYQs - exam year like "2024" |

---

## Features Implemented

✅ **LocalStorage Persistence** - User selections saved across sessions  
✅ **Dynamic Subject Loading** - Subjects fetched based on regulation/branch/year/sem  
✅ **Smart Material Type Display** - Only shows material types that have content  
✅ **PYQ Year Filtering** - Automatically shows available years for PYQs  
✅ **Direct Drive Links** - Opens PDFs in new tab  
✅ **Loading States** - Spinners while fetching data  
✅ **Error Handling** - Toast notifications for errors  

---

## Testing the Setup

1. Start the dev server: `npm run dev`
2. Navigate through: Regulation → Branch → Year → Semester
3. On Subjects page, you should see subjects from Supabase
4. Select a subject → material types with content appear
5. Select material type → PDFs load from database
6. Click "Open" → Google Drive link opens in new tab

---

## Troubleshooting

**No subjects showing up?**
- Check if data exists in Supabase Table Editor
- Verify regulation/branch/year/semester values match exactly (case-sensitive)
- Open browser console for error messages

**Drive links not working?**
- Ensure sharing is set to "Anyone with the link"
- URL format should be: `https://drive.google.com/file/d/FILE_ID/view`

**Environment variables not loading?**
- Restart dev server after creating `.env`
- File must be named exactly `.env` (not `.env.local`)
- Variables must start with `VITE_` prefix

---

## Next Steps

- Add more subjects for different branches/years
- Upload study materials to Drive and add links
- Test the complete flow
- Consider adding admin panel for easier data management
