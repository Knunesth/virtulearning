import { PlayCircle, TrendingUp, BookOpen, Clock, CheckCircle2, Search, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMyEnrollments } from '../hooks/useEnrollments';
import { useCourses } from '../hooks/useCourses';
import { useAuthStore } from '../store/useAuthStore';
import { CourseCard } from '../components/ui/CourseCard';
import { useState } from 'react';

// ── Componente de seção de cursos em scroll horizontal ────────────────────────
const Section = ({ title, icon: Icon, courses }: { title: string; icon: any; courses: any[] }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <Icon size={24} />
      </div>
      <h2 className="text-2xl font-bold text-text">{title}</h2>
    </div>
    <div className="flex gap-6 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
      {courses.map((course) => (
        <div key={course.id} className="snap-start shrink-0">
          <CourseCard {...course} />
        </div>
      ))}
    </div>
  </div>
);

// ── Skeleton de carregamento ──────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="w-72 h-48 bg-card border border-border rounded-xl animate-pulse shrink-0" />
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const { data: enrollmentsData, isLoading: loadingEnrollments } = useMyEnrollments(page, 5);
  const { data: coursesData, isLoading: loadingCourses } = useCourses({ limit: 12 });
  const [searchQuery, setSearchQuery] = useState('');

  const courses = coursesData?.data ?? [];
  const enrollments = enrollmentsData?.data ?? [];
  const totalEnrolled = enrollmentsData?.total ?? 0;

  // Curso em andamento (maior progresso mas não concluído)
  const inProgress = enrollments
    .filter((e) => e.status === 'ativa' && e.progresso > 0)
    .sort((a, b) => b.progresso - a.progresso)[0];

  // Estatísticas rápidas
  const completed = enrollments.filter((e) => e.status === 'concluida').length;
  const totalHours = enrollments.reduce((acc, e) => acc + (e.curso.duracao_horas ?? 0), 0);

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-24 md:pb-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          Bem-vindo de volta, {user?.nome?.split(' ')[0] ?? 'Usuário'}! 👋
        </h1>
        <p className="text-muted">Continue de onde parou ou descubra novos conhecimentos.</p>
      </header>

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{totalEnrolled}</p>
            <p className="text-xs text-muted">Cursos matriculados</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{completed}</p>
            <p className="text-xs text-muted">Cursos concluídos</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{totalHours}h</p>
            <p className="text-xs text-muted">Horas de conteúdo</p>
          </div>
        </div>
      </div>

      {/* Continue Assistindo */}
      {loadingEnrollments ? (
        <div className="bg-card border border-border rounded-xl p-6 mb-12 flex items-center gap-4 animate-pulse">
          <div className="w-72 h-40 rounded-lg bg-border shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-border rounded w-1/4" />
            <div className="h-6 bg-border rounded w-3/4" />
            <div className="h-4 bg-border rounded w-1/2" />
          </div>
        </div>
      ) : inProgress ? (
        <div
          className="bg-card border border-border rounded-xl p-6 mb-12 flex flex-col md:flex-row gap-6 items-center shadow-lg hover:border-accent/50 transition-colors cursor-pointer group"
          onClick={() => navigate('/my-courses')}
        >
          <div className="relative w-full md:w-72 h-40 rounded-lg overflow-hidden shrink-0">
            {inProgress.curso.thumbnail ? (
              <img
                src={inProgress.curso.thumbnail}
                alt={inProgress.curso.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/20 to-blue-500/20 flex items-center justify-center">
                <BookOpen size={40} className="text-accent/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <PlayCircle className="text-white/80 w-12 h-12 group-hover:text-accent transition-colors" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-bg">
              <div className="h-full bg-accent transition-all" style={{ width: `${inProgress.progresso}%` }} />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-accent text-xs font-bold uppercase tracking-wider mb-2">Continue Assistindo</p>
            <h3 className="text-xl font-bold text-text mb-2">{inProgress.curso.titulo}</h3>
            <p className="text-sm text-muted mb-4">Por {inProgress.curso.professor.nome}</p>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span>Progresso: {inProgress.progresso}%</span>
              <span>{inProgress.curso._count.modulos} módulos</span>
            </div>
          </div>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 mb-12 text-center">
          <BookOpen className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
          <h3 className="text-white font-bold mb-2">Nenhuma matrícula ainda</h3>
          <p className="text-muted text-sm mb-4">Explore nosso catálogo e comece a aprender!</p>
          <button
            onClick={() => navigate('/catalog')}
            className="bg-accent text-black font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-accentHover transition-colors"
          >
            Ver Catálogo
          </button>
        </div>
      ) : null}

      {/* Paginação do Dashboard */}
      {enrollmentsData?.totalPages && enrollmentsData.totalPages > 1 && (
        <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border mb-12">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="flex items-center gap-2 px-4 py-2 bg-bg rounded-lg hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm"
          >
            Anterior
          </button>
          <span className="text-muted text-sm font-bold">
            Página {page} de {enrollmentsData.totalPages}
          </span>
          <button 
            disabled={page >= enrollmentsData.totalPages}
            onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-bg rounded-lg hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm"
          >
            Próxima
          </button>
        </div>
      )}

      {/* Cursos da plataforma */}
      {loadingCourses ? (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-border animate-pulse" />
            <div className="h-6 bg-border rounded w-48 animate-pulse" />
          </div>
          <div className="flex gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      ) : courses.length > 0 ? (
        <Section
          title="Em Alta na Plataforma"
          icon={TrendingUp}
          courses={courses.map((c) => ({
            id: String(c.id),
            title: c.titulo,
            instructor: c.professor.nome,
            thumbnail: c.thumbnail ?? 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&h=400&fit=crop',
            rating: 4.8,
            students: c._count?.matriculas ?? 0,
            duration: `${c.duracao_horas}h`,
            modules: c._count?.modulos ?? 0,
            price: Number(c.preco),
          }))}
        />
      ) : null}

      {/* Explore More */}
      <div className="mt-8 bg-[#121214] border border-[#27272a] rounded-2xl p-10 text-center relative overflow-hidden flex flex-col items-center shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6 relative z-10">
          <Compass size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Explore Mais Cursos</h2>
        <p className="text-muted mb-8 max-w-lg relative z-10">
          Ainda não encontrou o que procura? Temos centenas de cursos disponíveis no nosso catálogo completo.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/catalog?q=${searchQuery}`);
          }}
          className="relative w-full max-w-lg z-10"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="O que você quer aprender hoje? (Ex: React, Python, UI/UX)"
            className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-12 pr-32 py-4 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-muted shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-black font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-accentHover transition-colors shadow-md"
          >
            Buscar
          </button>
        </form>
      </div>
    </div>
  );
};
