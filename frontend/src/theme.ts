import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1B5DE0'
    },
    secondary: {
      main: '#FF6B3D'
    },
    background: {
      default: '#0B1020',
      paper: '#111729'
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#9CA3AF'
    }
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(148, 163, 184, 0.25)',
          backgroundImage: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(15,23,42,0.98))'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20
        }
      }
    }
  }
});


