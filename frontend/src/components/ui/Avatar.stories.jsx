import React from 'react';
import Avatar from './Avatar';
import { Stack, Box } from '@mui/material';

export default {
  title: 'UI/Avatar',
  component: Avatar,
};

export const Variants = () => (
  <Stack spacing={3} sx={{ p: 3 }}>
    <Box>
      <h3>Default Avatar</h3>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar>JD</Avatar>
        <Avatar>AS</Avatar>
        <Avatar>BJ</Avatar>
      </Stack>
    </Box>
    
    <Box>
      <h3>Primary Variant</h3>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar variant="primary">VK</Avatar>
        <Avatar variant="primary">MJ</Avatar>
      </Stack>
    </Box>
    
    <Box>
      <h3>Success Variant</h3>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar variant="success">OK</Avatar>
        <Avatar variant="success">YS</Avatar>
      </Stack>
    </Box>
    
    <Box>
      <h3>Sizes</h3>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar size="small">SM</Avatar>
        <Avatar size="medium">MD</Avatar>
        <Avatar size="large">LG</Avatar>
      </Stack>
    </Box>
    
    <Box>
      <h3>With Images</h3>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src="https://i.pravatar.cc/150?img=1" />
        <Avatar src="https://i.pravatar.cc/150?img=2" />
        <Avatar src="https://i.pravatar.cc/150?img=3" />
      </Stack>
    </Box>
  </Stack>
);
