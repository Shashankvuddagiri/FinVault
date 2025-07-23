import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Toolbar, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const STORAGE_KEY = 'finvault_expenses';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', amount: '' });
  const [search, setSearch] = useState('');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setExpenses(JSON.parse(stored));
    else setExpenses([
      { id: 1, name: 'Groceries', amount: 50 },
      { id: 2, name: 'Internet', amount: 30 },
    ]);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const handleOpen = () => {
    setEditId(null);
    setForm({ name: '', amount: '' });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setForm({ name: '', amount: '' });
    setEditId(null);
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = () => {
    setExpenses([
      ...expenses,
      { id: Date.now(), name: form.name, amount: parseFloat(form.amount) },
    ]);
    handleClose();
  };
  const handleEdit = (row) => {
    setEditId(row.id);
    setForm({ name: row.name, amount: row.amount });
    setOpen(true);
  };
  const handleUpdate = () => {
    setExpenses(expenses.map(e => e.id === editId ? { ...e, ...form, amount: parseFloat(form.amount) } : e));
    handleClose();
  };
  const handleDelete = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Search/filter
  const filtered = expenses.filter(row =>
    row.name.toLowerCase().includes(search.toLowerCase()) ||
    row.amount.toString().includes(search)
  );

  // Export to Excel
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(expenses.map(({ id, ...rest }) => rest));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'expenses.xlsx');
  };

  return (
    <>
      <Toolbar sx={{ pl: 0, pr: 0, mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Expenses</Typography>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mr: 2, width: 200 }}
        />
        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mr: 2 }}>
          Add Expense
        </Button>
        <Button variant="outlined" color="success" onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Amount ($)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell>{exp.name}</TableCell>
                <TableCell>{exp.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(exp)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(exp.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {editId ? (
            <Button onClick={handleUpdate} variant="contained" disabled={!form.name || !form.amount}>
              Update
            </Button>
          ) : (
            <Button onClick={handleAdd} variant="contained" disabled={!form.name || !form.amount}>
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
} 