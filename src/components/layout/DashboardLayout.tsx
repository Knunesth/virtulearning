import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, Home, BookOpen, LayoutDashboard } from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

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
             <Link to="/studio" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg transition-colors"><BookOpen size={20} /> Studio</Link>
          )}
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg transition-colors"><Home size={20} /> Início</Link>
          <Link to="/catalog" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg transition-colors"><BookOpen size={20} /> Catálogo</Link>
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
              {user?.nome?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.nome}</p>
              <p className="text-xs text-muted capitalize">{user?.tipo_usuario}</p>
            </div>
          </div>
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
