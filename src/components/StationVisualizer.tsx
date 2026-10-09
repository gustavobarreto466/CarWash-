import React from 'react';
import { Station } from '../types/simulation';
import { Car } from 'lucide-react';

interface Props {
  stations: Station[];
}

export const StationVisualizer: React.FC<Props> = ({ stations }) => {
  const getStatusBadge = (status: Station['status']) => {
    switch (status) {
      case 'libre':
        return { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', text: 'VERDE (Libre)' };
      case 'ocupado':
        return { color: 'bg-rose-500/20 text-rose-400 border-rose-500/30', text: 'ROJO (Ocupado)' };
      case 'bloqueado':
        return { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', text: 'AMARILLO (Bloqueado)' };
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-8">
      <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
         Estado de las Estaciones
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stations.map(st => {
          const badge = getStatusBadge(st.status);
          return (
            <div
              key={st.id}
              className={`relative bg-slate-900 p-5 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[220px] ${
                st.status === 'libre'
                  ? 'border-emerald-500/40 shadow-emerald-950/20 shadow-lg'
                  : st.status === 'ocupado'
                  ? 'border-rose-500/40 shadow-rose-950/20 shadow-lg'
                  : 'border-amber-500/40 shadow-amber-950/20 shadow-lg'
              }`}
            >
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${badge.color} mb-3`}>
                  {badge.text}
                </span>
                <h3 className="font-bold text-slate-200 text-lg">{st.name}</h3>
              </div>

              {/* Vehículo Actual */}
              <div className="my-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-center min-h-[70px] flex flex-col justify-center items-center">
                {st.currentVehicle ? (
                  <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
                    <Car size={24} />
                    <span className="font-semibold">{st.currentVehicle.name}</span>
                  </div>
                ) : (
                  <span className="text-slate-500 text-sm">Estación Vacía</span>
                )}
                {st.timeRemaining > 0 && (
                  <span className="text-xs text-slate-400 mt-1">Restante: {st.timeRemaining}s</span>
                )}
              </div>

              {/* Cola de espera */}
              <div className="text-xs text-slate-400 flex justify-between items-center border-t border-slate-800 pt-2">
                <span>En cola de espera:</span>
                <span className="font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded-full">{st.queue.length}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};