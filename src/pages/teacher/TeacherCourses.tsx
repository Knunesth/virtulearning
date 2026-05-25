import { useState } from 'react';
import { Upload, MoreVertical, Users, DollarSign, Image as ImageIcon, Loader2, AlertCircle, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { useCourses, useCreateCourse, useUpdateCourse, type Course } from '../../hooks/useCourses';
import { useAuthStore } from '../../store/useAuthStore';

export const TeacherCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Busca os cursos do professor logado filtrando por professor_id via search (aproximação)
  // Idealmente, o backend teria uma rota /api/courses/my — por ora usamos o público com limit alto
  const { data: coursesData, isLoading, isError } = useCourses({ limit: 100 });
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();

  const [editingCourse, setEditingCourse] = useState<Course | 'new' | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Formulário
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    preco: '0',
    thumbnail: '',
    nivel: 'iniciante' as 'iniciante' | 'intermediario' | 'avancado',
    duracao_horas: '0',
  });

  // Filtra apenas cursos do professor logado
  const myCourses = (coursesData?.data ?? []).filter(
    (c) => c.professor.id === user?.id
  );

  const handleOpenEdit = (course: Course | 'new') => {
    if (course === 'new') {
      setForm({ titulo: '', descricao: '', preco: '0', thumbnail: '', nivel: 'iniciante', duracao_horas: '0' });
    } else {
      setForm({
        titulo: course.titulo,
        descricao: course.descricao,
        preco: String(course.preco),
        thumbnail: course.thumbnail ?? '',
        nivel: course.nivel as any,
        duracao_horas: String(course.duracao_horas),
      });
    }
    setEditingCourse(course);
    setActiveMenu(null);
  };

  const handleSave = async () => {
    const data = {
      titulo: form.titulo,
      descricao: form.descricao,
      preco: parseFloat(form.preco) || 0,
      thumbnail: form.thumbnail || undefined,
      nivel: form.nivel,
      duracao_horas: parseInt(form.duracao_horas) || 0,
    };

    try {
      if (editingCourse === 'new') {
        const created = await createCourse.mutateAsync(data);
        navigate(`/teacher/courses/${created.id}/builder`);
      } else if (editingCourse) {
        await updateCourse.mutateAsync({ id: (editingCourse as Course).id, data });
        setEditingCourse(null);
      }
    } catch (error: any) {
      console.error(error);
      const details = error.response?.data?.details?.fieldErrors;
      if (details) {
        const msg = Object.entries(details).map(([field, errs]) => `${field}: ${(errs as any).join(', ')}`).join('\n');
        alert(`Erro de validação:\n${msg}`);
      } else {
        alert(error.response?.data?.error || 'Ocorreu um erro ao salvar o curso. Verifique os dados.');
      }
    }
  };

  const isSaving = createCourse.isPending || updateCourse.isPending;

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Seus Cursos Publicados</h1>
          <p className="text-muted text-sm">Gerencie o conteúdo que você disponibiliza para os alunos.</p>
        </div>
        <Button
          onClick={() => handleOpenEdit('new')}
          className="font-bold shrink-0 bg-accent text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300"
        >
          <Plus size={16} className="mr-1" /> Novo Curso
        </Button>
      </div>

      {/* Neon BG */}
      <div className="fixed top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Loading / Error */}
      {isLoading ? (
        <div className="flex justify-center items-center gap-3 text-muted py-20">
          <Loader2 size={24} className="animate-spin" />
          <span>Carregando seus cursos...</span>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center gap-3 text-danger py-20">
          <AlertCircle size={24} />
          <span>Erro ao carregar cursos. Tente novamente.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {myCourses.map((course) => (
            <div
              key={course.id}
              className="bg-gradient-to-b from-card/40 to-transparent backdrop-blur-xl border-t border-white/5 rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_0_30px_rgba(255,215,0,0.05)] transition-all duration-300 group flex flex-col relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-all duration-500" />

              {/* Capa */}
              <div
                className="aspect-video w-full relative overflow-hidden bg-black/40 cursor-pointer"
                onClick={() => handleOpenEdit(course)}
              >
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.titulo} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <ImageIcon size={32} className="text-white/20" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${
                    course.status === 'publicado'
                      ? 'bg-green-500/20 text-green-400 border-green-500/10'
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/10'
                  }`}>
                    {course.status === 'publicado' ? 'Publicado' : course.status === 'rascunho' ? 'Rascunho' : course.status}
                  </span>
                </div>

                {/* Menu */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === String(course.id) ? null : String(course.id)); }}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center text-white hover:bg-accent/80 hover:text-black transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {activeMenu === String(course.id) && (
                    <div className="absolute top-10 right-0 w-36 bg-card/90 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-100">
                      <button
                        onClick={() => handleOpenEdit(course)}
                        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => navigate(`/teacher/courses/${course.id}/builder`)}
                        className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/5 transition-colors"
                      >
                        Gerenciar Conteúdo
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex-1 flex flex-col relative z-10">
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">{course.nivel}</p>
                <h3
                  className="font-bold text-white text-base line-clamp-2 mb-6 group-hover:text-accent transition-colors flex-1 cursor-pointer"
                  onClick={() => handleOpenEdit(course)}
                >
                  {course.titulo}
                </h3>
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-muted text-xs font-medium">
                    <Users size={14} className="text-blue-400" />
                    {(course._count?.matriculas ?? 0).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted text-xs font-medium">
                    <DollarSign size={14} className="text-green-400" />
                    {Number(course.preco) === 0 ? 'Grátis' : `R$ ${Number(course.preco).toLocaleString('pt-BR')}`}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {myCourses.length === 0 && !isLoading && (
            <div className="col-span-full py-20 text-center">
              <ImageIcon className="w-16 h-16 text-muted mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhum curso criado ainda</h3>
              <p className="text-muted mb-6">Clique em "Novo Curso" para começar a criar seu primeiro conteúdo.</p>
              <Button onClick={() => handleOpenEdit('new')} className="bg-accent text-black font-bold hover:bg-yellow-400">
                Criar Primeiro Curso
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modal de Criação/Edição */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card/90 backdrop-blur-2xl border-t border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-bg/20">
              <h3 className="text-xl font-black text-white">
                {editingCourse === 'new' ? 'Criar Novo Curso' : 'Editar Curso'}
              </h3>
              <button
                onClick={() => setEditingCourse(null)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2">Título do Curso *</label>
                    <Input
                      value={form.titulo}
                      onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                      placeholder="Ex: Curso Completo de React Native"
                      className="bg-black/40 border-border/50 focus:border-accent/50 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted mb-2">Nível</label>
                      <select
                        value={form.nivel}
                        onChange={(e) => setForm((f) => ({ ...f, nivel: e.target.value as any }))}
                        className="w-full h-11 px-3 bg-black/40 border border-border/50 rounded-xl text-sm text-white focus:outline-none focus:border-accent/50 transition-colors appearance-none shadow-inner"
                      >
                        <option value="iniciante">Iniciante</option>
                        <option value="intermediario">Intermediário</option>
                        <option value="avancado">Avançado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted mb-2">Duração (horas)</label>
                      <Input
                        type="number"
                        value={form.duracao_horas}
                        onChange={(e) => setForm((f) => ({ ...f, duracao_horas: e.target.value }))}
                        placeholder="Ex: 20"
                        className="bg-black/40 border-border/50 focus:border-accent/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2">Preço (R$)</label>
                    <Input
                      type="number"
                      value={form.preco}
                      onChange={(e) => setForm((f) => ({ ...f, preco: e.target.value }))}
                      placeholder="0.00 para gratuito"
                      className="bg-black/40 border-border/50 focus:border-accent/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2">Descrição *</label>
                    <Textarea
                      value={form.descricao}
                      onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                      placeholder="O que o aluno vai aprender? Descreva os objetivos do curso."
                      className="h-32 bg-black/40 border-border/50 focus:border-accent/50"
                    />
                  </div>
                </div>
                <div className="flex flex-col h-full">
                  <label className="block text-xs font-bold text-muted mb-2">Capa do Curso (URL)</label>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={form.thumbnail}
                      onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
                      placeholder="https://..."
                      className="bg-black/40 border-border/50 focus:border-accent/50 flex-1"
                    />
                    <button className="w-11 h-11 rounded-xl border border-border/50 bg-black/40 flex items-center justify-center text-muted hover:text-white hover:border-accent/50 transition-all shadow-inner shrink-0">
                      <Upload size={18} />
                    </button>
                  </div>
                  <div className="flex-1 bg-black/20 border border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center text-muted mb-6 min-h-[200px] overflow-hidden">
                    {form.thumbnail ? (
                      <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <>
                        <ImageIcon size={32} className="mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-wider">Preview</span>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !form.titulo || !form.descricao}
                    className="w-full font-bold bg-accent text-black hover:bg-yellow-400 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Salvando...</span>
                    ) : editingCourse === 'new' ? 'Criar e Gerenciar Conteúdo' : 'Salvar Alterações'}
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
