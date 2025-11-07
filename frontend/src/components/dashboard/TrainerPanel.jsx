import React from 'react';
import { Avatar, Box, Card, CardContent, Typography, Stack, Chip } from '@mui/material';

const initials = (first = '', last = '') =>
  `${(first[0] || '').toUpperCase()}${(last[0] || '').toUpperCase()}` || 'T';

const TrainerPanel = ({ user }) => {
  const trainer = user?.program?.trainer || user?.trainer || null;
  const first = trainer?.first_name || 'Your';
  const last = trainer?.last_name || 'Coach';

  return (
    <Card elevation={3} aria-label="Trainer information">
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }} aria-label="trainer avatar">
            {initials(first, last)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {first} {last}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Certified Trainer • Program lead
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip label="Strength" size="small" variant="outlined" />
              <Chip label="Cardio" size="small" variant="outlined" />
              <Chip label="Mobility" size="small" variant="outlined" />
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TrainerPanel;
