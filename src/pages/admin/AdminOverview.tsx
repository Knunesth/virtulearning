import { Users, DollarSign, BookOpen, UserCheck, TrendingUp, ArrowUpRight, ArrowDownRight, MoreHorizontal, ShieldAlert, Star, CheckCircle2 } from 'lucide-react';

const Sparkline = ({ color, up }: { color: string; up: boolean }) => {
  const points = up
    ? ['5,25', '15,18', '25,22', '35,12', '45,16', '55,8', '65,10', '75,4', '85,7', '95,2']
    : ['5,5', '15,9', '25,7', '35,14', '45,10', '55,18', '65,13', '75,20', '85,16', '95,22'];
  return (
    <svg viewBox="0 0 100 28" className="w-full h-10" preserveAspectRatio="none">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <polyline
        points={`5,28 ${points.join(' ')} 95,28`}
        fill={color}
        opacity="0.08"
      />
    </svg>
  );
};

const metrics = [
  {
    label: 'Receita Total',
    value: 'R$ 45.231',
    sub: '+R$ 2.100 este mês',
    change: '+12.5%',
    isPositive: true,
    icon: <DollarSign size={18} />,
    color: '#22c55e',
  },
  {
    label: 'Usuários Ativos',
    value: '1.234',
    sub: '89 novos esta semana',
    change: '+5.2%',
    isPositive: true,
    icon: <Users size={18} />,
    color: '#3b82f6',
  },
  {
    label: 'Novos Cursos',
    value: '12',
    sub: 'Publicados este mês',
    change: '-2.4%',
    isPositive: false,
    icon: <BookOpen size={18} />,
    color: '#f59e0b',
  },
  {
    label: 'Aprovações Pendentes',
    value: '8',
    sub: 'Candidaturas aguardando',
    change: null,
    isPositive: null,
    icon: <UserCheck size={18} />,
    color: '#ef4444',
  },
];

const recentActivity = [
  { action: 'Novo professor aprovado', detail: 'Ricardo Mendes — Desenvolvimento Web', time: '5 min', type: 'success' },
  { action: 'Candidatura recebida', detail: 'Fernanda Lima — UX/UI Design', time: '22 min', type: 'info' },
  { action: 'Curso publicado', detail: '"React Native do Zero" • 120 alunos inscritos', time: '1h', type: 'success' },
  { action: 'Usuário suspenso', detail: 'pedro.alves@email.com — Conduta inadequada', time: '2h', type: 'danger' },
  { action: 'Novo usuário registrado', detail: 'claudia.ramos@email.com — Plano Básico', time: '3h', type: 'neutral' },
];

const topCourses = [
  { name: 'Bootcamp React Native', instructor: 'Thiago Silva', students: 12500, rating: 4.9, revenue: 'R$ 8.200' },
  { name: 'Microsserviços Node.js', instructor: 'Amanda Costa', students: 8300, rating: 4.8, revenue: 'R$ 5.100' },
  { name: 'UX/UI Design Masterclass', instructor: 'Lucas Ferreira', students: 15200, rating: 4.9, revenue: 'R$ 3.900' },
  { name: 'Python para Dados', instructor: 'Juliana Paiva', students: 9100, rating: 4.7, revenue: 'R$ 2.800' },
];

const typeColors: Record<string, string> = {
  success: 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]',
  info: 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]',
  danger: 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]',
  neutral: 'bg-[#3f3f46]',
};

export const AdminOverview = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-20 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Visão Geral</h1>
          <p className="text-[#71717a] text-sm">Monitoramento em tempo real da plataforma.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#71717a]">
          <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
          Todos os sistemas operacionais
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#121214] border border-[#27272a] rounded-xl p-5 flex flex-col gap-3 hover:border-[#3f3f46] transition-colors overflow-hidden relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${m.color}15`, color: m.color }}>
                  {m.icon}
                </div>
                <span className="text-xs text-[#71717a] font-medium">{m.label}</span>
              </div>
              {m.change !== null && m.isPositive !== null && (
                <span className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${m.isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  {m.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {m.change}
                </span>
              )}
              {m.isPositive === null && (
                <span className="text-[10px] font-bold text-warning bg-warning/10 px-1.5 py-0.5 rounded-full">Atenção</span>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">{m.value}</h3>
              <p className="text-[10px] text-[#52525b] mt-0.5">{m.sub}</p>
            </div>

            <div className="-mx-5 -mb-5">
              <Sparkline color={m.color} up={m.isPositive !== false} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Courses */}
        <div className="lg:col-span-2 bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#27272a] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Top Cursos</h3>
              <p className="text-[10px] text-[#71717a] mt-0.5">Por alunos inscritos este mês</p>
            </div>
            <button className="text-[#71717a] hover:text-white transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="divide-y divide-[#27272a]">
            {topCourses.map((c, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-[#18181b] transition-colors">
                <span className="text-[#52525b] text-xs font-mono w-4 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                  <p className="text-[10px] text-[#71717a]">{c.instructor}</p>
                </div>
                <div className="flex items-center gap-1 text-warning text-[10px] font-bold shrink-0">
                  <Star size={10} fill="currentColor" /> {c.rating}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-white">{c.revenue}</p>
                  <p className="text-[10px] text-[#71717a]">{c.students.toLocaleString()} alunos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#27272a]">
            <h3 className="text-sm font-bold text-white">Atividade Recente</h3>
            <p className="text-[10px] text-[#71717a] mt-0.5">Últimas ações na plataforma</p>
          </div>
          <div className="p-4 space-y-1">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex gap-3 p-2 rounded-lg hover:bg-[#18181b] transition-colors">
                <div className="mt-1.5 shrink-0">
                  <div className={`w-1.5 h-1.5 rounded-full ${typeColors[item.type]}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white mb-0.5">{item.action}</p>
                  <p className="text-[10px] text-[#71717a] truncate">{item.detail}</p>
                </div>
                <span className="text-[10px] text-[#52525b] shrink-0 mt-0.5">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <ShieldAlert size={18} />, label: '8 aprovações pendentes', sub: 'Candidaturas de professores', to: '/admin/applications', color: '#ef4444' },
          { icon: <Users size={18} />, label: '3 usuários suspensos', sub: 'Aguardando revisão manual', to: '/admin/users', color: '#f59e0b' },
          { icon: <CheckCircle2 size={18} />, label: 'Plataforma saudável', sub: 'Uptime 99.9% — Sem alertas', to: '#', color: '#22c55e' },
        ].map((a, i) => (
          <a href={a.to} key={i} className="bg-[#121214] border border-[#27272a] rounded-xl px-5 py-4 flex items-center gap-4 hover:border-[#3f3f46] hover:-translate-y-0.5 transition-all">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${a.color}15`, color: a.color }}>
              {a.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{a.label}</p>
              <p className="text-[10px] text-[#71717a]">{a.sub}</p>
            </div>
            <ArrowUpRight size={14} className="ml-auto text-[#52525b]" />
          </a>
        ))}
      </div>
    </div>
  );
};
