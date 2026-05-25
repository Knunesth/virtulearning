import { useState } from 'react';
import { CheckCircle, XCircle, ExternalLink, GraduationCap, Mail, Briefcase, Clock, ChevronDown, ChevronUp, Star, Loader2, AlertCircle } from 'lucide-react';
import { useApplications, useReviewApplication, type Application } from '../../hooks/useApplications';

const avatarColors = [
  'from-blue-500 to-blue-700',
  'from-purple-500 to-purple-700',
  'from-emerald-500 to-emerald-700',
  'from-orange-500 to-orange-700',
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000);
  if (diffH < 24) return `Hoje, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffH < 48) return `Ontem, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('pt-BR');
}

export const AdminApplications = () => {
  const { data: apps = [], isLoading, isError } = useApplications('pendente');
  const { data: allApps = [] } = useApplications();
  const review = useReviewApplication();

  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pending = apps.filter((a) => a.status === 'pendente');
  const approvedCount = allApps.filter((a) => a.status === 'aprovado').length;
  const rejectedCount = allApps.filter((a) => a.status === 'rejeitado').length;

  const handleApprove = (app: Application) => {
    review.mutate({ id: app.id, status: 'aprovado' });
  };

  const handleReject = (app: Application) => {
    if (!rejectReason.trim()) return;
    review.mutate({ id: app.id, status: 'rejeitado', motivo_rejeicao: rejectReason });
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Aprovações</h1>
          <p className="text-[#71717a] text-sm">Analise as candidaturas e decida quem pode lecionar.</p>
        </div>
        {pending.length > 0 && (
          <div className="flex items-center gap-2 bg-warning/10 border border-warning/20 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-warning shadow-[0_0_6px_rgba(234,179,8,0.8)] animate-pulse" />
            <span className="text-xs font-bold text-warning">
              {pending.length} {pending.length === 1 ? 'candidatura pendente' : 'candidaturas pendentes'}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Aguardando análise', value: pending.length, color: 'text-warning', bg: 'bg-warning/10 border-warning/20', icon: <Clock size={15} /> },
          { label: 'Aprovados', value: approvedCount, color: 'text-success', bg: 'bg-success/10 border-success/20', icon: <CheckCircle size={15} /> },
          { label: 'Rejeitados', value: rejectedCount, color: 'text-danger', bg: 'bg-danger/10 border-danger/20', icon: <XCircle size={15} /> },
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

      {/* Loading / Error */}
      {isLoading ? (
        <div className="py-16 flex justify-center items-center gap-3 text-muted">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Carregando candidaturas...</span>
        </div>
      ) : isError ? (
        <div className="py-16 flex justify-center items-center gap-3 text-danger">
          <AlertCircle size={20} />
          <span className="text-sm">Erro ao carregar candidaturas.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((app, idx) => {
            const isOpen = expanded === String(app.id);
            const gradColor = avatarColors[idx % avatarColors.length];

            return (
              <div
                key={app.id}
                className={`bg-[#121214] border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#3f3f46]' : 'border-[#27272a]'}`}
              >
                {/* Card Header */}
                <div
                  className="px-6 py-5 flex items-center gap-5 cursor-pointer hover:bg-[#18181b] transition-colors"
                  onClick={() => setExpanded(isOpen ? null : String(app.id))}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradColor} flex items-center justify-center text-white text-lg font-bold shadow-lg shrink-0`}>
                    {app.solicitante.nome.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-white">{app.solicitante.nome}</h3>
                      <span className="text-[10px] text-[#52525b]">•</span>
                      <span className="text-[10px] text-[#52525b]">{formatDate(app.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-[#71717a]">
                        <Briefcase size={11} /> {app.especialidade}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#71717a]">
                        <Star size={11} /> {app.anos_experiencia} {app.anos_experiencia === 1 ? 'ano' : 'anos'} de experiência
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#71717a]">
                        <Mail size={11} /> {app.solicitante.email}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setRejectingId(String(app.id))}
                      disabled={review.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger/10 border border-danger/20 text-danger hover:bg-danger hover:text-white text-xs font-bold transition-all disabled:opacity-40"
                    >
                      <XCircle size={13} /> Rejeitar
                    </button>
                    <button
                      onClick={() => handleApprove(app)}
                      disabled={review.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 text-success hover:bg-success hover:text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(34,197,94,0.1)] hover:shadow-[0_0_16px_rgba(34,197,94,0.3)] disabled:opacity-40"
                    >
                      {review.isPending ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />} Aprovar
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center text-[#52525b] hover:text-white transition-colors">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Reject reason modal inline */}
                {rejectingId === String(app.id) && (
                  <div className="border-t border-[#27272a] px-6 py-4 bg-danger/5">
                    <p className="text-xs font-bold text-danger mb-2">Motivo da rejeição (obrigatório)</p>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Explique o motivo para o candidato..."
                      className="w-full bg-[#09090b] border border-danger/30 rounded-lg p-3 text-sm text-white placeholder:text-muted resize-none h-20 focus:outline-none focus:border-danger"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleReject(app)}
                        disabled={!rejectReason.trim() || review.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-danger text-white text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-40"
                      >
                        Confirmar Rejeição
                      </button>
                      <button
                        onClick={() => { setRejectingId(null); setRejectReason(''); }}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-muted hover:text-white border border-border hover:border-white/20 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Expanded Detail */}
                {isOpen && (
                  <div className="border-t border-[#27272a] px-6 py-5 grid grid-cols-2 gap-8 bg-[#0d0d0f]">
                    <div>
                      <p className="text-[10px] font-bold text-[#52525b] uppercase tracking-widest mb-2">Sobre o Candidato</p>
                      <p className="text-sm text-[#a1a1aa] leading-relaxed">{app.bio}</p>
                      {app.linkedin_url && (
                        <a
                          href={app.linkedin_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-accent hover:text-yellow-400 transition-colors"
                        >
                          <ExternalLink size={13} /> Ver perfil no LinkedIn
                        </a>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#52525b] uppercase tracking-widest mb-2">Cursos que pretende oferecer</p>
                      {app.cursos_pretendidos ? (
                        <div className="flex flex-col gap-2">
                          {app.cursos_pretendidos.split(',').map((c, i) => (
                            <div key={i} className="flex items-center gap-2 bg-[#121214] border border-[#27272a] rounded-lg px-3 py-2">
                              <GraduationCap size={13} className="text-accent shrink-0" />
                              <span className="text-sm text-white">{c.trim()}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted">Não informado</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {pending.length === 0 && (
            <div className="bg-[#121214] border border-[#27272a] rounded-2xl py-16 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-success" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Tudo em dia!</h3>
              <p className="text-[#71717a] text-sm">Nenhuma candidatura pendente no momento.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
