import React from 'react';
import Skeleton from './Skeleton';
import { Box, Stack } from '@mui/material';

export default {
  title: 'UI/Skeleton',
  component: Skeleton,
};

export const Variants = () => (
  <Stack spacing={3} sx={{ p: 3, maxWidth: 600 }}>
    <Box>
      <h3>Text Skeleton</h3>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="70%" />
    </Box>
    
    <Box>
      <h3>Rectangular Skeleton</h3>
      <Skeleton variant="rectangular" width="100%" height={118} />
    </Box>
    
    <Box>
      <h3>Circular Skeleton (Avatar)</h3>
      <Skeleton variant="circular" width={40} height={40} />
    </Box>
    
    <Box>
      <h3>Card Loading Placeholder</h3>
      <Box sx={{ border: '1px solid #eee', borderRadius: 2, p: 2 }}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          </Stack>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="90%" />
        </Stack>
      </Box>
    </Box>
  </Stack>
);

export const List = () => (
  <Stack spacing={2} sx={{ p: 3, maxWidth: 600 }}>
    {[1, 2, 3, 4].map((i) => (
      <Stack key={i} direction="row" spacing={2} alignItems="center">
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Stack>
    ))}
  </Stack>
);
