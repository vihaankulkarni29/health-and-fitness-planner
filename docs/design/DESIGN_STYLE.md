# Fitness Tracker - UI/UX Design Document

## Design Philosophy

The Fitness Tracker adopts a **Notion-inspired design language** - clean, functional, and deeply focused on content hierarchy and user flow. The interface prioritizes **clarity over decoration**, using whitespace as a design element and allowing data to breathe.

---

## Color Palette

### Primary Colors
- **Deep Orange:** `#D84315` - Primary actions, active states, key metrics
- **Burnt Orange:** `#E64A19` - Hover states, secondary accents
- **Warm Orange:** `#FF6E40` - Highlights, notifications, positive feedback

### Supporting Colors
- **Charcoal:** `#2C2C2C` - Primary text
- **Slate Gray:** `#616161` - Secondary text, icons
- **Light Gray:** `#F5F5F5` - Page background
- **Pure White:** `#FFFFFF` - Card backgrounds, panels
- **Soft Shadow:** `rgba(0, 0, 0, 0.04)` - Subtle depth

### Semantic Colors
- **Success Green:** `#43A047` - Progress indicators, completed states
- **Warning Amber:** `#FB8C00` - Alerts, attention needed
- **Info Blue:** `#1E88E5` - Informational elements

---

## Typography

### Font Family
- **Primary:** Inter or SF Pro Display
- **Monospace (for metrics):** JetBrains Mono

### Type Scale
- **Page Titles:** 28px, Semibold (600)
- **Section Headers:** 20px, Semibold (600)
- **Body Text:** 15px, Regular (400)
- **Small Text:** 13px, Regular (400)
- **Metric Numbers:** 32px, Bold (700)
- **Captions:** 12px, Medium (500)

### Text Colors
- Primary text: Charcoal (`#2C2C2C`)
- Secondary text: Slate Gray (`#616161`)
- Disabled text: `#9E9E9E`

---

## Layout Structure

### Global Layout
```
┌─────────────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Main Content Area    │
│                         │                       │
│  - Logo                 │  - Page Header        │
│  - Navigation           │  - Breadcrumbs        │
│  - User Profile         │  - Content            │
│                         │                       │
└─────────────────────────────────────────────────┘
```

### Sidebar
- **Width:** 240px fixed
- **Background:** White with subtle right border (`1px solid #E0E0E0`)
- **Padding:** 16px
- **Logo Area:** 48px height, centered logo with app name
- **Navigation Items:**
  - Height: 36px each
  - Padding: 8px 12px
  - Border radius: 6px
  - Hover: Light gray background (`#F5F5F5`)
  - Active: Deep orange background with white text
  - Icon + Text layout with 8px gap
  - Icons: 20px, aligned left

### Main Content Area
- **Background:** `#F5F5F5`
- **Max Width:** 1400px (centered for ultra-wide screens)
- **Padding:** 32px on all sides
- **Page Header:**
  - Margin bottom: 24px
  - Title: 28px semibold
  - Breadcrumbs above title: 13px, gray

---

## Component Design

### Cards
Cards are the fundamental building block, inspired by Notion's database cards and content blocks.

- **Background:** Pure white
- **Border:** None (relies on shadow for depth)
- **Shadow:** `0 1px 3px rgba(0, 0, 0, 0.04)`
- **Border Radius:** 8px
- **Padding:** 20px (24px for larger cards)
- **Hover State:** Subtle shadow lift `0 2px 8px rgba(0, 0, 0, 0.08)`
- **Spacing Between Cards:** 16px

### Buttons

**Primary Button:**
- Background: Deep Orange (`#D84315`)
- Text: White, 14px medium
- Padding: 10px 20px
- Border radius: 6px
- Hover: Burnt Orange (`#E64A19`)
- Active: Slightly darker with subtle scale (0.98)

**Secondary Button:**
- Background: White
- Border: 1px solid `#E0E0E0`
- Text: Charcoal, 14px medium
- Padding: 10px 20px
- Border radius: 6px
- Hover: Background `#F5F5F5`

**Ghost Button:**
- Background: Transparent
- Text: Slate Gray, 14px medium
- Padding: 10px 16px
- Hover: Background `#F5F5F5`

### Input Fields
Following Notion's minimal input design:

- **Height:** 40px
- **Border:** 1px solid `#E0E0E0`
- **Border Radius:** 6px
- **Padding:** 10px 12px
- **Font Size:** 15px
- **Focus State:**
  - Border: Deep Orange
  - Shadow: `0 0 0 3px rgba(216, 67, 21, 0.1)`
- **Placeholder:** `#9E9E9E`

### Data Tables (Notion-style)
The workout logs and program views use Notion's database approach:

- **Row Height:** 44px minimum
- **Row Hover:** Background `#FAFAFA`
- **Dividers:** 1px solid `#F0F0F0` (very subtle)
- **Column Headers:**
  - Background: `#FAFAFA`
  - Text: 13px medium, Slate Gray
  - Padding: 12px
  - Sticky on scroll
- **Cell Padding:** 12px
- **Editable Cells:** Subtle border on focus matching input fields

### Stat Cards
Displayed on dashboard for quick metrics:

