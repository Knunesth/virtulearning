import { useState, useEffect } from 'react';
import { Search, BookOpen, SlidersHorizontal, Loader2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { CourseCard } from '../components/ui/CourseCard';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCourses } from '../hooks/useCourses';
import { useDebounce } from '../hooks/useDebounce';

const LEVELS = ['Todos', 'iniciante', 'intermediario', 'avancado'];
const LEVEL_LABELS: Record<string, string> = {
  Todos: 'Todos',
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

const PRICES = ['Todos', 'Gratuito', 'Pago'];
const PAGE_SIZE = 12;

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [level, setLevel] = useState('Todos');
  const [priceType, setPriceType] = useState('Todos');
  const [page, setPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  // Sincroniza busca da URL (ex: navegando do Dashboard)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== search) setSearch(q);
  }, [searchParams]);

  // Reseta página ao mudar filtros
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, level, priceType]);

  const { data, isLoading, isFetching } = useCourses({
    search: debouncedSearch || undefined,
    nivel: level !== 'Todos' ? level : undefined,
    page,
    limit: PAGE_SIZE,
  });

  const courses = data?.data ?? [];
  const totalPages = data?.pages ?? 1;
  const totalCourses = data?.total ?? 0;

  // Filtro local por preço (a API não tem esse filtro ainda)
  const filteredCourses = courses.filter((c) => {
    if (priceType === 'Gratuito') return Number(c.preco) === 0;
    if (priceType === 'Pago') return Number(c.preco) > 0;
    return true;
  });

  const displayCourses = isAuthenticated ? filteredCourses : filteredCourses.slice(0, 6);

  const clearFilters = () => {
    setLevel('Todos');
    setPriceType('Todos');
    setSearch('');
    setSearchParams({});
    setPage(1);
  };

  const hasActiveFilters = level !== 'Todos' || priceType !== 'Todos' || search !== '';

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 animate-in fade-in duration-500">

      <header className={`mb-10 ${!isAuthenticated ? 'text-center' : ''}`}>
        <h1 className="text-3xl font-bold text-white mb-3">Catálogo de Cursos</h1>
        <p className="text-muted">
          {isLoading
            ? 'Carregando cursos...'
            : `Explore ${totalCourses} cursos disponíveis na plataforma.`}
        </p>
      </header>

      <div className={`flex flex-col lg:flex-row gap-8 ${!isAuthenticated ? 'justify-center max-w-6xl mx-auto' : ''}`}>

        {/* Sidebar de Filtros — apenas autenticados */}
        {isAuthenticated && (
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-card border border-border rounded-xl p-5 sm:p-6 sticky top-6 shadow-lg">
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="w-full flex items-center justify-between text-text font-bold text-lg lg:cursor-default lg:pointer-events-none border-b lg:border-border border-transparent pb-0 lg:pb-4"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={20} className="text-accent" />
                  Filtros
                </div>
                <div className="lg:hidden text-muted">
                  {isFiltersOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              <div className={`mt-6 lg:mt-0 lg:block ${isFiltersOpen ? 'block' : 'hidden'}`}>
                {/* Nível */}
                <div className="mb-8 pt-4 lg:pt-0 border-t border-border lg:border-t-0">
                  <h3 className="font-semibold text-text mb-4 text-xs uppercase tracking-wider">Nível</h3>
                  <div className="space-y-3">
                    {LEVELS.map((lvl) => (
                      <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${level === lvl ? 'border-accent' : 'border-muted group-hover:border-accent'}`}>
                          {level === lvl && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                        </div>
                        <span className={`text-sm transition-colors ${level === lvl ? 'text-white font-medium' : 'text-muted group-hover:text-white'}`}>
                          {LEVEL_LABELS[lvl]}
                        </span>
                        <input type="radio" name="level" value={lvl} checked={level === lvl} onChange={() => setLevel(lvl)} className="hidden" />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Preço */}
                <div>
                  <h3 className="font-semibold text-text mb-4 text-xs uppercase tracking-wider">Preço</h3>
                  <div className="space-y-3">
                    {PRICES.map((price) => (
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

                {hasActiveFilters && (
                  <button onClick={clearFilters} className="mt-8 w-full py-2.5 rounded-lg border border-border text-muted hover:text-white hover:bg-bg transition-colors text-sm font-medium">
                    Limpar Filtros
                  </button>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* Conteúdo principal */}
        <div className="flex-1 w-full">
          {/* Barra de busca */}
          {isAuthenticated && (
            <>
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                {isFetching && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-muted animate-spin" size={16} />
                )}
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar por cursos, tecnologias, instrutores..."
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-muted shadow-sm"
                />
              </div>

              <div className="mb-6 flex justify-between items-center">
                <p className="text-muted text-sm">
                  Mostrando <span className="text-white font-medium">{displayCourses.length}</span> de <span className="text-white font-medium">{totalCourses}</span> resultados
                </p>
              </div>
            </>
          )}

          {/* Grid de cursos */}
          {isLoading ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${!isAuthenticated ? 'lg:grid-cols-3' : 'xl:grid-cols-3'} gap-6`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 bg-card border border-border rounded-xl animate-pulse" />
              ))}
            </div>
          ) : displayCourses.length > 0 ? (
            <div className="relative">
              <div className={`grid grid-cols-1 md:grid-cols-2 ${!isAuthenticated ? 'lg:grid-cols-3' : 'xl:grid-cols-3'} gap-6`}>
                {displayCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={String(course.id)}
                    title={course.titulo}
                    instructor={course.professor.nome}
                    thumbnail={course.thumbnail ?? 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&h=400&fit=crop'}
                    rating={4.8}
                    students={course._count?.matriculas ?? 0}
                    duration={`${course.duracao_horas}h`}
                    modules={course._count?.modulos ?? 0}
                    price={Number(course.preco)}
                    className="w-full"
                    previewMode={!isAuthenticated}
                  />
                ))}
              </div>

              {/* Paywall para não-autenticados */}
              {!isAuthenticated && (
                <div className="mt-8 relative z-10 flex flex-col items-center justify-center p-10 md:p-14 rounded-2xl bg-[#09090b]/90 backdrop-blur-sm border border-[#27272a] shadow-[0_-30px_60px_rgba(9,9,11,0.9)] -mt-10 md:-mt-24 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Descubra muito mais na VirtuLearning</h3>
                  <p className="text-[#a1a1aa] mb-8 max-w-lg leading-relaxed">
                    Você está vendo apenas uma prévia. Faça login ou cadastre-se gratuitamente para explorar nosso catálogo completo.
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

              {/* Paginação */}
              {isAuthenticated && totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm border border-border rounded-lg text-muted hover:bg-bg transition-colors disabled:opacity-30"
                  >
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <span className="text-sm text-muted">
                    Página <span className="text-white font-medium">{page}</span> de <span className="text-white font-medium">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm border border-border rounded-lg text-muted hover:bg-bg transition-colors disabled:opacity-30"
                  >
                    Próxima <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-card border border-border rounded-xl shadow-lg">
              <BookOpen className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhum curso encontrado</h3>
              <p className="text-muted max-w-md mx-auto">Não encontramos cursos com esses filtros. Tente ajustar as opções.</p>
              <button onClick={clearFilters} className="mt-6 bg-accent text-black font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-accentHover transition-colors">
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
