import React from 'react';
import { Card, CardContent, LinearProgress, Typography, Stack, Chip } from '@mui/material';

const clamp = (v) => Math.max(0, Math.min(100, v || 0));

const ProgressTracker = ({ sessions = [], weeklyTarget = 4 }) => {
  const total = Array.isArray(sessions) ? sessions.length : 0;
  const completed = Array.isArray(sessions)
    ? sessions.filter((s) => s && (s.status === 'COMPLETED' || s.completed)).length
    : 0;
  const progress = total > 0 ? clamp(Math.round((completed / total) * 100)) : 0;

  return (
    <Card elevation={3} aria-label="Workout progress tracker">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          Weekly Progress
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Completed {completed} of {total} logged sessions
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, mb: 2 }} />
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={`Target: ${weeklyTarget}/week`} size="small" color="primary" variant="outlined" />
          <Chip label={`Progress: ${progress}%`} size="small" color={progress >= 75 ? 'success' : 'warning'} />
          <Chip label={`Total: ${total}`} size="small" variant="outlined" />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
