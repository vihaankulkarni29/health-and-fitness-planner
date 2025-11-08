/**
 * Card Component - Notion-Inspired
 * 
 * Clean white card with subtle shadow and optional hover effect.
 * Provides consistent padding and spacing.
 */

import React from 'react';
import { Card as MuiCard, CardContent } from '@mui/material';
import { colors, shadows, radii, spacing as spacingTokens } from '../../theme/tokens';

const Card = ({ 
  children, 
  hover = false,
  padding = 'md',  // 'sm' | 'md' | 'lg'
  sx = {},
  ...props 
}) => {
  const paddingMap = {
    sm: `${spacingTokens.base}px`,
    md: `${spacingTokens.lg}px`,
    lg: `${spacingTokens.xl}px`,
  };

  return (
    <MuiCard
      sx={{
        backgroundColor: colors.pureWhite,
        boxShadow: shadows.sm,
        borderRadius: `${radii.lg}px`,
        border: 'none',
        transition: 'all 0.15s ease',
        ...(hover && {
          '&:hover': {
            boxShadow: shadows.hover,
            cursor: 'pointer',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      <CardContent
        sx={{
          padding: paddingMap[padding],
          '&:last-child': {
            paddingBottom: paddingMap[padding],
          },
        }}
      >
        {children}
      </CardContent>
    </MuiCard>
  );
};

export default Card;
