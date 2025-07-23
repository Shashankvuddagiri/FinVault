import React from 'react';
import { Typography } from '@mui/material';
import { Box } from '@chakra-ui/react';

const Dashboard = () => (
  <Box p={8} textAlign="center" bgGradient="linear(to-r, teal.100, blue.100)" borderRadius="xl" boxShadow="lg">
    <Typography variant="h3" component="h1" gutterBottom>
      Welcome to FinVault
    </Typography>
    <Typography variant="h6" color="text.secondary">
      Select a feature from the navigation bar.
    </Typography>
  </Box>
);

export default Dashboard; 