import { DollarSign, ShoppingCart, Users, GraduationCap, ArrowUpRight, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_CHART_DATA = [
  { name: 'Jan', revenue: 40000 },
  { name: 'Fev', revenue: 30000 },
  { name: 'Mar', revenue: 55000 },
  { name: 'Abr', revenue: 45000 },
  { name: 'Mai', revenue: 70000 },
  { name: 'Jun', revenue: 80050 },
];

const MOCK_TOP_COURSES = [
  {
    id: '1',
    title: 'Curso Completo de React Native',
    category: 'Programação',
    sales: 450,
    activeStudents: 380,
    revenue: 45000,
    cover: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    title: 'UX/UI Design Masterclass',
    category: 'Design',
    sales: 320,
    activeStudents: 290,
    revenue: 28800,
    cover: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80'
  },
  {
    id: '4',
    title: 'Marketing Digital para Devs',
    category: 'Marketing',
    sales: 125,
    activeStudents: 110,
    revenue: 6250,
    cover: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80'
  }
];

export const TeacherOverview = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2">Painel de Negócios</h1>
        <p className="text-muted text-sm">Acompanhe seu faturamento, conversões e o desempenho dos seus produtos.</p>
      </div>

      {/* Luz de Fundo Neon (HUD Effect) */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Linha 1: Métricas de Negócio (Borderless Futurista) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
        
        {/* Card 1: Lucro Total */}
        <div className="bg-gradient-to-b from-card/40 to-transparent backdrop-blur-xl border-t border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/20 transition-all duration-500"></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-transparent flex items-center justify-center border border-accent/10">
              <DollarSign className="text-accent group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" size={24} />
            </div>
            <div className="flex items-center gap-1 text-accent bg-accent/10 px-3 py-1.5 rounded-full text-xs font-bold border border-accent/20 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
              <TrendingUp size={14} />
              +15%
            </div>
          </div>
          <p className="text-[10px] font-bold text-muted tracking-widest uppercase mb-1 relative z-10">Lucro Total Acumulado</p>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 relative z-10">R$ 80.050</h2>
        </div>

        {/* Card 2: Vendas Realizadas */}
        <div className="bg-gradient-to-b from-card/40 to-transparent backdrop-blur-xl border-t border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-transparent flex items-center justify-center border border-green-500/10">
              <ShoppingCart className="text-green-500 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" size={24} />
            </div>
            <div className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-1 rounded-full text-[10px] font-bold">
              <ArrowUpRight size={14} />
              +24
            </div>
          </div>
          <p className="text-[10px] font-bold text-muted tracking-widest uppercase mb-1">Vendas Realizadas</p>
          <h2 className="text-3xl font-black text-white">895</h2>
        </div>

        {/* Card 3: Alunos Ativos */}
        <div className="bg-gradient-to-b from-card/40 to-transparent backdrop-blur-xl border-t border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-transparent flex items-center justify-center border border-blue-500/10">
              <Users className="text-blue-500 group-hover:scale-110 transition-transform duration-300" size={24} />
            </div>
            <div className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full text-[10px] font-bold">
              <ArrowUpRight size={14} />
              +8%
            </div>
          </div>
          <p className="text-[10px] font-bold text-muted tracking-widest uppercase mb-1">Alunos Ativos</p>
          <h2 className="text-3xl font-black text-white">780</h2>
        </div>

        {/* Card 4: Taxa de Conclusão */}
        <div className="bg-gradient-to-b from-card/40 to-transparent backdrop-blur-xl border-t border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent flex items-center justify-center border border-purple-500/10">
              <GraduationCap className="text-purple-500 group-hover:scale-110 transition-transform duration-300" size={24} />
            </div>
            <div className="flex items-center gap-1 text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full text-[10px] font-bold">
              <ArrowUpRight size={14} />
              +2%
            </div>
          </div>
          <p className="text-[10px] font-bold text-muted tracking-widest uppercase mb-1">Taxa de Conclusão</p>
          <h2 className="text-3xl font-black text-white">42<span className="text-lg text-muted font-normal">%</span></h2>
        </div>

      </div>

      {/* Gráfico de Faturamento (Recharts) */}
      <div className="mb-10 bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl relative z-10">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white">Faturamento Líquido (6 Meses)</h3>
          <p className="text-sm text-muted">Evolução da sua receita na plataforma.</p>
        </div>
        
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={(value) => `R$ ${value / 1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ color: '#FFD700', fontWeight: 'bold' }}
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Linha 2: Vitrine de Produtos */}
      <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Performance por Produto</h3>
            <p className="text-sm text-muted">Vendas e receita detalhada de cada curso.</p>
          </div>
          <Link to="/teacher/courses" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl transition-colors border border-white/5">
            Gerenciar Cursos
          </Link>
        </div>
        
        <div className="space-y-3">
          {MOCK_TOP_COURSES.map((course, index) => (
            <div 
              key={course.id} 
              className="flex flex-col md:flex-row md:items-center gap-4 p-3 pr-6 rounded-2xl bg-black/20 hover:bg-black/40 transition-all duration-300 group border border-transparent hover:border-white/5"
            >
              {/* Rank Badge */}
              <div className="hidden md:flex w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-transparent items-center justify-center font-black text-white/50 text-base shrink-0 border border-white/5 ml-2">
                {index + 1}
              </div>

              {/* Cover */}
              <div className="w-full md:w-32 h-20 rounded-xl overflow-hidden bg-bg shrink-0 relative">
                {course.cover ? (
                  <img src={course.cover} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <ImageIcon size={20} className="text-white/20" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 pl-2 md:pl-0">
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">{course.category}</p>
                <h4 className="text-base font-bold text-white truncate group-hover:text-accent transition-colors">{course.title}</h4>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:flex items-center gap-6 md:gap-10 mt-4 md:mt-0 px-2 md:px-0">
                <div className="flex flex-col">
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1">Vendas</p>
                  <p className="text-sm font-black text-white">
                    {course.sales} <span className="text-xs text-muted font-normal">un.</span>
                  </p>
                </div>
                
                <div className="flex flex-col">
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1">Acessos</p>
                  <p className="text-sm font-black text-white">
                    {course.activeStudents} <span className="text-xs text-muted font-normal">alunos</span>
                  </p>
                </div>

                <div className="flex flex-col col-span-2 md:col-span-1 mt-2 md:mt-0">
                  <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">Receita</p>
                  <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-500">
                    R$ {course.revenue.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
