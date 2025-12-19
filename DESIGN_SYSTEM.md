# VJIT Study Vault - Complete Design System Guide

## 🎨 Design Philosophy
A bold, modern brutalist design with red-orange gradient accents, black & white base colors, clean geometric shapes, and smooth micro-interactions.

---

## 🎯 AI Builder Prompt

```
Create a modern educational web app with the following exact design system:

DESIGN STYLE: Brutalist/Neo-brutalist with gradient accents
- Bold, high-contrast black & white base colors
- Sharp edges with rounded-2xl corners (1rem)
- Thick black borders (2px) on all cards/buttons
- Red-to-orange gradient (#DC2626 to #F97316) for accents
- Minimalist, clean interface with generous whitespace

COLOR PALETTE:
Light Mode:
- Background: Pure white (#FFFFFF)
- Text: Pure black (#000000)
- Cards: White with black borders
- Primary: Black (#000000)
- Accent Gradient: Red to Orange (#DC2626 → #F97316)
- Muted: Gray-96 (#F5F5F5)
- Border: Black (#000000)

Dark Mode:
- Background: Pure black (#000000)
- Text: Pure white (#FFFFFF)
- Cards: Black with white borders
- Primary: White (#FFFFFF)
- Accent Gradient: Red to Orange (same)
- Muted: Gray-15 (#262626)
- Border: White (#FFFFFF)

TYPOGRAPHY:
- Primary Font: 'Space Grotesk' (modern geometric sans-serif)
- Monospace: 'Space Mono' (for code/technical text)
- Sizes: text-xl (20px), text-base (16px), text-sm (14px)
- Weights: font-medium (500), font-semibold (600), font-bold (700)

LAYOUT STRUCTURE:
- Max width: 512px (mobile-first, centered)
- Fixed header at top (56px height) with blur backdrop
- Fixed bottom navigation (64px height)
- Content area: pt-14 pb-20 px-4
- Smooth page transitions (fade + slide up)

COMPONENT STYLES:

Cards:
- Border: 2px solid (black/white based on theme)
- Border radius: 1rem (rounded-2xl)
- Padding: p-4 (1rem) standard, p-6 (1.5rem) for feature cards
- Background: bg-card (white/black)
- Hover: Gradient border appears (red-orange), scale(1.02), shadow-lg
- Active: scale(0.98)
- Transition: 200ms ease-out

Buttons:
- Primary: Black bg with white text (inverted in dark mode)
- Border radius: rounded-xl (0.75rem)
- Padding: px-4 py-2 (standard), px-6 py-3 (large)
- Hover: Slight scale, shadow effect
- Icons: 1rem size, placed before text with mr-2

Gradient Text:
- Apply to: Headings, important labels, brand text
- Gradient: linear-gradient(to right, black, orange-500)
- Use: bg-clip-text, text-transparent

Icons:
- Library: Lucide Icons
- Size: w-5 h-5 (standard), w-6 h-6 (larger contexts)
- Color: Matches text color or uses gradient
- Contained in rounded square backgrounds for emphasis

NAVIGATION:
Bottom Nav Bar:
- 5 items: Home, Materials, Labs, Contribute, Settings
- Icons with labels
- Active state: Gradient text + icon
- Inactive: Muted color
- Fixed position, backdrop blur

Header:
- Back arrow (left) - only show on non-root pages
- Title (center) - gradient text for brand pages
- Blur backdrop (backdrop-blur-lg)
- Border bottom: 1px

ANIMATIONS & INTERACTIONS:
- Page transitions: Fade in + translateY(10px) over 300ms
- Card hover: Scale 1.02, gradient border fades in
- Card press: Scale 0.98
- Button press: Slight scale down
- Smooth transitions: transition-all duration-200 ease-out
- Gradient border on hover: Opacity 0 → 1 over 300ms

SPACING SYSTEM:
- Section gaps: gap-4 (1rem) for grids
- Vertical spacing: space-y-6 (1.5rem) for forms
- Card internal: p-4 standard, p-6 for featured
- Icon + text gap: gap-3 (0.75rem)
- Title bottom margin: mb-6 (1.5rem)

EMPTY STATES:
- Large icon (w-12 h-12) in muted color
- Bold title + subtitle
- "Check back later" message
- Gradient CTA link with arrow →
- Centered, min-height 40vh

FORMS:
- Labels: font-medium, text-sm, mb-2
- Inputs: border-2, rounded-xl, px-4 py-2
- Select dropdowns: Same style as inputs
- Placeholders: text-muted-foreground
- Required fields: Asterisk (*) in label
- Validation: Red border for errors
- Grid layout: md:grid-cols-2 for side-by-side fields

SHADOWS (Brutalist style):
- None by default
- Hover cards: shadow-lg (hard shadows)
- Light mode shadows: Black
- Dark mode shadows: White
- No soft blur shadows

ACCESSIBILITY:
- Focus rings: 2px, ring-offset-2
- High contrast ratios (black/white)
- Clear hover/active states
- Icon + text labels for navigation
- ARIA labels where needed

RESPONSIVENESS:
- Mobile-first (320px minimum)
- Single column layout (<768px)
- Max width container (512px)
- Touch-friendly tap targets (min 44px)
- Generous spacing for thumbs

SPECIAL EFFECTS:
Gradient Border on Hover:
- Uses ::before pseudo-element
- linear-gradient(135deg, red, orange)
- Mask composite for border-only effect
- Opacity transition from 0 to 1

Dark Mode Toggle:
- Switch component (Radix UI style)
- No shadow on toggle thumb
- Smooth transition
- Persists preference

MICRO-INTERACTIONS:
- Loading states: Spinning icon (animate-spin)
- Success: Green checkmark with scale animation
- Toasts: Slide in from top, auto-dismiss
- Skeleton loaders: Pulse animation
- Smooth scroll behavior

KEY CSS CLASSES TO USE:
- gradient-text: bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent
- gradient-card: Card with hover gradient border
- card-hover: Scale and shadow on hover
- page-enter: Fade + slide up animation
- backdrop-blur-lg: Header/nav blur effect

COMPONENT PATTERNS:
Selection Cards:
- Icon in colored circle background
- Title + optional subtitle
- Full-width, left-aligned
- Grid layout (1 or 2 columns)

Feature Cards:
- Icon at top
- Large title
- Description text
- CTA button/link
- Centered content

Empty State:
- Icon (large, muted)
- "No [X] available yet"
- "Check back later" message
- "Be the first to contribute" encouragement
- Gradient link with arrow

Form Cards:
- White/black card background
- Icon + heading
- Form fields in grid
- Submit button at bottom
- Optional sections (collapsible)

BRAND ELEMENTS:
- Name: "VJIT Study Vault"
- Accent: Red-Orange gradient
- Icon style: Lucide icons, outlined
- Voice: Helpful, encouraging, modern
- CTA language: "Help us add materials →"
```

