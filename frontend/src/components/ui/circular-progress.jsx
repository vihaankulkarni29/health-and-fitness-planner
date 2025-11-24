import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CircularProgress = ({
    value,
    max,
    size = 200,
    strokeWidth = 20,
    label,
    unit,
    color = 'primary',
    className
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = (value / max) * 100;
    const offset = circumference - (percentage / 100) * circumference;

    const colorMap = {
        primary: '#CD1C18',
        success: '#10B981',
        warning: '#F59E0B',
        info: '#3B82F6',
    };

    const selectedColor = colorMap[color] || colorMap.primary;

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-muted/20"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={selectedColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold" style={{ color: selectedColor }}>
                    {value}
                    <span className="text-2xl ml-1">{unit}</span>
                </div>
                {label && (
                    <div className="text-sm text-muted-foreground mt-1">{label}</div>
                )}
            </div>
        </div>
    );
};

export default CircularProgress;
