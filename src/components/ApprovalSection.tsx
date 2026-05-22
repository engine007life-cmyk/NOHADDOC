import { useState } from 'react';
import { MedicalDoc, User } from '../types';
import { Check, X, Eye, FileSpreadsheet, ShieldCheck, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ApprovalSectionProps {
  docs: MedicalDoc[];
  currentUser: User;
  onApprove: (id: string, reviewerComment?: string) => void;
  onRefuse: (id: string, reviewerComment?: string) => void;
  onSelectDoc: (doc: MedicalDoc) => void;
}

export default function ApprovalSection({
  docs,
  currentUser,
  onApprove,
  onRefuse,
  onSelectDoc
}: ApprovalSectionProps) {
  const pendingDocs = docs.filter(d => d.status === 'Pending');
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [activeApprovalId, setActiveApprovalId] = useState<string | null>(null);

  const handleAction = (id: string, action: 'approve' | 'refuse') => {
    const comment = commentText[id] || '';
    if (action === 'approve') {
      onApprove(id, comment);
    } else {
      onRefuse(id, comment);
    }
    // Clean input state
    setCommentText(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setActiveApprovalId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <UserCheck size={18} className="text-blue-600" />
            <span>Workflow d'approbation (Fonctionnalité 3)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chaque enregistrement doit être validé par un Regulatory Affairs Manager (RAM) avant d'être inclus au dossier
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          {pendingDocs.length} en attente
        </span>
      </div>

      <div className="p-5">
        {/* Help box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 text-xs text-blue-900 mb-6 leading-relaxed">
          <strong>💡 Comment fonctionne le cycle ?</strong> Un document importé passe au statut <span className="font-semibold text-slate-900">En attente</span>. Seul le profil de <strong>Manager RAM</strong> (Sara Chaoui) dispose de l'autorisation d'approbation légale ou de refus pour émettre l'enregistrement au dossier technique final.
        </div>

        {/* Workflow visuals */}
        <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 mb-6">
          <div className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Cycle de Validation Réglementaire (GAMP 5 / Annex 11)
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 max-w-2xl mx-auto">
            <div className="flex-1 flex flex-col items-center bg-white p-2 rounded border border-slate-100 shadow-xs">
              <span className="text-emerald-600 font-bold text-xs">✓ Étape 1</span>
              <span className="text-slate-800 text-xs font-semibold mt-0.5">Création</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Responsable Qualité</span>
            </div>
            
            <div className="hidden sm:block text-slate-300">➜</div>
            
            <div className="flex-1 flex flex-col items-center bg-white p-2 rounded border border-slate-100 shadow-xs">
              <span className="text-emerald-600 font-bold text-xs">✓ Étape 2</span>
              <span className="text-slate-800 text-xs font-semibold mt-0.5">Soumission</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Horodatage d'import</span>
            </div>

            <div className="hidden sm:block text-slate-300">➜</div>

            <div className="flex-1 flex flex-col items-center bg-blue-50 p-2 rounded border border-blue-200 shadow-xs">
              <span className="text-blue-600 font-bold text-xs">● Étape 3</span>
              <span className="text-blue-900 text-xs font-bold mt-0.5">Révision RAM</span>
              <span className="text-[10px] text-blue-500 mt-0.5">Évaluation de conformité</span>
            </div>

            <div className="hidden sm:block text-slate-300">➜</div>

            <div className="flex-1 flex flex-col items-center bg-slate-50 p-2 rounded border border-slate-200/60 text-slate-400">
              <span className="font-bold text-xs">○ Étape 4</span>
              <span className="text-slate-500 text-xs font-medium mt-0.5">Approuvé</span>
              <span className="text-[10px] mt-0.5">Inclus au dossier</span>
            </div>
          </div>
        </div>

        {/* Interactive Waiting list of documents */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {pendingDocs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400"
              >
                <div className="text-emerald-600 font-bold text-sm mb-1">🎉 Tout est approuvé !</div>
                Aucun document n'est en attente d'approbation pour le moment.
              </motion.div>
            ) : (
              pendingDocs.map((doc) => {
                const isRoleAllowed = currentUser.role === 'RAM';
                const showActionForm = activeApprovalId === doc.id;
                
                return (
                  <motion.div 
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 bg-white shadow-xs flex flex-col md:flex-row gap-4 justify-between"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-9 h-9 font-semibold text-xs bg-blue-100 text-blue-700 rounded-full shrink-0 flex items-center justify-center border border-blue-200">
                        {doc.submittedBy.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="font-semibold text-xs sm:text-[13.5px] text-slate-900">{doc.name}</div>
                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-mono text-[10.5px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                            {doc.code} V{doc.version}
                          </span>
                          <span>·</span>
                          <span>Soumis par <span className="font-semibold text-slate-700">{doc.submittedBy}</span></span>
                          <span>·</span>
                          <span className="font-mono text-[11px]">{new Date(doc.submissionDate).toLocaleDateString()}</span>
                          <span>·</span>
                          <span>{doc.pages} pages</span>
                        </div>
                        {doc.description && (
                          <p className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded border border-slate-100 mt-2">
                             "{doc.description}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Decisions button container */}
                    <div className="flex flex-col justify-between items-end gap-3 shrink-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => onSelectDoc(doc)}
                          className="px-2.5 py-1.5 border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-600 text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={12} /> Consulter
                        </button>
                        
                        {isRoleAllowed ? (
                          <>
                            <button
                              onClick={() => handleAction(doc.id, 'approve')}
                              className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 border border-emerald-200 cursor-pointer"
                            >
                              <Check size={12} /> Approuver
                            </button>
                            <button
                              onClick={() => {
                                handleAction(doc.id, 'refuse');
                              }}
                              className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 border border-red-200 cursor-pointer"
                            >
                              <X size={12} /> Refuser
                            </button>
                          </>
                        ) : (
                          <div className="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 inline-flex items-center gap-1 cursor-not-allowed">
                            🔒 Réservé au profil RAM
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
