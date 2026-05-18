import { Link } from "react-router-dom";

export const Privacy = () => {
  return (
    <div className="w-full min-h-[70vh] py-20 px-6 max-w-3xl mx-auto flex flex-col animate-in fade-in duration-500">
      <Link to="/" className="text-sm text-accent hover:underline mb-8 self-start">&larr; Voltar para Home</Link>
      <h1 className="text-4xl font-bold text-white mb-4">Política de Privacidade</h1>
      <p className="text-[#a1a1aa] mb-10 text-sm">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      
      <div className="space-y-8 text-[#d4d4d8] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Coleta de Dados</h2>
          <p>Coletamos informações que você nos fornece diretamente, como nome, e-mail e dados de pagamento ao criar uma conta. Também coletamos dados automaticamente sobre como você utiliza nossa plataforma, incluindo seu endereço IP e tipo de navegador.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Uso das Informações</h2>
          <p>Utilizamos seus dados para fornecer, manter e melhorar nossos serviços, processar transações, enviar comunicações importantes e personalizar sua experiência educacional. Não vendemos suas informações pessoais para terceiros.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Proteção de Dados</h2>
          <p>Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Seus dados de pagamento são processados por parceiros seguros e em conformidade com o PCI-DSS.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Seus Direitos</h2>
          <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento. Também pode optar por não receber comunicações de marketing. Para exercer esses direitos, entre em contato com nosso suporte.</p>
        </section>
      </div>
    </div>
  );
};
