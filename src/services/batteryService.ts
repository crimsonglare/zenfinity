import api from './api';
import { BatterySummaryResponse, CycleSnapshot } from '../types/battery.types';

// Battery API service
export const batteryService = {
  /**
   * Get summary list of all accessible batteries
   * @param imei - Optional IMEI filter
   */
  getSummary: async (imei?: string) => {
    const params = imei ? { imei } : {};
    return api.get<BatterySummaryResponse>('/api/snapshots/summary', { params });
  },

  /**
   * Retrieve a list of cycle snapshots for a specific battery
   * @param imei - Battery IMEI (required)
   * @param limit - Number of records to fetch (default 100)
   * @param offset - Offset for pagination (default 0)
   */
  getCycles: async (imei: string, limit = 100, offset = 0) => {
    return api.get<CycleSnapshot[]>('/api/snapshots', {
      params: { imei, limit, offset },
    });
  },

  /**
   * Get the single most recent cycle snapshot for a battery
   * @param imei - Battery IMEI
   */
  getLatestCycle: async (imei: string) => {
    return api.get<CycleSnapshot>(`/api/snapshots/${imei}/latest`);
  },

  /**
   * Get detailed analytics for a specific cycle number
   * @param imei - Battery IMEI
   * @param cycleNumber - Cycle number
   */
  getCycleDetails: async (imei: string, cycleNumber: number) => {
    return api.get<CycleSnapshot>(`/api/snapshots/${imei}/cycles/${cycleNumber}`);
  },
};

export default batteryService;
