import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutSessionPage from './pages/WorkoutSessionPage';
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
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
