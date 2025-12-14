// TypeScript interfaces for battery analytics data

export interface CycleSnapshot {
  imei: string;
  cycle_number: number;
  cycle_start_time: string; // ISO 8601 timestamp
  cycle_end_time: string; // ISO 8601 timestamp
  cycle_duration_hours: number;
  soh_drop: number; // Percentage
  average_soc: number; // State of Charge percentage
  min_soc: number;
  max_soc: number;
  average_temperature: number; // Celsius
  temperature_dist_5deg: Record<string, number>; // e.g., {"20-25": 10.5}
  temperature_dist_10deg: Record<string, number>;
  temperature_dist_15deg: Record<string, number>;
  temperature_dist_20deg: Record<string, number>;
  total_distance: number; // Kilometers
  average_speed: number; // km/h
  max_speed: number; // km/h
  charging_instances_count: number;
  average_charge_start_soc: number; // Percentage
  voltage_avg: number; // Volts
  voltage_min: number; // Volts
  voltage_max: number; // Volts
  alert_details: {
    warnings: string[];
    protections: string[];
  };
}

export interface BatterySummary {
  imei: string;
  total_cycles: number;
  average_health?: number;
  last_cycle?: number;
  // Add other summary fields as needed based on API response
}

export interface BatterySummaryResponse {
  batteries?: BatterySummary[];
  summary?: BatterySummary[];
  data?: BatterySummary[];
}

export type TemperatureSamplingRate = 5 | 10 | 15 | 20;

export interface TemperatureDistributionData {
  range: string;
  value: number;
}

// Utility types for chart data
export interface ChartDataPoint {
  x: number | string;
  y: number;
}

export interface SOCData {
  min: number;
  max: number;
  average: number;
}

export interface TrendDataPoint {
  cycle: number;
  value: number;
  timestamp?: string;
}
