import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    DumbbellIcon,
    HomeIcon,
    ActivityIcon,
    TrendingUpIcon,
    UserIcon,
    LogOutIcon,
    SettingsIcon,
    MenuIcon,
    XIcon
} from 'lucide-react';

const ChevronIcon = () => (
    <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-2.5 opacity-60 [&_path]:stroke-2"
    >
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Navigation = ({ isDarkTheme, items, currentPath }) => (
    <nav>
        <ul className="flex gap-x-10 xl:gap-x-8 lg:hidden [@media(max-width:1070px)]:gap-x-6">
            {items.map(({ to, text, items: subItems }, index) => {
                const Tag = to ? Link : 'button';
                const isActive = currentPath === to || (subItems && subItems.some(item => currentPath === item.to));

                return (
                    <li
                        className={cn('relative [perspective:2000px]', subItems?.length > 0 && 'group')}
                        key={index}
                    >
                        <Tag
                            className={cn(
                                'flex items-center gap-x-1 whitespace-pre text-sm transition-colors',
                                isDarkTheme ? 'text-white' : 'text-black dark:text-white',
                                isActive && 'text-primary font-semibold'
                            )}
                            to={to}
                        >
                            {text}
                            {subItems?.length > 0 && <ChevronIcon />}
                        </Tag>
                        {subItems?.length > 0 && (
                            <div
                                className={cn(
                                    'absolute -left-5 top-full w-[300px] pt-5',
                                    'pointer-events-none opacity-0',
                                    'origin-top-left transition-[opacity,transform] duration-200 [transform:rotateX(-12deg)_scale(0.9)]',
                                    'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none]'
                                )}
                            >
                                <ul
                                    className={cn(
                                        'relative flex min-w-[248px] flex-col gap-y-0.5 rounded-[14px] border p-2.5',
                                        'dark:border-[#16181D] dark:bg-[#0B0C0F] dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]',
                                        isDarkTheme
                                            ? 'border-[#16181D] bg-[#0B0C0F] shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]'
                                            : 'border-gray-200 bg-white shadow-[0px_14px_20px_0px_rgba(0,0,0,.1)]'
                                    )}
                                >
                                    {subItems.map(({ icon: Icon, text, description, to }, idx) => (
                                        <li key={idx}>
                                            <Link
                                                className={cn(
                                                    'group/link relative flex items-center overflow-hidden whitespace-nowrap rounded-[14px] p-2',
                                                    'before:absolute before:inset-0 before:z-10 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100',
                                                    isDarkTheme
                                                        ? 'text-white before:bg-[#16181D]'
                                                        : 'text-black before:bg-[#f5f5f5]'
                                                )}
                                                to={to}
                                            >
                                                {Icon && (
                                                    <div
                                                        className={cn(
                                                            'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border',
                                                            isDarkTheme
                                                                ? 'border-[#2E3038] bg-[#16181D]'
                                                                : 'border-gray-200 bg-[#F5F5F5]'
                                                        )}
                                                    >
                                                        <Icon className="h-5 w-5 text-primary" />
                                                    </div>
                                                )}
                                                <div className="relative z-10 ml-3">
                                                    <span className="block text-sm font-medium">{text}</span>
                                                    {description && (
                                                        <span
                                                            className={cn(
                                                                'mt-0.5 block text-sm',
                                                                isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                                                            )}
                                                        >
                                                            {description}
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    </nav>
);

const MobileMenu = ({ isOpen, onClose, items, currentPath, user, onLogout }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-[#0B0C0F] shadow-xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#16181D]">
                    <div className="flex items-center gap-2">
                        <DumbbellIcon className="size-6 text-primary" />
                        <span className="text-xl font-semibold">FitTrack</span>
                    </div>
                    <button onClick={onClose} className="p-2">
                        <XIcon className="size-6" />
                    </button>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        {items.map(({ to, text, items: subItems, icon: Icon }, index) => (
                            <li key={index}>
                                {to ? (
                                    <Link
                                        to={to}
                                        onClick={onClose}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                            currentPath === to
                                                ? 'bg-primary/10 text-primary font-semibold'
                                                : 'hover:bg-gray-100 dark:hover:bg-[#16181D]'
                                        )}
                                    >
                                        {Icon && <Icon className="size-5" />}
                                        {text}
                                    </Link>
                                ) : (
                                    <>
                                        <div className="px-4 py-2 text-sm font-semibold text-gray-500">{text}</div>
                                        {subItems && (
                                            <ul className="ml-4 space-y-1">
                                                {subItems.map((item, idx) => (
                                                    <li key={idx}>
                                                        <Link
                                                            to={item.to}
                                                            onClick={onClose}
                                                            className={cn(
                                                                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                                                                currentPath === item.to
                                                                    ? 'bg-primary/10 text-primary font-semibold'
                                                                    : 'hover:bg-gray-100 dark:hover:bg-[#16181D]'
                                                            )}
                                                        >
                                                            {item.icon && <item.icon className="size-4" />}
                                                            {item.text}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                    {user && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#16181D]">
                            <button
                                onClick={() => {
                                    onLogout();
                                    onClose();
                                }}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left hover:bg-gray-100 dark:hover:bg-[#16181D] text-error"
                            >
                                <LogOutIcon className="size-5" />
                                Logout
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </div>
    );
};

export const Header = ({
    className,
    theme = 'light',
    isSticky = true,
    user = null,
    onLogout,
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const isDarkTheme = theme === 'dark';
    const currentPath = window.location.pathname;

    const menuItems = user ? [
        {
            to: '/dashboard',
            text: 'Dashboard',
            icon: HomeIcon,
        },
        {
            text: 'Workouts',
            items: [
                {
                    icon: ActivityIcon,
                    text: 'Start Workout',
                    description: 'Begin a new session',
                    to: '/workout/start',
                },
                {
                    icon: TrendingUpIcon,
                    text: 'History',
                    description: 'View past workouts',
                    to: '/workout/history',
                },
            ],
        },
        {
            to: '/health',
            text: 'Health',
            icon: TrendingUpIcon,
        },
    ] : [
        {
            to: '/',
            text: 'Home',
            icon: HomeIcon,
        },
    ];

    return (
        <>
            <header
                className={cn(
                    'relative z-40 w-full',
                    isSticky && 'sticky top-0',
                    'bg-white/80 backdrop-blur-md dark:bg-[#0B0C0F]/80',
                    'border-b border-gray-200 dark:border-[#16181D]',
                    className
                )}
            >
                <div className="mx-auto max-w-[1760px] px-5 py-4">
                    <div className="flex items-center justify-between">
                        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
                            <DumbbellIcon className="size-6 text-primary" />
                            <span className="text-xl font-semibold">FitTrack</span>
                        </Link>

                        <Navigation isDarkTheme={isDarkTheme} items={menuItems} currentPath={currentPath} />

                        <div className="flex items-center gap-x-6">
                            {user ? (
                                <>
                                    <div className="hidden lg:flex items-center gap-4">
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#16181D] transition-colors"
                                        >
                                            <UserIcon className="size-5" />
                                            <span className="text-sm font-medium">{user.first_name || 'Profile'}</span>
                                        </Link>
                                        <button
                                            onClick={onLogout}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-error/10 text-error transition-colors"
                                        >
                                            <LogOutIcon className="size-5" />
                                            <span className="text-sm font-medium">Logout</span>
                                        </button>
                                    </div>
                                    <button
                                        className="lg:hidden p-2"
                                        onClick={() => setIsMobileMenuOpen(true)}
                                    >
                                        <MenuIcon className="size-6" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="hidden lg:block px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="hidden lg:block px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                    <button
                                        className="lg:hidden p-2"
                                        onClick={() => setIsMobileMenuOpen(true)}
                                    >
                                        <MenuIcon className="size-6" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                items={menuItems}
                currentPath={currentPath}
                user={user}
                onLogout={onLogout}
            />
        </>
    );
};

export default Header;
