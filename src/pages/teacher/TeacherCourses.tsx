import { Plus, Pencil, Trash2, BookOpen, Eye, PlayCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMyCourses, useDeleteCourse } from '../../hooks/useCourses';
import { useState } from 'react';

export const TeacherCourses = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useMyCourses();
  const deleteCourse = useDeleteCourse();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const courses = data?.data ?? [];

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-24 md:pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Meus Cursos</h1>
          <p className="text-muted mt-1 text-sm md:text-base">Gerencie e acompanhe seus cursos publicados.</p>
        </div>
        <Link
          to="/teacher/courses/new"
          className="flex items-center justify-center gap-2 bg-accent text-black font-bold px-5 py-2.5 rounded-xl hover:bg-accentHover transition-colors shadow-md text-sm w-full sm:w-auto"
        >
          <Plus size={18} /> Novo Curso
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-card rounded-xl animate-pulse border border-border" />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 md:p-12 text-center">
          <BookOpen className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-white font-bold text-lg mb-2">Nenhum curso ainda</h3>
          <p className="text-muted mb-6 text-sm md:text-base">Crie seu primeiro curso e comece a compartilhar seu conhecimento!</p>
          <Link to="/teacher/courses/new" className="bg-accent text-black font-bold px-6 py-2.5 rounded-xl hover:bg-accentHover transition-colors inline-flex items-center justify-center gap-2 text-sm w-full sm:w-auto">
            <Plus size={16} /> Criar Primeiro Curso
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-accent/50 transition-colors group">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-16 md:w-20 h-12 md:h-14 rounded-lg overflow-hidden shrink-0 bg-[#27272a]">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle size={20} className="text-muted" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate text-sm md:text-base">{course.titulo}</h3>
                  <div className="flex items-center gap-2 md:gap-3 mt-1 text-xs text-muted flex-wrap">
                    <span>{course._count?.matriculas ?? 0} alunos</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{course._count?.modulos ?? 0} módulos</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="capitalize">{course.nivel}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t border-border sm:border-none">
                <span className={`text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full ${course.status === 'publicado' ? 'bg-success/10 text-success' : 'bg-yellow-500/10 text-yellow-400'}`}>
                  {course.status}
                </span>
                <div className="flex items-center gap-1">
                  <Link
                    to={`/catalog/${course.id}`}
                    className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors"
                    title="Visualizar"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => navigate(`/teacher/courses/${course.id}/edit`)}
                    className="p-2 rounded-lg hover:bg-accent/10 text-muted hover:text-accent transition-colors"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(course.id)}
                    className="p-2 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmação */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <h3 className="text-white font-bold text-lg mb-2">Excluir curso?</h3>
            <p className="text-muted text-sm mb-6">Esta ação não pode ser desfeita. Todos os módulos e aulas serão removidos.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-border text-white hover:bg-white/5 transition-colors font-bold text-sm">
                Cancelar
              </button>
              <button
                onClick={async () => { await deleteCourse.mutateAsync(confirmDelete); setConfirmDelete(null); }}
                className="flex-1 py-2.5 rounded-xl bg-danger text-white font-bold hover:bg-danger/80 transition-colors text-sm"
              >
                {deleteCourse.isPending ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
