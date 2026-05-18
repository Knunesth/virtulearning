import { Link } from "react-router-dom";

export const Cookies = () => {
  return (
    <div className="w-full min-h-[70vh] py-20 px-6 max-w-3xl mx-auto flex flex-col animate-in fade-in duration-500">
      <Link to="/" className="text-sm text-accent hover:underline mb-8 self-start">&larr; Voltar para Home</Link>
      <h1 className="text-4xl font-bold text-white mb-4">Política de Cookies</h1>
      <p className="text-[#a1a1aa] mb-10 text-sm">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      
      <div className="space-y-8 text-[#d4d4d8] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. O que são Cookies?</h2>
          <p>Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de forma mais eficiente, bem como para fornecer informações aos proprietários do site.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Como utilizamos os Cookies</h2>
          <p>A VirtuLearning utiliza cookies para diversas finalidades, incluindo:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Essenciais:</strong> Necessários para o funcionamento básico da plataforma (ex: manter sua sessão logada).</li>
            <li><strong>Desempenho:</strong> Para entender como os usuários interagem com nosso site e melhorar sua performance.</li>
            <li><strong>Funcionalidade:</strong> Para lembrar suas preferências e personalizar sua experiência.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Controle de Cookies</h2>
          <p>Você pode controlar e/ou excluir cookies através das configurações do seu navegador. Observe que desativar certos cookies pode afetar a funcionalidade da nossa plataforma, impedindo que você utilize alguns de nossos serviços de forma adequada.</p>
        </section>
      </div>
    </div>
  );
};
