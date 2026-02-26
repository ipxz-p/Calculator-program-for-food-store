'use client';
import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  palette: {
    primary: {
      main: '#1f77df',
      dark: '#194395',
      light: '#E5F5FF',
    },
    error: {
      main: '#FC2A2A',
      dark: '#FF1603',
      light: '#fff5f5',
    },
    text: {
      primary: '#465969',
      secondary: '#7a8fa2',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    divider: '#e5e7eb',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
  },
});

export default theme;