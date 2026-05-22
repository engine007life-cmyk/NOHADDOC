import { useState } from 'react';
import { initialDocs, initialLogs, initialUsers, initialSections } from './data/initialData';
import { MedicalDoc, AuditLog, User, DocStatus } from './types';
import Sidebar from './components/Sidebar';
import KPIGrid from './components/KPIGrid';
import DocTable from './components/DocTable';
import ApprovalSection from './components/ApprovalSection';
import AlertsSection from './components/AlertsSection';
import AuditTrail from './components/AuditTrail';
import DossierProgress from './components/DossierProgress';
import UserManagement from './components/UserManagement';
import AddDocModal from './components/AddDocModal';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Database, 
  HelpCircle, 
  ShieldAlert, 
  ToggleLeft,
  Sliders, 
  Save, 
  CheckSquare, 
  Bell, 
  BookOpen, 
  CheckCircle2, 
  PlusCircle 
} from 'lucide-react';

export default function App() {
  // Global States
  const [docs, setDocs] = useState<MedicalDoc[]>(initialDocs);
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]); // Defaults to Sara Chaoui (RAM)
  const [activeView, setActiveView] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<MedicalDoc | null>(null);

  // System Parameter configurations (for immersive feels in parameters)
  const [ceMarkClass, setCeMarkClass] = useState('Class IIa');
  const [alertThresholdMonths, setAlertThresholdMonths] = useState(3);
  const [conformityCheckMode, setConformityCheckMode] = useState(true);

  // Record an immutable audit event
  const appendAuditLog = (actionText: string, dotColor: 'green' | 'blue' | 'orange' | 'red' = 'blue') => {
    const freshLog: AuditLog = {
      id: `log-${Date.now()}`,
      dotColor,
      userName: currentUser.name,
      action: actionText,
      dateTime: new Date().toISOString().replace('T', ' · ').substring(0, 19),
      ipAddress: '196.200.14.71'
    };
    setLogs(prev => [freshLog, ...prev]);
  };

  // 1. Approval Action handles
  const handleApproveDoc = (id: string, comment?: string) => {
    const matchedDoc = docs.find(d => d.id === id);
    if (!matchedDoc) return;

    setDocs(prev => prev.map(doc => {
      if (doc.id === id) {
        return { ...doc, status: 'Approved' };
      }
      return doc;
    }));

    appendAuditLog(
      `a approuvé ${matchedDoc.code} V${matchedDoc.version} ${comment ? `— "${comment}"` : ''}`,
      'green'
    );
  };

  const handleRefuseDoc = (id: string, comment?: string) => {
    const matchedDoc = docs.find(d => d.id === id);
    if (!matchedDoc) return;

    setDocs(prev => prev.map(doc => {
      if (doc.id === id) {
        return { ...doc, status: 'InRevision' };
      }
      return doc;
    }));

    appendAuditLog(
      `a rejeté ${matchedDoc.code} V${matchedDoc.version} — retour à l'état de révision ${comment ? `— "${comment}"` : ''}`,
      'red'
    );
  };

  // 2. Add Document contribution
  const handleAddDoc = (newDocData: Omit<MedicalDoc, 'id' | 'submissionDate' | 'status'>) => {
    const freshDoc: MedicalDoc = {
      ...newDocData,
      id: `doc-${Date.now()}`,
      status: 'Pending', // All new docs begin at 'Pending' for review
      submissionDate: new Date().toISOString()
    };

    setDocs(prev => [freshDoc, ...prev]);
    appendAuditLog(
      `a créé & téléversé le document ${freshDoc.code} V${freshDoc.version} (« ${freshDoc.name} »)`,
      'blue'
    );
    
    // Switch view to pending verification to see result
    setActiveView('approvals');
  };

  // 3. Register Simulated User
  const handleAddUser = (newUserData: Omit<User, 'id'>) => {
    const freshUser: User = {
      ...newUserData,
      id: `user-${Date.now()}`
    };

    setUsers(prev => [...prev, freshUser]);
    appendAuditLog(
      `a inscrit un nouveau collaborateur au rôle de ${freshUser.role} : ${freshUser.name}`,
      'blue'
    );
  };

  // 4. Resolve the expired training record interactive callback
  const handleResolveTrainAlert = () => {
    // Find doc ENR-FOR-001
    const targetCode = 'ENR-FOR-001';
    setDocs(prev => prev.map(doc => {
      if (doc.code === targetCode) {
        return {
          ...doc,
          version: 'V05',
          status: 'Approved',
          expirationDate: '2027-10',
          submissionDate: new Date().toISOString(),
          submittedBy: currentUser.name,
          description: 'Habilitation générale renouvelée suite à réévaluation réussie des compétences.'
        };
      }
      return doc;
    }));

    appendAuditLog(
      `a renouvelé l'enregistrement de formation ENR-FOR-001 à la version V05 (Alerte résolue)`,
      'green'
    );
    
    // Show user feedback that it has been updated
    alert("✅ Succès !\nEnregistrement ENR-FOR-001 mis à jour à la version V05.\nIl est maintenant Approuvé réglant le drapeau d'expiration.");
  };

  // 5. Exporter CSV file handle
  const handleExportCSV = () => {
    appendAuditLog(`a exporté un rapport de traçabilité complet de la plateforme`, 'orange');
    alert("📝 Export CSV compilé !\nLe rapport a été chiffré et simulé pour enregistrement.\nIdentifiant d'archive : GAMP_EXPORT_2026.csv");
  };

  // Dynamic values helper
  const pendingDocsCount = docs.filter(d => d.status === 'Pending').length;
  const expiredAlertsCount = docs.filter(d => d.status === 'Expired').length;

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Sidebar layouts */}
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        users={users}
        setCurrentUser={setCurrentUser}
        docsPendingCount={pendingDocsCount}
        alertsCount={expiredAlertsCount}
      />

      {/* Main Container workspace view */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top bar header workspace */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-sm font-semibold text-slate-900">🩺 NohadDoc Workspace</span>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-xs text-slate-500 font-mono">
                {activeView === 'dashboard' ? 'Tableau de bord' :
                 activeView === 'dossier' ? 'Dossier Technique' :
                 activeView === 'documents' ? 'Moniteur de Documents' :
                 activeView === 'approvals' ? 'Workflow d\'Approbation' :
                 activeView === 'audit' ? 'Chronique d\'Audit' :
                 activeView === 'alerts' ? 'Alertes de Conformité' :
                 activeView === 'users' ? 'Habilitations' : 'Paramètres'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick stats active status labels */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">
                Utilisateur Actif : {currentUser.role}
              </span>
            </div>

            {currentUser.role !== 'Audit' && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <PlusCircle size={14} /> Déposer un document
              </button>
            )}
          </div>
        </header>

        {/* View switching render area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              
              {/* VIEW 1: DASHBOARD (Tableau de bord) */}
              {activeView === 'dashboard' && (
                <div className="space-y-6">
                  {/* Legend instruction bar */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-xl p-4 shadow-xs text-blue-900 text-xs sm:text-[13px] leading-relaxed">
                    <span className="font-bold">🚀 Bienvenue sur la maquette interactive NohadDoc !</span> Elle démontre un cas d'étude réglementaire conforme au Règlement UE 2017/745 (RDM). Tous les widgets du tableau de bord, bento d'avancement, workflow de signature de documents, alertes d'expirations et journal de sécurité (Audit Trail) réagissent dynamiquement à vos actions de dépôt ou de validation.
                  </div>

                  {/* Top KPIs overview */}
                  <KPIGrid docs={docs} />

                  {/* Middle columns content layouts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Documents overview & mini quick summary */}
                    <div className="lg:col-span-2 space-y-6">
                      <DocTable 
                        docs={docs} 
                        currentUser={currentUser}
                        onUpdateStatus={(id, status) => {
                          setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
                          appendAuditLog(`a déclenché une révision ou mis à jour le statut du document ID ${id} à ${status}`, 'orange');
                        }}
                        onSelectDoc={setSelectedDoc}
                        onOpenAddModal={() => setIsAddModalOpen(true)}
                      />
                    </div>

                    {/* Left Column blocks */}
                    <div className="space-y-6">
                      {/* Section completeness bento card */}
                      <DossierProgress sections={initialSections} docs={docs} />

                      {/* Active profile review reminder widgets card */}
                      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                        <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Compte Connecté</h4>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${currentUser.color} text-sm font-bold`}>
                            {currentUser.initials}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-800">{currentUser.name}</div>
                            <div className="text-xs text-slate-500 font-medium">{currentUser.roleName}</div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded border border-slate-200/60 leading-relaxed font-sans">
                          {currentUser.role === 'RAM' 
                            ? '✔ Vous disposez des rênes de validation totale. Prêt à apposer vos signatures réglementaires.' 
                            : currentUser.role === 'Quality' 
                              ? '✔ Vous pouvez contribuer et importer des justificatifs techniques. Vos modifications requerront validation.' 
                              : '🔒 Accès Consultation — Vous agissez en tant qu\'auditeur externe, aucune modification autorisée.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom sections dashboard grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ApprovalSection 
                      docs={docs}
                      currentUser={currentUser}
                      onApprove={handleApproveDoc}
                      onRefuse={handleRefuseDoc}
                      onSelectDoc={setSelectedDoc}
                    />
                    
                    <div className="space-y-6">
                      <AlertsSection 
                        docs={docs}
                        currentUser={currentUser}
                        onUpdateStatus={(id, status) => {
                          setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
                        }}
                        onResolveTrainAlert={handleResolveTrainAlert}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: DOSSIER TECHNIQUE (Bento map view) */}
              {activeView === 'dossier' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-2">📁 Cartographie du Dossier Technique</h2>
                    <p className="text-xs text-slate-400">
                      Distribution analytique et validité des éléments du marquage CE par rapport aux exigences réglementaires.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DossierProgress sections={initialSections} docs={docs} />

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
                        <Sliders size={16} className="text-blue-600" />
                        <span>Configuration du Dossier de Référence</span>
                      </h3>
                      <div className="text-xs text-slate-500 leading-relaxed space-y-1">
                        <p><strong>Dispositif Cible :</strong> Tensiomètre Électronique TM-200</p>
                        <p><strong>Classe de Risque :</strong> {ceMarkClass}</p>
                        <p><strong>Organisme Notifié :</strong> TÜV SÜD Product Service (CE 0123)</p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Classe réglementaire du projet :</label>
                          <select 
                            value={ceMarkClass}
                            onChange={(e) => setCeMarkClass(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded p-1.5 text-xs w-full focus:outline-none"
                          >
                            <option value="Class I">Classe I (Faible risque)</option>
                            <option value="Class IIa">Classe IIa (Risque modéré)</option>
                            <option value="Class IIb">Classe IIb (Risque élevé)</option>
                            <option value="Class III">Classe III (Risque critique)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Seuil Alerte Expirations (mois) :</label>
                          <input 
                            type="number" 
                            min={1} 
                            max={12}
                            value={alertThresholdMonths}
                            onChange={(e) => setAlertThresholdMonths(parseInt(e.target.value) || 3)}
                            className="bg-slate-50 border border-slate-200 rounded p-1.5 text-xs w-full focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 3: DOCUMENTS (Full documents management suite) */}
              {activeView === 'documents' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">📄 Répertoire des Pièces Réglementaires</h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Moniteur global des documents constitutifs de la conformité du dispositif médical.
                      </p>
                    </div>
                    {currentUser.role !== 'Audit' && (
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        + Dépôt de fichier
                      </button>
                    )}
                  </div>

                  <DocTable 
                    docs={docs} 
                    currentUser={currentUser}
                    onUpdateStatus={(id, status) => {
                      setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
                      appendAuditLog(`a révisé manuellement le fichier ID : ${id}`, 'orange');
                    }}
                    onSelectDoc={setSelectedDoc}
                    onOpenAddModal={() => setIsAddModalOpen(true)}
                  />
                </div>
              )}

              {/* VIEW 4: APPROVALS (Signatures workflow pool) */}
              {activeView === 'approvals' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900">✅ Centre de Validation de Signatures</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Signatures électroniques de libération des records de conformité GxP annexés.
                    </p>
                  </div>

                  <ApprovalSection 
                    docs={docs}
                    currentUser={currentUser}
                    onApprove={handleApproveDoc}
                    onRefuse={handleRefuseDoc}
                    onSelectDoc={setSelectedDoc}
                  />
                </div>
              )}

              {/* VIEW 5: AUDIT TRAIL */}
              {activeView === 'audit' && (
                <div className="space-y-6">
                  <AuditTrail logs={logs} onExportCSV={handleExportCSV} />
                </div>
              )}

              {/* VIEW 6: ALERTS */}
              {activeView === 'alerts' && (
                <div className="space-y-6">
                  <AlertsSection 
                    docs={docs}
                    currentUser={currentUser}
                    onUpdateStatus={(id, status) => {
                      setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
                    }}
                    onResolveTrainAlert={handleResolveTrainAlert}
                  />
                </div>
              )}

              {/* VIEW 7: UTILISATEURS (User roles list) */}
              {activeView === 'users' && (
                <div className="space-y-6">
                  <UserManagement 
                    users={users}
                    currentUser={currentUser}
                    onAddSimulatedUser={handleAddUser}
                  />
                </div>
              )}

              {/* VIEW 8: PARAMETRES & SYSTEM SETTINGS */}
              {activeView === 'settings' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl mx-auto shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sliders size={18} className="text-blue-600" />
                      <span>Paramètres du Système de Management de la Qualité (SMQ)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Ajuster les règles logicielles pour rester rigoureusement aligné sur l'ISO 13485:2016
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-150">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Double vérification de conformité (Conformity Shield)</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Activer un audit linter sur le format des métadonnées lors d'un upload de fichier</div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setConformityCheckMode(!conformityCheckMode);
                          appendAuditLog(`a ${!conformityCheckMode ? 'activé' : 'désactivé'} l'audit linter de conformité automatique`, 'orange');
                        }}
                        className="text-slate-500 hover:text-slate-800 cursor-pointer text-xs font-bold flex items-center gap-1"
                      >
                        {conformityCheckMode ? (
                          <span className="text-emerald-600">● ACTIF</span>
                        ) : (
                          <span className="text-slate-400">○ INACTIF</span>
                        )}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">Organisme Notifié Associé</label>
                      <input 
                        type="text" 
                        disabled 
                        value="TÜV SÜD Product Service GmbH (CE 0123)"
                        className="bg-slate-100 text-slate-500 font-mono text-xs w-full p-2.5 rounded-lg border border-slate-200 cursor-not-allowed" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">Base de Données de Stockage SMQ</label>
                      <div className="p-3 bg-slate-900 rounded-lg text-slate-300 font-mono text-[10.5px] leading-relaxed flex items-center justify-between">
                        <div>
                          <div className="text-emerald-400 font-bold">● CLOUD DB ONLINE</div>
                          <div className="text-[9.5px] text-slate-400 mt-0.5">Instance : meddoc-production-replica-004</div>
                        </div>
                        <Database size={16} className="text-slate-500" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => {
                          appendAuditLog("a enregistré la configuration globale SMQ", "green");
                          alert("💾 Paramètres sauvegardés !\nLes configurations globales ont été enregistrées avec succès dans la piste d'audit.");
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save size={12} /> Sauvegarder les configurations
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* Upload document Modal Form drawer */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddDocModal 
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            sections={initialSections}
            onAddDoc={handleAddDoc}
            submittedBy={currentUser.name}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