- **Layout:** 2x2 or 4 across on desktop
- **Height:** 120px
- **Content Layout:**
  - Label (top): 13px, Slate Gray
  - Value (center): 32px bold, Charcoal
  - Change indicator (bottom): 13px, Green/Red with icon
- **Icon:** 40px circle in top-right with light orange background (`#FFE0B2`)

---

## Page-Specific Layouts

### Dashboard (Trainee)

**Structure:**
1. Welcome header with name: "Good morning, [Name]"
2. Stat cards row (4 cards: Workouts this week, Current weight, Volume, Streak)
3. "Today's Workout" section - Large card showing current program
4. Two-column layout below:
   - Left: Recent workout history (list view)
   - Right: Progress chart (line graph)
5. Bottom: Muscle group distribution (horizontal bar chart)

**Design Notes:**
- Each section separated by 24px
- Charts use deep orange as primary line/bar color
- List items have subtle hover states
- "Log Workout" buttons prominently placed in deep orange

### Dashboard (Trainer)

**Structure:**
1. Page title: "Clients Overview"
2. Quick filters/search bar (Notion-style)
3. Client cards in grid (3 columns on desktop)
   - Each card shows: Avatar, Name, Current program, Adherence %, Last workout
   - Click to expand/navigate to detail view
4. Section for "Recent Client Activity" (feed style)

**Design Notes:**
- Client cards slightly smaller than standard cards
- Avatar uses initials with warm orange gradient background
- Adherence percentages color-coded (green/orange/red)

### Workout Logging

**Structure:**
1. Program name at top (breadcrumb style)
2. Exercise list (Notion database view)
   - Each row: Exercise name, Target sets/reps, Log button
   - Expandable rows show previous performance
3. Active set logging modal/inline
   - Simple fields: Weight, Reps, Notes
   - Quick save with keyboard shortcut

**Design Notes:**
- Inline editing feels seamless
- Completed sets show check icon in deep orange
- Rest timer appears as subtle banner when set logged

### Program Creation (Trainer)

**Structure:**
Similar to Notion's page editor:
1. Program title (large, editable)
2. Description field
3. Exercise blocks that can be:
   - Added via "+" button
   - Dragged to reorder (6-dot drag handle on left)
   - Each block contains: Exercise selector, Sets, Reps, Rest time, Notes
4. "Assign to Client" button at bottom

**Design Notes:**
- Drag handles appear on hover
- Each exercise block is a white card within the page
- Adding exercises feels immediate and smooth

### Progress & Analytics

**Structure:**
1. Time range selector (Week/Month/3 Months/Year) as tabs
2. Primary metric cards (same as dashboard)
3. Large graph section:
   - Switchable views (Weight, Volume, Strength progressions)
   - Deep orange line/bars
4. Muscle group breakdown (donut chart + list)
5. Exercise frequency table (Notion-style sortable table)

**Design Notes:**
- Charts have minimal grid lines
- Tooltips on hover with white background and subtle shadow
- Export data option available (ghost button)

---

## Interactions & Micro-animations

### Hover States
- **Cards:** Slight shadow elevation (150ms ease)
- **Buttons:** Color transition (100ms ease)
- **List Items:** Background fade-in (100ms ease)

### Click States
- Buttons: Subtle scale down to 0.98 (50ms)
- Checkboxes: Check animation (200ms ease-out)

### Loading States
- Skeleton screens using `#F0F0F0` rectangles with subtle shimmer
- No spinners - use linear progress bar at page top (deep orange)

### Page Transitions
- Instant navigation (no fade effects)
- Content appears immediately
- Data loads progressively (show layout first, populate after)

---

## Responsive Behavior

### Mobile (< 768px)
- Sidebar collapses to hamburger menu (slides in from left)
- Stat cards stack vertically
- Tables become scrollable cards
- Charts remain full-width but reduce height

### Tablet (768px - 1024px)
- Sidebar remains visible but can be collapsed
- Stat cards: 2x2 grid
- Content adjusts to single column when needed

### Desktop (> 1024px)
- Full layout as described
- Maximum content width: 1400px

---

## Accessibility

- **Contrast Ratios:** All text meets WCAG AA standards
- **Focus Indicators:** 3px deep orange outline with slight offset
- **Keyboard Navigation:** Full support with visible focus states
- **Screen Readers:** Proper ARIA labels on interactive elements
- **Color Independence:** Never rely solely on color (use icons/text)

---

## Icon Usage

- **Style:** Outlined, 20px standard (24px for headers)
- **Library:** Lucide Icons or Heroicons
- **Color:** Inherit from text or use Slate Gray
- **Spacing:** 8px gap between icon and text

---

## Empty States

When no data exists:
- Centered content with illustration
- Primary message: 16px medium
- Secondary helper text: 14px gray
- Clear call-to-action button
- Example: "No workouts logged yet. Start your first workout to see progress here."

---

## Design Principles Summary

1. **Content First:** Information hierarchy is clear and logical
2. **Subtle by Default:** Let data and actions stand out, not chrome
3. **Consistent Spacing:** Use 4px/8px/16px/24px/32px scale religiously
4. **Purposeful Color:** Deep orange draws attention to primary actions only
5. **Fast & Responsive:** Every interaction feels immediate
6. **Scannable:** Users can quickly find what they need
7. **Notion-like Feel:** Familiar, comfortable, professional