import { Link } from "react-router-dom";
import { Users, Target, Zap } from "lucide-react";

export const About = () => {
  return (
    <div className="w-full min-h-[70vh] py-20 px-6 max-w-4xl mx-auto flex flex-col animate-in fade-in duration-500">
      <Link to="/" className="text-sm text-accent hover:underline mb-8 self-start">&larr; Voltar para Home</Link>
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Sobre a <span className="text-accent">VirtuLearning</span></h1>
        <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto leading-relaxed">
          Nascemos com a missão de democratizar a criação e o consumo de educação de alta qualidade através de tecnologia de ponta.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-[#121214] border border-[#27272a] p-6 rounded-2xl">
          <Target className="text-accent mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2">Nossa Missão</h3>
          <p className="text-[#a1a1aa] text-sm leading-relaxed">Capacitar educadores e instituições a compartilharem conhecimento de forma eficiente e escalável pelo mundo.</p>
        </div>
        <div className="bg-[#121214] border border-[#27272a] p-6 rounded-2xl">
          <Zap className="text-orange-500 mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2">Inovação</h3>
          <p className="text-[#a1a1aa] text-sm leading-relaxed">Construímos ferramentas que resolvem os gargalos reais do ensino a distância com performance absurda.</p>
        </div>
        <div className="bg-[#121214] border border-[#27272a] p-6 rounded-2xl">
          <Users className="text-accent mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2">Comunidade</h3>
          <p className="text-[#a1a1aa] text-sm leading-relaxed">Acreditamos que o aprendizado verdadeiro acontece em conjunto. Focamos em interação e engajamento real.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#18181b] to-[#09090b] border border-[#27272a] rounded-3xl p-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Junte-se à revolução</h2>
        <p className="text-[#a1a1aa] mb-8">Estamos construindo o futuro do EAD. Venha fazer parte dessa história.</p>
        <Link to="/register" className="inline-block bg-accent text-black font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform">
          Criar minha conta
        </Link>
      </div>
    </div>
  );
};
