import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, Home, BookOpen, LayoutDashboard, FileText, Trophy, BrainCircuit, Settings, PlaySquare } from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-bg text-text">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/dashboard" className="text-xl font-bold text-accent">VirtuLearning</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {user?.tipo_usuario === 'admin' && (
             <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg transition-colors"><LayoutDashboard size={20} /> Admin Panel</Link>
          )}
          {user?.tipo_usuario === 'professor' && (
             <Link to="/teacher" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg transition-colors"><BookOpen size={20} /> Painel do Professor</Link>
          )}
          <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/dashboard' ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-bg'}`}><Home size={20} /> Início</Link>
          <Link to="/catalog" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/catalog' ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-bg'}`}><BookOpen size={20} /> Catálogo</Link>
          {user?.tipo_usuario === 'aluno' && (
            <Link to="/my-courses" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/my-courses' ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-bg'}`}><PlaySquare size={20} /> Meus Cursos</Link>
          )}
          
          {user?.tipo_usuario === 'aluno' && (
            <div className="pt-4 mt-4 border-t border-border">
              <p className="px-3 mb-2 text-xs font-semibold text-muted uppercase tracking-wider">Carreira & Evolução</p>
              <Link to="/resume" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/resume' ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-bg'}`}><FileText size={20} /> Meu Currículo</Link>
              <Link to="/ranking" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/ranking' ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-bg'}`}><Trophy size={20} /> Ranking</Link>
              <Link to="/quiz" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/quiz' ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-bg'}`}><BrainCircuit size={20} /> Quiz de Fixação</Link>
            </div>
          )}
        </nav>
        <div className="p-4 border-t border-border">
          <Link 
            to="/profile" 
            className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-bg transition-colors group cursor-pointer w-full"
            title="Configurações de Perfil"
          >
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold group-hover:bg-accent group-hover:text-black transition-colors">
              {user?.nome?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm group-hover:text-accent transition-colors">{user?.nome}</p>
              <p className="text-xs text-muted capitalize">{user?.tipo_usuario}</p>
            </div>
            <Settings size={18} className="text-muted group-hover:text-accent transition-colors" />
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-danger hover:text-danger/80 transition-colors w-full px-2"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 md:hidden">
           <Link to="/dashboard" className="text-lg font-bold text-accent">VirtuLearning</Link>
           <button onClick={handleLogout} className="text-danger"><LogOut size={20}/></button>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
