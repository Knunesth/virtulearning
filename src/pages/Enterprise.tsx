import { Link } from "react-router-dom";
import { Briefcase, ShieldCheck, BarChart3 } from "lucide-react";

export const Enterprise = () => {
  return (
    <div className="w-full min-h-[70vh] py-20 px-6 max-w-4xl mx-auto flex flex-col animate-in fade-in duration-500">
      <Link to="/" className="text-sm text-accent hover:underline mb-8 self-start">&larr; Voltar para Home</Link>
      
      <div className="text-center mb-16">
        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-accent mb-6 uppercase tracking-wider">
          Para Instituições
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Educação Corporativa de <span className="text-accent">Alta Performance</span></h1>
        <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto leading-relaxed">
          Infraestrutura robusta, segurança de nível bancário e relatórios detalhados para treinar seu time ou sua rede de clientes.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-[#121214] border border-[#27272a] p-6 rounded-2xl">
          <Briefcase className="text-accent mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2">Marca Branca (Whitelabel)</h3>
          <p className="text-[#a1a1aa] text-sm leading-relaxed">Tenha sua própria universidade corporativa com seu domínio, suas cores e seu logotipo. Nossa marca não aparece.</p>
        </div>
        <div className="bg-[#121214] border border-[#27272a] p-6 rounded-2xl">
          <ShieldCheck className="text-orange-500 mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2">Segurança e SSO</h3>
          <p className="text-[#a1a1aa] text-sm leading-relaxed">Integração nativa com Active Directory, Google Workspace e infraestrutura blindada contra pirataria.</p>
        </div>
        <div className="bg-[#121214] border border-[#27272a] p-6 rounded-2xl">
          <BarChart3 className="text-accent mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2">People Analytics</h3>
          <p className="text-[#a1a1aa] text-sm leading-relaxed">Acompanhe o engajamento, taxas de conclusão e métricas de aprendizado da sua equipe em tempo real.</p>
        </div>
      </div>

      <div className="bg-[#121214] border border-accent/20 rounded-3xl p-10 text-center shadow-[0_0_40px_rgba(255,215,0,0.05)]">
        <h2 className="text-2xl font-bold text-white mb-4">Fale com um Especialista</h2>
        <p className="text-[#a1a1aa] mb-8 max-w-lg mx-auto">Nossa equipe está pronta para entender as necessidades da sua operação e desenhar uma arquitetura exclusiva.</p>
        <button className="inline-block bg-white text-black font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform">
          Agendar Demonstração
        </button>
      </div>
    </div>
  );
};
