import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme/theme';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutSessionPage from './pages/WorkoutSessionPage';
import HealthMetricsPage from './pages/HealthMetricsPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import TrainerDashboardPage from './pages/TrainerDashboardPage';
import ClientProgressPage from './pages/ClientProgressPage';
import RequireAuth from './components/RequireAuth';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    // Theme toggle with localStorage persistence
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'light';
    });

    const theme = useMemo(() => mode === 'dark' ? darkTheme : lightTheme, [mode]);

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary>
                <Router>
                    <Routes>
                    <Route path="/" element={<LandingPage toggleTheme={toggleTheme} mode={mode} />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <RequireAuth>
                                <DashboardPage toggleTheme={toggleTheme} mode={mode} />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/workout/:sessionId"
                        element={
                            <RequireAuth>
                                <WorkoutSessionPage toggleTheme={toggleTheme} mode={mode} />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/health-metrics"
                        element={
                            <RequireAuth>
                                <HealthMetricsPage toggleTheme={toggleTheme} mode={mode} />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <RequireAuth>
                                <ProfilePage toggleTheme={toggleTheme} mode={mode} />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/analytics"
                        element={
                            <RequireAuth>
                                <AnalyticsPage toggleTheme={toggleTheme} mode={mode} />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/trainer-dashboard"
                        element={
                            <RequireAuth>
                                <TrainerDashboardPage toggleTheme={toggleTheme} mode={mode} />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/trainer/client/:clientId"
                        element={
                            <RequireAuth>
                                <ClientProgressPage toggleTheme={toggleTheme} mode={mode} />
                            </RequireAuth>
                        }
                    />
                </Routes>
            </Router>
        </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
