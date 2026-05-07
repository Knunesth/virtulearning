import { Outlet, Link, useLocation } from 'react-router-dom';
import { ParticleWave } from '../ui/ParticleWave';

export const AuthLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] text-text p-4 md:p-8 relative overflow-hidden">
      {/* Interactive Particle Wave Background */}
      <ParticleWave />
      
      <div className="z-10 w-full max-w-[900px] bg-[#121214]/90 backdrop-blur-sm border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-[45%] bg-[#09090b] border-r border-[#27272a] p-10 flex-col relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent rounded-full blur-[100px] opacity-10 pointer-events-none" />
          
          <div className="relative z-10 flex-1">
            <Link to="/" className="text-2xl font-bold flex items-center gap-1 mb-1">
              <span className="text-white">Virtu</span><span className="text-accent">Learning.</span>
            </Link>
            <p className="text-[#a1a1aa] text-xs font-medium tracking-wide">Aprenda a tecnologia que o mercado busca.</p>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-black border-2 border-[#09090b] z-30">A</div>
                <div className="w-8 h-8 rounded-full bg-[#3f3f46] flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#09090b] z-20">B</div>
                <div className="w-8 h-8 rounded-full bg-accentHover flex items-center justify-center text-[10px] font-bold text-black border-2 border-[#09090b] z-10">C</div>
              </div>
              <p className="text-[11px] text-[#71717a] font-medium"><strong className="text-white font-bold">2.218</strong> alunos estudando agora</p>
            </div>
            
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 shadow-lg relative">
              <div className="absolute -left-[1px] top-4 w-[3px] h-8 bg-accent rounded-r-md"></div>
              <p className="text-[13px] italic text-[#d4d4d8] mb-3 leading-relaxed">"Consegui meu primeiro emprego como dev depois do curso de React. Recomendo demais!"</p>
              <p className="text-[11px] font-bold text-accent">@mariasilva_dd</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Content */}
        <div className="w-full md:w-[55%] p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-[320px] mx-auto w-full">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-[#27272a] mb-8 pb-3">
              <Link 
                to="/login" 
                className={`text-[13px] font-bold relative transition-colors ${isLogin ? 'text-white' : 'text-[#71717a] hover:text-[#d4d4d8]'}`}
              >
                Entrar
                {isLogin && <span className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-accent rounded-t-full"></span>}
              </Link>
              <Link 
                to="/register" 
                className={`text-[13px] font-bold relative transition-colors ${!isLogin ? 'text-white' : 'text-[#71717a] hover:text-[#d4d4d8]'}`}
              >
                Criar Conta
                {!isLogin && <span className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-accent rounded-t-full"></span>}
              </Link>
            </div>
            
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
