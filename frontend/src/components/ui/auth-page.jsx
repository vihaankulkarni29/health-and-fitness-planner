import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { Input } from './input';
import { cn } from '../../lib/utils';
import {
    AtSignIcon,
    ChevronLeftIcon,
    DumbbellIcon,
} from 'lucide-react';

export function AuthPage({ mode = 'login', onSubmit, onModeChange }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ email, password, name });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
            <div className="bg-muted/60 relative hidden h-full flex-col border-r p-10 lg:flex">
                <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
                <div className="z-10 flex items-center gap-2">
                    <DumbbellIcon className="size-6 text-primary" />
                    <p className="text-xl font-semibold">FitTrack</p>
                </div>
                <div className="z-10 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-xl">
                            &ldquo;This app transformed my fitness journey. I've lost 15kg and gained so much strength!&rdquo;
                        </p>
                        <footer className="font-mono text-sm font-semibold">
                            ~ Sarah Johnson, Trainee
                        </footer>
                    </blockquote>
                </div>
                <div className="absolute inset-0">
                    <FloatingPaths position={1} />
                    <FloatingPaths position={-1} />
                </div>
            </div>
            <div className="relative flex min-h-screen flex-col justify-center p-4">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
                >
                    <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full" />
                    <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full" />
                    <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full" />
                </div>
                <Button variant="ghost" className="absolute top-7 left-5" asChild>
                    <a href="/">
                        <ChevronLeftIcon className='size-4 me-2' />
                        Home
                    </a>
                </Button>
                <div className="mx-auto space-y-4 sm:w-sm">
                    <div className="flex items-center gap-2 lg:hidden">
                        <DumbbellIcon className="size-6 text-primary" />
                        <p className="text-xl font-semibold">FitTrack</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <h1 className="font-heading text-2xl font-bold tracking-wide">
                            {mode === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
                        </h1>
                        <p className="text-muted-foreground text-base">
                            {mode === 'login'
                                ? 'Sign in to track your progress'
                                : 'Create your account to get started'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div className="relative h-max">
                                <Input
                                    placeholder="Full Name"
                                    className="peer"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="relative h-max">
                            <Input
                                placeholder="your.email@example.com"
                                className="peer ps-9"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                <AtSignIcon className="size-4" aria-hidden="true" />
                            </div>
                        </div>

                        <div className="relative h-max">
                            <Input
                                placeholder="Password"
                                className="peer"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            <span>{loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                        </Button>
                    </form>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full" type="button">
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </Button>
                        <Button variant="outline" className="w-full" type="button">
                            <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                                <path
                                    d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.59.06 2.53.75 3.19 1.71-2.8 1.67-2.37 5.04.5 6.22-.56 1.42-1.31 2.86-2.28 5.1zm-3.85-15.06c.64-1.07 1.71-1.71 2.89-1.71.13 1.2-.34 2.37-1.07 3.24-.77.96-1.95 1.63-3.04 1.56-.17-1.2.43-2.25 1.22-3.09z"
                                />
                            </svg>
                            Apple
                        </Button>
                    </div>

                    <AuthSeparator />

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={onModeChange}
                            className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
                        >
                            {mode === 'login'
                                ? "Don't have an account? Sign up"
                                : 'Already have an account? Sign in'}
                        </button>
                    </div>

                    <p className="text-muted-foreground mt-8 text-sm">
                        By continuing, you agree to our{' '}
                        <a
                            href="#"
                            className="hover:text-primary underline underline-offset-4"
                        >
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a
                            href="#"
                            className="hover:text-primary underline underline-offset-4"
                        >
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </main>
    );
}

function FloatingPaths({ position }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position
            } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position
            } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position
            } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="pointer-events-none absolute inset-0">
            <svg
                className="h-full w-full text-slate-950 dark:text-white"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

const AuthSeparator = () => {
    return (
        <div className="flex w-full items-center justify-center">
            <div className="bg-border h-px w-full" />
            <span className="text-muted-foreground px-2 text-xs">OR</span>
            <div className="bg-border h-px w-full" />
        </div>
    );
};
