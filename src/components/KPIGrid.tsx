import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { MedicalDoc } from '../types';
import { motion } from 'motion/react';

interface KPIGridProps {
  docs: MedicalDoc[];
}

export default function KPIGrid({ docs }: KPIGridProps) {
  const totalCount = docs.length;
  const approvedDocs = docs.filter(d => d.status === 'Approved');
  const approvedCount = approvedDocs.length;
  const pendingCount = docs.filter(d => d.status === 'Pending').length;
  const expiredCount = docs.filter(d => d.status === 'Expired').length;
  
  // Calculate dynamic percentages
  const completionPercentage = Math.min(100, Math.round((totalCount / 30) * 100));
  const approvalOfUploadedPercentage = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Complétion du dossier */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl p-5 border border-slate-200 relative overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
        <FileText size={22} className="absolute top-4 right-4 text-blue-100 shrink-0" />
        <div className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-2">Complétion du dossier</div>
        <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">{completionPercentage}%</div>
        
        {/* Progress Bar Container */}
        <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-blue-600 h-full rounded-full"
          />
        </div>
        <div className="text-xs text-slate-500 mt-2 font-medium">
          {totalCount} / 30 documents requis
        </div>
      </motion.div>

      {/* 2. Documents approuvés */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl p-5 border border-slate-200 relative overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
        <CheckCircle size={22} className="absolute top-4 right-4 text-emerald-100 shrink-0" />
        <div className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-2">Documents approuvés</div>
        <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">{approvedCount}</div>
        
        <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${approvalOfUploadedPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-emerald-600 h-full rounded-full"
          />
        </div>
        <div className="text-xs text-slate-500 mt-2 font-medium">
          {approvalOfUploadedPercentage}% du total uploadé
        </div>
      </motion.div>

      {/* 3. En attente d'approbation */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl p-5 border border-slate-200 relative overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
        <Clock size={22} className="absolute top-4 right-4 text-amber-100 shrink-0" />
        <div className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-2">En attente d'approbation</div>
        <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">{pendingCount}</div>
        
        <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${totalCount > 0 ? (pendingCount / totalCount) * 100 : 0}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-amber-500 h-full rounded-full"
          />
        </div>
        <div className="text-xs text-slate-500 mt-2 font-medium">
          Délai max d'avis : 5 jours ouvrés
        </div>
      </motion.div>

      {/* 4. Documents expirés / urgents */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl p-5 border border-slate-200 relative overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
        <AlertTriangle size={22} className="absolute top-4 right-4 text-red-100 shrink-0" />
        <div className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-2">Expirés / Urgences</div>
        <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">{expiredCount}</div>
        
        <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${totalCount > 0 ? (expiredCount / totalCount) * 100 : 0}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-red-600 h-full rounded-full"
          />
        </div>
        <div className="text-xs text-slate-500 mt-2 font-medium">
          Remplacement imminent requis
        </div>
      </motion.div>
    </div>
  );
}
