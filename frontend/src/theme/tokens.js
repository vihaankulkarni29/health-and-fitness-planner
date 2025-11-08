/**
 * Design Tokens - Notion-Inspired Design System
 * 
 * Raw design tokens that can be consumed by both MUI theme and custom components.
 * These tokens define the visual language of the application.
 */

// Color Palette
export const colors = {
  // Primary: Deep Orange (motivation, action, energy)
  deepOrange: '#D84315',
  burntOrange: '#E64A19',
  warmOrange: '#FF6E40',
  lightOrange: '#FFE0B2',
  
  // Neutrals: Charcoal to White
  charcoal: '#2C2C2C',
  slateGray: '#616161',
  mediumGray: '#9E9E9E',
  lightGray: '#F5F5F5',
  paleGray: '#FAFAFA',
  dividerGray: '#E0E0E0',
  subtleGray: '#F0F0F0',
  pureWhite: '#FFFFFF',
  
  // Semantic Colors
  successGreen: '#43A047',
  warningAmber: '#FB8C00',
  infoBlue: '#1E88E5',
  errorRed: '#D32F2F',
};

// Spacing Scale (4px base unit)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  xxxxl: 64,
};

// Border Radius
export const radii = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
};

// Shadows (Notion-style subtle depth)
export const shadows = {
  none: 'none',
  sm: '0 1px 3px rgba(0, 0, 0, 0.04)',
  base: '0 1px 3px rgba(0, 0, 0, 0.08)',
  hover: '0 2px 8px rgba(0, 0, 0, 0.08)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
};

// Typography
export const typography = {
  fontFamily: {
    base: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "SF Mono", monospace',
  },
  fontSize: {
    xs: '12px',      // Captions
    sm: '13px',      // Small text
    base: '15px',    // Body text
    md: '16px',      // Standard UI
    lg: '20px',      // Section headers
    xl: '28px',      // Page titles
    xxl: '32px',     // Metric numbers
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.6,
  },
};

// Motion & Transitions
export const motion = {
  duration: {
    instant: '50ms',
    fast: '100ms',
    base: '150ms',
    slow: '200ms',
    slower: '300ms',
  },
  easing: {
    base: 'ease',
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
  },
};

// Focus Ring
export const focusRing = {
  width: '3px',
  color: 'rgba(216, 67, 21, 0.1)',
  style: `0 0 0 3px rgba(216, 67, 21, 0.1)`,
};

// Component Dimensions
export const dimensions = {
  sidebar: {
    width: 240,
    collapsedWidth: 64,
  },
  input: {
    height: 40,
  },
  button: {
    heightSm: 32,
    heightMd: 40,
    heightLg: 48,
  },
  card: {
    paddingMd: 20,
    paddingLg: 24,
  },
  table: {
    rowHeight: 44,
    headerHeight: 48,
  },
  statCard: {
    height: 120,
  },
  maxContentWidth: 1400,
};

// Skeleton Loader
export const skeleton = {
  base: colors.subtleGray,
  shimmer: `linear-gradient(90deg, 
    ${colors.subtleGray} 0%, 
    ${colors.paleGray} 50%, 
    ${colors.subtleGray} 100%)`,
};

// Table Tokens
export const table = {
  header: {
    bg: colors.paleGray,
    text: colors.slateGray,
  },
  row: {
    hover: colors.paleGray,
    divider: colors.subtleGray,
  },
};

// Z-Index Scale
export const zIndex = {
  base: 1,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

export default {
  colors,
  spacing,
  radii,
  shadows,
  typography,
  motion,
  focusRing,
  dimensions,
  skeleton,
  table,
  zIndex,
};
