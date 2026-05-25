import { useState } from 'react';
import { BookOpen, Trophy, PlayCircle, CheckCircle2, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { CourseCard } from '../../components/ui/CourseCard';
import { useMyEnrollments } from '../../hooks/useEnrollments';

export const MyCourses = () => {
  const [activeTab, setActiveTab] = useState<'in_progress' | 'completed'>('in_progress');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMyEnrollments(page, 9);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  const allEnrollments = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const inProgressCourses = allEnrollments.filter((e: any) => e.status === 'ativa');
  const completedCourses = allEnrollments.filter((e: any) => e.status === 'concluida');

  const displayedCourses = activeTab === 'in_progress' ? inProgressCourses : completedCourses;

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-10">
      
      {/* Header & Stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Meus Cursos</h1>
        <p className="text-muted mb-8">Acompanhe seu progresso e continue de onde parou.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-bg/60 to-bg/20 p-6 rounded-3xl border border-border/40 backdrop-blur-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <PlayCircle size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{inProgressCourses.length}</p>
              <p className="text-sm font-medium text-muted uppercase tracking-wider">Nesta Página</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-bg/60 to-bg/20 p-6 rounded-3xl border border-border/40 backdrop-blur-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{completedCourses.length}</p>
              <p className="text-sm font-medium text-muted uppercase tracking-wider">Concluídos</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-bg/60 to-bg/20 p-6 rounded-3xl border border-border/40 backdrop-blur-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{total}</p>
              <p className="text-sm font-medium text-muted uppercase tracking-wider">Total Matriculados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8">
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`px-6 py-4 text-sm font-bold transition-colors relative ${
            activeTab === 'in_progress' ? 'text-accent' : 'text-muted hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen size={18} />
            Em Andamento (Pág. {page})
          </div>
          {activeTab === 'in_progress' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-4 text-sm font-bold transition-colors relative ${
            activeTab === 'completed' ? 'text-accent' : 'text-muted hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trophy size={18} />
            Concluídos (Pág. {page})
          </div>
          {activeTab === 'completed' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
          )}
        </button>
      </div>

      {/* Course Grid */}
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayedCourses.length > 0 ? (
          displayedCourses.map((enrollment: any) => (
            <CourseCard
              key={enrollment.id}
              id={String(enrollment.curso.id)}
              title={enrollment.curso.titulo}
              instructor={enrollment.curso.professor.nome}
              thumbnail={enrollment.curso.thumbnail || 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80'}
              rating={5}
              students={0}
              duration={`${enrollment.curso.duracao_horas}h`}
              modules={enrollment.curso._count.modulos}
              progress={enrollment.progresso}
              className="w-full shrink-0"
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-black/20 rounded-3xl border border-border/30 border-dashed">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted mb-4">
              {activeTab === 'in_progress' ? <BookOpen size={32} /> : <Trophy size={32} />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Nenhum curso encontrado nesta página
            </h3>
            <p className="text-muted max-w-md">
              Tente navegar para outras páginas ou matricule-se em novos cursos no catálogo.
            </p>
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border mt-8">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="flex items-center gap-2 px-4 py-2 bg-bg rounded-lg hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm"
          >
            <ArrowLeft size={16} /> Anterior
          </button>
          <span className="text-muted text-sm font-bold">
            Página {page} de {totalPages} (Total: {total})
          </span>
          <button 
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-bg rounded-lg hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm"
          >
            Próxima <ArrowRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
};
