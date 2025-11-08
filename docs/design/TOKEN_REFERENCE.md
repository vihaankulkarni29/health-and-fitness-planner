# Design Token Quick Reference

## 🎨 Colors

### Primary Palette
```javascript
import { colors } from '../theme/tokens';

colors.deepOrange    // #D84315 - Primary actions
colors.burntOrange   // #E64A19 - Hover states
colors.warmOrange    // #FF6E40 - Highlights
colors.lightOrange   // #FFE0B2 - Icon backgrounds
```

### Neutrals
```javascript
colors.charcoal      // #2C2C2C - Primary text
colors.slateGray     // #616161 - Secondary text
colors.mediumGray    // #9E9E9E - Disabled text
colors.lightGray     // #F5F5F5 - Page background
colors.paleGray      // #FAFAFA - Table header, hover
colors.dividerGray   // #E0E0E0 - Borders
colors.subtleGray    // #F0F0F0 - Skeleton base
colors.pureWhite     // #FFFFFF - Card backgrounds
```

### Semantic
```javascript
colors.successGreen  // #43A047 - Success states
colors.warningAmber  // #FB8C00 - Warnings
colors.infoBlue      // #1E88E5 - Info messages
colors.errorRed      // #D32F2F - Errors
```

## 📏 Spacing

```javascript
import { spacing } from '../theme/tokens';

spacing.xs    // 4px   - Micro gaps
spacing.sm    // 8px   - Small gaps
spacing.md    // 12px  - Medium gaps
spacing.base  // 16px  - Standard gaps
spacing.lg    // 20px  - Card padding (md)
spacing.xl    // 24px  - Card padding (lg), section gaps
spacing.xxl   // 32px  - Page padding
spacing.xxxl  // 48px  - Large section breaks
spacing.xxxxl // 64px  - Hero sections
```

## 🔲 Border Radius

```javascript
import { radii } from '../theme/tokens';

radii.sm   // 4px  - Small elements
radii.md   // 6px  - Buttons, inputs
radii.lg   // 8px  - Cards, panels
radii.xl   // 12px - Large containers
radii.full // 9999px - Circles
```

## 🌑 Shadows

```javascript
import { shadows } from '../theme/tokens';

shadows.none   // No shadow
shadows.sm     // Subtle card shadow
shadows.base   // Standard depth
shadows.hover  // Hover elevation
shadows.md     // Medium depth
shadows.lg     // Modal/dialog
shadows.xl     // Large overlay
```

## 📝 Typography

```javascript
import { typography } from '../theme/tokens';

// Font Family
typography.fontFamily.base  // Inter, SF Pro Display
typography.fontFamily.mono  // JetBrains Mono

// Font Sizes
typography.fontSize.xs      // 12px - Captions
typography.fontSize.sm      // 13px - Small text
typography.fontSize.base    // 15px - Body text
typography.fontSize.md      // 16px - Standard UI
typography.fontSize.lg      // 20px - Section headers
typography.fontSize.xl      // 28px - Page titles
typography.fontSize.xxl     // 32px - Metric numbers

// Font Weights
typography.fontWeight.regular   // 400
typography.fontWeight.medium    // 500
typography.fontWeight.semibold  // 600
typography.fontWeight.bold      // 700

// Line Heights
typography.lineHeight.tight    // 1.2
typography.lineHeight.base     // 1.5
typography.lineHeight.relaxed  // 1.6
```

## ⏱️ Motion

```javascript
import { motion } from '../theme/tokens';

// Duration
motion.duration.instant  // 50ms  - Press animations
motion.duration.fast     // 100ms - Hover transitions
motion.duration.base     // 150ms - Standard transitions
motion.duration.slow     // 200ms - Content transitions
motion.duration.slower   // 300ms - Page transitions

// Easing
motion.easing.base    // ease
motion.easing.in      // ease-in
motion.easing.out     // ease-out
motion.easing.inOut   // ease-in-out
```

