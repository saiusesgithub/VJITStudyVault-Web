"""
VJIT Study Vault - Content Upload Automation Script
This script scans your local folders and generates SQL commands for Supabase
"""

import os
import re
from pathlib import Path

# Configuration
SUBJECT_CONFIG = {
    "subject_name": "Probability and Statistics",
    "subject_code": "MA301",
    "regulation": "R22",
    "branches": ["IT", "CSE", "DS"],  # or ["ALL"] for all branches
    "year": "2nd Year",
    "semester": "Sem 1"
}

# Material type mapping based on filename keywords
MATERIAL_TYPE_MAP = {
    "question bank": "Question Bank",
    "qbank": "Question Bank",
    "qb": "Question Bank",
    "important": "Important Questions",
    "imp": "Important Questions",
    "unit": "Notes",
    "notes": "Notes",
    "pyq": "PYQs",
    "previous year": "PYQs",
    "syllabus": "Syllabus",
    "lab": "Lab Manual",
    "textbook": "Textbook",
    "book": "Textbook",
    "ppt": "PPTs",
    "presentation": "PPTs"
}

def detect_material_type(filename):
    """Detect material type from filename"""
    filename_lower = filename.lower()
    
    for keyword, material_type in MATERIAL_TYPE_MAP.items():
        if keyword in filename_lower:
            return material_type
    
    return "Notes"  # Default

def extract_unit_number(filename):
    """Extract unit number from filename (e.g., 'unit 1', 'unit1', 'u1')"""
    match = re.search(r'unit\s*(\d+)|u(\d+)', filename.lower())
    if match:
        return match.group(1) or match.group(2)
    return None

def generate_material_name(filename):
    """Generate a clean material name from filename"""
    # Remove extension
    name = Path(filename).stem
    
    # Capitalize properly
    name = name.replace('_', ' ').replace('-', ' ')
    
    # Title case
    name = ' '.join(word.capitalize() for word in name.split())
    
    return name

def scan_folder(folder_path):
    """Scan folder and generate content submission format"""
    
    if not os.path.exists(folder_path):
        print(f"❌ Folder not found: {folder_path}")
        return
    
    print("\n" + "="*80)
    print(f"📁 Scanning folder: {folder_path}")
    print("="*80 + "\n")
    
    # Supported file extensions
    supported_extensions = {'.pdf', '.doc', '.docx', '.ppt', '.pptx'}
    
    files = []
    for file in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file)
        if os.path.isfile(file_path) and Path(file).suffix.lower() in supported_extensions:
            files.append(file)
    
    if not files:
        print("❌ No supported files found in folder")
        return
    
    print(f"✅ Found {len(files)} files\n")
    
    # Generate content template
    print("COPY THIS AND FILL IN THE DRIVE LINKS:")
    print("-" * 80)
    print(f"SUBJECT: {SUBJECT_CONFIG['subject_name']}")
    print(f"CODE: {SUBJECT_CONFIG['subject_code']}")
    print(f"REGULATION: {SUBJECT_CONFIG['regulation']}")
    print(f"BRANCHES: {', '.join(SUBJECT_CONFIG['branches'])}")
    print(f"YEAR: {SUBJECT_CONFIG['year']}")
    print(f"SEMESTER: {SUBJECT_CONFIG['semester']}")
    print("\nMATERIALS:")
    
    for file in sorted(files):
        material_type = detect_material_type(file)
        material_name = generate_material_name(file)
        unit = extract_unit_number(file)
        
        # Add unit info to name if detected
        if unit and material_type == "Notes":
            material_name = f"Unit {unit} - {material_name}"
        
        print(f"- {material_type} | {material_name} | [PASTE_DRIVE_LINK_HERE] | ")
    
    print("\n" + "="*80)
    print("\n💡 NEXT STEPS:")
    print("1. Upload these files to Google Drive")
    print("2. For each file, right-click → Share → Get link")
    print("3. Replace [PASTE_DRIVE_LINK_HERE] with actual Drive URLs")
    print("4. Send the completed template to generate SQL!")
    print("="*80 + "\n")

def bulk_scan_folders(parent_folder):
    """Scan multiple subject folders at once"""
    
    if not os.path.exists(parent_folder):
        print(f"❌ Parent folder not found: {parent_folder}")
        return
    
    print("\n" + "="*80)
    print(f"📂 Scanning all subfolders in: {parent_folder}")
    print("="*80 + "\n")
    
    subfolders = [f for f in os.listdir(parent_folder) 
                  if os.path.isdir(os.path.join(parent_folder, f))]
    
    if not subfolders:
        print("❌ No subfolders found")
        return
    
    print(f"✅ Found {len(subfolders)} subject folders:\n")
    
    for idx, folder in enumerate(subfolders, 1):
        print(f"{idx}. {folder}")
    
    print("\n" + "="*80)
    print("\n💡 Run scan_folder() on each folder individually")
    print("   Example: scan_folder(r'C:\\Studies\\PS')")
    print("="*80 + "\n")

# Example usage
if __name__ == "__main__":
    # CONFIGURE THIS SECTION
    # =====================================================
    
    # Option 1: Scan a single subject folder
    folder_to_scan = r"C:\Users\YourName\Documents\PS"
    
    # Update subject configuration above before running
    scan_folder(folder_to_scan)
    
    # Option 2: Scan parent folder to see all subjects
    # parent_folder = r"C:\Users\YourName\Documents\Study Materials"
    # bulk_scan_folders(parent_folder)
