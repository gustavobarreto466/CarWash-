import React from 'react';
import { SimulationMetrics, Station } from '../types/simulation';
import { DollarSign, FileText, AlertTriangle, Clock } from 'lucide-react';

interface Props {
  metrics: SimulationMetrics;
  stations: Station[];
}

export const Dashboard: React.FC<Props> = ({ metrics, stations }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
      <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        📊 Dashboard y Métricas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Total Ingresos */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <DollarSign size={28} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Ingresos Totales</span>
            <p className="text-2xl font-black text-slate-100">${metrics.totalRevenue}</p>
          </div>
        </div>

        {/* Facturas */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <FileText size={28} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Facturas Totales</span>
            <p className="text-2xl font-black text-slate-100">{metrics.totalInvoices}</p>
          </div>
        </div>

        {/* Cuello de botella */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <AlertTriangle size={28} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Cuello de Botella</span>
            <p className="text-sm font-bold text-amber-300 truncate max-w-[140px]">{metrics.bottleneckStation}</p>
          </div>
        </div>

        {/* Tiempo Promedio */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Clock size={28} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Tiempo Prom. Servicio</span>
            <p className="text-2xl font-black text-slate-100">{metrics.avgServiceTime}s</p>
          </div>
        </div>
      </div>

      {/* Porcentaje de Utilización por Estación */}
      <h3 className="text-md font-semibold text-slate-300 mb-4">Porcentaje de Utilización por Estación</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stations.map(st => {
          const util = metrics.stationUtilization[st.id] || 0;
          return (
            <div key={st.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700/60">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-300">{st.name}</span>
                <span className="text-indigo-400 font-bold">{util}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${util}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};