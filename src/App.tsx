import React from 'react';
import { useSimulation } from './hooks/useSimulation';
import { SimulationControls } from './components/SimulationControls';
import { StationVisualizer } from './components/StationVisualizer';
import { Dashboard } from './components/Dashboard';

export const App: React.FC = () => {
  const {
    isRunning,
    setIsRunning,
    elapsedTime,
    config,
    setConfig,
    stations,
    metrics,
    resetSimulation
  } = useSimulation();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-indigo-400">
            Simulador de Autolavado
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Simulación de eventos discretos con 4 estaciones en tiempo real.
          </p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
          <span className="text-xs text-slate-400 block uppercase font-bold">Tiempo Transcurrido</span>
          <span className="text-xl font-mono font-bold text-slate-100">{Math.round(elapsedTime)}s</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <SimulationControls
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          config={config}
          setConfig={setConfig}
          resetSimulation={resetSimulation}
        />

        <StationVisualizer stations={stations} />

        <Dashboard metrics={metrics} stations={stations} />
      </main>
    </div>
  );
};

export default App;