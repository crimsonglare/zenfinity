import { Grid } from '@mui/material';
import MetricCard from '../common/MetricCard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useBatteryStore } from '../../store/useBatteryStore';
import { formatDateTime, formatDurationCompact } from '../../utils/dateUtils';

function CycleStatistics() {
  const { currentCycleData } = useBatteryStore();

  if (!currentCycleData) {
    return null;
  }

  const {
    cycle_number,
    cycle_start_time,
    cycle_end_time,
    cycle_duration_hours,
    soh_drop,
  } = currentCycleData;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} {...({} as any)}>
        <MetricCard
          title="Cycle Number"
          value={cycle_number}
          icon={<AccessTimeIcon />}
          color="#5865F2"
        />
      </Grid>

      <Grid item xs={12} sm={6} {...({} as any)}>
        <MetricCard
          title="Duration"
          value={formatDurationCompact(cycle_duration_hours)}
          icon={<TimerIcon />}
          color="#3ba55d"
          subtitle={`${cycle_duration_hours.toFixed(2)} hours`}
        />
      </Grid>

      <Grid item xs={12} sm={6} {...({} as any)}>
        <MetricCard
          title="Start Time"
          value={formatDateTime(cycle_start_time)}
          icon={<CalendarTodayIcon />}
          color="#7289da"
        />
      </Grid>

      <Grid item xs={12} sm={6} {...({} as any)}>
        <MetricCard
          title="End Time"
          value={formatDateTime(cycle_end_time)}
          icon={<CalendarTodayIcon />}
          color="#7289da"
        />
      </Grid>

      <Grid item xs={12} {...({} as any)}>
        <MetricCard
          title="SOH Drop"
          value={soh_drop.toFixed(2)}
          unit="%"
          icon={<TrendingDownIcon />}
          color={soh_drop > 1 ? '#ed4245' : '#3ba55d'}
          subtitle={soh_drop > 1 ? 'High degradation' : 'Normal degradation'}
        />
      </Grid>
    </Grid>
  );
}

export default CycleStatistics;
