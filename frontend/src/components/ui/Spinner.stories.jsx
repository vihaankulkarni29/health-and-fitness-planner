import React from 'react';
import Spinner from './Spinner';
import { Box, Stack } from '@mui/material';

export default {
  title: 'UI/Spinner',
  component: Spinner,
};

export const Default = () => (
  <Box sx={{ p: 3 }}>
    <Spinner />
  </Box>
);

export const WithLabel = () => (
  <Stack spacing={3} sx={{ p: 3 }}>
    <Spinner label="Loading..." />
    <Spinner label="Fetching data..." />
    <Spinner label="Processing request..." />
  </Stack>
);

export const Centered = () => (
  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc' }}>
    <Spinner center label="Loading content..." />
  </Box>
);

export const Sizes = () => (
  <Stack direction="row" spacing={3} sx={{ p: 3 }} alignItems="center">
    <Spinner size={20} />
    <Spinner size={40} />
    <Spinner size={60} />
    <Spinner size={80} />
  </Stack>
);
