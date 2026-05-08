import { useState } from 'react';
import { Upload, MoreVertical, Users, DollarSign, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

const MOCK_COURSES = [
  {
    id: '1',
    title: 'Curso Completo de React Native',
    category: 'Programação',
    status: 'Ativo',
    students: 450,
    revenue: 45000,
    cover: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    title: 'UX/UI Design Masterclass',
    category: 'Design',
    status: 'Ativo',
    students: 320,
    revenue: 28800,
    cover: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    title: 'Introdução ao Node.js',
    category: 'Programação',
    status: 'Rascunho',
    students: 0,
    revenue: 0,
    cover: null
  },
  {
    id: '4',
    title: 'Marketing Digital para Devs',
    category: 'Marketing',
    status: 'Ativo',
    students: 125,
    revenue: 6250,
    cover: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80'
  }
];

export const TeacherCourses = () => {
  const navigate = useNavigate();
  const [editingCourse, setEditingCourse] = useState<typeof MOCK_COURSES[0] | 'new' | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Seus Cursos Publicados</h1>
          <p className="text-muted text-sm">Gerencie o conteúdo que você disponibiliza para os alunos.</p>
        </div>
        <Button onClick={() => setEditingCourse('new')} className="font-bold shrink-0 bg-accent text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300">
          + Novo Curso
        </Button>
      </div>

      {/* Luz de Fundo Neon (HUD Effect) */}
      <div className="fixed top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      {/* Grid de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
        {MOCK_COURSES.map(course => (
          <div key={course.id} className="bg-gradient-to-b from-card/40 to-transparent backdrop-blur-xl border-t border-white/5 rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_0_30px_rgba(255,215,0,0.05)] transition-all duration-300 group flex flex-col relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-all duration-500"></div>
            
            {/* Capa do Curso */}
            <div 
              className="aspect-video w-full relative overflow-hidden bg-black/40 cursor-pointer"
              onClick={() => setEditingCourse(course)}
            >
              {course.cover ? (
                <img src={course.cover} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <ImageIcon size={32} className="text-white/20" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                {course.status === 'Ativo' ? (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-500/20 text-green-400 backdrop-blur-md border border-green-500/10">
                    Ativo
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-yellow-500/20 text-yellow-400 backdrop-blur-md border border-yellow-500/10">
                    Rascunho
                  </span>
                )}
              </div>

              {/* Menu de Ações (3 pontinhos) */}
              <div className="absolute top-2 right-2">
                <button 
                  onClick={() => toggleMenu(course.id)}
                  className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center text-white hover:bg-accent/80 hover:text-black transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                
                {/* Menu Dropdown */}
                {activeMenu === course.id && (
                  <div className="absolute top-10 right-0 w-36 bg-card/90 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-100">
                    <button 
                      onClick={() => { setEditingCourse(course); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                    >
                      Editar
                    </button>
                    <button className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/5 transition-colors">Ver alunos</button>
                    <div className="h-px bg-white/5 my-1"></div>
                    <button className="w-full text-left px-4 py-3 text-xs font-bold text-danger hover:bg-danger/10 transition-colors">Despublicar</button>
                  </div>
                )}
              </div>
            </div>

            {/* Informações do Curso */}
            <div className="p-6 flex-1 flex flex-col relative z-10">
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">{course.category}</p>
              <h3 
                className="font-bold text-white text-base line-clamp-2 mb-6 group-hover:text-accent transition-colors flex-1 cursor-pointer"
                onClick={() => setEditingCourse(course)}
              >
                {course.title}
              </h3>
              
              <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/5">
                <div className="flex items-center gap-1.5 text-muted text-xs font-medium" title="Alunos Matriculados">
                  <Users size={14} className="text-blue-400" />
                  {course.students.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-muted text-xs font-medium" title="Faturamento">
                  <DollarSign size={14} className="text-green-400" />
                  R$ {course.revenue.toLocaleString('pt-BR')}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal de Criação/Edição de Curso */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card/90 backdrop-blur-2xl border-t border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-bg/20">
              <h3 className="text-xl font-black text-white">
                {editingCourse === 'new' ? 'Criar Novo Conteúdo' : 'Editar Curso'}
              </h3>
              <button onClick={() => setEditingCourse(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-colors">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2">Título do Curso</label>
                    <Input 
                      defaultValue={editingCourse !== 'new' ? editingCourse.title : ''} 
                      placeholder="Ex: Curso Completo de Java" 
                      className="bg-black/40 border-border/50 focus:border-accent/50 text-white" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted mb-2">Categoria</label>
                      <select 
                        defaultValue={editingCourse !== 'new' ? editingCourse.category : 'Programação'}
                        className="w-full h-11 px-3 bg-black/40 border border-border/50 rounded-xl text-sm text-white focus:outline-none focus:border-accent/50 transition-colors appearance-none shadow-inner"
                      >
                        <option>Programação</option>
                        <option>Design</option>
                        <option>Marketing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted mb-2">Tópico</label>
                      <Input placeholder="Ex: Backend" className="bg-black/40 border-border/50 focus:border-accent/50" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2">Preço (R$)</label>
                    <Input type="number" defaultValue="0.00" className="bg-black/40 border-border/50 focus:border-accent/50" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2">Descrição</label>
                    <Textarea placeholder="O que o aluno vai aprender?" className="h-32 bg-black/40 border-border/50 focus:border-accent/50" />
                  </div>
                </div>
                
                <div className="flex flex-col h-full">
                  <label className="block text-xs font-bold text-muted mb-2">Capa do Curso (URL ou Upload)</label>
                  <div className="flex gap-2 mb-4">
                    <Input placeholder="https://..." className="bg-black/40 border-border/50 focus:border-accent/50 flex-1" />
                    <button className="w-11 h-11 rounded-xl border border-border/50 bg-black/40 flex items-center justify-center text-muted hover:text-white hover:border-accent/50 transition-all shadow-inner shrink-0">
                      <Upload size={18} />
                    </button>
                  </div>
                  
                  <div className="flex-1 bg-black/20 border border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center text-muted mb-6 min-h-[200px] hover:bg-white/5 hover:border-accent/50 transition-colors cursor-pointer">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-wider">Preview</span>
                  </div>
                  
                  <Button 
                    className="w-full font-bold bg-accent text-black hover:bg-yellow-400"
                    onClick={() => {
                      const courseId = editingCourse !== 'new' && editingCourse ? editingCourse.id : 'new-id';
                      navigate(`/teacher/courses/${courseId}/builder`);
                    }}
                  >
                    {editingCourse === 'new' ? 'Avançar para Conteúdo' : 'Gerenciar Conteúdo'}
                  </Button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};
