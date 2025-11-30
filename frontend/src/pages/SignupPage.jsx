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
            // Split name into first and last name
            const nameParts = name.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';

            await signup({
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                gym_id: 1 // Default gym for now, or make it optional
            });
            navigate('/dashboard', { replace: true });
        } catch (err) {
            const status = err.response?.status;
            console.error('Signup failed', status, err.response?.data);

            if (status === 409) {
                setError('Email already registered.');
            } else if (status === 422) {
                setError('Invalid email or password format. Password must be at least 8 chars with letters and numbers.');
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