## 🎯 Focus Ring

```javascript
import { focusRing } from '../theme/tokens';

// Apply to interactive elements
'&:focus': {
  outline: 'none',
  boxShadow: focusRing.style  // 0 0 0 3px rgba(216, 67, 21, 0.1)
}
```

## 📐 Dimensions

```javascript
import { dimensions } from '../theme/tokens';

// Layout
dimensions.sidebar.width          // 240px
dimensions.sidebar.collapsedWidth // 64px
dimensions.maxContentWidth        // 1400px

// Components
dimensions.input.height         // 40px
dimensions.button.heightSm      // 32px
dimensions.button.heightMd      // 40px
dimensions.button.heightLg      // 48px
dimensions.card.paddingMd       // 20px
dimensions.card.paddingLg       // 24px
dimensions.table.rowHeight      // 44px
dimensions.table.headerHeight   // 48px
dimensions.statCard.height      // 120px
```

## 🎭 Skeleton Loader

```javascript
import { skeleton } from '../theme/tokens';

skeleton.base     // #F0F0F0 - Base color
skeleton.shimmer  // Gradient for animation
```

## 📊 Table Tokens

```javascript
import { table } from '../theme/tokens';

table.header.bg      // #FAFAFA - Header background
table.header.text    // #616161 - Header text
table.row.hover      // #FAFAFA - Row hover state
table.row.divider    // #F0F0F0 - Row dividers
```

## 📚 Z-Index Scale

```javascript
import { zIndex } from '../theme/tokens';

zIndex.base          // 1    - Base layer
zIndex.dropdown      // 1000 - Dropdowns
zIndex.sticky        // 1100 - Sticky headers
zIndex.fixed         // 1200 - Fixed elements
zIndex.modalBackdrop // 1300 - Modal backdrop
zIndex.modal         // 1400 - Modal content
zIndex.popover       // 1500 - Popovers
zIndex.tooltip       // 1600 - Tooltips
```

## 🧩 Component Usage

### Import Components
```javascript
import { Card, Button, Input, StatCard, EmptyState, Skeleton } from '../components/ui';
```

### Button Variants
```jsx
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Delete</Button>
```

### Button Sizes
```jsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Card
```jsx
<Card padding="md" hover>
  Content
</Card>
```

### StatCard
```jsx
<StatCard
  icon={DumbbellIcon}
  label="Workouts"
  value="12"
  change={{ value: '+2', trend: 'up' }}
/>
```

### Input
```jsx
<Input
  label="Name"
  placeholder="Enter name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### EmptyState
```jsx
<EmptyState
  icon={ClipboardIcon}
  title="No data"
  description="Start by adding items"
  actionLabel="Add Item"
  onAction={handleAdd}
/>
```

### Skeleton
```jsx
<Skeleton variant="rect" width="100%" height="120px" />
<Skeleton variant="circle" width="40px" height="40px" />
<Skeleton variant="text" width="200px" />
```

## 💡 Common Patterns

### Responsive Grid
```jsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={3}>
    <StatCard {...} />
  </Grid>
</Grid>
```

### Section with Gap
```jsx
<Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.xl}px` }}>
  <Card>Section 1</Card>
  <Card>Section 2</Card>
</Box>
```

### Button Group
```jsx
<Box sx={{ display: 'flex', gap: `${spacing.sm}px`, justifyContent: 'flex-end' }}>
  <Button variant="ghost">Cancel</Button>
  <Button variant="primary">Save</Button>
</Box>
```

### Page Container
```jsx
<Box
  sx={{
    backgroundColor: colors.lightGray,
    minHeight: '100vh',
    padding: `${spacing.xxxl}px ${spacing.xxl}px`,
    maxWidth: `${dimensions.maxContentWidth}px`,
    margin: '0 auto',
  }}
>
  {/* Content */}
</Box>
```

---

## 📖 Full Documentation

See `docs/design/DESIGN_SYSTEM.md` for comprehensive implementation guide.
