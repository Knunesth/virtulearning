import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCreateCourse, useUpdateCourse, useCourse } from '../../hooks/useCourses';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

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
        // Ao criar, redigciona para o construtor do curso
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

  return (
    <div className="max-w-[800px] mx-auto animate-in fade-in duration-500 pb-24 md:pb-10">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/teacher/courses" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {isEditing ? 'Editar Curso' : 'Novo Curso'}
          </h1>
          <p className="text-muted text-sm md:text-base mt-1">
            {isEditing ? 'Atualize as informações principais do seu curso.' : 'Preencha as informações iniciais para criar seu curso.'}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Título do Curso"
            placeholder="Ex: Formação Completa em Desenvolvimento Web"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            required
            minLength={3}
          />

          <Textarea
            label="Descrição"
            placeholder="Descreva o que os alunos aprenderão neste curso..."
            rows={4}
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            required
            minLength={10}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Preço (R$)"
              type="number"
              min="0"
              step="0.01"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })}
              required
            />
            
            <Input
              label="Duração Estimada (Horas)"
              type="number"
              min="0"
              value={formData.duracao_horas}
              onChange={(e) => setFormData({ ...formData, duracao_horas: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted">Nível</label>
              <select
                value={formData.nivel}
                onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                className="flex h-11 w-full rounded-md border border-border bg-[#09090b] px-3 py-2 text-sm text-text transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>

            <Input
              label="URL da Thumbnail (Opcional)"
              placeholder="https://..."
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            />
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex items-center gap-2 bg-accent text-black font-bold px-6 py-3 rounded-xl hover:bg-accentHover transition-colors disabled:opacity-50"
            >
              {isCreating || isUpdating ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {isEditing ? 'Salvar Alterações' : 'Criar Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
