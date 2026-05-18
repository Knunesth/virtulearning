import { useState } from 'react';
import { Search, Eye, EyeOff, Trash2, Star, Users, BookOpen, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';

type CourseStatus = 'publicado' | 'rascunho' | 'suspenso';

const statusConfig: Record<CourseStatus, { label: string; color: string; bg: string; dot: string }> = {
  publicado: { label: 'Publicado', color: 'text-success', bg: 'bg-success/10 border-success/20', dot: 'bg-success shadow-[0_0_6px_rgba(34,197,94,0.7)]' },
  rascunho:  { label: 'Rascunho',  color: 'text-warning', bg: 'bg-warning/10 border-warning/20', dot: 'bg-warning' },
  suspenso:  { label: 'Suspenso',  color: 'text-danger',  bg: 'bg-danger/10 border-danger/20',   dot: 'bg-danger' },
};

const MOCK_COURSES = [
  { id: '1', title: 'Bootcamp React Native do Zero ao Profissional', instructor: 'Thiago Silva', students: 12500, rating: 4.9, revenue: 'R$ 8.200', status: 'publicado' as CourseStatus, modules: 12, createdAt: '01/03/2026' },
  { id: '2', title: 'Arquitetura de Microsserviços com Node.js',      instructor: 'Amanda Costa',  students: 8300,  rating: 4.8, revenue: 'R$ 5.100', status: 'publicado' as CourseStatus, modules: 8,  createdAt: '10/03/2026' },
  { id: '3', title: 'UX/UI Design: Criando Experiências Memoráveis',  instructor: 'Lucas Ferreira',students: 15200, rating: 4.9, revenue: 'R$ 3.900', status: 'publicado' as CourseStatus, modules: 6,  createdAt: '15/02/2026' },
  { id: '4', title: 'Python para Análise de Dados',                    instructor: 'Juliana Paiva', students: 9100,  rating: 4.7, revenue: 'R$ 2.800', status: 'suspenso' as CourseStatus, modules: 10, createdAt: '20/01/2026' },
  { id: '5', title: 'Introdução ao DevOps e CI/CD',                    instructor: 'Roberto Almeida',students: 3200, rating: 4.6, revenue: 'R$ 1.200', status: 'rascunho' as CourseStatus, modules: 7,  createdAt: '05/04/2026' },
];

export const AdminCourses = () => {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'todos' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleStatus = (id: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== id) return c;
      return { ...c, status: c.status === 'publicado' ? 'suspenso' : 'publicado' };
    }));
  };

  const stats = [
    { label: 'Total de Cursos', value: courses.length, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Publicados', value: courses.filter(c => c.status === 'publicado').length, color: 'text-success', bg: 'bg-success/10 border-success/20' },
    { label: 'Suspensos', value: courses.filter(c => c.status === 'suspenso').length, color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
    { label: 'Rascunhos', value: courses.filter(c => c.status === 'rascunho').length, color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
  ];

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
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            {['todos', 'publicado', 'rascunho', 'suspenso'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all border ${filter === f ? 'bg-[#27272a] text-white border-[#3f3f46]' : 'text-[#71717a] border-transparent hover:text-white'}`}>
                {f === 'todos' ? 'Todos' : f}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#27272a]">
              {['Curso', 'Instrutor', 'Alunos', 'Avaliação', 'Receita', 'Status', 'Ações'].map((h, i) => (
                <th key={i} className="px-5 py-3 text-[10px] font-bold text-[#52525b] uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]/50">
            {filtered.map(c => {
              const sc = statusConfig[c.status];
              return (
                <tr key={c.id} className="hover:bg-[#18181b] transition-colors group">
                  <td className="px-5 py-3.5 max-w-[220px]">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen size={14} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{c.title}</p>
                        <p className="text-[10px] text-[#52525b] mt-0.5">{c.modules} módulos • {c.createdAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#a1a1aa]">{c.instructor}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-xs text-[#71717a]">
                      <Users size={11} /> {c.students.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-xs text-warning font-bold">
                      <Star size={11} fill="currentColor" /> {c.rating}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-white">{c.revenue}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sc.bg} ${sc.color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></div>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toggleStatus(c.id)}
                        className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${c.status === 'publicado' ? 'hover:bg-danger/10 text-[#52525b] hover:text-danger' : 'hover:bg-success/10 text-[#52525b] hover:text-success'}`}
                        title={c.status === 'publicado' ? 'Suspender' : 'Publicar'}>
                        {c.status === 'publicado' ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-danger/10 text-[#52525b] hover:text-danger transition-colors" title="Remover">
                        <Trash2 size={13} />
                      </button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/5 text-[#52525b] hover:text-white transition-colors">
                        <MoreVertical size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-[#27272a] flex items-center justify-between">
          <span className="text-[10px] text-[#52525b]">Mostrando <strong className="text-[#a1a1aa]">{filtered.length}</strong> de <strong className="text-[#a1a1aa]">{courses.length}</strong> cursos</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1 text-xs border border-[#27272a] rounded-lg text-[#71717a] hover:bg-[#27272a] transition-colors">Anterior</button>
            <button className="px-3 py-1 text-xs border border-[#27272a] rounded-lg text-[#71717a] hover:bg-[#27272a] transition-colors">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};
