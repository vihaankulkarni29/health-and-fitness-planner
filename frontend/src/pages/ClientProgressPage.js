import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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

const buildTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#FF6A13' },
      secondary: { main: '#00897B' },
    },
    shape: { borderRadius: 12 },
    typography: {
      h4: { fontWeight: 800 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: 'none' },
    },
  });

const ClientProgressPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode] = useState(prefersDark ? 'dark' : 'light');
  const theme = React.useMemo(() => buildTheme(mode), [mode]);

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
      <ThemeProvider theme={theme}>
        <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Container>
      </ThemeProvider>
    );
  }

  if (error || !progressData) {
    return (
      <ThemeProvider theme={theme}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <IconButton edge="start" onClick={() => navigate('/trainer-dashboard')} aria-label="Back">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ flexGrow: 1, ml: 2, fontWeight: 800 }}>
              Client Progress
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">{error || 'Failed to load client progress.'}</Alert>
        </Container>
      </ThemeProvider>
    );
  }

  const { client, summary, workout_frequency, volume_trend, recent_sessions } = progressData;

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/trainer-dashboard')} aria-label="Back to roster">
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, ml: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {client.first_name} {client.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {client.email} • Program: {client.program_name}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
            <Card elevation={3}>
              <CardContent>
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
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={3}>
              <CardContent>
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
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={3}>
              <CardContent>
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Workout Frequency Chart */}
        <Card elevation={3} sx={{ mb: 3 }}>
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
        <Card elevation={3} sx={{ mb: 3 }}>
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
        <Card elevation={3}>
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
    </ThemeProvider>
  );
};

export default ClientProgressPage;
