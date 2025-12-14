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
    set({ selectedIMEI: imei, currentCycleData: null });
    // First fetch all cycles to get the actual cycle numbers
    await get().fetchAllCycles(imei);
    // Then set the selected cycle to the first available cycle
    const cycles = get().allCycles;
    if (cycles.length > 0) {
      const firstCycle = Math.min(...cycles.map(c => c.cycle_number));
      set({ selectedCycle: firstCycle });
      // Fetch data for the first cycle
      get().fetchCycleData(imei, firstCycle);
    } else {
      // Fallback if no cycles found
      set({ selectedCycle: 1 });
      get().fetchCycleData(imei, 1);
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
    set({ error: null });
    try {
      // Fetch a large number of cycles (adjust limit as needed)
      const response = await batteryService.getCycles(imei, 1000);
      // API returns { success: true, data: [...], count: X } or array directly
      const cyclesData = (response.data as any).data || (Array.isArray(response.data) ? response.data : []);
      const cycles = cyclesData as CycleSnapshot[];
      set({
        allCycles: cycles
      });
      
      // If no cycle is selected yet, or selected cycle doesn't exist, set to first available
      const currentCycle = get().selectedCycle;
      if (cycles.length > 0) {
        const cycleNumbers = cycles.map(c => c.cycle_number);
        const minCycle = Math.min(...cycleNumbers);
        
        // If current cycle is not in the available cycles, set to first cycle
        if (!cycleNumbers.includes(currentCycle)) {
          set({ selectedCycle: minCycle });
          // Fetch data for the first cycle
          get().fetchCycleData(imei, minCycle);
        }
      }
    } catch (error) {
      console.error('Failed to fetch all cycles:', error);
      set({
        error: 'Failed to fetch cycle history.',
        allCycles: []
      });
    }
  },
}));

export default useBatteryStore;
