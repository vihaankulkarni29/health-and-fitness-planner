import { createTheme } from '@mui/material/styles';
import { colors, radii, shadows as shadowTokens, typography as typoTokens, motion, focusRing } from './tokens';

// Brand Colors - Notion-Inspired Design System
const brandColors = {
  // Primary: Deep Orange (motivation, action, energy)
  primary: {
    main: colors.deepOrange,
    light: colors.burntOrange,
    dark: '#BF360C',
    contrastText: colors.pureWhite,
  },
  // Secondary: Slate Gray (neutral, professional)
  secondary: {
    main: colors.slateGray,
    light: colors.mediumGray,
    dark: colors.charcoal,
    contrastText: colors.pureWhite,
  },
  // Success
  success: {
    main: colors.successGreen,
    light: '#66BB6A',
    dark: '#2E7D32',
  },
  // Warning
  warning: {
    main: colors.warningAmber,
    light: '#FFA726',
    dark: '#F57C00',
  },
  // Error
  error: {
    main: colors.errorRed,
    light: '#E57373',
    dark: '#C62828',
  },
  // Info
  info: {
    main: colors.infoBlue,
    light: '#42A5F5',
    dark: '#1565C0',
  },
  // Neutrals (MUI grey scale)
  grey: {
    50: colors.pureWhite,
    100: colors.paleGray,
    200: colors.lightGray,
    300: colors.subtleGray,
    400: colors.dividerGray,
    500: colors.mediumGray,
    600: colors.slateGray,
    700: '#424242',
    800: colors.charcoal,
    900: '#1A1A1A',
  },
};

// Typography Scale - Notion-inspired
const typography = {
  fontFamily: typoTokens.fontFamily.base,
  // Page Titles
  h1: {
    fontSize: typoTokens.fontSize.xl,     // 28px
    fontWeight: typoTokens.fontWeight.semibold,
    lineHeight: typoTokens.lineHeight.tight,
  },
  // Section Headers
  h2: {
    fontSize: typoTokens.fontSize.lg,     // 20px
    fontWeight: typoTokens.fontWeight.semibold,
    lineHeight: typoTokens.lineHeight.base,
  },
  h3: {
    fontSize: '18px',
    fontWeight: typoTokens.fontWeight.semibold,
    lineHeight: typoTokens.lineHeight.base,
  },
  h4: {
    fontSize: typoTokens.fontSize.md,     // 16px
    fontWeight: typoTokens.fontWeight.semibold,
    lineHeight: typoTokens.lineHeight.base,
  },
  h5: {
    fontSize: typoTokens.fontSize.base,   // 15px
    fontWeight: typoTokens.fontWeight.semibold,
    lineHeight: typoTokens.lineHeight.base,
  },
  h6: {
    fontSize: typoTokens.fontSize.sm,     // 13px
    fontWeight: typoTokens.fontWeight.semibold,
    lineHeight: typoTokens.lineHeight.base,
  },
  // Body Text
  body1: {
    fontSize: typoTokens.fontSize.base,   // 15px
    fontWeight: typoTokens.fontWeight.regular,
    lineHeight: typoTokens.lineHeight.relaxed,
  },
  body2: {
    fontSize: typoTokens.fontSize.sm,     // 13px
    fontWeight: typoTokens.fontWeight.regular,
    lineHeight: typoTokens.lineHeight.base,
  },
  // Buttons
  button: {
    fontSize: '14px',
    fontWeight: typoTokens.fontWeight.medium,
    textTransform: 'none',
  },
  // Captions & Small Text
  caption: {
    fontSize: typoTokens.fontSize.xs,     // 12px
    fontWeight: typoTokens.fontWeight.medium,
    lineHeight: typoTokens.lineHeight.base,
  },
  overline: {
    fontSize: typoTokens.fontSize.xs,
    fontWeight: typoTokens.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  // Metric numbers
  metric: {
    fontSize: typoTokens.fontSize.xxl,    // 32px
    fontWeight: typoTokens.fontWeight.bold,
    lineHeight: 1,
  },
};

// Spacing system (8px base for MUI compatibility)
const spacing = 8;

// Border radius - Notion style (subtle, 6-8px)
const shape = {
  borderRadius: radii.lg,  // 8px default
};

// Shadows - Notion-style subtle depth
const shadows = [
  shadowTokens.none,
  shadowTokens.sm,
  shadowTokens.base,
  shadowTokens.hover,
  shadowTokens.md,
  shadowTokens.lg,
  shadowTokens.xl,
  shadowTokens.xl,
  shadowTokens.xl,
  ...Array(16).fill('none'), // Fill remaining slots for MUI
];

// Light Theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    success: brandColors.success,
    warning: brandColors.warning,
    error: brandColors.error,
    grey: brandColors.grey,
    background: {
      default: '#FAFBFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: brandColors.grey[900],
      secondary: brandColors.grey[600],
      disabled: brandColors.grey[400],
    },
    divider: brandColors.grey[200],
    // Custom colors
    accent: brandColors.accent,
  },
  typography,
  spacing,
  shape,
  shadows,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,         // 6px
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: typoTokens.fontWeight.medium,
          boxShadow: 'none',
          transition: `all ${motion.duration.fast} ${motion.easing.base}`,
          textTransform: 'none',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: colors.deepOrange,
          color: colors.pureWhite,
          '&:hover': {
            backgroundColor: colors.burntOrange,
          },
        },
        containedSecondary: {
          backgroundColor: colors.pureWhite,
          color: colors.charcoal,
          border: `1px solid ${colors.dividerGray}`,
          '&:hover': {
            backgroundColor: colors.lightGray,
          },
        },
        text: {
          color: colors.slateGray,
          '&:hover': {
            backgroundColor: colors.lightGray,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radii.lg,         // 8px
          backgroundColor: colors.pureWhite,
          boxShadow: shadowTokens.sm,
          border: 'none',
          transition: `all ${motion.duration.base} ${motion.easing.base}`,
          '&:hover': {
            boxShadow: shadowTokens.hover,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: radii.lg,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: shadowTokens.sm,
        },
        elevation2: {
          boxShadow: shadowTokens.base,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: radii.md,       // 6px
            height: '40px',
            fontSize: typoTokens.fontSize.base,
            transition: `all ${motion.duration.base} ${motion.easing.base}`,
            '&:hover fieldset': {
              borderColor: colors.dividerGray,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.deepOrange,
              borderWidth: '1px',
            },
            '&.Mui-focused': {
              boxShadow: focusRing.style,
            },
          },
          '& .MuiInputBase-input': {
            padding: '10px 12px',
          },
          '& .MuiInputBase-input::placeholder': {
            color: colors.mediumGray,
            opacity: 1,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: typoTokens.fontWeight.medium,
          borderRadius: radii.md,
          fontSize: typoTokens.fontSize.sm,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: shadowTokens.sm,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: colors.paleGray,
            color: colors.slateGray,
            fontSize: typoTokens.fontSize.sm,
            fontWeight: typoTokens.fontWeight.medium,
            borderBottom: `1px solid ${colors.subtleGray}`,
            padding: '12px',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            transition: `background-color ${motion.duration.fast} ${motion.easing.base}`,
            '&:hover': {
              backgroundColor: colors.paleGray,
            },
          },
          '& .MuiTableCell-root': {
            borderBottom: `1px solid ${colors.subtleGray}`,
            padding: '12px',
            fontSize: typoTokens.fontSize.base,
          },
        },
      },
    },
  },
});

