<div align="center">

# 📚 VJIT Study Vault

### Your Complete Academic Resource Hub

[![Version](https://img.shields.io/badge/version-1.1-blue.svg)](https://github.com/saiusesgithub/VJITStudyVault-Web)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[🌐 Live Demo](https://vjit-study-vault.vercel.app) • [📖 Documentation](#features) • [🐛 Report Bug](https://wa.me/917569799199)

</div>

---

## 🌟 Overview

**VJIT Study Vault** is a comprehensive study materials platform built specifically for **Vidya Jyothi Institute of Technology (VJIT)** students. Access thousands of PDFs, videos, notes, previous year question papers, and more — all organized by regulation, branch, year, semester, and subject.

Built with modern web technologies and a focus on **mobile-first design**, the platform delivers a seamless experience across all devices while maintaining blazing-fast performance.

---

## ✨ Features

### 📱 Core Features

- **📂 Comprehensive Materials Library**
  - Notes (unit-wise organized)
  - Previous Year Question Papers (PYQs)
  - Important Questions
  - Question Banks
  - Reference Books
  - Lab Manuals
  - YouTube Video Playlists
  - Syllabus Documents

- **🎯 Smart Organization**
  - Multi-level navigation: Regulation → Branch → Year → Semester → Subject → Material Type
  - Intelligent categorization with unit-wise materials
  - "General Materials" section for all-in-one notes
  - "All Years" compilation for PYQs

- **🔗 Shareable URLs**
  - Every selection creates a unique, bookmarkable URL
  - Share specific materials directly with friends
  - No localStorage dependency — pure path-based routing

- **📥 Smart Download System**
  - One-click downloads for Google Drive files
  - Automatic PDF export for Google Docs
  - Download notifications to prevent confusion
  - Mobile-optimized download handling

- **🎨 Modern UI/UX**
  - Dark/Light theme toggle
  - Responsive design (mobile-first)
  - Smooth animations and transitions
  - Touch-friendly interface
  - Firefox tap-highlight fix

### 🔧 Technical Features

- **⚡ Performance Optimized**
  - Vite for lightning-fast builds
  - React 18 with concurrent features
  - Lazy loading and code splitting
  - Optimized asset delivery

- **📊 Analytics & Tracking**
  - Google Analytics 4 integration
  - Custom Supabase analytics
  - Device tracking (manufacturer, model, OS)
  - Material usage insights
  - Real-time user behavior analysis

- **🗃️ Database Architecture**
  - PostgreSQL via Supabase
  - Single-table design for simplicity
  - Optimized queries with proper indexing
  - 3200+ tracked file opens

- **🔐 Type-Safe Codebase**
  - Full TypeScript implementation
  - Strict type checking
  - Enhanced IDE support
  - Reduced runtime errors

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Supabase account
- Google Analytics 4 (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/saiusesgithub/VJITStudyVault-Web.git
cd VJITStudyVault-Web

# Install dependencies
npm install
# or
bun install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Run the following SQL in Supabase SQL Editor:

```sql
-- Create materials table
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regulation INTEGER NOT NULL,
  branch TEXT NOT NULL,
  year INTEGER NOT NULL,
  sem INTEGER NOT NULL,
  subject_name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  material_type TEXT NOT NULL,
  material_name TEXT NOT NULL,
  url TEXT NOT NULL,
  unit INTEGER,
  year_optional TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE file_opens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regulation INTEGER,
  branch TEXT,
  year INTEGER,
  sem INTEGER,
  subject_name TEXT,
  material_type TEXT,
  material_name TEXT,
  url TEXT,
  unit INTEGER,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  device_manufacturer TEXT,
  device_model TEXT,
  platform TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_materials_lookup ON materials(regulation, branch, year, sem);
CREATE INDEX idx_materials_subject ON materials(subject_name);
CREATE INDEX idx_materials_type ON materials(material_type);
CREATE INDEX idx_file_opens_device ON file_opens(device_manufacturer, device_model);
```

### Development

```bash
# Start development server
npm run dev
# or
bun run dev

# Build for production
npm run build
# or
bun run build

# Preview production build
npm run preview
```

---

## 🏗️ Project Structure

```
study-vault/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Layout components (Header, PageLayout, etc.)
│   │   ├── ui/             # shadcn/ui components
│   │   ├── NavLink.tsx     # Navigation component
│   │   └── SelectionCard.tsx
│   ├── contexts/           # React contexts
│   │   ├── ThemeContext.tsx
│   │   └── NavigationContext.tsx (deprecated)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Core utilities
│   │   ├── supabase.ts    # Database client & helpers
│   │   ├── analytics.ts   # Analytics tracking
│   │   └── urlHelpers.ts  # URL formatting utilities
│   ├── pages/              # Route pages
│   │   ├── Index.tsx
│   │   ├── RegulationSelection.tsx
│   │   ├── BranchSelection.tsx
│   │   ├── YearSelection.tsx
│   │   ├── SemesterSelection.tsx
│   │   ├── SubjectSelection.tsx
│   │   ├── MaterialTypeSelection.tsx
│   │   ├── UnitSelection.tsx
│   │   ├── SubCategoryPage.tsx
│   │   ├── PDFListPage.tsx
│   │   └── Settings.tsx
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 📐 Architecture

### Routing Strategy

The app uses **path-based routing** (v1.1+) for maximum shareability:

```
/:regulation/:branch/:year/:semester/:subject/:materialType/[units/:unit | years/:yearOptional]
```

**Example URLs:**
- `/r22/it/2/1/dbms/notes` — DBMS Notes (shows units)
- `/r22/it/2/1/dbms/notes/units/3` — DBMS Unit 3 notes
- `/r22/it/2/1/dbms/pyqs` — DBMS PYQs (shows years)
- `/r22/it/2/1/dbms/pyqs/years/all-years` — All DBMS PYQs

### Data Flow

```
User Selection → URL Params → Database Query → Supabase → Display Results
```

1. User navigates through selections
2. Each selection updates URL path
3. Page components read `useParams()`
4. Convert URL slugs to DB format
5. Query Supabase with filters
6. Display materials with download/open actions
7. Track analytics on user interactions

### Database Schema

**Materials Table:**
```typescript
interface Material {
  id: string;
  regulation: number;        // 22, 25
  branch: string;            // IT, CSE, DS, etc.
  year: number;              // 1, 2, 3, 4
  sem: number;               // 1, 2
  subject_name: string;      // DBMS, PS, OS, etc.
  credits: number;           // 3, 4, etc.
  material_type: string;     // Notes, PYQs, etc.
  material_name: string;     // Display name
  url: string;               // Google Drive URL
  unit?: number;             // 1-5 for unit-wise materials
  year_optional?: string;    // '2024', 'All Years' for PYQs
  created_at: string;
}
```

**Analytics Table:**
```typescript
interface FileOpen {
  regulation: number;
  branch: string;
  year: number;
  sem: number;
  subject_name: string;
  material_type: string;
  material_name: string;
  url: string;
  unit?: number;
  device_type: string;       // mobile, tablet, desktop
  browser: string;           // Chrome, Firefox, Safari
  os: string;                // Windows, Android, iOS
  screen_width: number;
  screen_height: number;
  device_manufacturer: string; // Apple, Samsung, Google
  device_model: string;      // iPhone 15, Galaxy S23
  platform: string;          // iOS 17.2, Android 14
  user_agent: string;        // Full UA string
  created_at: string;
}
```

---

## 🎨 Tech Stack

### Frontend
- **React 18.3** — UI library with concurrent features
- **TypeScript 5.6** — Type-safe development
- **Vite** — Next-gen build tool
- **React Router 7** — Client-side routing
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Accessible component library
- **Radix UI** — Unstyled, accessible primitives
- **Lucide React** — Beautiful icon set

### Backend & Services
- **Supabase** — PostgreSQL database + Auth + Realtime
- **Google Analytics 4** — User behavior tracking
- **Vercel** — Deployment & hosting

### Development Tools
- **ESLint** — Code linting
- **Prettier** (implicit) — Code formatting
- **Git** — Version control

---

## 📊 Analytics Dashboard

Track comprehensive user behavior:

```sql
-- Most downloaded subjects
SELECT subject_name, COUNT(*) as downloads
FROM file_opens
GROUP BY subject_name
ORDER BY downloads DESC;

-- Popular devices
SELECT device_manufacturer, device_model, COUNT(*) as usage
FROM file_opens
WHERE device_manufacturer IS NOT NULL
GROUP BY device_manufacturer, device_model
ORDER BY usage DESC;

-- Branch-wise material access
SELECT branch, material_type, COUNT(*) as opens
FROM file_opens
GROUP BY branch, material_type
ORDER BY opens DESC;

-- Peak usage times
SELECT 
  EXTRACT(HOUR FROM created_at) as hour,
  COUNT(*) as opens
FROM file_opens
GROUP BY hour
ORDER BY hour;
```

---

## 🛠️ Contributing

We welcome contributions! Here's how:

### Add Materials

1. Navigate to `/contribute` in the app
2. Fill in material details
3. Submit for review
4. Materials appear after admin approval

### Code Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, etc.)
- `refactor:` — Code refactoring
- `perf:` — Performance improvements
- `test:` — Adding tests
- `chore:` — Maintenance tasks

---

## 🐛 Troubleshooting

### Materials Not Showing

1. Check if subject exists in database for your regulation/branch/year/sem
2. Verify material_type matches exactly (case-sensitive)
3. For unit-wise materials, ensure `unit` field is set
4. For PYQs, ensure `year_optional` is set

### Download Not Working

- **Mobile:** Ensure using latest version (1.1+)
- **Google Drive:** File must be publicly accessible (Anyone with link)
- **Google Docs:** Document must have view/download permissions
- Check browser console for errors

### Database Queries Slow

- Ensure indexes exist (see Database Setup)
- Check Supabase dashboard for query performance
- Consider adding more specific indexes for common queries

---

## 📈 Roadmap

- [ ] User authentication & personalization
- [ ] Material bookmarking & favorites
- [ ] Offline mode with service workers
- [ ] Material search & filtering
- [ ] Study groups & collaboration features
- [ ] Discussion forums per subject
- [ ] Material ratings & reviews
- [ ] Admin panel for material management
- [ ] Mobile app (React Native)
- [ ] Push notifications for new materials

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

<div align="center">

### Sai Srujan Punati

**24-28 IT Student at VJIT**

[![GitHub](https://img.shields.io/badge/GitHub-saiusesgithub-181717?style=flat&logo=github)](https://github.com/saiusesgithub)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-saisrujanpunati-0077b5?style=flat&logo=linkedin)](https://linkedin.com/in/saisrujanpunati)

</div>

---

## 🙏 Acknowledgments

- **VJIT Students** — For using and providing feedback
- **Material Contributors** — For sharing resources
- **shadcn** — For the amazing UI component library
- **Supabase Team** — For the excellent database platform
- **Vercel** — For seamless deployment

---

## 💬 Support

Need help? Found a bug? Have suggestions?

- 📱 **WhatsApp:** [+91 7569799199](https://wa.me/917569799199)
- 🐛 **Issues:** [GitHub Issues](https://github.com/saiusesgithub/VJITStudyVault-Web/issues)
- 📧 **Email:** Contact via LinkedIn

---

<div align="center">

**Made with ❤️ for VJIT Students**

⭐ Star this repo if you find it helpful!

</div>
