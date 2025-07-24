import { createTheme } from '@mui/material/styles';

const lightPalette = {
  mode: 'light',
  primary: {
    main: '#1976d2',
  },
  secondary: {
    main: '#00bcd4',
  },
  background: {
    default: '#f4f6fa',
    paper: '#fff',
  },
  error: {
    main: '#e53935',
  },
  success: {
    main: '#43a047',
  },
};

const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#90caf9',
  },
  secondary: {
    main: '#80deea',
  },
  background: {
    default: '#18191a',
    paper: '#23272f',
  },
  error: {
    main: '#ef5350',
  },
  success: {
    main: '#66bb6a',
  },
};

export const getTheme = (mode = 'light') =>
  createTheme({
    palette: mode === 'dark' ? darkPalette : lightPalette,
    typography: {
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
      h6: { fontWeight: 700 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
    },
  });
