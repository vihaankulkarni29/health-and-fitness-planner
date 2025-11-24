/**
 * StatCard Component - Notion-Inspired
 * 
 * Clean metric card with icon, value, and optional change indicator.
 * Layout: Icon (top-right circle) + Label (top) + Value (center) + Change (bottom)
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors, radii, shadows, spacing as spacingTokens, typography } from '../../theme/tokens';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  change,           // { value: '+5%', trend: 'up' | 'down' }
  sx = {},
}) {
  return (
    <Box
      sx={{
        backgroundColor: colors.pureWhite,
        borderRadius: `${radii.lg}px`,
        boxShadow: shadows.sm,
        padding: `${spacingTokens.lg}px`,
        height: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'all 0.15s ease',
        '&:hover': {
          boxShadow: shadows.hover,
        },
        ...sx,
      }}
    >
      {/* Icon Circle (top-right) */}
      {Icon && (
        <Box
          sx={{
            position: 'absolute',
            top: spacingTokens.lg,
            right: spacingTokens.lg,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: colors.lightOrange,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={20} color={colors.deepOrange} />
        </Box>
      )}

      {/* Label */}
      <Typography
        variant="body2"
        sx={{
          fontSize: typography.fontSize.sm,
          color: colors.slateGray,
          fontWeight: typography.fontWeight.medium,
          marginBottom: '4px',
        }}
      >
        {label}
      </Typography>

      {/* Value */}
      <Typography
        sx={{
          fontSize: typography.fontSize.xxl,
          fontWeight: typography.fontWeight.bold,
          color: colors.charcoal,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>

      {/* Change Indicator */}
      {change && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {change.trend === 'up' ? (
            <TrendingUp size={14} color={colors.successGreen} />
          ) : (
            <TrendingDown size={14} color={colors.errorRed} />
          )}
          <Typography
            variant="caption"
            sx={{
              fontSize: typography.fontSize.sm,
              color: change.trend === 'up' ? colors.successGreen : colors.errorRed,
              fontWeight: typography.fontWeight.medium,
            }}
          >
            {change.value}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
