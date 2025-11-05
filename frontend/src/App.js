import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutSessionPage from './pages/WorkoutSessionPage';
import HealthMetricsPage from './pages/HealthMetricsPage';
import ProfilePage from './pages/ProfilePage';
import RequireAuth from './components/RequireAuth';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <RequireAuth>
                                <DashboardPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/workout/:sessionId"
                        element={
                            <RequireAuth>
                                <WorkoutSessionPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/health-metrics"
                        element={
                            <RequireAuth>
                                <HealthMetricsPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <RequireAuth>
                                <ProfilePage />
                            </RequireAuth>
                        }
                    />
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
