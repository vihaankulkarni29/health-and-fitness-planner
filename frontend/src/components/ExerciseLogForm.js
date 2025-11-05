import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack
} from '@mui/material';

const ExerciseLogForm = ({ exercise, sessionId, onLogCreated }) => {
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const logData = {
        exercise_id: exercise.exercise_id || exercise.exercise?.id,
        sets: parseInt(sets) || 0,
        reps: parseInt(reps) || 0,
        weight: parseFloat(weight) || 0
      };

      // Import dynamically to avoid circular dependency
      const { logExercise } = await import('../api/workouts');
      const newLog = await logExercise(sessionId, logData);
      
      // Clear form
      setSets('');
      setReps('');
      setWeight('');
      
      // Notify parent
      if (onLogCreated) {
        onLogCreated(newLog);
      }
    } catch (err) {
      setError('Failed to log exercise. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {exercise.exercise?.name || 'Exercise'}
        </Typography>
        {exercise.sets && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Target: {exercise.sets} sets × {exercise.reps} reps
          </Typography>
        )}
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="Sets"
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              required
              size="small"
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Reps"
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              required
              size="small"
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Weight (lbs)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              size="small"
              inputProps={{ min: 0, step: 0.5 }}
            />
          </Stack>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            fullWidth
          >
            {submitting ? 'Logging...' : 'Log Exercise'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExerciseLogForm;
