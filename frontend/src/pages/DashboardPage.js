import React, { useEffect, useState, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Divider,
    Button,
    Grid,
    Snackbar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import { me } from '../api/auth';
import ProgramCard from '../components/ProgramCard';
import WorkoutHistory from '../components/WorkoutHistory';
import { startSession, getSessions } from '../api/workouts';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FeatureCard from '../components/dashboard/FeatureCard';
import ProgressTracker from '../components/dashboard/ProgressTracker';
import TrainerPanel from '../components/dashboard/TrainerPanel';
import AppLayout from '../components/AppLayout';
import useCurrentUser from '../hooks/useCurrentUser';

// Helper function for greeting
const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
};

const DashboardPage = ({ toggleTheme, mode }) => {
    const [user, setUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [starting, setStarting] = useState(false);
    const [snack, setSnack] = useState({ open: false, message: '' });
    const navigate = useNavigate();
    const { user: currentUser, loading: userLoading } = useCurrentUser();

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

    if (userLoading) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <AppLayout user={currentUser || user} mode={mode} toggleTheme={toggleTheme}>
        <Container maxWidth="lg">
            <Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <>
                        <Typography component="h1" variant="h1" sx={{ mb: 3 }}>
                            Dashboard
                        </Typography>
                        {user?.role === 'TRAINER' && (
                            <Box sx={{ mb: 3 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<DashboardIcon />}
                                    onClick={() => navigate('/trainer-dashboard')}
                                >
                                    Trainer Dashboard
                                </Button>
                            </Box>
                        )}

                        {/* Welcome Section */}
                        {user && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Good {getTimeOfDay()}, {user.full_name || user.username}!
                                </Typography>
                            </Box>
                        )}

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
        </AppLayout>
     );
};

export default DashboardPage;
