import { useState, useEffect } from 'react';
import { Search, BookOpen, SlidersHorizontal, Check } from 'lucide-react';
import { CourseCard } from '../components/ui/CourseCard';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Combinação de mocks para o catálogo
const ALL_COURSES = [
  { id: '1', title: 'Bootcamp React Native do Zero ao Profissional', instructor: 'Thiago Silva', thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&h=400&fit=crop', rating: 4.9, students: 12500, duration: '45h', modules: 12, price: 199.90, category: 'Front-end', level: 'Iniciante' },
  { id: '2', title: 'Arquitetura de Microsserviços com Node.js', instructor: 'Amanda Costa', thumbnail: 'https://images.unsplash.com/photo-1627398246654-4f856353d9e0?w=600&h=400&fit=crop', rating: 4.8, students: 8300, duration: '32h', modules: 8, price: 149.90, category: 'Back-end', level: 'Avançado' },
  { id: '3', title: 'UX/UI Design: Criando Experiências', instructor: 'Lucas Ferreira', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', rating: 4.9, students: 15200, duration: '28h', modules: 6, price: 0, category: 'Design', level: 'Iniciante' },
  { id: '4', title: 'Python para Análise de Dados', instructor: 'Juliana Paiva', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', rating: 4.7, students: 9100, duration: '40h', modules: 10, price: 89.90, category: 'Data Science', level: 'Intermediário' },
  { id: '5', title: 'Fundamentos de DevOps e CI/CD', instructor: 'Roberto Almeida', thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98a5233c591?w=600&h=400&fit=crop', rating: 4.8, students: 6400, duration: '25h', modules: 7, price: 129.90, category: 'DevOps', level: 'Intermediário' },
  { id: '6', title: 'Masterizando React e Next.js', instructor: 'Thiago Silva', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop', rating: 4.9, students: 21000, duration: '50h', modules: 15, price: 249.90, category: 'Front-end', level: 'Avançado' },
  { id: '7', title: 'CSS Avançado e Animações Web', instructor: 'Carla Dias', thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=400&fit=crop', rating: 4.8, students: 5400, duration: '18h', modules: 5, price: 59.90, category: 'Front-end', level: 'Intermediário' },
  { id: '8', title: 'Vue.js 3 na Prática', instructor: 'Fernando Souza', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop', rating: 4.7, students: 4200, duration: '22h', modules: 6, price: 0, category: 'Front-end', level: 'Iniciante' },
  { id: '9', title: 'Formação Especialista Node.js', instructor: 'Amanda Costa', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop', rating: 4.9, students: 18000, duration: '60h', modules: 18, price: 299.90, category: 'Back-end', level: 'Avançado' },
  { id: '10', title: 'Java Spring Boot Profissional', instructor: 'Marcos Lima', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop', rating: 4.8, students: 11200, duration: '55h', modules: 14, price: 199.90, category: 'Back-end', level: 'Intermediário' },
  { id: '11', title: 'Go (Golang) para Alta Performance', instructor: 'Roberto Almeida', thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?w=600&h=400&fit=crop', rating: 4.9, students: 3800, duration: '30h', modules: 8, price: 159.90, category: 'Back-end', level: 'Intermediário' },
  { id: '12', title: 'Introdução ao Ethical Hacking', instructor: 'Rafael Gomes', thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop', rating: 4.8, students: 8900, duration: '35h', modules: 10, price: 179.90, category: 'Cyber Security', level: 'Iniciante' },
  { id: '13', title: 'Segurança em Aplicações Web', instructor: 'Diana Martins', thumbnail: 'https://images.unsplash.com/photo-1614064641913-6b1e62c16194?w=600&h=400&fit=crop', rating: 4.9, students: 4500, duration: '28h', modules: 7, price: 149.90, category: 'Cyber Security', level: 'Avançado' },
  { id: '14', title: 'Marketing Digital Completo', instructor: 'Sofia Ribeiro', thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop', rating: 4.7, students: 14500, duration: '42h', modules: 12, price: 129.90, category: 'Marketing', level: 'Iniciante' },
  { id: '15', title: 'Tráfego Pago: Google & Meta Ads', instructor: 'Bruno Carvalho', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', rating: 4.8, students: 9800, duration: '26h', modules: 8, price: 99.90, category: 'Marketing', level: 'Intermediário' },
];

const CATEGORIES = ['Todas', 'Front-end', 'Back-end', 'Data Science', 'Design', 'Cyber Security', 'Marketing', 'DevOps'];
const LEVELS = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];
const PRICES = ['Todos', 'Gratuito', 'Pago'];

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('Todas');
  const [level, setLevel] = useState('Todos');
  const [priceType, setPriceType] = useState('Todos');

  // Atualiza a busca se a URL mudar (ex: navegou do Dashboard)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== search) {
      setSearch(q);
    }
  }, [searchParams]);

  const filteredCourses = ALL_COURSES.filter(course => {
    const matchSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                        course.instructor.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Todas' || course.category === category;
    const matchLevel = level === 'Todos' || course.level === level;
    const matchPrice = priceType === 'Todos' || 
                      (priceType === 'Gratuito' ? course.price === 0 : course.price !== undefined && course.price > 0);
    
    return matchSearch && matchCategory && matchLevel && matchPrice;
  });

  const displayCourses = isAuthenticated ? filteredCourses : filteredCourses.slice(0, 6);

  const clearFilters = () => {
    setCategory('Todas');
    setLevel('Todos');
    setPriceType('Todos');
    setSearch('');
    setSearchParams({});
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 animate-in fade-in duration-500">
      
      <header className={`mb-10 ${!isAuthenticated ? 'text-center' : ''}`}>
        <h1 className="text-3xl font-bold text-white mb-3">Catálogo de Cursos</h1>
        <p className="text-muted">Explore mais de {ALL_COURSES.length} cursos disponíveis na plataforma e impulsione sua carreira.</p>
      </header>

      <div className={`flex flex-col lg:flex-row gap-8 ${!isAuthenticated ? 'justify-center max-w-6xl mx-auto' : ''}`}>
        
        {/* Sidebar Filters - Only for Authenticated Users */}
        {isAuthenticated && (
          <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-6 shadow-lg">
            <div className="flex items-center gap-2 mb-8 text-text font-bold text-lg border-b border-border pb-4">
              <SlidersHorizontal size={20} className="text-accent" />
              Filtros
            </div>

            {/* Categoria */}
            <div className="mb-8">
              <h3 className="font-semibold text-text mb-4 text-xs uppercase tracking-wider">Categoria</h3>
              <div className="space-y-3">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${category === cat ? 'bg-accent border-accent' : 'border-muted group-hover:border-accent'}`}>
                      {category === cat && <Check size={14} className="text-black" />}
                    </div>
                    <span className={`text-sm transition-colors ${category === cat ? 'text-white font-medium' : 'text-muted group-hover:text-white'}`}>{cat}</span>
                    <input type="radio" name="category" value={cat} checked={category === cat} onChange={() => setCategory(cat)} className="hidden" />
                  </label>
                ))}
              </div>
            </div>

            {/* Nível */}
            <div className="mb-8">
              <h3 className="font-semibold text-text mb-4 text-xs uppercase tracking-wider">Nível</h3>
              <div className="space-y-3">
                {LEVELS.map(lvl => (
                  <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${level === lvl ? 'border-accent' : 'border-muted group-hover:border-accent'}`}>
                      {level === lvl && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                    </div>
                    <span className={`text-sm transition-colors ${level === lvl ? 'text-white font-medium' : 'text-muted group-hover:text-white'}`}>{lvl}</span>
                    <input type="radio" name="level" value={lvl} checked={level === lvl} onChange={() => setLevel(lvl)} className="hidden" />
                  </label>
                ))}
              </div>
            </div>

            {/* Preço */}
            <div>
              <h3 className="font-semibold text-text mb-4 text-xs uppercase tracking-wider">Preço</h3>
              <div className="space-y-3">
                {PRICES.map(price => (
                  <label key={price} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${priceType === price ? 'border-accent' : 'border-muted group-hover:border-accent'}`}>
                      {priceType === price && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                    </div>
                    <span className={`text-sm transition-colors ${priceType === price ? 'text-white font-medium' : 'text-muted group-hover:text-white'}`}>{price}</span>
                    <input type="radio" name="price" value={price} checked={priceType === price} onChange={() => setPriceType(price)} className="hidden" />
                  </label>
                ))}
              </div>
            </div>

            {/* Botão limpar filtros */}
            {(category !== 'Todas' || level !== 'Todos' || priceType !== 'Todos' || search !== '') && (
              <button 
                onClick={clearFilters}
                className="mt-8 w-full py-2.5 rounded-lg border border-border text-muted hover:text-white hover:bg-bg transition-colors text-sm font-medium"
              >
                Limpar Filtros
              </button>
            )}

          </div>
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 w-full">
          {/* Search Bar - Only for Authenticated Users */}
          {isAuthenticated && (
            <>
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar por cursos, tecnologias, instrutores..." 
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-muted shadow-sm"
                />
              </div>

              {/* Results Count */}
              <div className="mb-6 flex justify-between items-center">
                <p className="text-muted text-sm">Mostrando <span className="text-white font-medium">{filteredCourses.length}</span> resultados</p>
              </div>
            </>
          )}

          {/* Courses Grid */}
          {displayCourses.length > 0 ? (
            <div className="relative">
              <div className={`grid grid-cols-1 md:grid-cols-2 ${!isAuthenticated ? 'lg:grid-cols-3' : 'xl:grid-cols-3'} gap-6`}>
                {displayCourses.map(course => (
                  <CourseCard key={course.id} {...course} className="w-full" previewMode={!isAuthenticated} />
                ))}
              </div>
              
              {/* Paywall Overlay for Non-Authenticated Users */}
              {!isAuthenticated && (
                <div className="mt-8 relative z-10 flex flex-col items-center justify-center p-10 md:p-14 rounded-2xl bg-[#09090b]/90 backdrop-blur-sm border border-[#27272a] shadow-[0_-30px_60px_rgba(9,9,11,0.9)] -mt-10 md:-mt-24 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Descubra muito mais na VirtuLearning</h3>
                  <p className="text-[#a1a1aa] mb-8 max-w-lg leading-relaxed">
                    Você está vendo apenas uma prévia. Faça login ou cadastre-se gratuitamente para explorar nosso catálogo completo com centenas de cursos disponíveis.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/register" className="bg-accent text-black font-bold px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:scale-105 transition-all text-sm md:text-base">
                      Criar Conta Grátis
                    </Link>
                    <Link to="/login" className="bg-[#18181b] text-white font-bold border border-[#27272a] px-8 py-3.5 rounded-xl hover:bg-[#27272a] transition-all text-sm md:text-base">
                      Fazer Login
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-card border border-border rounded-xl shadow-lg">
              <BookOpen className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhum curso encontrado</h3>
              <p className="text-muted max-w-md mx-auto">Não encontramos nenhum curso que corresponda aos seus filtros atuais. Tente ajustar as opções ou buscar por outros termos.</p>
              <button 
                onClick={clearFilters}
                className="mt-6 bg-accent text-black font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-accentHover transition-colors"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
