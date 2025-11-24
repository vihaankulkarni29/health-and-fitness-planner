import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedGradientBackground from '../components/ui/animated-gradient-background';
import { Button } from '../components/ui/button';
import {
    TrendingUpIcon,
    ActivityIcon,
    TargetIcon,
    UsersIcon,
    CheckCircleIcon,
    ArrowRightIcon
} from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-black">
            {/* Gradient Background */}
            <AnimatedGradientBackground
                Breathing={true}
                startingGap={125}
                breathingRange={8}
                animationSpeed={0.03}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 pt-32 text-center">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="inline-block mb-6"
                    >
                        <span className="px-4 py-2 text-sm font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
                            🔥 Transform Your Fitness Journey
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Track Progress.
                        <br />
                        <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
                            Achieve Goals.
                        </span>
                    </h1>

                    <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        The ultimate fitness tracking app for trainees and trainers. Monitor workouts, track health metrics, and crush your goals.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                        <Link to="/signup">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/50"
                            >
                                Start Free Trial
                                <ArrowRightIcon className="ml-2 size-5" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
                            >
                                Sign In
                            </Button>
                        </Link>
                    </div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="size-5 text-success-400" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="size-5 text-success-400" />
                            <span>Free forever</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-24 mb-16"
                >
                    <FeatureCard
                        icon={<ActivityIcon className="size-8 text-primary-400" />}
                        title="Track Workouts"
                        description="Log exercises, sets, reps, and weight with ease"
                    />
                    <FeatureCard
                        icon={<TrendingUpIcon className="size-8 text-primary-400" />}
                        title="Monitor Progress"
                        description="Visualize your fitness journey with charts"
                    />
                    <FeatureCard
                        icon={<TargetIcon className="size-8 text-primary-400" />}
                        title="Set Goals"
                        description="Define targets and crush them one by one"
                    />
                    <FeatureCard
                        icon={<UsersIcon className="size-8 text-primary-400" />}
                        title="Trainer Support"
                        description="Connect with trainers and get personalized programs"
                    />
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16 mb-24"
                >
                    <StatCard number="10K+" label="Active Users" />
                    <StatCard number="50K+" label="Workouts Logged" />
                    <StatCard number="95%" label="Goal Achievement" />
                </motion.div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300"
        >
            <div className="mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </motion.div>
    );
};

const StatCard = ({ number, label }) => {
    return (
        <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent mb-2">
                {number}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">{label}</div>
        </div>
    );
};

export default LandingPage;
