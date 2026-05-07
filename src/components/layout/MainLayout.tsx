import { Outlet, Link, useLocation } from 'react-router-dom';
import { Moon } from 'lucide-react';

export const MainLayout = () => {
  const location = useLocation();
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
        <div className="max-w-[1000px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold flex items-center gap-1">
             <span className="text-white">Virtu</span><span className="text-accent">Learning.</span>
          </Link>
          <nav className="flex items-center gap-4">
            {isApply ? (
              <Link to="/" className="text-[13px] font-medium text-[#a1a1aa] hover:text-white transition-colors">Voltar para o Início</Link>
            ) : (
              <div className="flex items-center gap-4">
                <button className="text-[#a1a1aa] hover:text-white transition-colors w-8 h-8 rounded-full hover:bg-[#27272a] flex items-center justify-center">
                  <Moon size={16} />
                </button>
                <Link to="/login" className="text-[13px] font-medium text-[#a1a1aa] hover:text-white transition-colors">Fazer Login</Link>
                <Link to="/register" className="bg-[#18181b] border border-[#27272a] text-white px-4 py-2 rounded-md text-[13px] font-medium hover:bg-[#27272a] transition-colors shadow-sm">Cadastre-se</Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 relative z-10 w-full max-w-[1000px] mx-auto">
        <Outlet />
      </main>
      
      <footer className="border-t border-[#27272a] bg-[#09090b] pt-16 pb-8 relative z-10">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
            <div className="md:col-span-1">
              <Link to="/" className="text-xl font-bold flex items-center gap-1 mb-4">
                 <span className="text-white">Virtu</span><span className="text-accent">Learning.</span>
              </Link>
              <p className="text-[#a1a1aa] text-xs leading-relaxed pr-4">
                Transformando futuros através de educação acessível, imersiva e de alta qualidade. Junte-se à nossa comunidade.
              </p>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-bold mb-6">Plataforma</h4>
              <ul className="space-y-4 text-xs text-[#a1a1aa]">
                <li><Link to="/about" className="hover:text-white transition-colors">Sobre Nós</Link></li>
                <li><Link to="/catalog" className="hover:text-white transition-colors">Catálogo</Link></li>
                <li><Link to="/enterprise" className="hover:text-white transition-colors">Para Empresas</Link></li>
                <li><Link to="/apply" className="hover:text-white transition-colors">Torne-se Professor</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-xs text-[#a1a1aa]">
                <li><Link to="/terms" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacidade</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-bold mb-6">Conecte-se</h4>
              <div className="flex gap-4">
                {/* Social circles */}
                <div className="w-8 h-8 rounded-full bg-[#121214] border border-[#27272a] flex items-center justify-center cursor-pointer hover:bg-[#27272a] transition-colors"></div>
                <div className="w-8 h-8 rounded-full bg-[#121214] border border-[#27272a] flex items-center justify-center cursor-pointer hover:bg-[#27272a] transition-colors"></div>
                <div className="w-8 h-8 rounded-full bg-[#121214] border border-[#27272a] flex items-center justify-center cursor-pointer hover:bg-[#27272a] transition-colors"></div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#27272a] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#71717a]">
            <p>© {new Date().getFullYear()} VirtuLearning. Todos os direitos reservados.</p>
            <div className="flex gap-3 mt-4 md:mt-0">
               <div className="w-4 h-4 rounded-full border border-[#71717a] flex items-center justify-center text-[8px]">✓</div>
               <div className="w-4 h-4 rounded-full border border-[#71717a] flex items-center justify-center text-[8px]">🔒</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
