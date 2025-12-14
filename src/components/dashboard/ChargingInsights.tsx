import { Grid } from '@mui/material';
import MetricCard from '../common/MetricCard';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import BoltIcon from '@mui/icons-material/Bolt';
import { useBatteryStore } from '../../store/useBatteryStore';

function ChargingInsights() {
  const { currentCycleData } = useBatteryStore();

  if (!currentCycleData) {
    return null;
  }

  const { charging_instances_count, average_charge_start_soc } = currentCycleData;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} {...({} as any)}>
        <MetricCard
          title="Charging Instances"
          value={charging_instances_count}
          icon={<BatteryChargingFullIcon />}
          color="#5865F2"
          subtitle={charging_instances_count === 1 ? '1 charging event' : `${charging_instances_count} charging events`}
        />
      </Grid>

      <Grid item xs={12} {...({} as any)}>
        <MetricCard
          title="Avg. Charge Start SOC"
          value={average_charge_start_soc.toFixed(1)}
          unit="%"
          icon={<BoltIcon />}
          color={average_charge_start_soc < 20 ? '#ed4245' : average_charge_start_soc < 40 ? '#faa61a' : '#3ba55d'}
          subtitle={
            average_charge_start_soc < 20
              ? 'Frequent deep discharges'
              : average_charge_start_soc < 40
              ? 'Moderate discharge'
              : 'Healthy charging pattern'
          }
        />
      </Grid>
    </Grid>
  );
}

export default ChargingInsights;
