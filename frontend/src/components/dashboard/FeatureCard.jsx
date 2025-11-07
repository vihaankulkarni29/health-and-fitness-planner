import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card
      elevation={3}
      role="article"
      sx={{
        height: '100%',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
      }}
    >
      <CardContent>
        <Box sx={{ mb: 1 }}>{icon}</Box>
        <Typography variant="h6" component="h3" sx={{ mb: 0.5, fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
