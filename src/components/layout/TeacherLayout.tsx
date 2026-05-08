import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutGrid, BookOpen, MessageSquare, User, LogOut, Bell } from 'lucide-react';

export const TeacherLayout = () => {
  const navItems = [
    { to: '/teacher', icon: <LayoutGrid size={18} />, label: 'Visão Geral' },
    { to: '/teacher/courses', icon: <BookOpen size={18} />, label: 'Gerenciar Cursos' },
    { to: '/teacher/messages', icon: <MessageSquare size={18} />, label: 'Dúvidas Alunos' },
    { to: '/teacher/profile', icon: <User size={18} />, label: 'Meu Perfil' },
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
      <aside className="w-[260px] flex-shrink-0 border-r border-border bg-bg/80 backdrop-blur-md flex flex-col relative z-20 h-screen sticky top-0">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold flex items-center gap-1 mb-10">
             <span className="text-white">Virtu</span><span className="text-accent">Teacher.</span>
          </Link>
          
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to}
                end={item.to === '/teacher'}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-accent/10 text-accent font-bold' 
                      : 'text-muted hover:text-white hover:bg-white/5'
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
        <div className="mt-auto p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black font-bold">
                UT
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Usuário</span>
                <span className="text-xs text-muted">@usuario</span>
              </div>
            </div>
            <button className="text-muted hover:text-danger p-2 rounded-md hover:bg-white/5 transition-all duration-200">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col min-h-screen">
        <header className="h-20 px-10 flex items-center justify-end sticky top-0 bg-bg/80 backdrop-blur-md border-b border-transparent z-10">
          <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted hover:text-white hover:border-accent/50 transition-all duration-200">
            <Bell size={18} />
          </button>
        </header>
        <div className="flex-1 p-10 max-w-[1200px] w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
