import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight, PlayCircle, Star, CheckCircle, MonitorPlay, ChevronDown, Zap } from 'lucide-react';
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
    <div className="flex flex-col w-full bg-[#09090b] text-text">
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

      {/* SEÇÃO 1 — Hero */}
      <section className="relative pt-32 pb-32 overflow-hidden flex flex-col items-center text-center px-6 min-h-[90vh] justify-center">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen animate-pulse duration-[4000ms]"></div>
        
        <div className="relative z-10 flex flex-col items-center mt-10">
          {/* Badge de Urgência */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger/10 border border-danger/20 text-xs font-bold tracking-wide text-danger mb-8 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <span className="flex h-2.5 w-2.5 rounded-full bg-danger animate-pulse"></span>
            AO VIVO — 47 alunos estudando agora
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tighter max-w-[90%] md:max-w-6xl leading-[1.1] mx-auto">
            A plataforma definitiva para <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-300 to-orange-500 filter drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">ensinar e aprender.</span>
          </h1>
          
          <p className="text-[#a1a1aa] text-lg md:text-xl max-w-3xl mx-auto mb-6 leading-relaxed font-medium">
            Crie sua própria escola virtual, hospede seus cursos e engaje milhares de alunos com a tecnologia de ensino mais rápida do mercado.
          </p>

          {/* Contador Animado */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm md:text-base font-bold text-white mb-10 bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
            <span className="text-accent">+{stats.alunos}</span> alunos
            <span className="text-white/30 hidden md:inline">•</span>
            <span className="text-accent">+{stats.cursos}</span> cursos
            <span className="text-white/30 hidden md:inline">•</span>
            <span className="text-accent">{stats.sat}%</span> de satisfação
          </div>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
            <Link to="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-14 px-8 text-base shadow-[0_0_40px_rgba(255,215,0,0.25)] hover:shadow-[0_0_60px_rgba(255,215,0,0.4)] transition-all flex items-center justify-center font-bold hover:-translate-y-1 rounded-xl">
                Começar Gratuitamente <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/catalog" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-14 px-8 text-base bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white rounded-xl flex items-center justify-center font-bold transition-all hover:-translate-y-1">
                Explorar Catálogo <PlayCircle size={18} className="ml-2 text-[#a1a1aa]" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — Logos de empresas */}
      <section className="border-y border-white/5 bg-[#121214] py-8 overflow-hidden relative">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-[#71717a] mb-6">
          Profissionais de empresas como estas já estudam aqui
        </p>
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex items-center justify-center md:justify-start [&_div]:mx-8 animate-marquee whitespace-nowrap">
            {/* Primeira leva */}
            {['Google', 'Microsoft', 'Nubank', 'iFood', 'Mercado Livre', 'Itaú'].map((empresa, i) => (
              <div key={i} className="text-2xl md:text-3xl font-black text-white/20 uppercase tracking-tighter hover:text-white/40 transition-colors">
                {empresa}
              </div>
            ))}
            {/* Repetição para scroll infinito */}
            {['Google', 'Microsoft', 'Nubank', 'iFood', 'Mercado Livre', 'Itaú'].map((empresa, i) => (
              <div key={`rep-${i}`} className="text-2xl md:text-3xl font-black text-white/20 uppercase tracking-tighter hover:text-white/40 transition-colors">
                {empresa}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — Proposta de valor em 3 colunas */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Por que escolher o VirtuLearning?</h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-lg">
            Nossa plataforma foi desenhada para acelerar o seu aprendizado com tecnologia de ponta e metodologia focada no mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#121214]/80 border border-white/5 p-10 rounded-3xl hover:border-accent/40 transition-all duration-300 group">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
              <MonitorPlay size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Aprenda no seu ritmo</h3>
            <p className="text-[#a1a1aa] leading-relaxed">
              Aulas gravadas disponíveis 24h por dia, assista quando e onde quiser, do computador, tablet ou celular.
            </p>
          </div>

          <div className="bg-[#121214]/80 border border-white/5 p-10 rounded-3xl hover:border-accent/40 transition-all duration-300 group">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
              <Award size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Certificado reconhecido</h3>
            <p className="text-[#a1a1aa] leading-relaxed">
              Certificados digitais verificáveis emitidos instantaneamente ao concluir cada curso para turbinar seu LinkedIn.
            </p>
          </div>

          <div className="bg-[#121214]/80 border border-white/5 p-10 rounded-3xl hover:border-accent/40 transition-all duration-300 group">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Professores especialistas</h3>
            <p className="text-[#a1a1aa] leading-relaxed">
              Instrutores rigorosamente selecionados com experiência real de mercado ensinando o que funciona na prática.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — Cursos em destaque */}
      <section className="py-24 px-6 bg-[#121214] w-full relative z-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Cursos mais procurados</h2>
              <p className="text-[#a1a1aa] text-lg">Dê o próximo passo na sua carreira com nossos top sellers.</p>
            </div>
            <Link to="/catalog">
              <Button variant="outline" className="font-bold border-white/20 hover:bg-white/10">
                Ver todos os cursos <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coursesData?.data?.slice(0, 3).map((course: any) => (
              <Link to={`/catalog/${course.id}`} key={course.id} className="group bg-[#09090b] rounded-3xl border border-[#27272a] overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(255,215,0,0.15)] hover:-translate-y-1 flex flex-col">
                <div className="aspect-video w-full relative overflow-hidden bg-[#18181b]">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.titulo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#27272a] to-[#18181b] flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                      <BookOpen size={48} className="text-[#3f3f46]" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-accent border border-accent/20 capitalize">
                    {course.nivel || 'Iniciante'}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center text-accent text-sm font-bold">
                      <Star size={14} className="fill-accent mr-1" /> 5.0
                    </span>
                    <span className="text-[#71717a] text-xs font-medium">({course._count?.matriculas || 0} alunos)</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-accent transition-colors">{course.titulo}</h3>
                  <p className="text-[#a1a1aa] text-sm line-clamp-2 mb-6 flex-1">{course.descricao}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#27272a] mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center text-xs font-bold overflow-hidden">
                        {course.professor?.avatar_url ? (
                          <img src={course.professor.avatar_url} alt="Prof" className="w-full h-full object-cover" />
                        ) : (
                          course.professor?.nome?.charAt(0) || 'P'
                        )}
                      </div>
                      <span className="text-xs font-medium text-[#a1a1aa] truncate max-w-[100px]">{course.professor?.nome?.split(' ')[0]}</span>
                    </div>
                    <div className="text-lg font-black text-white">
                      {Number(course.preco) === 0 ? 'Grátis' : `R$ ${Number(course.preco).toFixed(2).replace('.', ',')}`}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {!coursesData && [1, 2, 3].map(i => (
              <div key={i} className="bg-[#121214] rounded-3xl h-[400px] animate-pulse border border-white/5"></div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — Como funciona */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Comece a aprender em 3 passos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Linha conectora (visível apenas em desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 z-0"></div>

          <div className="flex flex-col items-center text-center relative z-10 group">
            <div className="w-24 h-24 rounded-full bg-[#121214] border-4 border-[#27272a] flex items-center justify-center text-3xl font-black text-[#a1a1aa] mb-8 group-hover:border-accent group-hover:text-accent group-hover:scale-110 transition-all duration-300">
              01
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Crie sua conta</h3>
            <p className="text-[#a1a1aa] leading-relaxed">
              O cadastro é 100% gratuito, rápido e sem burocracia. Em menos de 2 minutos você já está na plataforma.
            </p>
          </div>

          <div className="flex flex-col items-center text-center relative z-10 group">
            <div className="w-24 h-24 rounded-full bg-[#121214] border-4 border-[#27272a] flex items-center justify-center text-3xl font-black text-[#a1a1aa] mb-8 group-hover:border-accent group-hover:text-accent group-hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.15)]">
              02
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Escolha seu curso</h3>
            <p className="text-[#a1a1aa] leading-relaxed">
              Explore nosso catálogo com centenas de opções nas áreas mais quentes de tecnologia e negócios.
            </p>
          </div>

          <div className="flex flex-col items-center text-center relative z-10 group">
            <div className="w-24 h-24 rounded-full bg-[#121214] border-4 border-[#27272a] flex items-center justify-center text-3xl font-black text-[#a1a1aa] mb-8 group-hover:border-accent group-hover:text-accent group-hover:scale-110 transition-all duration-300">
              03
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Conquiste o certificado</h3>
            <p className="text-[#a1a1aa] leading-relaxed">
              Assista às aulas, complete os desafios práticos e receba seu certificado verificado para o mercado.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 — Depoimentos */}
      <section className="py-24 px-6 bg-[#121214] border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent to-transparent"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-16">O que nossos alunos dizem</h2>
          
          <div className="relative min-h-[250px] md:min-h-[200px] flex items-center justify-center">
            {TESTIMONIALS.map((t, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
                  activeTestimonial === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'
                }`}
              >
                <div className="mb-6 text-accent">
                  <Star size={32} className="fill-accent inline-block" />
                  <Star size={32} className="fill-accent inline-block mx-1" />
                  <Star size={32} className="fill-accent inline-block" />
                  <Star size={32} className="fill-accent inline-block mx-1" />
                  <Star size={32} className="fill-accent inline-block" />
                </div>
                <p className="text-xl md:text-2xl lg:text-3xl font-medium text-white max-w-4xl italic mb-10 leading-snug">
                  "{t.texto}"
                </p>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full ${t.avatarColor} flex items-center justify-center text-xl font-bold text-white border-2 border-white/20`}>
                    {t.nome.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg text-white">{t.nome}</p>
                    <p className="text-sm font-medium text-[#a1a1aa]">{t.cargo} na <span className="text-accent">{t.empresa}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-12">
            {TESTIMONIALS.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === idx ? 'bg-accent w-10' : 'bg-white/20 hover:bg-white/40'}`}
                aria-label={`Ver depoimento ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 7 — Banner de urgência/CTA */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto bg-accent rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(255,215,0,0.2)]">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-[#09090b] mb-6 tracking-tight">
              Comece hoje. <br className="hidden md:block" />Sua carreira não pode esperar.
            </h2>
            <p className="text-[#27272a] mb-12 max-w-2xl mx-auto text-xl font-bold">
              Primeiro mês grátis. Cancele quando quiser.
            </p>
            
            <Link to="/register" className="inline-block mb-8">
              <button className="bg-[#09090b] text-white h-16 px-12 text-xl shadow-2xl font-bold hover:scale-105 hover:-translate-y-1 transition-all duration-300 rounded-2xl flex items-center justify-center gap-2">
                Criar conta gratuita <ArrowRight size={24} />
              </button>
            </Link>

            <div className="flex items-center justify-center gap-3 text-[#27272a] font-bold text-sm bg-black/5 inline-flex mx-auto px-6 py-3 rounded-full backdrop-blur-sm">
              <Clock size={18} />
              <span>Oferta expira em: </span>
              <span className="font-black bg-[#09090b] text-accent px-2 py-1 rounded text-lg tracking-widest font-mono">
                {formatTime(timeLeft.h)}:{formatTime(timeLeft.m)}:{formatTime(timeLeft.s)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 8 — FAQ */}
      <section className="py-24 px-6 max-w-4xl mx-auto w-full relative z-10 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Perguntas frequentes</h2>
          <p className="text-[#a1a1aa] text-lg">Tudo o que você precisa saber antes de se matricular.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-[#121214] border border-[#27272a] rounded-2xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors focus:outline-none"
              >
                <span className="text-lg font-bold text-white">{faq.q}</span>
                <ChevronDown size={20} className={`text-accent transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaq === idx ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-[#a1a1aa] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
