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
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  useMediaQuery,
  AppBar,
  Toolbar,
  Button
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { getMyClients, getTrainerDashboardStats } from '../api/trainerDashboard';

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

const TrainerDashboardPage = () => {
  const navigate = useNavigate();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode] = useState(prefersDark ? 'dark' : 'light');
  const theme = React.useMemo(() => buildTheme(mode), [mode]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [clientsData, statsData] = await Promise.all([
        getMyClients(),
        getTrainerDashboardStats()
      ]);
      
      setClients(clientsData);
      setFilteredClients(clientsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch trainer data:', err);
      setError('Failed to load trainer dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(
        client =>
          client.first_name.toLowerCase().includes(query) ||
          client.last_name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.program_name.toLowerCase().includes(query)
      );
      setFilteredClients(filtered);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getAdherenceColor = (rate) => {
    if (rate >= 75) return 'success';
    if (rate >= 50) return 'warning';
    return 'error';
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
            Trainer Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Summary Cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PeopleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Total Clients
                    </Typography>
                  </Box>
                  <Typography variant="h4">{stats.total_clients}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    All trainees
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Active Clients
                    </Typography>
                  </Box>
                  <Typography variant="h4">{stats.active_clients}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last 7 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AssignmentIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Programs
                    </Typography>
                  </Box>
                  <Typography variant="h4">{stats.total_programs}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created by you
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TrendingUpIcon sx={{ mr: 1, color: '#00897B' }} />
                    <Typography variant="body2" color="text.secondary">
                      Avg Adherence
                    </Typography>
                  </Box>
                  <Typography variant="h4">{stats.average_adherence_rate}%</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last 30 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Client Roster */}
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Client Roster ({filteredClients.length})
              </Typography>
              <TextField
                size="small"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300 }}
              />
            </Box>

            {filteredClients.length === 0 ? (
              <Alert severity="info">
                {searchQuery ? 'No clients match your search.' : 'No clients assigned yet.'}
              </Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Client</TableCell>
                      <TableCell>Program</TableCell>
                      <TableCell align="right">Workouts</TableCell>
                      <TableCell align="right">Last Workout</TableCell>
                      <TableCell align="right">Adherence</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                mr: 2,
                                bgcolor: 'secondary.main',
                                width: 40,
                                height: 40
                              }}
                            >
                              {getInitials(client.first_name, client.last_name)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {client.first_name} {client.last_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {client.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={client.program_name}
                            size="small"
                            color={client.program_id ? 'primary' : 'default'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {client.total_workouts}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            total
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {client.last_workout_date ? (
                            <Typography variant="caption">
                              {new Date(client.last_workout_date).toLocaleDateString()}
                            </Typography>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Never
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${client.adherence_rate}%`}
                            size="small"
                            color={getAdherenceColor(client.adherence_rate)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => navigate(`/trainer/client/${client.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default TrainerDashboardPage;
