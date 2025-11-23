import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPage } from '../components/ui/auth-page';
import { signup } from '../api/auth';

const SignupPage = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async ({ email, password, name }) => {
        setError('');
        try {
            // TODO: Implement signup API call
            await signup(email, password, name);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            const status = err.response?.status;
            console.error('Signup failed', status, err.response?.data);

            if (status === 409) {
                setError('Email already registered.');
            } else if (status === 422) {
                setError('Invalid email or password format.');
            } else if (!status) {
                setError('Network error. Is the backend server running?');
            } else {
                setError('Unable to create account. Please try again.');
            }
        }
    };

    const handleModeChange = () => {
        navigate('/login');
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
                mode="signup"
                onSubmit={handleSubmit}
                onModeChange={handleModeChange}
            />
        </div>
    );
};

export default SignupPage;
