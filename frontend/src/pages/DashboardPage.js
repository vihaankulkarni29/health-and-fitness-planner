import React, { useEffect, useState, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Button,
    Grid,
    Snackbar,
    useTheme,
    Fade
} from '@mui/material';
import { me } from '../api/auth';
import ProgramCard from '../components/ProgramCard';
import WorkoutHistory from '../components/WorkoutHistory';
import { startSession, getSessions } from '../api/workouts';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ActivityIcon, TrendingUpIcon, TargetIcon, CalendarIcon } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import useCurrentUser from '../hooks/useCurrentUser';
import GlassCard from '../components/GlassCard';
import WeightChart from '../components/WeightChart';
import StatsCard from '../components/StatsCard';
import StatsSection from '../components/ui/stats-section';
import SkeletonLoader from '../components/SkeletonLoader';
import { gradients, spacing } from '../theme/tokens';

// Helper function for greeting
const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
};

// Mock data for the chart until we connect real metrics
const MOCK_WEIGHT_DATA = [
    { date: 'Week 1', weight: 82.5 },
    { date: 'Week 2', weight: 81.8 },
    { date: 'Week 3', weight: 81.2 },
    { date: 'Week 4', weight: 80.5 },
    { date: 'Week 5', weight: 79.8 },
    { date: 'Week 6', weight: 79.2 },
];

const DashboardPage = ({ toggleTheme, mode }) => {
    const [user, setUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [starting, setStarting] = useState(false);
    const [snack, setSnack] = useState({ open: false, message: '' });
    const navigate = useNavigate();
    const { user: currentUser, loading: userLoading } = useCurrentUser();
    const theme = useTheme();

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
            <Container maxWidth="lg" sx={{ mt: 8 }}>
                <SkeletonLoader height={60} width="50%" sx={{ mb: 4 }} />
                <Grid container spacing={4}>
                    <Grid item xs={12} lg={8}>
                        <SkeletonLoader height={200} borderRadius={16} sx={{ mb: 4 }} />
                        <SkeletonLoader height={300} borderRadius={16} />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <SkeletonLoader height={150} borderRadius={16} sx={{ mb: 4 }} />
                        <SkeletonLoader height={200} borderRadius={16} />
                    </Grid>
                </Grid>
            </Container>
        );
    }

    return (
        <AppLayout user={currentUser || user} mode={mode} toggleTheme={toggleTheme}>
            {/* Modern Gradient Background for the Dashboard Area */}
            <Box sx={{
                minHeight: '100vh',
                background: mode === 'dark' ? gradients.dark : 'linear-gradient(180deg, #FFF3E0 0%, #FFFFFF 100%)',
                pt: 4,
                pb: 8
            }}>
                <Container maxWidth="xl">
                    {loading ? (
                        <Box sx={{ mt: 4 }}>
                            <SkeletonLoader height={60} width="40%" sx={{ mb: 5 }} />
                            <Grid container spacing={4}>
                                <Grid item xs={12} lg={8}>
                                    <SkeletonLoader height={220} borderRadius={24} sx={{ mb: 4 }} />
                                    <SkeletonLoader height={350} borderRadius={24} />
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <SkeletonLoader height={160} borderRadius={24} sx={{ mb: 4 }} />
                                    <SkeletonLoader height={250} borderRadius={24} />
                                </Grid>
                            </Grid>
                        </Box>
                    ) : error ? (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
                    ) : (
                        <Fade in={!loading} timeout={800}>
                            <Box>
                                {/* Header Section */}
                                <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h3" fontWeight="800" sx={{
                                            background: gradients.primary,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            mb: 1
                                        }}>
                                            Good {getTimeOfDay()}, {user?.first_name || 'Athlete'}
                                        </Typography>
                                        <Typography variant="h6" color="text.secondary" fontWeight="500">
                                            Ready to crush your goals today?
                                        </Typography>
                                    </Box>
                                    {user?.role === 'TRAINER' && (
                                        <Button
                                            variant="contained"
                                            startIcon={<DashboardIcon />}
                                            onClick={() => navigate('/trainer-dashboard')}
                                            sx={{ borderRadius: '50px', px: 4, py: 1.5, background: gradients.primary }}
                                        >
                                            Trainer Panel
                                        </Button>
                                    )}
                                </Box>

                                {/* Stats Section */}
                                <StatsSection
                                    stats={[
                                        {
                                            value: sessions.length,
                                            label: 'Total Workouts',
                                            description: 'All time',
                                            icon: ActivityIcon,
                                            trend: 12
                                        },
                                        {
                                            value: user?.program ? '1' : '0',
                                            label: 'Active Programs',
                                            description: 'Currently enrolled',
                                            icon: TargetIcon,
                                        },
                                        {
                                            value: sessions.filter(s => {
                                                const sessionDate = new Date(s.session_date);
                                                const weekAgo = new Date();
                                                weekAgo.setDate(weekAgo.getDate() - 7);
                                                return sessionDate >= weekAgo;
                                            }).length,
                                            label: 'This Week',
                                            description: 'Workouts completed',
                                            icon: CalendarIcon,
                                            trend: 25
                                        }
                                    ]}
                                    className="mb-8"
                                />

                                <Grid container spacing={4}>
                                    {/* Main Content Column */}
                                    <Grid item xs={12} lg={8}>
                                        {/* Active Program Card */}
                                        <GlassCard
                                            title="Current Program"
                                            subtitle="Your active training plan"
                                            sx={{ mb: 4, minHeight: 200 }}
                                        >
                                            {user && user.program ? (
                                                <Box>
                                                    <ProgramCard program={user.program} elevation={0} />
                                                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            size="large"
                                                            startIcon={starting ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                                                            disabled={starting}
                                                            onClick={handleStartWorkout}
                                                            sx={{
                                                                borderRadius: '12px',
                                                                background: gradients.primary,
                                                                flex: 1,
                                                                py: 1.5,
                                                                fontSize: '1.1rem'
                                                            }}
                                                        >
                                                            Start Workout
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                                                    No program assigned yet. Ask your trainer to assign one!
                                                </Alert>
                                            )}
                                        </GlassCard>

                                        {/* Weight Progress Chart */}
                                        <GlassCard title="Weight Progress" subtitle="Last 6 weeks" delay={0.2}>
                                            <WeightChart data={MOCK_WEIGHT_DATA} />
                                        </GlassCard>
                                    </Grid>

                                    {/* Sidebar Column */}
                                    <Grid item xs={12} lg={4}>
                                        {/* Quick Stats / Motivation */}
                                        <StatsCard
                                            title="Weekly Workouts"
                                            value="3/4"
                                            trend="up"
                                            trendLabel="On Track"
                                            icon={<CheckCircleIcon sx={{ color: 'success.main' }} />}
                                            delay={0.3}
                                            color="warm"
                                        />

                                        <Box sx={{ mt: 4 }}>
                                            {/* Recent History */}
                                            <GlassCard title="Recent Activity" delay={0.4}>
                                                <WorkoutHistory sessions={sessions.slice(0, 3)} compact />
                                                <Button
                                                    fullWidth
                                                    sx={{ mt: 2, borderRadius: '20px' }}
                                                    onClick={() => navigate('/history')}
                                                >
                                                    View All History
                                                </Button>
                                            </GlassCard>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box >
                        </Fade >
                    )}
                </Container >
            </Box >

            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack({ open: false, message: '' })}
                message={snack.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </AppLayout >
    );
};

export default DashboardPage;
