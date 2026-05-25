import { BookOpen, Users, DollarSign, Star, TrendingUp, PlayCircle } from 'lucide-react';
import { useMyCourses } from '../../hooks/useCourses';
import { useAuthStore } from '../../store/useAuthStore';

export const TeacherOverview = () => {
  const { data, isLoading } = useMyCourses();
  const { user } = useAuthStore();
  const courses = data?.data ?? [];

  const totalStudents = courses.reduce((acc, c) => acc + (c._count?.matriculas ?? 0), 0);
  const totalRevenue = courses.reduce((acc, c) => acc + (Number(c.preco) * (c._count?.matriculas ?? 0)), 0);
  const avgRating = 4.8;

  if (isLoading) return <div className="animate-pulse h-40 bg-card rounded-xl" />;

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-24 md:pb-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Painel do Professor</h1>
        <p className="text-muted mt-1 text-sm md:text-base">Bem-vindo de volta, {user?.nome?.split(' ')[0]}! Veja o desempenho dos seus cursos.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <BookOpen size={18} />
            </div>
            <span className="text-sm text-muted font-medium">Cursos</span>
          </div>
          <p className="text-2xl font-bold text-white">{courses.length}</p>
          <p className="text-xs text-muted mt-1">Cursos publicados</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users size={18} />
            </div>
            <span className="text-sm text-muted font-medium">Alunos</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalStudents}</p>
          <p className="text-xs text-muted mt-1">Total matriculados</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center text-success">
              <DollarSign size={18} />
            </div>
            <span className="text-sm text-muted font-medium">Receita</span>
          </div>
          <p className="text-2xl font-bold text-white">R$ {totalRevenue.toFixed(2).replace('.', ',')}</p>
          <p className="text-xs text-muted mt-1">Total estimado</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400">
              <Star size={18} />
            </div>
            <span className="text-sm text-muted font-medium">Avaliação</span>
          </div>
          <p className="text-2xl font-bold text-white">{avgRating}</p>
          <p className="text-xs text-muted mt-1">Média de avaliação</p>
        </div>
      </div>

      {/* Cursos */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <TrendingUp size={18} />
          </div>
          <h2 className="text-xl font-bold text-white">Seus Cursos</h2>
        </div>

        {courses.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <BookOpen className="w-10 h-10 text-muted mx-auto mb-3 opacity-50" />
            <p className="text-white font-bold mb-2">Você ainda não criou nenhum curso</p>
            <p className="text-muted text-sm">Crie seu primeiro curso e comece a ensinar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-accent/50 transition-colors">
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#27272a]">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayCircle size={24} className="text-muted" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate text-sm md:text-base">{course.titulo}</h3>
                    <div className="flex items-center gap-3 md:gap-4 mt-1 text-xs text-muted flex-wrap">
                      <span>{course._count?.matriculas ?? 0} alunos</span>
                      <span>{course._count?.modulos ?? 0} módulos</span>
                      <span className="capitalize">{course.nivel}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end sm:text-right shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t border-border sm:border-none">
                  <p className="font-bold text-white text-sm md:text-base">
                    {Number(course.preco) === 0 ? 'Grátis' : `R$ ${Number(course.preco).toFixed(2).replace('.', ',')}`}
                  </p>
                  <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ml-3 ${course.status === 'publicado' ? 'bg-success/10 text-success' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {course.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
