import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Button, Divider } from '@mui/material';
import { getSession, endSession } from '../api/workouts';

const WorkoutSessionPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ending, setEnding] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await getSession(sessionId);
                setSession(data);
            } catch (e) {
                setError('Failed to load workout session');
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [sessionId]);

    const handleEndSession = async () => {
        setEnding(true);
        try {
            await endSession(sessionId);
            navigate('/dashboard');
        } catch (e) {
            setError('Failed to end workout session');
        } finally {
            setEnding(false);
        }
    };

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
                            Workout Session
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Session ID: {session?.id}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Program: {session?.program?.name || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Started: {session?.start_time ? new Date(session.start_time).toLocaleString() : 'N/A'}
                        </Typography>
                        {session?.end_time && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Ended: {new Date(session.end_time).toLocaleString()}
                            </Typography>
                        )}
                        
                        <Divider sx={{ my: 3 }} />
                        
                        <Typography variant="h6">Exercises</Typography>
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Exercise logging interface will be implemented in Phase 3.
                        </Alert>

                        <Box sx={{ mt: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={ending || session?.end_time}
                                onClick={handleEndSession}
                            >
                                {ending ? 'Ending...' : 'End Workout'}
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ ml: 2 }}
                                onClick={() => navigate('/dashboard')}
                            >
                                Back to Dashboard
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default WorkoutSessionPage;
