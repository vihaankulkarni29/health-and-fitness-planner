import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const WorkoutHistory = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No workout history yet. Start your first workout to see it here!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getStatusChip = (status) => {
    if (status === 'completed') {
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Completed"
          color="success"
          size="small"
        />
      );
    } else if (status === 'in-progress') {
      return (
        <Chip
          icon={<PendingIcon />}
          label="In Progress"
          color="warning"
          size="small"
        />
      );
    }
    return <Chip label={status} size="small" />;
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FitnessCenterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Workout History</Typography>
        </Box>
        <List>
          {sessions.map((session, index) => (
            <React.Fragment key={session.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1">
                        {new Date(session.session_date).toLocaleDateString()}
                      </Typography>
                      {getStatusChip(session.status)}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {session.exercise_logs?.length || 0} exercise{session.exercise_logs?.length !== 1 ? 's' : ''} logged
                      </Typography>
                    </Box>
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

export default WorkoutHistory;
