# Analytics Setup Guide

## 🚀 Quick Start - Google Analytics 4 (Free Forever)

### Step 1: Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring"
4. Enter account name (e.g., "VJIT Study Vault")
5. Configure account settings → Click "Next"
6. Enter property name → Select timezone (India) → Click "Next"
7. Choose "Business" category and size
8. Click "Create" and accept terms

### Step 2: Set up Data Stream
1. Select "Web" as platform
2. Enter your website URL (e.g., `https://yourdomain.com`)
3. Enter stream name (e.g., "Study Vault Website")
4. Click "Create stream"
5. **Copy your Measurement ID** (looks like `G-XXXXXXXXXX`)

### Step 3: Add Measurement ID to Your Project
1. Create a `.env` file in your project root:
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. Add `.env` to `.gitignore` (if not already):
```
.env
.env.local
```

### Step 4: Deploy and Test
1. Run your dev server:
```bash
npm run dev
```

2. Open your website
3. Go to Google Analytics → Reports → Realtime
4. You should see yourself as an active user!

---

## 📊 What You'll Get (Automatically):

### Google Analytics Dashboard Shows:
- ✅ **Unique visitors** (daily/weekly/monthly)
- ✅ **Total page views** (all time + trends)
- ✅ **Real-time users** (who's online now)
- ✅ **Most viewed pages**
- ✅ **User locations** (countries/cities)
- ✅ **Device breakdown** (mobile/desktop/tablet)
- ✅ **Traffic sources** (direct/social/search)
- ✅ **Custom events** (file opens - already implemented!)

### Custom Events We Track:
- `file_open` - When users open study materials
  - Parameters: subject, material_type, branch, year, sem
- `navigation` - User navigation through app
- `page_view` - Automatic page tracking

---

## 🗄️ Optional: Supabase Analytics (Custom File Tracking)

### Why Add This?
- Build your own analytics dashboard
- Query most popular files directly
- More control over data

### Setup:
1. Run `analytics-schema.sql` in Supabase SQL Editor
2. That's it! File opens are now tracked in your database

### Useful Queries:

**Most opened files:**
```sql
SELECT 
  subject_name,
  material_type,
  material_name,
  COUNT(*) as open_count
FROM file_opens
GROUP BY subject_name, material_type, material_name
ORDER BY open_count DESC
LIMIT 20;
```

**Popular subjects:**
```sql
SELECT 
  subject_name,
  COUNT(*) as open_count
FROM file_opens
GROUP BY subject_name
ORDER BY open_count DESC;
```

**Activity over time:**
```sql
SELECT 
  DATE(opened_at) as date,
  COUNT(*) as opens
FROM file_opens
WHERE opened_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(opened_at)
ORDER BY date DESC;
```

---

## 🎯 Analytics Dashboard Access

### Google Analytics:
- URL: https://analytics.google.com/
- View realtime users, page views, events
- Export data, create custom reports
- Set up email alerts for milestones

### Supabase Dashboard:
- URL: https://supabase.com/dashboard
- Go to Table Editor → `file_opens`
- Run SQL queries for custom analytics
- Can build React dashboard later if needed

---

## 📱 What Gets Tracked:

✅ **Automatically:**
- Every page visit
- Unique visitors (cookie-based)
- Session duration
- Bounce rate
- Geographic location
- Device type

✅ **Custom Events (already implemented):**
- File opens (Drive/YouTube links)
- Navigation through app
- Material type selections

❌ **NOT Tracked (Privacy):**
- No personal information
- No user accounts/emails
- No passwords or sensitive data

---

## 🔒 Privacy & GDPR

- Google Analytics anonymizes IP addresses by default
- No personal data is collected
- Users can opt-out via browser settings
- Analytics only track usage patterns

---

## 💰 Cost: **FREE**

- Google Analytics 4: Free forever (10M events/month)
- Supabase: Free tier (500MB database)
- No credit card required
- No paid features needed

---

## 🐛 Troubleshooting

**Not seeing data in Google Analytics?**
- Wait 24-48 hours for initial data
- Check "Realtime" report for instant feedback
- Verify Measurement ID in `.env`
- Check browser console for errors

**File opens not tracking in Supabase?**
- Verify `analytics-schema.sql` was run
- Check RLS policies allow INSERT
- Check browser console for errors

---

## 📈 Next Steps

1. ✅ Set up Google Analytics (5 min)
2. ✅ Add Measurement ID to `.env`
3. ✅ Deploy your website
4. 📊 Wait 24-48 hours for data
5. 🎉 View your analytics dashboard!

Optional:
- Run `analytics-schema.sql` for custom tracking
- Build a React dashboard page (later)
- Set up email alerts in GA4
