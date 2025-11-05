import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Divider, Button } from '@mui/material';
import { me, logout } from '../api/auth';
import ProgramCard from '../components/ProgramCard';
import WorkoutHistory from '../components/WorkoutHistory';
import { startSession, getSessions } from '../api/workouts';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [starting, setStarting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, sessionsData] = await Promise.all([
                    me(),
                    getSessions()
                ]);
                setUser(userData);
                setSessions(sessionsData);
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
        } catch (e) {
            setError('Failed to start workout session');
        } finally {
            setStarting(false);
        }
    }, [user, navigate]);

    return (
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography component="h1" variant="h4">
                                Dashboard
                            </Typography>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Welcome{user ? `, ${user.first_name} ${user.last_name}` : ''}! This page will show your program and workouts.
                        </Typography>
                        <Divider sx={{ my: 3 }} />
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
                        <WorkoutHistory sessions={sessions} />
                    </>
                )}
            </Box>
        </Container>
    );
};

export default DashboardPage;
