import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import CircularProgress from '../components/ui/circular-progress';
import StatsSection from '../components/ui/stats-section';
import AppLayout from '../components/AppLayout';
import useCurrentUser from '../hooks/useCurrentUser';
import {
    ScaleIcon,
    ActivityIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    CalendarIcon,
    TargetIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data - replace with real API calls
const MOCK_HEALTH_DATA = {
    currentWeight: 78,
    targetWeight: 75,
    startWeight: 82,
    bodyFat: 18,
    muscleMass: 65,
    weeklyProgress: [
        { week: 'Week 1', weight: 82 },
        { week: 'Week 2', weight: 81.5 },
        { week: 'Week 3', weight: 81 },
        { week: 'Week 4', weight: 80 },
        { week: 'Week 5', weight: 79 },
        { week: 'Week 6', weight: 78 },
    ]
};

const HealthMetricsPage = ({ toggleTheme, mode }) => {
    const { user, loading: userLoading } = useCurrentUser();
    const [healthData, setHealthData] = useState(MOCK_HEALTH_DATA);

    const weightLost = healthData.startWeight - healthData.currentWeight;
    const weightToGo = healthData.currentWeight - healthData.targetWeight;
    const progressPercentage = ((weightLost / (healthData.startWeight - healthData.targetWeight)) * 100).toFixed(0);

    return (
        <AppLayout user={user} mode={mode} toggleTheme={toggleTheme}>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent mb-2">
                        Health Metrics
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Track your body composition and progress
                    </p>
                </motion.div>

                {/* Stats Overview */}
                <StatsSection
                    stats={[
                        {
                            value: `${weightLost.toFixed(1)}kg`,
                            label: 'Weight Lost',
                            description: 'Since you started',
                            icon: TrendingDownIcon,
                            trend: -((weightLost / healthData.startWeight) * 100).toFixed(0)
                        },
                        {
                            value: `${weightToGo.toFixed(1)}kg`,
                            label: 'To Goal',
                            description: 'Keep pushing!',
                            icon: TargetIcon,
                        },
                        {
                            value: `${progressPercentage}%`,
                            label: 'Progress',
                            description: 'Of your goal',
                            icon: TrendingUpIcon,
                            trend: parseInt(progressPercentage)
                        }
                    ]}
                />

                {/* Main Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Weight Card */}
                    <MetricCard
                        title="Current Weight"
                        delay={0.1}
                    >
                        <CircularProgress
                            value={healthData.currentWeight}
                            max={healthData.startWeight}
                            label="Current Weight"
                            unit="kg"
                            color="primary"
                            size={200}
                        />
                        <div className="mt-4 space-y-2">
                            <MetricRow label="Start Weight" value={`${healthData.startWeight} kg`} />
                            <MetricRow label="Target Weight" value={`${healthData.targetWeight} kg`} />
                        </div>
                    </MetricCard>

                    {/* Body Fat Card */}
                    <MetricCard
                        title="Body Fat %"
                        delay={0.2}
                    >
                        <CircularProgress
                            value={healthData.bodyFat}
                            max={30}
                            label="Body Fat"
                            unit="%"
                            color="warning"
                            size={200}
                        />
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Category</span>
                                <span className="font-semibold text-success">Athletic</span>
                            </div>
                        </div>
                    </MetricCard>

                    {/* Muscle Mass Card */}
                    <MetricCard
                        title="Muscle Mass"
                        delay={0.3}
                    >
                        <CircularProgress
                            value={healthData.muscleMass}
                            max={80}
                            label="Muscle Mass"
                            unit="kg"
                            color="success"
                            size={200}
                        />
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Trend</span>
                                <span className="font-semibold text-success flex items-center gap-1">
                                    <TrendingUpIcon className="size-4" />
                                    +2.5%
                                </span>
                            </div>
                        </div>
                    </MetricCard>
                </div>

                {/* Weekly Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="size-5 text-primary" />
                            Weekly Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {healthData.weeklyProgress.map((week, index) => (
                                <WeeklyProgressBar
                                    key={week.week}
                                    week={week.week}
                                    weight={week.weight}
                                    maxWeight={healthData.startWeight}
                                    index={index}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tips Section */}
                <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-primary">💡 Health Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Weigh yourself at the same time each day for consistency</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Track body measurements alongside weight for better insights</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Aim for 0.5-1kg weight loss per week for sustainable results</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

const MetricCard = ({ title, children, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card className="hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    {children}
                </CardContent>
            </Card>
        </motion.div>
    );
};

const MetricRow = ({ label, value }) => {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    );
};

const WeeklyProgressBar = ({ week, weight, maxWeight, index }) => {
    const percentage = (weight / maxWeight) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="space-y-2"
        >
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{week}</span>
                <span className="text-muted-foreground">{weight} kg</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                />
            </div>
        </motion.div>
    );
};

export default HealthMetricsPage;
