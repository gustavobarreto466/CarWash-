import React from 'react';
import { SimulationConfig, StationId } from '../types/simulation';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Props {
  isRunning: boolean;
  setIsRunning: (val: boolean) => void;
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
  resetSimulation: () => void;
}

export const SimulationControls: React.FC<Props> = ({
  isRunning,
  setIsRunning,
  config,
  setConfig,
  resetSimulation
}) => {
  const handleStationTimeChange = (id: StationId, val: number) => {
    setConfig(prev => ({
      ...prev,
      stationTimes: { ...prev.stationTimes, [id]: Math.max(1, val) }
    }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          ⚙️ Parámetros de Simulación
        </h2>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {isRunning ? <><Pause size={18} /> Pausar</> : <><Play size={18} /> Iniciar</>}
          </button>
          
          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 px-4 py-2.5 rounded-lg font-semibold transition-all"
          >
            <RotateCcw size={18} /> Reiniciar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Velocidad */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Velocidad de Simulación
          </label>
          <div className="flex gap-2">
            {[1, 2, 5, 10].map(s => (
              <button
                key={s}
                onClick={() => setConfig(prev => ({ ...prev, speed: s }))}
                className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
                  config.speed === s ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Tasa de llegada */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Llegada de Autos (cada {config.arrivalRate}s)
          </label>
          <input
            type="range"
            min="2"
            max="20"
            value={config.arrivalRate}
            onChange={e => setConfig(prev => ({ ...prev, arrivalRate: Number(e.target.value) }))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Precio base */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Precio Base por Servicio ($)
          </label>
          <input
            type="number"
            value={config.basePrice}
            onChange={e => setConfig(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Duración por Estación */}
      <div className="mt-6 border-t border-slate-700/60 pt-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Tiempos de Operación por Estación (segundos)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['llegada', 'aspirado', 'lavado', 'secado'] as StationId[]).map(stId => (
            <div key={stId} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
              <span className="block text-xs uppercase font-bold text-slate-400 mb-1">{stId}</span>
              <input
                type="number"
                min="1"
                value={config.stationTimes[stId]}
                onChange={e => handleStationTimeChange(stId, Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-slate-100 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};