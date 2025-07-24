
import React, { useState, useEffect } from 'react';
import {
  Card, CardHeader, CardContent, CardActions, Avatar, Button, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';


const STORAGE_KEY = 'finvault_groups';
const initialGroups = [
  {
    id: 1,
    name: 'Roommates',
    avatar: '',
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
  const [groupAvatar, setGroupAvatar] = useState('');
  const [memberName, setMemberName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expense, setExpense] = useState({ description: '', amount: '', paidBy: '' });
  const [open, setOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
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
    setGroups([...groups, { id: Date.now(), name: groupName, avatar: groupAvatar, members: [], expenses: [] }]);
    setGroupName('');
    setGroupAvatar('');
    setOpen(false);
  };

  // Edit group
  const handleEditGroup = (group) => {
    setEditId(group.id);
    setEditName(group.name);
    setEditAvatar(group.avatar || '');
    setOpen(true);
  };
  const handleUpdateGroup = () => {
    setGroups(groups.map(g => g.id === editId ? { ...g, name: editName, avatar: editAvatar } : g));
    setEditId(null);
    setEditName('');
    setEditAvatar('');
    setOpen(false);
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
    setExpenseOpen(true);
  };

  // WhatsApp share
  const handleShareGroup = (group) => {
    const summary = `Group: ${group.name}\nMembers: ${group.members.join(', ')}\nExpenses:\n` +
      group.expenses.map(e => `- ${e.description}: $${e.amount} (Paid by ${e.paidBy})`).join('\n');
    const url = `https://wa.me/?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank');
  };

  // Responsive card layout
  const isMobile = window.innerWidth < 600;

  // Filtered groups
  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search groups..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ width: isMobile ? '100%' : 240 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
        />
        <Button variant="contained" color="primary" onClick={() => setOpen(true)} startIcon={<GroupIcon />}>
          Add Group
        </Button>
      </Stack>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} flexWrap="wrap">
        {filteredGroups.length === 0 ? (
          <Card sx={{ minWidth: 280, p: 2, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">No groups found.</Typography>
          </Card>
        ) : filteredGroups.map(group => (
          <Card key={group.id} sx={{ minWidth: 280, maxWidth: 340, flex: '1 1 300px', mb: 2 }}>
            <CardHeader
              avatar={<Avatar src={group.avatar} alt={group.name}>{group.name[0]}</Avatar>}
              title={group.name}
              subheader={`${group.members.length} member${group.members.length !== 1 ? 's' : ''}`}
              action={
                <Tooltip title="Share on WhatsApp">
                  <IconButton onClick={() => handleShareGroup(group)} color="success">
                    <img src="https://img.icons8.com/color/24/000000/whatsapp--v1.png" alt="WhatsApp" />
                  </IconButton>
                </Tooltip>
              }
            />
            <CardContent>
              <Typography variant="subtitle2">Members:</Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1 }}>
                {group.members.map((m, i) => (
                  <Avatar key={i} sx={{ width: 28, height: 28, fontSize: 14, bgcolor: '#e0e0e0', color: '#333' }}>{m[0]}</Avatar>
                ))}
                <Tooltip title="Add member">
                  <IconButton size="small" onClick={() => setSelectedGroup(group)} color="primary">
                    <PersonAddIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Typography variant="subtitle2">Expenses:</Typography>
              {group.expenses.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No expenses yet.</Typography>
              ) : (
                <TableContainer component={Paper} sx={{ mt: 1, mb: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Paid By</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group.expenses.map(exp => (
                        <TableRow key={exp.id}>
                          <TableCell>{exp.description}</TableCell>
                          <TableCell>${exp.amount}</TableCell>
                          <TableCell>{exp.paidBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
            <CardActions>
              <Tooltip title="Edit group">
                <IconButton onClick={() => handleEditGroup(group)} color="primary"><EditIcon /></IconButton>
              </Tooltip>
              <Tooltip title="Delete group">
                <IconButton onClick={() => handleDeleteGroup(group.id)} color="error"><DeleteIcon /></IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        ))}
      </Stack>
      {/* Add/Edit Group Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? 'Edit Group' : 'Add Group'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Group Name"
              value={editId ? editName : groupName}
              onChange={e => editId ? setEditName(e.target.value) : setGroupName(e.target.value)}
              fullWidth
              autoFocus
            />
            <TextField
              label="Avatar URL (optional)"
              value={editId ? editAvatar : groupAvatar}
              onChange={e => editId ? setEditAvatar(e.target.value) : setGroupAvatar(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          {editId ? (
            <Button onClick={handleUpdateGroup} variant="contained">Update</Button>
          ) : (
            <Button onClick={handleAddGroup} variant="contained">Add</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}