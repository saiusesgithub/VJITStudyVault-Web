# Content Submission Template

Fill in this template and send it to me. I'll generate the SQL commands to add the content to Supabase.

---

## Template Format

```
SUBJECT: [Subject Name]
CREDITS: [Number of credits - e.g., 3, 4]
REGULATION: [22 / 25] (just the number)
BRANCHES: [IT, CSE, DS] (comma-separated, or "ALL" for all branches)
YEAR: [1 / 2 / 3 / 4] (just the number)
SEMESTER: [1 / 2] (just the number)

MATERIALS:
- [Material Type] | [Material Name] | [URL] | [Unit Number - for Notes/YouTube only]
- [Material Type] | [Material Name] | [URL] | [Year - for PYQs only]
```

### Material Types Available:
- Notes (has units: 1, 2, 3, 4, 5)
- YouTube Videos (has units: 1, 2, 3, 4, 5)
- PYQs (has years: 2024, 2023, 2022, etc.)
- Question Bank
- Important Questions
- Syllabus
- Lab Manual
- Textbook
- PPTs
- Reference Books

### Important Notes:
- **URLs can be either Google Drive links OR YouTube links**
- **Notes and YouTube Videos MUST specify a unit number (1-5)**
- **PYQs MUST specify a year (e.g., 2024)**
- **Other materials don't need unit or year**
- Use actual numbers: Regulation = 22 (not R22), Year = 1 (not 1st Year)

---

## Example 1: Your P&S Submission (Updated Format)

```
SUBJECT: Probability and Statistics
CREDITS: 4
REGULATION: 22
BRANCHES: IT, CSE, DS
YEAR: 2
SEMESTER: 1

MATERIALS:
- Question Bank | P&S Question Bank | https://drive.google.com/file/d/1PjJbV2jt3CvIgmCadRZh8sjOan_UhpVy/view?usp=drive_link
- Important Questions | P&S Important Questions | https://drive.google.com/file/d/1lou-JDbRNzmBswTihRK__ByZpbyj-Gq-/view?usp=drive_link
- Notes | Unit 1 Notes (Version 1) | https://drive.google.com/file/d/1GBoXmHonqUjbe_sHK4G55_axz5--k3Mq/view?usp=drive_link | 1
- Notes | Unit 1 Notes (Version 2) | https://drive.google.com/file/d/12mKSFC5opEUJYMqPt7BgCYmDaBMMZBJ2/view?usp=drive_link | 1
- Notes | Unit 2 Notes (Version 1) | https://drive.google.com/file/d/15lEoNqY8A146MP7sp_Yb0X8_aiBApFb5/view?usp=drive_link | 2
- Notes | Unit 2 Notes (Version 2) | https://drive.google.com/file/d/1qI1nEkzck1P55s4Q6r9dNeDhfhL0lRR5/view?usp=drive_link | 2
- Notes | Unit 3 Notes (Version 1) | https://drive.google.com/file/d/1wKeCMZi8ArP5uixZrmEqgICaBtHBgBmB/view?usp=drive_link | 3
- Notes | Unit 3 Notes (Version 2) | https://drive.google.com/file/d/1p-s4g_blA_Kf275ZkNxHkimoNdROzcsl/view?usp=drive_link | 3
- Notes | Unit 4 Notes (Version 1) | https://drive.google.com/file/d/1X6ZFXqscnafD5GIoF_m56alWXBNj8obP/view?usp=drive_link | 4
- Notes | Unit 4 Notes (Version 2) | https://drive.google.com/file/d/177noQoZRLsjQ0Tf5w3y7mnvC1gwX9acX/view?usp=drive_link | 4
- Notes | Unit 5 Notes (Version 1) | https://drive.google.com/file/d/1HYjdVXP7OE_D_VKYqgvsiQzScB_y4QMo/view?usp=drive_link | 5
- Notes | Unit 5 Notes (Version 2) | https://drive.google.com/file/d/1HXcjwUCpl-P647XHKlfG2aESqX3xukgL/view?usp=drive_link | 5
```

---

## Example 2: Subject with YouTube Videos

```
SUBJECT: Data Structures
CREDITS: 3
REGULATION: 22
BRANCHES: IT, CSE
YEAR: 2
SEMESTER: 1

MATERIALS:
- Notes | Unit 1 - Introduction | https://drive.google.com/file/d/xxxxx/view | 1
- YouTube Videos | Unit 1 Lecture - Part 1 | https://youtube.com/watch?v=xxxxx | 1
- YouTube Videos | Unit 1 Lecture - Part 2 | https://youtube.com/watch?v=yyyyy | 1
- YouTube Videos | Unit 2 Lecture | https://youtube.com/watch?v=zzzzz | 2
- PYQs | Mid Term 1 | https://drive.google.com/file/d/xxxxx/view | 2024
- PYQs | Mid Term 1 | https://drive.google.com/file/d/xxxxx/view | 2023
- Lab Manual | DS Lab Manual | https://drive.google.com/file/d/xxxxx/view
```

---

## Example 3: Multiple Subjects at Once

```
SUBJECT: Computer Networks
CODE: CS301
REGULATION: R22
BRANCHES: ALL
YEAR: 3rd Year
SEMESTER: Sem 1

MATERIALS:
- Notes | CN Complete Notes | https://drive.google.com/file/d/xxxxx/view
- Syllabus | CN Syllabus R22 | https://drive.google.com/file/d/xxxxx/view

---

SUBJECT: Operating Systems
CODE: CS302
REGULATION: R22
BRANCHES: ALL
YEAR: 3rd Year
SEMESTER: Sem 1

MATERIALS:
- Notes | OS Unit 1-3 | https://drive.google.com/file/d/xxxxx/view
- PYQs | End Sem Paper | https://drive.google.com/file/d/xxxxx/view | | 2024
```

---

## Quick Reference

### Regulations:
- R22 (for batches 2022, 2023, 2024)
- R25 (for batch 2025 onwards)

### Branches:
- IT
- CSE
- DS (Data Science)
- AIML
- ECE
- EEE
- MECH
- CIVIL
- ALL (for common subjects)

### Years:
- 1st Year
- 2nd Year
- 3rd Year
- 4th Year

### Semesters:
- Sem 1
- Sem 2

---

## Notes:
1. Use pipe `|` to separate fields in materials
2. Description and Year are optional (leave empty if not needed)
3. Year field is only for PYQs (exam year like 2024, 2023)
4. Multiple versions of same material? Add (Version 1), (Version 2) to name
5. Send me the filled template, and I'll generate SQL for you!

---

## What I'll Generate:

When you send this, I'll create:
1. SQL to check if subject exists
2. SQL to insert subject (if new)
3. SQL to get subject and material type IDs
4. SQL to insert all materials with correct references
5. Ready-to-run commands for Supabase SQL Editor

Just copy-paste my output into Supabase and you're done! 🚀
