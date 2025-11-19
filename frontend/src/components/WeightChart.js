import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { colors } from '../theme/tokens';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${colors.subtleGray}`,
                    padding: '12px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
            >
                <Typography variant="subtitle2" color="text.secondary">
                    {label}
                </Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {payload[0].value} kg
                </Typography>
            </Box>
        );
    }
    return null;
};

const WeightChart = ({ data }) => {
    const theme = useTheme();

    return (
        <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors.deepOrange} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={colors.deepOrange} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.subtleGray} opacity={0.5} />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: colors.mediumGray, fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: colors.mediumGray, fontSize: 12 }}
                        domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="weight"
                        stroke={colors.deepOrange}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorWeight)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default WeightChart;
