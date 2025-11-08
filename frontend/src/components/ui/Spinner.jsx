/**
 * Spinner Component - Notion-Inspired
 * 
 * Unified loading indicator with token-based sizing and deep orange accent.
 * Optional label for accessibility and context.
 */

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { colors, typography, spacing } from '../../theme/tokens';

const Spinner = ({
  size = 'md', // 'sm' | 'md' | 'lg'
  label,
  center = false,
  sx = {},
  ...props
}) => {
  // Size mappings
  const sizeMap = {
    sm: 20,
    md: 40,
    lg: 60,
  };

  const dimension = sizeMap[size] || sizeMap.md;

  const spinner = (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: label ? spacing.sm : 0,
        ...sx,
      }}
    >
      <CircularProgress
        size={dimension}
        thickness={4}
        sx={{
          color: colors.deepOrange,
        }}
        {...props}
      />
      {label && (
        <Typography
          variant="caption"
          sx={{
            color: colors.slateGray,
            fontSize: typography.fontSize.sm,
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );

  // If center is true, wrap in a flex container
  if (center) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          width: '100%',
        }}
      >
        {spinner}
      </Box>
    );
  }

  return spinner;
};

export default Spinner;
