import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { login } from '../api/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        try {
            const { access_token } = await login(email, password);
            localStorage.setItem('token', access_token);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <Container maxWidth="xs">
                <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate('/')}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mb: 2,
                            textDecoration: 'none',
                            color: 'primary.main',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        <ArrowBackIcon fontSize="small" />
                        Back to Home
                    </Link>

                    <Typography component="h1" variant="h4" sx={{ textAlign: 'center', fontWeight: 700, mb: 1 }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
                        Sign in to continue your fitness journey
                    </Typography>

                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}

                        <Box
                            sx={{
                                mt: 2,
                                p: 2,
                                bgcolor: 'info.light',
                                borderRadius: 1,
                                border: 1,
                                borderColor: 'info.main',
                            }}
                        >
                            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                                Demo Credentials:
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
                                Trainee: vihaan.kulkarni@fitnessdemo.com / trainee123
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
                                Trainer: rohit.wagh@fitnessdemo.com / trainer123
                            </Typography>
                        </Box>

                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600 }}
                            onClick={handleLogin}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
