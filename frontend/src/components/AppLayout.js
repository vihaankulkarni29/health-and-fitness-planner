import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './ui/navbar';
import { logout } from '../api/auth';

const AppLayout = ({ children, user, toggleTheme, mode }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
            // Force logout anyway
            navigate('/login', { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header
                theme={mode}
                user={user}
                onLogout={handleLogout}
            />
            <main className="mx-auto max-w-[1760px] px-5 py-8">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
