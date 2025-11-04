# Prompt for UI Phase 2: Dashboard & Workout Sessions

This prompt will guide you through building the dashboard, fetching user data, and managing workout sessions.

## 1. Create an Authenticated API Client

**Goal:** Create an Axios instance that automatically includes the JWT token in the headers of all requests.

**Instruction:**

Create a new file `frontend/src/api/client.js`.

**File: `frontend/src/api/client.js`**
```javascript
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
```

## 2. Create the Dashboard Page

**Goal:** Fetch and display the logged-in user's data and their assigned program.

**Instruction:**

Update the `frontend/src/pages/DashboardPage.js` to fetch user data and display it.

**File: `frontend/src/pages/DashboardPage.js`**
```javascript
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import apiClient from '../api/client';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [program, setProgram] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // The backend needs an endpoint to get the current user's data
                // Assuming a /me endpoint exists
                const userResponse = await apiClient.get('/trainees/me'); // This endpoint needs to be created in the backend
                setUser(userResponse.data);

                if (userResponse.data.program_id) {
                    const programResponse = await apiClient.get(`/programs/${userResponse.data.program_id}`);
                    setProgram(programResponse.data);
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };

        fetchUserData();
    }, []);

    const handleStartWorkout = async () => {
        try {
            const response = await apiClient.post('/workout-sessions/start', {
                trainee_id: user.id,
                program_id: program.id,
            });
            // Redirect to the workout session page
            window.location.href = `/workout/${response.data.id}`;
        } catch (error) {
            console.error("Failed to start workout", error);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ marginTop: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                {user && (
                    <Typography variant="h6">
                        Welcome, {user.first_name} {user.last_name}!
                    </Typography>
                )}
                {program ? (
                    <Card sx={{ mt: 4 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Your Program: {program.name}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {program.description}
                            </Typography>
                            <Button variant="contained" onClick={handleStartWorkout} sx={{ mt: 2 }}>
                                Start Workout
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Typography sx={{ mt: 4 }}>
                        You are not currently assigned to a program.
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default DashboardPage;
```

## 3. Create a `/me` Endpoint in the Backend

**Goal:** The frontend needs an endpoint to get the current user's data.

**Instruction:**

Add a new endpoint to `backend/app/api/v1/endpoints/trainees.py` to get the current user's data.

**File: `backend/app/api/v1/endpoints/trainees.py`**

Add the following function to the file:

```python
from app.models.trainee import Trainee

@router.get("/me", response_model=Trainee)
def read_current_trainee(
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """Get current trainee."""
    return current_user
```

## 4. Update App.js with New Routes

**Goal:** Add the dashboard and workout session pages to the router.

**Instruction:**

Update `frontend/src/App.js` to include the new routes.

**File: `frontend/src/App.js`**
```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <DashboardPage />
                        </PrivateRoute>
                    }
                />
                {/* Add workout session route here later */}
            </Routes>
        </Router>
    );
}

export default App;
```
