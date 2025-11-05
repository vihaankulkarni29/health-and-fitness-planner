import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Divider, Button } from '@mui/material';
import { me } from '../api/auth';
import ProgramCard from '../components/ProgramCard';
import { startSession } from '../api/workouts';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [starting, setStarting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const data = await me();
                setUser(data);
            } catch (e) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, []);

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
                        <Typography component="h1" variant="h4">
                            Dashboard
                        </Typography>
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
                                                        onClick={async () => {
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
                                                        }}
                                                    >
                                                        Start Workout
                                                    </Button>
                                                </Box>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default DashboardPage;
