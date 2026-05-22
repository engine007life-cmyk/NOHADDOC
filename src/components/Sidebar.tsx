import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  CheckSquare, 
  FileClock, 
  Bell, 
  Users, 
  Settings,
  ShieldCheck,
  Award
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  docsPendingCount: number;
  alertsCount: number;
}

export default function Sidebar({
  activeView,
  setActiveView,
  currentUser,
  users,
  setCurrentUser,
  docsPendingCount,
  alertsCount
}: SidebarProps) {
  return (
    <aside className="w-68 min-h-screen bg-slate-900 flex flex-col shelf-shadow border-r border-slate-800 text-slate-300 select-none">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-md shrink-0">
            <Award size={20} className="text-white animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">NohadDoc</span>
            <span className="text-xs bg-slate-800 text-slate-400 py-0.5 px-1.5 rounded ml-1.5 font-mono">Dossier</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 mt-1.5 font-medium uppercase tracking-wider">
          Gestion du Dossier Technique DM
        </div>
      </div>

      {/* Switch User Session (Interactive Pilot Swapper) */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${currentUser.id === 'user-sara' ? 'bg-indigo-600' : currentUser.id === 'user-karim' ? 'bg-emerald-600' : 'bg-amber-600'} text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0`}>
            {currentUser.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{currentUser.roleName}</div>
          </div>
        </div>
        
        {/* Switch Selector dropdown-like UI */}
        <div className="mt-3">
          <label className="text-[10px] text-slate-500 block mb-1 uppercase font-semibold tracking-wider">Simuler une connexion :</label>
          <select 
            value={currentUser.id}
            onChange={(e) => {
              const matched = users.find(u => u.id === e.target.value);
              if (matched) setCurrentUser(matched);
            }}
            className="w-full text-xs bg-slate-900 border border-slate-700 text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="text-[10px] text-slate-500 font-semibold px-5 mb-2 uppercase tracking-wide">
          Principal
        </div>
        
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-[13.5px] transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-slate-800/80 text-white font-medium border-r-3 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Tableau de bord</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setActiveView('dossier')}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-[13.5px] transition-colors ${
                activeView === 'dossier'
                  ? 'bg-slate-800/80 text-white font-medium border-r-3 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <FolderKanban size={16} />
              <span>Dossier Technique</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => setActiveView('documents')}
              className={`w-full flex items-center justify-between px-5 py-2.5 text-[13.5px] transition-colors ${
                activeView === 'documents'
                  ? 'bg-slate-800/80 text-white font-medium border-r-3 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={16} />
                <span>Documents</span>
              </div>
              <span className="text-[10px] bg-blue-600 text-white font-mono font-bold px-1.5 py-0.5 rounded-full">
                Active
              </span>
            </button>
          </li>
        </ul>

        <div className="text-[10px] text-slate-500 font-semibold px-5 mt-6 mb-2 uppercase tracking-wide">
          Processus
        </div>
        
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveView('approvals')}
              className={`w-full flex items-center justify-between px-5 py-2.5 text-[13.5px] transition-colors ${
                activeView === 'approvals'
                  ? 'bg-slate-800/80 text-white font-medium border-r-3 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckSquare size={16} />
                <span>Approbations</span>
              </div>
              {docsPendingCount > 0 && (
                <span className="text-[10px] bg-amber-600 text-white font-mono font-bold px-2 py-0.5 rounded-full">
                  {docsPendingCount}
                </span>
              )}
            </button>
          </li>

          <li>
            <button
              onClick={() => setActiveView('audit')}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-[13.5px] transition-colors ${
                activeView === 'audit'
                  ? 'bg-slate-800/80 text-white font-medium border-r-3 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <FileClock size={16} />
              <span>Audit Trail</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => setActiveView('alerts')}
              className={`w-full flex items-center justify-between px-5 py-2.5 text-[13.5px] transition-colors ${
                activeView === 'alerts'
                  ? 'bg-slate-800/80 text-white font-medium border-r-3 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell size={16} />
                <span>Alertes</span>
              </div>
              {alertsCount > 0 && (
                <span className="text-[10px] bg-red-600 text-white font-mono font-bold px-2 py-0.5 rounded-full">
                  {alertsCount}
                </span>
              )}
            </button>
          </li>
        </ul>

        <div className="text-[10px] text-slate-500 font-semibold px-5 mt-6 mb-2 uppercase tracking-wide">
          Administration
        </div>
        
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveView('users')}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-[13.5px] transition-colors ${
                activeView === 'users'
                  ? 'bg-slate-800/80 text-white font-medium border-r-3 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <Users size={16} />
              <span>Utilisateurs</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => setActiveView('settings')}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-[13.5px] transition-colors ${
                activeView === 'settings'
                  ? 'bg-slate-800/80 text-white font-medium border-r-3 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <Settings size={16} />
              <span>Paramètres</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer System Status Banner */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
          <span className="font-semibold text-slate-400">Règlement DM 2017/745</span>
        </div>
        <div>Normes harmonisées incluses</div>
        <div className="text-[9px] mt-1 text-slate-600 font-mono">Conformité v2.4a</div>
      </div>
    </aside>
  );
}
