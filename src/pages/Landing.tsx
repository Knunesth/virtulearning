import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Zap, ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing = () => {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden flex flex-col items-center text-center px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121214] border border-[#27272a] text-[11px] font-bold tracking-wide text-[#a1a1aa] mb-8 hover:text-white transition-colors cursor-pointer shadow-sm uppercase">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          VirtuLearning 2.0 Disponível
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight max-w-4xl leading-tight">
          A plataforma definitiva para <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">ensinar e aprender.</span>
        </h1>
        
        <p className="text-[#a1a1aa] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Crie sua própria escola virtual, hospede seus cursos e engaje milhares de alunos com a tecnologia de ensino mais rápida do mercado.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link to="/register" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-14 px-8 text-base shadow-[0_0_40px_rgba(255,215,0,0.2)] hover:shadow-[0_0_60px_rgba(255,215,0,0.3)] transition-all flex items-center justify-center font-bold">
              Começar Gratuitamente <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
          <Link to="/catalog" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto h-14 px-8 text-base bg-[#121214]/50 backdrop-blur-md border border-[#27272a] hover:bg-[#27272a] text-white rounded-md flex items-center justify-center font-bold transition-colors">
              Explorar Catálogo <PlayCircle size={18} className="ml-2 text-[#a1a1aa]" />
            </button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-[#27272a] bg-[#09090b]/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#27272a] text-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">50k+</h3>
            <p className="text-[10px] md:text-xs text-[#71717a] uppercase tracking-wider font-bold">Alunos Ativos</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">1.200</h3>
            <p className="text-[10px] md:text-xs text-[#71717a] uppercase tracking-wider font-bold">Cursos Publicados</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">99.9%</h3>
            <p className="text-[10px] md:text-xs text-[#71717a] uppercase tracking-wider font-bold">Uptime do Sistema</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">4.9/5</h3>
            <p className="text-[10px] md:text-xs text-[#71717a] uppercase tracking-wider font-bold">Avaliação Média</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tudo o que você precisa em um só lugar</h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-sm md:text-base">Nossa infraestrutura cuida do trabalho pesado para que você foque apenas em criar o melhor conteúdo para sua audiência.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121214] border border-[#27272a] p-8 rounded-2xl hover:border-accent/50 transition-colors group shadow-lg">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Gestão de Cursos</h3>
            <p className="text-[#a1a1aa] text-sm leading-relaxed">Crie trilhas de aprendizado interativas, módulos e aulas com suporte a vídeos em 4K, PDFs e quizzes dinâmicos.</p>
          </div>

          <div className="bg-[#121214] border border-[#27272a] p-8 rounded-2xl hover:border-accent/50 transition-colors group shadow-lg">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Comunidade Viva</h3>
            <p className="text-[#a1a1aa] text-sm leading-relaxed">Acompanhe o progresso de cada estudante em tempo real, forneça feedbacks e crie uma comunidade altamente engajada.</p>
          </div>

          <div className="bg-[#121214] border border-[#27272a] p-8 rounded-2xl hover:border-accent/50 transition-colors group shadow-lg">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Certificação Automática</h3>
            <p className="text-[#a1a1aa] text-sm leading-relaxed">Gere e envie certificados de conclusão personalizados e verificáveis automaticamente para seus alunos aprovados.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full mb-10 relative z-10">
        <div className="bg-gradient-to-br from-[#18181b] to-[#09090b] border border-[#27272a] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px]"></div>
          
          <Zap size={40} className="text-accent mx-auto mb-6 relative z-10" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">Pronto para transformar a educação?</h2>
          <p className="text-[#a1a1aa] mb-8 max-w-xl mx-auto relative z-10 text-sm md:text-base">Junte-se a milhares de professores e alunos que já estão construindo o futuro na VirtuLearning hoje mesmo.</p>
          
          <Link to="/register" className="relative z-10 inline-block">
            <Button className="h-14 px-10 text-base shadow-xl font-bold hover:scale-105 transition-transform">Criar minha conta gratuitamente</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
