import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Alert, Divider, Grid } from '@mui/material';
import { getSession, endSession } from '../api/workouts';
import { getProgramExercisesByProgram } from '../api/programs';
import ExerciseLogForm from '../components/ExerciseLogForm';
import ExerciseLogList from '../components/ExerciseLogList';
import AppLayout from '../components/AppLayout';
import { Button } from '../components/ui/button';
import Spinner from '../components/ui/Spinner';

const WorkoutSessionPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [programExercises, setProgramExercises] = useState([]);
    const [exerciseLogs, setExerciseLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ending, setEnding] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await getSession(sessionId);
                setSession(data);
                
                // Fetch program exercises if program exists
                if (data.program_id) {
                    try {
                        const exercises = await getProgramExercisesByProgram(data.program_id);
                        setProgramExercises(exercises);
                    } catch (err) {
                        console.error('Failed to fetch program exercises:', err);
                    }
                }
                
                // Set existing exercise logs if any
                if (data.exercise_logs) {
                    setExerciseLogs(data.exercise_logs);
                }
            } catch (e) {
                setError('Failed to load workout session');
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [sessionId]);
    
    const handleLogCreated = useCallback((newLog) => {
        setExerciseLogs(prev => [...prev, newLog]);
    }, []);

    const handleEndSession = useCallback(async () => {
        setEnding(true);
        try {
            await endSession(sessionId);
            navigate('/dashboard');
        } catch (e) {
            setError('Failed to end workout session');
        } finally {
            setEnding(false);
        }
    }, [sessionId, navigate]);

        return (
            <AppLayout>
                <Container maxWidth="lg">
                    {loading ? (
                        <Spinner center label="Loading session..." />
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <>
                            <Typography variant="h1" sx={{ mb: 2 }}>Workout Session</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2">Session ID: {session?.id}</Typography>
                                <Typography variant="body2">Program: {session?.program?.name || 'N/A'}</Typography>
                                <Typography variant="body2">Started: {session?.start_time ? new Date(session.start_time).toLocaleString() : 'N/A'}</Typography>
                                {session?.end_time && (
                                    <Typography variant="body2">Ended: {new Date(session.end_time).toLocaleString()}</Typography>
                                )}
                            </Box>

                            <Divider sx={{ my: 3 }} />
                            <Typography variant="h6" gutterBottom>Exercises</Typography>

                            {programExercises.length > 0 ? (
                                <Grid container spacing={2}>
                                    {programExercises.map((programExercise) => (
                                        <Grid item xs={12} md={6} key={programExercise.id}>
                                            <ExerciseLogForm
                                                exercise={programExercise}
                                                sessionId={sessionId}
                                                onLogCreated={handleLogCreated}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    No exercises found for this program.
                                </Alert>
                            )}

                            <Divider sx={{ my: 3 }} />
                            <ExerciseLogList logs={exerciseLogs} />

                            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                                <Button
                                    variant="primary"
                                    disabled={ending || session?.end_time}
                                    onClick={handleEndSession}
                                >
                                    {ending ? 'Ending...' : 'End Workout'}
                                </Button>
                                <Button variant="ghost" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                            </Box>
                        </>
                    )}
                </Container>
            </AppLayout>
        );
};

export default WorkoutSessionPage;
