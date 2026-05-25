import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight, PlayCircle, Star, CheckCircle, MonitorPlay, ChevronDown, Zap, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';

// Mock data para depoimentos
const TESTIMONIALS = [
  {
    nome: "Ana Silva",
    cargo: "Desenvolvedora Frontend",
    empresa: "TechCorp",
    texto: "Consegui minha primeira vaga como dev 3 meses após concluir o curso de React. A didática dos professores é sensacional e o certificado fez toda a diferença.",
    avatarColor: "bg-blue-500"
  },
  {
    nome: "Carlos Mendes",
    cargo: "Analista de Dados",
    empresa: "FinBank",
    texto: "Os cursos de Python e SQL da VirtuLearning me deram a base exata que eu precisava para a transição de carreira. Hoje trabalho na maior fintech do país.",
    avatarColor: "bg-green-500"
  },
  {
    nome: "Marina Costa",
    cargo: "Tech Lead",
    empresa: "StartupX",
    texto: "Uso a plataforma para treinar todo o meu time de juniores. A qualidade técnica do conteúdo e a praticidade de assistir em qualquer lugar são imbatíveis.",
    avatarColor: "bg-purple-500"
  }
];

// FAQ Data
const FAQS = [
  { q: "Como funciona o período gratuito?", a: "Você tem acesso total a todos os recursos da plataforma durante os primeiros 30 dias. Não cobramos nada até o fim desse período e você pode cancelar quando quiser." },
  { q: "Os certificados são reconhecidos pelo mercado?", a: "Sim! Nossos certificados possuem chave de autenticação digital e são amplamente reconhecidos por grandes empresas de tecnologia em todo o Brasil." },
  { q: "Posso assistir as aulas offline?", a: "Atualmente as aulas requerem conexão com a internet, mas nosso player é otimizado para funcionar perfeitamente mesmo em conexões lentas (3G/4G)." },
  { q: "Como me torno um professor na plataforma?", a: "Temos um processo seletivo para professores. Basta clicar em 'Torne-se Professor' no rodapé, preencher o formulário e nossa equipe avaliará seu perfil em até 48 horas." },
  { q: "Existe suporte para dúvidas durante o curso?", a: "Sim, todos os cursos possuem um fórum exclusivo onde você pode tirar dúvidas diretamente com os professores e interagir com outros alunos." }
];

