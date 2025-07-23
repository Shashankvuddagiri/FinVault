import React from 'react';
import GroupList from '../components/ExpenseSharing/GroupList';
import { Box, Heading, Button, Stack } from '@chakra-ui/react';

const ExpenseSharingPage = () => (
  <Stack spacing={6}>
    <Heading as="h1" size="xl" mb={4}>
      Expense Sharing
    </Heading>
    <Box p={6} boxShadow="md" borderRadius="lg" bg="white">
      <GroupList />
      <Button colorScheme="teal" mt={4}>
        Add Group Expense
      </Button>
    </Box>
  </Stack>
);

export default ExpenseSharingPage; 