# Prompt for UI Phase 1: Project Setup & Login

This prompt will guide you through setting up the React project for the Fitness Tracker UI and implementing the login functionality.

## 1. Project Setup

**Instruction:**

Use `create-react-app` to bootstrap a new React project named `frontend` in the root of the repository.

```bash
npx create-react-app frontend
```

## 2. Install Dependencies

**Instruction:**

Navigate into the `frontend` directory and install the necessary dependencies for Material-UI, Axios, and React Router.

```bash
cd frontend
npm install @mui/material @emotion/react @emotion/styled axios react-router-dom
```

## 3. Folder Structure

**Instruction:**

Create the following folder structure inside the `frontend/src` directory:

```
frontend/src/
├── api/
├── components/
├── pages/
├── App.js
├── index.js
```

-   `api/`: Will contain functions for making API calls to the backend.
-   `components/`: Will contain reusable UI components.
-   `pages/`: Will contain the main pages of the application (e.g., LoginPage, DashboardPage).

## 4. Create the Login Page

**Instruction:**

Create a new file `frontend/src/pages/LoginPage.js` with a login form using Material-UI components.

**File: `frontend/src/pages/LoginPage.js`**

```javascript
import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/login/access-token', new URLSearchParams({
                username: email,
                password: password,
            }));
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            // Redirect to dashboard or home page
            window.location.href = '/dashboard';
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign in
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
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleLogin}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
```

## 5. Update `App.js` to use the Login Page

**Instruction:**

Update `frontend/src/App.js` to use React Router and render the `LoginPage`.

**File: `frontend/src/App.js`**

```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* Add other routes here later */}
            </Routes>
        </Router>
    );
}

export default App;
```
