import { useState } from 'react';
import { Search, Eye, EyeOff, Trash2, Users, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { useAdminCourses, useChangeCourseStatus, useDeleteCourse, type Course } from '../../hooks/useCourses';
import { useDebounce } from '../../hooks/useDebounce';

type CourseStatus = 'publicado' | 'rascunho' | 'suspenso' | 'arquivado';

const statusConfig: Record<CourseStatus, { label: string; color: string; bg: string; dot: string }> = {
  publicado: { label: 'Publicado', color: 'text-success', bg: 'bg-success/10 border-success/20', dot: 'bg-success shadow-[0_0_6px_rgba(34,197,94,0.7)]' },
  rascunho:  { label: 'Rascunho',  color: 'text-warning', bg: 'bg-warning/10 border-warning/20', dot: 'bg-warning' },
  suspenso:  { label: 'Suspenso',  color: 'text-danger',  bg: 'bg-danger/10 border-danger/20',   dot: 'bg-danger' },
  arquivado: { label: 'Arquivado', color: 'text-muted',   bg: 'bg-muted/10 border-muted/20',     dot: 'bg-muted' },
};

export const AdminCourses = () => {
  const { data: courses = [], isLoading, isError } = useAdminCourses();
  const changeStatus = useChangeCourseStatus();
  const deleteCourse = useDeleteCourse();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  const debouncedSearch = useDebounce(search, 300);

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.titulo.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.professor.nome.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchFilter = filter === 'todos' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: 'Total de Cursos', value: courses.length, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Publicados', value: courses.filter((c) => c.status === 'publicado').length, color: 'text-success', bg: 'bg-success/10 border-success/20' },
    { label: 'Suspensos', value: courses.filter((c) => c.status === 'suspenso').length, color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
    { label: 'Rascunhos', value: courses.filter((c) => c.status === 'rascunho').length, color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
  ];

  const handleToggleStatus = (course: Course) => {
    const nextStatus = course.status === 'publicado' ? 'suspenso' : 'publicado';
    changeStatus.mutate({ id: course.id, status: nextStatus });
  };

  const handleDelete = (course: Course) => {
    if (confirm(`Arquivar o curso "${course.titulo}"? Esta ação pode ser revertida.`)) {
      deleteCourse.mutate(course.id);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Cursos</h1>
          <p className="text-[#71717a] text-sm">Modere e gerencie todos os cursos da plataforma.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border ${s.bg}`}>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-[#71717a]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#27272a] flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" size={15} />
            <input
              type="text"
              placeholder="Buscar curso ou instrutor..."
              className="w-full h-9 pl-9 pr-4 bg-[#09090b] border border-[#27272a] rounded-lg text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#3f3f46] transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            {['todos', 'publicado', 'rascunho', 'suspenso', 'arquivado'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all border ${filter === f ? 'bg-[#27272a] text-white border-[#3f3f46]' : 'text-[#71717a] border-transparent hover:text-white'}`}
              >
                {f === 'todos' ? 'Todos' : f}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center items-center gap-3 text-muted">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Carregando cursos...</span>
          </div>
        ) : isError ? (
          <div className="py-16 flex justify-center items-center gap-3 text-danger">
            <AlertCircle size={20} />
            <span className="text-sm">Erro ao carregar cursos.</span>
          </div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#27272a]">
                  {['Curso', 'Instrutor', 'Alunos', 'Módulos', 'Preço', 'Status', 'Ações'].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-[10px] font-bold text-[#52525b] uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]/50">
                {filtered.map((c) => {
                  const sc = statusConfig[c.status as CourseStatus] ?? statusConfig.rascunho;
                  return (
                    <tr key={c.id} className="hover:bg-[#18181b] transition-colors group">
                      <td className="px-5 py-3.5 max-w-[220px]">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                            <BookOpen size={14} className="text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{c.titulo}</p>
                            <p className="text-[10px] text-[#52525b] mt-0.5">
                              {c._count?.modulos ?? 0} módulos • {new Date(c.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#a1a1aa]">{c.professor.nome}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 text-xs text-[#71717a]">
                          <Users size={11} /> {(c._count?.matriculas ?? 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#71717a]">{c._count?.modulos ?? 0}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-white">
                        {Number(c.preco) === 0 ? 'Grátis' : `R$ ${Number(c.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sc.bg} ${sc.color}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleToggleStatus(c)}
                            disabled={changeStatus.isPending || c.status === 'arquivado'}
                            className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors disabled:opacity-40 ${c.status === 'publicado' ? 'hover:bg-danger/10 text-[#52525b] hover:text-danger' : 'hover:bg-success/10 text-[#52525b] hover:text-success'}`}
                            title={c.status === 'publicado' ? 'Suspender' : 'Publicar'}
                          >
                            {c.status === 'publicado' ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button
                            onClick={() => handleDelete(c)}
                            disabled={deleteCourse.isPending}
                            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-danger/10 text-[#52525b] hover:text-danger transition-colors disabled:opacity-40"
                            title="Arquivar"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center text-[#52525b] text-sm">Nenhum curso encontrado.</div>
            )}

            <div className="px-5 py-3 border-t border-[#27272a] flex items-center justify-between">
              <span className="text-[10px] text-[#52525b]">
                Mostrando <strong className="text-[#a1a1aa]">{filtered.length}</strong> de <strong className="text-[#a1a1aa]">{courses.length}</strong> cursos
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
