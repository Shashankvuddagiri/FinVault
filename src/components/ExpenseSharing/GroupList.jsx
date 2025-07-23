import React, { useState, useEffect } from 'react';
import {
  Box, Button, Table, Thead, Tbody, Tr, Th, Td, Input, Stack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, FormLabel, Select, IconButton, Text, InputGroup, InputLeftElement
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';

const STORAGE_KEY = 'finvault_groups';

const initialGroups = [
  {
    id: 1,
    name: 'Roommates',
    members: ['Alice', 'Bob'],
    expenses: [
      { id: 1, description: 'Pizza', amount: 20, paidBy: 'Alice' },
      { id: 2, description: 'Utilities', amount: 40, paidBy: 'Bob' },
    ],
  },
];

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [memberName, setMemberName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expense, setExpense] = useState({ description: '', amount: '', paidBy: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isExpenseOpen, onOpen: openExpense, onClose: closeExpense } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [search, setSearch] = useState('');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setGroups(JSON.parse(stored));
    else setGroups(initialGroups);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  }, [groups]);

  // Add group
  const handleAddGroup = () => {
    if (!groupName) return;
    setGroups([...groups, { id: Date.now(), name: groupName, members: [], expenses: [] }]);
    setGroupName('');
  };

  // Edit group
  const handleEditGroup = (group) => {
    setEditId(group.id);
    setEditName(group.name);
    openEdit();
  };
  const handleUpdateGroup = () => {
    setGroups(groups.map(g => g.id === editId ? { ...g, name: editName } : g));
    setEditId(null);
    setEditName('');
    closeEdit();
  };

  // Delete group
  const handleDeleteGroup = (id) => {
    setGroups(groups.filter(g => g.id !== id));
  };

  // Add member
  const handleAddMember = (groupId) => {
    if (!memberName) return;
    setGroups(groups.map(g => g.id === groupId ? { ...g, members: [...g.members, memberName] } : g));
    setMemberName('');
  };

  // Open expense modal
  const handleOpenExpense = (group) => {
    setSelectedGroup(group);
    setExpense({ description: '', amount: '', paidBy: '' });
    openExpense();
  };

  // Add expense
  const handleAddExpense = () => {
    if (!expense.description || !expense.amount || !expense.paidBy) return;
    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? { ...g, expenses: [...g.expenses, { ...expense, id: Date.now(), amount: parseFloat(expense.amount) }] }
        : g
    ));
    closeExpense();
  };

  // Calculate balances
  const getBalances = (group) => {
    const balances = {};
    group.members.forEach(m => (balances[m] = 0));
    group.expenses.forEach(e => {
      const share = e.amount / group.members.length;
      group.members.forEach(m => {
        if (m === e.paidBy) {
          balances[m] += e.amount - share;
        } else {
          balances[m] -= share;
        }
      });
    });
    return balances;
  };

  // Search/filter
  const filtered = groups.filter(group =>
    group.name.toLowerCase().includes(search.toLowerCase()) ||
    group.members.some(m => m.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={6} align="center">
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search groups or members"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Input
          placeholder="New group name"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          maxW="200px"
        />
        <Button colorScheme="teal" onClick={handleAddGroup}>Add Group</Button>
      </Stack>
      <Stack spacing={8}>
        {filtered.map(group => (
          <Box key={group.id} p={4} borderWidth={1} borderRadius="lg" boxShadow="sm" bg="gray.50">
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align="center" mb={2}>
              <Text fontWeight="bold" fontSize="lg">{group.name}</Text>
              <IconButton icon={<EditIcon />} size="sm" onClick={() => handleEditGroup(group)} aria-label="Edit group" />
              <IconButton icon={<DeleteIcon />} size="sm" onClick={() => handleDeleteGroup(group.id)} aria-label="Delete group" />
              <Input
                placeholder="Add member"
                value={memberName}
                onChange={e => setMemberName(e.target.value)}
                size="sm"
                width="auto"
              />
              <Button size="sm" onClick={() => handleAddMember(group.id)} colorScheme="blue">Add Member</Button>
              <Button size="sm" onClick={() => handleOpenExpense(group)} colorScheme="teal">Add Expense</Button>
            </Stack>
            <Box mb={2}>
              <b>Members:</b> {group.members.join(', ') || 'None'}
            </Box>
            <Table size="sm" variant="simple" mb={2}>
              <Thead>
                <Tr>
                  <Th>Description</Th>
                  <Th>Amount</Th>
                  <Th>Paid By</Th>
                </Tr>
              </Thead>
              <Tbody>
                {group.expenses.map(exp => (
                  <Tr key={exp.id}>
                    <Td>{exp.description}</Td>
                    <Td>${exp.amount.toFixed(2)}</Td>
                    <Td>{exp.paidBy}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Box mt={2}>
              <b>Balances:</b>
              <Table size="sm" variant="striped" mt={1}>
                <Thead>
                  <Tr>
                    <Th>Member</Th>
                    <Th>Balance</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(getBalances(group)).map(([member, balance]) => (
                    <Tr key={member}>
                      <Td>{member}</Td>
                      <Td color={balance < 0 ? 'red.500' : 'green.600'}>
                        {balance < 0 ? '-' : '+'}${Math.abs(balance).toFixed(2)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        ))}
      </Stack>
      {/* Edit Group Modal */}
      <Modal isOpen={isEditOpen} onClose={closeEdit} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Group Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={editName} onChange={e => setEditName(e.target.value)} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeEdit} mr={3}>Cancel</Button>
            <Button colorScheme="teal" onClick={handleUpdateGroup} disabled={!editName}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Expense Modal */}
      <Modal isOpen={isExpenseOpen} onClose={closeExpense} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Group Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Expense description"
                name="description"
                value={expense.description}
                onChange={e => setExpense({ ...expense, description: e.target.value })}
              />
              <FormLabel>Amount</FormLabel>
              <Input
                placeholder="Amount"
                name="amount"
                type="number"
                value={expense.amount}
                onChange={e => setExpense({ ...expense, amount: e.target.value })}
              />
              <FormLabel>Paid By</FormLabel>
              <Select
                placeholder="Select member"
                name="paidBy"
                value={expense.paidBy}
                onChange={e => setExpense({ ...expense, paidBy: e.target.value })}
              >
                {selectedGroup && selectedGroup.members.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </Select>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeExpense} mr={3}>Cancel</Button>
            <Button colorScheme="teal" onClick={handleAddExpense} disabled={!expense.description || !expense.amount || !expense.paidBy}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 