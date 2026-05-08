import { useState } from 'react';
import { ArrowLeft, GripVertical, Plus, PlayCircle, FileText, CheckCircle2, MoreVertical, Layout, Trash2, Edit2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

// Mocks
const MOCK_MODULES = [
  {
    id: 'm1',
    title: 'Módulo 1: Introdução ao React',
    lessons: [
      { id: 'l1', title: 'O que é React e por que usar?', type: 'video', duration: '12:45', isPublished: true },
      { id: 'l2', title: 'Configurando o Ambiente (Vite)', type: 'video', duration: '18:20', isPublished: true },
      { id: 'l3', title: 'Material de Apoio Inicial', type: 'document', duration: '5 min', isPublished: true },
    ]
  },
  {
    id: 'm2',
    title: 'Módulo 2: Componentes e Hooks',
    lessons: [
      { id: 'l4', title: 'Criando seu primeiro Componente', type: 'video', duration: '25:10', isPublished: false },
      { id: 'l5', title: 'Entendendo o useState', type: 'video', duration: '22:05', isPublished: false },
    ]
  }
];

export const TeacherCourseBuilder = () => {
  const { id } = useParams();
  const [modules, setModules] = useState(MOCK_MODULES);
  
  // Apenas UI de feedback para a demo
  const [activeLesson, setActiveLesson] = useState<string | null>('l1');

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* HUD Background Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <Link to="/teacher/courses" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-colors border border-white/5">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Construtor de Conteúdo</p>
            <h1 className="text-2xl font-black text-white">Curso Completo de React Native</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            Salvar Rascunho
          </Button>
          <Button className="bg-accent text-black hover:bg-yellow-400 font-bold shadow-[0_0_20px_rgba(255,215,0,0.3)]">
            <CheckCircle2 size={18} className="mr-2" />
            Publicar Curso
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Modules & Lessons */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layout size={20} className="text-accent" />
              Grade Curricular
            </h2>
          </div>

          <div className="space-y-4">
            {modules.map((module, mIndex) => (
              <div key={module.id} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                {/* Module Header */}
                <div className="p-4 bg-black/40 border-b border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <button className="cursor-grab text-muted hover:text-white transition-colors">
                      <GripVertical size={16} />
                    </button>
                    <h3 className="font-bold text-sm text-white">{module.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-muted hover:text-accent transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-muted hover:text-danger transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Lessons List */}
                <div className="p-2 space-y-1">
                  {module.lessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      onClick={() => setActiveLesson(lesson.id)}
                      className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border ${activeLesson === lesson.id ? 'bg-accent/10 border-accent/20' : 'hover:bg-white/5 border-transparent'}`}
                    >
                      <div className="flex items-center gap-3">
                        <button className="cursor-grab text-muted/50 hover:text-muted transition-colors">
                          <GripVertical size={14} />
                        </button>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeLesson === lesson.id ? 'bg-accent/20 text-accent' : 'bg-black/40 text-muted'}`}>
                          {lesson.type === 'video' ? <PlayCircle size={16} /> : <FileText size={16} />}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${activeLesson === lesson.id ? 'text-white' : 'text-muted group-hover:text-gray-300'}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{lesson.type}</span>
                            <span className="text-[10px] text-muted">• {lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Lesson Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {lesson.isPublished && (
                          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] mr-2" title="Aula Publicada"></div>
                        )}
                        <button className="text-muted hover:text-white transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Lesson Button */}
                  <button className="w-full mt-2 py-3 border border-dashed border-white/10 rounded-xl text-xs font-bold text-muted hover:text-white hover:border-accent/30 hover:bg-accent/5 transition-all flex items-center justify-center gap-2">
                    <Plus size={14} />
                    Adicionar Aula
                  </button>
                </div>
              </div>
            ))}

            {/* Add Module Button */}
            <button className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-sm font-bold text-muted hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all shadow-lg flex items-center justify-center gap-2">
              <Plus size={18} />
              Novo Módulo
            </button>
          </div>
        </div>

        {/* Right Column: Editor for Active Lesson */}
        <div className="lg:col-span-2">
          {activeLesson ? (
            <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <div>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">Editando Aula</p>
                  <h3 className="text-xl font-bold text-white">O que é React e por que usar?</h3>
                </div>
                <div className="flex items-center gap-2">
                   <button className="px-4 py-2 rounded-xl text-xs font-bold text-muted hover:bg-white/5 hover:text-white transition-colors">Visualizar</button>
                   <button className="px-4 py-2 rounded-xl text-xs font-bold bg-accent text-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all">Salvar Aula</button>
                </div>
              </div>

              {/* Formulário de Aula */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Título da Aula</label>
                  <input 
                    type="text" 
                    defaultValue="O que é React e por que usar?" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Tipo de Conteúdo</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 appearance-none">
                      <option value="video">Vídeo</option>
                      <option value="document">Texto / Artigo</option>
                      <option value="quiz">Quiz</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Duração Estimada</label>
                    <input 
                      type="text" 
                      defaultValue="12:45" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                </div>

                {/* Video Area */}
                <div>
                  <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">URL do Vídeo (YouTube, Vimeo ou MP4)</label>
                  <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                      <PlayCircle size={20} className="text-accent" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      defaultValue="https://youtube.com/watch?v=..." 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Resumo da Aula</label>
                  <textarea 
                    rows={4}
                    placeholder="Descreva brevemente o que será abordado..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all resize-none"
                    defaultValue="Nesta aula introdutória, vamos entender os conceitos fundamentais do React..."
                  />
                </div>

                {/* Attachments Section */}
                <div className="border border-dashed border-white/10 rounded-2xl p-6 bg-black/20 text-center hover:bg-black/40 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <Plus size={20} className="text-muted" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Adicionar Material de Apoio</h4>
                  <p className="text-xs text-muted">PDFs, Arquivos ZIP ou Links Externos</p>
                </div>
              </div>

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
