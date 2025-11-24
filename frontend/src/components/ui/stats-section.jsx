import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const StatsSection = ({
    title,
    description,
    stats = [],
    className
}) => {
    return (
        <section className={cn("py-8", className)}>
            <div className="space-y-8">
                {(title || description) && (
                    <div className="relative z-10 space-y-4">
                        {title && (
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const StatCard = ({ value, label, description, trend, icon: Icon, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all duration-300"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative space-y-3">
                {/* Icon */}
                {Icon && (
                    <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="size-5 text-primary" />
                        </div>
                        {trend && (
                            <TrendBadge trend={trend} />
                        )}
                    </div>
                )}

                {/* Value */}
                <div className="space-y-1">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {value}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                        {label}
                    </div>
                    {description && (
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const TrendBadge = ({ trend }) => {
    const isPositive = trend > 0;
    const isNeutral = trend === 0;

    return (
        <div
            className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold",
                isPositive && "bg-success/10 text-success",
                isNeutral && "bg-muted text-muted-foreground",
                !isPositive && !isNeutral && "bg-error/10 text-error"
            )}
        >
            {isPositive && "↑"}
            {!isPositive && !isNeutral && "↓"}
            {Math.abs(trend)}%
        </div>
    );
};

export default StatsSection;
