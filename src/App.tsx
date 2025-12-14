import { ThemeProvider, CssBaseline } from '@mui/material';
import { discordTheme } from './theme/discordTheme';
import Dashboard from './Dashboard';

function App() {
  return (
    <ThemeProvider theme={discordTheme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
