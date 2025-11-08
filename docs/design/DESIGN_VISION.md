# Design Vision — Health & Fitness Planner

This document is the single source of truth for our product UI/UX direction. It powers our Zoom‑In Method (50% rough → 99% page polish → 100% micro). Keep it living: update as we learn.

## 1) Product North Star
- Build a premium, data‑driven fitness platform for trainees and trainers.
- Trainee outcome: feel progress, stay consistent (85% adherence), celebrate PRs.
- Trainer outcome: see client adherence/volume trends fast, make better programming decisions.

## 2) Target Users
- Trainee: 20–40, trains 3–5x/week, motivated by visual progress & PRs.
- Trainer: coaches 10–50 clients, needs quick, trustworthy dashboards.
- Admin/Gym owner (later): oversight across trainers/clients.

## 3) Brand Identity
- Personality: modern, energetic, trustworthy, premium (SaaS‑grade polish).
- Colors: defined in `frontend/src/theme/theme.js`
  - Primary: energetic coral‑red (#FF4820), Secondary: deep teal (#00B8A9), Accent: indigo (#6366F1)
- Typography: Inter (weights 400–800), strong headings, clean body, no all‑caps except overlines.
- Motion: subtle, purposeful (Framer Motion). 180–300ms easeOut transitions.
- Spacing: 8px scale. Layout rhythm matters.

## 4) Accessibility & Quality
- WCAG AA contrast; keyboard focus visible; aria labels for controls.
- All colors/spacing/typography via theme tokens (no raw hex/px).
- Responsive: mobile‑first, then tablet, then desktop. Charts must remain legible on small screens.

## 5) Core Pages & Intent
1. Landing (public)
   - Value prop, hero, feature highlights, screenshots, CTA to Login.
2. Login (public)
   - Simple, fast path to dashboard. Demo chips for quick access.
3. Dashboard (trainee)
   - At‑a‑glance: adherence this month, weekly volume, next session CTA, recent PRs.
4. Analytics (trainee)
   - Time‑range controls, volume trend, PR table, top exercises, frequency.
5. Health Metrics (trainee)
   - Weight & body fat trends, correlation with training consistency.
6. Trainer Dashboard (trainer)
   - Client roster, adherence indicators, drill‑down to client detail.
7. Client Progress (trainer)
   - Per‑client analytics view mirroring trainee analytics.
8. Workout Session (trainee)
   - Real‑time logging: sets/reps/weight, rest timer, PR celebration.

## 6) Navigation & Layout
- Shared AppLayout: sidebar (role‑aware), top app bar with title, avatar menu, notifications, theme toggle.
- Breadcrumbs on inner pages; consistent paddings (container maxWidth="lg").
- Empty states with friendly copy and illustrations.

## 7) Components (shared UI library)
- Buttons: primary/secondary/ghost; gradient variant for primary actions.
- Cards: StatCard (value+delta), ChartCard, ListCard, PRCard.
- Inputs: TextField, Select, Slider with consistent radius and focus.
- Feedback: Skeletons, Snackbars/Toasts, EmptyState, ErrorState.
- Data: Table (sortable), Chips (status), Badges.

## 8) Data Visualization
- Use Recharts (existing). Apply brand gradients and custom tooltips.
- Provide presets: 7/30/90/365. Brush/zoom optional.
- Export: PNG/CSV (later).

## 9) Content & Voice
- Tone: encouraging, expert, not cheesy. Short, direct copy.
- Microcopy examples:
  - Dashboard welcome: "Welcome back, Vihaan — you’re on a roll."
  - Empty state: "No sessions this week yet — start one now."
  - PR toast: "New PR on Bench — 110 kg x 5. Beast mode."

## 10) Zoom‑In Method — Execution Plan
- First pass (50%):
  - Ensure structure for all core pages. Use placeholder charts/cards where needed.
  - Enforce tokens (theme palette/typography/spacing). Avoid over‑styling.
- Second pass (99%):
  - Page by page: spacing, hierarchy, alignment, accessibility, consistency.
  - Replace ad‑hoc components with shared UI library.
- Micro pass (100%):
  - Specific tweaks: nav alignment, button hover, table density, skeletons, micro‑interactions.

## 11) Acceptance Criteria (per page)
- Uses AppLayout and theme tokens only.
- Mobile (≤ 360px) readable; no horizontal scroll.
- Visual QA checklist: spacing multiples of 8; headings sized per scale; consistent card paddings; focus visible.
- Zero console errors/warnings. Lint passes.

## 12) References
- Our demo context: `docs/demo/DEMO_QUICK_START.md`
- Architecture: `docs/architecture/*`
- Current theme: `frontend/src/theme/theme.js`

---
Update this doc as we refine brand and features. Keep screenshots under `docs/design/reference/`.
