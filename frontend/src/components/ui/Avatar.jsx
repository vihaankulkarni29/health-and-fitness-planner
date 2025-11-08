/**
 * Avatar Component - Notion-Inspired
 * 
 * User avatar with initials, gradient backgrounds, and subtle ring variants.
 * Supports image URLs with fallback to initials.
 */

import React from 'react';
import { Avatar as MuiAvatar } from '@mui/material';
import { colors, radii, typography } from '../../theme/tokens';

const Avatar = ({
  src,
  alt,
  initials,
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'default', // 'default' | 'ring'
  color = 'orange', // 'orange' | 'green' | 'blue' | 'purple' | 'gray'
  sx = {},
  ...props
}) => {
  // Size mappings
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 56,
  };

  const fontSizeMap = {
    sm: typography.fontSize.xs,
    md: typography.fontSize.sm,
    lg: typography.fontSize.base,
  };

  // Color mappings (subtle backgrounds with darker text)
  const colorMap = {
    orange: {
      bg: colors.lightOrange,
      text: colors.deepOrange,
    },
    green: {
      bg: '#E8F5E9',
      text: '#2E7D32',
    },
    blue: {
      bg: '#E3F2FD',
      text: '#1565C0',
    },
    purple: {
      bg: '#F3E5F5',
      text: '#6A1B9A',
    },
    gray: {
      bg: colors.lightGray,
      text: colors.slateGray,
    },
  };

  const selectedColor = colorMap[color] || colorMap.orange;
  const dimension = sizeMap[size] || sizeMap.md;
  const fontSize = fontSizeMap[size] || fontSizeMap.md;

  // Ring variant styling
  const ringStyle = variant === 'ring' ? {
    border: `2px solid ${colors.pureWhite}`,
    boxShadow: `0 0 0 1px ${colors.dividerGray}`,
  } : {};

  return (
    <MuiAvatar
      src={src}
      alt={alt}
      sx={{
        width: dimension,
        height: dimension,
        fontSize: fontSize,
        fontWeight: typography.fontWeight.semibold,
        backgroundColor: selectedColor.bg,
        color: selectedColor.text,
        borderRadius: `${radii.md}px`,
        ...ringStyle,
        ...sx,
      }}
      {...props}
    >
      {!src && initials}
    </MuiAvatar>
  );
};

export default Avatar;
