# Schema Migration Guide (v1 → v2)

## Overview
This guide helps you migrate from the old text-based schema to the new integer-based schema with unit support.

## Major Changes

### 1. **Subjects Table**
- `regulation` changed from TEXT → INTEGER (22 instead of "R22")
- `year` changed from TEXT → INTEGER (1 instead of "1st Year")
- `sem` changed from TEXT → INTEGER (1 instead of "Sem 1")
- `code` column removed
- `credits` column added (INTEGER)

### 2. **Materials Table**
- `drive_url` renamed to `url` (supports both Drive and YouTube links)
- `description` column removed
- `unit` column added (INTEGER, optional, for Notes and YouTube Videos)

### 3. **Material Types Table**
- `has_subcategory` renamed to `has_units` for clarity
- New material type: "YouTube Videos" with `has_units = true`

## Migration Steps

### Step 1: Backup Your Data
```sql
-- Export your current data first!
-- In Supabase Dashboard: Table Editor → Export as CSV
```

### Step 2: Run the New Schema
1. Go to Supabase Dashboard → SQL Editor
2. Open and run `supabase-schema-v2.sql`
3. This will drop existing tables and create new ones

### Step 3: Transform and Re-insert Data

#### For Subjects:
```sql
-- Example transformation from old to new format
INSERT INTO subjects (regulation, branch, year, sem, name, credits)
VALUES 
  (22, 'CSE', 1, 1, 'Engineering Mathematics', 4),
  (22, 'CSE', 1, 1, 'Programming for Problem Solving', 3),
  (22, 'CSE', 1, 1, 'Engineering Chemistry', 4);

-- Pattern:
-- R22 → 22
-- 1st Year → 1, 2nd Year → 2, etc.
-- Sem 1 → 1, Sem 2 → 2, etc.
-- subject_code (removed) → credits (e.g., "MATH101" → 4)
```

#### For Materials:
```sql
-- Example for PYQs (no changes needed except drive_url → url)
INSERT INTO materials (subject_id, material_type_id, name, url, year_optional)
VALUES 
  ('uuid-here', 'material-type-uuid', 'Mid-1 Question Paper', 'https://drive.google.com/...', '2024');

-- Example for Notes with Units
INSERT INTO materials (subject_id, material_type_id, name, url, unit)
VALUES 
  ('subject-uuid', 'notes-type-uuid', 'Unit 1 - Introduction', 'https://drive.google.com/...', 1),
  ('subject-uuid', 'notes-type-uuid', 'Unit 1 - Key Concepts', 'https://drive.google.com/...', 1),
  ('subject-uuid', 'notes-type-uuid', 'Unit 2 - Advanced Topics', 'https://drive.google.com/...', 2);

-- Example for YouTube Videos
INSERT INTO materials (subject_id, material_type_id, name, url, unit)
VALUES 
  ('subject-uuid', 'youtube-type-uuid', 'Unit 1 Lecture Part 1', 'https://youtube.com/watch?v=...', 1);
```

### Step 4: Update Material Types
The schema automatically creates these material types:
- Notes (has_units = true)
- PYQs (has_units = false, has_subcategory = true for year selection)
- Reference Books (has_units = false)
- YouTube Videos (has_units = true) ← NEW!

No manual updates needed unless you want to customize.

## Data Conversion Reference

### Regulation Conversion
- R22 → 22
- R20 → 20
- R18 → 18

### Year Conversion
- "1st Year" → 1
- "2nd Year" → 2
- "3rd Year" → 3
- "4th Year" → 4

### Semester Conversion
- "Sem 1" → 1
- "Sem 2" → 2

### Credits (New Field)
Estimate based on typical course structure:
- Mathematics/Science subjects: 4 credits
- Programming/Lab subjects: 3 credits
- English/Communication: 2-3 credits
- Check your university curriculum for exact values

## Testing the Migration

1. **Run the dev server:**
   ```bash
   npm run dev
   ```

2. **Test navigation flow:**
   - Select Regulation → Branch → Year → Semester
   - You should see subjects with credits (not codes)
   - Click a subject → Select "Notes" or "YouTube Videos"
   - You should see unit selection (Unit 1, Unit 2, etc.)
   - Click a unit → See materials for that unit
   - For PYQs, year selection should still work

3. **Test YouTube links:**
   - Add a YouTube video material
   - It should show a YouTube icon (red)
   - Clicking should open in new tab

## Rollback Plan

If something goes wrong, you can restore the old schema:

1. Run `supabase-schema.sql` (old schema)
2. Import your CSV backups
3. Revert code changes in git:
   ```bash
   git stash
   ```

## Need Help?

- Check `supabase-schema-v2.sql` for the complete new schema
- See `CONTENT_TEMPLATE.md` for the new data format
- The Python scripts in `scripts/` may need updates for the new schema

## Summary of UI Changes

Users will notice:
- ✅ Subjects show "X Credits" instead of subject code
- ✅ Notes and YouTube Videos have unit-based organization
- ✅ YouTube links have a red YouTube icon
- ✅ Cleaner, more organized material browsing
