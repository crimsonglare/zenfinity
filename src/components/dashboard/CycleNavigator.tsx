import { Card, CardContent, Typography, Slider, Box, IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useBatteryStore } from '../../store/useBatteryStore';

function CycleNavigator() {
  const { selectedCycle, setSelectedCycle, allCycles } = useBatteryStore();

  const maxCycle = allCycles.length > 0 ? Math.max(...allCycles.map(c => c.cycle_number)) : 100;
  const minCycle = allCycles.length > 0 ? Math.min(...allCycles.map(c => c.cycle_number)) : 1;

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setSelectedCycle(newValue as number);
  };

  const handlePrevious = () => {
    if (selectedCycle > minCycle) {
      setSelectedCycle(selectedCycle - 1);
    }
  };

  const handleNext = () => {
    if (selectedCycle < maxCycle) {
      setSelectedCycle(selectedCycle + 1);
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
          Cycle {selectedCycle} of {maxCycle}
          {allCycles.length > 0 && ` (${allCycles.length} cycles loaded)`}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CycleNavigator;
