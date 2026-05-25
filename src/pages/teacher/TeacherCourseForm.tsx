import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCreateCourse, useUpdateCourse, useCourse } from '../../hooks/useCourses';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ArrowLeft, Loader2, Upload, ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const TeacherCourseForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    preco: 0,
    nivel: 'iniciante',
    duracao_horas: 0,
    thumbnail: '',
  });

  const { data: course, isLoading: isLoadingCourse } = useCourse(isEditing ? Number(id) : undefined);
  const { mutateAsync: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateCourse();

  useEffect(() => {
    if (isEditing && course) {
      setFormData({
        titulo: course.titulo,
        descricao: course.descricao,
        preco: course.preco,
        nivel: course.nivel,
        duracao_horas: course.duracao_horas || 0,
        thumbnail: course.thumbnail || '',
      });
    }
  }, [isEditing, course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateCourse({ id: Number(id), data: formData });
        navigate('/teacher/courses');
      } else {
        const newCourse = await createCourse(formData);
        navigate(`/teacher/courses/${newCourse.id}/builder`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar curso. Tente novamente.');
    }
  };

  if (isEditing && isLoadingCourse) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  const isSaving = isCreating || isUpdating;

  return (
    <div className="max-w-[1000px] mx-auto animate-in fade-in duration-500 pb-24 md:pb-10">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/teacher/courses" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {isEditing ? 'Editar Curso' : 'Criar Novo Curso'}
          </h1>
          <p className="text-muted text-sm md:text-base mt-1">
            {isEditing ? 'Atualize as informações principais do seu curso.' : 'Preencha as informações iniciais para criar seu curso.'}
          </p>
        </div>
      </div>

      <div className="bg-card/90 backdrop-blur-2xl border-t border-white/10 rounded-3xl w-full shadow-2xl overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label className="block text-xs font-bold text-muted mb-2">Título do Curso *</label>
                <Input
                  value={formData.titulo}
                  onChange={(e) => setFormData((f) => ({ ...f, titulo: e.target.value }))}
                  placeholder="Ex: Curso Completo de React Native"
                  className="bg-black/40 border-border/50 focus:border-accent/50 text-white"
                  required
                  minLength={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-2">Nível</label>
                  <select
                    value={formData.nivel}
                    onChange={(e) => setFormData((f) => ({ ...f, nivel: e.target.value as any }))}
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
                    value={formData.duracao_horas}
                    onChange={(e) => setFormData((f) => ({ ...f, duracao_horas: parseInt(e.target.value) || 0 }))}
                    placeholder="Ex: 20"
                    className="bg-black/40 border-border/50 focus:border-accent/50 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted mb-2">Preço (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData((f) => ({ ...f, preco: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00 para gratuito"
                  className="bg-black/40 border-border/50 focus:border-accent/50 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted mb-2">Descrição *</label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData((f) => ({ ...f, descricao: e.target.value }))}
                  placeholder="O que o aluno vai aprender? Descreva os objetivos do curso."
                  className="h-32 bg-black/40 border-border/50 focus:border-accent/50 text-white"
                  required
                  minLength={10}
                />
              </div>
            </div>

            <div className="flex flex-col h-full">
              <label className="block text-xs font-bold text-muted mb-2">Capa do Curso (URL)</label>
              <div className="flex gap-2 mb-4">
                <Input
                  value={formData.thumbnail}
                  onChange={(e) => setFormData((f) => ({ ...f, thumbnail: e.target.value }))}
                  placeholder="https://..."
                  className="bg-black/40 border-border/50 focus:border-accent/50 flex-1 text-white"
                />
                <button type="button" className="w-11 h-11 rounded-xl border border-border/50 bg-black/40 flex items-center justify-center text-muted hover:text-white hover:border-accent/50 transition-all shadow-inner shrink-0">
                  <Upload size={18} />
                </button>
              </div>
              
              <div className="flex-1 bg-black/20 border border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center text-muted mb-6 min-h-[200px] overflow-hidden">
                {formData.thumbnail ? (
                  <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <>
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-wider">Preview</span>
                  </>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isSaving || !formData.titulo || !formData.descricao}
                className="w-full font-bold bg-accent text-black hover:bg-yellow-400 disabled:opacity-50 py-3"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2 justify-center"><Loader2 size={16} className="animate-spin" /> Salvando...</span>
                ) : !isEditing ? 'Criar e Gerenciar Conteúdo' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
