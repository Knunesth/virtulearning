import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  LogOut, Home, BookOpen, LayoutDashboard, FileText, Trophy, BrainCircuit, 
  Settings, PlaySquare, Users, UserCheck, DollarSign, MessageSquare, ChevronDown, User, ShieldAlert 
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const DashboardLayout = () => {
  const { user, logout, viewMode, setViewMode } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsModeSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isTeacher = user?.tipo_usuario === 'professor';
  const isAdmin = user?.tipo_usuario === 'admin';

  const modeLabels = {
    aluno: { label: 'Modo Aluno', icon: <User size={14} className="text-muted" /> },
    professor: { label: 'Modo Professor', icon: <BookOpen size={14} className="text-accent" /> },
    admin: { label: 'Modo Admin', icon: <ShieldAlert size={14} className="text-danger" /> }
  };

  return (
    <div className="min-h-screen flex bg-bg text-text">
      {/* Subtle dotted background */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-transparent bg-bg/95 backdrop-blur-md hidden md:flex flex-col relative z-20 h-screen sticky top-0 overflow-hidden">
        <div className="p-6 border-b border-transparent">
          <Link to="/dashboard" className="text-2xl font-bold flex items-center gap-1 mb-6">
             <span className="text-white">Virtu</span>
             <span className={viewMode === 'admin' ? 'text-danger' : 'text-accent'}>Learning</span>
             {viewMode === 'admin' && <span className="text-danger">.</span>}
          </Link>

          {/* Mode Selector */}
          {(isAdmin || isTeacher) && (
            <div className="relative" ref={selectorRef}>
              <button 
                onClick={() => setIsModeSelectorOpen(!isModeSelectorOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-[#18181b] border border-transparent rounded-lg text-sm hover:bg-[#27272a] transition-colors"
              >
                <div className="flex items-center gap-2">
                  {modeLabels[viewMode].icon}
                  <span className="font-medium text-white">{modeLabels[viewMode].label}</span>
                </div>
                <ChevronDown size={14} className="text-muted" />
              </button>

              {isModeSelectorOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-[#18181b] border border-[#27272a] rounded-lg shadow-xl overflow-hidden z-50">
                  <button 
                    onClick={() => { setViewMode('aluno'); setIsModeSelectorOpen(false); navigate('/dashboard'); }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[#27272a] transition-colors ${viewMode === 'aluno' ? 'bg-[#27272a] text-white' : 'text-muted'}`}
                  >
                    {modeLabels.aluno.icon}
                    Modo Aluno
                  </button>
                  <button 
                    onClick={() => { setViewMode('professor'); setIsModeSelectorOpen(false); navigate('/teacher'); }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[#27272a] transition-colors ${viewMode === 'professor' ? 'bg-[#27272a] text-white' : 'text-muted'}`}
                  >
                    {modeLabels.professor.icon}
                    Modo Professor
                  </button>
                  {isAdmin && (
                    <button 
                      onClick={() => { setViewMode('admin'); setIsModeSelectorOpen(false); navigate('/admin'); }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[#27272a] transition-colors ${viewMode === 'admin' ? 'bg-[#27272a] text-white' : 'text-muted'}`}
                    >
                      {modeLabels.admin.icon}
                      Modo Admin
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          
          {/* MODO ALUNO */}
          {viewMode === 'aluno' && (
            <div className="space-y-1">
              <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/dashboard' ? 'bg-accent/10 text-accent font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                <Home size={18} /> Início
              </Link>
              <Link to="/catalog" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/catalog' ? 'bg-accent/10 text-accent font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                <BookOpen size={18} /> Catálogo
              </Link>
              <Link to="/my-courses" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/my-courses' ? 'bg-accent/10 text-accent font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                <PlaySquare size={18} /> Meus Cursos
              </Link>
              
              <div className="pt-4 mt-2">
                <p className="px-3 mb-2 text-xs font-semibold text-muted uppercase tracking-wider">Carreira & Evolução</p>
                <Link to="/resume" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/resume' ? 'bg-accent/10 text-accent font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                  <FileText size={18} /> Meu Currículo
                </Link>
                <Link to="/ranking" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/ranking' ? 'bg-accent/10 text-accent font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                  <Trophy size={18} /> Ranking
                </Link>
                <Link to="/quiz" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/quiz' ? 'bg-accent/10 text-accent font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                  <BrainCircuit size={18} /> Quiz de Fixação
                </Link>
              </div>
            </div>
          )}

          {/* MODO PROFESSOR */}
          {viewMode === 'professor' && (
            <div className="space-y-1">
              <Link to="/teacher" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/teacher' ? 'bg-accent/10 text-accent font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                <LayoutDashboard size={18} /> Painel do Professor
              </Link>
              <Link to="/teacher/courses" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname.startsWith('/teacher/courses') ? 'bg-accent/10 text-accent font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                <BookOpen size={18} /> Meus Cursos
              </Link>
              <Link to="/teacher/messages" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/teacher/messages' ? 'bg-accent/10 text-accent font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                <MessageSquare size={18} /> Dúvidas dos Alunos
              </Link>
            </div>
          )}

          {/* MODO ADMINISTRADOR */}
          {viewMode === 'admin' && (
            <div className="space-y-1">
              <Link to="/admin" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/admin' ? 'bg-danger/10 text-danger font-bold' : 'text-gray-300 hover:text-danger hover:bg-white/5'}`}>
                <LayoutDashboard size={18} /> Visão Geral
              </Link>
              <Link to="/admin/users" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/admin/users' ? 'bg-danger/10 text-danger font-bold' : 'text-gray-300 hover:text-danger hover:bg-white/5'}`}>
                <Users size={18} /> Usuários
              </Link>
              <Link to="/admin/courses" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/admin/courses' ? 'bg-danger/10 text-danger font-bold' : 'text-gray-300 hover:text-danger hover:bg-white/5'}`}>
                <BookOpen size={18} /> Todos os Cursos
              </Link>
              <Link to="/admin/applications" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/admin/applications' ? 'bg-danger/10 text-danger font-bold' : 'text-gray-300 hover:text-danger hover:bg-white/5'}`}>
                <UserCheck size={18} /> Aprovações
              </Link>
              <Link to="/admin/financials" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/admin/financials' ? 'bg-danger/10 text-danger font-bold' : 'text-gray-300 hover:text-danger hover:bg-white/5'}`}>
                <DollarSign size={18} /> Financeiro
              </Link>
              <Link to="/admin/logs" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/admin/logs' ? 'bg-danger/10 text-danger font-bold' : 'text-gray-300 hover:text-danger hover:bg-white/5'}`}>
                <FileText size={18} /> Auditoria
              </Link>
              <Link to="/admin/settings" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/admin/settings' ? 'bg-danger/10 text-danger font-bold' : 'text-gray-300 hover:text-danger hover:bg-white/5'}`}>
                <Settings size={18} /> Configurações
              </Link>
            </div>
          )}

        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-white/5 p-2 backdrop-blur-md relative overflow-hidden group/profile">
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/profile:opacity-100 transition-opacity duration-500"></div>
            
            <Link 
              to={viewMode === 'admin' ? "/admin/profile" : (viewMode === 'professor' ? "/teacher/profile" : "/profile")} 
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-300 relative z-10"
              title="Configurações de Perfil"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black transition-transform duration-300 group-hover/profile:scale-105 group-hover/profile:rotate-3 shadow-lg overflow-hidden border-2 border-transparent group-hover/profile:border-accent/30 ${viewMode === 'admin' ? 'bg-danger/80 text-white' : 'bg-accent text-black'}`}>
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.nome?.charAt(0).toUpperCase()
                )}
              </div>
              
              <div className="flex-1 text-left overflow-hidden">
                <p className={`font-bold text-sm truncate transition-colors duration-300 ${viewMode === 'admin' ? 'group-hover/profile:text-danger text-white' : 'group-hover/profile:text-accent text-white'}`}>
                  {user?.nome}
                </p>
                <p className={`text-[10px] uppercase tracking-widest font-bold mt-0.5 ${viewMode === 'admin' ? 'text-danger/80' : 'text-accent/80'}`}>
                  {user?.tipo_usuario}
                </p>
              </div>
              
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 opacity-0 group-hover/profile:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/profile:translate-x-0">
                <Settings size={14} className="text-white" />
              </div>
            </Link>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-1"></div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full p-2.5 mt-1 rounded-xl text-sm font-bold text-danger hover:text-white hover:bg-danger/90 transition-all duration-300 relative z-10 overflow-hidden group/logout"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-danger/0 via-danger/20 to-danger/0 translate-x-[-100%] group-hover/logout:translate-x-[100%] transition-transform duration-700"></div>
              <LogOut size={16} className="transform group-hover/logout:-translate-x-1 transition-transform" /> 
              Sair da Conta
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col min-h-screen h-screen overflow-y-auto">
        <header className="h-16 px-6 md:px-8 flex items-center justify-between sticky top-0 bg-bg/90 backdrop-blur-md border-b border-transparent z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Title */}
            <Link to="/dashboard" className="text-lg font-bold flex items-center gap-1 md:hidden">
              <span className="text-white">Virtu</span>
              <span className={viewMode === 'admin' ? 'text-danger' : 'text-accent'}>Learning</span>
              {viewMode === 'admin' && <span className="text-danger">.</span>}
            </Link>
          </div>
          
          <button onClick={handleLogout} className="md:hidden text-danger p-2 hover:bg-white/5 rounded-full"><LogOut size={20}/></button>
        </header>
        <div className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
