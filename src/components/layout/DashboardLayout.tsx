import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LogOut, Home, BookOpen, LayoutDashboard, FileText, Trophy, BrainCircuit,
  Settings, PlaySquare, Users, UserCheck, DollarSign, MessageSquare, ChevronDown,
  User, ShieldAlert, X
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const DashboardLayout = () => {
  const { user, logout, viewMode, setViewMode } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  const [isMobileModeSelectorOpen, setIsMobileModeSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const mobileSelectorRef = useRef<HTMLDivElement>(null);

  // Fecha o mode selector ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsModeSelectorOpen(false);
      }
      if (mobileSelectorRef.current && !mobileSelectorRef.current.contains(event.target as Node)) {
        setIsMobileModeSelectorOpen(false);
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
    aluno:     { label: 'Modo Aluno',    icon: <User size={14} className="text-muted" /> },
    professor: { label: 'Modo Professor', icon: <BookOpen size={14} className="text-accent" /> },
    admin:     { label: 'Modo Admin',     icon: <ShieldAlert size={14} className="text-danger" /> },
  };

  const accentColor = viewMode === 'admin' ? 'text-danger' : 'text-accent';
  const accentBg    = viewMode === 'admin' ? 'bg-danger/10 text-danger' : 'bg-accent/10 text-accent';

  // Links de navegação centralizados
  const navLinks = viewMode === 'aluno' ? [
    { to: '/dashboard',  icon: <Home size={18} />,        label: 'Início',         match: (p: string) => p === '/dashboard' },
    { to: '/catalog',    icon: <BookOpen size={18} />,    label: 'Catálogo',       match: (p: string) => p === '/catalog' },
    { to: '/my-courses', icon: <PlaySquare size={18} />,  label: 'Meus Cursos',    match: (p: string) => p === '/my-courses' },
    { to: '/resume',     icon: <FileText size={18} />,    label: 'Meu Currículo',  match: (p: string) => p === '/resume',   group: 'Carreira & Evolução' },
    { to: '/ranking',    icon: <Trophy size={18} />,      label: 'Ranking',        match: (p: string) => p === '/ranking' },
    { to: '/quiz',       icon: <BrainCircuit size={18} />,label: 'Quiz de Fixação',match: (p: string) => p === '/quiz' },
  ] : viewMode === 'professor' ? [
    { to: '/teacher',          icon: <LayoutDashboard size={18} />, label: 'Painel do Professor', match: (p: string) => p === '/teacher' },
    { to: '/teacher/courses',  icon: <BookOpen size={18} />,       label: 'Meus Cursos',         match: (p: string) => p.startsWith('/teacher/courses') },
    { to: '/teacher/messages', icon: <MessageSquare size={18} />,  label: 'Dúvidas',             match: (p: string) => p === '/teacher/messages' },
  ] : [
    { to: '/admin',              icon: <LayoutDashboard size={18} />, label: 'Visão Geral',   match: (p: string) => p === '/admin' },
    { to: '/admin/users',        icon: <Users size={18} />,          label: 'Usuários',       match: (p: string) => p === '/admin/users' },
    { to: '/admin/courses',      icon: <BookOpen size={18} />,       label: 'Cursos',         match: (p: string) => p === '/admin/courses' },
    { to: '/admin/applications', icon: <UserCheck size={18} />,      label: 'Aprovações',     match: (p: string) => p === '/admin/applications' },
    { to: '/admin/financials',   icon: <DollarSign size={18} />,     label: 'Financeiro',     match: (p: string) => p === '/admin/financials' },
    { to: '/admin/logs',         icon: <FileText size={18} />,       label: 'Auditoria',      match: (p: string) => p === '/admin/logs' },
    { to: '/admin/settings',     icon: <Settings size={18} />,       label: 'Ajustes',        match: (p: string) => p === '/admin/settings' },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-white/5 flex items-center justify-center lg:justify-between">
        <Link to="/dashboard" className="text-xl md:text-2xl font-bold flex items-center gap-1">
          <span className="text-white hidden lg:inline">Virtu</span>
          <span className={`${accentColor} hidden lg:inline`}>Learning</span>
          {viewMode === 'admin' && <span className="text-danger hidden lg:inline">.</span>}
          <span className={`lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 font-black text-xl ${accentColor}`}>
            V
          </span>
        </Link>
      </div>

      {/* Mode Selector */}
      {(isAdmin || isTeacher) && (
        <div className="px-4 pt-4">
          <div className="relative" ref={selectorRef}>
            <button
              onClick={() => setIsModeSelectorOpen(!isModeSelectorOpen)}
              className="w-full flex items-center justify-center lg:justify-between px-0 lg:px-3 py-2 bg-[#18181b] lg:bg-[#18181b] border border-transparent rounded-lg text-sm hover:bg-[#27272a] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="lg:mr-0 flex items-center justify-center w-8 h-8 lg:w-auto lg:h-auto rounded-lg bg-white/5 lg:bg-transparent">{modeLabels[viewMode].icon}</div>
                <span className="font-medium text-white hidden lg:inline">{modeLabels[viewMode].label}</span>
              </div>
              <ChevronDown size={14} className="text-muted hidden lg:inline" />
            </button>

            {isModeSelectorOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-[#18181b] border border-[#27272a] rounded-lg shadow-xl overflow-hidden z-50">
                <button
                  onClick={() => { setViewMode('aluno'); setIsModeSelectorOpen(false); navigate('/dashboard'); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[#27272a] transition-colors ${viewMode === 'aluno' ? 'bg-[#27272a] text-white' : 'text-muted'}`}
                >
                  {modeLabels.aluno.icon} Modo Aluno
                </button>
                <button
                  onClick={() => { setViewMode('professor'); setIsModeSelectorOpen(false); navigate('/teacher'); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[#27272a] transition-colors ${viewMode === 'professor' ? 'bg-[#27272a] text-white' : 'text-muted'}`}
                >
                  {modeLabels.professor.icon} Modo Professor
                </button>
                {isAdmin && (
                  <button
                    onClick={() => { setViewMode('admin'); setIsModeSelectorOpen(false); navigate('/admin'); }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[#27272a] transition-colors ${viewMode === 'admin' ? 'bg-[#27272a] text-white' : 'text-muted'}`}
                  >
                    {modeLabels.admin.icon} Modo Admin
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-0.5">
        {navLinks.map((link, i) => {
          const isActive = link.match(location.pathname);
          const showGroupLabel = link.group && (i === 0 || !navLinks[i - 1]?.group);
          return (
            <div key={link.to}>
              {showGroupLabel && (
                <p className="px-3 pt-4 pb-2 text-[10px] lg:text-xs font-semibold text-muted uppercase tracking-wider text-center lg:text-left truncate">
                  <span className="hidden lg:inline">{link.group}</span>
                  <span className="lg:hidden">—</span>
                </p>
              )}
              <Link
                to={link.to}
                title={link.label}
                className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive
                    ? `${accentBg} font-bold`
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex-shrink-0">{link.icon}</div>
                <span className="hidden lg:inline">{link.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Perfil + Logout */}
      <div className="p-4 mt-auto border-t border-white/5">
        <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-white/5 p-2 backdrop-blur-md relative overflow-hidden group/profile">
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/profile:opacity-100 transition-opacity duration-500" />
          <Link
            to={viewMode === 'admin' ? '/admin/profile' : viewMode === 'professor' ? '/teacher/profile' : '/profile'}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-300 relative z-10"
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg overflow-hidden border-2 border-transparent group-hover/profile:border-accent/30 transition-all duration-300 ${viewMode === 'admin' ? 'bg-danger/80 text-white' : 'bg-accent text-black'}`}>
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.nome?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 text-left overflow-hidden hidden lg:block">
              <p className={`font-bold text-sm truncate transition-colors duration-300 ${viewMode === 'admin' ? 'group-hover/profile:text-danger text-white' : 'group-hover/profile:text-accent text-white'}`}>
                {user?.nome}
              </p>
              <p className={`text-[10px] uppercase tracking-widest font-bold mt-0.5 ${viewMode === 'admin' ? 'text-danger/80' : 'text-accent/80'}`}>
                {user?.tipo_usuario}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full items-center justify-center bg-white/5 opacity-0 group-hover/profile:opacity-100 transition-all duration-300 hidden lg:flex">
              <Settings size={14} className="text-white" />
            </div>
          </Link>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-1" />

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full p-2.5 mt-1 rounded-xl text-sm font-bold text-danger hover:text-white hover:bg-danger/90 transition-all duration-300 relative z-10 overflow-hidden group/logout"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-danger/0 via-danger/20 to-danger/0 translate-x-[-100%] group-hover/logout:translate-x-[100%] transition-transform duration-700" />
            <LogOut size={16} className="transform group-hover/logout:-translate-x-1 transition-transform flex-shrink-0" />
            <span className="hidden lg:inline">Sair da Conta</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-bg text-text pb-16 md:pb-0">
      {/* Background pontilhado */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      {/* ── SIDEBAR DESKTOP ────────────────────────── */}
      <aside className="w-20 lg:w-64 flex-shrink-0 border-r border-white/5 bg-bg/95 backdrop-blur-md hidden md:flex flex-col relative z-20 h-screen sticky top-0 overflow-visible lg:overflow-hidden">
        <SidebarContent />
      </aside>

      {/* ── ÁREA PRINCIPAL ────────────────────────────────────────────── */}
      <main className="flex-1 relative z-10 flex flex-col min-h-screen h-screen overflow-y-auto">
        {/* Header mobile */}
        <header className="h-14 px-4 flex md:hidden items-center justify-between sticky top-0 bg-bg/90 backdrop-blur-md border-b border-white/5 z-30">
          
          {/* Mode Selector Mobile */}
          <div className="flex items-center w-8">
            {(isAdmin || isTeacher) && (
              <div className="relative" ref={mobileSelectorRef}>
                <button
                  onClick={() => setIsMobileModeSelectorOpen(!isMobileModeSelectorOpen)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Trocar modo"
                >
                  {modeLabels[viewMode].icon}
                </button>
                {isMobileModeSelectorOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden z-50">
                    <button
                      onClick={() => { setViewMode('aluno'); setIsMobileModeSelectorOpen(false); navigate('/dashboard'); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#27272a] transition-colors ${viewMode === 'aluno' ? 'bg-[#27272a] text-white' : 'text-muted'}`}
                    >
                      {modeLabels.aluno.icon} Modo Aluno
                    </button>
                    <button
                      onClick={() => { setViewMode('professor'); setIsMobileModeSelectorOpen(false); navigate('/teacher'); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#27272a] transition-colors ${viewMode === 'professor' ? 'bg-[#27272a] text-white' : 'text-muted'}`}
                    >
                      {modeLabels.professor.icon} Modo Professor
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { setViewMode('admin'); setIsMobileModeSelectorOpen(false); navigate('/admin'); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#27272a] transition-colors ${viewMode === 'admin' ? 'bg-[#27272a] text-white' : 'text-muted'}`}
                      >
                        {modeLabels.admin.icon} Modo Admin
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Logo centralizado no mobile */}
          <Link to="/dashboard" className="text-base font-bold flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <span className="text-white">Virtu</span>
            <span className={accentColor}>Learning</span>
          </Link>

          {/* Spacer para empurrar o avatar pro lado direito no mobile */}
          <div className="flex items-center gap-2 justify-end w-8">
            <Link
              to={viewMode === 'admin' ? '/admin/profile' : viewMode === 'professor' ? '/teacher/profile' : '/profile'}
              aria-label="Perfil"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm overflow-hidden border-2 border-transparent ${viewMode === 'admin' ? 'bg-danger/80 text-white' : 'bg-accent text-black'}`}>
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.nome?.charAt(0).toUpperCase()
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Conteúdo da página */}
        <div className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto pb-6">
          <Outlet />
        </div>
      </main>

      {/* ── BOTTOM NAVIGATION (MOBILE) ────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#09090b]/95 backdrop-blur-md border-t border-[#27272a] z-50 px-2 py-2">
        <ul className="flex items-center justify-around overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {navLinks.map((link) => {
            const isActive = link.match(location.pathname);
            return (
              <li key={link.to} className="flex-shrink-0">
                <Link
                  to={link.to}
                  className={`flex flex-col items-center justify-center min-w-[4rem] px-2 py-2 rounded-xl transition-all duration-300 ${
                    isActive ? accentBg : 'text-[#71717a] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`transition-transform duration-300 ${isActive ? 'scale-110 mb-1' : 'mb-1'}`}>
                    {link.icon}
                  </div>
                  <span className={`text-[10px] font-medium whitespace-nowrap transition-all duration-300 ${isActive ? 'opacity-100 font-bold' : 'opacity-80'}`}>
                    {link.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
