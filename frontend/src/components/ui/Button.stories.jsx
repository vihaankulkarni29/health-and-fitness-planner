import React from 'react';
import Button from './Button';
import { Box, Stack } from '@mui/material';

export default {
  title: 'UI/Button',
  component: Button,
};

export const AllVariants = () => (
  <Stack spacing={2} sx={{ p: 3 }}>
    <Box>
      <h3>Primary Buttons</h3>
      <Stack direction="row" spacing={2}>
        <Button variant="primary">Primary</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </Stack>
    </Box>
    
    <Box>
      <h3>Secondary Buttons</h3>
      <Stack direction="row" spacing={2}>
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary" disabled>Disabled</Button>
      </Stack>
    </Box>
    
    <Box>
      <h3>Outline Buttons</h3>
      <Stack direction="row" spacing={2}>
        <Button variant="outline">Outline</Button>
        <Button variant="outline" disabled>Disabled</Button>
      </Stack>
    </Box>
    
    <Box>
      <h3>Ghost Buttons</h3>
      <Stack direction="row" spacing={2}>
        <Button variant="ghost">Ghost</Button>
        <Button variant="ghost" disabled>Disabled</Button>
      </Stack>
    </Box>
    
    <Box>
      <h3>Sizes</h3>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button variant="primary" size="small">Small</Button>
        <Button variant="primary" size="medium">Medium</Button>
        <Button variant="primary" size="large">Large</Button>
      </Stack>
    </Box>
    
    <Box>
      <h3>Full Width</h3>
      <Button variant="primary" fullWidth>Full Width Button</Button>
    </Box>
  </Stack>
);

export const Interactive = () => {
  const [count, setCount] = React.useState(0);
  return (
    <Button variant="primary" onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </Button>
  );
};
