/**
 * Button Component - Notion-Inspired
 * 
 * Three variants: primary (deep orange), secondary (white with border), ghost (transparent)
 * All use subtle interactions and consistent sizing.
 */

import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { colors, radii, motion, typography } from '../../theme/tokens';

const Button = ({ 
  children, 
  variant = 'primary',  // 'primary' | 'secondary' | 'ghost'
  size = 'md',          // 'sm' | 'md' | 'lg'
  fullWidth = false,
  disabled = false,
  startIcon,
  endIcon,
  onClick,
  sx = {},
  ...props 
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: colors.deepOrange,
      color: colors.pureWhite,
      border: 'none',
      '&:hover': {
        backgroundColor: colors.burntOrange,
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    },
    secondary: {
      backgroundColor: colors.pureWhite,
      color: colors.charcoal,
      border: `1px solid ${colors.dividerGray}`,
      '&:hover': {
        backgroundColor: colors.lightGray,
        borderColor: colors.dividerGray,
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.slateGray,
      border: 'none',
      '&:hover': {
        backgroundColor: colors.lightGray,
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    },
  };

  const sizeStyles = {
    sm: {
      padding: '6px 16px',
      fontSize: '13px',
      height: '32px',
    },
    md: {
      padding: '10px 20px',
      fontSize: '14px',
      height: '40px',
    },
    lg: {
      padding: '12px 24px',
      fontSize: '15px',
      height: '48px',
    },
  };

  return (
    <MuiButton
      variant="contained"
      disableElevation
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled}
      onClick={onClick}
      fullWidth={fullWidth}
      sx={{
        borderRadius: `${radii.md}px`,
        textTransform: 'none',
        fontWeight: typography.fontWeight.medium,
        transition: `all ${motion.duration.fast} ${motion.easing.base}`,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
