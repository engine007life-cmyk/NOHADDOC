import { AuditLog } from '../types';
import { History, ShieldCheck, Download } from 'lucide-react';

interface AuditTrailProps {
  logs: AuditLog[];
  onExportCSV: () => void;
}

export default function AuditTrail({ logs, onExportCSV }: AuditTrailProps) {
  const getDotColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-emerald-500 ring-4 ring-emerald-100';
      case 'blue': return 'bg-blue-500 ring-4 ring-blue-100';
      case 'orange': return 'bg-amber-500 ring-4 ring-amber-100';
      case 'red': return 'bg-red-500 ring-4 ring-red-100';
      default: return 'bg-slate-500 ring-4 ring-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <History size={18} className="text-indigo-600" />
            <span>Audit Trail — Traçabilité complète FDA 21 CFR Part 11</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chronique cryptographique inaltérable retraçant les signatures réglementaires du compte
          </p>
        </div>
        <button
          onClick={onExportCSV}
          className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
        >
          <Download size={12} /> Exporter Rapport (.csv)
        </button>
      </div>

      <div className="p-5">
        <div className="text-xs bg-indigo-50/50 border border-indigo-100 text-indigo-950 p-3 rounded-lg leading-relaxed mb-6 font-sans">
          🛡️ <strong>Piste d'audit inviolable :</strong> L'inclusion d'une trace d'audit automatisée certifie la provenance, la date certifiée et la conformité aux exigences de l'audit externe.
        </div>

        {/* Trail list layout */}
        <div className="relative pl-5 border-l-2 border-slate-100 space-y-5 py-2 select-none">
          {logs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Chrono dot marker */}
              <div className={`absolute -left-[25px] top-1.5 w-2 h-2 rounded-full ${getDotColorClass(log.dotColor)}`} />
              
              <div className="text-xs font-sans">
                <div className="text-slate-800 leading-relaxed font-semibold">
                  <span className="text-blue-900 font-bold">{log.userName}</span>{' '}
                  <span className="text-slate-600 font-normal">{log.action}</span>
                </div>
                <div className="flex items-center gap-2 text-[10.5px] text-slate-400 mt-1 font-mono">
                  <span>📅 {log.dateTime}</span>
                  <span>·</span>
                  <span>🌐 IP {log.ipAddress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
