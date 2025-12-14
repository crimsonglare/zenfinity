import { Grid } from '@mui/material';
import MetricCard from '../common/MetricCard';
import SpeedIcon from '@mui/icons-material/Speed';
import RouteIcon from '@mui/icons-material/Route';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useBatteryStore } from '../../store/useBatteryStore';

function PerformanceMetrics() {
  const { currentCycleData } = useBatteryStore();

  if (!currentCycleData) {
    return null;
  }

  const { average_speed, total_distance, max_speed } = currentCycleData;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} {...({} as any)}>
        <MetricCard
          title="Average Speed"
          value={average_speed.toFixed(1)}
          unit="km/h"
          icon={<SpeedIcon />}
          color="#5865F2"
        />
      </Grid>

      <Grid item xs={12} {...({} as any)}>
        <MetricCard
          title="Total Distance"
          value={total_distance.toFixed(2)}
          unit="km"
          icon={<RouteIcon />}
          color="#3ba55d"
          subtitle={total_distance > 0 ? `${(total_distance * 0.621371).toFixed(2)} miles` : 'No data'}
        />
      </Grid>

      <Grid item xs={12} {...({} as any)}>
        <MetricCard
          title="Max Speed"
          value={max_speed.toFixed(1)}
          unit="km/h"
          icon={<TrendingUpIcon />}
          color="#faa61a"
          subtitle={max_speed > 0 ? `${(max_speed * 0.621371).toFixed(1)} mph` : 'No data'}
        />
      </Grid>
    </Grid>
  );
}

export default PerformanceMetrics;
