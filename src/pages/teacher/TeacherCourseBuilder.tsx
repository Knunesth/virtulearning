import { useState, useEffect } from 'react';
import { ArrowLeft, GripVertical, Plus, PlayCircle, FileText, Layout, Trash2, Edit2, AlertCircle, Save } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useCourseBuilder } from '../../hooks/useCourseBuilder';

export const TeacherCourseBuilder = () => {
  const { id } = useParams();
  const { course, createModule, updateModule, deleteModule, createLesson, updateLesson, deleteLesson } = useCourseBuilder(id!);
  
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);

  // States for adding module
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  // States for adding lesson
  const [addingLessonToModule, setAddingLessonToModule] = useState<number | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');

  // Lesson editing state
  const [editLessonData, setEditLessonData] = useState<any>(null);

  const modulos = course.data?.modulos || [];
  const activeLesson = modulos.flatMap((m: any) => m.aulas).find((l: any) => l.id === activeLessonId);

  useEffect(() => {
    if (activeLesson) {
      setEditLessonData({
        titulo: activeLesson.titulo,
        descricao: activeLesson.descricao || '',
        url_video: activeLesson.url_video || '',
        duracaoMinutos: Math.floor((activeLesson.duracao || 0) / 60)
      });
    } else {
      setEditLessonData(null);
    }
  }, [activeLesson]);

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    await createModule.mutateAsync({ titulo: newModuleTitle, ordem: modulos.length });
    setNewModuleTitle('');
    setIsAddingModule(false);
  };

  const handleEditModule = async (mod: any) => {
    const novoTitulo = window.prompt('Editar título do módulo:', mod.titulo);
    if (novoTitulo && novoTitulo.trim() !== mod.titulo) {
      await updateModule.mutateAsync({ id: mod.id, titulo: novoTitulo });
    }
  };

  const handleDeleteModule = async (modId: number) => {
    if (window.confirm('Tem certeza que deseja deletar este módulo e todas as suas aulas?')) {
      if (activeLessonId && modulos.find((m:any) => m.id === modId)?.aulas?.some((a:any) => a.id === activeLessonId)) {
        setActiveLessonId(null);
      }
      await deleteModule.mutateAsync(modId);
    }
  };

  const handleAddLesson = async (moduleId: number) => {
    if (!newLessonTitle.trim()) return;
    const moduleItem = modulos.find((m: any) => m.id === moduleId);
    await createLesson.mutateAsync({ moduleId, titulo: newLessonTitle, ordem: moduleItem?.aulas?.length || 0 });
    setNewLessonTitle('');
    setAddingLessonToModule(null);
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta aula?')) {
      if (activeLessonId === lessonId) setActiveLessonId(null);
      await deleteLesson.mutateAsync(lessonId);
    }
  };

  const handleSaveLesson = async () => {
    if (!editLessonData || !activeLessonId) return;
    await updateLesson.mutateAsync({
      id: activeLessonId,
      titulo: editLessonData.titulo,
      descricao: editLessonData.descricao,
      url_video: editLessonData.url_video,
      duracao: parseInt(editLessonData.duracaoMinutos) * 60 || 0
    });
    alert('Aula salva com sucesso!');
  };

  const anyError = createModule.isError || updateModule.isError || deleteModule.isError ||
                   createLesson.isError || updateLesson.isError || deleteLesson.isError;

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <Link to="/teacher/courses" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-colors border border-white/5">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Construtor de Conteúdo</p>
            <h1 className="text-2xl font-black text-white">{course.data?.titulo || 'Carregando...'}</h1>
          </div>
        </div>
      </div>

      {anyError && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium flex items-center gap-2">
          <AlertCircle size={18} /> Ocorreu um erro ao salvar as alterações.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Modules & Lessons */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layout size={20} className="text-accent" /> Grade Curricular
            </h2>
          </div>

          {course.isLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {modulos.map((module: any) => (
                <div key={module.id} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                  {/* Module Header */}
                  <div className="p-4 bg-black/40 border-b border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <button className="cursor-grab text-muted hover:text-white transition-colors">
                        <GripVertical size={16} />
                      </button>
                      <h3 className="font-bold text-sm text-white">{module.titulo}</h3>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditModule(module)} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-muted hover:text-accent transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteModule(module.id)} disabled={deleteModule.isPending} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-muted hover:text-danger transition-colors disabled:opacity-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Lessons List */}
                  <div className="p-2 space-y-1">
                    {module.aulas?.map((lesson: any) => (
                      <div 
                        key={lesson.id} 
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border ${activeLessonId === lesson.id ? 'bg-accent/10 border-accent/20' : 'hover:bg-white/5 border-transparent'}`}
                      >
                        <div className="flex items-center gap-3">
                          <button className="cursor-grab text-muted/50 hover:text-muted transition-colors">
                            <GripVertical size={14} />
                          </button>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeLessonId === lesson.id ? 'bg-accent/20 text-accent' : 'bg-black/40 text-muted'}`}>
                            {lesson.url_video ? <PlayCircle size={16} /> : <FileText size={16} />}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${activeLessonId === lesson.id ? 'text-white' : 'text-muted group-hover:text-gray-300'}`}>
                              {lesson.titulo}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-muted">{Math.floor((lesson.duracao||0)/60)} min</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }} className="text-muted hover:text-danger transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Lesson Input */}
                    {addingLessonToModule === module.id ? (
                      <div className="p-2 bg-black/40 border border-white/10 rounded-xl mt-2 flex gap-2">
                        <Input 
                          autoFocus
                          placeholder="Título da aula..." 
                          value={newLessonTitle} 
                          onChange={(e) => setNewLessonTitle(e.target.value)} 
                          className="h-9 text-sm"
                          onKeyDown={(e) => {
                            if(e.key === 'Enter') handleAddLesson(module.id);
                            if(e.key === 'Escape') setAddingLessonToModule(null);
                          }}
                        />
                        <Button size="sm" onClick={() => handleAddLesson(module.id)} disabled={createLesson.isPending}>Salvar</Button>
                      </div>
                    ) : (
                      <button onClick={() => { setAddingLessonToModule(module.id); setNewLessonTitle(''); }} className="w-full mt-2 py-3 border border-dashed border-white/10 rounded-xl text-xs font-bold text-muted hover:text-white hover:border-accent/30 hover:bg-accent/5 transition-all flex items-center justify-center gap-2">
                        <Plus size={14} /> Adicionar Aula
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Module Input */}
              {isAddingModule ? (
                <div className="p-4 bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-3 shadow-xl">
                  <Input 
                    autoFocus
                    placeholder="Título do novo módulo..." 
                    value={newModuleTitle} 
                    onChange={(e) => setNewModuleTitle(e.target.value)} 
                    onKeyDown={(e) => {
                      if(e.key === 'Enter') handleAddModule();
                      if(e.key === 'Escape') setIsAddingModule(false);
                    }}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsAddingModule(false)}>Cancelar</Button>
                    <Button size="sm" onClick={handleAddModule} disabled={createModule.isPending}>Salvar Módulo</Button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setIsAddingModule(true); setNewModuleTitle(''); }} className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-sm font-bold text-muted hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all shadow-lg flex items-center justify-center gap-2">
                  <Plus size={18} /> Novo Módulo
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Editor for Active Lesson */}
        <div className="lg:col-span-2">
          {activeLesson ? (
            <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <div>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">Editando Aula</p>
                  <h3 className="text-xl font-bold text-white">{activeLesson.titulo}</h3>
                </div>
                <div className="flex items-center gap-2">
                   <Button onClick={handleSaveLesson} isLoading={updateLesson.isPending} className="font-bold bg-accent text-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                     <Save size={16} className="mr-2" /> Salvar Aula
                   </Button>
                </div>
              </div>

              {/* Formulário de Aula */}
              {editLessonData && (
                <div className="space-y-6 relative z-10">
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Título da Aula</label>
                    <Input 
                      value={editLessonData.titulo} 
                      onChange={(e) => setEditLessonData({...editLessonData, titulo: e.target.value})}
                      placeholder="Ex: Introdução ao assunto"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Duração (Minutos)</label>
                      <Input 
                        type="number" 
                        value={editLessonData.duracaoMinutos} 
                        onChange={(e) => setEditLessonData({...editLessonData, duracaoMinutos: e.target.value})}
                        placeholder="Ex: 15"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">URL do Vídeo (Opcional)</label>
                    <div className="flex gap-2">
                      <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                        <PlayCircle size={20} className="text-accent" />
                      </div>
                      <Input 
                        value={editLessonData.url_video} 
                        onChange={(e) => setEditLessonData({...editLessonData, url_video: e.target.value})}
                        placeholder="https://youtube.com/..." 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Descrição / Resumo</label>
                    <textarea 
                      rows={6}
                      value={editLessonData.descricao}
                      onChange={(e) => setEditLessonData({...editLessonData, descricao: e.target.value})}
                      placeholder="Descreva brevemente o que será abordado nesta aula..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card/20 border border-white/5 border-dashed rounded-3xl h-[600px] flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Layout size={32} className="text-muted/50" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nenhuma Aula Selecionada</h3>
              <p className="text-muted text-sm max-w-sm">Selecione uma aula no menu lateral para editar o conteúdo ou crie uma nova aula.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
