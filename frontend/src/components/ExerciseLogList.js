import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const ExerciseLogList = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No exercises logged yet. Start logging to track your workout!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FitnessCenterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Logged Exercises ({logs.length})
          </Typography>
        </Box>
        <List>
          {logs.map((log, index) => (
            <React.Fragment key={log.id || index}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {log.exercise?.name || `Exercise ${log.exercise_id}`}
                      </Typography>
                      <Chip
                        label={`${log.sets} × ${log.reps}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={`${log.weight} lbs`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    log.created_at
                      ? `Logged at ${new Date(log.created_at).toLocaleTimeString()}`
                      : 'Just logged'
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ExerciseLogList;
