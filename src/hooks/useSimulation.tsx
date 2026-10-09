import { useState, useEffect, useRef } from 'react';
import { Station, StationId, Vehicle, SimulationConfig, SimulationMetrics } from '../types/simulation';

const INITIAL_STATIONS: Station[] = [
  { id: 'llegada', name: '1. Llegada / Recepción', status: 'libre', processingTime: 3, timeRemaining: 0, currentVehicle: null, totalOccupiedTime: 0, totalBlockedTime: 0, queue: [] },
  { id: 'aspirado', name: '2. Aspirado', status: 'libre', processingTime: 8, timeRemaining: 0, currentVehicle: null, totalOccupiedTime: 0, totalBlockedTime: 0, queue: [] },
  { id: 'lavado', name: '3. Lavado Automático', status: 'libre', processingTime: 12, timeRemaining: 0, currentVehicle: null, totalOccupiedTime: 0, totalBlockedTime: 0, queue: [] },
  { id: 'secado', name: '4. Secado y Detallado', status: 'libre', processingTime: 6, timeRemaining: 0, currentVehicle: null, totalOccupiedTime: 0, totalBlockedTime: 0, queue: [] },
];

export const useSimulation = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [vehicleCounter, setVehicleCounter] = useState<number>(1);
  const [completedVehicles, setCompletedVehicles] = useState<Vehicle[]>([]);
  
  const [config, setConfig] = useState<SimulationConfig>({
    speed: 1,
    arrivalRate: 6,
    basePrice: 15,
    stationTimes: { llegada: 3, aspirado: 8, lavado: 12, secado: 6 }
  });

  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const nextArrivalTimer = useRef<number>(config.arrivalRate);

  // Sincronizar tiempos configurados
  useEffect(() => {
    setStations(prev => prev.map(st => ({
      ...st,
      processingTime: config.stationTimes[st.id]
    })));
  }, [config.stationTimes]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const step = 0.5; // Tick de medio segundo

      setElapsedTime(prev => prev + step);

      setStations(prevStations => {
        // Clonar estaciones profundamente
        const nextStations = prevStations.map(st => ({
          ...st,
          queue: [...st.queue]
        }));

        // 1. Tasa de llegada de vehículos al área de recepción (Llegada)
        nextArrivalTimer.current -= step;
        if (nextArrivalTimer.current <= 0) {
          nextArrivalTimer.current = config.arrivalRate;
          const newVehicle: Vehicle = {
            id: `CAR-${Math.floor(1000 + Math.random() * 9000)}`,
            name: `Vehículo #${vehicleCounter}`,
            arrivalTime: elapsedTime,
            currentStationId: 'llegada',
            servicePrice: config.basePrice,
            completedTimes: { llegada: 0, aspirado: 0, lavado: 0, secado: 0 }
          };
          setVehicleCounter(c => c + 1);
          // Los autos nuevos entran directamente a la cola de la estación de llegada
          nextStations[0].queue.push(newVehicle);
        }

        // 2. Procesamiento de estaciones en orden inverso (Secado -> Lavado -> Aspirado -> Llegada)
        // Esto permite liberar espacio en las estaciones avanzadas antes de mover los autos anteriores.
        for (let i = nextStations.length - 1; i >= 0; i--) {
          const current = nextStations[i];
          const nextStation = nextStations[i + 1] || null;

          // A) Si la estación está libre y hay autos esperando en su cola, ingresar un auto a procesamiento
          if (!current.currentVehicle && current.queue.length > 0) {
            const vehicleToProcess = current.queue.shift()!;
            current.currentVehicle = vehicleToProcess;
            current.timeRemaining = current.processingTime;
            current.status = 'ocupado';
          }

          // B) Si hay un vehículo en procesamiento en la estación actual
          if (current.currentVehicle) {
            if (current.timeRemaining > 0) {
              // Reducir tiempo de procesamiento
              current.timeRemaining = Math.max(0, current.timeRemaining - step);
              current.totalOccupiedTime += step;
              current.status = 'ocupado';
            } else {
              // El servicio en la estación actual terminó: Intentar transferir
              if (nextStation) {
                // Transferir a la cola de la siguiente estación
                nextStation.queue.push(current.currentVehicle);
                current.currentVehicle = null;
                current.status = current.queue.length > 0 ? 'ocupado' : 'libre';

                // Si hay otro auto esperando inmediatamente en la cola de esta estación, pasarlo a servicio
                if (current.queue.length > 0) {
                  const nextVehicle = current.queue.shift()!;
                  current.currentVehicle = nextVehicle;
                  current.timeRemaining = current.processingTime;
                  current.status = 'ocupado';
                }
              } else {
                // Estación de Secado (Última): Salida del autolavado
                const finishedCar = { ...current.currentVehicle };
                setCompletedVehicles(completed => [...completed, finishedCar]);
                current.currentVehicle = null;
                current.status = current.queue.length > 0 ? 'ocupado' : 'libre';

                if (current.queue.length > 0) {
                  const nextVehicle = current.queue.shift()!;
                  current.currentVehicle = nextVehicle;
                  current.timeRemaining = current.processingTime;
                  current.status = 'ocupado';
                }
              }
            }
          } else {
            // Estación vacía sin cola
            current.status = current.queue.length > 0 ? 'ocupado' : 'libre';
          }

          // C) Evaluar Estado de Bloqueo (Amarillo):
          // Si la siguiente estación tiene su cola llena/sobrecargada, marcar la actual como bloqueada
          if (nextStation && current.currentVehicle && current.timeRemaining === 0) {
            current.status = 'bloqueado';
            current.totalBlockedTime += step;
          }
        }

        return nextStations;
      });
    }, 500 / config.speed);

    return () => clearInterval(interval);
  }, [isRunning, config.speed, config.arrivalRate, config.basePrice, elapsedTime, vehicleCounter]);

  // Métricas del Dashboard
  const metrics: SimulationMetrics = {
    totalRevenue: completedVehicles.reduce((acc, v) => acc + v.servicePrice, 0),
    totalInvoices: completedVehicles.length,
    bottleneckStation: (() => {
      let maxBlocked = -1;
      let bottleneck = 'Ninguna';
      stations.forEach(st => {
        if (st.totalBlockedTime > maxBlocked && st.totalBlockedTime > 0) {
          maxBlocked = st.totalBlockedTime;
          bottleneck = st.name;
        }
      });
      return bottleneck;
    })(),
    stationUtilization: stations.reduce((acc, st) => {
      acc[st.id] = elapsedTime > 0 ? Math.min(100, Math.round((st.totalOccupiedTime / elapsedTime) * 100)) : 0;
      return acc;
    }, {} as Record<StationId, number>),
    avgServiceTime: completedVehicles.length > 0
      ? Math.round(completedVehicles.reduce((acc, v) => acc + (elapsedTime - v.arrivalTime), 0) / completedVehicles.length)
      : 0
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setVehicleCounter(1);
    setCompletedVehicles([]);
    setStations(INITIAL_STATIONS);
    nextArrivalTimer.current = config.arrivalRate;
  };

  return {
    isRunning,
    setIsRunning,
    elapsedTime,
    config,
    setConfig,
    stations,
    metrics,
    resetSimulation
  };
};