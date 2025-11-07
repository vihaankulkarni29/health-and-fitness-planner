import { createTheme } from '@mui/material/styles';

// Brand Colors - Premium Fitness Tech Palette
const brandColors = {
  // Primary: Energetic Orange-Red (motivation, action, power)
  primary: {
    main: '#FF4820',      // Vibrant coral-red
    light: '#FF6A47',     // Lighter for hovers
    dark: '#E63900',      // Darker for pressed states
    contrastText: '#FFFFFF',
  },
  // Secondary: Deep Teal (trust, growth, premium)
  secondary: {
    main: '#00B8A9',      // Vibrant teal
    light: '#00E4CC',     // Lighter accent
    dark: '#008C80',      // Darker for contrast
    contrastText: '#FFFFFF',
  },
  // Accent: Purple (premium, tech-forward)
  accent: {
    main: '#6366F1',      // Modern indigo
    light: '#818CF8',
    dark: '#4F46E5',
  },
  // Success gradient for achievements
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  // Warning for alerts
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
  },
  // Error
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
  },
  // Neutrals
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Typography Scale
const typography = {
  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  h1: {
    fontSize: '3.5rem',       // 56px
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '3rem',         // 48px
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '2.25rem',      // 36px
    fontWeight: 700,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: '1.875rem',     // 30px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.5rem',       // 24px
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1.25rem',      // 20px
    fontWeight: 600,
    lineHeight: 1.5,
  },
  subtitle1: {
    fontSize: '1.125rem',     // 18px
    fontWeight: 500,
    lineHeight: 1.6,
  },
  subtitle2: {
    fontSize: '1rem',         // 16px
    fontWeight: 500,
    lineHeight: 1.6,
  },
  body1: {
    fontSize: '1rem',         // 16px
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',     // 14px
    fontWeight: 400,
    lineHeight: 1.6,
  },
  button: {
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.01em',
  },
  caption: {
    fontSize: '0.75rem',      // 12px
    fontWeight: 400,
    lineHeight: 1.5,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    lineHeight: 1.5,
  },
};

// Spacing system (8px base)
const spacing = 8;

// Border radius
const shape = {
  borderRadius: 12,
};

// Shadows - Custom elevation system
const shadows = [
  'none',
  '0 1px 2px 0 rgba(0, 0, 0, 0.05)',                                           // 1
  '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',          // 2
  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',    // 3
  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',  // 4
  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',// 5
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',                                     // 6
  '0 30px 60px -15px rgba(0, 0, 0, 0.3)',                                      // 7
  '0 35px 70px -15px rgba(0, 0, 0, 0.35)',                                     // 8
  ...Array(16).fill('none'), // Fill remaining slots
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
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF4820 0%, #FF6A47 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E63900 0%, #FF4820 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.01)',
            },
            '&.Mui-focused': {
              transform: 'scale(1.01)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
  },
});

// Dark Theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    success: brandColors.success,
    warning: brandColors.warning,
    error: brandColors.error,
    grey: brandColors.grey,
    background: {
      default: '#0A0A0B',
      paper: '#1A1A1D',
    },
    text: {
      primary: '#F9FAFB',
      secondary: brandColors.grey[400],
      disabled: brandColors.grey[600],
    },
    divider: brandColors.grey[800],
    // Custom colors
    accent: brandColors.accent,
  },
  typography,
  spacing,
  shape,
  shadows: shadows.map((shadow, index) => {
    if (index === 0) return 'none';
    return shadow.replace(/rgba\(0, 0, 0/g, 'rgba(0, 0, 0'); // Keep same shadows for dark
  }),
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF4820 0%, #FF6A47 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E63900 0%, #FF4820 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#1A1A1D',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.01)',
            },
            '&.Mui-focused': {
              transform: 'scale(1.01)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(26, 26, 29, 0.8)',
        },
      },
    },
  },
});

// Animation variants for Framer Motion
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

// Gradient presets
export const gradients = {
  primary: 'linear-gradient(135deg, #FF4820 0%, #FF6A47 100%)',
  secondary: 'linear-gradient(135deg, #00B8A9 0%, #00E4CC 100%)',
  accent: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
  success: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
  premium: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  sunset: 'linear-gradient(135deg, #FF6A47 0%, #F59E0B 100%)',
  ocean: 'linear-gradient(135deg, #00B8A9 0%, #6366F1 100%)',
};

export default { lightTheme, darkTheme, animations, gradients };
