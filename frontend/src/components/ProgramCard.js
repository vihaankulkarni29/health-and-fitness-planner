import React from 'react';
import { Card, CardContent, CardHeader, Typography, Stack } from '@mui/material';

const ProgramCard = ({ program }) => {
  if (!program) return null;
  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader title={program.name} subheader={program.trainer ? `Coach: ${program.trainer.first_name} ${program.trainer.last_name}` : undefined} />
      <CardContent>
        <Stack spacing={1}>
          {program.description ? (
            <Typography variant="body1">{program.description}</Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">No description provided.</Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            Program ID: {program.id}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
