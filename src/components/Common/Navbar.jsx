import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ padding: '1rem', background: '#282c34', color: 'white' }}>
    <Link to="/" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>Dashboard</Link>
    <Link to="/finance" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>Finance Tracker</Link>
    <Link to="/sharing" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>Expense Sharing</Link>
    <Link to="/passwords" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>Password Manager</Link>
  </nav>
);

export default Navbar; 