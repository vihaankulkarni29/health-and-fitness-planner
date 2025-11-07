import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    CssBaseline,
    Grid,
    IconButton,
    Switch,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimelineIcon from '@mui/icons-material/Timeline';
import VerifiedIcon from '@mui/icons-material/Verified';
import ShieldIcon from '@mui/icons-material/Shield';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const buildTheme = (mode) =>
    createTheme({
        palette: {
            mode,
            primary: { main: '#FF6A13', contrastText: '#ffffff' }, // deep orange
            secondary: { main: '#00897B', contrastText: '#ffffff' }, // teal
            background: {
                default: mode === 'light' ? '#F7F7F8' : '#121212',
                paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
            },
            text: {
                primary: mode === 'light' ? '#1D1D1F' : '#EDEDED',
                secondary: mode === 'light' ? '#4D4D57' : '#B0B0B0',
            },
        },
        typography: {
            h2: { fontWeight: 800, letterSpacing: -0.5 },
            h5: { fontWeight: 700 },
            body1: { lineHeight: 1.7 },
            button: { textTransform: 'none', fontWeight: 700 },
        },
        shape: { borderRadius: 12 },
    });

const testimonials = [
    {
        quote:
            'My clients finally have a plan they love to follow — and I can see progress in one glance.',
        name: 'Taylor M.',
        role: 'Personal Trainer',
    },
    {
        quote:
            'Simple, beautiful, and motivating. I actually look forward to logging workouts.',
        name: 'Ari K.',
        role: 'Trainee',
    },
    {
        quote:
            'Exactly what our studio needed — structure for coaches, clarity for members.',
        name: 'Alex R.',
        role: 'Gym Admin',
    },
];

const LandingPage = () => {
    const navigate = useNavigate();
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = React.useState(prefersDark ? 'dark' : 'light');
    const theme = React.useMemo(() => buildTheme(mode), [mode]);
    const [activeTestimonial, setActiveTestimonial] = React.useState(0);

    React.useEffect(() => {
        const id = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(id);
    }, []);

    const features = [
        {
            icon: <FitnessCenterIcon color="primary" sx={{ fontSize: 36 }} aria-hidden />,
            title: 'Programs that fit your life',
            description: 'Personalized workouts from your coach, with simple, fast logging on any device.',
        },
        {
            icon: <TimelineIcon color="primary" sx={{ fontSize: 36 }} aria-hidden />,
            title: 'Progress you can feel — and see',
            description: 'Trends, PRs, and health metrics that tell your story. Motivation built in.',
        },
        {
            icon: <VerifiedIcon color="primary" sx={{ fontSize: 36 }} aria-hidden />,
            title: 'Coach-first, client-loved',
            description: 'Templates, assignments, and check-ins that keep everyone on the same page.',
        },
        {
            icon: <ShieldIcon color="primary" sx={{ fontSize: 36 }} aria-hidden />,
            title: 'Private and secure',
            description: 'Role-based access, safe-by-default input validation, and modern security practices.',
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box component="main" sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
                {/* Top Bar */}
                <AppBar elevation={0} color="transparent" position="sticky" sx={{ backdropFilter: 'saturate(180%) blur(8px)' }}>
                    <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
                            FitTogether
                        </Typography>
                        <IconButton aria-label="toggle theme" onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}>
                            <Switch checked={mode === 'dark'} inputProps={{ 'aria-label': 'Toggle dark mode' }} />
                        </IconButton>
                        <Button color="primary" variant="text" onClick={() => navigate('/login')} sx={{ mr: 1 }}>
                            Log in
                        </Button>
                                    <Button color="primary" variant="contained" onClick={() => navigate('/login')}>
                            Get Started
                        </Button>
                    </Toolbar>
                </AppBar>

                {/* Hero */}
                <Box component="section" sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={6} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Typography variant="h2" component="h1" sx={{ mb: 2 }}>
                                    Stronger together.
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 600 }}>
                                    A warm, simple space for coaches and clients to plan, train, and celebrate progress. Your
                                    routine, your pace — with clarity every step of the way.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                        <Button size="large" variant="contained" color="primary" onClick={() => navigate('/login')} endIcon={<ArrowForwardIcon />}>
                                        Start free
                                    </Button>
                                    <Button size="large" variant="outlined" color="secondary" onClick={() => navigate('/login')}>
                                        I have a coach
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card elevation={4} sx={{ overflow: 'hidden', borderRadius: 3 }}>
                                    <CardMedia
                                        component="img"
                                        src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1600&auto=format&fit=crop"
                                        alt="Trainer guiding a trainee during a workout session"
                                        sx={{ height: { xs: 240, md: 380 }, objectFit: 'cover' }}
                                    />
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Features */}
                <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: mode === 'light' ? '#FFF7F2' : 'background.paper' }}>
                    <Container maxWidth="lg">
                        <Typography variant="h5" component="h2" align="center" sx={{ mb: 6 }}>
                            Built for real life
                        </Typography>
                        <Grid container spacing={3}>
                            {features.map((f, i) => (
                                <Grid key={i} item xs={12} sm={6} md={3}>
                                    <Card elevation={2} sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ mb: 2 }}>{f.icon}</Box>
                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                {f.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {f.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* Testimonials */}
                <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
                    <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
                            What our community says
                        </Typography>
                        <Card elevation={3} sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                “{testimonials[activeTestimonial].quote}”
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                — {testimonials[activeTestimonial].name}, {testimonials[activeTestimonial].role}
                            </Typography>
                            <Box role="tablist" aria-label="Testimonials" sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
                                {testimonials.map((_, idx) => (
                                    <Box
                                        key={idx}
                                        role="tab"
                                        aria-selected={activeTestimonial === idx}
                                        onClick={() => setActiveTestimonial(idx)}
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && setActiveTestimonial(idx)}
                                        sx={{
                                            width: activeTestimonial === idx ? 14 : 10,
                                            height: 10,
                                            borderRadius: 5,
                                            bgcolor: activeTestimonial === idx ? 'primary.main' : 'divider',
                                            cursor: 'pointer',
                                            outline: 'none',
                                        }}
                                    />
                                ))}
                            </Box>
                        </Card>
                    </Container>
                </Box>

                {/* Footer */}
                <Box component="footer" sx={{ py: 6, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Our story
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    We built FitTogether to bring trainers and trainees closer — with simple tools that make training
                                    personal, consistent, and joyful.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Contact
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Email: vihaankulkarni29@gmail.com
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant="caption" display="block" sx={{ mt: 3, color: 'text.secondary' }}>
                            © {new Date().getFullYear()} Health & Fitness Planner • Built with ❤️
                        </Typography>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default LandingPage;