---

## 📋 Tailwind Configuration (Copy-Paste)

```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      keyframes: {
        'page-fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'page-enter': 'page-fade-in 0.3s ease-out forwards'
      }
    }
  }
}
```

---

## 🎨 CSS Variables (Copy-Paste)

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 0%;
  --primary: 0 0% 0%;
  --primary-foreground: 0 0% 100%;
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 45%;
  --border: 0 0% 0%;
  --radius: 1rem;
}

.dark {
  --background: 0 0% 0%;
  --foreground: 0 0% 100%;
  --card: 0 0% 0%;
  --card-foreground: 0 0% 100%;
  --primary: 0 0% 100%;
  --primary-foreground: 0 0% 0%;
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 65%;
  --border: 0 0% 100%;
}

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(to right, hsl(0 0% 0%), hsl(25 90% 55%));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.dark .gradient-text {
  background: linear-gradient(to right, hsl(0 0% 100%), hsl(25 90% 55%));
  -webkit-background-clip: text;
  background-clip: text;
}

/* Gradient card with hover border */
.gradient-card {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
}

.gradient-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, #DC2626, #F97316);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gradient-card:hover::before {
  opacity: 1;
}

/* Page transition */
.page-enter {
  animation: page-fade-in 0.3s ease-out forwards;
}

@keyframes page-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Card hover effect */
.card-hover {
  transition: all 0.2s ease-out;
}

.card-hover:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.card-hover:active {
  transform: scale(0.98);
}
```

---

## 🧩 Component Code Examples

### Selection Card
```tsx
<button className="gradient-card card-hover w-full bg-card border-2 border-border p-4 rounded-2xl">
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div className="text-left">
      <h3 className="font-semibold text-foreground">Title</h3>
      <p className="text-sm text-muted-foreground">Subtitle</p>
    </div>
  </div>
</button>
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
  <Icon className="w-12 h-12 text-muted-foreground mb-4" />
  <p className="text-foreground font-medium mb-1">No items available yet</p>
  <p className="text-sm text-muted-foreground mb-6">We're constantly adding new materials. Check back later!</p>
  <p className="text-sm text-muted-foreground mb-2">Be the first to contribute!</p>
  <a href="/contribute" className="text-sm gradient-text hover:underline">
    Help us add materials →
  </a>
</div>
```

### Header
```tsx
<header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-lg border-b border-border">
  <div className="h-full max-w-lg mx-auto px-4 flex items-center justify-center relative">
    <div className="absolute left-4">
      <button className="rounded-full p-2 hover:bg-muted">
        <ArrowLeft className="h-5 w-5" />
      </button>
    </div>
    <h1 className="text-xl font-bold gradient-text">Title</h1>
  </div>
</header>
```

### Bottom Navigation
```tsx
<nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border">
  <div className="max-w-lg mx-auto px-4 py-2">
    <div className="flex items-center justify-around">
      <a href="/" className="flex flex-col items-center gap-1 p-2">
        <Home className="w-5 h-5" />
        <span className="text-xs gradient-text">Home</span>
      </a>
      {/* Repeat for other nav items */}
    </div>
  </div>
</nav>
```

---

## 🔑 Key Design Principles

1. **High Contrast**: Pure black/white base with no grays except muted elements
2. **Bold Borders**: 2px solid borders on everything
3. **Gradient Accents**: Red-orange gradient only on interactive/important elements
4. **Smooth Animations**: 200-300ms transitions, scale on hover/press
5. **Mobile-First**: Max 512px width, single column, thumb-friendly
6. **Brutalist Aesthetic**: Sharp corners (but rounded), thick borders, no soft shadows
7. **Generous Whitespace**: Let content breathe, avoid cramming
8. **Clear Hierarchy**: Size + weight for importance, gradient for emphasis
9. **Consistent Spacing**: 4px base unit (gap-4, p-4, space-y-6)
10. **Micro-interactions**: Scale, gradient borders, smooth transitions

---

## 📱 Responsive Breakpoints

- Mobile: 320px - 767px (single column)
- Tablet: 768px+ (optional 2-column grids)
- Desktop: Centered 512px max-width container

---

## ✨ Special Features

- **Dark Mode**: Automatic detection + manual toggle
- **Gradient Border on Hover**: CSS mask technique
- **Page Transitions**: Fade + slide up animation
- **Loading States**: Spinning icons with animate-spin
- **Toast Notifications**: Slide from top, auto-dismiss
- **Empty States**: Encouraging, action-oriented

---

Use this guide with AI builders like **Lovable, Cursor, v0.dev, or Bolt.new** by pasting the main prompt and referencing specific sections as needed!
