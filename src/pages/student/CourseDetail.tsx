import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseDetail } from '../../hooks/useCourseDetail';
import type { Lesson } from '../../hooks/useCourseDetail';
import { Button } from '../../components/ui/Button';
import { ChevronDown, ChevronUp, PlayCircle, CheckCircle2, Clock, Star, Users, PlaySquare } from 'lucide-react';

export const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courseId = parseInt(id || '0');
  
  const {
    course,
    isLoadingCourse,
    isEnrolled,
    enrollment,
    completedLessons,
    enrollMutation,
  } = useCourseDetail(courseId);

  const [expandedModules, setExpandedModules] = useState<number[]>([]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]
    );
  };

  const handleEnroll = () => {
    enrollMutation.mutate(undefined, {
      onSuccess: () => {
        alert('Matrícula realizada com sucesso!');
      },
      onError: (err: any) => {
        alert(err.response?.data?.error || 'Erro ao realizar matrícula.');
      }
    });
  };

  const handlePlayLesson = (lesson: Lesson) => {
    if (!isEnrolled && !lesson.gratuita) {
      alert('Você precisa se matricular para assistir a esta aula.');
      return;
    }
    navigate(`/course/${courseId}/learn?lesson=${lesson.id}`);
  };

  if (isLoadingCourse) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-white mb-4">Curso não encontrado</h2>
        <Button onClick={() => navigate('/catalog')}>Voltar ao Catálogo</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* HEADER HERO */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg relative">
        {course.thumbnail && (
          <div className="w-full h-64 md:h-80 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
            <img src={course.thumbnail} alt={course.titulo} className="w-full h-full object-cover" />
          </div>
        )}
        <div className={`p-8 ${course.thumbnail ? 'absolute bottom-0 z-20 w-full' : ''}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded uppercase tracking-wider mb-3 inline-block">
                {course.nivel}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">{course.titulo}</h1>
              <p className="text-gray-300 mb-6 max-w-3xl line-clamp-3">{course.descricao}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-white">4.8</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{course._count?.matriculas || 0} alunos</span>
                </div>
                {course.duracao_horas && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duracao_horas}h de conteúdo</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <PlaySquare className="w-4 h-4" />
                  <span>{course.modulos.reduce((acc, m) => acc + m.aulas.length, 0)} aulas</span>
                </div>
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-md p-6 rounded-xl border border-white/10 shrink-0 w-full md:w-80">
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">Instrutor</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    {course.professor?.nome?.charAt(0) || 'P'}
                  </div>
                  <span className="font-bold text-white">{course.professor?.nome}</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4 mt-4">
                {isEnrolled ? (
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-gray-400">Seu progresso</span>
                      <span className="text-sm font-bold text-accent">{enrollment?.progresso || 0}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-4">
                      <div 
                        className="bg-accent h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${enrollment?.progresso || 0}%` }}
                      />
                    </div>
                    <Button className="w-full bg-accent text-black hover:bg-accentHover font-bold" onClick={() => navigate(`/course/${courseId}/learn`)}>
                      Continuar Estudando
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-sm font-medium text-gray-400">Investimento</span>
                      <span className="text-xl font-bold text-accent">
                        {Number(course.preco) > 0 ? `R$ ${Number(course.preco).toFixed(2).replace('.', ',')}` : 'Gratuito'}
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-white text-black hover:bg-gray-200 font-bold" 
                      onClick={handleEnroll}
                      isLoading={enrollMutation.isPending}
                    >
                      Matricular-se Agora
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT LIST */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Conteúdo do Curso</h2>
        
        <div className="space-y-4">
          {course.modulos.map((modulo, index) => {
            const isExpanded = expandedModules.includes(modulo.id);
            const isFirst = index === 0;
            // auto expand first module if none selected yet and enrolled
            const shouldExpand = isExpanded || (isFirst && isEnrolled && expandedModules.length === 0);

            return (
              <div key={modulo.id} className="border border-border rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleModule(modulo.id)}
                  className="w-full bg-[#18181b] hover:bg-[#27272a] p-4 flex items-center justify-between transition-colors text-left"
                >
                  <div>
                    <h3 className="font-bold text-white text-lg">{modulo.titulo}</h3>
                    <p className="text-sm text-gray-400 mt-1">{modulo.aulas.length} aulas</p>
                  </div>
                  {shouldExpand ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>
                
                {shouldExpand && (
                  <div className="bg-bg divide-y divide-border/50">
                    {modulo.aulas.length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-sm">Nenhuma aula neste módulo ainda.</div>
                    )}
                    {modulo.aulas.map((aula) => {
                      const isCompleted = completedLessons.includes(aula.id);
                      const isLocked = !isEnrolled && !aula.gratuita;

                      return (
                        <div 
                          key={aula.id} 
                          onClick={() => !isLocked && handlePlayLesson(aula)}
                          className={`p-4 flex items-center gap-4 transition-colors ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-card cursor-pointer group'}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                          ) : (
                            <PlayCircle className={`w-5 h-5 shrink-0 ${isLocked ? 'text-gray-600' : 'text-gray-400 group-hover:text-accent'}`} />
                          )}
                          
                          <div className="flex-1">
                            <h4 className={`font-medium ${isCompleted ? 'text-gray-300' : 'text-white group-hover:text-accent'} transition-colors`}>
                              {aula.titulo}
                            </h4>
                            {!isLocked && aula.duracao && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {Math.floor(aula.duracao / 60)} min
                              </p>
                            )}
                          </div>

                          {!isEnrolled && aula.gratuita && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-accent/20 text-accent rounded shrink-0">
                              Prévia Grátis
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
