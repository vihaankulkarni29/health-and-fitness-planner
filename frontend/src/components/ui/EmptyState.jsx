/**
 * EmptyState Component - Notion-Inspired
 * 
 * Centered content with icon, message, and optional action button.
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors, spacing as spacingTokens } from '../../theme/tokens';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${spacingTokens.xxxl}px ${spacingTokens.xl}px`,
        textAlign: 'center',
        ...sx,
      }}
    >
      {Icon && (
        <Box
          sx={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: colors.lightGray,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: `${spacingTokens.xl}px`,
          }}
        >
          <Icon size={32} color={colors.mediumGray} />
        </Box>
      )}
      
      <Typography
        variant="h5"
        sx={{
          color: colors.charcoal,
          marginBottom: `${spacingTokens.sm}px`,
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: colors.slateGray,
            marginBottom: `${spacingTokens.xl}px`,
            maxWidth: '400px',
          }}
        >
          {description}
        </Typography>
      )}
      
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
