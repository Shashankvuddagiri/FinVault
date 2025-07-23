import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Select, MenuItem, InputLabel, FormControl, Toolbar, Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const categories = ['Email', 'Social', 'Shopping', 'Banking', 'Other'];

const STORAGE_KEY = 'finvault_passwords';

export default function PasswordList() {
  const [passwords, setPasswords] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ site: '', username: '', password: '', category: '' });
  const [show, setShow] = useState({});
  const [search, setSearch] = useState('');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setPasswords(JSON.parse(stored));
    else setPasswords([
      { id: 1, site: 'Gmail', username: 'alice@gmail.com', password: 'password123', category: 'Email' },
      { id: 2, site: 'Amazon', username: 'alice', password: 'amzpass456', category: 'Shopping' },
    ]);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
  }, [passwords]);

  const handleOpen = () => {
    setEditId(null);
    setForm({ site: '', username: '', password: '', category: '' });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setForm({ site: '', username: '', password: '', category: '' });
    setEditId(null);
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = () => {
    setPasswords([
      ...passwords,
      { id: Date.now(), ...form },
    ]);
    handleClose();
  };
  const handleEdit = (row) => {
    setEditId(row.id);
    setForm({ site: row.site, username: row.username, password: row.password, category: row.category });
    setOpen(true);
  };
  const handleUpdate = () => {
    setPasswords(passwords.map(p => p.id === editId ? { ...p, ...form } : p));
    handleClose();
  };
  const handleDelete = (id) => {
    setPasswords(passwords.filter(p => p.id !== id));
  };
  const handleToggle = (id) => setShow((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleCopy = (password) => navigator.clipboard.writeText(password);

  // Search/filter
  const filtered = passwords.filter(row =>
    row.site.toLowerCase().includes(search.toLowerCase()) ||
    row.username.toLowerCase().includes(search.toLowerCase()) ||
    row.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Toolbar sx={{ pl: 0, pr: 0, mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Passwords</Typography>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mr: 2, width: 200 }}
        />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Password
        </Button>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Site</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.site}</TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell>
                  {show[row.id] ? row.password : '••••••'}
                </TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleToggle(row.id)}>
                    {show[row.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                  <IconButton onClick={() => handleCopy(row.password)}>
                    <ContentCopyIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit Password' : 'Add Password'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Site"
              name="site"
              value={form.site}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {editId ? (
            <Button onClick={handleUpdate} variant="contained" disabled={!form.site || !form.username || !form.password || !form.category}>
              Update
            </Button>
          ) : (
            <Button onClick={handleAdd} variant="contained" disabled={!form.site || !form.username || !form.password || !form.category}>
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
} 