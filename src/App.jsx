import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Common/Navbar';
import Dashboard from './pages/Dashboard';
import FinanceTrackerPage from './pages/FinanceTrackerPage';
import ExpenseSharingPage from './pages/ExpenseSharingPage';
import PasswordManagerPage from './pages/PasswordManagerPage';
import { getTheme } from './theme';
import { useState, useMemo } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const muiTheme = createTheme(); // This line will be removed

function App() {
  const [mode, setMode] = useState('light');
  const muiTheme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <Navbar mode={mode} setMode={setMode} />
        <div style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/finance" element={<FinanceTrackerPage />} />
            <Route path="/sharing" element={<ExpenseSharingPage />} />
            <Route path="/passwords" element={<PasswordManagerPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