// Dark Theme (deferred - light mode first per design doc)
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    success: brandColors.success,
    warning: brandColors.warning,
    error: brandColors.error,
    info: brandColors.info,
    grey: brandColors.grey,
    background: {
      default: '#1A1A1A',
      paper: colors.charcoal,
    },
    text: {
      primary: colors.lightGray,
      secondary: colors.mediumGray,
      disabled: colors.slateGray,
    },
    divider: '#424242',
  },
  typography,
  spacing,
  shape,
  shadows: shadows.map((shadow, index) => {
    if (index === 0) return 'none';
    return shadow.replace(/rgba\(0, 0, 0/g, 'rgba(0, 0, 0'); // Keep same shadows for dark
  }),
  components: {
    // Dark theme components - same structure as light, darker colors
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: typoTokens.fontWeight.medium,
          boxShadow: 'none',
          transition: `all ${motion.duration.fast} ${motion.easing.base}`,
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        containedPrimary: {
          backgroundColor: colors.deepOrange,
          '&:hover': {
            backgroundColor: colors.burntOrange,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radii.lg,
          backgroundColor: colors.charcoal,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          transition: `all ${motion.duration.base} ${motion.easing.base}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: radii.lg,
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: radii.md,
            height: '40px',
            '&.Mui-focused': {
              boxShadow: focusRing.style,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(42, 42, 42, 0.95)',
        },
      },
    },
  },
});

// Animation variants for Framer Motion - Notion-style (subtle, fast)
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 },
  },
  slideUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  slideDown: {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  // Button press
  pressScale: {
    scale: 0.98,
    transition: { duration: 0.05 },
  },
};

// Simplified gradients (Notion uses minimal gradients)
export const gradients = {
  primary: `linear-gradient(135deg, ${colors.deepOrange} 0%, ${colors.burntOrange} 100%)`,
  iconBg: `linear-gradient(135deg, ${colors.lightOrange} 0%, ${colors.warmOrange} 100%)`,
  subtle: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
};

// Avoid anonymous default export for better stack traces and tooling
const themeBundle = { lightTheme, darkTheme, animations, gradients };
export default themeBundle;
