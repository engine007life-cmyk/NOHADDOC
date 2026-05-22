import { User } from '../types';
import { ShieldAlert, Users, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onAddSimulatedUser: (user: Omit<User, 'id'>) => void;
}

export default function UserManagement({ users, currentUser, onAddSimulatedUser }: UserManagementProps) {
  const handleAddNewUser = () => {
    const name = prompt("Saisir le nom complet de l'utilisateur :");
    if (!name) return;
    const email = prompt("Saisir son adresse email :");
    if (!email) return;
    const roleChoice = prompt("Saisir son rôle (RAM, Quality, ou Audit) :");
    if (!roleChoice) return;

    let role: 'RAM' | 'Quality' | 'Audit' = 'Audit';
    let roleName = 'Auditeur Externe';
    let permissions = 'Consulter seulement — Accès temporaire';
    let color = 'bg-slate-500';

    if (roleChoice.toLowerCase().includes('ram') || roleChoice.toLowerCase().includes('reg')) {
      role = 'RAM';
      roleName = 'Regulatory Affairs Manager';
      permissions = 'Tout faire — Approuver, créer, supprimer';
      color = 'bg-indigo-900';
    } else if (roleChoice.toLowerCase().includes('qua') || roleChoice.toLowerCase().includes('resp')) {
      role = 'Quality';
      roleName = 'Responsable Qualité';
      permissions = 'Créer & soumettre — Pas approuver';
      color = 'bg-emerald-600';
    }

    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    onAddSimulatedUser({
      initials,
      name,
      email,
      role,
      roleName,
      permissions,
      color
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            <span>Gestion des utilisateurs — Contrôle des rôles et habilitations</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chaque utilisateur dispose de règles d'accès personnalisées adaptées à ses missions GxP
          </p>
        </div>
        <button
          onClick={handleAddNewUser}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus size={14} /> Ajouter un utilisateur
        </button>
      </div>

      <div className="p-5">
        <div className="text-xs bg-slate-50 border border-slate-200 text-slate-600 p-3 rounded-lg mb-5 leading-relaxed">
          🔒 <strong>Sécurité basée sur les rôles (RBAC) :</strong> La session utilisateur courante s'adapte en temps réel. Utilisez le sélecteur d'identité du menu latéral gauche pour changer de profil et tester les différences d'habilitation.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.map((u) => {
            const isSelf = currentUser.id === u.id;
            
            let roleBadgeStyles = 'bg-slate-100 text-slate-600';
            if (u.role === 'RAM') roleBadgeStyles = 'bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold';
            if (u.role === 'Quality') roleBadgeStyles = 'bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold';
            
            return (
              <motion.div
                key={u.id}
                whileHover={{ y: -1 }}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-4 bg-white ${
                  isSelf 
                    ? 'border-blue-500 shadow-sm bg-blue-50/10' 
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full ${u.color} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                    {u.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-slate-900 text-xs sm:text-[13.5px] truncate">{u.name}</h4>
                      {isSelf && (
                        <span className="text-[9px] bg-blue-500 text-white px-1 py-0.2 rounded font-mono font-bold uppercase">
                          Moi
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{u.email}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-1 font-sans">{u.roleName}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${roleBadgeStyles}`}>
                    {u.role === 'RAM' ? 'RAM' : u.role === 'Quality' ? 'Qualité' : 'Auditeur'}
                  </span>
                  <span className="text-slate-400 text-right max-w-[150px] truncate">
                    {u.permissions}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
