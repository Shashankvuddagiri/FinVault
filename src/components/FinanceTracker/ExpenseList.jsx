import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Toolbar, Typography, TableSortLabel, TableFooter, TablePagination, InputAdornment, Alert } from '@mui/material';
import TablePaginationActions from './TablePaginationActions.jsx';
import ExpenseChart from './ExpenseChart.jsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const STORAGE_KEY = 'finvault_expenses';

// Validation helpers
const validateName = (name) => name.trim().length > 0;
const validateAmount = (amount) => !isNaN(amount) && parseFloat(amount) > 0;

export default function ExpenseList() {
  // Removed loading state
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', amount: '' });
  const [formError, setFormError] = useState({ name: '', amount: '' });
  const [showAlert, setShowAlert] = useState('');
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    let error = { name: '', amount: '' };
    if (!validateName(form.name)) error.name = 'Name is required.';
    if (!validateAmount(form.amount)) error.amount = 'Amount must be greater than 0.';
    setFormError(error);
    if (error.name || error.amount) return;
    setExpenses([
      ...expenses,
      { id: Date.now(), name: form.name, amount: parseFloat(form.amount) },
    ]);
    setShowAlert('Expense added successfully!');
    handleClose();
  };
  const handleEdit = (row) => {
    setEditId(row.id);
    setForm({ name: row.name, amount: row.amount });
    setOpen(true);
  };
  const handleUpdate = () => {
    let error = { name: '', amount: '' };
    if (!validateName(form.name)) error.name = 'Name is required.';
    if (!validateAmount(form.amount)) error.amount = 'Amount must be greater than 0.';
    setFormError(error);
    if (error.name || error.amount) return;
    setExpenses(expenses.map(e => e.id === editId ? { ...e, ...form, amount: parseFloat(form.amount) } : e));
    setShowAlert('Expense updated successfully!');
    handleClose();
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
    setShowAlert('Expense deleted.');
  };

  // Export to Excel
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(expenses.map(({ id, ...rest }) => rest));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'expenses.xlsx');
  };

  // Search/filter
  const filtered = expenses.filter(row =>
    row.name.toLowerCase().includes(search.toLowerCase()) ||
    row.amount.toString().includes(search)
  );

  // Sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const sorted = filtered.slice().sort((a, b) => {
    if (orderBy === 'amount') {
      return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else {
      return order === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
  });

  // Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginated = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <ExpenseChart data={expenses} />
      {showAlert && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setShowAlert('')}>
          {showAlert}
        </Alert>
      )}
      <Toolbar sx={{ pl: 0, pr: 0, mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Expenses</Typography>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mr: 2, width: 200 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
          }}
          inputProps={{ 'aria-label': 'search expenses' }}
        />
        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mr: 2 }} aria-label="add expense">
          Add Expense
        </Button>
        <Button variant="outlined" color="success" onClick={handleDownloadExcel} aria-label="download expenses as excel">
          Download Excel
        </Button>
      </Toolbar>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table size="small" aria-label="expenses table">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === 'name' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                  aria-label="sort by name"
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'amount' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderBy === 'amount' ? order : 'asc'}
                  onClick={() => handleRequestSort('amount')}
                  aria-label="sort by amount"
                >
                  Amount ($)
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((exp) => (
              <TableRow key={exp.id} tabIndex={0} aria-label={`expense ${exp.name} amount ${exp.amount}`}> 
                <TableCell>{exp.name}</TableCell>
                <TableCell>{exp.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(exp)} aria-label={`edit ${exp.name}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(exp.id)} aria-label={`delete ${exp.name}`}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No expenses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={3}
                count={sorted.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                labelRowsPerPage="Rows per page:"
                aria-label="pagination"
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} aria-labelledby="expense-dialog-title">
        <DialogTitle id="expense-dialog-title">{editId ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              error={!!formError.name}
              helperText={formError.name}
              autoFocus
              inputProps={{ 'aria-label': 'expense name' }}
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              fullWidth
              error={!!formError.amount}
              helperText={formError.amount}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ 'aria-label': 'expense amount', min: 0, step: 0.01 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} aria-label="cancel add or edit">Cancel</Button>
          {editId ? (
            <Button onClick={handleUpdate} variant="contained" aria-label="update expense">
              Update
            </Button>
          ) : (
            <Button onClick={handleAdd} variant="contained" aria-label="add expense">
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
