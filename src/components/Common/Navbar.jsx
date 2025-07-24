import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupIcon from '@mui/icons-material/Group';
import LockIcon from '@mui/icons-material/Lock';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/finance', label: 'Finance Tracker', icon: <AccountBalanceWalletIcon /> },
  { to: '/sharing', label: 'Expense Sharing', icon: <GroupIcon /> },
  { to: '/passwords', label: 'Password Manager', icon: <LockIcon /> },
];

const Navbar = ({ mode, setMode }) => {
  const location = useLocation();
  return (
    <AppBar position="static" color="default" elevation={2} sx={{ mb: 4 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: location.pathname === link.to ? '#1976d2' : 'inherit',
                textDecoration: 'none',
                fontWeight: location.pathname === link.to ? 700 : 500,
                fontSize: 16,
                padding: '0.5rem 1rem',
                borderRadius: 8,
                background: location.pathname === link.to ? 'rgba(25, 118, 210, 0.08)' : 'none',
                transition: 'background 0.2s',
              }}
            >
              {link.icon}
              <span style={{ marginLeft: 8 }}>{link.label}</span>
            </Link>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;