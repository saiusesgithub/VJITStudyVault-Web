# Adding Device Data Fields to Analytics

## Overview
This guide shows how to safely add device manufacturer and model tracking to the existing `file_opens` table without breaking production or losing existing 3200+ records.

## Step 1: Add New Columns to Supabase (SAFE - Doesn't affect existing data)

Go to Supabase SQL Editor and run this:

```sql
-- Add new columns for device data (all nullable, won't affect existing records)
ALTER TABLE file_opens
ADD COLUMN IF NOT EXISTS device_manufacturer TEXT,
ADD COLUMN IF NOT EXISTS device_model TEXT,
ADD COLUMN IF NOT EXISTS device_vendor TEXT,
ADD COLUMN IF NOT EXISTS platform TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Optional: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_file_opens_device_manufacturer ON file_opens(device_manufacturer);
CREATE INDEX IF NOT EXISTS idx_file_opens_device_model ON file_opens(device_model);
```

**Why this is safe:**
- Uses `ADD COLUMN IF NOT EXISTS` - won't error if column exists
- All columns are nullable - existing 3200 records keep working
- New records will have device data, old records will have NULL
- No data is deleted or modified

## Step 2: Update Code to Collect Device Data

The updated `analytics.ts` file will:
- Extract device manufacturer and model from User Agent
- Fall back gracefully if detection fails
- Not break if browser doesn't support certain APIs

## Step 3: Verify

After deployment:
1. Open the app and click on a material
2. Go to Supabase → Table Editor → file_opens
3. Check the latest record - should have device data filled in
4. Old records (3200+) should still have NULL in new columns - this is expected and OK

## Device Detection Details

**What we can detect:**
- Device Manufacturer: Apple, Samsung, Google, Xiaomi, OnePlus, etc.
- Device Model: iPhone 15, Galaxy S23, Pixel 8, etc.
- Platform: Android, iOS, Windows, macOS, Linux
- Full User Agent: Complete browser string for debugging

**Limitations:**
- Desktop browsers often don't provide specific device model
- Some privacy-focused browsers mask device info
- iOS Safari has limited device model detection

## Querying Device Data

```sql
-- Most popular devices
SELECT device_manufacturer, device_model, COUNT(*) as opens
FROM file_opens
WHERE device_manufacturer IS NOT NULL
GROUP BY device_manufacturer, device_model
ORDER BY opens DESC
LIMIT 20;

-- Mobile vs Desktop usage
SELECT device_type, COUNT(*) as opens
FROM file_opens
GROUP BY device_type
ORDER BY opens DESC;

-- Android device breakdown
SELECT device_manufacturer, COUNT(*) as opens
FROM file_opens
WHERE platform = 'Android'
GROUP BY device_manufacturer
ORDER BY opens DESC;

-- iOS version distribution
SELECT device_model, COUNT(*) as opens
FROM file_opens
WHERE platform = 'iOS'
GROUP BY device_model
ORDER BY opens DESC;
```

## Backwards Compatibility

✅ Existing 3200 records: Untouched, will have NULL in new columns
✅ Existing queries: Still work (new columns are nullable)
✅ Code: Gracefully handles missing device info
✅ Production: No downtime, changes are additive only

## Next Steps

After running this for a week:
1. Check data quality in Supabase
2. Build dashboard to visualize device usage
3. Use insights to optimize for most-used devices
