import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Sparkline = ({ values, color }: { values: number[]; color: string }) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 100 / (values.length - 1);
  const points = values.map((v, i) => `${i * w},${100 - ((v - min) / range) * 80 + 10}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" className="w-full h-12" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,100 ${points} 100,100`} fill={color} opacity="0.08" />
    </svg>
  );
};

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
const REVENUE = [18200, 21400, 19800, 27100, 31500, 45231];

const TRANSACTIONS = [
  { name: 'João Silva',    course: 'React Native',       amount: '+R$ 199,90', date: 'Hoje, 14:22',    type: 'compra' },
  { name: 'Maria Souza',  course: 'Node.js Avançado',   amount: '+R$ 149,90', date: 'Hoje, 11:05',    type: 'compra' },
  { name: 'Pedro Alves',  course: 'UX/UI Design',       amount: '-R$ 89,90',  date: 'Hoje, 09:30',    type: 'reembolso' },
  { name: 'Ana Costa',    course: 'Python para Dados',  amount: '+R$ 89,90',  date: 'Ontem, 18:14',   type: 'compra' },
  { name: 'Lucas Lima',   course: 'DevOps e CI/CD',     amount: '+R$ 129,90', date: 'Ontem, 15:00',   type: 'compra' },
  { name: 'Carla Dias',   course: 'React Native',       amount: '+R$ 199,90', date: 'Ontem, 10:33',   type: 'compra' },
];

export const AdminFinancials = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-20 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Financeiro</h1>
        <p className="text-[#71717a] text-sm">Receita, transações e métricas financeiras da plataforma.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Receita Total (mês)',  value: 'R$ 45.231', change: '+12.5%', up: true,  color: '#22c55e', values: REVENUE },
          { label: 'MRR',                  value: 'R$ 45.231', change: '+8.2%',  up: true,  color: '#3b82f6', values: REVENUE.map(v => v * 0.9) },
          { label: 'Ticket Médio',         value: 'R$ 134,90', change: '+3.1%',  up: true,  color: '#f59e0b', values: [110,118,125,128,130,134] },
          { label: 'Reembolsos',           value: 'R$ 1.290',  change: '+0.8%',  up: false, color: '#ef4444', values: [400,600,500,900,800,1290] },
        ].map((m, i) => (
          <div key={i} className="bg-[#121214] border border-[#27272a] rounded-xl p-5 overflow-hidden flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#71717a] font-medium">{m.label}</span>
              <span className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${m.up ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                {m.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {m.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">{m.value}</h3>
            <div className="-mx-5 -mb-5">
              <Sparkline values={m.values} color={m.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart + Top Earners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-[#121214] border border-[#27272a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white">Receita Mensal</h3>
              <p className="text-[10px] text-[#71717a] mt-0.5">Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-success font-bold bg-success/10 px-2 py-1 rounded-full border border-success/20">
              <TrendingUp size={12} /> +148% em 6 meses
            </div>
          </div>
          {/* Bar chart simulation */}
          <div className="flex items-end gap-3 h-40">
            {MONTHS.map((m, i) => {
              const max = Math.max(...REVENUE);
              const pct = (REVENUE[i] / max) * 100;
              const isLast = i === MONTHS.length - 1;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex items-end" style={{ height: '120px' }}>
                    <div
                      className={`w-full rounded-t-md transition-all ${isLast ? 'bg-accent shadow-[0_0_12px_rgba(255,215,0,0.3)]' : 'bg-[#27272a] hover:bg-[#3f3f46]'}`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#52525b]">{m}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Earners */}
        <div className="bg-[#121214] border border-[#27272a] rounded-xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">Top Cursos por Receita</h3>
          <div className="space-y-4">
            {[
              { title: 'React Native', revenue: 'R$ 8.200', pct: 100 },
              { title: 'Node.js Avançado', revenue: 'R$ 5.100', pct: 62 },
              { title: 'UX/UI Design', revenue: 'R$ 3.900', pct: 47 },
              { title: 'Python Dados', revenue: 'R$ 2.800', pct: 34 },
            ].map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#a1a1aa] truncate pr-2">{c.title}</span>
                  <span className="text-xs font-bold text-white shrink-0">{c.revenue}</span>
                </div>
                <div className="h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${c.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#27272a] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Transações Recentes</h3>
          <span className="text-[10px] text-[#52525b]">Últimas 24h</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-[#27272a]">
              {['Usuário', 'Curso', 'Tipo', 'Valor', 'Data'].map((h, i) => (
                <th key={i} className="px-5 py-3 text-[10px] font-bold text-[#52525b] uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]/50">
            {TRANSACTIONS.map((t, i) => (
              <tr key={i} className="hover:bg-[#18181b] transition-colors">
                <td className="px-5 py-3 text-sm text-white font-medium">{t.name}</td>
                <td className="px-5 py-3 text-sm text-[#71717a]">{t.course}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.type === 'compra' ? 'text-success bg-success/10 border-success/20' : 'text-danger bg-danger/10 border-danger/20'}`}>
                    {t.type}
                  </span>
                </td>
                <td className={`px-5 py-3 text-sm font-bold ${t.type === 'compra' ? 'text-success' : 'text-danger'}`}>{t.amount}</td>
                <td className="px-5 py-3 text-xs text-[#52525b]">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};
