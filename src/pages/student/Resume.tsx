import { useState } from 'react';
import { Download, Share2, Briefcase, GraduationCap, Code, Mail, Phone, MapPin, Link as LinkIcon, Globe } from 'lucide-react';

export const Resume = () => {
  const [data, setData] = useState({
    name: 'Kaua Nunes',
    role: 'Desenvolvedor Front-end Jr',
    email: 'kaua@exemplo.com',
    phone: '(11) 99999-9999',
    location: 'São Paulo, SP',
    linkedin: 'linkedin.com/in/kauanunes',
    github: 'github.com/kauanunes',
    about: 'Desenvolvedor apaixonado por criar interfaces modernas e acessíveis. Experiência em React, TypeScript e Tailwind CSS.',
    skills: 'React, TypeScript, Node.js, Tailwind, Git',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-10">
      
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meu Currículo</h1>
          <p className="text-muted">Personalize seu currículo com base nas suas conquistas e gere o PDF.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#121214] border border-[#27272a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#27272a] transition-colors">
            <Share2 size={16} /> Copiar Link Público
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-accentHover transition-colors shadow-md">
            <Download size={16} /> Exportar PDF
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Editor Form - Hidden when printing */}
        <div className="w-full lg:w-[400px] shrink-0 bg-card border border-border rounded-xl p-6 print:hidden">
          <h2 className="text-lg font-bold text-white mb-6">Informações Pessoais</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Nome Completo</label>
              <input type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Cargo Desejado</label>
              <input type="text" value={data.role} onChange={e => setData({...data, role: e.target.value})} className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">E-mail</label>
                <input type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Telefone</label>
                <input type="text" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Resumo (Bio)</label>
              <textarea rows={4} value={data.about} onChange={e => setData({...data, about: e.target.value})} className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none resize-none" />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Habilidades (separadas por vírgula)</label>
              <input type="text" value={data.skills} onChange={e => setData({...data, skills: e.target.value})} className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none" />
            </div>

            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg mt-6">
              <p className="text-xs text-accent font-medium mb-2">🚀 Cursos VirtuLearning</p>
              <p className="text-xs text-white/70">Seus cursos concluídos na plataforma são adicionados automaticamente ao seu currículo!</p>
            </div>
          </div>
        </div>

        {/* CV Preview (A4 format roughly) */}
        <div className="flex-1 overflow-x-auto pb-8 print:overflow-visible print:w-full print:m-0 print:p-0">
          {/* This wrapper ensures it looks like a paper on screen, but fills page on print */}
          <div className="bg-white min-w-[700px] max-w-[800px] mx-auto p-10 md:p-14 rounded-xl shadow-2xl text-slate-800 print:shadow-none print:w-full print:max-w-none print:m-0 print:rounded-none">
            
            <header className="border-b-2 border-slate-200 pb-6 mb-6">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">{data.name}</h1>
              <h2 className="text-xl font-medium text-yellow-600 mb-4">{data.role}</h2>
              
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5"><Mail size={14}/> {data.email}</div>
                <div className="flex items-center gap-1.5"><Phone size={14}/> {data.phone}</div>
                <div className="flex items-center gap-1.5"><MapPin size={14}/> {data.location}</div>
                <div className="flex items-center gap-1.5"><LinkIcon size={14}/> {data.linkedin}</div>
                <div className="flex items-center gap-1.5"><Globe size={14}/> {data.github}</div>
              </div>
            </header>

            <section className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-yellow-100 flex items-center justify-center text-yellow-600"><Briefcase size={14}/></div>
                Perfil Profissional
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">{data.about}</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-yellow-100 flex items-center justify-center text-yellow-600"><GraduationCap size={14}/></div>
                Educação & Cursos VirtuLearning
              </h3>
              <div className="space-y-4">
                <div className="relative pl-4 border-l-2 border-yellow-400">
                  <div className="absolute w-2.5 h-2.5 bg-yellow-400 rounded-full -left-[6px] top-1.5 ring-4 ring-white"></div>
                  <h4 className="font-bold text-slate-800">Bootcamp React Native do Zero ao Profissional</h4>
                  <p className="text-xs text-yellow-600 font-medium mb-1">VirtuLearning • Concluído em Maio/2026</p>
                  <p className="text-sm text-slate-600">Formação intensiva de 45h com foco em desenvolvimento de aplicativos móveis utilizando React Native, Expo e integração com APIs REST.</p>
                </div>
                <div className="relative pl-4 border-l-2 border-yellow-400">
                  <div className="absolute w-2.5 h-2.5 bg-yellow-400 rounded-full -left-[6px] top-1.5 ring-4 ring-white"></div>
                  <h4 className="font-bold text-slate-800">UX/UI Design: Criando Experiências</h4>
                  <p className="text-xs text-yellow-600 font-medium mb-1">VirtuLearning • Concluído em Fev/2026</p>
                  <p className="text-sm text-slate-600">Curso prático de 28h sobre usabilidade, criação de wireframes no Figma e prototipagem de alta fidelidade.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-yellow-100 flex items-center justify-center text-yellow-600"><Code size={14}/></div>
                Principais Habilidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.split(',').map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-bold text-slate-600">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </section>

          </div>
        </div>

      </div>

      {/* Global Print Styles inserted inline */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:visible, .print\\:visible * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          /* This selects the A4 div and brings it to top left */
          .print\\:overflow-visible > div {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
            width: 100%;
          }
          .print\\:overflow-visible > div * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
};
