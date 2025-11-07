import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Divider,
    Button,
    Stack,
    Grid,
    Snackbar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useMediaQuery,
    Switch,
    AppBar,
    Toolbar,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { me, logout } from '../api/auth';
import ProgramCard from '../components/ProgramCard';
import WorkoutHistory from '../components/WorkoutHistory';
import { startSession, getSessions } from '../api/workouts';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FeatureCard from '../components/dashboard/FeatureCard';
import ProgressTracker from '../components/dashboard/ProgressTracker';
import TrainerPanel from '../components/dashboard/TrainerPanel';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [starting, setStarting] = useState(false);
    const [snack, setSnack] = useState({ open: false, message: '' });
    const navigate = useNavigate();
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = useState(prefersDark ? 'dark' : 'light');
    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: { main: '#FF6A13' },
            secondary: { main: '#00897B' },
            background: { default: mode === 'light' ? '#F7F7F8' : '#121212' },
        },
        shape: { borderRadius: 12 },
        typography: { button: { textTransform: 'none', fontWeight: 700 } }
    }), [mode]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, sessionsData] = await Promise.all([
                    me(),
                    getSessions()
                ]);
                setUser(userData);
                setSessions(sessionsData);
                setSnack({ open: true, message: `Welcome back${userData?.first_name ? ', ' + userData.first_name : ''}!` });
            } catch (e) {
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = useCallback(() => {
        logout();
        navigate('/login');
    }, [navigate]);

    const handleStartWorkout = useCallback(async () => {
        if (!user || !user.program) return;
        setStarting(true);
        try {
            const session = await startSession(user.id, user.program.id);
            navigate(`/workout/${session.id}`);
            setSnack({ open: true, message: 'Workout session started! You got this 💪' });
        } catch (e) {
            setError('Failed to start workout session');
        } finally {
            setStarting(false);
        }
    }, [user, navigate]);

    return (
        <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
            <Box sx={{ marginTop: 8 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <>
                        <AppBar elevation={0} color="transparent" position="static" sx={{ mb: 2 }}>
                          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                            <Typography component="h1" variant="h5" sx={{ fontWeight: 800 }}>
                                Dashboard
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="caption">Dark</Typography>
                                <Switch checked={mode === 'dark'} onChange={() => setMode(m => m === 'light' ? 'dark' : 'light')} inputProps={{ 'aria-label': 'Toggle dark mode' }} />
                                {user?.role === 'TRAINER' && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<DashboardIcon />}
                                        onClick={() => navigate('/trainer-dashboard')}
                                    >
                                        Trainer Dashboard
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    startIcon={<BarChartIcon />}
                                    onClick={() => navigate('/analytics')}
                                >
                                    Analytics
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<PersonIcon />}
                                    onClick={() => navigate('/profile')}
                                >
                                    Profile
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<MonitorHeartIcon />}
                                    onClick={() => navigate('/health-metrics')}
                                >
                                    Health Metrics
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<LogoutIcon />}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </Stack>
                          </Toolbar>
                        </AppBar>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Welcome{user ? `, ${user.first_name} ${user.last_name}` : ''}! This page will show your program and workouts.
                        </Typography>
                        <Divider sx={{ my: 3 }} />
                        {/* Top Summary */}
                        <Grid container spacing={3} sx={{ mb: 1 }}>
                            <Grid item xs={12} md={4}>
                                <ProgressTracker sessions={sessions} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TrainerPanel user={user} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FeatureCard
                                  icon={<CheckCircleIcon color="success" sx={{ fontSize: 28 }} aria-hidden />}
                                  title="Stay consistent"
                                  description="Set a weekly target and see your momentum build over time."
                                />
                            </Grid>
                        </Grid>

                        <Typography variant="h6">Your Program</Typography>
                        {user && user.program ? (
                          <ProgramCard program={user.program} />
                        ) : (
                          <Alert severity="info" sx={{ mt: 2 }}>No program assigned yet.</Alert>
                        )}

                                                <Box sx={{ mt: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        disabled={!user || !user.program || starting}
                                                        onClick={handleStartWorkout}
                                                    >
                                                        Start Workout
                                                    </Button>
                                                </Box>

                        <Divider sx={{ my: 3 }} />
                        <Accordion defaultExpanded>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="history-content" id="history-header">
                            <Typography variant="h6">Recent Workouts</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <WorkoutHistory sessions={sessions} />
                          </AccordionDetails>
                        </Accordion>
                    </>
                )}
            </Box>
        <Snackbar
              open={snack.open}
              autoHideDuration={3000}
              onClose={() => setSnack({ open: false, message: '' })}
              message={snack.message}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
        </ThemeProvider>
     );
};

export default DashboardPage;
