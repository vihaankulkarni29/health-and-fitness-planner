/**
 * Badge Component - Notion-Inspired
 * 
 * Compact pill for status indicators, counts, and categorical labels.
 * Supports color variants and outlined style.
 */

import React from 'react';
import { Chip } from '@mui/material';
import { colors, radii, typography } from '../../theme/tokens';

const Badge = ({
  label,
  variant = 'filled', // 'filled' | 'outlined'
  color = 'neutral', // 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary'
  size = 'md', // 'sm' | 'md'
  icon,
  onDelete,
  sx = {},
  ...props
}) => {
  // Color mappings for filled variant
  const colorMapFilled = {
    success: {
      bg: '#E8F5E9',
      text: '#2E7D32',
      border: '#C8E6C9',
    },
    warning: {
      bg: '#FFF3E0',
      text: '#E65100',
      border: '#FFE0B2',
    },
    error: {
      bg: '#FFEBEE',
      text: '#C62828',
      border: '#FFCDD2',
    },
    info: {
      bg: '#E3F2FD',
      text: '#1565C0',
      border: '#BBDEFB',
    },
    neutral: {
      bg: colors.lightGray,
      text: colors.slateGray,
      border: colors.dividerGray,
    },
    primary: {
      bg: colors.lightOrange,
      text: colors.deepOrange,
      border: colors.softOrange,
    },
  };

  // Color mappings for outlined variant
  const colorMapOutlined = {
    success: {
      bg: 'transparent',
      text: '#2E7D32',
      border: '#66BB6A',
    },
    warning: {
      bg: 'transparent',
      text: '#E65100',
      border: '#FFA726',
    },
    error: {
      bg: 'transparent',
      text: '#C62828',
      border: '#EF5350',
    },
    info: {
      bg: 'transparent',
      text: '#1565C0',
      border: '#42A5F5',
    },
    neutral: {
      bg: 'transparent',
      text: colors.slateGray,
      border: colors.dividerGray,
    },
    primary: {
      bg: 'transparent',
      text: colors.deepOrange,
      border: colors.deepOrange,
    },
  };

  const colorScheme = variant === 'outlined' 
    ? colorMapOutlined[color] || colorMapOutlined.neutral
    : colorMapFilled[color] || colorMapFilled.neutral;

  const sizeStyles = size === 'sm' ? {
    height: '20px',
    fontSize: typography.fontSize.xs,
    '& .MuiChip-label': {
      padding: '0 6px',
    },
  } : {
    height: '24px',
    fontSize: typography.fontSize.sm,
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  };

  return (
    <Chip
      label={label}
      icon={icon}
      onDelete={onDelete}
      variant={variant === 'outlined' ? 'outlined' : 'filled'}
      sx={{
        backgroundColor: colorScheme.bg,
        color: colorScheme.text,
        border: `1px solid ${colorScheme.border}`,
        borderRadius: `${radii.sm}px`,
        fontWeight: typography.fontWeight.medium,
        ...sizeStyles,
        '& .MuiChip-deleteIcon': {
          color: colorScheme.text,
          fontSize: size === 'sm' ? '14px' : '16px',
          '&:hover': {
            color: colorScheme.text,
            opacity: 0.7,
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default Badge;
