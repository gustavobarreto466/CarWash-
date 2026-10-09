export type StationId = 'llegada' | 'aspirado' | 'lavado' | 'secado';

export type StationStatus = 'libre' | 'ocupado' | 'bloqueado';

export interface Vehicle {
  id: string;
  name: string;
  arrivalTime: number;
  currentStationId: StationId | 'salida';
  servicePrice: number;
  completedTimes: Record<StationId, number>;
}

export interface Station {
  id: StationId;
  name: string;
  status: StationStatus;
  processingTime: number; // Duración base en segundos
  timeRemaining: number; // Tiempo actual para terminar
  currentVehicle: Vehicle | null;
  totalOccupiedTime: number; // Métricas
  totalBlockedTime: number;
  queue: Vehicle[];
}

export interface SimulationConfig {
  speed: number; // Multiplicador: 1x, 2x, 5x, 10x
  arrivalRate: number; // Segundos entre llegadas de vehículos
  basePrice: number;
  stationTimes: Record<StationId, number>;
}

export interface SimulationMetrics {
  totalRevenue: number;
  totalInvoices: number;
  bottleneckStation: string;
  stationUtilization: Record<StationId, number>;
  avgServiceTime: number;
}