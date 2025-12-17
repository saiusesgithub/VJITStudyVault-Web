# Supabase Free Tier Limits & Analytics Queries

## 📊 Supabase Free Tier (Forever Free)

### What You Get:
- ✅ **500 MB database** space
- ✅ **5 GB bandwidth** per month
- ✅ **1 GB file storage**
- ✅ **50,000 monthly active users**
- ✅ **Unlimited API requests** (no rate limit on free tier!)
- ✅ **2 CPU cores** shared
- ✅ **No credit card required**

### Will You Hit Limits?

**Realistic Estimate for Your Use Case:**

1. **Database Storage (500 MB):**
   - Each file_opens record ≈ 500 bytes
   - 500 MB = **~1 million file open events**
   - If 1000 students open 100 files each = 100,000 records = 50 MB
   - **You're safe for years** ✅

2. **Bandwidth (5 GB/month):**
   - Each query ≈ 1-5 KB
   - 5 GB = **~1-5 million queries**
   - Your small records use minimal bandwidth
   - **Unlikely to hit this** ✅

3. **File Opens Tracking:**
   - 10,000 file opens/month = 5 MB storage + 0.1 GB bandwidth
   - **No problem at all** ✅

### What Happens if You Hit Limits?
- Database pauses (doesn't delete data)
- Website continues working (just analytics stops)
- Upgrade to Pro ($25/month) or clear old data

---

## 📈 Useful Analytics Queries (Enhanced with Device Data)

### 1. Most Popular Files
```sql
SELECT 
  subject_name,
  material_type,
  material_name,
  COUNT(*) as open_count,
  COUNT(DISTINCT device_type) as unique_devices
FROM file_opens
GROUP BY subject_name, material_type, material_name
ORDER BY open_count DESC
LIMIT 20;
```

### 2. Device Breakdown
```sql
SELECT 
  device_type,
  COUNT(*) as opens,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM file_opens
GROUP BY device_type
ORDER BY opens DESC;
```

### 3. Operating System Stats
```sql
SELECT 
  os,
  COUNT(*) as users,
  COUNT(DISTINCT branch) as branches
FROM file_opens
GROUP BY os
ORDER BY users DESC;
```

### 4. Browser Usage
```sql
SELECT 
  browser,
  device_type,
  COUNT(*) as opens
FROM file_opens
GROUP BY browser, device_type
ORDER BY opens DESC;
```

### 5. Mobile vs Desktop by Subject
```sql
SELECT 
  subject_name,
  device_type,
  COUNT(*) as opens
FROM file_opens
GROUP BY subject_name, device_type
ORDER BY subject_name, opens DESC;
```

### 6. Peak Usage Times (Hourly)
```sql
SELECT 
  EXTRACT(HOUR FROM opened_at) as hour,
  COUNT(*) as opens,
  COUNT(DISTINCT device_type) as device_types
FROM file_opens
WHERE opened_at >= NOW() - INTERVAL '7 days'
GROUP BY EXTRACT(HOUR FROM opened_at)
ORDER BY hour;
```

### 7. Screen Resolutions (Popular Sizes)
```sql
SELECT 
  screen_width,
  screen_height,
  device_type,
  COUNT(*) as count
FROM file_opens
WHERE screen_width IS NOT NULL
GROUP BY screen_width, screen_height, device_type
ORDER BY count DESC
LIMIT 10;
```

### 8. Branch Activity Comparison
```sql
SELECT 
  branch,
  COUNT(*) as total_opens,
  COUNT(DISTINCT subject_name) as subjects_accessed,
  COUNT(DISTINCT device_type) as device_types,
  MAX(opened_at) as last_activity
FROM file_opens
GROUP BY branch
ORDER BY total_opens DESC;
```

### 9. Daily Activity (Last 30 Days)
```sql
SELECT 
  DATE(opened_at) as date,
  COUNT(*) as total_opens,
  COUNT(DISTINCT device_type) as device_types,
  COUNT(CASE WHEN device_type = 'mobile' THEN 1 END) as mobile_opens,
  COUNT(CASE WHEN device_type = 'desktop' THEN 1 END) as desktop_opens
FROM file_opens
WHERE opened_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(opened_at)
ORDER BY date DESC;
```

### 10. Material Type Preferences by Device
```sql
SELECT 
  material_type,
  device_type,
  COUNT(*) as opens,
  AVG(CASE WHEN screen_width < 768 THEN 1.0 ELSE 0.0 END) * 100 as pct_small_screen
FROM file_opens
GROUP BY material_type, device_type
ORDER BY material_type, opens DESC;
```

---

## 🗄️ Database Maintenance (If You Approach Limits)

### Check Current Usage
```sql
-- Check total records
SELECT COUNT(*) as total_records FROM file_opens;

-- Check database size
SELECT pg_size_pretty(pg_total_relation_size('file_opens')) as table_size;
```

### Archive Old Data (Keep Last 6 Months)
```sql
-- Delete records older than 6 months (run if needed)
DELETE FROM file_opens 
WHERE opened_at < NOW() - INTERVAL '6 months';

-- Or export and delete older than 1 year
```

### Compress Data (Aggregate Old Records)
```sql
-- Create summary table for historical data
CREATE TABLE file_opens_summary AS
SELECT 
  DATE(opened_at) as date,
  subject_name,
  material_type,
  device_type,
  COUNT(*) as open_count
FROM file_opens
WHERE opened_at < NOW() - INTERVAL '6 months'
GROUP BY DATE(opened_at), subject_name, material_type, device_type;

-- Then delete the detailed records
DELETE FROM file_opens WHERE opened_at < NOW() - INTERVAL '6 months';
```

---

## 💰 Cost Estimate for Scale

### If You Outgrow Free Tier:
- **Pro Plan: $25/month**
  - 8 GB database (16x more)
  - 50 GB bandwidth (10x more)
  - 100 GB file storage
  - Suitable for **10,000+ active students**

### When to Upgrade?
- Only if you hit **500 MB database** (unlikely for years)
- Or exceed **5 GB bandwidth/month** (also unlikely)
- You'll get email warnings before hitting limits

---

## 🎯 Recommendations

1. **Start with free tier** - Perfect for your needs
2. **Run the updated analytics-schema-fix.sql** - Adds device tracking
3. **Monitor usage monthly** - Check Supabase dashboard
4. **Archive old data yearly** - Keep last 12 months
5. **Google Analytics is primary** - Use Supabase for detailed file tracking

**Bottom Line:** You won't hit limits unless you get **100,000+ monthly active users**. Even then, you can clean old data or upgrade for $25/month.