export const Landing = () => {
  // Estados
  const [stats, setStats] = useState({ alunos: 0, cursos: 0, sat: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 47, s: 12 });

  // Fetch Cursos em Destaque
  const { data: coursesData } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const res = await api.get('/courses?limit=3');
      return res.data;
    }
  });

  // Efeito Contador Animado Hero
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2500;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart

      setStats({
        alunos: Math.floor(ease * 2400),
        cursos: Math.floor(ease * 180),
        sat: Math.floor(ease * 98)
      });

      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  // Efeito Carrossel Depoimentos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Efeito Contador Regressivo CTA
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) { s--; }
        else if (m > 0) { s = 59; m--; }
        else if (h > 0) { s = 59; m = 59; h--; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex flex-col w-full bg-[#09090b] text-text overflow-x-hidden">
      {/* Estilos locais para a animação do marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* ── SEÇÃO 1 — Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 md:pb-32 overflow-hidden flex flex-col items-center text-center px-4 sm:px-6 min-h-[85vh] sm:min-h-[90vh] justify-center">
        {/* Grid de fundo */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Glow amarelo */}
        <div className="absolute top-1/3 left-1/2 w-[280px] sm:w-[400px] md:w-[500px] h-[280px] sm:h-[400px] md:h-[500px] bg-accent/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen animate-pulse duration-[4000ms]"></div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto">
          {/* Badge de Urgência */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold tracking-wide text-accent mb-6 sm:mb-8 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
            AO VIVO — 47 alunos estudando agora
          </div>

          {/* Headline principal */}
          <h1 className="text-[2.2rem] leading-[1.15] sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-4 sm:mb-6 tracking-tighter w-full px-2 sm:px-0 mx-auto">
            A plataforma definitiva para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-300 to-orange-500 filter drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
              ensinar e aprender.
            </span>
          </h1>

          <p className="text-[#a1a1aa] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-medium px-2 sm:px-0">
            Crie sua própria escola virtual, hospede seus cursos e engaje milhares de alunos com a tecnologia de ensino mais rápida do mercado.
          </p>

          {/* Contador Animado */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base font-bold text-white mb-8 sm:mb-10 bg-white/5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/10 backdrop-blur-md w-fit mx-auto">
            <span className="text-accent">+{stats.alunos}</span> alunos
            <span className="text-white/30">•</span>
            <span className="text-accent">+{stats.cursos}</span> cursos
            <span className="text-white/30">•</span>
            <span className="text-accent">{stats.sat}%</span> de satisfação
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto justify-center px-2 sm:px-0">
            <Link to="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base shadow-[0_0_40px_rgba(255,215,0,0.25)] hover:shadow-[0_0_60px_rgba(255,215,0,0.4)] transition-all flex items-center justify-center font-bold hover:-translate-y-1 rounded-xl">
                Começar Gratuitamente <ArrowRight size={16} className="ml-2 sm:w-[18px] sm:h-[18px]" />
              </Button>
            </Link>
            <Link to="/catalog" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white rounded-xl flex items-center justify-center font-bold transition-all hover:-translate-y-1">
                Explorar Catálogo <PlayCircle size={16} className="ml-2 text-[#a1a1aa] sm:w-[18px] sm:h-[18px]" />
              </button>
            </Link>
          </div>

          {/* Prova rápida de segurança — mobile apenas */}
          <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8 text-xs text-[#71717a] flex-wrap">
            <span className="flex items-center gap-1"><CheckCircle size={12} className="text-accent" /> Grátis por 30 dias</span>
            <span className="flex items-center gap-1"><CheckCircle size={12} className="text-accent" /> Sem cartão</span>
            <span className="flex items-center gap-1"><Zap size={12} className="text-accent" /> Acesso imediato</span>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 2 — Logos de empresas ───────────────────────────────── */}
      <section className="border-y border-white/5 bg-[#121214] py-6 sm:py-8 overflow-hidden relative">
        <p className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#71717a] mb-5 sm:mb-6 px-4">
          Profissionais de empresas como estas já estudam aqui
        </p>
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_80px,_black_calc(100%-80px),transparent_100%)] sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex items-center [&_div]:mx-5 sm:[&_div]:mx-8 animate-marquee whitespace-nowrap">
            {['Google', 'Microsoft', 'Nubank', 'iFood', 'Mercado Livre', 'Itaú'].map((empresa, i) => (
              <div key={i} className="text-xl sm:text-2xl md:text-3xl font-black text-white/20 uppercase tracking-tighter hover:text-white/40 transition-colors">
                {empresa}
              </div>
            ))}
            {['Google', 'Microsoft', 'Nubank', 'iFood', 'Mercado Livre', 'Itaú'].map((empresa, i) => (
              <div key={`rep-${i}`} className="text-xl sm:text-2xl md:text-3xl font-black text-white/20 uppercase tracking-tighter hover:text-white/40 transition-colors">
                {empresa}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3 — Proposta de valor ───────────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-6">Por que escolher o VirtuLearning?</h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2">
            Nossa plataforma foi desenhada para acelerar o seu aprendizado com tecnologia de ponta e metodologia focada no mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            { icon: <MonitorPlay size={28} />, title: "Aprenda no seu ritmo", desc: "Aulas gravadas disponíveis 24h por dia, assista quando e onde quiser, do computador, tablet ou celular." },
            { icon: <Award size={28} />, title: "Certificado reconhecido", desc: "Certificados digitais verificáveis emitidos instantaneamente ao concluir cada curso para turbinar seu LinkedIn." },
            { icon: <Users size={28} />, title: "Professores especialistas", desc: "Instrutores rigorosamente selecionados com experiência real de mercado ensinando o que funciona na prática." },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] hover:bg-white/10 transition-all duration-500 group shadow-2xl shadow-black/50 hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-accent/20 to-transparent rounded-xl sm:rounded-2xl flex items-center justify-center text-accent mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500 border border-accent/20">
                {item.icon}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-4">{item.title}</h3>
              <p className="text-[#a1a1aa] leading-relaxed text-sm sm:text-base">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEÇÃO 4 — Cursos em destaque ──────────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-[#121214] w-full relative z-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 md:mb-16 gap-4 sm:gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 sm:mb-4">Cursos mais procurados</h2>
              <p className="text-[#a1a1aa] text-sm sm:text-base md:text-lg">Dê o próximo passo na sua carreira com nossos top sellers.</p>
            </div>
            <Link to="/catalog" className="flex-shrink-0">
              <Button variant="outline" className="font-bold border-white/20 hover:bg-white/10 text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-6">
                Ver todos <ArrowRight size={14} className="ml-1.5 sm:ml-2" />
              </Button>
            </Link>
          </div>

          {/* Grade: 1 coluna mobile, 2 tablet, 3 desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {coursesData?.data?.slice(0, 3).map((course: any) => (
              <Link to={`/catalog/${course.id}`} key={course.id} className="group bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-[2rem] border border-white/10 overflow-hidden hover:border-accent/50 transition-all duration-500 hover:shadow-[0_15px_40px_-10px_rgba(255,215,0,0.2)] hover:-translate-y-2 flex flex-col">
                <div className="aspect-video w-full relative overflow-hidden bg-[#18181b]">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.titulo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#27272a] to-[#18181b] flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                      <BookOpen size={40} className="text-[#3f3f46]" />
                    </div>
                  )}
                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 bg-black/80 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold text-accent border border-accent/20 capitalize">
                    {course.nivel || 'Iniciante'}
                  </div>
                </div>

                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="flex items-center text-accent text-sm font-bold">
                      <Star size={13} className="fill-accent mr-1" /> 5.0
                    </span>
                    <span className="text-[#71717a] text-xs font-medium">({course._count?.matriculas || 0} alunos)</span>
                  </div>

                  <h3 className="text-base sm:text-xl font-bold text-white mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-accent transition-colors">{course.titulo}</h3>
                  <p className="text-[#a1a1aa] text-xs sm:text-sm line-clamp-2 mb-4 sm:mb-6 flex-1">{course.descricao}</p>

                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[#27272a] mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#27272a] flex items-center justify-center text-xs font-bold overflow-hidden">
                        {course.professor?.avatar_url ? (
                          <img src={course.professor.avatar_url} alt="Prof" className="w-full h-full object-cover" />
                        ) : (
                          course.professor?.nome?.charAt(0) || 'P'
                        )}
                      </div>
                      <span className="text-xs font-medium text-[#a1a1aa] truncate max-w-[90px] sm:max-w-[100px]">{course.professor?.nome?.split(' ')[0]}</span>
                    </div>
                    <div className="text-base sm:text-lg font-black text-white">
                      {Number(course.preco) === 0 ? 'Grátis' : `R$ ${Number(course.preco).toFixed(2).replace('.', ',')}`}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {!coursesData && [1, 2, 3].map(i => (
              <div key={i} className="bg-[#121214] rounded-2xl sm:rounded-3xl h-[320px] sm:h-[400px] animate-pulse border border-white/5"></div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 5 — Como funciona ───────────────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-6">Comece a aprender em 3 passos</h2>
        </div>

        {/* Mobile: cards verticais com numeração. Desktop: grid horizontal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 relative">
          {/* Linha conectora (desktop) */}
          <div className="hidden sm:block absolute top-10 md:top-12 left-[18%] right-[18%] h-[2px] bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 z-0"></div>

          {[
            { num: "01", title: "Crie sua conta", desc: "O cadastro é 100% gratuito, rápido e sem burocracia. Em menos de 2 minutos você já está na plataforma.", rotate: "rotate-3" },
            { num: "02", title: "Escolha seu curso", desc: "Explore nosso catálogo com centenas de opções nas áreas mais quentes de tecnologia e negócios.", rotate: "-rotate-3" },
            { num: "03", title: "Conquiste o certificado", desc: "Assista às aulas, complete os desafios práticos e receba seu certificado verificado para o mercado.", rotate: "rotate-3" },
          ].map((step, i) => (
            <div key={i} className="flex sm:flex-col items-start sm:items-center sm:text-center gap-4 sm:gap-0 relative z-10 group bg-white/[0.02] sm:bg-transparent border border-white/[0.06] sm:border-0 rounded-2xl sm:rounded-none p-5 sm:p-0">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 rounded-2xl sm:rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-black text-[#a1a1aa] sm:mb-6 md:mb-8 group-hover:border-accent/50 group-hover:bg-accent/10 group-hover:text-accent group-hover:scale-110 transition-all duration-500 shadow-xl shadow-black/50 sm:${step.rotate} group-hover:rotate-0`}>
                {step.num}
              </div>
              <div>
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-1.5 sm:mb-4">{step.title}</h3>
                <p className="text-[#a1a1aa] leading-relaxed text-sm sm:text-base">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEÇÃO 6 — Depoimentos ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-[#121214] border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-10 sm:mb-14 md:mb-16">O que nossos alunos dizem</h2>

          <div className="relative min-h-[320px] sm:min-h-[280px] md:min-h-[250px] flex items-center justify-center">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
                  activeTestimonial === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'
                }`}
              >
                <div className="mb-5 sm:mb-8 text-accent flex">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={20} className="fill-accent mx-0.5 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  ))}
                </div>
                <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-white italic mb-6 sm:mb-10 leading-relaxed font-medium max-w-3xl px-2 sm:px-0">"{t.texto}"</p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full ${t.avatarColor} flex items-center justify-center text-base sm:text-lg md:text-xl font-bold text-white border-2 border-white/20`}>
                    {t.nome.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm sm:text-base md:text-lg text-white">{t.nome}</p>
                    <p className="text-xs sm:text-sm font-medium text-[#a1a1aa]">{t.cargo} na <span className="text-accent">{t.empresa}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2.5 sm:gap-3 mt-8 sm:mt-12">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${activeTestimonial === idx ? 'bg-accent w-8 sm:w-10' : 'w-2.5 sm:w-3 bg-white/20 hover:bg-white/40'}`}
                aria-label={`Ver depoimento ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 7 — Banner CTA urgência ─────────────────────────────── */}
      <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-accent rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(255,215,0,0.2)]">
          <div className="absolute top-0 right-0 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-white/20 rounded-full blur-[60px] sm:blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-black/10 rounded-full blur-[60px] sm:blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#09090b] mb-3 sm:mb-6 tracking-tight">
              Comece hoje.{' '}
              <span className="block sm:inline">Sua carreira não pode esperar.</span>
            </h2>
            <p className="text-[#27272a] mb-6 sm:mb-10 md:mb-12 max-w-xl mx-auto text-sm sm:text-lg md:text-xl font-bold">
              Primeiro mês grátis. Cancele quando quiser.
            </p>

            <Link to="/register" className="inline-block mb-5 sm:mb-8">
              <button className="bg-[#09090b] text-white h-12 sm:h-14 md:h-16 px-7 sm:px-10 md:px-12 text-sm sm:text-lg md:text-xl shadow-2xl font-bold hover:scale-105 hover:-translate-y-1 transition-all duration-300 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2">
                Criar conta gratuita <ArrowRight size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[#27272a] font-bold text-xs sm:text-sm">
              <Clock size={14} className="sm:w-[18px] sm:h-[18px]" />
              <span>Oferta expira em:</span>
              <span className="font-black bg-[#09090b] text-accent px-2 py-1 rounded text-sm sm:text-lg tracking-widest font-mono">
                {formatTime(timeLeft.h)}:{formatTime(timeLeft.m)}:{formatTime(timeLeft.s)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 8 — FAQ ─────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 max-w-3xl md:max-w-4xl mx-auto w-full relative z-10 mb-10 sm:mb-16 md:mb-20">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-6">Perguntas frequentes</h2>
          <p className="text-[#a1a1aa] text-sm sm:text-base md:text-lg">Tudo o que você precisa saber antes de se matricular.</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/[0.07] hover:border-accent/30 hover:shadow-lg">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 sm:px-8 py-4 sm:py-6 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-sm sm:text-base md:text-lg font-bold text-white pr-3">{faq.q}</span>
                <ChevronDown size={20} className={`text-accent transition-transform duration-500 flex-shrink-0 sm:w-6 sm:h-6 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              <div
                className={`px-5 sm:px-8 overflow-hidden transition-all duration-500 ease-in-out ${
                  openFaq === idx ? 'max-h-60 pb-5 sm:pb-8 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-[#a1a1aa] leading-relaxed text-sm sm:text-base md:text-lg">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
