/**
 * Skeleton Loader - Notion-Inspired
 * 
 * Subtle shimmer effect for loading states.
 */

import React from 'react';
import { Box, keyframes } from '@mui/material';
import { colors, radii } from '../../theme/tokens';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const Skeleton = ({ 
  width = '100%',
  height = '20px',
  variant = 'rect',  // 'rect' | 'circle' | 'text'
  sx = {},
  ...props 
}) => {
  const variants = {
    rect: {
      borderRadius: `${radii.md}px`,
    },
    circle: {
      borderRadius: '50%',
    },
    text: {
      borderRadius: `${radii.sm}px`,
      height: '16px',
    },
  };

  return (
    <Box
      sx={{
        width,
        height: variant === 'text' ? '16px' : height,
        backgroundColor: colors.subtleGray,
        backgroundImage: `linear-gradient(
          90deg,
          ${colors.subtleGray} 0%,
          ${colors.paleGray} 50%,
          ${colors.subtleGray} 100%
        )`,
        backgroundSize: '1000px 100%',
        animation: `${shimmer} 2s infinite linear`,
        ...variants[variant],
        ...sx,
      }}
      {...props}
    />
  );
};

export default Skeleton;
