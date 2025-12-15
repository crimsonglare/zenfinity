import { create } from 'zustand';
import { batteryService } from '../services/batteryService';
import { CycleSnapshot, BatterySummary, TemperatureSamplingRate } from '../types/battery.types';

interface BatteryStore {
  // State
  selectedIMEI: string;
  selectedCycle: number;
  summary: BatterySummary[];
  currentCycleData: CycleSnapshot | null;
  allCycles: CycleSnapshot[];
  isLoading: boolean;
  error: string | null;
  temperatureSamplingRate: TemperatureSamplingRate;

  // Actions
  setSelectedIMEI: (imei: string) => void;
  setSelectedCycle: (cycle: number) => void;
  setTemperatureSamplingRate: (rate: TemperatureSamplingRate) => void;
  fetchSummary: () => Promise<void>;
  fetchCycleData: (imei: string, cycle: number) => Promise<void>;
  fetchAllCycles: (imei: string) => Promise<void>;
  resetError: () => void;
}

// Authorized IMEIs
export const AUTHORIZED_IMEIS = ['865044073967657', '865044073949366'];

export const useBatteryStore = create<BatteryStore>((set, get) => ({
  // Initial state
  selectedIMEI: AUTHORIZED_IMEIS[0],
  selectedCycle: 1,
  summary: [],
  currentCycleData: null,
  allCycles: [],
  isLoading: false,
  error: null,
  temperatureSamplingRate: 5,

  // Actions
  setSelectedIMEI: async (imei) => {
    // Clear state immediately for clean transition
    set({
      selectedIMEI: imei,
      currentCycleData: null,
      allCycles: [],
      isLoading: true,
      error: null
    });

    try {
      // Step 1: Fetch all cycles for this battery
      await get().fetchAllCycles(imei);

      // Step 2: Get the cycles from state
      const cycles = get().allCycles;

      if (cycles.length > 0) {
        // Step 3: Find the first available cycle
        const firstCycle = Math.min(...cycles.map(c => c.cycle_number));
        set({ selectedCycle: firstCycle });

        // Step 4: Fetch data for the first cycle (SINGLE FETCH)
        await get().fetchCycleData(imei, firstCycle);
      } else {
        // No cycles available for this battery
        set({
          error: `No cycle data available for battery ${imei}`,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error switching battery:', error);
      set({
        error: `Failed to load battery ${imei}`,
        isLoading: false
      });
    }
  },

  setSelectedCycle: (cycle) => {
    set({ selectedCycle: cycle });
    get().fetchCycleData(get().selectedIMEI, cycle);
  },

  setTemperatureSamplingRate: (rate) => {
    set({ temperatureSamplingRate: rate });
  },

  resetError: () => {
    set({ error: null });
  },

  fetchSummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await batteryService.getSummary();
      const summaryData = response.data.summary || response.data.batteries || [];
      set({
        summary: summaryData,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      set({
        error: 'Failed to fetch battery summary. Please try again.',
        isLoading: false
      });
    }
  },

  fetchCycleData: async (imei, cycle) => {
    set({ isLoading: true, error: null });
    try {
      const response = await batteryService.getCycleDetails(imei, cycle);
      // Handle nested data structure from API
      const cycleData = (response.data as any).data || response.data;
      set({
        currentCycleData: cycleData as CycleSnapshot,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch cycle data:', error);
      set({
        error: `Failed to fetch data for cycle ${cycle}. Please try again.`,
        isLoading: false,
        currentCycleData: null,
      });
    }
  },

  fetchAllCycles: async (imei) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch a large number of cycles (adjust limit as needed)
      const response = await batteryService.getCycles(imei, 1000);

      // API returns { success: true, data: [...], count: X } or array directly
      const cyclesData = (response.data as any).data || (Array.isArray(response.data) ? response.data : []);
      const cycles = cyclesData as CycleSnapshot[];

      set({
        allCycles: cycles,
        isLoading: false
      });

      // The setSelectedIMEI function will handle cycle selection
    } catch (error) {
      console.error('Failed to fetch all cycles:', error);
      set({
        error: `Failed to fetch cycle history for battery ${imei}.`,
        allCycles: [],
        isLoading: false
      });
    }
  },
}));

export default useBatteryStore;
