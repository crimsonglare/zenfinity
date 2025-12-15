import { useEffect } from 'react';
import { Box, Container, Typography, AppBar, Toolbar, CircularProgress, Card, CardContent, Grid } from '@mui/material';
import Sidebar from './components/dashboard/Sidebar';
import CycleNavigator from './components/dashboard/CycleNavigator';
import CycleStatistics from './components/dashboard/CycleStatistics';
import PerformanceMetrics from './components/dashboard/PerformanceMetrics';
import AlertsPanel from './components/dashboard/AlertsPanel';
import ChargingInsights from './components/dashboard/ChargingInsights';
import BatteryHealth from './components/dashboard/BatteryHealth';
import TemperatureDistribution from './components/dashboard/TemperatureDistribution';
import LongTermTrends from './components/dashboard/LongTermTrends';
import { useBatteryStore } from './store/useBatteryStore';

const DRAWER_WIDTH = 240;

function Dashboard() {
  const { currentCycleData, isLoading, error, fetchSummary, fetchAllCycles, selectedIMEI } = useBatteryStore();

  // Effect 1: Load summary once on mount
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Effect 2: Load cycles when battery changes
  useEffect(() => {
    if (selectedIMEI) {
      fetchAllCycles(selectedIMEI);
    }
  }, [selectedIMEI, fetchAllCycles]);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar drawerWidth={DRAWER_WIDTH} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: `${DRAWER_WIDTH}px`,
          minHeight: '100vh',
        }}
      >
        {/* App Bar / Header */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: '#202225',
            boxShadow: 'none',
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Toolbar>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              Battery Analytics Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Error Display */}
        {error && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#ed424520', color: '#ed4245', borderRadius: 2, border: '1px solid #ed424540' }}>
            <Typography>{error}</Typography>
          </Box>
        )}

        {/* Loading State */}
        {isLoading && !currentCycleData && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        )}

        {/* Main Content Area */}
        {!isLoading && currentCycleData && (
          <Container maxWidth="xl">
            <Grid container spacing={3}>
              {/* Cycle Navigator */}
              <Grid item xs={12} {...({} as any)}>
                <CycleNavigator />
              </Grid>

              {/* Row 1: Cycle Statistics + Alerts */}
              <Grid item xs={12} md={6} {...({} as any)}>
                <Card sx={{ backgroundColor: '#202225', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Cycle Statistics
                    </Typography>
                    <CycleStatistics />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} {...({} as any)}>
                <AlertsPanel />
              </Grid>

              {/* Row 2: Performance Metrics + Charging Insights */}
              <Grid item xs={12} md={6} {...({} as any)}>
                <Card sx={{ backgroundColor: '#202225', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Performance Metrics
                    </Typography>
                    <PerformanceMetrics />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} {...({} as any)}>
                <Card sx={{ backgroundColor: '#202225', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Charging Insights
                    </Typography>
                    <ChargingInsights />
                  </CardContent>
                </Card>
              </Grid>

              {/* Row 3: Battery Health */}
              <Grid item xs={12} {...({} as any)}>
                <BatteryHealth />
              </Grid>

              {/* Row 4: Temperature Distribution */}
              <Grid item xs={12} {...({} as any)}>
                <TemperatureDistribution />
              </Grid>

              {/* Row 5: Long-term Trends (Bonus) */}
              <Grid item xs={12} {...({} as any)}>
                <LongTermTrends />
              </Grid>
            </Grid>
          </Container>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;
