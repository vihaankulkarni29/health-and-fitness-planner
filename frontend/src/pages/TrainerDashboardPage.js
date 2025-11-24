import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { getMyClients, getTrainerDashboardStats } from '../api/trainerDashboard';
import AppLayout from '../components/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Spinner from '../components/ui/Spinner';
import Skeleton from '../components/ui/Skeleton';

const TrainerDashboardPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchDebounceRef = useRef(null);
  const [searchInput, setSearchInput] = useState('');

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

  // Debounced search handler (300ms) for scalability and reduced renders
  const handleSearchChange = (event) => {
    const raw = event.target.value;
    setSearchInput(raw);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      const query = raw.toLowerCase();
      setSearchQuery(query);
      if (!query) {
        setFilteredClients(clients);
      } else {
        const filtered = clients.filter(client => (
          client.first_name.toLowerCase().includes(query) ||
          client.last_name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.program_name.toLowerCase().includes(query)
        ));
        setFilteredClients(filtered);
      }
    }, 300);
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
      <AppLayout>
        <Spinner center label="Loading trainer dashboard..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h1">Trainer Dashboard</Typography>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>Back</Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Summary Cards */}
        {stats ? (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon sx={{ mr: 1, color: '#D84315' }} />
                  <Typography variant="body2" color="text.secondary">Total Clients</Typography>
                </Box>
                {loading ? <Skeleton height="32px" width="60%" /> : <Typography variant="h4">{stats.total_clients}</Typography>}
                <Typography variant="caption" color="text.secondary">All trainees</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Active Clients
                  </Typography>
                </Box>
                {loading ? <Skeleton height="32px" width="50%" /> : <Typography variant="h4">{stats.active_clients}</Typography>}
                <Typography variant="caption" color="text.secondary">
                  Last 7 days
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssignmentIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Programs
                  </Typography>
                </Box>
                {loading ? <Skeleton height="32px" width="50%" /> : <Typography variant="h4">{stats.total_programs}</Typography>}
                <Typography variant="caption" color="text.secondary">
                  Created by you
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: '#D84315' }} />
                  <Typography variant="body2" color="text.secondary">Avg Adherence</Typography>
                </Box>
                {loading ? <Skeleton height="32px" width="70%" /> : <Typography variant="h4">{stats.average_adherence_rate}%</Typography>}
                <Typography variant="caption" color="text.secondary">Last 30 days</Typography>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1,2,3,4].map(i => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card>
                  <Skeleton height="20px" width="40%" sx={{ mb: 1 }} />
                  <Skeleton height="32px" width="70%" sx={{ mb: 0.5 }} />
                  <Skeleton height="16px" width="50%" />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Client Roster */}
        <Card>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Client Roster ({filteredClients.length})
            </Typography>
            <Input
              placeholder="Search clients..."
              value={searchInput}
              onChange={handleSearchChange}
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {loading ? (
            <Box sx={{ px: 2, pb: 4 }}>
              {[...Array(6)].map((_, idx) => (
                <Box key={idx} sx={{ display:'flex', alignItems:'center', mb:2 }}>
                  <Skeleton height="40px" width="40px" variant="circle" sx={{ mr:2 }} />
                  <Box sx={{ flex:1 }}>
                    <Skeleton height="16px" width="30%" sx={{ mb:1 }} />
                    <Skeleton height="14px" width="50%" />
                  </Box>
                  <Skeleton height="24px" width="12%" sx={{ ml:2 }} />
                </Box>
              ))}
            </Box>
          ) : (
          <Table
            columns={[
              {
                id: 'client',
                label: 'Client',
                field: 'client',
                render: (row) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      initials={getInitials(row.first_name, row.last_name)}
                      size="md"
                      color="orange"
                      sx={{ mr: 2 }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {row.first_name} {row.last_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.email}
                      </Typography>
                    </Box>
                  </Box>
                ),
              },
              {
                id: 'program',
                label: 'Program',
                field: 'program_name',
                render: (row) => (
                  <Badge
                    label={row.program_name}
                    size="sm"
                    color={row.program_id ? 'primary' : 'neutral'}
                    variant="outlined"
                  />
                ),
              },
              {
                id: 'workouts',
                label: 'Workouts',
                field: 'total_workouts',
                align: 'right',
                render: (row) => (
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {row.total_workouts}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      total
                    </Typography>
                  </Box>
                ),
              },
              {
                id: 'last_workout',
                label: 'Last Workout',
                field: 'last_workout_date',
                align: 'right',
                render: (row) =>
                  row.last_workout_date ? (
                    <Typography variant="caption">
                      {new Date(row.last_workout_date).toLocaleDateString()}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Never
                    </Typography>
                  ),
              },
              {
                id: 'adherence',
                label: 'Adherence',
                field: 'adherence_rate',
                align: 'right',
                render: (row) => (
                  <Badge
                    label={`${row.adherence_rate}%`}
                    size="sm"
                    color={getAdherenceColor(row.adherence_rate)}
                  />
                ),
              },
              {
                id: 'actions',
                label: 'Actions',
                field: 'actions',
                align: 'center',
                render: (row) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/trainer/client/${row.id}`)}
                  >
                    View
                  </Button>
                ),
              },
            ]}
            data={filteredClients}
            emptyMessage={searchQuery ? 'No clients match your search.' : 'No clients assigned yet.'}
            emptyDescription={searchQuery ? 'Try adjusting your search terms.' : 'Start by assigning programs to trainees.'}
          />
          )}
        </Card>
      </Container>
    </AppLayout>
  );
};

export default TrainerDashboardPage;
