import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPage } from '../components/ui/auth-page';
import { login } from '../api/auth';
import { getAccessToken } from '../auth/token';

const LoginPage = () => {
    const [error, setError] = useState('');
    const [mode, setMode] = useState('login');
    const navigate = useNavigate();

    const handleSubmit = async ({ email, password, name }) => {
        setError('');
        try {
            if (mode === 'login') {
                await login(email, password);
                const token = getAccessToken();
                if (token) {
                    navigate('/dashboard', { replace: true });
                } else {
                    setError('Login succeeded but token missing. Please retry.');
                }
            } else {
                // TODO: Implement signup API call
                setError('Signup not yet implemented');
            }
        } catch (err) {
            const status = err.response?.status;
            console.error('Auth failed', status, err.response?.data);

            if (status === 401) {
                setError('Incorrect email or password.');
            } else if (status === 429) {
                setError('Too many attempts. Please wait a minute and try again.');
            } else if (status === 404) {
                setError('Account not found.');
            } else if (status === 422) {
                setError('Invalid request format (validation error).');
            } else if (!status) {
                setError('Network error. Is the backend server running on http://localhost:8000?');
            } else {
                setError('Unable to sign in. Please try again.');
            }
        }
    };

    const handleModeChange = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setError('');
    };

    return (
        <div className="min-h-screen">
            {error && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
                    <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg">
                        {error}
                    </div>
                </div>
            )}
            <AuthPage
                mode={mode}
                onSubmit={handleSubmit}
                onModeChange={handleModeChange}
            />
        </div>
    );
};

export default LoginPage;
