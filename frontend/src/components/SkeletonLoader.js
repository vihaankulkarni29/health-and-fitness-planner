import React from 'react';
import { Box, keyframes } from '@mui/material';
import { skeleton, radii } from '../theme/tokens';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonLoader = ({ width, height, borderRadius = radii.md, sx, ...props }) => {
    return (
        <Box
            sx={{
                width: width || '100%',
                height: height || 20,
                borderRadius: borderRadius,
                background: skeleton.base,
                backgroundImage: skeleton.shimmer,
                backgroundSize: '200% 100%',
                animation: `${shimmer} 1.5s infinite linear`,
                ...sx,
            }}
            {...props}
        />
    );
};

export default SkeletonLoader;
