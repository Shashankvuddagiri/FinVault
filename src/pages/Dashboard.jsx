import React from 'react';
import { Typography, Box, useTheme } from '@mui/material';

const Dashboard = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: { xs: 3, sm: 6 },
        mt: 4,
        mx: 'auto',
        maxWidth: 600,
        textAlign: 'center',
        borderRadius: 4,
        boxShadow: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Welcome to FinVault
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Select a feature from the navigation bar.
      </Typography>
    </Box>
  );
};

export default Dashboard;