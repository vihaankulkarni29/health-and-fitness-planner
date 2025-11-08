import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getClientProgress } from '../api/trainerDashboard';
import AppLayout from '../components/AppLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

const ClientProgressPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressData, setProgressData] = useState(null);
  const [timeRange, setTimeRange] = useState(30);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getClientProgress(clientId, timeRange);
      setProgressData(data);
    } catch (err) {
      console.error('Failed to fetch client progress:', err);
      if (err.response?.status === 403) {
        setError('You do not have permission to view this client.');
      } else if (err.response?.status === 404) {
        setError('Client not found.');
      } else {
        setError('Failed to load client progress. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [clientId, timeRange]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'planned':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <Spinner center label="Loading client progress..." />
      </AppLayout>
    );
  }

  if (error || !progressData) {
    return (
      <AppLayout>
        <Container sx={{ mt: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Button variant="ghost" onClick={() => navigate('/trainer-dashboard')}>
              ← Back
            </Button>
          </Box>
          <Typography variant="h1" sx={{ mb: 2 }}>Client Progress</Typography>
          <Alert severity="error">{error || 'Failed to load client progress.'}</Alert>
        </Container>
      </AppLayout>
    );
  }

  const { client, summary, workout_frequency, volume_trend, recent_sessions } = progressData;

  return (
    <AppLayout>
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Button variant="ghost" onClick={() => navigate('/trainer-dashboard')}>
            ← Back to Roster
          </Button>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h1">
            {client.first_name} {client.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {client.email} • Program: {client.program_name}
          </Typography>
        </Box>

        {/* Time Range Selector */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="time range"
          >
            <ToggleButton value={7}>7 days</ToggleButton>
            <ToggleButton value={30}>30 days</ToggleButton>
            <ToggleButton value={90}>90 days</ToggleButton>
            <ToggleButton value={365}>1 year</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FitnessCenterIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Total Workouts
                </Typography>
              </Box>
              <Typography variant="h4">{summary.total_workouts}</Typography>
              <Typography variant="caption" color="text.secondary">
                Last {timeRange} days
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Total Volume
                </Typography>
              </Box>
              <Typography variant="h4">{summary.total_volume_kg.toLocaleString()}</Typography>
              <Typography variant="caption" color="text.secondary">
                kg lifted
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarTodayIcon sx={{ mr: 1, color: '#00897B' }} />
                <Typography variant="body2" color="text.secondary">
                  Timeframe
                </Typography>
              </Box>
              <Typography variant="h6">{summary.start_date && summary.end_date
                  ? `${new Date(summary.start_date).toLocaleDateString()} - ${new Date(summary.end_date).toLocaleDateString()}`
                  : 'N/A'
                }</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Workout Frequency Chart */}
  <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Workout Frequency
            </Typography>
            {workout_frequency && workout_frequency.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workout_frequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value) => [`${value} workout${value !== 1 ? 's' : ''}`, 'Count']}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#FF6A13" name="Workouts" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Alert severity="info">No workout data available for the selected time range.</Alert>
            )}
          </CardContent>
        </Card>

        {/* Volume Trend Chart */}
  <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Training Volume Trend
            </Typography>
            {volume_trend && volume_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={volume_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value) => [`${value.toLocaleString()} kg`, 'Volume']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="volume_kg"
                    stroke="#00897B"
                    strokeWidth={2}
                    name="Volume (kg)"
                    dot={{ fill: '#00897B' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Alert severity="info">No volume data available for the selected time range.</Alert>
            )}
          </CardContent>
        </Card>

        {/* Recent Sessions Table */}
  <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Sessions
            </Typography>
            {recent_sessions && recent_sessions.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Exercises</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recent_sessions.map((session, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          {new Date(session.session_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={session.status}
                            size="small"
                            color={getStatusColor(session.status)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {session.exercise_count}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">No recent sessions found.</Alert>
            )}
          </CardContent>
        </Card>
      </Container>
    </AppLayout>
  );
};

export default ClientProgressPage;
