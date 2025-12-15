import { Card, CardContent, Typography, Slider, Box, IconButton, CircularProgress } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useBatteryStore } from '../../store/useBatteryStore';

function CycleNavigator() {
  const { selectedCycle, setSelectedCycle, allCycles, isLoading } = useBatteryStore();

  // Handle empty/loading state - prevents misleading "Cycle 1 of 100"
  if (allCycles.length === 0) {
    return (
      <Card sx={{ backgroundColor: '#202225' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Cycle Navigator
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography color="text.secondary">
                No cycle data available
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Get sorted list of available cycle numbers
  const availableCycles = allCycles.map(c => c.cycle_number).sort((a, b) => a - b);
  const maxCycle = availableCycles[availableCycles.length - 1];
  const minCycle = availableCycles[0];

  // Find current cycle index in available cycles
  const currentIndex = availableCycles.indexOf(selectedCycle);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const targetCycle = newValue as number;
    // Find the closest available cycle
    const closest = availableCycles.reduce((prev, curr) =>
      Math.abs(curr - targetCycle) < Math.abs(prev - targetCycle) ? curr : prev
    );
    setSelectedCycle(closest);
  };

  const handlePrevious = () => {
    // Go to previous available cycle
    if (currentIndex > 0) {
      setSelectedCycle(availableCycles[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    // Go to next available cycle
    if (currentIndex < availableCycles.length - 1) {
      setSelectedCycle(availableCycles[currentIndex + 1]);
    }
  };

  return (
    <Card sx={{ backgroundColor: '#202225' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Cycle Navigator
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <IconButton
            onClick={handlePrevious}
            disabled={selectedCycle <= minCycle}
            sx={{
              color: 'primary.main',
              '&:disabled': {
                color: 'text.disabled',
              },
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Slider
              value={selectedCycle}
              onChange={handleSliderChange}
              min={minCycle}
              max={maxCycle}
              step={1}
              marks={[
                { value: minCycle, label: `Cycle ${minCycle}` },
                { value: maxCycle, label: `Cycle ${maxCycle}` },
              ]}
              valueLabelDisplay="on"
              valueLabelFormat={(value) => `Cycle ${value}`}
              sx={{
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#5865F2',
                  borderRadius: 1,
                  px: 1,
                },
              }}
            />
          </Box>

          <IconButton
            onClick={handleNext}
            disabled={selectedCycle >= maxCycle}
            sx={{
              color: 'primary.main',
              '&:disabled': {
                color: 'text.disabled',
              },
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 2 }}
        >
          Cycle {selectedCycle} ({currentIndex + 1} of {availableCycles.length} available cycles)
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CycleNavigator;
