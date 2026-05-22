import React, { useState } from 'react';
import { MedicalDoc, DocStatus, User } from '../types';
import { Search, Download, Eye, RotateCw, FileSymlink, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocTableProps {
  docs: MedicalDoc[];
  currentUser: User;
  onUpdateStatus: (id: string, newStatus: DocStatus) => void;
  onSelectDoc: (doc: MedicalDoc) => void;
  onOpenAddModal: () => void;
}

type TabType = 'Tous' | 'Approved' | 'InRevisionOrPending' | 'Expired';

export default function DocTable({ 
  docs, 
  currentUser,
  onUpdateStatus, 
  onSelectDoc,
  onOpenAddModal
}: DocTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // Apply filters
  const filteredDocs = docs.filter(doc => {
    // 1. Tab filter
    if (activeTab === 'Approved' && doc.status !== 'Approved') return false;
    if (activeTab === 'InRevisionOrPending' && doc.status !== 'InRevision' && doc.status !== 'Pending') return false;
    if (activeTab === 'Expired' && doc.status !== 'Expired') return false;

    // 2. Search query filter
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      doc.name.toLowerCase().includes(query) ||
      doc.code.toLowerCase().includes(query) ||
      doc.referential.toLowerCase().includes(query) ||
      doc.submittedBy.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: DocStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Approuvé
          </span>
        );
      case 'InRevision':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            En révision
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            En attente
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
            Expiré
          </span>
        );
      default:
        return null;
    }
  };

  const getTabCount = (tab: TabType) => {
    if (tab === 'Tous') return docs.length;
    if (tab === 'Approved') return docs.filter(d => d.status === 'Approved').length;
    if (tab === 'InRevisionOrPending') return docs.filter(d => d.status === 'InRevision' || d.status === 'Pending').length;
    if (tab === 'Expired') return docs.filter(d => d.status === 'Expired').length;
    return 0;
  };

  // Safe manual simulation handles
  const handleTriggerRevision = (doc: MedicalDoc, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser.role === 'Audit') return; // Read-only
    onUpdateStatus(doc.id, 'InRevision');
  };

  const handleDownload = (doc: MedicalDoc, e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate raw browser file download
    const formatLabel = `${doc.code}_${doc.version}.pdf`;
    alert(`📥 Téléchargement simulé pour : ${doc.name}\nFichier : ${formatLabel}\nFormat : PDF conforme GAMP 5`);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header section with Dynamic Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <span>📁 Documents du Dossier Technique</span>
            <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {filteredDocs.length} affichés
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Recherche, consultation et gestion des enregistrements réglementaires conformes au RDM
          </p>
        </div>
        
        {/* Actions bar */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role !== 'Audit' && (
            <button 
              onClick={onOpenAddModal}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              + Nouveau document
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Full Text Searching */}
      <div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filtering Tabs */}
        <div className="flex items-center gap-1 text-xs border-b border-slate-200/40 pb-2 sm:pb-0">
          {(['Tous', 'Approved', 'InRevisionOrPending', 'Expired'] as TabType[]).map((tab) => {
            const labelsMap: Record<TabType, string> = {
              Tous: 'Tous',
              Approved: 'Approuvés',
              InRevisionOrPending: 'En cours',
              Expired: 'Expirés'
            };
            const count = getTabCount(tab);
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedRowId(null);
                }}
                className={`px-3 py-2 font-medium border-b-2 transition-colors focus:outline-none cursor-pointer ${
                  isActive 
                    ? 'text-blue-600 border-blue-600 text-xs font-semibold' 
                    : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                {labelsMap[tab]} <span className="text-[10px] ml-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Searching Input */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Rechercher code, titre, norme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Primary Table Output */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Document / Code</th>
              <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Référentiel</th>
              <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Version</th>
              <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Statut</th>
              <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Échéance</th>
              <th className="px-5 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Outils</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-xs text-slate-400">
                  <span className="block text-slate-300 font-bold text-xl mb-1">Aucun document</span>
                  La recherche ou le filtre de statut sélectionné ne retourne aucun résultat.
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => {
                const isExpanded = selectedRowId === doc.id;
                const isDocExpired = doc.status === 'Expired';
                return (
                  <React.Fragment key={doc.id}>
                    {/* Row Item */}
                    <tr 
                      onClick={() => {
                        setSelectedRowId(isExpanded ? null : doc.id);
                        onSelectDoc(doc);
                      }}
                      className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900 text-xs sm:text-[13.5px] line-clamp-1">{doc.name}</div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">{doc.code}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">
                          {doc.referential}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">
                        {doc.version}
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="px-5 py-4">
                        {isDocExpired ? (
                          <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
                            <AlertCircle size={12} className="shrink-0 animate-bounce" />
                            Expiré ({doc.expirationDate})
                          </span>
                        ) : (
                          <span className={`${doc.status === 'InRevision' ? 'text-amber-600 font-semibold' : 'text-slate-500'} text-xs`}>
                            {doc.expirationDate}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedRowId(isExpanded ? null : doc.id);
                              onSelectDoc(doc);
                            }}
                            title="Consulter"
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                          >
                            <Eye size={14} />
                          </button>
                          
                          <button
                            onClick={(e) => handleDownload(doc, e)}
                            title="Télécharger PDF"
                            className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
                          >
                            <Download size={14} />
                          </button>

                          {currentUser.role !== 'Audit' && doc.status === 'Approved' && (
                            <button
                              onClick={(e) => handleTriggerRevision(doc, e)}
                              title="Déclencher une révision"
                              className="p-1.5 text-slate-500 hover:text-amber-500 rounded-lg hover:bg-slate-100"
                            >
                              <RotateCw size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Collapsible Details Area */}
                    <AnimatePresence>
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-slate-50/50 px-5 py-4 border-l-4 border-blue-500">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 font-sans"
                            >
                              <div>
                                <h4 className="font-bold text-slate-700 uppercase tracking-wide text-[10px] mb-1.5">Description de l'achèvement :</h4>
                                <p className="leading-relaxed text-slate-600">{doc.description}</p>
                              </div>
                              <div className="space-y-1.5">
                                <div>
                                  <span className="font-semibold text-slate-500">Soumettant :</span>{' '}
                                  <span className="font-semibold text-slate-700">{doc.submittedBy}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-500">Date d'importation :</span>{' '}
                                  <span className="text-slate-700 font-mono">{new Date(doc.submissionDate).toLocaleString('fr-FR')}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-500">Nombre de planches :</span>{' '}
                                  <span className="text-slate-700 font-semibold">{doc.pages} pages</span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 justify-center">
                                <div className="text-[10px] text-slate-400 italic">
                                  ID infalsifiable : SHA-256_{doc.id.toUpperCase()}_{doc.code}
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  <button
                                    onClick={(e) => handleDownload(doc, e)}
                                    className="px-2.5 py-1 inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded font-medium cursor-pointer"
                                  >
                                    <FileSymlink size={12} /> Exporter Certificat
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
