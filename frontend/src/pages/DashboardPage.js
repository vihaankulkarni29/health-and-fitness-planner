import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { me } from '../api/auth';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                    </>
                )}
            </Box>
        </Container>
    );
};

export default DashboardPage;
