import { useState } from 'react';
import { CheckCircle, XCircle, ExternalLink, GraduationCap, Mail, Briefcase, Clock, ChevronDown, ChevronUp, Star, Users } from 'lucide-react';

const MOCK_APPLICATIONS = [
  {
    id: '1',
    name: 'Ricardo Mendes',
    email: 'ricardo@email.com',
    expertise: 'Desenvolvimento Web',
    linkedin: 'linkedin.com/in/ricardo',
    bio: 'Desenvolvedor Full-Stack com 8 anos de experiência em React, Node.js e AWS. Formado pela USP, trabalhou em startups e grandes empresas do setor de tecnologia.',
    courses: ['React Avançado', 'Node.js para APIs REST', 'AWS para Devs'],
    experience: '8 anos',
    date: 'Hoje, 14:30',
    status: 'pendente',
  },
  {
    id: '2',
    name: 'Fernanda Lima',
    email: 'fernanda@email.com',
    expertise: 'UX/UI Design',
    linkedin: 'linkedin.com/in/fernanda',
    bio: 'Designer de produto com foco em research e prototipação. Já atuou em empresas como iFood e Nubank. Especialista em Figma e Design Systems.',
    courses: ['Figma do Zero ao Avançado', 'Design Systems na Prática'],
    experience: '6 anos',
    date: 'Ontem, 09:15',
    status: 'pendente',
  },
];

const avatarColors = [
  'from-blue-500 to-blue-700',
  'from-purple-500 to-purple-700',
  'from-emerald-500 to-emerald-700',
  'from-orange-500 to-orange-700',
];

export const AdminApplications = () => {
  const [apps, setApps] = useState(MOCK_APPLICATIONS);
  const [expanded, setExpanded] = useState<string | null>('1');
  const [processed, setProcessed] = useState<{ id: string; action: 'aprovado' | 'rejeitado' }[]>([]);

  const handleAction = (id: string, action: 'aprovado' | 'rejeitado') => {
    setProcessed(prev => [...prev, { id, action }]);
    setTimeout(() => setApps(prev => prev.filter(a => a.id !== id)), 600);
  };

  const pending = apps.length;

  return (
    <div className="animate-in fade-in duration-500 pb-20 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Aprovações</h1>
          <p className="text-[#71717a] text-sm">Analise as candidaturas e decida quem pode lecionar.</p>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-2 bg-warning/10 border border-warning/20 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-warning shadow-[0_0_6px_rgba(234,179,8,0.8)] animate-pulse"></div>
            <span className="text-xs font-bold text-warning">{pending} {pending === 1 ? 'candidatura pendente' : 'candidaturas pendentes'}</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Aguardando análise', value: pending, color: 'text-warning', bg: 'bg-warning/10 border-warning/20', icon: <Clock size={15}/> },
          { label: 'Aprovados este mês', value: 12, color: 'text-success', bg: 'bg-success/10 border-success/20', icon: <CheckCircle size={15}/> },
          { label: 'Rejeitados este mês', value: 3, color: 'text-danger', bg: 'bg-danger/10 border-danger/20', icon: <XCircle size={15}/> },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border ${s.bg}`}>
            <span className={s.color}>{s.icon}</span>
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-[#71717a]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Application Cards */}
      <div className="space-y-4">
        {apps.map((app, idx) => {
          const isOpen = expanded === app.id;
          const gradColor = avatarColors[idx % avatarColors.length];

          return (
            <div
              key={app.id}
              className={`bg-[#121214] border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#3f3f46]' : 'border-[#27272a]'}`}
            >
              {/* Card Header — always visible */}
              <div
                className="px-6 py-5 flex items-center gap-5 cursor-pointer hover:bg-[#18181b] transition-colors"
                onClick={() => setExpanded(isOpen ? null : app.id)}
              >
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradColor} flex items-center justify-center text-white text-lg font-bold shadow-lg shrink-0`}>
                  {app.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white">{app.name}</h3>
                    <span className="text-[10px] text-[#52525b]">•</span>
                    <span className="text-[10px] text-[#52525b]">{app.date}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-[#71717a]">
                      <Briefcase size={11} /> {app.expertise}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#71717a]">
                      <Star size={11} /> {app.experience} de experiência
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#71717a]">
                      <Mail size={11} /> {app.email}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => handleAction(app.id, 'rejeitado')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger/10 border border-danger/20 text-danger hover:bg-danger hover:text-white text-xs font-bold transition-all"
                  >
                    <XCircle size={13} /> Rejeitar
                  </button>
                  <button
                    onClick={() => handleAction(app.id, 'aprovado')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 text-success hover:bg-success hover:text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(34,197,94,0.1)] hover:shadow-[0_0_16px_rgba(34,197,94,0.3)]"
                  >
                    <CheckCircle size={13} /> Aprovar
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center text-[#52525b] hover:text-white transition-colors">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Expanded Detail */}
              {isOpen && (
                <div className="border-t border-[#27272a] px-6 py-5 grid grid-cols-2 gap-8 bg-[#0d0d0f]">
                  {/* Bio */}
                  <div>
                    <p className="text-[10px] font-bold text-[#52525b] uppercase tracking-widest mb-2">Sobre o Candidato</p>
                    <p className="text-sm text-[#a1a1aa] leading-relaxed">{app.bio}</p>

                    <a
                      href={`https://${app.linkedin}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-accent hover:text-yellow-400 transition-colors"
                    >
                      <ExternalLink size={13} /> Ver perfil no LinkedIn
                    </a>
                  </div>

                  {/* Courses */}
                  <div>
                    <p className="text-[10px] font-bold text-[#52525b] uppercase tracking-widest mb-2">Cursos que pretende oferecer</p>
                    <div className="flex flex-col gap-2">
                      {app.courses.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 bg-[#121214] border border-[#27272a] rounded-lg px-3 py-2">
                          <GraduationCap size={13} className="text-accent shrink-0" />
                          <span className="text-sm text-white">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {apps.length === 0 && (
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl py-16 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-success" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Tudo em dia!</h3>
            <p className="text-[#71717a] text-sm">Nenhuma candidatura pendente no momento.</p>
          </div>
        )}
      </div>

      {/* Processed History */}
      {processed.length > 0 && (
        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-5">
          <p className="text-[10px] font-bold text-[#52525b] uppercase tracking-widest mb-3">Processados agora</p>
          <div className="flex flex-col gap-2">
            {processed.map((p, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${p.action === 'aprovado' ? 'bg-success/5 text-success' : 'bg-danger/5 text-danger'}`}>
                {p.action === 'aprovado' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                Candidatura <strong>{p.id}</strong> foi <strong>{p.action}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
