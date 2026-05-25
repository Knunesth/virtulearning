import { Outlet, Link, useLocation } from 'react-router-dom';
import { Moon, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const MainLayout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const isApply = location.pathname === '/apply';

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-text transition-colors duration-300 relative">
      {/* Subtle dotted background pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      <header className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold flex items-center gap-1">
             <span className="text-white">Virtu</span><span className="text-accent">Learning.</span>
          </Link>
          <nav className="flex items-center gap-4">
            {isApply ? (
              <Link to="/" className="text-[13px] font-medium text-[#a1a1aa] hover:text-white transition-colors">Voltar para o Início</Link>
            ) : (
              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="bg-accent text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.15)]">Meu Painel</Link>
                ) : (
                  <>
                    <Link to="/login" className="text-sm font-bold text-[#a1a1aa] hover:text-white transition-colors">Fazer Login</Link>
                    <Link to="/register" className="bg-[#18181b] border border-[#27272a] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#27272a] transition-colors shadow-sm hover:scale-105 hover:border-white/20">Cadastre-se</Link>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 relative z-10 w-full mx-auto">
        <Outlet />
      </main>
      
      <footer className="border-t border-[#27272a] bg-[#09090b] pt-20 pb-10 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Link to="/" className="text-2xl font-bold flex items-center gap-1 mb-4">
                 <span className="text-white">Virtu</span><span className="text-accent">Learning.</span>
              </Link>
              <p className="text-[#a1a1aa] text-sm leading-relaxed pr-4 font-medium">
                Transformando carreiras através de educação tecnológica acessível, imersiva e de alta qualidade.
              </p>
            </div>
            
            <div>
              <h4 className="text-white text-base font-extrabold mb-6">Plataforma</h4>
              <ul className="space-y-4 text-sm font-medium text-[#a1a1aa]">
                <li><Link to="/about" className="hover:text-accent transition-colors">Sobre Nós</Link></li>
                <li><Link to="/catalog" className="hover:text-accent transition-colors">Catálogo de Cursos</Link></li>
                <li><Link to="/enterprise" className="hover:text-accent transition-colors">Para Empresas</Link></li>
                <li><Link to="/apply" className="hover:text-accent transition-colors">Torne-se Professor</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-base font-extrabold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm font-medium text-[#a1a1aa]">
                <li><Link to="/terms" className="hover:text-accent transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacy" className="hover:text-accent transition-colors">Políticas de Privacidade</Link></li>
                <li><Link to="/cookies" className="hover:text-accent transition-colors">Aviso de Cookies</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-base font-extrabold mb-6">Conecte-se</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-[#121214] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-accent hover:border-accent/50 hover:bg-accent/10 transition-all duration-300">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#121214] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-accent hover:border-accent/50 hover:bg-accent/10 transition-all duration-300">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#121214] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-accent hover:border-accent/50 hover:bg-accent/10 transition-all duration-300">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#27272a] flex flex-col md:flex-row items-center justify-between text-xs font-bold tracking-wide text-[#71717a]">
            <p>© {new Date().getFullYear()} VirtuLearning. Todos os direitos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
               <span className="flex items-center gap-1"><span className="text-green-500">✓</span> Sistema Seguro</span>
               <span className="flex items-center gap-1"><span className="text-accent">★</span> 98% Satisfação</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
