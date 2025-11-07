import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import {
  getExerciseFrequency,
  getTopExercises,
  getVolumeTrend,
  getPersonalRecords,
  getAnalyticsSummary
} from '../api/analytics';

const COLORS = ['#FF6A13', '#00897B', '#FF8A65', '#4DB6AC', '#FFAB91', '#26A69A'];

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

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode] = useState(prefersDark ? 'dark' : 'light');
  const theme = React.useMemo(() => buildTheme(mode), [mode]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState(30);
  
  const [summary, setSummary] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [topExercises, setTopExercises] = useState([]);
  const [volumeTrend, setVolumeTrend] = useState([]);
  const [personalRecords, setPersonalRecords] = useState([]);

  const fetchAnalytics = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryData, freqData, topData, volData, prData] = await Promise.all([
        getAnalyticsSummary(),
        getExerciseFrequency(timeRange),
        getTopExercises(timeRange, 10),
        getVolumeTrend(timeRange),
        getPersonalRecords()
      ]);

      setSummary(summaryData);
      setFrequency(freqData);
      setTopExercises(topData);
      setVolumeTrend(volData);
      setPersonalRecords(prData);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
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

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/dashboard')} aria-label="Back to dashboard">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1, ml: 2, fontWeight: 800 }}>
            Analytics
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Time Range Selector */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="time range"
          >
            <ToggleButton value={7} aria-label="7 days">
              7 Days
            </ToggleButton>
            <ToggleButton value={30} aria-label="30 days">
              30 Days
            </ToggleButton>
            <ToggleButton value={90} aria-label="90 days">
              90 Days
            </ToggleButton>
            <ToggleButton value={365} aria-label="1 year">
              1 Year
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Summary Cards */}
        {summary && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
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
                    All time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TrendingUpIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Total Volume
                    </Typography>
                  </Box>
                  <Typography variant="h4">{Math.round(summary.total_volume_kg).toLocaleString()}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    kg lifted
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WhatshotIcon sx={{ mr: 1, color: '#FF6A13' }} />
                    <Typography variant="body2" color="text.secondary">
                      Current Streak
                    </Typography>
                  </Box>
                  <Typography variant="h4">{summary.current_streak_days}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    days in a row
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmojiEventsIcon sx={{ mr: 1, color: '#FFD700' }} />
                    <Typography variant="body2" color="text.secondary">
                      This Month
                    </Typography>
                  </Box>
                  <Typography variant="h4">{summary.workouts_this_month}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    workouts completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Exercise Frequency Chart */}
        {frequency && frequency.daily && frequency.daily.length > 0 && (
          <Card sx={{ mb: 3 }} elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Exercise Frequency
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Daily exercise count over the last {timeRange} days
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={frequency.daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <Legend />
                  <Bar dataKey="count" name="Exercises" fill="#FF6A13" />
                </BarChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Chip label={`Weekly: ${frequency.weekly_total} exercises`} color="primary" />
                <Chip label={`Monthly: ${frequency.monthly_total} exercises`} color="secondary" />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Volume Trend */}
        {volumeTrend && volumeTrend.length > 0 && (
          <Card sx={{ mb: 3 }} elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Volume Trend
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total weight lifted per workout session
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={volumeTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value) => [`${Math.round(value)} kg`, 'Volume']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="volume_kg" name="Volume (kg)" stroke="#00897B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Grid container spacing={3}>
          {/* Top Exercises */}
          {topExercises && topExercises.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Most Performed Exercises
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Your top exercises over the last {timeRange} days
                  </Typography>
                  
                  {/* Pie Chart */}
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={topExercises.slice(0, 6)}
                        dataKey="count"
                        nameKey="exercise_name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => entry.exercise_name}
                      >
                        {topExercises.slice(0, 6).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Table */}
                  <TableContainer sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Exercise</TableCell>
                          <TableCell align="right">Count</TableCell>
                          <TableCell align="right">Avg Weight</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topExercises.map((exercise, index) => (
                          <TableRow key={exercise.exercise_id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: COLORS[index % COLORS.length],
                                    mr: 1
                                  }}
                                />
                                {exercise.exercise_name}
                              </Box>
                            </TableCell>
                            <TableCell align="right">{exercise.count}</TableCell>
                            <TableCell align="right">{Math.round(exercise.avg_weight_kg)} kg</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Personal Records */}
          {personalRecords && personalRecords.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmojiEventsIcon sx={{ mr: 1, color: '#FFD700' }} />
                    Personal Records
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Your best lifts for each exercise
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ mt: 2, maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Exercise</TableCell>
                          <TableCell align="right">Max Weight</TableCell>
                          <TableCell align="right">Sets × Reps</TableCell>
                          <TableCell align="right">Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {personalRecords.map((pr) => (
                          <TableRow key={pr.exercise_id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {pr.exercise_name}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                label={`${Math.round(pr.max_weight_kg)} kg`}
                                color="primary"
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              {pr.sets} × {pr.reps}
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="caption" color="text.secondary">
                                {new Date(pr.achieved_date).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Empty State */}
        {(!topExercises || topExercises.length === 0) && (!volumeTrend || volumeTrend.length === 0) && (
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" align="center">
                No workout data available for analysis. Start logging your workouts to see your progress!
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default AnalyticsPage;
