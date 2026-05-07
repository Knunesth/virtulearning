import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../components/ui/Button';

const categories = ['Todos', 'Programação', 'Marketing', 'Design'];

export const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-10 animate-in fade-in duration-500">
      
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-[#121214] border border-[#27272a] h-[300px] mb-16 flex items-center shadow-2xl group cursor-pointer">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Banner background" 
            className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-10 max-w-lg">
          <p className="text-accent text-[10px] font-bold tracking-wider mb-3 uppercase">Oferta Relâmpago</p>
          <h2 className="text-4xl font-bold text-white mb-3 leading-tight">Plano Pro com <br/>50% OFF</h2>
          <p className="text-[#a1a1aa] text-sm mb-6 leading-relaxed">
            Acesso ilimitado a todos os cursos, certificados e mentorias. Apenas R$ 29,90/mês.
          </p>
          <Button className="font-bold px-8 shadow-lg h-11 text-sm transition-transform active:scale-95">
            Assinar Agora
          </Button>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-6 h-1.5 rounded-full bg-accent"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
        </div>
        
        {/* Carousel arrows */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/60 transition-colors backdrop-blur-sm">
           &lt;
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/60 transition-colors backdrop-blur-sm">
           &gt;
        </div>
      </div>

      {/* Catalog Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">Explore Nossos Cursos</h1>
        <p className="text-[#a1a1aa] text-sm">Conhecimento de ponta para transformar sua carreira. Navegue pelo catálogo completo.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#121214] border border-[#27272a] rounded-xl p-3 flex flex-col md:flex-row gap-4 items-center justify-between mb-12 shadow-lg">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" size={16} />
          <input 
            type="text" 
            placeholder="Buscar curso (Python, Design...)" 
            className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-accent transition-colors placeholder:text-[#71717a]"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                activeCategory === cat 
                  ? 'bg-accent text-black font-bold' 
                  : 'bg-[#09090b] border border-[#27272a] text-[#a1a1aa] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid / Error State */}
      <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-500">
        <p className="text-danger text-sm font-medium">Erro ao carregar cursos.</p>
      </div>
      
    </div>
  );
};
