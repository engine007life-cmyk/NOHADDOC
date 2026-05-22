import React, { useState } from 'react';
import { MdrSection, MedicalDoc } from '../types';
import { X, UploadCloud, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface AddDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: MdrSection[];
  onAddDoc: (doc: Omit<MedicalDoc, 'id' | 'submissionDate' | 'status'>) => void;
  submittedBy: string;
}

export default function AddDocModal({
  isOpen,
  onClose,
  sections,
  onAddDoc,
  submittedBy
}: AddDocModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [referential, setReferential] = useState('MDR UE 2017/745');
  const [version, setVersion] = useState('V01');
  const [sectionId, setSectionId] = useState(sections[0]?.id || 'sec-desc');
  const [expirationDate, setExpirationDate] = useState('2026-12');
  const [pages, setPages] = useState(10);
  const [description, setDescription] = useState('');
  
  // Simulated file drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      alert("Veuillez remplir le nom et le code de référence.");
      return;
    }

    onAddDoc({
      name,
      code: code.toUpperCase(),
      referential,
      version: version.toUpperCase(),
      sectionId,
      expirationDate,
      submittedBy,
      pages,
      description
    });

    // Reset fields
    setName('');
    setCode('');
    setVersion('V01');
    setPages(10);
    setDescription('');
    setFileName(null);
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      // Auto-populate values if they're empty
      if (!name) {
        // Strip ext
        setName(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '));
      }
      if (!code) {
        // Generate a simple code
        setCode('DOC-REG-' + Math.floor(100 + Math.random() * 900));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Dialog Content Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header bar */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">📥 Nouveau Document Réglementaire</h3>
            <p className="text-xs text-slate-400 mt-1">
              Ajouter de nouvelles pièces au dossier technique du tensiomètre TM-200
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Simulated File upload dropbox zone */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
              isDragging 
                ? 'border-blue-500 bg-blue-50/50 text-blue-800' 
                : fileName 
                  ? 'border-emerald-300 bg-emerald-50/20 text-emerald-800' 
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-500'
            }`}
          >
            <UploadCloud size={24} className={`mx-auto mb-2 ${fileName ? 'text-emerald-500' : 'text-slate-400'}`} />
            {fileName ? (
              <div className="text-xs">
                <span className="font-bold text-slate-800">Fichier chargé :</span> {fileName}
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileName(null);
                  }}
                  className="block mx-auto mt-1 text-red-500 hover:underline font-semibold"
                >
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="text-xs">
                <span className="font-bold text-blue-600 cursor-pointer hover:underline">Cliquez pour importer</span> ou glissez un document technique ici.
                <span className="block text-[10px] text-slate-400 mt-1">PDF, DOCX, XLS validé (max. 50MB)</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Nom / Titre du document *</label>
              <input 
                type="text"
                required
                placeholder="ex. Rapport d'essai de biocompatibilité"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Code Référence *</label>
              <input 
                type="text"
                required
                placeholder="ex. ENR-BIO-003"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Référentiel Normatif</label>
              <input 
                type="text"
                placeholder="ex. ISO 10993"
                value={referential}
                onChange={(e) => setReferential(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Version</label>
              <input 
                type="text"
                placeholder="ex. V01"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Nb. de Pages</label>
              <input 
                type="number"
                min={1}
                value={pages}
                onChange={(e) => setPages(parseInt(e.target.value) || 1)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Sert la section RDM :</label>
              <select 
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                {sections.map(sec => (
                  <option key={sec.id} value={sec.id}>
                    {sec.icon} {sec.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Échéance de réévaluation</label>
              <input 
                type="month"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Résumé de complétion / Objectifs</label>
            <textarea 
              rows={3}
              placeholder="Descriptif de la pièce d'enregistrement réglementaire ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-500 leading-relaxed font-sans">
            <Info size={14} className="text-blue-500 shrink-0" />
            <span>
              Après soumission, ce document sera affecté d'un statut <strong className="text-slate-800">En attente</strong> et exigera une revue de signature réglementaire par Sara Chaoui.
            </span>
          </div>

          {/* Footer Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Soumettre pour revue
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
