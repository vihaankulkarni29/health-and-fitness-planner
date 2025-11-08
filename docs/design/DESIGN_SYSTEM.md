# Design System Implementation Guide

## Overview

This document outlines the Notion-inspired design system implemented for the Fitness Tracker application. The system prioritizes clarity, content hierarchy, and a clean, professional aesthetic.

## Architecture

### Token System (`frontend/src/theme/tokens.js`)

Raw design tokens that can be consumed by any component (MUI or custom):

- **Colors**: Deep orange primary palette + neutral grays
- **Spacing**: 4/8/12/16/20/24/32/48/64px scale
- **Radii**: 4/6/8/12px border radius options
- **Shadows**: Subtle depth (sm, base, hover, md, lg, xl)
- **Typography**: Inter font with size/weight scales
- **Motion**: Duration and easing presets
- **Focus Ring**: Consistent focus state styling
- **Dimensions**: Component size standards

### Theme Integration (`frontend/src/theme/theme.js`)

MUI theme configured with design tokens:
- Integrates tokens into MUI components
- Overrides default MUI styles (Button, Card, TextField, Table, etc.)
- Provides light and dark theme variants
- Animation presets for Framer Motion

### Component Library (`frontend/src/components/ui/`)

Reusable primitives built with tokens:

#### Implemented Components

1. **Card** - Clean white card with subtle shadow
   - Props: `hover`, `padding` ('sm'|'md'|'lg')
   - Usage: Containers for content blocks

2. **Button** - Three variants with consistent interactions
   - Variants: `primary`, `secondary`, `ghost`
   - Sizes: `sm`, `md`, `lg`
   - Props: `startIcon`, `endIcon`, `fullWidth`

3. **Input** - Text field with focus ring
   - Props: Standard MUI TextField props
   - Auto-applies focus ring and sizing

4. **Skeleton** - Shimmer loading effect
   - Variants: `rect`, `circle`, `text`
   - Props: `width`, `height`

5. **EmptyState** - Centered placeholder with icon and CTA
   - Props: `icon`, `title`, `description`, `actionLabel`, `onAction`

6. **StatCard** - Metric display card (Notion dashboard style)
   - Props: `icon`, `label`, `value`, `change: { value, trend }`
   - Fixed height: 120px
   - Icon in circle (top-right), value center, change indicator bottom

#### Planned Components

- **Table**: Notion-style sortable table
- **Modal**: Clean dialog overlay
- **Avatar**: User initials with gradient background
- **Badge**: Small status indicators
- **Spinner**: Inline loading indicator
- **Tabs**: Clean navigation tabs
- **Select**: Dropdown input
- **Checkbox**: Styled checkbox
- **Switch**: Toggle switch

## Usage Guidelines

### Importing Components

```javascript
// Import from centralized index
import { Card, Button, Input, StatCard, EmptyState } from '../components/ui';

// Or import tokens directly
import { colors, spacing, radii } from '../theme/tokens';
```

### Color Usage

**Primary Actions**: Always use `colors.deepOrange`
```javascript
backgroundColor: colors.deepOrange
```

**Text**:
- Primary: `colors.charcoal`
- Secondary: `colors.slateGray`
- Disabled: `colors.mediumGray`

**Backgrounds**:
- Page: `colors.lightGray`
- Card/Panel: `colors.pureWhite`
- Hover: `colors.paleGray`

**Semantic**:
- Success: `colors.successGreen`
- Warning: `colors.warningAmber`
- Error: `colors.errorRed`
- Info: `colors.infoBlue`

### Spacing

Use the spacing scale consistently:

```javascript
// Using tokens
padding: `${spacing.xl}px`  // 24px

// Using MUI spacing function (multiples of 8)
padding: theme.spacing(3)   // 24px
```

**Common Patterns**:
- Card padding: `spacing.lg` (20px) or `spacing.xl` (24px)
- Section gaps: `spacing.xl` (24px)
- Element gaps: `spacing.base` (16px) or `spacing.sm` (8px)

### Shadows

Apply shadows sparingly:

```javascript
// Default card shadow
boxShadow: shadows.sm

// Hover elevation
boxShadow: shadows.hover

// Modals/popovers
boxShadow: shadows.lg
```

### Border Radius

```javascript
// Buttons, inputs
borderRadius: `${radii.md}px`  // 6px

// Cards, panels
borderRadius: `${radii.lg}px`  // 8px

// Small elements
borderRadius: `${radii.sm}px`  // 4px
```

### Typography

Use the typography scale from tokens:

```javascript
// Page titles
fontSize: typography.fontSize.xl      // 28px
fontWeight: typography.fontWeight.semibold

// Section headers
fontSize: typography.fontSize.lg      // 20px

// Body text
fontSize: typography.fontSize.base    // 15px

// Small text
fontSize: typography.fontSize.sm      // 13px

// Captions
fontSize: typography.fontSize.xs      // 12px

// Metric numbers
fontSize: typography.fontSize.xxl     // 32px
fontWeight: typography.fontWeight.bold
```

