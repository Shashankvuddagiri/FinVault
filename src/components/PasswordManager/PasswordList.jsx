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
  const [importOpen, setImportOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [strength, setStrength] = useState(0);

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
    setStrength(0);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setForm({ site: '', username: '', password: '', category: '' });
    setEditId(null);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'password') setStrength(getStrength(value));
  };

  // Password generator
  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let pwd = '';
    for (let i = 0; i < 14; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setForm(f => ({ ...f, password: pwd }));
    setStrength(getStrength(pwd));
  };

  // Password strength meter
  function getStrength(pwd) {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }
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

  // Export passwords (JSON, encrypted with base64 for demo)
  const handleExport = () => {
    const data = btoa(JSON.stringify(passwords));
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.finvault';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import passwords
  const handleImport = () => {
    try {
      const decoded = atob(importData.trim());
      const imported = JSON.parse(decoded);
      setPasswords(imported);
      setImportOpen(false);
      setImportData('');
    } catch {
      alert('Invalid import data.');
    }
  };

  // Responsive
  const isMobile = window.innerWidth < 600;

  return (
    <>
      <Toolbar sx={{ pl: 0, pr: 0, mb: 2, flexDirection: isMobile ? 'column' : 'row' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Passwords</Typography>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mr: 2, width: isMobile ? '100%' : 200, mb: isMobile ? 1 : 0 }}
          inputProps={{ 'aria-label': 'search passwords' }}
        />
        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mr: 2, mb: isMobile ? 1 : 0 }} aria-label="add password">
          Add Password
        </Button>
        <Button variant="outlined" color="success" onClick={handleExport} sx={{ mr: 2, mb: isMobile ? 1 : 0 }} aria-label="export passwords">
          Export
        </Button>
        <Button variant="outlined" color="info" onClick={() => setImportOpen(true)} aria-label="import passwords">
          Import
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
                  <Tooltip title={show[row.id] ? 'Hide password' : 'Show password'}>
                    <IconButton onClick={() => handleToggle(row.id)}>
                      {show[row.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy password">
                    <IconButton onClick={() => handleCopy(row.password)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(row)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No passwords found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} aria-labelledby="password-dialog-title">
        <DialogTitle id="password-dialog-title">{editId ? 'Edit Password' : 'Add Password'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Site"
              name="site"
              value={form.site}
              onChange={handleChange}
              fullWidth
              autoFocus
              inputProps={{ 'aria-label': 'site' }}
            />
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              inputProps={{ 'aria-label': 'username' }}
            />
            <Stack direction="row" alignItems="center" spacing={2}>
              <TextField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                type="text"
                fullWidth
                inputProps={{ 'aria-label': 'password' }}
              />
              <Button onClick={generatePassword} variant="outlined" color="secondary" aria-label="generate password">Generate</Button>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="caption">Strength:</Typography>
              <div style={{ width: 80, height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${strength * 20}%`, height: '100%', background: strength < 3 ? '#f44336' : strength < 4 ? '#ff9800' : '#4caf50' }} />
              </div>
              <Typography variant="caption">{['Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength]}</Typography>
            </Stack>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={form.category}
                label="Category"
                onChange={handleChange}
              >
                {categories.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} aria-label="cancel add or edit">Cancel</Button>
          {editId ? (
            <Button onClick={handleUpdate} variant="contained" aria-label="update password">Update</Button>
          ) : (
            <Button onClick={handleAdd} variant="contained" aria-label="add password">Add</Button>
          )}
        </DialogActions>
      </Dialog>
      {/* Import Dialog */}
      <Dialog open={importOpen} onClose={() => setImportOpen(false)}>
        <DialogTitle>Import Passwords</DialogTitle>
        <DialogContent>
          <TextField
            label="Paste exported data here"
            value={importData}
            onChange={e => setImportData(e.target.value)}
            fullWidth
            multiline
            minRows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportOpen(false)}>Cancel</Button>
          <Button onClick={handleImport} variant="contained">Import</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}