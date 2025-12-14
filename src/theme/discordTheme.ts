import { createTheme } from '@mui/material/styles';

// Discord-inspired dark theme
export const discordTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5865F2', // Discord blurple
      light: '#7289da',
      dark: '#4752c4',
    },
    secondary: {
      main: '#3ba55d', // Success green
      light: '#43b581',
      dark: '#2d7d46',
    },
    background: {
      default: '#36393f', // Main background
      paper: '#202225', // Card background
    },
    text: {
      primary: '#dcddde', // Primary text
      secondary: '#b9bbbe', // Secondary text
    },
    error: {
      main: '#ed4245', // Danger/error red
      light: '#f04747',
      dark: '#c03537',
    },
    warning: {
      main: '#faa61a', // Warning amber
      light: '#fbb360',
      dark: '#f89b0e',
    },
    success: {
      main: '#3ba55d', // Success green
      light: '#43b581',
      dark: '#2d7d46',
    },
    info: {
      main: '#5865F2',
      light: '#7289da',
      dark: '#4752c4',
    },
    divider: '#202225',
  },
  shape: {
    borderRadius: 8, // Rounded corners
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#dcddde',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#dcddde',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#dcddde',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#dcddde',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#dcddde',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#dcddde',
    },
    body1: {
      color: '#dcddde',
    },
    body2: {
      color: '#b9bbbe',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#202225',
          backgroundImage: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(88, 101, 242, 0.4)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2f3136', // Sidebar background
          borderRight: 'none',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardWarning: {
          backgroundColor: '#faa61a20',
          color: '#faa61a',
          border: '1px solid #faa61a40',
        },
        standardError: {
          backgroundColor: '#ed424520',
          color: '#ed4245',
          border: '1px solid #ed424540',
        },
        standardSuccess: {
          backgroundColor: '#3ba55d20',
          color: '#3ba55d',
          border: '1px solid #3ba55d40',
        },
        standardInfo: {
          backgroundColor: '#5865F220',
          color: '#5865F2',
          border: '1px solid #5865F240',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#5865F2',
        },
        thumb: {
          '&:hover': {
            boxShadow: '0 0 0 8px rgba(88, 101, 242, 0.16)',
          },
        },
      },
    },
  },
});

export default discordTheme;
