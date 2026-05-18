import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Zap, ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';


export const Landing = () => {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-700 bg-[#09090b]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden flex flex-col items-center text-center px-6 min-h-[95vh] justify-center">
        {/* Background Grid Pattern & Mesh Glow */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Animated Glow Orbs */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen animate-pulse duration-[4000ms]"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-[150px] pointer-events-none translate-x-1/2 translate-y-1/2 mix-blend-screen"></div>
        
        {/* Subtle radial gradient overlay to ensure text readability */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#09090b]/60 to-[#09090b] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold tracking-wide text-white/80 mb-8 hover:bg-white/10 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,215,0,0.1)] uppercase group">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#FFD700]"></span>
            VirtuLearning 2.0 Disponível
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tighter max-w-[90%] md:max-w-6xl xl:max-w-7xl leading-[1.1] mx-auto">
            A plataforma definitiva para <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-300 to-orange-500 filter drop-shadow-[0_0_20px_rgba(255,215,0,0.3)] inline-block">ensinar e aprender.</span>
          </h1>
          
          <p className="text-[#a1a1aa] text-lg md:text-xl max-w-3xl xl:max-w-4xl mx-auto mb-10 leading-relaxed font-medium">
            Crie sua própria escola virtual, hospede seus cursos e engaje milhares de alunos com a tecnologia de ensino mais rápida do mercado.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
            <Link to="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-14 px-8 text-base shadow-[0_0_40px_rgba(255,215,0,0.25)] hover:shadow-[0_0_60px_rgba(255,215,0,0.4)] transition-all flex items-center justify-center font-bold hover:-translate-y-1 rounded-xl">
                Começar Gratuitamente <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/catalog" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-14 px-8 text-base bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-xl flex items-center justify-center font-bold transition-all hover:-translate-y-1">
                Explorar Catálogo <PlayCircle size={18} className="ml-2 text-[#a1a1aa]" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-20 px-6">
        <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { value: "50k+", label: "Alunos Ativos" },
            { value: "1.200", label: "Cursos Publicados" },
            { value: "99.9%", label: "Uptime do Sistema" },
            { value: "4.9/5", label: "Avaliação Média" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#121214]/60 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-2xl text-center shadow-2xl hover:border-accent/30 hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 mb-2">{stat.value}</h3>
              <p className="text-[10px] md:text-xs text-accent uppercase tracking-[0.2em] font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 max-w-7xl 2xl:max-w-[1400px] mx-auto w-full relative z-10">
        <div className="text-center mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10 tracking-tight">Tudo o que você precisa <br className="hidden md:block"/>em um só lugar</h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-lg relative z-10">Nossa infraestrutura cuida do trabalho pesado para que você foque apenas em criar o melhor conteúdo para sua audiência.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-[#121214]/80 backdrop-blur-sm border border-white/5 p-10 rounded-3xl hover:border-accent/40 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,215,0,0.1)]">
            <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-transparent rounded-xl flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform duration-300 border border-accent/10">
              <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Gestão de Cursos</h3>
            <p className="text-[#a1a1aa] leading-relaxed">Crie trilhas de aprendizado interativas, módulos e aulas com suporte a vídeos em 4K, PDFs e quizzes dinâmicos.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#121214]/80 backdrop-blur-sm border border-white/5 p-10 rounded-3xl hover:border-accent/40 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,215,0,0.1)]">
            <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-transparent rounded-xl flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform duration-300 border border-accent/10">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Comunidade Viva</h3>
            <p className="text-[#a1a1aa] leading-relaxed">Acompanhe o progresso de cada estudante em tempo real, forneça feedbacks e crie uma comunidade altamente engajada.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#121214]/80 backdrop-blur-sm border border-white/5 p-10 rounded-3xl hover:border-accent/40 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,215,0,0.1)]">
            <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-transparent rounded-xl flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform duration-300 border border-accent/10">
              <Award size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Certificação Automática</h3>
            <p className="text-[#a1a1aa] leading-relaxed">Gere e envie certificados de conclusão personalizados e verificáveis automaticamente para seus alunos aprovados.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 max-w-6xl 2xl:max-w-7xl mx-auto w-full mb-20 relative z-10">
        <div className="relative rounded-[2.5rem] p-[1px] bg-gradient-to-b from-accent/50 via-accent/10 to-transparent overflow-hidden group hover:shadow-[0_0_80px_rgba(255,215,0,0.15)] transition-all duration-700">
          {/* Noise effect placeholder (can add real SVG noise if desired, kept simple for now) */}
          <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none"></div>
          
          <div className="bg-[#09090b] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden h-full w-full">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 group-hover:bg-accent/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-8 border border-accent/20 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                <Zap size={40} className="animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Pronto para transformar a educação?</h2>
              <p className="text-[#a1a1aa] mb-10 max-w-xl mx-auto text-lg leading-relaxed">Junte-se a milhares de professores e alunos que já estão construindo o futuro na VirtuLearning hoje mesmo.</p>
              
              <Link to="/register" className="inline-block">
                <Button className="h-16 px-12 text-lg shadow-[0_0_40px_rgba(255,215,0,0.3)] font-bold hover:scale-105 hover:-translate-y-1 transition-all duration-300 rounded-xl">
                  Criar minha conta gratuitamente
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
