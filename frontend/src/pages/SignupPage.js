import React, { useState } from 'react';
import {
    Button,
    TextField,
    Container,
    Typography,
    Box,
    Paper,
    Link,
    Alert,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { motion } from 'framer-motion';
import { gradients } from '../theme/theme';
// import { signup } from '../api/auth'; // Assuming this exists or will be created

const MotionPaper = motion(Paper);

const SignupPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async () => {
        setError('');
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        setLoading(true);
        try {
            // await signup({ first_name: firstName, last_name: lastName, email, password });
            // For now, just simulate success or redirect to login
            navigate('/login', { state: { message: 'Account created! Please log in.' } });
        } catch (err) {
            setError('Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: gradients.premium,
                p: 2
            }}
        >
            <Container maxWidth="xs">
                <MotionPaper
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    elevation={24}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate('/')}
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 3, textDecoration: 'none', fontWeight: 600 }}
                    >
                        <ArrowBackIcon fontSize="small" /> Back to Home
                    </Link>

                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box sx={{ display: 'inline-flex', p: 2, borderRadius: 3, background: gradients.primary, mb: 2 }}>
                            <FitnessCenterIcon sx={{ fontSize: 40, color: 'white' }} />
                        </Box>
                        <Typography variant="h4" fontWeight="800" sx={{ background: gradients.primary, backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Join Us
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Start your fitness journey today
                        </Typography>
                    </Box>

                    <Box component="form" noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSignup}
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, py: 1.5, background: gradients.primary, fontWeight: 700 }}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Link component="button" onClick={() => navigate('/login')} sx={{ fontWeight: 600, textDecoration: 'none' }}>
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    );
};

export default SignupPage;
