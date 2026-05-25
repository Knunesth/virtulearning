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

import { useAdminFinancials } from '../../hooks/useAdminFinancials';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '../../utils/format';


export const AdminFinancials = () => {
  const { data: financials, isLoading, isError } = useAdminFinancials();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (isError || !financials) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-danger">
        Ocorreu um erro ao carregar os dados financeiros.
      </div>
    );
  }

  const { kpis, chartData, topCourses, transactions } = financials;

  // Extrair valores de receita do chartData para montar o Sparkline
  const chartValues = chartData.map(c => c.revenue);

  const kpiCards = [
    { label: 'Receita Total (mês)',  value: formatCurrency(kpis.receitaMensal.value), change: `${kpis.receitaMensal.change}%`, up: kpis.receitaMensal.up,  color: '#22c55e', values: chartValues.length > 0 ? chartValues : [0,0] },
    { label: 'MRR',                  value: formatCurrency(kpis.mrr.value), change: `${kpis.mrr.change}%`,  up: kpis.mrr.up,  color: '#3b82f6', values: chartValues.length > 0 ? chartValues : [0,0] },
    { label: 'Ticket Médio',         value: formatCurrency(kpis.ticketMedio.value), change: `${kpis.ticketMedio.change}%`,  up: kpis.ticketMedio.up,  color: '#f59e0b', values: chartValues.length > 0 ? chartValues : [0,0] },
    { label: 'Reembolsos',           value: formatCurrency(kpis.reembolsos.value),  change: `${kpis.reembolsos.change}%`,  up: kpis.reembolsos.up, color: '#ef4444', values: chartValues.length > 0 ? chartValues.map(() => 0) : [0,0] },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-20 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Financeiro</h1>
        <p className="text-[#71717a] text-sm">Receita, transações e métricas financeiras da plataforma.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((m, i) => (
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
            {chartData.map((m, i) => {
              const max = Math.max(...chartValues) || 1;
              const pct = (m.revenue / max) * 100;
              const isLast = i === chartData.length - 1;
              return (
                <div key={m.name} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex items-end" style={{ height: '120px' }}>
                    <div
                      className={`w-full rounded-t-md transition-all ${isLast ? 'bg-accent shadow-[0_0_12px_rgba(255,215,0,0.3)]' : 'bg-[#27272a] hover:bg-[#3f3f46]'}`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#52525b]">{m.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Earners */}
        <div className="bg-[#121214] border border-[#27272a] rounded-xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">Top Cursos por Receita</h3>
          <div className="space-y-4">
            {topCourses.map((course, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white">{course.title}</span>
                  <span className="font-bold text-white">{formatCurrency(course.revenue)}</span>
                </div>
                <div className="h-1.5 w-full bg-[#27272a] rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${course.pct}%` }} />
                </div>
              </div>
            ))}
            {topCourses.length === 0 && (
              <p className="text-sm text-muted text-center py-4">Nenhum curso gerou receita ainda.</p>
            )}
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
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#27272a]">
                <th className="text-left py-4 px-6 text-[10px] font-bold text-[#71717a] uppercase tracking-wider">Usuário</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-[#71717a] uppercase tracking-wider">Curso</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-[#71717a] uppercase tracking-wider">Tipo</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-[#71717a] uppercase tracking-wider">Valor</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-[#71717a] uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-[#27272a]/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 text-sm font-bold text-white">{t.name}</td>
                  <td className="py-4 px-6 text-sm text-[#a1a1aa]">{t.course}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.type === 'compra' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`py-4 px-6 text-sm font-bold ${t.type === 'compra' ? 'text-success' : 'text-danger'}`}>
                    {t.type === 'compra' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="py-4 px-6 text-sm text-[#71717a]">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted text-sm">Nenhuma transação encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
