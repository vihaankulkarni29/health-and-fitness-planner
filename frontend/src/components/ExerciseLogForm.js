import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack,
  CircularProgress
} from '@mui/material';

const ExerciseLogForm = ({ exercise, sessionId, onLogCreated }) => {
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      // Validate inputs
      const setsNum = parseInt(sets);
      const repsNum = parseInt(reps);
      const weightNum = parseFloat(weight);

      if (setsNum <= 0 || repsNum <= 0 || weightNum < 0) {
        setError('Please enter valid positive numbers');
        setSubmitting(false);
        return;
      }

      const logData = {
        exercise_id: exercise.exercise_id || exercise.exercise?.id,
        sets: setsNum,
        reps: repsNum,
        weight: weightNum
      };

      // Import dynamically to avoid circular dependency
      const { logExercise } = await import('../api/workouts');
      const newLog = await logExercise(sessionId, logData);
      
      // Show success
      setSuccess(true);
      
      // Clear form
      setSets('');
      setReps('');
      setWeight('');
      
      // Notify parent
      if (onLogCreated) {
        onLogCreated(newLog);
      }

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
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
        {success && <Alert severity="success" sx={{ mb: 2 }}>Exercise logged successfully!</Alert>}
        
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
            disabled={submitting || !sets || !reps || !weight}
            fullWidth
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Logging...' : 'Log Exercise'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExerciseLogForm;
