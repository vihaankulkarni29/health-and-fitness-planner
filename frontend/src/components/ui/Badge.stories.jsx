import React from 'react';
import Badge from './Badge';
import { Stack, Box } from '@mui/material';

export default {
  title: 'UI/Badge',
  component: Badge,
};

export const Variants = () => (
  <Stack spacing={3} sx={{ p: 3 }}>
    <Box>
      <h3>Status Badges</h3>
      <Stack direction="row" spacing={2} alignItems="center">
        <Badge variant="success">Active</Badge>
        <Badge variant="error">Inactive</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="info">In Progress</Badge>
        <Badge variant="default">Default</Badge>
      </Stack>
    </Box>
    
    <Box>
      <h3>Workout Status</h3>
      <Stack direction="row" spacing={2} alignItems="center">
        <Badge variant="success">Completed</Badge>
        <Badge variant="info">Scheduled</Badge>
        <Badge variant="warning">Skipped</Badge>
        <Badge variant="error">Missed</Badge>
      </Stack>
    </Box>
    
    <Box>
      <h3>User Roles</h3>
      <Stack direction="row" spacing={2} alignItems="center">
        <Badge variant="primary">Admin</Badge>
        <Badge variant="info">Trainer</Badge>
        <Badge variant="default">Trainee</Badge>
      </Stack>
    </Box>
    
    <Box>
      <h3>Health Metrics</h3>
      <Stack direction="row" spacing={2} alignItems="center">
        <Badge variant="success">Normal</Badge>
        <Badge variant="warning">Elevated</Badge>
        <Badge variant="error">Critical</Badge>
      </Stack>
    </Box>
  </Stack>
);

export const Sizes = () => (
  <Stack spacing={2} sx={{ p: 3 }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Badge size="small" variant="success">Small</Badge>
      <Badge size="medium" variant="success">Medium</Badge>
      <Badge size="large" variant="success">Large</Badge>
    </Stack>
  </Stack>
);
