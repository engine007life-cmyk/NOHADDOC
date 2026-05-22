import { AlertTriangle, Clock, RefreshCw, AlertOctagon, HelpCircle, Landmark } from 'lucide-react';
import { MedicalDoc, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AlertsSectionProps {
  docs: MedicalDoc[];
  currentUser: User;
  onUpdateStatus: (id: string, newStatus: any) => void;
  onResolveTrainAlert: () => void; // Interactive update for expired training record
}

export default function AlertsSection({
  docs,
  currentUser,
  onUpdateStatus,
  onResolveTrainAlert
}: AlertsSectionProps) {
  // Filter alerts by analyzing current documents state
  const expiredDocs = docs.filter(d => d.status === 'Expired');
  const soonExpiringDocs = docs.filter(d => d.status === 'InRevision');
  const pendingReviewDocs = docs.filter(d => d.status === 'Pending');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header element */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500 animate-bounce" />
            <span>Fonctionnalité 4 — Alertes automatiques de conformité</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mises en garde de validité, notifications administratives de retard et veilles réglementaires
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="text-xs bg-slate-50 border border-slate-200 text-slate-600 p-3 rounded-lg leading-relaxed mb-2">
          🎯 <strong>Démonstrateur Interactif :</strong> Cliquez sur <span className="font-semibold text-blue-600">Résoudre</span> sur l'alerte de formation pour simuler le renouvellement des enregistrements et observer les KPI recalculer instantanément le taux d'avancement !
        </div>

        <AnimatePresence mode="popLayout">
          {/* E-1: EXPIRED RED ALERTS */}
          {expiredDocs.map((doc) => (
            <motion.div
              key={`alert-exp-${doc.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <AlertOctagon size={18} />
                </span>
                <div className="text-xs">
                  <div className="font-bold flex items-center gap-1.5 text-red-800">
                    <span>{doc.code} — Document Expiré !</span>
                    <span className="bg-red-200 text-red-900 px-1.5 py-0.5 rounded font-mono text-[9.5px]">URGENT</span>
                  </div>
                  <div className="mt-1 leading-relaxed">
                    <strong>{doc.name}</strong> est expiré depuis le {doc.expirationDate}. Une validation ou mise à jour immédiate est légalement requise.
                  </div>
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-end">
                {doc.code === 'ENR-FOR-001' ? (
                  <button
                    onClick={onResolveTrainAlert}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Résoudre (Renouveler V05)
                  </button>
                ) : (
                  <div className="text-[11px] text-red-500 font-medium">Contacter Qualité</div>
                )}
              </div>
            </motion.div>
          ))}

          {/* E-2: IN REVISION / EXPIRING SOON ORANGE ALERTS */}
          {soonExpiringDocs.map((doc) => (
            <motion.div
              key={`alert-soon-${doc.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950"
            >
              <span className="p-2 bg-amber-100 text-amber-600 rounded-lg mt-0.5">
                <Clock size={16} />
              </span>
              <div className="text-xs">
                <div className="font-bold text-amber-800">Échéance imminente : PRO-REG-003</div>
                <div className="mt-1 leading-relaxed">
                  <strong>{doc.name} (V{doc.version})</strong> expire le 30/11/2026. Processus de révision actif par Karim Alaoui.
                </div>
              </div>
            </motion.div>
          ))}

          {/* E-3: REVIEWS LOGS IN QUEUE ALERTS */}
          {pendingReviewDocs.map((doc) => (
            <motion.div
              key={`alert-pending-${doc.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950"
            >
              <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mt-0.5">
                <Clock size={16} />
              </span>
              <div className="text-xs">
                <div className="font-bold text-indigo-800">Dossier en attente d'approbation : {doc.code}</div>
                <div className="mt-1 leading-relaxed">
                  <strong>{doc.name}</strong> a été soumis par {doc.submittedBy}. Validation requise d'ici 5 jours.
                </div>
              </div>
            </motion.div>
          ))}

          {/* E-4: GENERIC REGULATORY ALERTS (MDCG GUIDELINE CHECK) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900"
          >
            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg mt-0.5">
              <Landmark size={16} />
            </span>
            <div className="text-xs">
              <div className="font-bold text-blue-800">Veille Réglementaire : Publication MDCG 2024-8</div>
              <div className="mt-1 leading-relaxed">
                Une nouvelle ligne directrice MDCG 2024-8 a été publiée le 15/11/2024. Veuillez auditer la conformité de l'évaluation clinique par rapport à ces nouveaux critères.
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