### Animations

Use subtle, fast animations:

```javascript
transition: `all ${motion.duration.base} ${motion.easing.base}`
```

**Hover transitions**: 150ms
**Press animations**: 50ms
**Page transitions**: 200ms

### Focus States

All interactive elements should show focus ring:

```javascript
'&:focus': {
  outline: 'none',
  boxShadow: focusRing.style,  // 0 0 0 3px rgba(216, 67, 21, 0.1)
}
```

## Component Examples

### StatCard Grid

```jsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={3}>
    <StatCard
      icon={Dumbbell}
      label="Workouts This Week"
      value="12"
      change={{ value: '+2', trend: 'up' }}
    />
  </Grid>
  {/* More stat cards... */}
</Grid>
```

### Empty State

```jsx
<EmptyState
  icon={ClipboardList}
  title="No workouts logged yet"
  description="Start your first workout to see progress here."
  actionLabel="Log Workout"
  onAction={() => navigate('/log')}
/>
```

### Form with Custom Components

```jsx
<Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.base}px` }}>
  <Input
    label="Exercise Name"
    placeholder="e.g., Bench Press"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  <Input
    label="Sets"
    type="number"
    value={sets}
    onChange={(e) => setSets(e.target.value)}
  />
  <Box sx={{ display: 'flex', gap: `${spacing.sm}px`, justifyContent: 'flex-end' }}>
    <Button variant="ghost" onClick={onCancel}>
      Cancel
    </Button>
    <Button variant="primary" onClick={onSubmit}>
      Save
    </Button>
  </Box>
</Box>
```

## Layout Patterns

### Page Structure

```jsx
<Box
  sx={{
    backgroundColor: colors.lightGray,
    minHeight: '100vh',
    padding: `${spacing.xxxl}px ${spacing.xxl}px`,
  }}
>
  {/* Page Header */}
  <Typography variant="h1" sx={{ marginBottom: `${spacing.xl}px` }}>
    Page Title
  </Typography>

  {/* Content Cards */}
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.xl}px` }}>
    <Card padding="lg">
      {/* Card content */}
    </Card>
  </Box>
</Box>
```

### Sidebar Layout

Already implemented in `AppLayout` component:
- Sidebar: 240px fixed width
- Main content: Centered, max 1400px width
- Top bar: 64px height

## Best Practices

### Do's
✅ Use design tokens consistently
✅ Prefer composition over custom styles
✅ Keep animations subtle and fast
✅ Use proper semantic colors
✅ Apply focus states to all interactive elements
✅ Test with keyboard navigation
✅ Use EmptyState for no-data scenarios

### Don'ts
❌ Don't use hardcoded colors/spacing
❌ Don't add excessive shadows or animations
❌ Don't use gradients except for primary actions
❌ Don't skip focus indicators
❌ Don't use color alone to convey information

## Accessibility

- All text meets WCAG AA contrast ratios
- Focus indicators visible (3px orange ring)
- Keyboard navigation fully supported
- ARIA labels on interactive elements
- Color-independent information (icons + text)

## Performance

- Components use CSS transitions (not JS animations)
- Skeleton loaders for progressive data loading
- Minimal re-renders (memoization where needed)
- Optimized shadow calculations

## Testing

### Visual Regression (Planned)
- Storybook stories for each component
- Chromatic/Percy for snapshot testing

### Token Enforcement (Planned)
- ESLint rule to detect hardcoded hex colors
- Unit tests scanning for raw px values outside theme

## Migration Guide

### Converting Existing Components

1. **Replace MUI components with custom ones**:
   ```jsx
   // Before
   <MuiButton variant="contained">Click</MuiButton>
   
   // After
   <Button variant="primary">Click</Button>
   ```

2. **Use tokens for custom styles**:
   ```jsx
   // Before
   sx={{ padding: '20px', color: '#D84315' }}
   
   // After
   sx={{ padding: `${spacing.lg}px`, color: colors.deepOrange }}
   ```

3. **Apply AppLayout wrapper**:
   ```jsx
   // Before
   <Box>
     <AppBar />
     <Sidebar />
     <Content />
   </Box>
   
   // After
   <AppLayout>
     <Content />
   </AppLayout>
   ```

## Future Enhancements

1. **Component Library Expansion**: Complete all planned components
2. **Storybook Integration**: Visual component documentation
3. **Token Enforcement**: Automated linting
4. **Dark Mode**: Full dark theme implementation
5. **Responsive Utilities**: Breakpoint helpers
6. **Animation Library**: Expanded motion presets
7. **Icon System**: Standardized icon usage patterns

## Support

For questions or contributions, refer to:
- Design tokens: `frontend/src/theme/tokens.js`
- Theme config: `frontend/src/theme/theme.js`
- Component library: `frontend/src/components/ui/`
- Design spec: `docs/design/DESIGN_STYLE.md`
