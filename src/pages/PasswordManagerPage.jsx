import React from 'react';
import PasswordList from '../components/PasswordManager/PasswordList';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';

const PasswordManagerPage = () => (
  <Stack spacing={3}>
    <Typography variant="h4" component="h1" gutterBottom>
      Password Manager
    </Typography>
    <Card>
      <CardContent>
        <PasswordList />
        <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
          Add Password
        </Button>
      </CardContent>
    </Card>
  </Stack>
);

export default PasswordManagerPage; 