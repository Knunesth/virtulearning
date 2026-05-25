import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCourseDetail } from '../../hooks/useCourseDetail';
import type { Lesson } from '../../hooks/useCourseDetail';
import { Button } from '../../components/ui/Button';
import { ChevronDown, ChevronUp, PlayCircle, CheckCircle2, Clock, ChevronLeft, Send, MessageSquare, User } from 'lucide-react';

export const WatchCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const courseId = parseInt(id || '0');
  
  const {
    course,
    isLoadingCourse,
    isEnrolled,
    enrollment,
    completedLessons,
    completeLessonMutation,
  } = useCourseDetail(courseId);

  const [activeTab, setActiveTab] = useState<'visao_geral' | 'perguntas' | 'anotacoes'>('visao_geral');
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [activeVideo, setActiveVideo] = useState<Lesson | null>(null);

  // Initialize active video and expand module
  useEffect(() => {
    if (course && course.modulos.length > 0) {
      const lessonParam = searchParams.get('lesson');
      let targetLesson: Lesson | undefined;
      let targetModuleId: number | undefined;

      if (lessonParam) {
        // Find lesson from param
        for (const mod of course.modulos) {
          const found = mod.aulas.find(a => a.id === parseInt(lessonParam));
          if (found) {
            targetLesson = found;
            targetModuleId = mod.id;
            break;
          }
        }
      } 
      
      if (!targetLesson) {
        // Auto select first lesson
        targetLesson = course.modulos[0].aulas[0];
        targetModuleId = course.modulos[0].id;
      }

      if (targetLesson && !activeVideo) {
        setActiveVideo(targetLesson);
        setSearchParams({ lesson: targetLesson.id.toString() }, { replace: true });
      }

      if (targetModuleId && !expandedModules.includes(targetModuleId)) {
        setExpandedModules(prev => [...prev, targetModuleId as number]);
      }
    }
  }, [course, searchParams, activeVideo, expandedModules, setSearchParams]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]
    );
  };

  const handlePlayLesson = (lesson: Lesson) => {
    if (!isEnrolled && !lesson.gratuita) {
      alert('Você precisa se matricular para assistir a esta aula.');
      return;
    }
    setActiveVideo(lesson);
    setSearchParams({ lesson: lesson.id.toString() });
    
    // Auto-expand module if not expanded
    const moduleOfLesson = course?.modulos.find(m => m.aulas.some(a => a.id === lesson.id));
    if (moduleOfLesson && !expandedModules.includes(moduleOfLesson.id)) {
      setExpandedModules(prev => [...prev, moduleOfLesson.id]);
    }
  };

  const handleCompleteLesson = () => {
    if (activeVideo && isEnrolled && !completedLessons.includes(activeVideo.id)) {
      completeLessonMutation.mutate(activeVideo.id);
    }
  };

  if (isLoadingCourse) {
    return (
      <div className="flex justify-center items-center h-screen bg-bg text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-bg text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Curso não encontrado</h2>
        <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
      </div>
    );
  }

  const progresso = enrollment?.progresso || 0;
  const isVideoCompleted = activeVideo ? completedLessons.includes(activeVideo.id) : false;

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text overflow-hidden h-screen">
      
      {/* HEADER CLASSROOM */}
      <header className="h-14 flex-shrink-0 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/course/${course.id}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="hidden md:inline text-sm font-medium">Voltar ao curso</span>
          </button>
          
          <div className="h-6 w-px bg-[#27272a] hidden md:block"></div>
          
          <h1 className="text-white font-bold text-sm md:text-base line-clamp-1">
            {course.titulo}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {isEnrolled && (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs font-medium text-gray-400">Seu progresso</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${progresso}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-accent w-8">{progresso}%</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT COLUMN: PLAYER & TABS */}
        <div className="flex-1 flex flex-col bg-black overflow-y-auto custom-scrollbar">
          
          {/* VIDEO PLAYER AREA */}
          <div className="w-full bg-black shrink-0 flex flex-col justify-center relative aspect-video xl:max-h-[70vh]">
            {activeVideo && activeVideo.url_video ? (
              <iframe 
                className="w-full h-full absolute inset-0"
                src={activeVideo.url_video.includes('youtube') 
                  ? activeVideo.url_video.replace('watch?v=', 'embed/') 
                  : activeVideo.url_video} 
                title={activeVideo.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 flex-col gap-2">
                <PlayCircle className="w-12 h-12 opacity-50" />
                <p>Nenhum vídeo disponível para esta aula.</p>
              </div>
            )}
          </div>

          {/* TABS MENU */}
          <div className="bg-[#18181b] border-b border-[#27272a] px-6 flex items-center gap-8 shrink-0">
            <button 
              onClick={() => setActiveTab('visao_geral')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'visao_geral' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              Visão Geral
            </button>
            <button 
              onClick={() => setActiveTab('perguntas')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'perguntas' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              Perguntas e Respostas
            </button>
            <button 
              onClick={() => setActiveTab('anotacoes')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'anotacoes' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              Anotações
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="p-6 md:p-8 bg-bg flex-1">
            {activeTab === 'visao_geral' && (
              <div className="max-w-4xl animate-in fade-in duration-300 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{activeVideo?.titulo}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    {course.professor?.nome && (
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" /> Instrutor: {course.professor.nome}
                      </span>
                    )}
                    {activeVideo?.duracao && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {Math.floor(activeVideo.duracao / 60)} minutos
                      </span>
                    )}
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {activeVideo?.descricao || 'Esta aula não possui descrição adicional.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'perguntas' && (
              <div className="max-w-4xl animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Perguntas e Respostas</h2>
                  <Button size="sm">Fazer uma pergunta</Button>
                </div>
                
                {/* TODO: Integração com backend de Dúvidas */}
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-white font-medium mb-1">Nenhuma pergunta nesta aula ainda</h3>
                  <p className="text-gray-400 text-sm mb-4">Seja o primeiro a tirar uma dúvida com o instrutor.</p>
                  
                  {/* Mock form */}
                  <div className="relative max-w-lg mx-auto">
                    <input 
                      type="text" 
                      placeholder="Qual a sua dúvida sobre esta aula?" 
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-accent"
                      disabled
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent" disabled>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mocked Comment */}
                <div className="mt-8 space-y-6 opacity-50 pointer-events-none">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex shrink-0 items-center justify-center text-accent font-bold">
                      A
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">Aluno Exemplo</span>
                        <span className="text-xs text-gray-500">Há 2 dias</span>
                      </div>
                      <p className="text-gray-300 text-sm">Eu não entendi muito bem a parte final do vídeo. Alguém poderia dar outro exemplo?</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'anotacoes' && (
              <div className="max-w-4xl animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Minhas Anotações</h2>
                  <span className="text-xs text-gray-500 bg-[#27272a] px-2 py-1 rounded">Privado</span>
                </div>
                
                {/* TODO: Integração com backend de Anotações Pessoais */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <textarea 
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg p-4 text-sm text-white focus:outline-none focus:border-accent min-h-[150px] resize-y"
                    placeholder="Faça anotações sobre a aula aqui. Suas anotações ficam vinculadas ao tempo do vídeo..."
                    disabled
                  ></textarea>
                  <div className="flex justify-end mt-3">
                    <Button size="sm" disabled>Salvar Anotação</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MODULES SIDEBAR */}
        <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 border-l border-[#27272a] bg-[#18181b] flex flex-col z-10 h-full lg:h-auto overflow-hidden">
          <div className="p-4 border-b border-[#27272a] flex items-center justify-between bg-[#18181b] sticky top-0 z-10">
            <h3 className="font-bold text-white">Conteúdo do curso</h3>
            {activeVideo && isEnrolled && (
              <button 
                onClick={handleCompleteLesson}
                disabled={isVideoCompleted || completeLessonMutation.isPending}
                className={`text-xs px-3 py-1.5 rounded-md font-bold transition-colors flex items-center gap-1.5 ${
                  isVideoCompleted 
                    ? 'bg-success/20 text-success' 
                    : 'bg-[#27272a] text-gray-300 hover:text-white hover:bg-[#3f3f46]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isVideoCompleted ? 'Concluída' : 'Marcar como concluída'}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {course.modulos.map((modulo) => {
              const isExpanded = expandedModules.includes(modulo.id);
              
              // Calculate module stats
              const totalLessons = modulo.aulas.length;
              const completedInModule = modulo.aulas.filter(a => completedLessons.includes(a.id)).length;
              const totalDuration = modulo.aulas.reduce((acc, a) => acc + (a.duracao || 0), 0);
              const durationMin = Math.floor(totalDuration / 60);

              return (
                <div key={modulo.id} className="border-b border-[#27272a]/50">
                  <button 
                    onClick={() => toggleModule(modulo.id)}
                    className={`w-full p-4 flex items-start justify-between transition-colors text-left ${isExpanded ? 'bg-[#27272a]/30' : 'hover:bg-[#27272a]/50'}`}
                  >
                    <div className="flex-1 pr-4">
                      <h4 className="font-bold text-gray-200 text-sm">{modulo.titulo}</h4>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span>{completedInModule} / {totalLessons} | {durationMin} min</span>
                      </p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0 mt-1" />}
                  </button>
                  
                  {isExpanded && (
                    <div className="bg-bg">
                      {modulo.aulas.map((aula, index) => {
                        const isCompleted = completedLessons.includes(aula.id);
                        const isLocked = !isEnrolled && !aula.gratuita;
                        const isActive = activeVideo?.id === aula.id;

                        return (
                          <div 
                            key={aula.id} 
                            onClick={() => !isLocked && handlePlayLesson(aula)}
                            className={`p-3 pl-4 flex items-start gap-3 transition-colors ${
                              isLocked ? 'opacity-50 cursor-not-allowed' : 
                              isActive ? 'bg-accent/10 cursor-pointer' : 
                              'hover:bg-[#27272a]/50 cursor-pointer group'
                            }`}
                          >
                            <div className="pt-0.5">
                              {isCompleted ? (
                                <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-success'}`} />
                              ) : (
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isActive ? 'border-accent' : 'border-gray-600 group-hover:border-accent'}`}>
                                  {isActive && <div className="w-2 h-2 bg-accent rounded-sm" />}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <h5 className={`text-sm ${isActive ? 'text-accent font-bold' : isCompleted ? 'text-gray-400' : 'text-gray-300 group-hover:text-white'} transition-colors leading-snug`}>
                                {index + 1}. {aula.titulo}
                              </h5>
                              <div className="flex items-center gap-2 mt-1">
                                {aula.url_video && <PlayCircle className="w-3 h-3 text-gray-500" />}
                                {aula.duracao && (
                                  <span className="text-xs text-gray-500">
                                    {Math.floor(aula.duracao / 60)} min
                                  </span>
                                )}
                              </div>
                            </div>

                            {!isEnrolled && aula.gratuita && (
                              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-accent/20 text-accent rounded shrink-0 mt-0.5">
                                Grátis
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
    </div>
  );
};
