import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { glass, radii, spacing, gradients } from '../theme/tokens';

const MotionBox = motion(Box);

const StatsCard = ({
    title,
    value,
    trend,
    trendLabel,
    icon,
    color = 'primary',
    delay = 0
}) => {
    const isPositive = trend === 'up';
    const trendColor = isPositive ? '#4CAF50' : '#F44336'; // Success Green or Error Red

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            sx={{
                ...glass.light,
                borderRadius: radii.xl,
                padding: spacing.lg,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 140,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.15)',
                },
            }}
        >
            {/* Background Gradient Blob for subtle color */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: gradients[color] || gradients.primary,
                    opacity: 0.15,
                    filter: 'blur(30px)',
                    zIndex: 0,
                }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="500" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="800" sx={{ color: 'text.primary' }}>
                        {value}
                    </Typography>
                </Box>
                {icon && (
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: radii.lg,
                            background: 'rgba(255,255,255,0.5)',
                            color: 'text.primary',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {icon}
                    </Box>
                )}
            </Box>

            {(trend || trendLabel) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, zIndex: 1 }}>
                    {trend && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: trendColor,
                                bgcolor: isPositive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                px: 0.8,
                                py: 0.4,
                                borderRadius: radii.md,
                            }}
                        >
                            {isPositive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                            <Typography variant="caption" fontWeight="700" sx={{ ml: 0.5 }}>
                                {trendLabel}
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}
        </MotionBox>
    );
};

export default StatsCard;
