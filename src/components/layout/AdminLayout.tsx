import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, ShieldAlert, Settings, LogOut, Bell, ChevronLeft, BookOpen, DollarSign, FileText } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin',              icon: <LayoutDashboard size={16} />, label: 'Visão Geral' },
    { to: '/admin/users',        icon: <Users size={16} />,           label: 'Usuários' },
    { to: '/admin/courses',      icon: <BookOpen size={16} />,        label: 'Cursos' },
    { to: '/admin/applications', icon: <UserCheck size={16} />,       label: 'Aprovações' },
    { to: '/admin/financials',   icon: <DollarSign size={16} />,      label: 'Financeiro' },
    { to: '/admin/logs',         icon: <FileText size={16} />,        label: 'Logs de Auditoria' },
    { to: '/admin/settings',     icon: <Settings size={16} />,        label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-bg text-text flex">
      {/* Subtle dotted background */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 border-r border-border bg-bg/80 backdrop-blur-md flex flex-col relative z-20 h-screen sticky top-0">
        <div className="p-5">
          <Link to="/" className="text-lg font-bold flex items-center gap-1 mb-5">
             <span className="text-white">Virtu</span><span className="text-danger">Admin.</span>
          </Link>

          <Link to="/dashboard" className="flex items-center gap-2 text-xs text-muted hover:text-white transition-colors mb-6 pb-4 border-b border-border">
            <ChevronLeft size={13} /> Voltar para o App
          </Link>
          
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-danger/10 text-danger font-bold border border-danger/20' 
                      : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Footer */}
        <div className="mt-auto p-5 border-t border-border">
          <div className="flex items-center justify-between">
            <Link to="/admin/profile" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center text-danger font-bold text-xs border border-danger/30 group-hover:scale-105 transition-transform">
                {user?.nome?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white group-hover:text-danger transition-colors truncate max-w-[90px]">{user?.nome || 'Admin'}</span>
                <span className="text-[10px] text-danger font-bold uppercase tracking-wider">Master</span>
              </div>
            </Link>
            <button 
              onClick={handleLogout}
              className="text-muted hover:text-danger p-1.5 rounded-md hover:bg-white/5 transition-all duration-200"
              title="Sair"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col min-h-screen h-screen overflow-y-auto">
        <header className="h-16 px-8 flex items-center justify-between sticky top-0 bg-bg/80 backdrop-blur-md border-b border-[#27272a]/50 z-10">
          <div className="flex items-center gap-2 text-danger bg-danger/10 px-3 py-1 rounded-full border border-danger/20 text-[10px] font-bold uppercase tracking-widest">
            <ShieldAlert size={12} /> Modo Administrador
          </div>
          <button className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted hover:text-white hover:border-danger/50 transition-all duration-200">
            <Bell size={16} />
          </button>
        </header>
        <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
