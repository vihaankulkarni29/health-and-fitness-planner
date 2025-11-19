import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { glass, radii, spacing } from '../theme/tokens';

const MotionBox = motion(Box);

const GlassCard = ({ children, title, subtitle, delay = 0, ...props }) => {
    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            sx={{
                ...glass.light,
                borderRadius: radii.xl,
                padding: spacing.lg,
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.15)',
                },
                ...props.sx
            }}
            {...props}
        >
            {(title || subtitle) && (
                <Box mb={spacing.md}>
                    {title && (
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            {title}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            )}
            {children}
        </MotionBox>
    );
};

export default GlassCard;
