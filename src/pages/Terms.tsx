import { Link } from "react-router-dom";

export const Terms = () => {
  return (
    <div className="w-full min-h-[70vh] py-20 px-6 max-w-3xl mx-auto flex flex-col animate-in fade-in duration-500">
      <Link to="/" className="text-sm text-accent hover:underline mb-8 self-start">&larr; Voltar para Home</Link>
      <h1 className="text-4xl font-bold text-white mb-4">Termos de Uso</h1>
      <p className="text-[#a1a1aa] mb-10 text-sm">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      
      <div className="space-y-8 text-[#d4d4d8] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Aceitação dos Termos</h2>
          <p>Ao acessar e utilizar a plataforma VirtuLearning, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve utilizar nossos serviços.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Uso da Plataforma</h2>
          <p>A VirtuLearning fornece uma infraestrutura para criação e consumo de cursos online. Você é responsável por todo o conteúdo que publicar e pelas atividades realizadas em sua conta. É estritamente proibido o uso da plataforma para fins ilegais, difamatórios ou que violem os direitos de terceiros.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Propriedade Intelectual</h2>
          <p>Todo o conteúdo, marcas, logos e softwares disponibilizados pela VirtuLearning são de nossa propriedade ou licenciados para nós. Você não recebe nenhum direito de propriedade sobre nossos serviços ao utilizá-los.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Limitação de Responsabilidade</h2>
          <p>A VirtuLearning não se responsabiliza por perdas, danos ou lucros cessantes decorrentes do uso ou da incapacidade de usar nossos serviços. A plataforma é fornecida "como está", sem garantias explícitas ou implícitas de qualquer natureza.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Modificações dos Termos</h2>
          <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas aos usuários. O uso contínuo da plataforma após as modificações constitui sua aceitação dos novos termos.</p>
        </section>
      </div>
    </div>
  );
};
