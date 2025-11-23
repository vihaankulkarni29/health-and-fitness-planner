import React, { useState } from 'react';
import {
    Button,
    TextField,
    Container,
    Typography,
    Box,
    Paper,
    Link,
    IconButton,
    InputAdornment,
    Alert,
    Stack,
    Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { motion } from 'framer-motion';
import { login } from '../api/auth';
import { getAccessToken } from '../auth/token';
import { gradients } from '../theme/theme';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await login(email, password); // token stored centrally
            const token = getAccessToken();
            if (token) {
                navigate('/dashboard', { replace: true });
            } else {
                setError('Login succeeded but token missing. Please retry.');
            }
        } catch (err) {
            const status = err.response?.status;
            const payload = err.response?.data;
            console.error('Login failed', status, payload);
            if (status === 401) {
                setError('Incorrect email or password.');
            } else if (status === 429) {
                setError('Too many attempts. Please wait a minute and try again.');
            } else if (status === 404) {
                setError('Account not found.');
            } else if (status === 422) {
                setError('Invalid request format (validation error).');
            } else if (!status) {
                setError('Network error. Is the backend server running on http://localhost:8000? See docs/LOGIN_TROUBLESHOOTING.md');
            } else {
                setError('Unable to sign in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleLogin();
        }
    };

    const fillDemoCredentials = (type) => {
        if (type === 'trainee') {
            setEmail('vihaan.kulkarni@fitnessdemo.com');
            setPassword('trainee123');
        } else {
            setEmail('rohit.wagh@fitnessdemo.com');
            setPassword('trainer123');
        }
        setError('');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: gradients.premium,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated background elements */}
            <MotionBox
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(40px)',
                }}
            />
            <MotionBox
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(40px)',
                }}
            />

            <Container maxWidth="xs">
                <MotionPaper
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    elevation={24}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                >
                    {/* Back to Home Link */}
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate('/')}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mb: 3,
                            textDecoration: 'none',
                            color: 'primary.main',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            '&:hover': {
                                textDecoration: 'none',
                                gap: 1,
                            },
                        }}
                    >
                        <ArrowBackIcon fontSize="small" />
                        Back to Home
                    </Link>

                    {/* Logo & Heading */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                p: 2,
                                borderRadius: 3,
                                background: gradients.primary,
                                mb: 2,
                            }}
                        >
                            <FitnessCenterIcon sx={{ fontSize: 40, color: 'white' }} />
                        </Box>
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                                background: gradients.primary,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            Sign in to continue your fitness journey
                        </Typography>
                    </Box>

                    {/* Demo Credentials */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                            Quick Login:
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Chip
                                label="Demo Trainee"
                                onClick={() => fillDemoCredentials('trainee')}
                                sx={{
                                    background: gradients.secondary,
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 2,
                                    },
                                    transition: 'all 0.2s',
                                }}
                            />
                            <Chip
                                label="Demo Trainer"
                                onClick={() => fillDemoCredentials('trainer')}
                                sx={{
                                    background: gradients.accent,
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 2,
                                    },
                                    transition: 'all 0.2s',
                                }}
                            />
                        </Stack>
                    </Box>

                    {/* Login Form */}
                    <Box component="form" noValidate>
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
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {error && (
                            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleLogin}
                            disabled={loading}
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                background: gradients.primary,
                                '&:hover': {
                                    background: gradients.primary,
                                    opacity: 0.9,
                                },
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Don't have an account?{' '}
                                <Link
                                    component="button"
                                    onClick={() => navigate('/signup')}
                                    sx={{
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        '&:hover': { textDecoration: 'underline' },
                                    }}
                                >
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </MotionPaper>

                {/* Footer Text */}
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        textAlign: 'center',
                        mt: 3,
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 500,
                    }}
                >
                    Powered by advanced fitness analytics
                </Typography>
            </Container>
        </Box>
    );
};

export default LoginPage;
