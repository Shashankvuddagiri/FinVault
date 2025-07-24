import React from 'react';
import { Paper, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#1976d2', '#00bcd4', '#43a047', '#e53935', '#ffb300', '#8e24aa', '#3949ab'];

export default function ExpenseChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 2, mb: 2, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1">No expense data to display.</Typography>
      </Paper>
    );
  }

  // Group by name and sum amounts
  const grouped = Object.values(
    data.reduce((acc, curr) => {
      acc[curr.name] = acc[curr.name] || { name: curr.name, value: 0 };
      acc[curr.name].value += Number(curr.amount);
      return acc;
    }, {})
  );

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Expense Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={grouped}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {grouped.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}
