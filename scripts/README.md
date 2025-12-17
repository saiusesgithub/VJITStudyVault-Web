# Automation Scripts for VJIT Study Vault

This folder contains Python scripts to automate the content upload process.

## 🎯 Three-Step Process

### **Step 1: Scan Local Folders** 📁
Use `scan_materials.py` to scan your local folders and generate a content template.

**What it does:**
- Scans folder for PDF/DOC files
- Detects material types from filenames
- Extracts unit numbers
- Generates content template with placeholders

**Usage:**
```bash
python scan_materials.py
```

**Configure:**
Edit the `SUBJECT_CONFIG` at the top of the file:
```python
SUBJECT_CONFIG = {
    "subject_name": "Your Subject Name",
    "subject_code": "CS101",
    "regulation": "R22",
    "branches": ["IT", "CSE"],
    "year": "2nd Year",
    "semester": "Sem 1"
}

folder_to_scan = r"C:\Path\To\Your\Subject\Folder"
```

---

### **Step 2: Upload to Google Drive** ☁️
Use `upload_to_drive.py` to bulk upload files and get shareable links.

**What it does:**
- Uploads all files from folder to Google Drive
- Creates organized folder structure
- Makes files publicly accessible
- Generates shareable links

**Setup:**
1. Enable Google Drive API:
   - Go to https://console.cloud.google.com
   - Create project
   - Enable Google Drive API
   - Create OAuth 2.0 credentials
   - Download as `credentials.json`

2. Install dependencies:
   ```bash
   pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
   ```

3. Run script:
   ```bash
   python upload_to_drive.py
   ```

**First run:** Browser will open for Google authentication. After that, credentials are saved.

---

### **Step 3: Generate SQL** 💾
Send the completed template (from Step 1 with Drive links from Step 2) to generate SQL commands.

---

## 🚀 Quick Start (Easiest Method)

If you don't want to use Google Drive API automation, use this simple workflow:

### **Option A: Simple Semi-Manual Process**

1. **Organize your files:**
   ```
   📁 PS/
      ├── ps question bank.pdf
      ├── unit 1 notes.pdf
      ├── unit 2 notes.pdf
      └── important questions.pdf
   ```

2. **Run scan script:**
   ```bash
   python scan_materials.py
   ```

3. **Upload manually to Drive:**
   - Create folder in Google Drive
   - Upload all files
   - Get shareable links

4. **Fill template with links:**
   - Copy output from scan script
   - Paste Drive links
   - Send to me

---

## 📝 File Naming Conventions

The script detects material types from filenames. Use these keywords:

| Keyword in Filename | Detected Type |
|---------------------|---------------|
| `question bank`, `qbank`, `qb` | Question Bank |
| `important`, `imp` | Important Questions |
| `unit`, `notes` | Notes |
| `pyq`, `previous year` | PYQs |
| `syllabus` | Syllabus |
| `lab` | Lab Manual |
| `textbook`, `book` | Textbook |
| `ppt`, `presentation` | PPTs |

**Examples:**
- `ps question bank.pdf` → Question Bank
- `unit 1 notes.pdf` → Notes (Unit 1)
- `important questions mid term.pdf` → Important Questions
- `2024 pyq.pdf` → PYQs

---

## 🔧 Advanced: Complete Automation

For the most automated workflow:

1. **Run bulk upload:**
   ```bash
   python upload_to_drive.py
   ```
   ✅ Files uploaded + Links generated

2. **Run scan (optional):**
   ```bash
   python scan_materials.py
   ```
   ✅ Template with filenames

3. **Combine outputs:**
   - Match filenames to Drive links
   - Complete template

4. **Send to generate SQL**

---

## 📦 Alternative: Excel/CSV Method

Create a simple CSV file:

```csv
Material Type,Name,Drive URL,Description
Question Bank,PS Question Bank,https://drive.google.com/...,Complete QB
Notes,Unit 1 Notes,https://drive.google.com/...,First unit
Notes,Unit 2 Notes,https://drive.google.com/...,
Important Questions,Important Qs,https://drive.google.com/...,
```

Then I can convert it to SQL for you!

---

## 💡 Tips

1. **Consistent naming:** Use consistent file names for easier detection
2. **Version numbers:** Add "v1", "v2" for multiple versions
3. **Batch processing:** Process one subject at a time
4. **Drive organization:** Create separate Drive folders per subject
5. **Backup links:** Keep a copy of all Drive links in a text file

---

## 🆘 Troubleshooting

**Script not detecting material types?**
- Add keywords to filename (e.g., "notes", "unit")
- Manually specify in template

**Google Drive API errors?**
- Check credentials.json is in same folder
- Re-authenticate by deleting token.pickle

**Want to skip automation?**
- Just use CONTENT_TEMPLATE.md manually
- Fill it out and send to me

---

## 🎯 Summary

**Fastest for beginners:**
1. Manually upload to Drive
2. Use scan_materials.py to get template
3. Fill in links
4. Send to me

**Most automated:**
1. Setup Google Drive API once
2. Run upload_to_drive.py
3. Run scan_materials.py  
4. Combine and send

**Choose what works best for you!** 🚀
