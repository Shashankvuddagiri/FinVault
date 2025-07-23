import React from 'react';
import ExpenseList from '../components/FinanceTracker/ExpenseList';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';

const FinanceTrackerPage = () => (
  <Stack spacing={3}>
    <Typography variant="h4" component="h1" gutterBottom>
      Personal Finance Tracker
    </Typography>
    <Card>
      <CardContent>
        <ExpenseList />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Expense
        </Button>
      </CardContent>
    </Card>
  </Stack>
);

export default FinanceTrackerPage; 