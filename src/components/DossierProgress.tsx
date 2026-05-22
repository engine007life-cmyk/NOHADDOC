import { MdrSection, MedicalDoc } from '../types';
import { motion } from 'motion/react';
import { BarChart3 } from 'lucide-react';

interface DossierProgressProps {
  sections: MdrSection[];
  docs: MedicalDoc[];
}

export default function DossierProgress({ sections, docs }: DossierProgressProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <BarChart3 size={18} className="text-blue-600" />
          <span>Avancement par section RDM</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Taux de complétion réglementaire pour le marquage CE (Règlement UE 2017/745)
        </p>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-5">
        {sections.map((section) => {
          // Calculate dynamic approved count for this specific section
          const sectionDocs = docs.filter(d => d.sectionId === section.id);
          const approvedCount = sectionDocs.filter(d => d.status === 'Approved').length;
          
          const progressPct = Math.min(100, Math.round((approvedCount / section.requiredCount) * 100));

          // Set bar colors based on progress percentage
          let progressColor = 'bg-red-500';
          let textColor = 'text-red-600';
          if (progressPct >= 100) {
            progressColor = 'bg-emerald-600';
            textColor = 'text-emerald-600';
          } else if (progressPct >= 50) {
            progressColor = 'bg-blue-600';
            textColor = 'text-blue-600';
          } else if (progressPct >= 33) {
            progressColor = 'bg-amber-500';
            textColor = 'text-amber-500';
          }

          return (
            <div key={section.id} className="group pb-1">
              <div className="flex items-center justify-between mb-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base" role="img" aria-label="icon">
                    {section.icon}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-800 text-[12.5px] line-clamp-1">{section.name}</span>
                    <span className="text-[10.5px] text-slate-400 font-mono">
                      {approvedCount} / {section.requiredCount} approuvés
                    </span>
                  </div>
                </div>
                <div className={`font-bold font-mono text-xs ${textColor}`}>
                  {progressPct}%
                </div>
              </div>

              {/* Dynamic Animated Progress Slider bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${progressColor}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
